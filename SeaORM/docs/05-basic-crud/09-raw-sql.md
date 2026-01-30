# Raw SQL

:::tip Since `2.0.0`

A new macro `raw_sql` is added, with many neat features to make writing raw SQL queries more ergononmic.

In particular, you can expand arrays with `({..ids})` into `(?, ?, ?)`.

Learn more in [SeaQuery just made writing raw SQL more enjoyable](https://www.sea-ql.org/blog/2025-08-15-sea-query-raw-sql/).

:::

## Find Model by raw SQL

```rust
let id = 1;

let cake: Option<cake::Model> = cake::Entity::find()
    .from_raw_sql(raw_sql!(
        Postgres,
        r#"SELECT "cake"."id", "cake"."name" FROM "cake" WHERE "id" = {id}"#
    ))
    .one(&db)
    .await?;
```

## Select into custom struct by raw SQL

Here nested select is also demonstrated.

```rust
#[derive(FromQueryResult)]
struct Cake {
    name: String,
    #[sea_orm(nested)]
    bakery: Option<Bakery>,
}

#[derive(FromQueryResult)]
struct Bakery {
    #[sea_orm(alias = "bakery_name")]
    name: String,
}

let cake_ids = [2, 3, 4];

let cake: Option<Cake> = Cake::find_by_statement(raw_sql!(
    Sqlite,
    r#"SELECT "cake"."name", "bakery"."name" AS "bakery_name"
       FROM "cake"
       LEFT JOIN "bakery" ON "cake"."bakery_id" = "bakery"."id"
       WHERE "cake"."id" IN ({..cake_ids})"#
))
.one(db)
.await?;
```

## Paginate raw SQL query

You can paginate [`SelectorRaw`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/struct.SelectorRaw.html) and fetch `Model` in batch.

```rust
let ids = vec![1, 2, 3, 4];

let mut cake_pages = cake::Entity::find()
    .from_raw_sql(raw_sql!(
        Postgres,
        r#"SELECT "cake"."id", "cake"."name" FROM "cake" WHERE "id" IN ({..ids})"#
    ))
    .paginate(db, 10);

while let Some(cakes) = cake_pages.fetch_and_next().await? {
    // Do something on cakes: Vec<cake::Model>
}
```

## Inspect raw SQL from queries

Use `build` and `to_string` methods on any CRUD operations to get the database-specific raw SQL for debugging purposes.

```rust
use sea_orm::{DbBackend, QueryTrait};

assert_eq!(
    cake_filling::Entity::find_by_id((6, 8))
        .build(DbBackend::MySql)
        .to_string(),
    [
        "SELECT `cake_filling`.`cake_id`, `cake_filling`.`filling_id` FROM `cake_filling`",
        "WHERE `cake_filling`.`cake_id` = 6 AND `cake_filling`.`filling_id` = 8",
    ].join(" ")
);
```

## Use Raw Query & Execute Interface

### Get Custom Result using `query_one` and `query_all` methods

```rust
let query_res: Option<QueryResult> = db
    .query_one_raw(Statement::from_string(
        DbBackend::MySql,
        "SELECT * FROM `cake`;",
    ))
    .await?;
let query_res = query_res.unwrap();
let id: i32 = query_res.try_get("", "id")?;

let query_res_vec: Vec<QueryResult> = db
    .query_all_raw(Statement::from_string(
        DbBackend::MySql,
        "SELECT * FROM `cake`;",
    ))
    .await?;
```

### Execute Query using `execute` method

```rust
let exec_res: ExecResult = db
    .execute_raw(Statement::from_string(
        DbBackend::MySql,
        "DROP DATABASE IF EXISTS `sea`;",
    ))
    .await?;
assert_eq!(exec_res.rows_affected(), 1);
```

## Execute Unprepared SQL Statement

You can execute an unprepared SQL statement with [`ConnectionTrait::execute_unprepared`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/trait.ConnectionTrait.html#tymethod.execute_unprepared).

```rust
let exec_res: ExecResult =
    db.execute_unprepared("CREATE EXTENSION IF NOT EXISTS citext").await?;
```
