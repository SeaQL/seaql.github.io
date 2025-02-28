# Database Connection

To obtain a database connection, use the [`Database`](https://docs.rs/sea-orm/*/sea_orm/struct.Database.html) interface:

```rust
let db: DatabaseConnection = Database::connect("protocol://username:password@host/database").await?;
```

`protocol` can be `mysql:`, `postgres:` or `sqlite:`.

`host` is usually `localhost`, a domain name or an IP address.

:::tip

If you can't get `localhost` to work, try putting in an IP address and port number, e.g. `127.0.0.1:3306` or even `192.168.x.x`.

:::

Under the hood, a [`sqlx::Pool`](https://docs.rs/sqlx/0.5/sqlx/struct.Pool.html) is created and owned by [`DatabaseConnection`](https://docs.rs/sea-orm/*/sea_orm/enum.DatabaseConnection.html).

Each time you call `execute` or `query_one/all` on it, a connection will be acquired and released from the pool.

Multiple queries will execute in parallel as you `await` on them.

## Connection String

Here are some tips for database specific options:

### MySQL

```
mysql://username:password@host/database
```

### Postgres

#### Specify a schema

```
postgres://username:password@host/database?currentSchema=my_schema
```

### SQLite

#### In memory

```
sqlite::memory:
```

#### Create file if not exists

```
sqlite://path/to/db.sqlite?mode=rwc
```

#### Read only

```
sqlite://path/to/db.sqlite?mode=ro
```

## Connect Options

To configure the connection, use the [`ConnectOptions`](https://docs.rs/sea-orm/*/sea_orm/struct.ConnectOptions.html) interface:

```rust
let mut opt = ConnectOptions::new("protocol://username:password@host/database");
opt.max_connections(100)
    .min_connections(5)
    .connect_timeout(Duration::from_secs(8))
    .acquire_timeout(Duration::from_secs(8))
    .idle_timeout(Duration::from_secs(8))
    .max_lifetime(Duration::from_secs(8))
    .sqlx_logging(true)
    .sqlx_logging_level(log::LevelFilter::Info)
    .set_schema_search_path("my_schema"); // Setting default PostgreSQL schema

let db = Database::connect(opt).await?;
```

## Checking Connection is Valid

Checks if a connection to the database is still valid.

```rust
|db: DatabaseConnection| {
    assert!(db.ping().await.is_ok());
    db.clone().close().await;
    assert!(matches!(db.ping().await, Err(DbErr::ConnectionAcquire)));
}
```

## Closing Connection

The connection will be automatically closed on drop. To close the connection explicitly, call the `close` method.

```rust
let db = Database::connect(url).await?;

// Closing connection here
db.close().await?;
```
