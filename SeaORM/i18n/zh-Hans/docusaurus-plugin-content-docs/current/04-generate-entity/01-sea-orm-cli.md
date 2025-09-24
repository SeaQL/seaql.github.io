# 使用 `sea-orm-cli`

首先，使用 `cargo` 安装 `sea-orm-cli`。

```shell
cargo install sea-orm-cli@1.1.0
```

:::tip SQL Server (MSSQL) 后端

支持 MSSQL 的 `sea-orm-cli` 的安装和使用可以在[这里](https://www.sea-ql.org/SeaORM-X/docs/generate-entity/sea-orm-cli/)找到。

:::

## 配置环境

在你的环境中设置 `DATABASE_URL`，或者在你的项目根目录中创建一个 `.env` 文件。指定你的数据库连接。

```env title=".env"
DATABASE_URL=protocol://username:password@localhost/database
```

## 获取帮助

在任何 CLI 命令或子命令上使用 `-h` 标志以获取帮助。

```shell
# 列出所有可用命令
sea-orm-cli -h

# 列出 `generate` 命令中所有可用的子命令
sea-orm-cli generate -h

# 显示如何使用 `generate entity` 子命令
sea-orm-cli generate entity -h
```

## 生成实体文件

发现数据库中的所有表，并为每个表生成相应的 SeaORM 实体文件。

支持的数据库：
- MySQL
- PostgreSQL
- SQLite

命令行选项：
- `-u` / `--database-url`：数据库 URL（默认：ENV 中指定的 DATABASE_URL）
- `-s` / `--database-schema`：数据库 schema（默认：ENV 中指定的 DATABASE_SCHEMA）
    - 对于 MySQL 和 SQLite，此参数将被忽略
    - 对于 PostgreSQL，此参数是可选的，默认值为“public”
- `-o` / `--output-dir`：实体文件输出目录（默认：当前目录）
- `-v` / `--verbose`：打印调试消息
- `-l` / `--lib`：将索引文件生成为 `lib.rs` 而不是 `mod.rs`
- `--include-hidden-tables`：从隐藏表（名称以下划线开头的表默认隐藏并忽略）生成实体文件
- `--ignore-tables`：跳过为指定表生成实体文件（默认：`seaql_migrations`）
- `--compact-format`：生成[紧凑格式](04-generate-entity/02-entity-format.md)的实体文件（默认：true）
- `--expanded-format`：生成[扩展格式](12-internal-design/05-expanded-entity-format.md)的实体文件
- `--with-serde`：自动为实体派生 serde Serialize / Deserialize trait（`none`、`serialize`、`deserialize`、`both`）（默认：`none`）
    - `--serde-skip-deserializing-primary-key`：生成带有主键字段标记为 `#[serde(skip_deserializing)]` 的实体模型
    - `--serde-skip-hidden-column`：生成带有隐藏列（列名以下划线开头）字段标记为 `#[serde(skip)]` 的实体模型
- `--date-time-crate`：用于生成实体的日期时间 crate（`chrono`、`time`）（默认：`chrono`）
- `--max-connections`：连接池中要初始化的最大数据库连接数（默认：`1`）
- `--model-extra-derives`：向生成的模型结构体追加额外的派生宏
- `--model-extra-attributes`：向生成的模型结构体追加额外的属性
- `--enum-extra-derives`：向生成的枚举追加额外的派生宏
- `--enum-extra-attributes`：向生成的枚举追加额外的属性
- `--seaography`：在实体中生成附加结构体以进行 seaography 集成

```shell
# 将数据库 `bakery` 的实体文件生成到 `entity/src`
sea-orm-cli generate entity -u protocol://username:password@localhost/bakery -o entity/src