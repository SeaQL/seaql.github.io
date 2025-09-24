# 设置迁移

:::tip Rustacean 贴纸包 🦀
[我们的贴纸](https://www.sea-ql.org/sticker-pack/)采用优质防水乙烯基材料制成，具有独特的哑光质感。
把它们贴在你的笔记本、记事本或任何设备上，展示你对 Rust 的热爱！
:::

如果你从一个全新的数据库开始，最好对数据库模式进行版本控制。SeaORM 附带了一个迁移工具，允许你使用 SeaQuery 或 SQL 编写迁移。

如果你已经有一个包含表和数据的数据库，可以跳过本章，直接前往[生成 SeaORM 实体](04-generate-entity/01-sea-orm-cli.md)。

## 迁移表

数据库中将创建一个表来跟踪已应用的迁移。这个表会在运行迁移时自动创建。

<details>
    <summary>默认情况下，迁移表名称为 `seaql_migrations` 。你也可以自定义迁移表的名称。</summary>

```rust
#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    // 覆盖迁移表的名称
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
cargo install sea-orm-cli@1.1.0
```

:::tip SQL Server (MSSQL) 后端

支持 MSSQL 的 `sea-orm-cli` 的安装说明在[这里](https://www.sea-ql.org/SeaORM-X/docs/migration/setting-up-migration/)。

:::

然后，执行 `sea-orm-cli migrate init` 来设置迁移目录。

```shell
# 在 `./migration` 中设置迁移目录
$ sea-orm-cli migrate init
Initializing migration directory...
Creating file `./migration/src/lib.rs`
Creating file `./migration/src/m20220101_000001_create_table.rs`
Creating file `./migration/src/main.rs`
Creating file `./migration/Cargo.toml`
Creating file `./migration/README.md`
Done!

# 如果你想在其他地方设置迁移目录
$ sea-orm-cli migrate init -d ./other/migration/dir
```

你应该会看到如下结构的迁移目录。

```
migration
├── Cargo.toml
├── README.md
└── src
    ├── lib.rs                              # Migrator API，用于集成迁移
    ├── m20220101_000001_create_table.rs    # 示例迁移文件
    └── main.rs                             # Migrator CLI，用于手动运行迁移
```

请注意，如果你直接在 Git 仓库中设置迁移目录，还会创建一个 `.gitignore` 文件。

## 工作区结构

建议你按如下方式组织 cargo 工作区，以便在应用程序 crate 和迁移 crate 之间共享 SeaORM 实体。请查看[集成示例](https://github.com/SeaQL/sea-orm/tree/master/examples)以获取演示。

### 迁移 crate

导入 [`sea-orm-migration`](https://crates.io/crates/sea-orm-migration) 和 [`async-std`](https://crates.io/crates/async-std) crate。

```toml title="migration/Cargo.toml"
[dependencies]
async-std = { version = "1", features = ["attributes", "tokio1"] }

[dependencies.sea-orm-migration]
version = "1.1.0"
features = [
  # 如果你想通过 CLI 运行迁移，请至少启用一个 `ASYNC_RUNTIME` 和 `DATABASE_DRIVER` 功能。
  # 支持的特性列表见 https://www.sea-ql.org/SeaORM/docs/install-and-config/database-and-async-runtime
  # 例如：
  # "runtime-tokio-rustls",  # `ASYNC_RUNTIME` 功能
  # "sqlx-postgres",         # `DATABASE_DRIVER` 功能
]
```

让我们编写一个迁移。详细说明在下一节。

```rust title="migration/src/m20220120_000001_create_post_table.rs"
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // 将下面的示例替换为你自己的迁移脚本
        todo!();
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // 将下面的示例替换为你自己的迁移脚本
        todo!();
    }
}
```

### 实体 crate

在你的根工作区中创建一个实体 crate。

<details>
    <summary>还没有定义 SeaORM 实体？</summary>

你可以创建一个不包含任何实体文件的实体 crate。然后，编写并运行迁移以在数据库中创建表。最后，使用 `sea-orm-cli` [生成 SeaORM 实体](04-generate-entity/01-sea-orm-cli.md)并将实体文件输出到 `entity/src/entities` 文件夹。

生成实体文件后，可以在 `entity/src/lib.rs` 中添加以下行来重新导出生成的实体：

```rust
mod entities;
pub use entities::*;
```
</details>

```
entity
├── Cargo.toml      # 包含 SeaORM 依赖
└── src
    ├── lib.rs      # 重新导出 SeaORM 和实体
    └── post.rs     # 定义 `post` 实体
```

指定 SeaORM 依赖。

```toml title="entity/Cargo.toml"
[dependencies]
sea-orm = { version = "1.1.0" }
```

### 应用程序 crate

这是应用程序逻辑所在的地方。

创建一个包含 app、entity 和 migration crate 的工作区，并在 app crate 中导入 entity crate。

如果你想捆绑迁移工具到应用的中，你也可以导入 migration crate。

```toml title="./Cargo.toml"
[workspace]
members = [".", "entity", "migration"]

[dependencies]
entity = { path = "entity" }
migration = { path = "migration" } # 视你的需要而定

[dependencies]
sea-orm = { version = "1.1.0", features = [..] }
```

然后，在应用中，你可以在启动时运行迁移。

```rust title="src/main.rs"
use migration::{Migrator, MigratorTrait};

let connection = sea_orm::Database::connect(&database_url).await?;
Migrator::up(&connection, None).await?;
```