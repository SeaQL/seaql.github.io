# 使用 `sea-orm-cli`

首先，使用 `cargo` 安装 `sea-orm-cli`。

```shell
cargo install sea-orm-cli@1.1.0
```

:::tip SQL Server (MSSQL) 后端

带有 MSSQL 支持的 `sea-orm-cli` 的安装与使用说明见[此处](https://www.sea-ql.org/SeaORM-X/docs/generate-entity/sea-orm-cli/)。

:::

## 配置环境

在环境变量中设置 `DATABASE_URL`，或在项目根目录创建一个 `.env` 文件，用于指定数据库连接。

```env title=".env"
DATABASE_URL=protocol://username:password@localhost/database
```

## 获取帮助

在任意 CLI 命令或子命令使用 `-h` 选项来查看帮助。

```shell
# 列出所有可用命令
sea-orm-cli -h

# 列出 `generate` 命令中所有可用的子命令
sea-orm-cli generate -h

# 显示如何使用 `generate entity` 子命令
sea-orm-cli generate entity -h
```

## 生成实体文件

扫描数据库中的所有表，并为每个表生成相对应的 SeaORM 实体文件。

支持的数据库：

- MySQL
- PostgreSQL
- SQLite

命令行选项：

- `-u` / `--database-url`：数据库 URL（默认：环境变量 `DATABASE_URL`）
- `-s` / `--database-schema`：数据库模式（schema）（默认：环境变量 `DATABASE_SCHEMA`）
  - 对于 MySQL 与 SQLite，此参数将被忽略
  - 对于 PostgreSQL，此参数可选，默认值为 `public`
- `-o` / `--output-dir`：实体文件输出目录（默认：当前目录）
- `-v` / `--verbose`：打印调试消息
- `-l` / `--lib`：将索引文件生成为 `lib.rs` 而不是 `mod.rs`
- `--include-hidden-tables`：为隐藏表生成实体（默认以下划线开头的表会被忽略）
- `--ignore-tables`：跳过为指定表生成实体文件（默认：`seaql_migrations`）
- `--compact-format`：生成[紧凑格式](04-generate-entity/02-entity-format.md)的实体文件（默认：true）
- `--expanded-format`：生成[扩展格式](12-internal-design/05-expanded-entity-format.md)的实体文件
- `--with-serde`：控制是否为实体实体生成 serde 的 Serialize/Deserialize derive（`none`、`serialize`、`deserialize`、`both`）（默认：`none`）
  - `--serde-skip-deserializing-primary-key`：为实体模型的主键添加 `#[serde(skip_deserializing)]` 属性
  - `--serde-skip-hidden-column`：为隐藏列（列名以下划线开头）字段添加 `#[serde(skip)]` 属性
- `--date-time-crate`：用于生成实体的日期时间 crate（`chrono`、`time`）（默认：`chrono`）
- `--max-connections`：连接池中初始化的最大数据库连接数（默认：`1`）
- `--model-extra-derives`：为生成的模型结构体附加额外的 derive 宏
- `--model-extra-attributes`：为生成的模型结构体附加额外的属性
- `--enum-extra-derives`：为生成的枚举附加额外的 derive 宏
- `--enum-extra-attributes`：为生成的枚举附加额外的属性
- `--seaography`：在实体中生成与 Seaography 集成的额外辅助结构

```shell
# 将数据库 `bakery` 的实体文件生成到 `entity/src` 目录
sea-orm-cli generate entity -u protocol://username:password@localhost/bakery -o entity/src
```
