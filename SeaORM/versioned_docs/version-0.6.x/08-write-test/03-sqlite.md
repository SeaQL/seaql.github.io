# Using SQLite

If you want to test application logic that does not require database-specific features, SQLite will be a good choice for you.

Check out a simple example [here](https://github.com/SeaQL/sea-orm/blob/master/tests/basic.rs).

## Integration Test

It is recommended to execute more complex test cases in [integration tests](https://doc.rust-lang.org/rust-by-example/testing/integration_testing.html). The following code snippet illustrates the steps of connecting to a database, setting up schema and performing tests.

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

To create tables in SQLite database for testing, instead of writing [`TableCreateStatement`](https://docs.rs/sea-query/*/sea_query/table/struct.TableCreateStatement.html) manually, you can derive it from `Entity` using [`Schema::create_table_from_entity`](https://docs.rs/sea-orm/0.6/sea_orm/schema/struct.Schema.html#method.create_table_from_entity).

```rust
async fn setup_schema(db: &DbConn) {

    // Setup Schema helper
    let schema = Schema::new(DbBackend::Sqlite);

    // Derive from Entity
    let stmt: TableCreateStatement = schema.create_table_from_entity(MyEntity);

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
        .execute(db.get_database_backend().build(&stmt))
        .await;
}
```

## Performing tests

Execute test cases and assert against the results.

```rust
async fn testcase(db: &DbConn) -> Result<(), DbErr> {

    let baker_bob = baker::ActiveModel {
        name: Set("Baker Bob".to_owned()),
        contact_details: Set(serde_json::json!({
            "mobile": "+61424000000",
            "home": "0395555555",
            "address": "12 Test St, Testville, Vic, Australia"
        })),
        bakery_id: Set(2),
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
