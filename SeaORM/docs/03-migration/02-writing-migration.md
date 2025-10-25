# Writing Migration

In this chapter we will illustrate a schema first approach: you write migrations first and then generate entities from a live database.

## The basics of Migrations

Each migration contains two methods: `up` and `down`. The `up` method is used to alter the database schema, such as adding new tables, columns or indexes, while the `down` method revert the actions performed in the `up` method.

The SeaORM migration system has the following advantages:

1. Write DDL statements with SeaQuery or SQL
2. Execute multiple DDL (with conditions)
3. Seed data using the SeaORM API

## Creating Migrations

Generate a new migration file by executing `sea-orm-cli migrate generate` command.

If you name the file with spaces, it will be converted according to the convention automatically. 

```shell
sea-orm-cli migrate generate NAME_OF_MIGRATION [--local-time]

# E.g. to generate `migration/src/m20220101_000001_create_table.rs` shown below
sea-orm-cli migrate generate create_table

# This create the same migration file as above command
sea-orm-cli migrate generate "create table"
```

Or you can create a migration file using the template below. Name the file according to the naming convention `mYYYYMMDD_HHMMSS_migration_name.rs`.

```rust title="migration/src/m20220101_000001_create_table.rs"
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table( ... )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table( ... )
            .await
    }
}
```

Additionally, you have to include the new migration in the [`MigratorTrait::migrations`](https://docs.rs/sea-orm-migration/*/sea_orm_migration/migrator/trait.MigratorTrait.html#tymethod.migrations) method. Note that the migrations should be sorted in chronological order.

```rust title="migration/src/lib.rs"
pub use sea_orm_migration::*;

mod m20220101_000001_create_table;

pub struct Migrator;

#[async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_create_table::Migration),
        ]
    }
}
```

## Defining Migration

See [`SchemaManager`](https://docs.rs/sea-orm-migration/*/sea_orm_migration/manager/struct.SchemaManager.html) for API reference.

### Using SeaQuery

Click [here](https://github.com/SeaQL/sea-query#table-create) to take a quick tour of SeaQuery's DDL statements.

Here are some common DDL snippets you may find useful.

#### Schema Creation Methods
- Create Table
    ```rust
    // Remember to import `sea_orm_migration::schema::*` schema helpers into scope
    use sea_orm_migration::{prelude::*, schema::*};

    // Defining the table schema
    manager
        .create_table(
            Table::create()
                .table("post")
                .if_not_exists()
                .col(pk_auto("id"))
                .col(string("title"))
                .col(string("text"))
                .col(enumeration_null("category", "category", ["Feed", "Store"]))
        )
        .await
    ```
- Create Index
    ```rust
    manager.create_index(sea_query::Index::create()..)
    ```
- Create Foreign Key
    ```rust
    manager.create_foreign_key(sea_query::ForeignKey::create()..)
    ```
- Create Data Type (PostgreSQL only)
    ```rust
    use sea_orm_migration::prelude::extension::postgres::Type;

    manager
        .create_type(
            Type::create()
                .as_enum(CategoryEnum)
                .values(["feed", "story"])
                .to_owned()
        )
        .await?;
    ```

#### Schema Mutation Methods
- Drop Table
    ```rust
    use entity::post;

    manager.drop_table(sea_query::Table::drop()..)
    ```
- Alter Table
    ```rust
    manager.alter_table(sea_query::Table::alter()..)
    ```
- Rename Table
    ```rust
    manager.rename_table(sea_query::Table::rename()..)
    ```
- Truncate Table
    ```rust
    manager.truncate_table(sea_query::Table::truncate()..)
    ```
- Drop Index
    ```rust
    manager.drop_index(sea_query::Index::drop()..)
    ```
- Drop Foreign Key
    ```rust
    manager.drop_foreign_key(sea_query::ForeignKey::drop()..)
    ```
- Alter Data Type (PostgreSQL only)
    ```rust
    manager.alter_type(sea_query::Type::alter()..)
    ```
- Drop Data Type (PostgreSQL only)
    ```rust
    manager.drop_type(sea_query::extension::postgres::Type()..)
    ```

#### Schema Inspection Methods

- Has Table
    ```rust
    manager.has_table("table_name")
    ```
- Has Column
    ```rust
    manager.has_column("table_name", "column_name")
    ```
- Has Index
    ```rust
    manager.has_index("table_name", "index_name")
    ```

### Using raw SQL

You can write migration files in raw SQL, but then you lost the multi-backend compatibility SeaQuery offers.

```rust title="migration/src/m20220101_000001_create_table.rs"
use sea_orm::Statement;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        let db = manager.get_connection();

        // Use `execute_unprepared` if the SQL statement doesn't have value bindings
        db.execute_unprepared(
            "CREATE TABLE `cake` (
                `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
                `name` varchar(255) NOT NULL
            )"
        )
        .await?;

        // Construct a `Statement` if the SQL contains value bindings
        db.execute_raw(Statement::from_sql_and_values(
            manager.get_database_backend(),
            r#"INSERT INTO `cake` (`name`) VALUES (?)"#,
            ["Cheese Cake".into()]
        )).await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .get_connection()
            .execute_unprepared("DROP TABLE `cake`")
            .await?;

        Ok(())
    }
}
```

## Tip 1: combining multiple schema changes in one migration

You can combine multiple changes within both up and down migration functions. Here is a complete example:

```rust
// Remember to import `sea_orm_migration::schema::*` schema helpers into scope
use sea_orm_migration::{prelude::*, schema::*};

async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {

    manager
        .create_table(
            sea_query::Table::create()
                .table(Post::Table)
                .if_not_exists()
                .col(pk_auto(Post::Id))
                .col(string(Post::Title))
                .col(string(Post::Text))
        )
        .await?;
    
    manager
        .create_index(
            Index::create()
                .if_not_exists()
                .name("idx-post_title")
                .table(Post::Table)
                .col(Post::Title)                        
        )
        .await?;
    
    Ok(()) // All good!
}
```

and here we have the matching down function:

```rust
async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    
    manager.drop_index(Index::drop().name("idx-post-title"))
    .await?;
    
    manager.drop_table(Table::drop().table(Post::Table))
    .await?;

    Ok(()) // All good!
}
```

## Tip 2: `ADD COLUMN IF NOT EXISTS`

Since this syntax is not available on MySQL, you can:

```rust
async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    if !manager.has_column("my_table", "col_to_add").await? {
        // ALTER TABLE `my_table` ADD COLUMN `col_to_add` ..
    }

    Ok(())
}
```

## Tip 3: Seed data with Entity

```rust
async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    let db = manager.get_connection();

    cake::ActiveModel {
        name: Set("Cheesecake".to_owned()),
        ..Default::default()
    }
    .insert(db)
    .await?;

    Ok(())
}
```

[Full example](https://github.com/SeaQL/sea-orm/blob/master/examples/seaography_example/migration/src/m20230102_000001_seed_bakery_data.rs).

## Atomic Migration

Migration will be executed in Postgres atomically that means migration scripts will be executed inside a transaction. Changes done to the database will be rolled back if the migration failed. However, atomic migration is not supported in MySQL and SQLite.

You can start a transaction inside each migration to perform operations like [seeding sample data](03-migration/04-seeding-data.md#seeding-data-transactionally) for a newly created table.
