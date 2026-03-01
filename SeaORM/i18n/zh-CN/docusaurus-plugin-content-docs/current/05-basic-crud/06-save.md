# 保存

这是一个辅助方法，用于将 `ActiveModel` 保存（insert / update）到数据库。

## 保存行为

保存 `ActiveModel` 时，会根据主键属性的状态执行 insert 或 update：

- 主键为 `NotSet` 时执行 Insert
- 主键为 `Set` 或 `Unchanged` 时执行 Update

## 用法

调用 `save` 来 insert 或 update 一个 `ActiveModel`。

```rust
use sea_orm::ActiveValue::NotSet;

let banana = fruit::ActiveModel {
    id: NotSet, // primary key is NotSet
    name: Set("Banana".to_owned()),
    ..Default::default() // all other attributes are `NotSet`
};

// Insert, because primary key `id` is `NotSet`
let banana: fruit::ActiveModel = banana.save(db).await?;

banana.name = Set("Banana Mongo".to_owned());

// Update, because primary key `id` is `Unchanged`
let banana: fruit::ActiveModel = banana.save(db).await?;
```
