# Data Loader

The [LoaderTrait](https://docs.rs/sea-orm/*/sea_orm/query/trait.LoaderTrait.html) provides an API to load related entities in batches.

Consider this one to many relation:

```rust
let cake_with_fruits: Vec<(cake::Model, Vec<fruit::Model>)> = Cake::find()
    .find_with_related(Fruit)
    .all(db)
    .await?;
```

The SQL query generated is:

```sql
SELECT
    "cake"."id" AS "A_id",
    "cake"."name" AS "A_name",
    "fruit"."id" AS "B_id",
    "fruit"."name" AS "B_name",
    "fruit"."cake_id" AS "B_cake_id"
FROM "cake"
LEFT JOIN "fruit" ON "cake"."id" = "fruit"."cake_id"
ORDER BY "cake"."id" ASC
```

This is great, but if the N is a large number, the 1 side's (Cake) data will be duplicated a lot. This results in more data being transferred over the wire. In the many to many case, both sides may duplicate. Using the Loader would ensure each model is transferred only once. For this reason, SeaORM currently can't eager load more than 2 entities together.

The following loads the same data as above, but with two queries:

```rust
let cakes: Vec<cake::Model> = Cake::find().all(db).await?;
let fruits: Vec<Vec<fruit::Model>> = cakes.load_many(Fruit, db).await?;

for (cake, fruits) in cakes.into_iter().zip(fruits.into_iter()) { .. }
```

```sql
SELECT "cake"."id", "cake"."name" FROM "cake"
SELECT "fruit"."id", "fruit"."name", "fruit"."cake_id" FROM "fruit" WHERE "fruit"."cake_id" IN (..)
```

You can stack these together:

```rust
let cakes: Vec<cake::Model> = Cake::find().all(db).await?;
let fruits: Vec<Vec<fruit::Model>> = cakes.load_many(Fruit, db).await?;
let fillings: Vec<Vec<filling::Model>> = cakes.load_many_to_many(Filling, CakeFilling, db).await?;
```

In an advanced use case, you can apply filters on the related entity:

```rust
let fruits_in_stock: Vec<Vec<fruit::Model>> = cakes.load_many(
    fruit::Entity::find().filter(fruit::Column::Stock.gt(0i32)),
    db
).await?;
```