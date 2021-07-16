# Insert

Before diving into SeaORM insert we have to introduce `ActiveValue` and `ActiveModel`.

## ActiveValue

A wrapper struct to capture the changes made to `ActiveModel` attributes.

```rust
// Set value
let _: ActiveValue<i32> = ActiveValue::set(10);
let _: ActiveValue<i32> = Set(10);

// Unset value
let _: ActiveValue<i32> = ActiveValue::unset();
let _: ActiveValue<i32> = Unset(None);

// Unchanged
let _: ActiveValue<i32> = ActiveValue::unchanged(10);
```

## Model & ActiveModel

An `ActiveModel` has all the attributes of `Model` but all its attributes are wrapped in `ActiveValue` struct.

You will get `Model` from SeaORM select and use it for readonly purpose. If you want to update model attributes and save it back into database, then you need to convert it into `ActiveModel` before updating. Same thing applied to SeaORM insert, only `ActiveModel` can be inserted.

```rust
let cheese: Option<cake::Model> = Cake::find_by_id(1).one(db).await?;

// Get Model
let model: cake::Model = cheese.unwrap();
assert_eq!(model.name, "Cheese Cake".to_owned());

// Into ActiveModel
let active_model: cake::ActiveModel = model.into();
assert_eq!(active_model.name, ActiveValue::unchanged("Cheese Cake".to_owned()));

```

## Insert One

Insert single active model and get the last insert id.

```rust
let pear = fruit::ActiveModel {
    name: Set("Pear".to_owned()),
    ..Default::default()
};

let res: InsertResult = Fruit::insert(pear).exec(db).await?;
assert_eq!(res.last_insert_id, 28)
```

## Insert Many

Insert many active models and get the last insert id.

```rust
let apple = fruit::ActiveModel {
    name: Set("Apple".to_owned()),
    ..Default::default()
};

let orange = fruit::ActiveModel {
    name: Set("Orange".to_owned()),
    ..Default::default()
};

let res: InsertResult = Fruit::insert_many(vec![apple, orange]).exec(db).await?;
assert_eq!(res.last_insert_id, 30)
```
