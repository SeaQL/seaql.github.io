# Database Connection

To obtain a database connection, use the [`Database`](https://docs.rs/sea-orm/*/sea_orm/struct.Database.html) interface:

```rust
let db: DatabaseConnection = Database::connect("protocol://username:password@host/database").await?;
```

`protocol` can be `mssql:`, etc.

`host` is usually `localhost`, a domain name or an IP address.

:::tip

If you can't get `localhost` to work, try putting in an IP address and port number, e.g. `127.0.0.1:1433` or even `192.168.x.x`.

:::

Under the hood, a `sqlz::Pool` is created and owned by [`DatabaseConnection`](https://docs.rs/sea-orm/*/sea_orm/enum.DatabaseConnection.html).

Each time you call `execute` or `query_one/all` on it, a connection will be acquired and released from the pool.

Multiple queries will execute in parallel as you `await` on them.

## Connection String

Here are some tips for database specific options:

### MSSQL

#### Specify a schema

If the schema is `dbo`, simply write:

```
mssql://username:password@host/database
```

Or, specify the schema name by providing an extra `currentSchema` query param.

```
mssql://username:password@host/database?currentSchema=my_schema
```

#### Trust Peer Certificate

You can trust peer certificate by providing an extra `trustCertificate` query param.

```
mssql://username:password@host/database?trustCertificate=true
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
    .sqlx_logging_level(log::LevelFilter::Info);

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
