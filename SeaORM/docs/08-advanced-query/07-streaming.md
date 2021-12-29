# Streaming

Use async stream on any `Select` for reducing memory allocation to improve efficiency.

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

Note that the stream object will exclusively hold onto the connection until dropped, preventing the connection to be borrowed by others.

```rust
{
    let s1 = Fruit::find().stream(db).await?;
    let s2 = Fruit::find().stream(db).await?;
    let s3 = Fruit::find().stream(db).await?;
    // 3 connections are held
}
// All streams are dropped and connections are returned to the connection pool
```
