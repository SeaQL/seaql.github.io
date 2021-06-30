# Database & Async Runtime

First, add `sea-orm` to the `[dependencies]` section of your `Cargo.toml`.

```toml
sea-orm = { version = "^0", features = [ DATABASE_DRIVER, ASYNC_RUNTIME, "macros" ], default-features = false }
```

You must choose a `DATABASE_DRIVER` and an `ASYNC_RUNTIME`. `macros` is needed if you use SeaORM's generated entities (most likely).

## DATABASE_DRIVER

You can choose one or more from:

+ `sqlx-mysql` - SQLx MySQL
+ `sqlx-postgres` - SQLx Postgres
+ `sqlx-sqlite` - SQLx SQLite

See also: [SQLx docs](https://docs.rs/crate/sqlx/latest/features).

## ASYNC_RUNTIME

You have to choose one from:

`runtime-actix-native-tls`, `runtime-async-std-native-tls`, `runtime-tokio-native-tls`, `runtime-actix-rustls`, `runtime-async-std-rustls`, `runtime-tokio-rustls`

Basically, they are in the form of `runtime-ASYNC_RUNTIME-TLS_LIB`:

+ `ASYNC_RUNTIME` can be [`actix`](https://crates.io/crates/actix), [`async-std`](https://crates.io/crates/async-std) and [`tokio`](https://crates.io/crates/tokio)
+ `TLS_LIB` can either be `native-tls` or `rustls`

Tip: `Rocket v0.5` uses `tokio`.

## Extra features

`mock` - mock database for unit testing

`with-json` - interoperate with `serde_json`