# Debug Log

SeaORM (with `debug-print` feature turned on) and SQLx both log debug messages via the [`log`](https://crates.io/crates/log) crate.

You need to choose one of the [logging implementations](https://docs.rs/log/0.4.14/log/#available-logging-implementations) to capture and view the debug log. To use [`env_logger`](https://crates.io/crates/env_logger), see the snippet below and a complete example [here](https://github.com/SeaQL/sea-orm/blob/master/examples/tokio/src/main.rs).

```rust
pub async fn main() {
    env_logger::builder()
        .filter_level(log::LevelFilter::Debug)
        .is_test(true)
        .init();

    // ...
}
```

To filter debug log from `sea_orm`, you can:

```bash
$ RUST_LOG=debug cargo run 2>&1 | grep sea_orm
[2021-02-02T20:20:20Z DEBUG sea_orm::driver::sqlx_mysql] SELECT `cake`.`id`, `cake`.`name` FROM `cake` LIMIT 1
```