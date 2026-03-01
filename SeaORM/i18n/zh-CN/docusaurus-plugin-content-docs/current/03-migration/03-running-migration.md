# 运行迁移

定义好迁移后，你可以在终端中手动运行，也可以在应用启动时自动执行。

## 命令行界面 (CLI)

迁移可以在终端中手动运行。`DATABASE_URL` 必须在环境变量中设置，配置方法请参阅[此处](04-generate-entity/01-sea-orm-cli.md#配置环境)。

支持的命令：
- `init`：初始化迁移目录
- `generate`：生成新的迁移文件
- `up`：应用所有待执行的迁移
- `up -n 10`：应用 10 个待执行的迁移
- `down`：回滚最近一次已应用的迁移
- `down -n 10`：回滚最近 10 个已应用的迁移
- `status`：检查所有迁移的状态
- `fresh`：删除数据库中的所有表，然后重新应用所有迁移
- `refresh`：回滚所有已应用的迁移，然后重新应用所有迁移
- `reset`：回滚所有已应用的迁移

### 通过 `sea-orm-cli`

`sea-orm-cli` 底层会执行 `cargo run --manifest-path ./migration/Cargo.toml -- COMMAND`。

```shell
$ sea-orm-cli migrate COMMAND
```

你可以自定义 manifest 路径。

```shell
$ sea-orm-cli migrate COMMAND -d ./other/migration/dir
```

### 通过 SeaSchema Migrator CLI

运行 `migration/main.rs` 中定义的 migrator CLI。

```shell
cd migration
cargo run -- COMMAND
```

## 以编程方式运行迁移

你可以在应用启动时通过 `Migrator` 执行迁移，它实现了 [`MigratorTrait`](https://docs.rs/sea-orm-migration/*/sea_orm_migration/migrator/trait.MigratorTrait.html)。

```rust title="src/main.rs"
use migration::{Migrator, MigratorTrait};

/// Apply all pending migrations
Migrator::up(db, None).await?;

/// Apply 10 pending migrations
Migrator::up(db, Some(10)).await?;

/// Rollback all applied migrations
Migrator::down(db, None).await?;

/// Rollback last 10 applied migrations
Migrator::down(db, Some(10)).await?;

/// Check the status of all migrations
Migrator::status(db).await?;

/// Drop all tables from the database, then reapply all migrations
Migrator::fresh(db).await?;

/// Rollback all applied migrations, then reapply all migrations
Migrator::refresh(db).await?;

/// Rollback all applied migrations
Migrator::reset(db).await?;
```

## 在任意 PostgreSQL Schema 上运行迁移

默认情况下，迁移会在 `public` schema 上运行。你可以在 CLI 或以编程方式运行迁移时覆盖此设置。

对于 CLI，你可以使用 `-s` / `--database_schema` 选项指定目标 schema：
* 通过 sea-orm-cli：`sea-orm-cli migrate -u postgres://root:root@localhost/database -s my_schema`
* 通过 SeaORM migrator：`cargo run -- -u postgres://root:root@localhost/database -s my_schema`

你也可以以编程方式在目标 schema 上运行迁移：

```rust
let connect_options = ConnectOptions::new("postgres://root:root@localhost/database")
    .set_schema_search_path("my_schema") // Override the default schema
    .to_owned();

let db = Database::connect(connect_options).await?

migration::Migrator::up(&db, None).await?;
```

:::tip SQL Server (MSSQL) backend

在任意 MSSQL schema 上运行迁移的配置请参阅[此处](https://www.sea-ql.org/SeaORM-X/docs/migration/running-migration/)。

:::

## 检查迁移状态

你可以使用 `MigratorTrait::get_pending_migrations()` 和 `MigratorTrait::get_applied_migrations()` 来获取迁移列表。

```rust
let migrations = Migrator::get_pending_migrations(db).await?;
assert_eq!(migrations.len(), 5);

let migration = migrations[0];
assert_eq!(migration.name(), "m20220118_000002_create_fruit_table");
assert_eq!(migration.status(), MigrationStatus::Pending);
```
