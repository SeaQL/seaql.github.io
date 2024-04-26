# Database & Async Runtime

First of all, please star our [GitHub repo](https://github.com/SeaQL/sea-orm)! Your support is vital to the continued maintenance of SeaORM.

Then, add `sea-orm` to the `[dependencies]` section of your `Cargo.toml`.

```toml title="Cargo.toml"
sea-orm = { version = "^0", features = [ <DATABASE_DRIVER>, <ASYNC_RUNTIME>, "macros" ] }
```

You must choose a `DATABASE_DRIVER` and an `ASYNC_RUNTIME`. `macros` is needed if you use SeaORM's generated entities (most likely).

## DATABASE_DRIVER

You can choose one or more from:

+ `sqlx-mysql` - SQLx MySQL and MariaDB
+ `sqlx-postgres` - SQLx PostgreSQL
+ `sqlx-sqlite` - SQLx SQLite

See also: [SQLx docs](https://docs.rs/crate/sqlx/latest/features).

## ASYNC_RUNTIME

You have to choose one from:

`runtime-actix-native-tls`, `runtime-async-std-native-tls`, `runtime-tokio-native-tls`, `runtime-actix-rustls`, `runtime-async-std-rustls`, `runtime-tokio-rustls`

Basically, they are in the form of `runtime-ASYNC_RUNTIME-TLS_LIB`:

+ `ASYNC_RUNTIME` can be [`actix`](https://crates.io/crates/actix), [`async-std`](https://crates.io/crates/async-std), or [`tokio`](https://crates.io/crates/tokio)
+ `TLS_LIB` can either be [`native-tls`](https://crates.io/crates/native-tls) or [`rustls`](https://crates.io/crates/rustls)

1. Choose the ASYNC_RUNTIME corresponding to your Rust web framework:

| ASYNC_RUNTIME | Web Framework  |
| :-----------: | :------------: |
| `actix` | [`Actix`](https://actix.rs/) |
| `async-std` | [`Tide`](https://docs.rs/tide) |
| `tokio` | [`Axum`](https://docs.rs/axum), [`Rocket`](https://rocket.rs/), [`Poem`](https://docs.rs/poem) |

2. `native-tls` uses the platform's native security facilities, while `rustls` is a pure Rust implementation.

## Extra features

+ `debug-print` - print every SQL statement to logger
+ `mock` - mock interface for unit testing
+ `macros` - procedural macros for your convenient
+ `with-chrono` - support [`chrono`](https://crates.io/crates/chrono) types
+ `with-time` - support [`time`](https://crates.io/crates/time) types
+ `with-json` - support [`serde-json`](https://crates.io/crates/serde-json) types
+ `with-rust_decimal` - support [`rust_decimal`](https://crates.io/crates/rust_decimal) types
+ `with-bigdecimal` - support [`bigdecimal`](https://crates.io/crates/bigdecimal) types
+ `with-uuid` - support [`uuid`](https://crates.io/crates/uuid) types
+ `postgres-array` - support array types in Postgres
+ `sea-orm-internal` - opt-in unstable internal APIs (for accessing re-export SQLx types)
