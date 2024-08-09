# Custom Select

:::caution We need your support! ⭐
Thank you for using SeaORM. Please star our [GitHub repo](https://github.com/SeaQL/sea-orm)! Your support is vital to the continued development and maintenance of SeaORM.
:::

By default, SeaORM will select all columns defined in the `Column` enum. You can override the defaults if you wish to select certain columns only.

```rust
// Selecting all columns
assert_eq!(
    cake::Entity::find()
        .build(DbBackend::Postgres)
        .to_string(),
    r#"SELECT "cake"."id", "cake"."name" FROM "cake""#
);
```

## Select Partial Attributes

Clear the default selection by calling the `select_only` method. Then, you can select some of the attributes or custom expressions afterwards.

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

If you want to select multiple attributes at once, you can supply an array.

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

Advanced example: conditionally select all columns except a specific column.

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

### Optional fields

Since 0.12, SeaORM supports for partial select of `Option<T>` model field. A `None` value will be filled when the select result does not contain the `Option<T>` field without throwing an error.

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

## Select Custom Expressions

Select any custom expression with `column_as` / `expr_as` method, it takes any [`sea_query::SimpleExpr`](https://docs.rs/sea-query/*/sea_query/expr/enum.SimpleExpr.html) and an alias. Use [`sea_query::Expr`](https://docs.rs/sea-query/*/sea_query/expr/struct.Expr.html) helper to build `SimpleExpr`.

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

## Handling Select Results

### Custom Struct

You can use a custom `struct` derived from the `FromQueryResult` trait to handle the result of a complex query. It is especially useful when dealing with custom columns or multiple joins which cannot directly be converted into models. It may be used to receive the result of any query, even raw SQL.

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

### Unstructured Tuple

You can select a tuple (or single value) with the `into_tuple` method.

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

## Select Partial Model

In `0.12`, we introduced a new trait `PartialModelTrait` and pairing macro `DerivePartialModel` for improving the ergonomic of custom selects.

Instead of:

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

You can define a partial model, and the corresponding columns will be automatically selected:

```rust
#[derive(DerivePartialModel, FromQueryResult)]
#[sea_orm(entity = "User")]
struct PartialUser {
    pub id: i32,
    pub avatar: String,
    pub unique_id: Uuid,
}

let query = User::find().into_partial_model::<PartialUser>();
```

:::tip Since `1.0.0-rc.2`
`DerivePartialModel` macro attribute `entity` supports complex types
```rust
#[sea_orm(entity = "<entity::Model as ModelTrait>::Entity")]
struct PartialUser {
    ..
}
```
:::

Advanced usages include column remap and custom expression:

```rust
#[derive(DerivePartialModel, FromQueryResult)]
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