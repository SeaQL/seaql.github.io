# Insert

Before diving into SeaORM insert we have to introduce `ActiveValue` and `ActiveModel`.

## ActiveValue

A wrapper struct to capture the changes made to `ActiveModel` attributes.

```rust
use sea_orm::ActiveValue::{Set, NotSet, Unchanged};

// Set value
let _: ActiveValue<i32> = Set(10);

// NotSet value
let _: ActiveValue<i32> = NotSet;

// An `Unchanged` value
let v: ActiveValue<i32> = Unchanged(10);

// Convert `Unchanged` active value as `Set`
assert!(v.reset(), Set(10));
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

### Set ActiveModel from JSON Value

If you want to save user input into the database you can easily convert JSON value into `ActiveModel`. You might want to [skip deserializing](https://serde.rs/attr-skip-serializing.html) some of the unwanted attributes.

:::tip Since `2.0.0`

Not all fields of the Model need to be present in the JSON input, undefined fields will simply become `ActiveValue::NotSet`.

:::

```rust
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "fruit")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
    pub cake_id: Option<i32>,
}
```

Set the attributes in `ActiveModel` with `set_from_json` method.

```rust
// A ActiveModel with primary key set
let mut fruit = fruit::ActiveModel {
    id: ActiveValue::Set(1),
    name: ActiveValue::NotSet,
    cake_id: ActiveValue::NotSet,
};

// Note that this method will not alter the primary key values in ActiveModel
fruit.set_from_json(json!({
    "id": 8,
    "name": "Apple",
    "cake_id": 1,
}))?;

assert_eq!(
    fruit,
    fruit::ActiveModel {
        id: ActiveValue::Set(1),
        name: ActiveValue::Set("Apple".to_owned()),
        cake_id: ActiveValue::Set(Some(1)),
    }
);
```

You can also create a new `ActiveModel` from JSON value with the `from_json` method.

```rust
let fruit = fruit::ActiveModel::from_json(json!({
    "name": "Apple",
}))?;

assert_eq!(
    fruit,
    fruit::ActiveModel {
        id: ActiveValue::NotSet,
        name: ActiveValue::Set("Apple".to_owned()),
        cake_id: ActiveValue::NotSet,
    }
);
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

