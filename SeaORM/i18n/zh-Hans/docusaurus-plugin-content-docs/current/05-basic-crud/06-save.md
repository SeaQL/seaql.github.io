# Save

This is a helper method to save (insert / update) `ActiveModel` into the database.

## Save Behaviour

When saving an `ActiveModel`, it will perform either insert or update depending on the primary key attribute:

- Insert if primary key is `NotSet`
- Update if primary key is `Set` or `Unchanged`

## Usage

Calling `save` to insert or update an `ActiveModel`.

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
