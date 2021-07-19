# Raw SQL & JSON

## Query by raw SQL

You can select `Model` from raw query, with appropriate syntax for binding parameters, i.e. `?` for MySQL and SQLite, and `$N` for Postgres.

```rust
let cheese: Option<cake::Model> = cake::Entity::find().from_raw_sql(
    Statement::from_sql_and_values(
        DbBackend::Postgres, r#"SELECT "cake"."id", "cake"."name" FROM "cake" WHERE "id" = $1"#, vec![1.into()]
    )
).one(&db).await?;
```

## Get raw SQL query

Use `build` and `to_string` methods on any CRUD operations to get the database specific raw SQL for debugging purpose.

```rust
use sea_orm::DatabaseBackend;

assert_eq!(
    cake_filling::Entity::find_by_id((6, 8))
        .build(DatabaseBackend::MySql)
        .to_string(),
    vec![
        "SELECT `cake_filling`.`cake_id`, `cake_filling`.`filling_id` FROM `cake_filling`",
        "WHERE `cake_filling`.`cake_id` = 6 AND `cake_filling`.`filling_id` = 8",
    ].join(" ")
);
```

## Select JSON Result

All SeaORM selects are capable of returning `serde_json::Value`.

```rust
// Find by id
let _: Option<serde_json::Value> = Cake::find_by_id(1)
    .into_json()
    .one(db)
    .await?;

// Find with filter
let _: Vec<serde_json::Value> = Cake::find()
    .filter(cake::Column::Name.contains("chocolate"))
    .order_by_asc(cake::Column::Name)
    .into_json()
    .all(db)
    .await?;

// Paginate json result
let _: Paginator<_> = Cake::find()
    .filter(cake::Column::Name.contains("chocolate"))
    .order_by_asc(cake::Column::Name)
    .into_json()
    .paginate(db, 50);
```
