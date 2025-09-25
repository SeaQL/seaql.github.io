# ActiveModel

Before diving into insert and update operations we have to introduce `ActiveValue` and `ActiveModel`.

## ActiveValue

The state of a field in an `ActiveModel`.

There are three possible states represented by three enum variants:

- `Set` - A `Value` that's explicitly set by the application and sent to the database.
    Use this to insert or set a specific value.

    When editing an existing value, you can use [`set_if_not_equal`](https://docs.rs/sea-orm/*/sea_orm/entity/enum.ActiveValue.html#method.set_if_not_equals)
    to preserve the `Unchanged` state when the new value is the same as the old one.
    Then you can meaningfully use methods like [`ActiveModelTrait::is_changed`](https://docs.rs/sea-orm/*/sea_orm/entity/trait.ActiveModelTrait.html#method.is_changed).
- `Unchanged` - An existing, unchanged `Value` from the database.

    You get these when you query an existing `Model`
    from the database and convert it into an `ActiveModel`.
- `NotSet` - An undefined `Value`. Nothing is sent to the database.

    When you create a new `ActiveModel`, its fields are `NotSet` by default.

    This can be useful when:

     - You insert a new record and want the database to generate a default value (e.g., an id).
     - In an `UPDATE` statement, you don't want to update some fields.

The difference between these states is useful
when constructing `INSERT` and `UPDATE` SQL statements (see examples below).
It's also useful for knowing which fields have changed in a record.

### Examples

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

An `ActiveModel` has all the attributes of `Model` wrapped in `ActiveValue`.

You can use `ActiveModel` to insert a row with a subset of columns set.

```rust
let cheese: Option<cake::Model> = Cake::find_by_id(1).one(db).await?;

// Get Model
let model: cake::Model = cheese.unwrap();
assert_eq!(model.name, "Cheese Cake".to_owned());

// Into ActiveModel
let active_model: cake::ActiveModel = model.into();
assert_eq!(active_model.name, ActiveValue::unchanged("Cheese Cake".to_owned()));
```

### Checking if an ActiveModel is changed

You can check whether any field in an `ActiveModel` is `Set` with the [`is_changed`](https://docs.rs/sea-orm/*/sea_orm/entity/prelude/trait.ActiveModelTrait.html#method.is_changed) method.

```rust
let mut fruit: fruit::ActiveModel = Default::default();
assert!(!fruit.is_changed());

fruit.set(fruit::Column::Name, "apple".into());
assert!(fruit.is_changed());
```

### Convert ActiveModel back to Model

Using [`try_into_model`](https://docs.rs/sea-orm/*/sea_orm/entity/trait.TryIntoModel.html#tymethod.try_into_model) method you can convert ActiveModel back to Model.

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
