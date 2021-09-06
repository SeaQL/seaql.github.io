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

Setup schema of SQLite database with SeaQuery query builder. Instead of manually writing [`TableCreateStatement`](https://docs.rs/sea-query/*/sea_query/table/struct.TableCreateStatement.html), you can derive it from `Entity` using [`create_table_from_entity`](#).

```rust
async fn setup_schema(db: &DbConn) {
    use sea_query::*;

    // Build create table statement
    let stmt = create_table_from_entity(CakeFillingPrice).build(SqliteQueryBuilder);

    // It constructs a TableCreateStatement based on the entity file
    assert_eq!(
        stmt,
        Table::create()
            .table(CakeFillingPrice)
            .if_not_exists()
            .col(
                ColumnDef::new(cake_filling_price::Column::CakeId)
                    .integer()
                    .not_null()
            )
            .col(
                ColumnDef::new(cake_filling_price::Column::FillingId)
                    .integer()
                    .not_null()
            )
            .col(
                ColumnDef::new(cake_filling_price::Column::Price)
                    .decimal()
                    .not_null()
            )
            .primary_key(
                Index::create()
                    .name("pk-cake_filling_price")
                    .col(cake_filling_price::Column::CakeId)
                    .col(cake_filling_price::Column::FillingId)
                    .primary()
            )
            .foreign_key(
                ForeignKeyCreateStatement::new()
                    .name("fk-cake_filling_price-cake_filling")
                    .from_tbl(CakeFillingPrice)
                    .from_col(cake_filling_price::Column::CakeId)
                    .from_col(cake_filling_price::Column::FillingId)
                    .to_tbl(CakeFilling)
                    .to_col(cake_filling::Column::CakeId)
                    .to_col(cake_filling::Column::FillingId)
            )
            .build(SqliteQueryBuilder)
    );

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
