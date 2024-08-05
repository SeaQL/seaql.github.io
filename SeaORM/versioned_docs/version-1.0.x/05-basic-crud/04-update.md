# Update

## Update One

You will get a `Model` from find result. If you want to save the model back into the database, you need to convert it into an `ActiveModel` *first*. The generated query will only include the `Set` attributes.

```rust
let pear: Option<fruit::Model> = Fruit::find_by_id(28).one(db).await?;

// Into ActiveModel
let mut pear: fruit::ActiveModel = pear.unwrap().into();

// Update name attribute
pear.name = Set("Sweet pear".to_owned());

// SQL: `UPDATE "fruit" SET "name" = 'Sweet pear' WHERE "id" = 28`
let pear: fruit::Model = pear.update(db).await?;
```

To update all attributes, you can convert `Unchanged` into `Set`.

```rust
// Into ActiveModel
let mut pear: fruit::ActiveModel = pear.into();

// Update name attribute
pear.name = Set("Sweet pear".to_owned());

// Set a specific attribute as "dirty" (force update)
pear.reset(fruit::Column::CakeId);
// Or, set all attributes as "dirty" (force update)
pear.reset_all();

// SQL: `UPDATE "fruit" SET "name" = 'Sweet pear', "cake_id" = 10 WHERE "id" = 28`
let pear: fruit::Model = pear.update(db).await?;
```

## Update Many

You can also update multiple rows in the database without finding each `Model` with SeaORM select.

```rust
// Bulk set attributes using ActiveModel
let update_result: UpdateResult = Fruit::update_many()
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

### Update with returning (Postgres only)

Use `exec_with_returning` to return models that were modified:

```rust
let fruits: Vec<fruit::Model> = Fruit::update_many()
    .col_expr(fruit::Column::CakeId, Expr::value(1))
    .filter(fruit::Column::Name.contains("Apple"))
    .exec_with_returning(db)
    .await?;
```