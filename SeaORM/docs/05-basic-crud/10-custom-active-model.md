# Custom Active Model

Creating your own struct with partial fields of a model, which implements `IntoActiveModel` that can be converted into an `ActiveModel` with the method `into_active_model`. For example, it can be used as a form submission in a REST API.

`IntoActiveValue` trait allows converting `Option<T>` into `ActiveValue<T>` with the method `into_active_value`.

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

Create a new struct with some fields omitted.

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

`Option<Option<T>>` allows for `Some(None)` to update the column to be NULL.

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

## Advanced Attributes

:::tip Since `2.0.0`
:::

### Computed Defaults and Auto-Set Fields

Use `set(field = "expr")` at the container level to inject fields that aren't part of the struct, and `#[sea_orm(default = "expr")]` on `Option<T>` fields to provide a fallback when `None`:

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

- `set(field = "expr")` accepts arbitrary Rust expressions: functions, constants, literals. Multiple `set` attributes are merged.
- `#[sea_orm(default = "expr")]` provides a fallback for `Option<T>` fields: `Some(v)` becomes `Set(v)`, `None` becomes `Set(expr)`.
- `#[sea_orm(default)]` (bare) uses `Default::default()` as the fallback.
- `active_model = "..."` specifies the target ActiveModel type explicitly.

### Ignoring Fields

Use `#[sea_orm(ignore)]` to exclude DTO-only fields that have no corresponding column:

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

### Exhaustive Mode

Add `exhaustive` to remove the `..Default::default()` spread, forcing every ActiveModel field to be explicitly covered by the struct, `set`, or `default`:

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

This gives you a compile-time guarantee that no field is accidentally left as `NotSet`.

### Summary

| Scenario | Attribute | Result in ActiveModel |
|---|---|---|
| Field provided directly | Declare field normally | `Set(value)` |
| Field not in struct but must be set | `set(field = "expr")` | `Set(expr)` |
| Optional field with fallback | `Option<T>` + `#[sea_orm(default = "expr")]` | `Some(v)` → `Set(v)`, `None` → `Set(expr)` |
| DTO-only field, no column | `#[sea_orm(ignore)]` | Excluded |
| Field not declared, no default | Omit field | `NotSet` |

## PartialModel to ActiveModel

:::tip Since `1.1.0`
:::

`DerivePartialModel` can also derive `IntoActiveModel` with the `into_active_model` attribute. This reuses your partial select struct for writes: absent fields become `NotSet`.

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

This is useful when an API endpoint receives a subset of fields and you want to both query and update with the same struct.
