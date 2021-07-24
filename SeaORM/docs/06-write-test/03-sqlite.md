# Using SQLite

If you want to unit test application logic that does not require database-specific features, SQLite will be a good choice for you.

> Check out the full demo [here](https://github.com/SeaQL/sea-orm/blob/master/tests/basic.rs).

## Running Unit Test

By default Rust run all tests in parallel and each test should be independent of other, so if we need a single entry point for it to perform sequential operations. Then, we have the following code snippet connecting to database, setting up database schema and performing CRUD operations in sequence.

```rust
#[async_std::test]
async fn main() {
    // Connecting SQLite
    let db: DbConn = setup().await;

    // Setting up database schema
    setup_schema(&db).await;

    // Performing CRUD operations
    perform_tests(&db).await.unwrap();
}
```

## Connecting SQLite

Connect to in memory SQLite database.

```rust
pub async fn setup() -> DatabaseConnection {
    Database::connect("sqlite::memory:").await.unwrap()
}
```

## Setting Up Database Schema

Setup schema of SQLite database with SeaQuery query builder.

```rust
async fn setup_schema(db: &DbConn) {
    use sea_query::*;

    // Build create table statement
    let stmt = sea_query::Table::create()
        .table(cake::Entity)
        .col(
            ColumnDef::new(cake::Column::Id)
                .integer()
                .not_null()
                .auto_increment()
                .primary_key(),
        )
        .col(ColumnDef::new(cake::Column::Name).string())
        .build(SqliteQueryBuilder);

    // Execute create table statement
    let result = db
        .execute(Statement::from_string(DbBackend::Sqlite, stmt))
        .await;
    println!("Create table cake: {:?}", result);
}
```

## Performing CRUD Operations

Perform CRUD operations on SQLite database.

```rust
async fn perform_tests(db: &DbConn) -> Result<(), DbErr> {
    // Insert
    let apple = cake::ActiveModel {
        name: Set("Apple Pie".to_owned()),
        ..Default::default()
    };
    let mut apple = apple.save(db).await?;

    // Update
    apple.name = Set("Lemon Tart".to_owned());
    let apple = apple.save(db).await?;

    // Retrieve
    let apple = cake::Entity::find_by_id(1).one(db).await?;

    // Delete
    let apple: cake::ActiveModel = apple.unwrap().into();
    let result = apple.delete(db).await?;

    Ok(())
}
```
