# 高级连接

一个包含多个连接和自定义选择的复杂关系查询的剖析。

## 模式

假设我们有一个 `BaseProduct` -> `ComplexProduct`，`BaseProduct` -> `ProductTypes` 的模式设计。

#### `BaseProduct`

```rust
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq)]
#[sea_orm(table_name = "base_product")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i64,
    #[sea_orm(unique)]
    pub name: String,
    pub type_id: i32, // 链接到 product_type
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_one = "super::complex_product::Entity")]
    ComplexProduct,
    #[sea_orm(has_many = "super::product_history::Entity")]
    ProductHistory,
    #[sea_orm(
        belongs_to = "super::product_type::Entity",
        from = "Column::TypeId",
        to = "super::product_type::Column::Id",
        on_update = "NoAction",
        on_delete = "NoAction"
    )]
    ProductType,
}
```

#### `ComplexProduct`

```rust
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq)]
#[sea_orm(table_name = "complex_product")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub product_id: i64, // 链接到 base_product
    #[sea_orm(column_type = "Decimal(Some((30, 15)))", nullable)]
    pub price: Option<Decimal>,
    #[sea_orm(column_type = "Decimal(Some((30, 15)))", nullable)]
    pub lot_size: Option<Decimal>,
    pub date_added: DateTime,
    pub last_modified: DateTime,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::base_product::Entity",
        from = "Column::ProductId",
        to = "super::base_product::Column::Id",
        on_update = "NoAction",
        on_delete = "Cascade"
    )]
    BaseProduct,
}
```

#### `ProductType`

基本上是一个“枚举表”。

```rust
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq)]
#[sea_orm(table_name = "product_type")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    #[sea_orm(unique)]
    pub name: String,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_many = "super::base_product::Entity")]
    BaseProduct,
}
```

## 1. 定义结果数据结构

```rust
#[derive(Clone, Debug, PartialEq, Eq, FromQueryResult, Serialize)]
pub struct ComplexProduct {
    pub id: i64,
    pub name: String,
    pub r#type: String,
    pub price: Decimal,
    pub lot_size: Decimal,
    pub date_added: DateTime,
    pub last_modified: DateTime,
    #[sea_orm(skip)]
    pub history: Vec<product_history::Model>,
}
```

使用 `Serialize`，你可以直接将选择结果转换为 JSON。

## 2. 定义辅助别名

```rust
#[derive(DeriveIden, Clone, Copy)]
pub struct Id;

#[derive(DeriveIden, Clone, Copy)]
pub struct Name;

#[derive(DeriveIden, Clone, Copy)]
pub struct Base;

use complex_product::Entity as Prod;
pub type ProdCol = <Prod as EntityTrait>::Column;
type ProdRel = <Prod as EntityTrait>::Relation;
```

这将使我们的代码更加简洁和可读。

避免使用字符串字面量，因为它容易出错。

:::tip

如果你需要使用许多别名，可以定义一个枚举：

```rust
#[derive(DeriveIden, Clone, Copy)]
pub enum Prod {
    Base,
    Frame,
    Package,
}
```

:::

## 3. 自定义选择

```rust
pub fn query() -> Select<complex_product::Entity> {
    complex_product::Entity::find()
        .select_only()
        .tbl_col_as((Base, Id), "id")
        .tbl_col_as((Base, Name), "name")
        .column_as(product_type::Column::Name, "type")
        .column_as(ProdCol::Price, "price")
        .column_as(ProdCol::LotSize, "lot_size")
        .column_as(ProdCol::DateAdded, "date_added")
        .column_as(ProdCol::LastModified, "last_modified")
        .join_as(JoinType::InnerJoin, ProdRel::BaseProduct.def(), Base)
        .join(JoinType::InnerJoin, base_product::Relation::ProductType.def().from_alias(Base))
        .order_by_asc(Expr::col((Base, Id)))
}
```

我们的查询从 `ComplexProduct` 开始。我们连接回 `BaseProduct`，并将其别名为 `Base`。然后我们通过 `Base` 连接到 `ProductType`。

```
ComplexProduct -> BaseProduct as Base -> ProductType
```

:::tip

可以以菱形拓扑结构进行连接：

```
ComplexProduct -> BaseProduct -> Attribute
               -> Material    -> Attribute
```

```rust
.join_as(JoinType::LeftJoin, complex_product::Relation::BaseProduct.def(), Base)
.join_as(JoinType::LeftJoin, complex_product::Relation::Material.def(), Material)
.join(JoinType::InnerJoin, base_product::Relation::Attribute.def().from_alias(Base))
.join(JoinType::InnerJoin, material::Relation::Attribute.def().from_alias(Material))
```

:::

### 自定义连接条件

你可以使用 `join` 方法在选择查询中构建复杂的连接。它接受任何 `RelationDef`，并且你可以进一步自定义连接条件。下面是一个示例（尽管它来自 Bakery 模式）：

