# Database & Async Runtime

First, add `sea-orm` to the `[dependencies]` section of your `Cargo.toml`.

```toml title="Cargo.toml"
sea-orm = { version = "^0.5", features = [ <DATABASE_DRIVER>, <ASYNC_RUNTIME>, "macros" ], default-features = false }
```

You must choose a `DATABASE_DRIVER` and an `ASYNC_RUNTIME`. `macros` is needed if you use SeaORM's generated entities (most likely).

## DATABASE_DRIVER

You can choose one or more from:

+ `sqlx-mysql` - SQLx MySQL
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
| `tokio` | [`Rocket`](https://rocket.rs/) |

2. `native-tls` uses the platform's native security facilities, while `rustls` is a pure Rust implementation.

## Extra features

`debug-print` - print every SQL statement to logger

`mock` - mock interface for unit testing
