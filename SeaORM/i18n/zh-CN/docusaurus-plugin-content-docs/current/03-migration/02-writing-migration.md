# 编写迁移

本章将介绍 schema 优先方式：先编写迁移，再从已有数据库生成实体。

## 迁移基础

每个迁移包含两个方法：`up` 和 `down`。`up` 用于修改数据库架构，例如添加新表、列或索引；`down` 则用于撤销 `up` 中的操作。

SeaORM 迁移系统具有以下优势：

1. 使用 SeaQuery 或 SQL 编写 DDL 语句
2. 执行多条 DDL（可带条件）
3. 使用 SeaORM API 填充数据

## 创建迁移文件

通过执行 `sea-orm-cli migrate generate` 命令生成新的迁移文件。

若文件名包含空格，将按约定自动转换。

```shell
sea-orm-cli migrate generate NAME_OF_MIGRATION [--local-time]

# E.g. to generate `migration/src/m20220101_000001_create_table.rs` shown below
sea-orm-cli migrate generate create_table

# This create the same migration file as above command
sea-orm-cli migrate generate "create table"
```

你也可以使用下方模板创建迁移文件。文件名需遵循命名约定 `mYYYYMMDD_HHMMSS_migration_name.rs`。

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

此外，你需要在 [`MigratorTrait::migrations`](https://docs.rs/sea-orm-migration/*/sea_orm_migration/migrator/trait.MigratorTrait.html#tymethod.migrations) 方法中注册新的迁移。注意迁移应按时间顺序排列。

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

## 定义迁移

API 参考请参阅 [`SchemaManager`](https://docs.rs/sea-orm-migration/*/sea_orm_migration/manager/struct.SchemaManager.html)。

### 使用 SeaQuery

点击[此处](https://github.com/SeaQL/sea-query#table-create) 快速了解 SeaQuery 的 DDL 语句。

以下是一些常用的 DDL 片段。

#### Schema 创建方法
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

#### Schema 变更方法
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

#### Schema 检查方法

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

### 使用原生 SQL

你可以使用原生 SQL 编写迁移文件，但会失去 SeaQuery 提供的多后端兼容性。

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

## 技巧 1：在单个迁移中合并多项 schema 变更

你可以在单个迁移的 up 和 down 函数中组合多项修改。以下为完整示例：

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

对应的 down 函数如下：

```rust
async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    
    manager.drop_index(Index::drop().name("idx-post-title"))
    .await?;
    
    manager.drop_table(Table::drop().table(Post::Table))
    .await?;

    Ok(()) // All good!
}
```

## 技巧 2：`ADD COLUMN IF NOT EXISTS`

由于 MySQL 不支持该语法，你可以：

```rust
async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    if !manager.has_column("my_table", "col_to_add").await? {
        // ALTER TABLE `my_table` ADD COLUMN `col_to_add` ..
    }

    Ok(())
}
```

## 技巧 3：使用 Entity 填充数据

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

[完整示例](https://github.com/SeaQL/sea-orm/blob/master/examples/seaography_example/migration/src/m20230102_000001_seed_bakery_data.rs)。

## 原子性数据迁移

在 PostgreSQL 中，迁移会以原子方式执行，即迁移脚本在事务内运行。若迁移失败，对数据库的修改将被回滚。但 MySQL 和 SQLite 不支持原子性数据迁移。

你可以在每个迁移内开启事务，以执行诸如[事务式填充数据](03-migration/04-seeding-data.md#seeding-data-transactionally)等操作。
