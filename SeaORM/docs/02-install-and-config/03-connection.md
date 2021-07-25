# Connection Pool

To obtain a database connection, you can simply:

```rust
let db: DatabaseConnection = Database::connect("sql://username:password@localhost/database").await?;
```

Under the hood, a [`sqlx::Pool`](https://docs.rs/sqlx/0.5.x/sqlx/struct.Pool.html) is created and owned by [`DatabaseConnection`](https://docs.rs/sea-orm/0.x/sea_orm/enum.DatabaseConnection.html).

Each time you call `execute` or `query_one/all` on it, a connection will be acquired and released from the pool.

Multiple queries will execute in parallel as you `await` on them.