# Raw SQL

## Query by raw SQL

You can select `Model` from raw query, with appropriate syntax for binding parameters, i.e. `?` for MySQL and SQLite, and `$N` for PostgreSQL.

```rust
let cheese: Option<cake::Model> = cake::Entity::find()
    .from_raw_sql(Statement::from_sql_and_values(
        DbBackend::Postgres,
        r#"SELECT "cake"."id", "cake"."name" FROM "cake" WHERE "id" = $1"#,
        vec![1.into()],
    ))
    .one(&db)
    .await?;
```

You can also select a custom model. Here, we select all unique names from cake.

```rust
#[derive(Debug, FromQueryResult)]
pub struct UniqueCake {
    name: String,
}

let unique: Vec<UniqueCake> = UniqueCake::find_by_statement(Statement::from_sql_and_values(
        DbBackend::Postgres,
        r#"SELECT "cake"."name" FROM "cake" GROUP BY "cake"."name"#,
        vec![],
    ))
    .all(&db)
    .await?;
```

You can paginate [`SelectorRaw`](https://docs.rs/sea-orm/0.7/sea_orm/struct.SelectorRaw.html) and fetch `Model` in batch.

```rust
let mut cake_pages = cake::Entity::find()
    .from_raw_sql(Statement::from_sql_and_values(
        DbBackend::Postgres,
        r#"SELECT "cake"."id", "cake"."name" FROM "cake" WHERE "id" = $1"#,
        vec![1.into()],
    ))
    .paginate(db, 50);
 
while let Some(cakes) = cake_pages.fetch_and_next().await? {
    // Do something on cakes: Vec<cake::Model>
}
```

## Get raw SQL query

Use `build` and `to_string` methods on any CRUD operations to get the database-specific raw SQL for debugging purposes.

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

## Use Raw Query & Execute Interface

You can build SQL statements using `sea-query` and query / execute it directly on the `DatabaseConnection` interface inside SeaORM.

### Get Custom Result using `query_one` and `query_all` methods

```rust
let query_res: Option<QueryResult> = db
    .query_one(Statement::from_string(
        DatabaseBackend::MySql,
        "SELECT * FROM `cake`;".to_owned(),
    ))
    .await?;
let query_res = query_res.unwrap();
let id: i32 = query_res.try_get("", "id")?;

let query_res_vec: Vec<QueryResult> = db
    .query_all(Statement::from_string(
        DatabaseBackend::MySql,
        "SELECT * FROM `cake`;".to_owned(),
    ))
    .await?;
```

### Execute Query using `execute` method

```rust
let exec_res: ExecResult = db
    .execute(Statement::from_string(
        DatabaseBackend::MySql,
        "DROP DATABASE IF EXISTS `sea`;".to_owned(),
    ))
    .await?;
assert_eq!(exec_res.rows_affected(), 1);
```
