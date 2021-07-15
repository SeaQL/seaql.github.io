# Select

Once you have defined the entity, you are ready to retrieve data from the database. Each row of data in the database corresponds to a `Model`.

By default SeaORM will select all columns defined in the `Column` enum.

> If you want to select custom columns / expressions, read the [custom select section](/docs/advanced-query/custom-select#).

## Find by Primary Key

Find a model by its primary key, it can be a single key or composite key. We start by calling the `find_by_id` method on `Entity` which helps you construct the select query and condition automatically. Then, fetch a single model from database with the `one` method.

```rust
use super::cake::Entity as Cake;
use super::cake_filling::Entity as CakeFilling;

// Find by primary key
let cheese: Option<cake::Model> = Cake::find_by_id(1).one(db).await?;
let cheese: cake::Model = cheese.unwrap();

// Find by composite primary keys
let vanilla: Option<cake_filling::Model> = CakeFilling::find_by_id((6, 8)).one(db).await?;
let vanilla: cake_filling::Model = vanilla.unwrap();
```

## Find with Conditions and Orders

In addition to retrieve model by primary key, you can also retrieve one or more models matching specific condition in certain order. The `find` method gives you access to the query builder in SeaORM. It support construction of all common select expressions including where and order by expression, they can be constructed using `filter` and `order_by_*` method respectively.

> Read more about [conditional expression](/docs/advanced-query/conditional-expression#) and [order expression](#).

```rust
let chocolate: Vec<cake::Model> = Cake::find()
    .filter(cake::Column::Name.contains("chocolate"))
    .order_by_asc(cake::Column::Name)
    .all(db)
    .await?;
```

## Find Related Models

We can use the `find_related` method to quickly join and select a related entity.

> Read more about [table joins](/docs/advanced-query/more-join#).

### Lazy Loading

Related models are loaded on demand when you ask for it, preferable if you want to load related models based on some application logic. Note that lazy loading will increase database round trips compared to eager loading.

```rust
// Find a cake model first
let cheese: Option<cake::Model> = Cake::find_by_id(1).one(db).await?;
let cheese: cake::Model = cheese.unwrap();

// Then, find all related fruits of this cake
let fruits: Vec<fruit::Model> = cheese.find_related(Fruit).all(db).await?;
```

### Eager Loading

All related models are loaded at once, the result is grouped by the first entity and returned in a vector of tuple. This provide minimum overhead on database round trips compared to lazy loading but it is only suitable for small to medium sized result.

```rust
let cake_with_fruits: Vec<(cake::Model, Vec<fruit::Model>)> = Cake::find()
    .find_with_related(Fruit)
    .all(db)
    .await?;
```

## Paginate Result

Convert any SeaORM select into a streamable paginator with custom page size.

> Checkout the API of [paginator](#).

```rust
let mut cake_stream = Cake::find()
    .filter(cake::Column::Name.contains("chocolate"))
    .order_by_asc(cake::Column::Name)
    .paginate(db, 50)
    .into_stream();

while let Some(cakes) = cake_stream.try_next().await? {
    // Do something on cakes: Vec<cake::Model>
}
```
