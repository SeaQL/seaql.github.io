# 数据库与异步运行时

:::caution 我们需要您的支持！⭐
感谢您使用 SeaORM。请为我们的 [GitHub 仓库](https://github.com/SeaQL/sea-orm) 标星！您的支持对 SeaORM 的持续开发和维护至关重要。
:::

首先，将 `sea-orm` 添加到 `Cargo.toml` 的 `[dependencies]` 中。

```toml title="Cargo.toml"
sea-orm = { version = "1.1.0", features = [ <DATABASE_DRIVER>, <ASYNC_RUNTIME>, "macros" ] }
```

您必须选择一个 `DATABASE_DRIVER` 和一个 `ASYNC_RUNTIME`。如果您使用 SeaORM 生成的实体，则需要 `macros`。

## DATABASE_DRIVER

你可以从下列选项中选择一个或多个：

+ `sqlx-mysql` - SQLx 的 MySQL 和 MariaDB 驱动
+ `sqlx-postgres` - SQLx 的 PostgreSQL 驱动
+ `sqlx-sqlite` - SQLx 的 SQLite 驱动

另请参阅：[SQLx 文档](https://docs.rs/crate/sqlx/latest/features)。

:::tip SQL Server (MSSQL) 后端

有关 MSSQL 驱动程序的安装和配置，请参考[这里](https://www.sea-ql.org/SeaORM-X/docs/install-and-config/database-and-async-runtime/)

:::

## ASYNC_RUNTIME

你必须从以下选项中选择一个：

`runtime-async-std-native-tls`、`runtime-tokio-native-tls`、`runtime-async-std-rustls`、`runtime-tokio-rustls`

基本格式为 `runtime-ASYNC_RUNTIME-TLS_LIB`：

+ `ASYNC_RUNTIME` 可以是 [`async-std`](https://crates.io/crates/async-std) 或 [`tokio`](https://crates.io/crates/tokio)
+ `TLS_LIB` 可以是 [`native-tls`](https://crates.io/crates/native-tls) 或 [`rustls`](https://crates.io/crates/rustls)

1. 选择与你的 Rust Web 框架对应的 ASYNC_RUNTIME：

| ASYNC_RUNTIME | Web 框架 |
| :-----------: | :------------: |
| `async-std` | [`Tide`](https://docs.rs/tide) |
| `tokio` | [`Axum`](https://docs.rs/axum)、[`Actix`](https://actix.rs/)、[`Poem`](https://docs.rs/poem)、[`Rocket`](https://rocket.rs/) |

2. `native-tls` 使用平台的原生安全设施，而 `rustls` 是一个（几乎）纯 Rust 的实现。

## 额外功能

+ `debug-print` - 将每个 SQL 语句打印到日志
+ `mock` - 用于单元测试的模拟接口
+ `macros` - 方便的过程宏
+ `with-chrono` - [`chrono`](https://crates.io/crates/chrono) 类型支持
+ `with-time` - [`time`](https://crates.io/crates/time) 类型支持
+ `with-json` - [`serde-json`](https://crates.io/crates/serde-json) 类型支持
+ `with-rust_decimal` - [`rust_decimal`](https://crates.io/crates/rust_decimal) 类型支持
+ `with-bigdecimal` - [`bigdecimal`](https://crates.io/crates/bigdecimal) 类型支持
+ `with-uuid` - [`uuid`](https://crates.io/crates/uuid) 类型支持
+ `postgres-array` - 支持 Postgres 中的数组类型（当 `sqlx-postgres` 功能开启时自动启用）
+ `sea-orm-internal` - 选择性启用不稳定的内部 API（用于访问重新导出的 SQLx 类型）