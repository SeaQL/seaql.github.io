# 编写迁移

每个迁移包含两个方法：`up` 和 `down`。`up` 方法用于更改数据库模式，例如添加新表、列或索引，而 `down` 方法则用于回滚 `up` 方法中执行的操作。

SeaORM 迁移系统具有以下优点：

1. 使用 SeaQuery 或 SQL 编写 DDL 语句
2. 执行多个 DDL（带条件）
3. 使用 SeaORM API 填充（seed）数据

## 创建迁移

通过执行 `sea-orm-cli migrate generate` 命令来生成新的迁移文件。

如果你在文件名中使用空格，它会自动按约定进行转换。

```shell
sea-orm-cli migrate generate NAME_OF_MIGRATION [--local-time]

# 例如，生成如下所示的 `migration/src/m20220101_000001_create_table.rs`
sea-orm-cli migrate generate create_table

# 这将创建与上述命令相同的迁移文件
sea-orm-cli migrate generate "create table"
```

或者你可以使用下面的模板创建迁移文件。按照命名约定 `mYYYYMMDD_HHMMSS_migration_name.rs` 命名文件。

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

此外，你必须在 [`MigratorTrait::migrations`](https://docs.rs/sea-orm-migration/*/sea_orm_migration/migrator/trait.MigratorTrait.html#tymethod.migrations) 方法中包含新的迁移。迁移应按时间顺序排序。

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

请参阅 [`SchemaManager`](https://docs.rs/sea-orm-migration/*/sea_orm_migration/manager/struct.SchemaManager.html) 获取 API 参考。

### 使用 SeaQuery

点击[此处](https://github.com/SeaQL/sea-query#table-create)快速了解 SeaQuery 的 DDL 语句。

你可以使用 [`DeriveIden`](https://docs.rs/sea-orm/*/sea_orm/derive.DeriveIden.html) 宏来定义将在迁移中使用的标识符。

```rust
#[derive(DeriveIden)]
enum Post {
    Table, // 这是一个特殊情况；将映射到 `post`
    Id,
    Title,
    #[sea_orm(iden = "full_text")] // 重命名标识符
    Text,
}

assert_eq!(Post::Table.to_string(), "post");
assert_eq!(Post::Id.to_string(), "id");
assert_eq!(Post::Title.to_string(), "title");
assert_eq!(Post::Text.to_string(), "full_text");
```

以下是一些你可能会觉得有用的常见 DDL 片段。

#### Schema 创建方法
- 创建表
    ```rust
    use sea_orm::{EnumIter, Iterable};

    #[derive(DeriveIden)]
    enum Post {
        Table,
        Id,
        Title,
        #[sea_orm(iden = "text")] // 重命名标识符
        Text,
        Category,
    }

    #[derive(Iden, EnumIter)]
    pub enum Category {
        #[iden = "Feed"]
        Feed,
        #[iden = "Story"]
        Story,
    }

    // 记得将 `sea_orm_migration::schema::*` schema 助手导入作用域
    use sea_orm_migration::{prelude::*, schema::*};

    // 定义表 schema
    manager
        .create_table(
            Table::create()
                .table(Post::Table)
                .if_not_exists()
                .col(pk_auto(Post::Id))
                .col(string(Post::Title))
                .col(string(Post::Text))
                .col(enumeration_null(Post::Category, "category", Category::iter()))
        )
        .await

    // 上述等同于：
    manager
        .create_table(
            Table::create()
                .table(Post::Table)
                .if_not_exists()
                .col(ColumnDef::new(Post::Id)
                        .integer()
                        .not_null()
                        .auto_increment()
                        .primary_key()
                )
                .col(ColumnDef::new(Post::Title).string().not_null())
                .col(ColumnDef::new(Post::Text).string().not_null())
                .col(ColumnDef::new(Post::Category)
                        .enumeration("category", Category::iter()))
        )
        .await
    ```
- 创建索引
    ```rust
    manager.create_index(sea_query::Index::create()..)
    ```
- 创建外键
    ```rust
    manager.create_foreign_key(sea_query::ForeignKey::create()..)
    ```
- 创建数据类型 (仅限 PostgreSQL)
    ```rust
    use sea_orm::{EnumIter, Iterable};
    use sea_orm_migration::prelude::extension::postgres::Type;

    #[derive(DeriveIden)]
    struct CategoryEnum;

    #[derive(DeriveIden, EnumIter)]
    enum CategoryVariants {
        Feed,
        #[sea_orm(iden = "story")]
        Story,
    }

    manager
        .create_type(
            Type::create()
                .as_enum(CategoryEnum)
                .values(CategoryVariants::iter())
                .to_owned()
        )
        .await?;
    ```

#### Schema 变更方法
- 删除表
    ```rust
    use entity::post;

    manager.drop_table(sea_query::Table::drop()..)
    ```
- 更改表
    ```rust
    manager.alter_table(sea_query::Table::alter()..)
    ```
- 重命名表
    ```rust
    manager.rename_table(sea_query::Table::rename()..)
    ```
- 清空表
    ```rust
    manager.truncate_table(sea_query::Table::truncate()..)
    ```
- 删除索引
    ```rust
    manager.drop_index(sea_query::Index::drop()..)
    ```
- 删除外键
    ```rust
    manager.drop_foreign_key(sea_query::ForeignKey::drop()..)
    ```
- 更改数据类型 (仅限 PostgreSQL)
    ```rust
    manager.alter_type(sea_query::Type::alter()..)
    ```
- 删除数据类型 (仅限 PostgreSQL)
    ```rust
    manager.drop_type(sea_query::extension::postgres::Type()..)
    ```

#### Schema 检查方法

- 检查表是否存在
    ```rust
    manager.has_table("table_name")
    ```
- 检查列是否存在
    ```rust
    manager.has_column("table_name", "column_name")
    ```
- 检查索引是否存在
    ```rust
    manager.has_index("table_name", "index_name")
    ```

### 使用原始 SQL

你可以在迁移文件中使用原始 SQL，但这样会失去 SeaQuery 提供的多后端兼容性。

```rust title="migration/src/m20220101_000001_create_table.rs"
use sea_orm::Statement;
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        let db = manager.get_connection();

        // 如果 SQL 语句没有值绑定，则应使用 `execute_unprepared`
        db.execute_unprepared(
            "CREATE TABLE `cake` (
                `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
                `name` varchar(255) NOT NULL
            )"
        )
        .await?;

        // 如果 SQL 包含值绑定，则应构造一个 `Statement`
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

## 技巧 1：在一个迁移中组合多个 schema 更改

你可以在 up 和 down 迁移函数中组合多个更改。这是一个完整的示例：

```rust
// 记得将 `sea_orm_migration::schema::*` schema 助手导入作用域
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

    Ok(()) // 一切顺利！
}
```

这是匹配的 down 函数：

```rust
async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {

    manager.drop_index(Index::drop().name("idx-post-title"))
    .await?;

    manager.drop_table(Table::drop().table(Post::Table))
    .await?;

    Ok(()) // 一切顺利！
}
```

## 技巧 2：`ADD COLUMN IF NOT EXISTS`

由于 MySQL 不支持此语法，你可以这么做：

```rust
async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
    if !manager.has_column("my_table", "col_to_add").await? {
        // ALTER TABLE `my_table` ADD COLUMN `col_to_add` ..
    }

    Ok(())
}
```

## 技巧 3：使用实体填充数据

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

## 原子迁移

在 Postgres 中，迁移会以原子方式执行，这意味着迁移脚本将在事务内执行。如果迁移失败，对数据库所做的更改将回滚。但是，MySQL 和 SQLite 不支持原子迁移。

你可以在迁移内启动事务，以执行诸如为新创建的表[填充示例数据](03-migration/04-seeding-data.md#seeding-data-transactionally)之类的操作。

## Schema 优先还是实体优先？

总体而言，我们推荐 schema 优先的方法：先编写迁移，然后从运行中的数据库生成实体

但有时，你可能希望使用 [`create_*_from_entity`](09-schema-statement/01-create-table.md) 方法从手写的实体文件引导（bootstrap）数据库。

如果你打算永远不修改实体的 schema，这完全没问题。或者，你可以保留原始实体并将其副本嵌入到迁移文件中。