# Advanced Joins

An anatomy of a complex relational query with multiple joins and custom selects.

## Background

Suppose we have a schema design of `BaseProduct` -> `ComplexProduct`, `BaseProduct` -> `ProductTypes`.

#### `BaseProduct`

```rust
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq)]
#[sea_orm(table_name = "base_product")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i64,
    #[sea_orm(unique)]
    pub name: String,
    pub type_id: i32, // linking to product_type
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
    pub product_id: i64, // linking to base_product
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

Basically a 'enum table'.

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

## 1. Define result data structure

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

With `Serialize`, you can transform the select result into JSON directly!

## 2. Define helper aliases

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

This would make our code much more concise and readable.

Avoid using `Alias::new` because it's error-prone and slightly more expensive.

## 3. Custom selects

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

Our query starts from `ComplexProduct`. We join back to `BaseProduct`, alias it as `Base`. We then join to `ProductType` via `Base`.

### Custom join conditions

You can use the `join` method to construct complex joins in select queries. It takes any `RelationDef`, and you can further customize the join conditions. Below is an illustration (albeit it's from the Bakery schema):

```rust
use sea_orm::{JoinType, RelationTrait};
use sea_query::Expr;

assert_eq!(
    cake::Entity::find()
        .column_as(filling::Column::Id.count(), "count")
        .column_as(
            Expr::col((Alias::new("fruit_alias"), fruit::Column::Name)).into_simple_expr(),
            "fruit_name"
        )
        // construct `RelationDef` on the fly
        .join_rev(
            JoinType::InnerJoin,
            cake_filling::Entity::belongs_to(cake::Entity)
                .from(cake_filling::Column::CakeId)
                .to(cake::Column::Id)
                .into()
        )
        // reuse a `Relation` from existing Entity
        .join(JoinType::InnerJoin, cake_filling::Relation::Filling.def())
        // join with table alias and custom on condition
        .join_as(
            JoinType::LeftJoin,
            cake::Relation::Fruit
                .def()
                .on_condition(|_left, right| {
                    Expr::col((right, fruit::Column::Name))
                        .like("%tropical%")
                        .into_condition()
                }),
            Alias::new("fruit_alias")
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

## 4. Filter Conditions

Suppose we support the following query parameters on the API:

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

Bonus tip: if you're only using Postgres you can replace `is_in` with `any`:

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

## 5. Extra: associated models

Now, suppose we have a data structure associated with each `BaseProduct` recording its history:

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

Let's make a helper function to query the histories associated to a set of products:

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

The final step is to associate `product_history::Model` to `ComplexProduct`:

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

    // put children into associated parent
    for item in children {
        if let Some(index) = parent_id_map.get(&item.product_id) {
            parent[*index].history.push(item);
        }
    }

    parent
}

let products = associate(products, histories);
```

This is sometimes called "data loader" pattern, and can be tailoured to fit your schema and needs.

## Conclusion

SeaORM's type system encourages you to write modular and reusable code, embracing the "Don't repeat yourself" principle.

You define the Entities and Relations once.

You define the Aliases and query helpers once.

You can pass the `Select<T>` and `Condition` around.

You then assemble these pieces together to implement any complex API!