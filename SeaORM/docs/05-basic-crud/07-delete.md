# Delete

## Delete One

Find a `Model` from the database, then delete the corresponding row from database.

```rust
use sea_orm::entity::ModelTrait;

let orange: Option<fruit::Model> = Fruit::find_by_id(30).one(db).await?;
let orange: fruit::Model = orange.unwrap();

let res: DeleteResult = orange.delete(db).await?;
assert_eq!(res.rows_affected, 1);
```

## Delete by Primary Key

Delete a row directly by its primary key, without selecting the `Model` first.

```rust
let res: DeleteResult = Fruit::delete_by_id(38).exec(db).await?;
assert_eq!(res.rows_affected, 1);
```

:::tip Since `2.0.0`

`delete_by_id` now returns `ValidatedDeleteOne` instead of `DeleteMany`. Normal `exec` usage is unchanged, but `exec_with_returning` now returns `Option<Model>` instead of `Vec<Model>`.

:::

## Delete by Unique Key

:::tip Since `2.0.0`
:::

If the entity has a `#[sea_orm(unique)]` attribute, a `delete_by_*` convenience method is generated:

```rust
user::Entity::delete_by_email("bob@spam.com").exec(db).await?;
```

Like `delete_by_id`, this returns `ValidatedDeleteOne`.

## Delete Many

You can also delete multiple rows from the database without finding each `Model` with SeaORM select.

```rust
// DELETE FROM `fruit` WHERE `fruit`.`name` LIKE '%Orange%'
let res: DeleteResult = fruit::Entity::delete_many()
    .filter(fruit::Column::Name.contains("Orange"))
    .exec(db)
    .await?;

assert_eq!(res.rows_affected, 2);
```

## Returning Deleted Models

Postgres and SQLite only, MariaDB requires the `mariadb-use-returning` feature flag.

```rust
assert_eq!(
    fruit::Entity::delete(ActiveModel {
        id: Set(3),
        ..Default::default()
    })
    .exec_with_returning(db)
    .await?,
    Some(fruit::Model {
        id: 3,
        name: "Apple".to_owned(),
    })
);
```

```rust
let deleted_models: Vec<order::Model> = order::Entity::delete_many()
    .filter(order::Column::CustomerId.eq(22))
    .exec_with_returning(db)
    .await?

assert_eq!(deleted_models.len(), 2); // two items deleted
```