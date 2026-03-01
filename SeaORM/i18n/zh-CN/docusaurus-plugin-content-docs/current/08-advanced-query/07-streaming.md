# 串流

在任意 `Select` 上使用 [futures](https://crates.io/crates/futures) crate 的 async stream，以减少内存分配并提高效率。

```rust
use futures::TryStreamExt;

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

注意，stream 对象将独占持有 connection 直到被 drop，阻止 connection 被其他代码借用。

```rust
{
    let s1 = Fruit::find().stream(db).await?;
    let s2 = Fruit::find().stream(db).await?;
    let s3 = Fruit::find().stream(db).await?;
    // 3 connections are held
}
// All streams are dropped and connections are returned to the connection pool
```
