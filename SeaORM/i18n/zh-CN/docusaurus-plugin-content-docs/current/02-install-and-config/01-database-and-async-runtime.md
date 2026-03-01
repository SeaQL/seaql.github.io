# 数据库与异步执行环境

:::caution We need your support! ⭐
感谢您使用 SeaORM。请为我们的 [GitHub repo](https://github.com/SeaQL/sea-orm) 点颗星!
:::

首先，将 `sea-orm` 添加到 `Cargo.toml` 的 `[dependencies]` 部分。

```toml title="Cargo.toml"
sea-orm = { version = "2.0.0-rc", features = [ <DATABASE_DRIVER>, <ASYNC_RUNTIME>, "macros" ] }
```

您必须选择一个 `DATABASE_DRIVER` 和一个 `ASYNC_RUNTIME`。如果您使用 SeaORM 生成的实体（大多数情况下会使用），则需要 `macros`。

## DATABASE_DRIVER

您可以从以下选项中选择一个或多个：

+ `sqlx-mysql` - SQLx MySQL 和 MariaDB
+ `sqlx-postgres` - SQLx PostgreSQL
+ `sqlx-sqlite` - SQLx SQLite
+ `rusqlite` - Rusqlite*

*Rusqlite 支持由另一个 crate [`sea-orm-sync`](https://github.com/SeaQL/sea-orm/tree/master/sea-orm-sync) 提供。

:::tip SQL Server (MSSQL) backend

MSSQL 驱动的安装和配置请参阅[此处](https://www.sea-ql.org/SeaORM-X/docs/install-and-config/database-and-async-runtime/)。

:::

## ASYNC_RUNTIME

您必须从以下选项中选择一个：`runtime-tokio-native-tls`、`runtime-tokio-rustls`，或者如果仅使用 SQLite，可选择 `runtime-tokio`。

基本上，它们的形式为 `runtime-ASYNC_RUNTIME[-TLS_LIB]`：

+ `ASYNC_RUNTIME` 可以是 [`tokio`](https://crates.io/crates/tokio)
    + `async-std` 已被弃用
+ `TLS_LIB` 为可选，可以是 [`native-tls`](https://crates.io/crates/native-tls) 或 [`rustls`](https://crates.io/crates/rustls)
    + `native-tls` 使用平台的原生安全设施，而 `rustls` 是（几乎）纯 Rust 实现。

## 额外功能

+ `debug-print` - 将每条 SQL 语句打印到 logger
+ `mock` - 用于单元测试的 mock 接口
+ `macros` - 过程宏，例如 `DeriveEntityModel`
+ `rbac` - 基于角色的访问控制
+ `seaography` - 启用 GraphQL 支持
+ `schema-sync` - 为 Entity 优先工作流程启用 `SchemaBuilder`
<br/>
+ `with-chrono` - 支持 [`chrono`](https://crates.io/crates/chrono) 类型
+ `with-time` - 支持 [`time`](https://crates.io/crates/time) 类型
+ `with-json` - 支持 [`serde-json`](https://crates.io/crates/serde-json) 类型
+ `with-rust_decimal` - 支持 [`rust_decimal`](https://crates.io/crates/rust_decimal) 类型
+ `with-bigdecimal` - 支持 [`bigdecimal`](https://crates.io/crates/bigdecimal) 类型
+ `with-uuid` - 支持 [`uuid`](https://crates.io/crates/uuid) 类型
+ `with-ipnetwork` - 支持 Postgres [`ipnetwork`](https://crates.io/crates/ipnetwork)
+ `postgres-vector` - 支持 Postgres [`pgvector`](https://crates.io/crates/pgvector)
+ `with-arrow` - 支持 [Apache Arrow](https://docs.rs/arrow)
+ `postgres-array` - 支持 Postgres 中的数组类型，默认启用
<br/>
+ `sqlite-use-returning-for-3_35` - 为 SQLite 使用 returning，默认启用
+ `mariadb-use-returning` - 为 MariaDB 使用 returning
