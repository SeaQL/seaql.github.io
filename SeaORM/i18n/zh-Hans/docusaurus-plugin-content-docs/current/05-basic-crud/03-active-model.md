# ActiveModel

在深入了解插入和更新操作之前，我们必须介绍 `ActiveValue` 和 `ActiveModel`。

## ActiveValue

`ActiveModel` 中字段的状态。

有三种可能的状态，由三个枚举变体表示：

- `Set` - 由应用程序显式设置并发送到数据库的 `Value`。
    用于插入或设置特定值。

    编辑现有值时，你可以使用 [`set_if_not_equal`](https://docs.rs/sea-orm/*/sea_orm/entity/enum.ActiveValue.html#method.set_if_not_equals)
    在新值与旧值相同时保留 `Unchanged` 状态。
    然后你可以有意义地使用 [`ActiveModelTrait::is_changed`](https://docs.rs/sea-orm/*/sea_orm/entity/trait.ActiveModelTrait.html#method.is_changed) 等方法。
- `Unchanged` - 数据库中现有且未更改的 `Value`。

    当你从数据库中查询现有 `Model` 并将其转换为 `ActiveModel` 时，你会得到这些。
- `NotSet` - 未定义的 `Value`。没有内容发送到数据库。

    当你创建新的 `ActiveModel` 时，其字段默认是 `NotSet`。

    这在以下情况下很有用：

     - 你插入新记录并希望数据库生成默认值（例如，id）。
     - 在 `UPDATE` 语句中，你不想更新某些字段。

这些状态之间的差异在构建 `INSERT` 和 `UPDATE` SQL 语句时很有用（请参阅下面的示例）。
它对于了解记录中哪些字段已更改也很有用。

### 示例

```rust
use sea_orm::tests_cfg::{cake, fruit};
use sea_orm::{DbBackend, entity::*, query::*};

// 在这里，我们使用 `NotSet` 让数据库自动生成 `id`。
// 这与显式将 `cake_id` 设置为 `NULL` 的 `Set(None)` 不同。
assert_eq!(
    Insert::one(fruit::ActiveModel {
        id: ActiveValue::NotSet,
        name: ActiveValue::Set("Orange".to_owned()),
        cake_id: ActiveValue::Set(None),
    })
    .build(DbBackend::Postgres)
    .to_string(),
    r#"INSERT INTO "fruit" ("name", "cake_id") VALUES ('Orange', NULL)"#
);

// 在这里，我们更新记录，将 `cake_id` 设置为新值
// 并使用 `NotSet` 避免更新 `name` 字段。
// `id` 是主键，因此它用于条件中，并且不更新。
assert_eq!(
    Update::one(fruit::ActiveModel {
        id: ActiveValue::Unchanged(1),
        name: ActiveValue::NotSet,
        cake_id: ActiveValue::Set(Some(2)),
    })
    .build(DbBackend::Postgres)
    .to_string(),
    r#"UPDATE "fruit" SET "cake_id" = 2 WHERE "fruit"."id" = 1"#
);
```

## ActiveModel

`ActiveModel` 具有 `Model` 的所有属性，并包装在 `ActiveValue` 中。

你可以使用 `ActiveModel` 插入一行，其中设置了列的子集。

```rust
let cheese: Option<cake::Model> = Cake::find_by_id(1).one(db).await?;

// 获取模型
let model: cake::Model = cheese.unwrap();
assert_eq!(model.name, "Cheese Cake".to_owned());

// 转换为 ActiveModel
let active_model: cake::ActiveModel = model.into();
assert_eq!(active_model.name, ActiveValue::unchanged("Cheese Cake".to_owned()));
```

### 检查 ActiveModel 是否已更改

你可以使用 [`is_changed`](https://docs.rs/sea-orm/*/sea_orm/entity/prelude/trait.ActiveModelTrait.html#method.is_changed) 方法检查 `ActiveModel` 中的任何字段是否已 `Set`。

```rust
let mut fruit: fruit::ActiveModel = Default::default();
assert!(!fruit.is_changed());

fruit.set(fruit::Column::Name, "apple".into());
assert!(fruit.is_changed());
```

### 将 ActiveModel 转换回 Model

使用 [`try_into_model`](https://docs.rs/sea-orm/*/sea_orm/entity/trait.TryIntoModel.html#tymethod.try_into_model) 方法可以将 ActiveModel 转换回 Model。

```rust
assert_eq!(
    ActiveModel {
        id: Set(2),
        name: Set("Apple".to_owned()),
        cake_id: Set(Some(1)),
    }
    .try_into_model()
    .unwrap(),
    Model {
        id: 2,
        name: "Apple".to_owned(),
        cake_id: Some(1),
    }
);

assert_eq!(
    ActiveModel {
        id: Set(1),
        name: NotSet,
        cake_id: Set(None),
    }
    .try_into_model(),
    Err(DbErr::AttrNotSet(String::from("name")))
);