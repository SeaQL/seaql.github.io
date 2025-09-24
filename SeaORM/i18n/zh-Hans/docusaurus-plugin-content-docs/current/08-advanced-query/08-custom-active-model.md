# 自定义 Active Model

创建你自己的结构体，其中包含模型的部分字段，并实现 `IntoActiveModel`，可以通过 `into_active_model` 方法将其转换为 `ActiveModel`。例如，它可以用作 REST API 中的表单提交。

`IntoActiveValue` trait 允许使用 `into_active_value` 方法将 `Option<T>` 转换为 `ActiveValue<T>`。

```rust
// 像往常一样定义常规模型
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "fruit")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
    pub cake_id: Option<i32>,
}
```

创建一个省略部分字段的新结构体。

```rust
use sea_orm::ActiveValue::NotSet;

#[derive(DeriveIntoActiveModel)]
pub struct NewFruit {
    // id 被省略
    pub name: String,
    // 它是必需的，与 Model 中的可选字段相反
    pub cake_id: i32,
}

assert_eq!(
    NewFruit {
        name: "Apple".to_owned(),
        cake_id: 1,
    }
    .into_active_model(),
    fruit::ActiveModel {
        id: NotSet,
        name: Set("Apple".to_owned()),
        cake_id: Set(Some(1)),
    }
);
```

`Option<Option<T>>` 允许 `Some(None)` 将列更新为 NULL。

```rust
use sea_orm::ActiveValue::NotSet;

#[derive(DeriveIntoActiveModel)]
pub struct UpdateFruit {
    pub cake_id: Option<Option<i32>>,
}

assert_eq!(
    UpdateFruit {
        cake_id: Some(Some(1)),
    }
    .into_active_model(),
    fruit::ActiveModel {
        id: NotSet,
        name: NotSet,
        cake_id: Set(Some(1)),
    }
);

assert_eq!(
    UpdateFruit {
        cake_id: Some(None),
    }
    .into_active_model(),
    fruit::ActiveModel {
        id: NotSet,
        name: NotSet,
        cake_id: Set(None),
    }
);

assert_eq!(
    UpdateFruit {
        cake_id: None,
    }
    .into_active_model(),
    fruit::ActiveModel {
        id: NotSet,
        name: NotSet,
        cake_id: NotSet,
    }
);