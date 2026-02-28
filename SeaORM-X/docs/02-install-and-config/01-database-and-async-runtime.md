# Database & Async Runtime

Add `sea-orm-x` to the `[dependencies]` section of `Cargo.toml`. You can use either a local path or a git dependency.

### Local Dependency

```toml title="Cargo.toml"
sea-orm = { version = "2.0.0-rc", path = "<SEA_ORM_X_ROOT>/sea-orm-x", features = [ <DATABASE_DRIVER>, <ASYNC_RUNTIME>, "macros" ] }
sea-orm-migration = { version = "2.0.0-rc", path = "<SEA_ORM_X_ROOT>/sea-orm-x/sea-orm-migration" }
```

### Git Dependency

Requires SSH access to the `sea-orm-x` repository. See [Git Authentication](https://doc.rust-lang.org/cargo/appendix/git-authentication.html) in the Cargo Book.

```toml title="Cargo.toml"
sea-orm = { git = "ssh://git@github.com/SeaQL/sea-orm-x.git", features = ["runtime-tokio-rustls", "sqlz-mssql", "macros"] }
sea-orm-migration = { git = "ssh://git@github.com/SeaQL/sea-orm-x.git" }
```

:::tip Troubleshooting Git Authentication

If Cargo's built-in SSH client fails, force it to use your system SSH client:

```toml title="~/.cargo/config.toml"
[net]
git-fetch-with-cli = true
```
:::

You must choose a `DATABASE_DRIVER` and an `ASYNC_RUNTIME`. `macros` is needed if you use SeaORM's generated entities (most likely).

## DATABASE_DRIVER

+ `sqlz-mssql` - SQLz MSSQL (SQL Server)

You can also enable drivers from the open-source SeaORM (`sqlx-mysql`, `sqlx-postgres`, `sqlx-sqlite`) alongside `sqlz-mssql` in the same codebase.

## ASYNC_RUNTIME

You have to choose one from:

`runtime-async-std-native-tls`, `runtime-tokio-native-tls`, `runtime-async-std-rustls`, `runtime-tokio-rustls`

These are in the form of `runtime-ASYNC_RUNTIME-TLS_LIB`:

+ `ASYNC_RUNTIME` can be [`async-std`](https://crates.io/crates/async-std) or [`tokio`](https://crates.io/crates/tokio)
+ `TLS_LIB` can either be [`native-tls`](https://crates.io/crates/native-tls) or [`rustls`](https://crates.io/crates/rustls)

| ASYNC_RUNTIME | Web Framework  |
| :-----------: | :------------: |
| `async-std` | [`Tide`](https://docs.rs/tide) |
| `tokio` | [`Axum`](https://docs.rs/axum), [`Actix`](https://actix.rs/), [`Poem`](https://docs.rs/poem), [`Rocket`](https://rocket.rs/) |

`native-tls` uses the platform's native security facilities, while `rustls` is a pure Rust implementation.

## Extra features

+ `debug-print` - print every SQL statement to logger
+ `mock` - mock interface for unit testing
+ `macros` - procedural macros for your convenience
+ `with-chrono` - support [`chrono`](https://crates.io/crates/chrono) types
+ `with-time` - support [`time`](https://crates.io/crates/time) types
+ `with-json` - support [`serde-json`](https://crates.io/crates/serde-json) types
+ `with-rust_decimal` - support [`rust_decimal`](https://crates.io/crates/rust_decimal) types
+ `with-bigdecimal` - support [`bigdecimal`](https://crates.io/crates/bigdecimal) types
+ `with-uuid` - support [`uuid`](https://crates.io/crates/uuid) types
+ `schema-sync` - entity-first schema sync (create tables from entity definitions)
+ `sea-orm-internal` - opt-in unstable internal APIs
