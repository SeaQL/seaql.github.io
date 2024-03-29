# Debug Log

SeaORM (with `debug-print` feature turned on) logs debug messages via the [`tracing`](https://crates.io/crates/tracing) crate.

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

To filter debug log from `sea_orm`, you can:

```bash
$ RUST_LOG=debug cargo run 2>&1 | grep sea_orm
[2021-02-02T20:20:20Z DEBUG sea_orm::driver::sqlx_mysql] SELECT `cake`.`id`, `cake`.`name` FROM `cake` LIMIT 1
```

## Disabling SQLx Log

To configure the connection, use the [`ConnectOptions`](https://docs.rs/sea-orm/*/sea_orm/struct.ConnectOptions.html) interface:

```rust
let mut opt = ConnectOptions::new("protocol://username:password@host/database".to_owned());
opt.sqlx_logging(false) // Disabling SQLx log
    .sqlx_logging_level(log::LevelFilter::Info); // Setting SQLx log level

let db = Database::connect(opt).await?;
```
