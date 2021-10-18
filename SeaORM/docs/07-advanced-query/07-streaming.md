# Streaming

Use async stream on any `Select` for memory efficiency.

```rust
// Stream all fruits
let mut stream = Fruit::find().stream(db).await?;

while let Some(item) = stream.try_next().await? {
    let item: fruit::ActiveModel = item.into();
    // do something with item
}
```

```rust
// Stream all fruits with name contains character "a"
let mut stream = Fruit::find()
    .filter(fruit::Column::Name.contains("a"))
    .order_by_asc(fruit::Column::Name)
    .stream(db)
    .await?;
```

Note that stream will persists the connection from connection pool until it gets dropped.

```rust
{
    // 3 connections are used
    let _ = Fruit::find().stream(db).await?;
    let _ = Fruit::find().stream(db).await?;
    let _ = Fruit::find().stream(db).await?;
}
// All streams are dropped and connections are returned to connection pool
```
