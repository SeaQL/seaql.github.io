# 调试日志

SeaORM 通过 [`tracing`](https://crates.io/crates/tracing) crate 记录调试消息。

你可以通过 `debug-print` 功能标志（feature flag）启用 SeaORM 的日志记录功能：

```toml
[dependencies.sea-orm]
version = "1.1.0"
features = ["debug-print"]
```

您需要设置 [`tracing-subscriber`](https://crates.io/crates/tracing-subscriber) 来捕获和查看调试日志。请参阅以下的代码片段和此处的[完整示例](https://github.com/SeaQL/sea-orm/blob/master/examples/actix_example/src/main.rs)。

```rust
pub async fn main() {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::DEBUG)
        .with_test_writer()
        .init();

    // ...
}
```

SeaORM 的调试打印会将参数注入到 SQL 字符串中，使其更易于阅读。你会看到 `SELECT "chef"."name" FROM "chef" WHERE "chef"."id" = 100`，而不是 `SELECT "chef"."name" FROM "chef" WHERE "chef"."id" = $1`。

## SQLx 日志记录

SQLx 也默认记录日志。如果启用 SeaORM 的 `debug-print`，可以向 `connect()` 传递 [`ConnectOptions`](https://docs.rs/sea-orm/*/sea_orm/struct.ConnectOptions.html) 来禁用 SQLx 的日志。

```rust
let mut opt = ConnectOptions::new("protocol://username:password@host/database".to_owned());
opt
    .sqlx_logging(false) // 禁用 SQLx 日志
    .sqlx_logging_level(log::LevelFilter::Info); // 或者设置 SQLx 日志级别

let db = Database::connect(opt).await?;
```
