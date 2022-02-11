# Writing Migration

Each migration contains two methods: `up` and `down`. The `up` method is used to alter the database schema, such as adding new tables, columns or indexes, while the `down` method revert the actions performed in the `up` method.

## Creating Migration File

You can create migration by duplicating an existing migration file or copy the template below. Remember to name the file according to naming convention `mYYYYMMDD_HHMMSS_migration_name.rs` and update the [`MigrationName::name`](https://docs.rs/sea-schema/0.5/sea_schema/migration/trait.MigrationName.html#tymethod.name) method accordingly.

```rust title="migration/src/m20220101_000001_create_table.rs"
use sea_schema::migration::prelude::*;

pub struct Migration;

impl MigrationName for Migration {
    fn name(&self) -> &str {
        "m20220101_000001_create_table"
    }
}

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

Also, you have to include the new migration in [`MigratorTrait::migrations`](https://docs.rs/sea-schema/0.5/sea_schema/migration/migrator/trait.MigratorTrait.html#tymethod.migrations) method. Note that the migrations should be sorted in chronological order.

```rust title="migration/src/lib.rs"
pub use sea_schema::migration::*;

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

The [`SchemaManager`](https://docs.rs/sea-schema/0.5/sea_schema/migration/manager/struct.SchemaManager.html) helps you define migration in SeaQuery or in raw SQL

### SeaQuery

Click [here](https://github.com/SeaQL/sea-query#usage) to take a quick tour of SeaQuery.

#### Schema Creation Methods
- Create Table
    ```rust
    use entity::post;

    manager
        .create_table(
            sea_query::Table::create()
                .table(post::Entity)
                .if_not_exists()
                .col(
                    ColumnDef::new(post::Column::Id)
                        .integer()
                        .not_null()
                        .auto_increment()
                        .primary_key(),
                )
                .col(ColumnDef::new(post::Column::Title).string().not_null())
                .col(ColumnDef::new(post::Column::Text).string().not_null())
                .to_owned()
        )
    ```
    <details>
        <summary>If you don't have SeaORM entities defined?</summary>

    ```rust
    manager
        .create_table(
            Table::create()
                .table(Post::Table)
                .if_not_exists()
                .col(
                    ColumnDef::new(Post::Id)
                        .integer()
                        .not_null()
                        .auto_increment()
                        .primary_key(),
                )
                .col(ColumnDef::new(Post::Title).string().not_null())
                .col(ColumnDef::new(Post::Text).string().not_null())
                .to_owned()
        )

    #[derive(Iden)]
    pub enum Post {
        Table,
        Id,
        Title,
        Text,
    }
    ```
    </details>
- Create Index
    ```rust
    manager.create_index(sea_query::Index::create())
    ```
- Create Foreign Key
    ```rust
    manager.create_foreign_key(sea_query::ForeignKey::create())
    ```
- Create Data Type (PostgreSQL only)
    ```rust
    manager.create_type(sea_query::Type::create())
    ```

#### Schema Mutation Methods
- Drop Table
    ```rust
    use entity::post;

    manager
        .drop_table(
            sea_query::Table::drop()
                .table(post::Entity)
                .to_owned()
        )
    ```
    <details>
        <summary>If you don't have SeaORM entities defined?</summary>

    ```rust
    manager
        .drop_table(
            sea_query::Table::drop()
                .table(Post::Table)
                .to_owned()
        )

    #[derive(Iden)]
    pub enum Post {
        Table,
        Id,
        Title,
        Text,
    }
    ```
    </details>
- Alter Table
    ```rust
    manager.alter_table(sea_query::Table::alter())
    ```
- Rename Table
    ```rust
    manager.rename_table(sea_query::Table::rename())
    ```
- Truncate Table
    ```rust
    manager.truncate_table(sea_query::Table::truncate())
    ```
- Drop Index
    ```rust
    manager.drop_index(sea_query::Index::drop())
    ```
- Drop Foreign Key
    ```rust
    manager.drop_foreign_key(sea_query::ForeignKey::drop())
    ```
- Alter Data Type (PostgreSQL only)
    ```rust
    manager.alter_type(sea_query::Type::alter())
    ```
- Drop Data Type (PostgreSQL only)
    ```rust
    manager.drop_type(sea_query::Type::drop())
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

### Raw SQL

Besides, you can define migration in raw SQL.

```rust
use sea_orm::Statement;
use sea_schema::migration::prelude::*;

pub struct Migration;

impl MigrationName for Migration {
    fn name(&self) -> &str {
        "m20220101_000001_create_table"
    }
}

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        let sql = "CREATE TABLE `cake` ( `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY, `name` varchar(255) NOT NULL )";
        let stmt = Statement::from_string(manager.get_database_backend(), sql.to_owned());
        manager.get_connection().execute(stmt).await.map(|_| ())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        let sql = "DROP TABLE `cake`";
        let stmt = Statement::from_string(manager.get_database_backend(), sql.to_owned());
        manager.get_connection().execute(stmt).await.map(|_| ())
    }
}
```
