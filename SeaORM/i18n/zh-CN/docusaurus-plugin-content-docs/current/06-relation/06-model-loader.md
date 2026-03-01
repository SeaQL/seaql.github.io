# 模型加载器

[LoaderTrait](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/query/trait.LoaderTrait.html) 提供了批量加载关联实体的 API。

考虑以下一对多关系：

```rust
let cake_with_fruits: Vec<(cake::Model, Vec<fruit::Model>)> = Cake::find()
    .find_with_related(Fruit)
    .all(db)
    .await?;
```

生成的 SQL 查询为：

```sql
SELECT
    "cake"."id" AS "A_id", "cake"."name" AS "A_name",
    "fruit"."id" AS "B_id", "fruit"."name" AS "B_name", "fruit"."cake_id" AS "B_cake_id"
FROM "cake"
LEFT JOIN "fruit" ON "cake"."id" = "fruit"."cake_id"
ORDER BY "cake"."id" ASC
```

这很好，但当 N 很大时，一对多中「一」方（Cake）的数据会被大量重复，导致传输更多数据。在多对多情况下，双方都可能重复。使用 Loader 可确保每个模型只传输一次。

以下以两次查询加载与上面相同的数据：

```rust
let cakes: Vec<cake::Model> = Cake::find().all(db).await?;
let fruits: Vec<Vec<fruit::Model>> = cakes.load_many(Fruit, db).await?;

for (cake, fruits) in cakes.into_iter().zip(fruits.into_iter()) {
    // cake and its associated fruits
}
```

```sql
SELECT "cake"."id", "cake"."name" FROM "cake"
SELECT "fruit"."id", "fruit"."name", "fruit"."cake_id" FROM "fruit" WHERE "fruit"."cake_id" IN (..)
```

你可以叠加使用：

```rust
let cakes: Vec<cake::Model> = Cake::find().all(db).await?;
let fruits: Vec<Vec<fruit::Model>> = cakes.load_many(Fruit, db).await?;
let fillings: Vec<Vec<filling::Model>> = cakes.load_many(Filling, db).await?;
```

## 使用额外过滤条件加载关联实体

在高级用法中，你可以对关联实体应用过滤条件：

```rust
let fruits_in_stock: Vec<Vec<fruit::Model>> = cakes.load_many(
    fruit::Entity::find().filter(fruit::Column::Stock.gt(0i32)),
    db
).await?;
```