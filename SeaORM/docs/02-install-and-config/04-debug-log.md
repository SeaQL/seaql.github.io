# Debug Log

SeaORM and the underlying database driver [`SQLx`](https://crates.io/crates/sqlx) both log debug messages via [`log`](https://crates.io/crates/log) crate.

You need to choose one of the [logging implementations](https://docs.rs/log/0.4.14/log/#available-logging-implementations) to capture and view the debug log. We recommand using [`env_logger`](https://crates.io/crates/env_logger), you can see the snippet below and a complete example [here](https://github.com/SeaQL/sea-orm/blob/master/examples/tokio/src/main.rs).

```rust
pub async fn main() {
    env_logger::builder()
        .filter_level(log::LevelFilter::Debug)
        .is_test(true)
        .init();

    // ...
}
```
