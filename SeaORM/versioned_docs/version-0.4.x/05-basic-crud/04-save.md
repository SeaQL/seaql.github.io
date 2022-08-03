# Save

This is a helper method to save (insert / update) `ActiveModel` into the database.

## Save Behaviour

When saving an `ActiveModel`, it will perform either insert or update depending on the primary key attribute:

- Insert if primary key is `Unset`
- Update if primary key is `Set` or `Unchanged`

## Usage

Calling `save` to insert or update an `ActiveModel`.

```rust
let banana = fruit::ActiveModel {
    id: Unset(None), // unset primary key explicitly
    name: Set("Banana".to_owned()),
    ..Default::default() // all other attributes are `Unset`
};

// Insert, because primary key `id` is `Unset`
let mut banana = banana.save(db).await?;

banana.name = Set("Banana Mongo".to_owned());

// Update, because primary key `id` is `Set`
let banana = banana.save(db).await?;
```
