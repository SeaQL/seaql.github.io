# Writing Migration

Each migration contains two methods: `up` and `down`. The `up` method is used to alter the database schema, such as adding new tables, columns or indexes, while the `down` method revert the actions performed in the `up` method.

## Creating Migrations

Generate a new migration file by executing `sea-orm-cli migrate generate` command.

```shell
sea-orm-cli migrate generate NAME_OF_MIGRATION [--local-time]

# E.g. to generate `migration/src/m20220101_000001_create_table.rs` shown below
sea-orm-cli migrate generate create_table
```

Or you can create a migration file using the template below. Name the file according to the naming convention `mYYYYMMDD_HHMMSS_migration_name.rs`.

```rust title="migration/src/m20220101_000001_create_table.rs"
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
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

#[async_trait::async_trait]
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

### SeaQuery

Click [here](https://github.com/SeaQL/sea-query#table-create) to take a quick tour of SeaQuery's DDL statements.

You would need [`sea_query::Iden`](https://github.com/SeaQL/sea-query#iden) to define identifiers that will be used in your migration.

```rust
#[derive(Iden)]
enum Post {
    Table,
    Id,
    Title,
    #[iden = "text"] // Renaming the identifier
    Text,
}

assert_eq!(Post::Table.to_string(), "post");
assert_eq!(Post::Id.to_string(), "id");
assert_eq!(Post::Title.to_string(), "title");
assert_eq!(Post::Text.to_string(), "text");
```

#### Schema Creation Methods
- Create Table
    ```rust
    manager.create_table(sea_query::Table::create()..)
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
    manager.create_type(sea_query::Type::create()..)
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
    manager.drop_type(sea_query::Type::drop()..)
    ```

#### Schema Inspection Methods
- Has Table
    ```rust
    manager.has_table(table_name)
    ```
- Has Column
    ```rust
    manager.has_column(table_name, column_name)
    ```

## Combining Multiple Schema Changes in one Migration

You can combine multiple changes within both up and down migration functions. Here is a complete example:

```rust
async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {

    manager
        .create_table(
            sea_query::Table::create()
                .table(Post::Table)
                .if_not_exists()
                .col(
                    ColumnDef::new(Post::Id)
                        .integer()
                        .not_null()
                        .auto_increment()
                        .primary_key()
                )
                .col(ColumnDef::new(Post::Title).string().not_null())
                .col(ColumnDef::new(Post::Text).string().not_null())
                .to_owned()
        )
        .await?
    
    manager
        .create_index(
            Index::create()
                .if_not_exists()
                .name("idx-post_title")
                .table(Post::Table)
                .col(Post::Title)                        
                .to_owned(),
        )
        .await?;
    
    Ok(()) // All good!
}
```

and here we have the matching down function:

```rust
async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    
    manager.drop_index(Index::drop().name("idx-post-title").to_owned())
    .await?;
    
    manager.drop_table(Table::drop().table(Post::Table).to_owned())
    .await?;

    Ok(()) // All good!
}
```

### Raw SQL

You can write migration files in raw SQL, but then you lost the multi-backend compatibility SeaQuery offers.

```rust title="migration/src/m20220101_000001_create_table.rs"
use sea_orm::Statement;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
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
        let stmt = Statement::from_sql_and_values(
            manager.get_database_backend(),
            r#"INSERT INTO `cake` (`name`) VALUES (?)"#,
            ["Cheese Cake".into()]
        );
        db.execute(stmt).await?;

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

## Schema first or Entity first?

In the grand scheme of things, we recommend a schema first approach: you write migrations first and then generate entities from a live database.

At times, you might want to use the [`create_*_from_entity`](09-generate-sea-query-statement/01-create-table.md) methods to bootstrap your database with several hand written entity files.

That's perfectly fine if you intend to never change the entity schema. Or, you can keep the original entity and embed a copy in the migration file.
