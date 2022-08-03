# Update

## Update One

You will get a `Model` from find result. If you want to save the model back into the database, you need to convert it into an `ActiveModel` *first*. The generated query will only include the `Set` attributes.

```rust
let pear: Option<fruit::Model> = Fruit::find_by_id(28).one(db).await?;

// Into ActiveModel
let mut pear: fruit::ActiveModel = pear.unwrap().into();

// Update name attribute
pear.name = Set("Sweet pear".to_owned());

// Update corresponding row in database using primary key value
let pear: fruit::ActiveModel = pear.update(db).await?;
```

## Update Many

You can also update multiple rows in the database without finding each `Model` with SeaORM select.

```rust
// Bulk set attributes using ActiveModel
let pear: fruit::ActiveModel = Fruit::update_many()
    .set(pear)
    .filter(fruit::Column::Id.eq(1))
    .exec(db)
    .await?;

// UPDATE `fruit` SET `cake_id` = 1 WHERE `fruit`.`name` LIKE '%Apple%'
Fruit::update_many()
    .col_expr(fruit::Column::CakeId, Expr::value(1))
    .filter(fruit::Column::Name.contains("Apple"))
    .exec(db)
    .await?;
```
