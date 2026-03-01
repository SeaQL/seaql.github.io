# 自定义查询

:::caution 我们需要您的支持！⭐
感谢使用 SeaORM。请为我们的 [GitHub 仓库](https://github.com/SeaQL/sea-orm) 加星！
:::

默认情况下，SeaORM 会选择 `Column` 枚举中定义的所有列。若你只想选择某些列，可以覆盖默认行为。

```rust
// Selecting all columns
assert_eq!(
    cake::Entity::find()
        .build(DbBackend::Postgres)
        .to_string(),
    r#"SELECT "cake"."id", "cake"."name" FROM "cake""#
);
```

## 选择部分属性

通过调用 `select_only` 方法清除默认选择。然后，你可以选择部分属性或自定义表达式。

```rust
// Selecting the name column only
assert_eq!(
    cake::Entity::find()
        .select_only()
        .column(cake::Column::Name)
        .build(DbBackend::Postgres)
        .to_string(),
    r#"SELECT "cake"."name" FROM "cake""#
);
```

若要一次性选择多个属性，可以传入数组。

```rust
assert_eq!(
    cake::Entity::find()
        .select_only()
        .columns([cake::Column::Id, cake::Column::Name])
        .build(DbBackend::Postgres)
        .to_string(),
    r#"SELECT "cake"."id", "cake"."name" FROM "cake""#
);
```

进阶示例：按条件选择除某列外的所有列。

```rust
assert_eq!(
    cake::Entity::find()
        .select_only()
        .columns(cake::Column::iter().filter(|col| match col {
            cake::Column::Id => false,
            _ => true,
        }))
        .build(DbBackend::Postgres)
        .to_string(),
    r#"SELECT "cake"."name" FROM "cake""#
);
```

### 可选字段

自 0.12 起，SeaORM 支持对 `Option<T>` 模型字段进行部分选择。当选择结果不包含 `Option<T>` 字段时，会填充为 `None`，而不会抛出错误。

```rust
customer::ActiveModel {
    name: Set("Alice".to_owned()),
    notes: Set(Some("Want to communicate with Bob".to_owned())),
    ..Default::default()
}
.save(db)
.await?;

// The `notes` field was intentionally left out
let customer = Customer::find()
    .select_only()
    .column(customer::Column::Id)
    .column(customer::Column::Name)
    .one(db)
    .await
    .unwrap();

// The select result does not contain `notes` field.
// Since it's of type `Option<String>`, it'll be `None` and no error will be thrown.
assert_eq!(customers.notes, None);
```

## 选择自定义表达式

使用 `column_as` / `expr_as` 方法选择任意自定义表达式，它接受任意 [`sea_query::SimpleExpr`](https://docs.rs/sea-query/*/sea_query/expr/enum.SimpleExpr.html) 和别名。使用 [`sea_query::Expr`](https://docs.rs/sea-query/*/sea_query/expr/struct.Expr.html) 辅助函数构建 `SimpleExpr`。

```rust
use sea_query::{Alias, Expr, Func};

assert_eq!(
    cake::Entity::find()
        .column_as(Expr::col(cake::Column::Id).max().sub(Expr::col(cake::Column::Id)), "id_diff")
        .column_as(Expr::cust("CURRENT_TIMESTAMP"), "current_time")
        .build(DbBackend::Postgres)
        .to_string(),
    r#"SELECT "cake"."id", "cake"."name", MAX("id") - "id" AS "id_diff", CURRENT_TIMESTAMP AS "current_time" FROM "cake""#
);

assert_eq!(
    cake::Entity::find()
        .expr_as(Func::upper(Expr::col((cake::Entity, cake::Column::Name))), "name_upper")
        .build(DbBackend::MySql)
        .to_string(),
    "SELECT `cake`.`id`, `cake`.`name`, UPPER(`cake`.`name`) AS `name_upper` FROM `cake`"
);
```

## 处理查询结果

### 自定义结构体

你可以使用派生自 `FromQueryResult` 特征的自定义 `struct` 来处理复杂查询的结果。在处理无法直接转换为模型的自定义列或多表 join 时尤其有用。它可用于接收任意查询的结果，包括原生 SQL。

```rust
use sea_orm::{FromQueryResult, JoinType, RelationTrait};
use sea_query::Expr;

#[derive(FromQueryResult)]
struct CakeAndFillingCount {
    id: i32,
    name: String,
    count: i32,
}

let cake_counts: Vec<CakeAndFillingCount> = cake::Entity::find()
    .column_as(filling::Column::Id.count(), "count")
    .join_rev(
        // construct `RelationDef` on the fly
        JoinType::InnerJoin,
        cake_filling::Entity::belongs_to(cake::Entity)
            .from(cake_filling::Column::CakeId)
            .to(cake::Column::Id)
            .into()
    )
    // reuse a `Relation` from existing Entity
    .join(JoinType::InnerJoin, cake_filling::Relation::Filling.def())
    .group_by(cake::Column::Id)
    .into_model::<CakeAndFillingCount>()
    .all(db)
    .await?;
```

### 非结构化元组

你可以使用 `into_tuple` 方法选择元组（或单个值）。

```rust
use sea_orm::{entity::*, query::*, tests_cfg::cake, DeriveColumn, EnumIter};

let res: Vec<(String, i64)> = cake::Entity::find()
    .select_only()
    .column(cake::Column::Name)
    .column(cake::Column::Id.count())
    .group_by(cake::Column::Name)
    .into_tuple()
    .all(&db)
    .await?;
```

## 选择部分 Model

在 `0.12` 中，我们引入了新特征 `PartialModelTrait` 和配套宏 `DerivePartialModel`，以改善自定义选择的易用性。

替代以下写法：

```rust
use user::Entity as User;

#[derive(FromQueryResult)]
struct PartialUser {
    pub id: i32,
    pub avatar: String,
    pub unique_id: Uuid,
}

let query = User::find()
    .select_only()
    .column(Column::Id)
    .column(Column::Avatar)
    .column(Column::UniqueId)
    .into_model::<PartialUser>();
```

你可以定义 partial model，对应列将自动被选择：

```rust
#[derive(DerivePartialModel)]
#[sea_orm(entity = "User")]
struct PartialUser {
    pub id: i32,
    pub avatar: String,
    pub unique_id: Uuid,
}

let query = User::find().into_partial_model::<PartialUser>();
```

:::tip 自 `1.0.0` 起
`DerivePartialModel` 宏属性 `entity` 支持复杂类型
```rust
#[sea_orm(entity = "<entity::Model as ModelTrait>::Entity")]
struct PartialUser {
    ..
}
```
:::

进阶用法包括列重映射和自定义表达式：

```rust
#[derive(DerivePartialModel)]
#[sea_orm(entity = "User")]
struct PartialRow {
    #[sea_orm(from_col = "id")]
    user_id: i32,
    #[sea_orm(from_expr = "Expr::col(user::Column::Id).add(1)")]
    next_id: i32,
}

// The above is equivalent to:
User::find()
    .column_as(user::Column::Id, "user_id")
    .column_as(Expr::col(user::Column::Id).add(1), "next_id")
```

### 嵌套部分 Model

`DerivePartialModel` 支持 `#[sea_orm(nested)]`，可在 join 中组合 partial model，并自动进行列别名。完整文档（包括别名、Linked 关联、三路 join 和替代结果形状）请参阅 [嵌套选择](../06-relation/09-nested-selects.md)。