Using [try_into_model](https://docs.rs/sea-orm/*/sea_orm/entity/trait.TryIntoModel.html#tymethod.try_into_model) method you can convert ActiveModel back to Model.

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

:::tip SQL Server (MSSQL) backend

The `IDENTITY INSERT` of MSSQL is documented [here](https://www.sea-ql.org/SeaORM-X/docs/basic-crud/insert/).

:::

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

let res: InsertResult = Fruit::insert_many([apple, orange]).exec(db).await?;
assert_eq!(res.last_insert_id, 30)
```

Supplying an empty set to `insert_many` method will result in an error. However, you can change the behaviour with `on_empty_do_nothing` which wraps the `InsertResult` with a `TryInsertResult`.

```rust
let res = Bakery::insert_many(std::iter::empty())
    .on_empty_do_nothing()
    .exec(db)
    .await;

assert!(matches!(res, Ok(TryInsertResult::Empty)));
```

## On Conflict

Insert active model with on conflict behaviour.

```rust
let orange = cake::ActiveModel {
    id: ActiveValue::set(2),
    name: ActiveValue::set("Orange".to_owned()),
};

assert_eq!(
    cake::Entity::insert(orange.clone())
        .on_conflict(
            // on conflict do nothing
            sea_query::OnConflict::column(cake::Column::Name)
                .do_nothing()
                .to_owned()
        )
        .build(DbBackend::Postgres)
        .to_string(),
    r#"INSERT INTO "cake" ("id", "name") VALUES (2, 'Orange') ON CONFLICT ("name") DO NOTHING"#,
);

assert_eq!(
    cake::Entity::insert(orange)
        .on_conflict(
            // on conflict do update
            sea_query::OnConflict::column(cake::Column::Name)
                .update_column(cake::Column::Name)
                .to_owned()
        )
        .build(DbBackend::Postgres)
        .to_string(),
    r#"INSERT INTO "cake" ("id", "name") VALUES (2, 'Orange') ON CONFLICT ("name") DO UPDATE SET "name" = "excluded"."name""#,
);
```

Performing an upsert statement without inserting or updating any of the row will result in a `DbErr::RecordNotInserted` error.

```rust
// When `id` column have conflicting value, do nothing
let on_conflict = OnConflict::column(Column::Id).do_nothing().to_owned();

// Insert `1`, `2`, `3` into the table
let res = Entity::insert_many([
    ActiveModel { id: Set(1) },
    ActiveModel { id: Set(2) },
    ActiveModel { id: Set(3) },
])
.on_conflict(on_conflict.clone())
.exec(db)
.await;

assert_eq!(res?.last_insert_id, 3);

// Insert `4` into the table together with the previous 3 rows
let res = Entity::insert_many([
    ActiveModel { id: Set(1) },
    ActiveModel { id: Set(2) },
    ActiveModel { id: Set(3) },
    ActiveModel { id: Set(4) },
])
.on_conflict(on_conflict.clone())
.exec(db)
.await;

assert_eq!(res?.last_insert_id, 4);

// Repeat last insert. Since all 4 rows already exist, this essentially did nothing.
// A `DbErr::RecordNotInserted` error will be thrown.
let res = Entity::insert_many([
    ActiveModel { id: Set(1) },
    ActiveModel { id: Set(2) },
    ActiveModel { id: Set(3) },
    ActiveModel { id: Set(4) },
])
.on_conflict(on_conflict)
.exec(db)
.await;

assert_eq!(res.err(), Some(DbErr::RecordNotInserted));
```

If you want `RecordNotInserted` to be an `Ok` instead of an error, call `.do_nothing()`:

```rust
let res = Entity::insert_many([..])
    .on_conflict(on_conflict)
    .do_nothing()
    .exec(db)
    .await;

assert!(matches!(res, Ok(TryInsertResult::Conflicted)));
```

### MySQL support

Set `ON CONFLICT` on primary key `DO NOTHING`, but with MySQL specific polyfill.

```rust
let orange = cake::ActiveModel {
    id: ActiveValue::set(2),
    name: ActiveValue::set("Orange".to_owned()),
};

assert_eq!(
    cake::Entity::insert(orange.clone())
        .on_conflict_do_nothing()
        .build(DbBackend::MySql)
        .to_string(),
    r#"INSERT INTO `cake` (`id`, `name`) VALUES (2, 'Orange') ON DUPLICATE KEY UPDATE `id` = `id`"#,
);
assert_eq!(
    cake::Entity::insert(orange.clone())
        .on_conflict_do_nothing()
        .build(DbBackend::Postgres)
        .to_string(),
    r#"INSERT INTO "cake" ("id", "name") VALUES (2, 'Orange') ON CONFLICT ("id") DO NOTHING"#,
);
assert_eq!(
    cake::Entity::insert(orange)
        .on_conflict_do_nothing()
        .build(DbBackend::Sqlite)
        .to_string(),
    r#"INSERT INTO "cake" ("id", "name") VALUES (2, 'Orange') ON CONFLICT ("id") DO NOTHING"#,
);
```

## Returning Inserted Models

Supported by Postgres and SQLite, the following returns the newly inserted models after insert.

```rust
assert_eq!(
    cake::Entity::insert(cake::ActiveModel {
        id: NotSet,
        name: Set("Apple Pie".to_owned()),
    })
    .exec_with_returning(&db)
    .await?,
    cake::Model {
        id: 1,
        name: "Apple Pie".to_owned(),
    }
);
```

```rust
assert_eq!(
    cake::Entity::insert_many([
        cake::ActiveModel {
            id: NotSet,
            name: Set("Apple Pie".to_owned()),
        },
        cake::ActiveModel {
            id: NotSet,
            name: Set("Choco Pie".to_owned()),
        },
    ])
    .exec_with_returning(&db)
    .await?,
    [
        cake::Model {
            id: 1,
            name: "Apple Pie".to_owned(),
        },
        cake::Model {
            id: 2,
            name: "Choco Pie".to_owned(),
        }
    ]
);
```

There is also a `exec_with_returning_keys` if you only need the primary keys after insert.

```rust
assert_eq!(
    cakes_bakers::Entity::insert_many([
        cakes_bakers::ActiveModel {
            cake_id: Set(1),
            baker_id: Set(2),
        },
        cakes_bakers::ActiveModel {
            cake_id: Set(2),
            baker_id: Set(1),
        },
    ])
    .exec_with_returning_keys(db)
    .await
    .unwrap(),
    [(1, 2), (2, 1)]
);
```