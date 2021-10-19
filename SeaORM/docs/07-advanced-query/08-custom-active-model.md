# Custom Active Model

Creating your own struct with partial fields of a model, which implements `IntoActiveModel` that can be converted into an `ActiveModel` with the method `into_active_model`. For example, it can be used as a form submission in a REST API.

`IntoActiveValue` trait allows converting `Option<T>` into `ActiveValue<T>` with the method `into_active_value`.

```rust
// Define regular model as usual
#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
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
        id: Unset(None),
        name: Set("Apple".to_owned()),
        cake_id: Set(Some(1)),
    }
);
```

`Option<Option<T>>` allows for `Some(None)` to update the column to be NULL.

```rust
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
        id: Unset(None),
        name: Unset(None),
        cake_id: Set(Some(1)),
    }
);

assert_eq!(
    UpdateFruit {
        cake_id: Some(None),
    }
    .into_active_model(),
    fruit::ActiveModel {
        id: Unset(None),
        name: Unset(None),
        cake_id: Set(None),
    }
);

assert_eq!(
    UpdateFruit {
        cake_id: None,
    }
    .into_active_model(),
    fruit::ActiveModel {
        id: Unset(None),
        name: Unset(None),
        cake_id: Unset(None),
    }
);
```
