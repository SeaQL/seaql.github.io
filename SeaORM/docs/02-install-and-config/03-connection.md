# Connection Pool

To obtain a database connection, use the [`Database`](https://docs.rs/sea-orm/0.*/sea_orm/struct.Database.html) interface:

```rust
let db: DatabaseConnection = Database::connect("protocol://username:password@host/database").await?;
```

`protocol` can be `mysql:`, `postgres:` or `sqlite:`.

`host` is usually `localhost`, a domain name or an IP address.

Under the hood, a [`sqlx::Pool`](https://docs.rs/sqlx/0.5.x/sqlx/struct.Pool.html) is created and owned by [`DatabaseConnection`](https://docs.rs/sea-orm/0.*/sea_orm/enum.DatabaseConnection.html).

Each time you call `execute` or `query_one/all` on it, a connection will be acquired and released from the pool.

Multiple queries will execute in parallel as you `await` on them.