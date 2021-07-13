# Select

By default SeaORM will select all columns defined in `Entity`.

> To select custom columns / expressions, read the [custom select section](/docs/advanced-query/custom-select#).

The select result will always be a `Model`, unless you explicitly specified.

> To get `serde_json` representation from SeaORM select, read the [raw sql & json section](/docs/basic-crud/raw-sql-and-json#).

## Find by Primary Key

It is very common to select model by primary key, so we provide a convenient API for it. We have `Option<cake::Model>` because the model might not be found in database.

```rust
// Find by primary key
let cheese: Option<cake::Model> = Cake::find_by_id(1).one(db).await?;
let cheese: cake::Model = cheese.unwrap();

// Find by composite primary keys
let vanilla: Option<cake_filling::Model> = CakeFilling::find_by_id((6, 8)).one(db).await?;
let vanilla: cake_filling::Model = vanilla.unwrap();
```

## Find with Conditions and Orders

Filter and order the select result with `.filter()` and `.order_by_*()` methods respectively.

> Read more about [conditional expression](/docs/advanced-query/conditional-expression#).

> Checkout the API of [order expression](#).

```rust
let chocolate: Vec<cake::Model> = Cake::find()
    .filter(cake::Column::Name.contains("chocolate"))
    .order_by_asc(cake::Column::Name)
    .all(db)
    .await?;
```

## Find Related Models

We can use the `.find_related()` method to quickly join and select a foreign table given that we have implemented `Related<Fruit> for Cake`.

> Read more about [table joins](/docs/advanced-query/more-join#).

### Lazy Loading

Preferable if you want to load related models conditionally, however, you have to take into account the increased database round trips.

```rust
// Find a cake model first
let cheese: Option<cake::Model> = Cake::find_by_id(1).one(db).await?;
let cheese: cake::Model = cheese.unwrap();

// Then, find all related fruits of this cake
let fruits: Vec<fruit::Model> = cheese.find_related(Fruit).all(db).await?;
```

### Eager Loading

Minimum overhead on database round trips but only suitable for small to medium sized result.

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
