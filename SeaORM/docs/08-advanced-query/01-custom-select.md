# Custom Select

By default, SeaORM will select all columns defined in the `Column` enum. You can override the defaults if you wish to select certain columns only.

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

Use `select_only` and `column` methods together to select only the attribute you want.

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

If you want to select multiple attributes at once.

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

Conditionally select all columns expect a specific column.

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

## Handling Custom Selects

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

Selecting a single value without a custom `struct` is also possible.

```rust
use sea_orm::{entity::*, query::*, tests_cfg::cake, DeriveColumn, EnumIter};

#[derive(Copy, Clone, Debug, EnumIter, DeriveColumn)]
enum QueryAs {
    CakeName,
}

let res: Vec<String> = cake::Entity::find()
    .select_only()
    .column_as(cake::Column::Name, QueryAs::CakeName)
    .into_values::<_, QueryAs>()
    .all(&db)
    .await?;

assert_eq!(
    res,
    ["Chocolate Forest".to_owned(), "New York Cheese".to_owned()]
);
```

### Select a Tuple Value

You can even select a tuple value with the `into_values` method but you need to supply an enum type.

```rust
use sea_orm::{entity::*, query::*, tests_cfg::cake, DeriveColumn, EnumIter};

#[derive(Copy, Clone, Debug, EnumIter, DeriveColumn)]
enum QueryAs {
    CakeName,
    NumOfCakes,
}

let res: Vec<(String, i64)> = cake::Entity::find()
    .select_only()
    .column_as(cake::Column::Name, QueryAs::CakeName)
    .column_as(cake::Column::Id.count(), QueryAs::NumOfCakes)
    .group_by(cake::Column::Name)
    .into_values::<_, QueryAs>()
    .all(&db)
    .await?;

assert_eq!(res, [("Chocolate Forest".to_owned(), 2i64)]);
```

Instead, the `into_tuple` method can be used to fetch the tuple value.

```rust
let res: Vec<(String, i64)> = cake::Entity::find()
    .select_only()
    .column_as(cake::Column::Name, QueryAs::CakeName)
    .column_as(cake::Column::Id.count(), QueryAs::NumOfCakes)
    .group_by(cake::Column::Name)
    .into_tuple()
    .all(&db)
    .await?;
```

## Appling an Operation if Value Exists

Apply an operation on the [QueryTrait::QueryStatement](https://docs.rs/sea-orm/*/sea_orm/query/trait.QueryTrait.html#associatedtype.QueryStatement) if the given `Option<T>` is `Some(_)`.

```rust
use sea_orm::{entity::*, query::*, tests_cfg::cake, DbBackend};

assert_eq!(
    cake::Entity::find()
        .apply_if(Some(3), |mut query, v| {
            query.filter(cake::Column::Id.eq(v))
        })
        .apply_if(Some(100), QuerySelect::limit)
        .apply_if(None, QuerySelect::offset::<Option<u64>>) // no-op
        .build(DbBackend::Postgres)
        .to_string(),
    r#"SELECT "cake"."id", "cake"."name" FROM "cake" WHERE "cake"."id" = 3 LIMIT 100"#
);
```
