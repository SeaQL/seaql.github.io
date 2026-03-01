# 数据库连接

要获取数据库连接，请使用 [`Database`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/struct.Database.html) 接口：

```rust
let db: DatabaseConnection = Database::connect("protocol://username:password@host/database").await?;
```

`protocol` 可以是 `mysql:`、`postgres:` 或 `sqlite:`。

`host` 通常是 `localhost`、域名或 IP 地址。

:::tip

如果 `localhost` 无法使用，请尝试使用 IP 地址和端口号，例如 `127.0.0.1:3306` 或 `192.168.x.x`。

:::

在底层，会创建一个 [`sqlx::Pool`](https://docs.rs/sqlx/0.9/sqlx/struct.Pool.html)，并由 [`DatabaseConnection`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/struct.DatabaseConnection.html) 持有。

<details>
<summary>2.0 中的变更</summary>

`DatabaseConnection` 现在是一个包装内部 `DatabaseConnectionType` 枚举的结构体。在 1.0 中它直接是一个枚举。

</details>

每次在其上调用 `execute` 或 `query_one/all` 时，都会从连接池中获取并释放一个连接。

多个查询会在您对它们执行 `await` 时并行执行。

## 连接字符串

以下是一些数据库特定选项的提示：

### MySQL

```
mysql://username:password@host/database
```

### Postgres

#### 指定 schema

```
postgres://username:password@host/database?options=--search_path=my_schema
```

### SQLite

#### 内存模式

```
sqlite::memory:
```

#### 创建文件（若不存在）

```
sqlite://path/to/db.sqlite?mode=rwc
```

#### 只读

```
sqlite://path/to/db.sqlite?mode=ro
```

## 连接选项

要配置连接，请使用 [`ConnectOptions`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/struct.ConnectOptions.html) 接口：

```rust
let mut opt = ConnectOptions::new("protocol://username:password@host/database");
opt.max_connections(100)
    .min_connections(5)
    .connect_timeout(Duration::from_secs(8))
    .acquire_timeout(Duration::from_secs(8))
    .idle_timeout(Duration::from_secs(8))
    .max_lifetime(Duration::from_secs(8))
    .sqlx_logging(false) // disable SQLx logging
    .sqlx_logging_level(log::LevelFilter::Info)
    .set_schema_search_path("my_schema"); // set default Postgres schema

let db = Database::connect(opt).await?;
```

## 检查连接是否有效

检查与数据库的连接是否仍然有效。

```rust
async fn check(db: DatabaseConnection) {
    assert!(db.ping().await.is_ok());
    db.clone().close().await;
    assert!(matches!(db.ping().await, Err(DbErr::ConnectionAcquire)));
}
```

## 关闭连接

连接会在 drop 时自动关闭。要显式关闭连接，请调用 `close` 方法。

```rust
let db = Database::connect(url).await?;

// Closing connection here
db.close().await?;
```
