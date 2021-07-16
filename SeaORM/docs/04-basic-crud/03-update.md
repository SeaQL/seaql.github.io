# Update

## Update One

Find a `Model` from database, then convert it into `ActiveModel`. Then, make necessary changes to `ActiveModel` using `Set` and `Unset` methods introduced in previous section. Finally, update the corresponding row in database.

Note that primary key must be set in order to update the corresponding row in database.

```rust
let pear: Option<fruit::Model> = Fruit::find_by_id(28).one(db).await?;

// Into ActiveModel
let mut pear: fruit::ActiveModel = pear.unwrap().into();

// Update name attribute
pear.name = Set("Sweet pear".to_owned());

// Update corresponding row in database
let pear: fruit::ActiveModel = Fruit::update(pear).exec(db).await?;
```

## Update Many

You can also update multiple rows in database without finding each `Model` with SeaORM select.

For example, we set "cake_id" column to null for all fruits with name contains "apple".

```rust
// Update Many with SQL: UPDATE `fruit` SET `cake_id` = NULL WHERE `fruit`.`name` LIKE '%Apple%'
Fruit::update_many()
    .col_expr(fruit::Column::CakeId, Expr::value(Value::Null))
    .filter(fruit::Column::Name.contains("Apple"))
    .exec(db)
    .await?;
```