```rust
use sea_orm::{JoinType, RelationTrait};
use sea_query::Expr;

assert_eq!(
    cake::Entity::find()
        .column_as(filling::Column::Id.count(), "count")
        .column_as(
            Expr::col(("fruit_alias", fruit::Column::Name)).into_simple_expr(),
            "fruit_name"
        )
        // 动态构建 `RelationDef`
        .join_rev(
            JoinType::InnerJoin,
            cake_filling::Entity::belongs_to(cake::Entity)
                .from(cake_filling::Column::CakeId)
                .to(cake::Column::Id)
                .into()
        )
        // 重用现有实体的 `Relation`
        .join(JoinType::InnerJoin, cake_filling::Relation::Filling.def())
        // 使用表别名和自定义条件进行连接
        .join_as(
            JoinType::LeftJoin,
            cake::Relation::Fruit
                .def()
                .on_condition(|_left, right| {
                    Expr::col((right, fruit::Column::Name))
                        .like("%tropical%")
                        .into_condition()
                }),
            "fruit_alias"
        )
        .group_by(cake::Column::Id)
        .having(filling::Column::Id.count().equals(Expr::value(2)))
        .build(DbBackend::MySql)
        .to_string(),
    [
        "SELECT `cake`.`id`, `cake`.`name`, COUNT(`filling`.`id`) AS `count`, `fruit_alias`.`name` AS `fruit_name` FROM `cake`",
        "INNER JOIN `cake_filling` ON `cake_filling`.`cake_id` = `cake`.`id`",
        "INNER JOIN `filling` ON `cake_filling`.`filling_id` = `filling`.`id`",
        "LEFT JOIN `fruit` AS `fruit_alias` ON `cake`.`id` = `fruit_alias`.`cake_id` AND `fruit_alias`.`name` LIKE '%tropical%'",
        "GROUP BY `cake`.`id`",
        "HAVING COUNT(`filling`.`id`) = 2",
    ]
    .join(" ")
);
```

## 4. 过滤条件

假设我们在 API 上支持以下查询参数：

```rust

#[derive(Default, Deserialize)]
pub struct Query {
    #[serde(default)]
    pub id: Vec<i64>,
    pub name: Option<String>,
}
```

```rust
fn condition(query: Query) -> Condition {
    Condition::all()
        .add_option(if !query.id.is_empty() {
            Some(Expr::col((Base, Id)).is_in(query.id))
        } else { None })
        .add_option(if let Some(name) = &query.name {
            Some(Expr::col((Base, Name)).like(name))
        } else { None })
}
```

额外提示：如果你只使用 Postgres，可以将 `is_in` 替换为 `any`：

```rust
use sea_orm::sea_query::extension::postgres::PgFunc;

Expr::col((Base, Id)).eq(PgFunc::any(query.id)) // WHERE base.id = ANY($N)
```

```rust
let products = query()
    .filter(condition(q))
    .into_model::<ComplexProduct>()
    .all(db)
    .await?;
```

## 5. 额外：关联模型

现在，假设我们有一个与每个 `BaseProduct` 关联的数据结构，用于记录其历史：

#### `ProductHistory`

```rust
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize)]
#[sea_orm(table_name = "product_history")]
pub struct Model {
    #[sea_orm(primary_key)]
    #[serde(skip)]
    pub id: i32,
    pub product_id: i64,
    pub from: DateTime,
    pub until: DateTime,
    pub name: Option<String>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::base_product::Entity",
        from = "Column::ProductId",
        to = "super::base_product::Column::Id",
        on_update = "NoAction",
        on_delete = "Cascade"
    )]
    BaseProduct,
}
```

让我们创建一个辅助函数来查询与一组产品关联的历史记录：

```rust
pub fn history_of(ids: Vec<i64>) -> Select<product_history::Entity> {
    product_history::Entity::find()
        .filter(Expr::col(product_history::Column::ProductId).is_in(ids))
        .order_by_asc(product_history::Column::Id)
}

let histories = history_of(products.iter().map(|s| s.id).collect::<Vec<_>>())
    .all(db)
    .await?;
```

最后一步是将 `product_history::Model` 与 `ComplexProduct` 关联：

```rust
pub fn associate(
    mut parent: Vec<ComplexProduct>,
    children: Vec<product_history::Model>,
) -> Vec<ComplexProduct> {
    let len = parent.len();
    parent.dedup_by_key(|s| s.id);
    if len != parent.len() {
        warn!("parent is not unique.");
    }

    let parent_id_map: HashMap<i64, usize> = parent
        .iter()
        .enumerate()
        .map(|(i, s)| (s.id, i))
        .collect();

    // 将子项放入关联的父项中
    for item in children {
        if let Some(index) = parent_id_map.get(&item.product_id) {
            parent[*index].history.push(item);
        }
    }

    parent
}

let products = associate(products, histories);
```

这有时被称为“数据加载器”模式，并且可以通过泛型进行推广以适用于任何模型。
