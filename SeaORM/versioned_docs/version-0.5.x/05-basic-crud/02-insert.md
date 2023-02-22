# Insert

Before diving into SeaORM insert we have to introduce `ActiveValue` and `ActiveModel`.

## ActiveValue

A wrapper struct to capture the changes made to `ActiveModel` attributes.

```rust
use sea_orm::ActiveValue::NotSet;

// Set value
let _: ActiveValue<i32> = Set(10);

// NotSet value
let _: ActiveValue<i32> = NotSet;
```

## Model & ActiveModel

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

## Insert One

Insert an active model and get back a fresh `Model`. Its value is retrieved from database, so any auto-generated fields will be populated.

```rust
let pear = fruit::ActiveModel {
    name: Set("Pear".to_owned()),
    ..Default::default() // all other attributes are `NotSet`
};

let pear: fruit::Model = pear.insert(db).await?;
```

Insert an active model and get back the last insert id. Its type matches the model's primary key type, so it could be a tuple if the model has a composite primary key.

```rust
let pear = fruit::ActiveModel {
    name: Set("Pear".to_owned()),
    ..Default::default() // all other attributes are `NotSet`
};

let res: InsertResult = fruit::Entity::insert(pear).exec(db).await?;
assert_eq!(res.last_insert_id, 28)
```

## Insert Many

Insert many active models and get back the last insert id.

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
