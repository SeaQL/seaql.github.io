# Using SQLite

If you want to unit test application logic that does not require database-specific features, SQLite will be a good choice for you.

> Check out the full demo [here](https://github.com/SeaQL/sea-orm/blob/master/tests/basic.rs).

## Running Unit Test

By default Rust run all tests in parallel and each test should be independent of other, so if we need a single entry point for it to perform sequential operations. Then, we have the following code snippet connecting to database, setting up database schema and performing tests in sequence.

```rust
async fn main() -> Result<(), DbErr> {
    // Connecting SQLite
    let db = Database::connect("sqlite::memory:").await?;

    // Setup database schema
    setup_schema(&db).await?;

    // Performing tests
    testcase(&db).await?;

    Ok(())
}
```

## Setup database schema

To create tables in SQLite database for testing, instead of writing [`TableCreateStatement`](https://docs.rs/sea-query/*/sea_query/table/struct.TableCreateStatement.html) manually, you can derive it from `Entity` using [`Schema::create_table_from_entity`](https://docs.rs/sea-orm/0.*/sea_orm/schema/struct.Schema.html#method.create_table_from_entity).

```rust
async fn setup_schema(db: &DbConn) {

    // Derive from Entity
    let stmt: TableCreateStatement = Schema::create_table_from_entity(MyEntity);

    // Or setup manually
    assert_eq!(
        stmt.build(SqliteQueryBuilder),
        Table::create()
            .table(MyEntity)
            .col(
                ColumnDef::new(MyEntity::Column::Id)
                    .integer()
                    .not_null()
            )
            //...
            .build(SqliteQueryBuilder)
    );

    // Execute create table statement
    let result = db
        .execute(Statement::from_string(DbBackend::Sqlite, stmt))
        .await;
}
```

## Performing tests

Execute testcases and assert against the results.

```rust
async fn testcase(db: &DbConn) -> Result<(), DbErr> {

    let baker_bob = baker::ActiveModel {
        name: Set("Baker Bob".to_owned()),
        contact_details: Set(serde_json::json!({
            "mobile": "+61424000000",
            "home": "0395555555",
            "address": "12 Test St, Testville, Vic, Australia"
        })),
        bakery_id: Set(Some(bakery_insert_res.last_insert_id as i32)),
        ..Default::default()
    };

    let baker_insert_res = Baker::insert(baker_bob)
        .exec(db)
        .await
        .expect("could not insert baker");

    assert_eq!(baker_insert_res.last_insert_id, 1);

    Ok(())
}
```
