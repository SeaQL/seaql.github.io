# Debug Log

SeaORM logs debug messages via the [`tracing`](https://crates.io/crates/tracing) crate.

You can enable SeaORM's logging with the `debug-print` feature flag:

```toml
[dependencies.sea-orm]
version = "1.0.0-rc.5"
features = ["debug-print"]
```

You need to setup [`tracing-subscriber`](https://crates.io/crates/tracing-subscriber) to capture and view the debug log. See the snippet below and a complete example [here](https://github.com/SeaQL/sea-orm/blob/master/examples/actix_example/src/main.rs).

```rust
pub async fn main() {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::DEBUG)
        .with_test_writer()
        .init();

    // ...
}
```

SeaORM's debug print injects parameters into the SQL string, which makes it easier to read. Instead of seeing `SELECT "chef"."name" FROM "chef" WHERE "chef"."id" = $1`, you will see `SELECT "chef"."name" FROM "chef" WHERE "chef"."id" = 100`.

## SQLx Logging

SQLx also logs by default. If you turned on SeaORM's `debug-print`, you can disable SQLx's log by passing [`ConnectOptions`](https://docs.rs/sea-orm/*/sea_orm/struct.ConnectOptions.html) to `connect()`.

```rust
let mut opt = ConnectOptions::new("protocol://username:password@host/database".to_owned());
opt
    .sqlx_logging(false) // Disable SQLx log
    .sqlx_logging_level(log::LevelFilter::Info); // Or set SQLx log level

let db = Database::connect(opt).await?;
```
