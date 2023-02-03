# Connection Pool

To obtain a database connection, use the [`Database`](https://docs.rs/sea-orm/*/sea_orm/struct.Database.html) interface:

```rust
let db: DatabaseConnection = Database::connect("protocol://username:password@host/database").await?;
```

`protocol` can be `mysql:`, `postgres:` or `sqlite:`.

`host` is usually `localhost`, a domain name or an IP address.

Under the hood, a [`sqlx::Pool`](https://docs.rs/sqlx/0.5/sqlx/struct.Pool.html) is created and owned by [`DatabaseConnection`](https://docs.rs/sea-orm/*/sea_orm/enum.DatabaseConnection.html).

Each time you call `execute` or `query_one/all` on it, a connection will be acquired and released from the pool.

Multiple queries will execute in parallel as you `await` on them.

## Connect Options

To configure the connection, use the [`ConnectOptions`](https://docs.rs/sea-orm/*/sea_orm/struct.ConnectOptions.html) interface:

```rust
let mut opt = ConnectOptions::new("protocol://username:password@host/database".to_owned());
opt.max_connections(100)
    .min_connections(5)
    .connect_timeout(Duration::from_secs(8))
    .acquire_timeout(Duration::from_secs(8))
    .idle_timeout(Duration::from_secs(8))
    .max_lifetime(Duration::from_secs(8))
    .sqlx_logging(true)
    .sqlx_logging_level(log::LevelFilter::Info)
    .set_schema_search_path("my_schema".into()); // Setting default PostgreSQL schema

let db = Database::connect(opt).await?;
```

## Closing Connection

To close the connection explicitly, call the `close` method.

```rust
let db = Database::connect(url).await?;

// Closing connection here
db.close().await?;
```
