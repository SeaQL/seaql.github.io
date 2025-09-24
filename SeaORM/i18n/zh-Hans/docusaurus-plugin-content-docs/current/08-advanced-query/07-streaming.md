# 流式处理

在任何 `Select` 上使用来自 [futures](https://crates.io/crates/futures) crate 的异步流，以减少内存分配，提高效率。

```rust
use futures::TryStreamExt;

// 流式处理所有水果
let mut stream = Fruit::find().stream(db).await?;

while let Some(item) = stream.try_next().await? {
    let item: fruit::ActiveModel = item.into();
    // 对 item 进行操作
}
```

```rust
// 流式处理所有名称包含字符 "a" 的水果
let mut stream = Fruit::find()
    .filter(fruit::Column::Name.contains("a"))
    .order_by_asc(fruit::Column::Name)
    .stream(db)
    .await?;
```

请注意，流对象将独占连接直到被丢弃，从而阻止连接被其他对象借用。

```rust
{
    let s1 = Fruit::find().stream(db).await?;
    let s2 = Fruit::find().stream(db).await?;
    let s3 = Fruit::find().stream(db).await?;
    // 3 个连接被持有
}
// 所有流都被丢弃，连接返回到连接池