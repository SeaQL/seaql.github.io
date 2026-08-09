# 设置迁移

:::tip SeaQL 的 Rust 贴纸包 🦀
[我们的贴纸](https://www.sea-ql.org/sticker-pack/cn/)由优质防水 PVC 制成，具有独特的哑光表面，非常适合粘贴在笔记本电脑或其他小工具的背面！
:::

SeaORM 提供强大的迁移系统，让你可以使用 SeaQuery 语句或原生 SQL 来创建表、修改 schema 以及填充数据。

如果你已有包含表与数据的数据库，可以跳过本章，直接前往[生成 SeaORM 实体](04-generate-entity/01-sea-orm-cli.md)。

如果你打算采用 Entity 优先工作流程，可以跳过本章，直接前往 [Entity 格式](04-generate-entity/02-entity-format.md)。

## 迁移表

数据库中将创建一个表用于记录已应用的迁移。该表会在你运行迁移时自动创建。

<details>
    <summary>默认情况下，该表名为 `seaql_migrations`。你也可以为迁移表使用自定义名称。</summary>

```rust
#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    // Override the name of migration table
    fn migration_table_name() -> sea_orm::DynIden {
        "override_migration_table_name".into_iden()
    }
    ..
}
```  
</details>

## 创建迁移目录

首先，使用 `cargo` 安装 `sea-orm-cli`。

```shell
cargo install sea-orm-cli@^2.0
```

:::tip SQL Server (MSSQL) backend

支持 MSSQL 的 `sea-orm-cli` 安装说明请参阅[此处](https://www.sea-ql.org/SeaORM-X/docs/migration/setting-up-migration/)。

:::

然后，执行 `sea-orm-cli migrate init` 来设置迁移目录。

```shell
# Setup the migration directory in `./migration`
$ sea-orm-cli migrate init
Initializing migration directory...
Creating file `./migration/src/lib.rs`
Creating file `./migration/src/m20220101_000001_create_table.rs`
Creating file `./migration/src/main.rs`
Creating file `./migration/Cargo.toml`
Creating file `./migration/README.md`
Done!

# If you want to setup the migration directory in else where
$ sea-orm-cli migrate init -d ./other/migration/dir
```

你将得到一个类似以下结构的迁移目录。

```
migration
├── Cargo.toml
├── README.md
└── src
    ├── lib.rs                              # Migrator API, for integration
    ├── m20220101_000001_create_table.rs    # A sample migration file
    └── main.rs                             # Migrator CLI, for running manually
```

注意：如果你在 Git 仓库内直接设置迁移目录，还会自动创建 `.gitignore` 文件。

## 工作区结构

建议将项目组织为 cargo 工作区，以分离 app crate 与迁移 crate。可参考[集成示例](https://github.com/SeaQL/sea-orm/tree/master/examples) 进行实践。

### 迁移 Crate

引入 [`sea-orm-migration`](https://crates.io/crates/sea-orm-migration) 和 [`tokio`](https://crates.io/crates/tokio) crate。

```toml title="migration/Cargo.toml"
[dependencies]
tokio = { version = "1", features = ["macros", "rt-multi-thread"] }

[dependencies.sea-orm-migration]
version = "2.0" # sea-orm-migration version
features = [
  # Enable following runtime and db backend features if you want to run migration via CLI
  # "runtime-tokio-native-tls",
  # "sqlx-postgres",
]
```

接下来编写 migration。详细说明见下一节。

```rust title="migration/src/m20220120_000001_create_post_table.rs"
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Replace the sample below with your own migration scripts
        todo!();
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Replace the sample below with your own migration scripts
        todo!();
    }
}
```

### App Crate

这里放置应用逻辑。

创建一个包含 app、entity 和迁移 crate 的工作区，并将 entity crate 引入 app crate。

若要将迁移工具集成到应用中，还需引入迁移 crate。

```toml title="./Cargo.toml"
[workspace]
members = [".", "migration"]

[dependencies]
migration = { path = "migration" }

[dependencies]
sea-orm = { version = "2.0.0", features = [..] }
```

在应用中，你可以在启动时运行迁移。

```rust title="src/main.rs"
use migration::{Migrator, MigratorTrait};

let connection = sea_orm::Database::connect(&database_url).await?;
Migrator::up(&connection, None).await?;
```
