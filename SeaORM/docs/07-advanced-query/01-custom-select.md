# Custom Select

By default SeaORM will select all columns defined in the `Column` enum. You can override the defaults if you wish to do so.

## Clear Default Selection

Clear the default selection by calling the `select_only` method if needed. Then, you can select some of the attributes or even custom expressions after it.

```rust
// Selecting all columns
assert_eq!(
    cake::Entity::find()
        .build(DbBackend::Postgres)
        .to_string(),
    r#"SELECT "cake"."id", "cake"."name" FROM "cake""#
);
```

## Select Some Attributes Only

Use `select_only` and `column` methods together to select only the attributes you want.

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

## Select Custom Expressions

Select any custom expression with `column_as` method, it takes any [`sea_query::SimpleExpr`](https://docs.rs/sea-query/*/sea_query/expr/enum.SimpleExpr.html) and an alias. Use [`sea_query::Expr`](https://docs.rs/sea-query/*/sea_query/expr/struct.Expr.html) helper to build `SimpleExpr`.

```rust
use sea_query::{Alias, Expr};

assert_eq!(
    cake::Entity::find()
        .column_as(Expr::col(cake::Column::Id).max().sub(Expr::col(cake::Column::Id)), "id_diff")
        .column_as(Expr::cust("CURRENT_TIMESTAMP"), "current_time")
        .build(DbBackend::Postgres)
        .to_string(),
    r#"SELECT "cake"."id", "cake"."name", MAX("id") - "id" AS "id_diff", CURRENT_TIMESTAMP AS "current_time" FROM "cake""#
);
```
