# 自定义 ActiveModel

创建包含模型部分字段的自定义结构体，实现 `IntoActiveModel`，可通过 `into_active_model` 方法转换为 `ActiveModel`。例如，可用作 REST API 中的表单提交。

`IntoActiveValue` trait 允许通过 `into_active_value` 方法将 `Option<T>` 转换为 `ActiveValue<T>`。

```rust
// Define regular model as usual
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "fruit")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
    pub cake_id: Option<i32>,
}
```

创建省略部分字段的新结构体。

```rust
use sea_orm::ActiveValue::NotSet;

#[derive(DeriveIntoActiveModel)]
pub struct NewFruit {
    // id is omitted
    pub name: String,
    // it is required as opposed to optional in Model
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
    UpdateFruit { cake_id: Some(Some(1)) }.into_active_model(),
    fruit::ActiveModel { id: NotSet, name: NotSet, cake_id: Set(Some(1)) }
);

assert_eq!(
    UpdateFruit { cake_id: Some(None) }.into_active_model(),
    fruit::ActiveModel { id: NotSet, name: NotSet, cake_id: Set(None) }
);

assert_eq!(
    UpdateFruit { cake_id: None }.into_active_model(),
    fruit::ActiveModel { id: NotSet, name: NotSet, cake_id: NotSet }
);
```

## 高级属性

:::tip Since `2.0.0`
:::

### 计算默认值与自动设置字段

在容器级别使用 `set(field = "expr")` 注入不属于结构体的字段，在 `Option<T>` 字段上使用 `#[sea_orm(default = "expr")]` 在 `None` 时提供回退：

```rust
const SYSTEM_USER_ID: i32 = 0;

#[derive(DeriveIntoActiveModel)]
#[sea_orm(
    active_model = "post::ActiveModel",
    set(updated_at = "chrono::Utc::now()"),
    set(version = "1")
)]
struct CreatePost {
    title: String,
    content: String,
    #[sea_orm(default = "chrono::Utc::now()")]
    published_at: Option<chrono::DateTime<chrono::Utc>>,
    #[sea_orm(default = "SYSTEM_USER_ID")]
    author_id: Option<i32>,
}
```

- `set(field = "expr")` 接受任意 Rust 表达式：函数、常量、字面量。多个 `set` 属性会合并。
- `#[sea_orm(default = "expr")]` 为 `Option<T>` 字段提供回退：`Some(v)` 变为 `Set(v)`，`None` 变为 `Set(expr)`。
- `#[sea_orm(default)]`（裸）使用 `Default::default()` 作为回退。
- `active_model = "..."` 显式指定目标 ActiveModel 类型。

### 忽略字段

使用 `#[sea_orm(ignore)]` 排除没有对应列的仅 DTO 字段：

```rust
#[derive(DeriveIntoActiveModel)]
#[sea_orm(active_model = "account::ActiveModel")]
struct UpdateAccount {
    id: i32,
    name: String,
    #[sea_orm(ignore)]
    audit_log: String,
}
```

### 穷举模式

添加 `exhaustive` 以移除 `..Default::default()` 展开，强制每个 ActiveModel 字段都由结构体、`set` 或 `default` 显式覆盖：

```rust
#[derive(DeriveIntoActiveModel)]
#[sea_orm(
    active_model = "account::ActiveModel",
    exhaustive,
    set(updated_at = "chrono::Utc::now()")
)]
struct UpdateAccount {
    id: i32,
    #[sea_orm(default = "false")]
    disabled: Option<bool>,
    #[sea_orm(ignore)]
    audit_log: String,
}
```

这可以在编译时保证没有字段意外保持为 `NotSet`。

### 总结

| 场景 | 属性 | ActiveModel 中的结果 |
|---|---|---|
| 直接提供字段 | 正常声明字段 | `Set(value)` |
| 字段不在结构体中但必须设置 | `set(field = "expr")` | `Set(expr)` |
| 可选字段并提供回退值 | `Option<T>` + `#[sea_orm(default = "expr")]` | `Some(v)` → `Set(v)`, `None` → `Set(expr)` |
| 仅 DTO 字段，无对应列 | `#[sea_orm(ignore)]` | 排除 |
| 字段未声明且无默认值 | 省略字段 | `NotSet` |

## PartialModel to ActiveModel

:::tip Since `1.1.0`
:::

`DerivePartialModel` 也可以通过 `into_active_model` 属性派生 `IntoActiveModel`。这可以复用你的 partial select 结构体进行写入：缺失的字段变为 `NotSet`。

```rust
#[derive(DerivePartialModel)]
#[sea_orm(entity = "cake::Entity", into_active_model)]
struct PartialCake {
    id: i32,
    name: String,
}

let partial_cake = PartialCake {
    id: 12,
    name: "Lemon Drizzle".to_owned(),
};

assert_eq!(
    cake::ActiveModel {
        ..partial_cake.into_active_model()
    },
    cake::ActiveModel {
        id: Set(12),
        name: Set("Lemon Drizzle".to_owned()),
        ..Default::default()
    }
);
```

当 API 端点接收字段子集，并希望使用同一结构体进行查询和更新时，这很有用。
