# Database & Async Runtime

:::caution We need your support! ⭐
Thank you for using SeaORM. Please star our [GitHub repo](https://github.com/SeaQL/sea-orm)!
:::

First, add `sea-orm` to the `[dependencies]` section of `Cargo.toml`.

```toml title="Cargo.toml"
sea-orm = { version = "2.0.0-rc", features = [ <DATABASE_DRIVER>, <ASYNC_RUNTIME>, "macros" ] }
```

You must choose a `DATABASE_DRIVER` and an `ASYNC_RUNTIME`. `macros` is needed if you use SeaORM's generated entities (most likely).

## DATABASE_DRIVER

You can choose one or more from:

+ `sqlx-mysql` - SQLx MySQL and MariaDB
+ `sqlx-postgres` - SQLx PostgreSQL
+ `sqlx-sqlite` - SQLx SQLite
+ `rusqlite` - Rusqlite*

*Rusqlite support is offered by another crate [`sea-orm-sync`](https://github.com/SeaQL/sea-orm/tree/master/sea-orm-sync).

:::tip SQL Server (MSSQL) backend

The installation and configuration of MSSQL driver can be found [here](https://www.sea-ql.org/SeaORM-X/docs/install-and-config/database-and-async-runtime/).

:::

## ASYNC_RUNTIME

You have to choose one from: `runtime-tokio-native-tls`, `runtime-tokio-rustls`, or `runtime-tokio` if you're using SQLite only.

Basically, they are in the form of `runtime-ASYNC_RUNTIME[-TLS_LIB]`:

+ `ASYNC_RUNTIME` can be [`tokio`](https://crates.io/crates/tokio)
    + `async-std` has been deprecated
+ `TLS_LIB` is optional, and can either be [`native-tls`](https://crates.io/crates/native-tls) or [`rustls`](https://crates.io/crates/rustls)
    + `native-tls` uses the platform's native security facilities, while `rustls` is an (almost) pure Rust implementation.

## Extra features

+ `debug-print` - print every SQL statement to logger
+ `mock` - mock interface for unit testing
+ `macros` - procedural macros, e.g. `DeriveEntityModel`
+ `rbac` - role-based access control
+ `seaography` - enable GraphQL support
+ `schema-sync` - enable `SchemaBuilder` for Entity-first workflow
<br/>
+ `with-chrono` - support [`chrono`](https://crates.io/crates/chrono) types
+ `with-time` - support [`time`](https://crates.io/crates/time) types
+ `with-json` - support [`serde-json`](https://crates.io/crates/serde-json) types
+ `with-rust_decimal` - support [`rust_decimal`](https://crates.io/crates/rust_decimal) types
+ `with-bigdecimal` - support [`bigdecimal`](https://crates.io/crates/bigdecimal) types
+ `with-uuid` - support [`uuid`](https://crates.io/crates/uuid) types
+ `with-ipnetwork` - support Postgres [`ipnetwork`](https://crates.io/crates/ipnetwork)
+ `postgres-vector` - support Postgres [`pgvector`](https://crates.io/crates/pgvector)
+ `postgres-array` - support array types in Postgres, enabled by default
<br/>
+ `sqlite-use-returning-for-3_35` - use returning for SQLite, enabled by default
+ `mariadb-use-returning` - use returning for MariaDB
