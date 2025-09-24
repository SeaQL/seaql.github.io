# 保存

这是一个帮助方法，用于将 `ActiveModel` 保存（插入/更新）到数据库中。

## 保存行为

保存 `ActiveModel` 时，它将根据主键属性执行插入或更新：

- 如果主键是 `NotSet`，则插入
- 如果主键是 `Set` 或 `Unchanged`，则更新

## 用法

调用 `save` 插入或更新 `ActiveModel`。

```rust
use sea_orm::ActiveValue::NotSet;

let banana = fruit::ActiveModel {
    id: NotSet, // 主键是 NotSet
    name: Set("Banana".to_owned()),
    ..Default::default() // 所有其他属性都是 `NotSet`
};

// 插入，因为主键 `id` 是 `NotSet`
let banana: fruit::ActiveModel = banana.save(db).await?;

banana.name = Set("Banana Mongo".to_owned());

// 更新，因为主键 `id` 是 `Unchanged`
let banana: fruit::ActiveModel = banana.save(db).await?;