# ActiveModel

在深入 insert 和 update 操作之前，我们需要先介绍 `ActiveValue` 和 `ActiveModel`。

## ActiveValue

`ActiveModel` 中字段的状态。

有三种可能的状态，由三个枚举成员表示：

- `Set` - 由应用程序显式设置并发送到数据库的 `Value`。
    用于 insert 或设置特定值。

    编辑现有值时，可以使用 [`set_if_not_equal`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/entity/enum.ActiveValue.html#method.set_if_not_equals)
    在新值与旧值相同时保留 `Unchanged` 状态。
    然后可以有意义地使用 [`ActiveModelTrait::is_changed`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/entity/trait.ActiveModelTrait.html#method.is_changed) 等方法。
- `Unchanged` - 数据库中已有的、未更改的 `Value`。

    当你从数据库查询现有的 `Model`
    并将其转换为 `ActiveModel` 时会得到这些。
- `NotSet` - 未定义的 `Value`。不会向数据库发送任何内容。

    创建新的 `ActiveModel` 时，其字段默认为 `NotSet`。

    这在以下情况下很有用：

     - 插入新记录并希望数据库生成默认值（例如 id）时。
     - 在 `UPDATE` 语句中，不想更新某些字段时。

这些状态之间的区别在构建 `INSERT` 和 `UPDATE` SQL 语句时很有用（见下面的示例）。
对于了解记录中哪些字段已更改也很有用。

### 示例

```rust
use sea_orm::tests_cfg::{cake, fruit};
use sea_orm::{DbBackend, entity::*, query::*};

// Here, we use `NotSet` to let the database automatically generate an `id`.
// This is different from `Set(None)` that explicitly sets `cake_id` to `NULL`.
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

// Here, we update the record, set `cake_id` to the new value
// and use `NotSet` to avoid updating the `name` field.
// `id` is the primary key, so it's used in the condition and not updated.
assert_eq!(
    Update::one(fruit::ActiveModel {
        id: ActiveValue::Unchanged(1),
        name: ActiveValue::NotSet,
        cake_id: ActiveValue::Set(Some(2)),
    })
    .validate()? // <- required in 2.0
    .build(DbBackend::Postgres)
    .to_string(),
    r#"UPDATE "fruit" SET "cake_id" = 2 WHERE "fruit"."id" = 1"#
);
```

## ActiveModel

`ActiveModel` 拥有 `Model` 的所有属性，但都包装在 `ActiveValue` 中。

可以使用 `ActiveModel` 插入只设置了部分列的行。

```rust
let cheese: Option<cake::Model> = Cake::find_by_id(1).one(db).await?;

// Get Model
let model: cake::Model = cheese.unwrap();
assert_eq!(model.name, "Cheese Cake".to_owned());

// Into ActiveModel
let active_model: cake::ActiveModel = model.into();
assert_eq!(active_model.name, ActiveValue::unchanged("Cheese Cake".to_owned()));
```

### 检查 ActiveModel 是否已更改

可以使用 [`is_changed`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/entity/prelude/trait.ActiveModelTrait.html#method.is_changed) 方法检查 `ActiveModel` 中的任何字段是否为 `Set`。

```rust
let mut fruit: fruit::ActiveModel = Default::default();
assert!(!fruit.is_changed());

fruit.set(fruit::Column::Name, "apple".into());
assert!(fruit.is_changed());
```

### 将 ActiveModel 转换回模型

使用 [`try_into_model`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/entity/trait.TryIntoModel.html#tymethod.try_into_model) 方法可以将 ActiveModel 转换回模型。

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
```

如果 ActiveModel 的任何字段为 `NotSet`，转换将失败。

如果希望使用 `Default::default()` 自动填充剩余字段（或在其没有默认值时回退到 `NotSet`），可以使用 [`ActiveModelTrait::default_values()`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/entity/trait.ActiveModelTrait.html#tymethod.default_values) 方法。

这对于快速创建用于测试的 mock 模型很有用。

```rust
assert_eq!(
    ActiveModel {
        id: Set(2),
        ..ActiveModel::default_values()
    }
    .try_into_model()
    .unwrap(),
    Model {
        id: 2,
        name: String::default(), // empty string,
        cake_id: Option::default(), // `None`
    }
);
```
