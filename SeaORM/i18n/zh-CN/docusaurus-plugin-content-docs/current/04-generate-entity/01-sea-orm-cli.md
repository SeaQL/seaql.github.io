# 使用 `sea-orm-cli`

首先，使用 `cargo` 安装 `sea-orm-cli`。

```shell
cargo install sea-orm-cli@^2.0.0-rc
```

:::tip SQL Server (MSSQL) 后端

有关支持 MSSQL 的 `sea-orm-cli` 的安装和使用方法，请参阅[此处](https://www.sea-ql.org/SeaORM-X/docs/generate-entity/sea-orm-cli/)。

:::

## 配置环境

在环境中设置 `DATABASE_URL`，或在项目根目录创建 `.env` 文件。指定数据库连接。

```env title=".env"
DATABASE_URL=protocol://username:password@localhost/database
```

## 获取帮助

在任何 CLI 命令或子命令上使用 `-h` 标志获取帮助。

```shell
# List all available commands
sea-orm-cli -h

# List all subcommands available in `generate` command
sea-orm-cli generate -h

# Show how to use `generate entity` subcommand
sea-orm-cli generate entity -h
```

## 生成 Entity 文件

发现数据库中的所有表，并为每个表生成对应的 SeaORM entity 文件。

支持的数据库：
- MySQL
- PostgreSQL
- SQLite

命令行选项：
- `-u` / `--database-url`：数据库 URL（默认：ENV 中指定的 DATABASE_URL）
- `-s` / `--database-schema`：数据库架构（默认：ENV 中指定的 DATABASE_SCHEMA）
    - 对于 MySQL 和 SQLite，此参数会被忽略
    - 对于 PostgreSQL，此参数可选，默认值为 'public'
- `-o` / `--output-dir`：entity 文件输出目录（默认：当前目录）
- `-v` / `--verbose`：打印调试信息
- `-l` / `--lib`：将索引文件生成为 `lib.rs` 而非 `mod.rs`
- `--include-hidden-tables`：从隐藏表生成 entity 文件（默认情况下，以下划线开头的表名被视为隐藏并被忽略）
- `--ignore-tables`：跳过为指定表生成 entity 文件（默认：`seaql_migrations`）
- `--compact-format`：生成[紧凑格式](04-generate-entity/02-entity-format.md)的 entity 文件（默认：true）
- `--expanded-format`：生成[展开格式](13-internal-design/05-expanded-entity-format.md)的 entity 文件
- `--with-serde`：自动为 entity 派生 serde 的 Serialize / Deserialize 特征（`none`、`serialize`、`deserialize`、`both`）（默认：`none`）
    - `--serde-skip-deserializing-primary-key`：为主键字段生成带有 `#[serde(skip_deserializing)]` 标记的 entity 模型
    - `--serde-skip-hidden-column`：为隐藏列（列名以 `_` 开头）字段生成带有 `#[serde(skip)]` 标记的 entity 模型
- `--date-time-crate`：用于生成 entity 的 datetime crate（`chrono`、`time`）（默认：`chrono`）
- `--max-connections`：连接池中初始化的最大数据库连接数（默认：`1`）
- `--model-extra-derives`：向生成的模型结构体追加额外的 derive 宏
- `--model-extra-attributes`：向生成的模型结构体追加额外的属性
- `--enum-extra-derives`：向生成的枚举追加额外的 derive 宏
- `--enum-extra-attributes`：向生成的枚举追加额外的属性
- `--seaography`：为 seaography 集成在 entity 中生成额外的结构体

自 1.1.6 起：
- `--with-prelude`：
    - `all`：默认值，CLI 工具保持当前行为（无破坏性变更），会生成 prelude.rs 文件并添加到 mod.rs（或 lib.rs）。
    - `none`：不会生成 prelude.rs 文件，也不会将其添加到 mod.rs。
    - `all-allow-unused-imports`：生成 prelude.rs 文件并添加到 mod.rs，但会在 prelude.rs 头部追加内部属性 `#![allow(unused_imports)]`。
- `--impl-active-model-behavior`：生成空的 `ActiveModelBehavior` 实现
- `--acquire_timeout`：用于 schema 发现的连接获取超时时间（秒）

自 2.0.0 起：
- `--entity-format`：
    - `dense`：新的 entity 格式
    - `compact`：1.0 中的 entity 格式
    - `expanded`：0.x 中的 entity 格式
- `--big-integer-type`：对 `bigint` 使用 `i32` 或 `i64`，适用于 SQLite

```shell
# Generate entity files of database `bakery` to `./src/entity`
sea-orm-cli generate entity \
    --database-url protocol://username:password@localhost/bakery \
    --output-dir ./src/entity \
    --entity-format dense
```
