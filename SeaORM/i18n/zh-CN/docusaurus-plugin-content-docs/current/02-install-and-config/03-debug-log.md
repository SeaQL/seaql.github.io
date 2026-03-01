# 调试日志

## 语句日志

SeaORM 通过 [`tracing`](https://crates.io/crates/tracing) crate 记录 debug 消息。

您可以使用 `debug-print` feature flag 启用 SeaORM 的日志记录：

```toml
[dependencies.sea-orm]
version = "2.0.0-rc"
features = ["debug-print"]
```

您需要配置 [`tracing-subscriber`](https://crates.io/crates/tracing-subscriber) 来捕获和查看 debug 日志。请参阅下面的代码片段以及完整示例[此处](https://github.com/SeaQL/sea-orm/blob/master/examples/actix_example/src/main.rs)。

```rust
pub async fn main() {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::DEBUG)
        .with_test_writer()
        .init();

    // ...
}
```

SeaORM 的 debug print 会将参数插入到 SQL 字符串中，使其更易于阅读。您不会看到：

```sql
SELECT "cake"."name" FROM "cake" WHERE "cake"."id" = $1
```

而是会看到：

```sql
SELECT "cake"."name" FROM "cake" WHERE "cake"."id" = 101
```

## SQLx 日志

SQLx 默认也会记录日志。如果您已开启 SeaORM 的 `debug-print`，可以通过将 [`ConnectOptions`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/struct.ConnectOptions.html) 传递给 `connect()` 来禁用 SQLx 的日志。

```rust
let mut opt = ConnectOptions::new("protocol://username:password@host/database".to_owned());
opt.sqlx_logging(false); // disable SQLx logging

let db = Database::connect(opt).await?;
```
