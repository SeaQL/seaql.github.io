# Select

Once you have defined the entity, you are ready to retrieve data from the database. Each row of data in the database corresponds to a `Model`.

By default, SeaORM will select all columns defined in the `Column` enum.

## Find by Primary Key

Find a model by its primary key, it can be a single key or composite key. We start by calling [`find_by_id`](https://docs.rs/sea-orm/*/sea_orm/entity/trait.EntityTrait.html#method.find_by_id) on [`Entity`](https://docs.rs/sea-orm/*/sea_orm/entity/trait.EntityTrait.html) which helps you construct the select query and condition automatically. Then, fetch a single model from the database with the `one` method.

```rust
use super::cake::Entity as Cake;
use super::cake_filling::Entity as CakeFilling;

// Find by primary key
let cheese: Option<cake::Model> = Cake::find_by_id(1).one(db).await?;

// Find by composite primary keys
let vanilla: Option<cake_filling::Model> = CakeFilling::find_by_id((6, 8)).one(db).await?;
```

## Find with Conditions and Orders

In addition to retrieving a model by primary key, you can also retrieve one or more models matching specific conditions in a certain order. The [`find`](https://docs.rs/sea-orm/*/sea_orm/entity/trait.EntityTrait.html#method.find) method gives you access to the query builder in SeaORM. It supports the construction of all common select expressions like `where` and `order by`. They can be constructed using [`filter`](https://docs.rs/sea-orm/*/sea_orm/entity/prelude/trait.QueryFilter.html#method.filter) and [`order_by_*`](https://docs.rs/sea-orm/*/sea_orm/query/trait.QueryOrder.html#method.order_by) methods respectively.

> Read more about [conditional expression](09-advanced-query/02-conditional-expression.md).

```rust
let chocolate: Vec<cake::Model> = Cake::find()
    .filter(cake::Column::Name.contains("chocolate"))
    .order_by_asc(cake::Column::Name)
    .all(db)
    .await?;
```

## Find Related Models

> Read more about [table joins](09-advanced-query/04-custom-joins.md).

### Lazy Loading

Use the [`find_related`](https://docs.rs/sea-orm/*/sea_orm/entity/prelude/trait.ModelTrait.html#method.find_related) method.

Related models are loaded on demand when you ask for them, preferable if you want to load related models based on some application logic. Note that lazy loading will increase database round trips compared to eager loading.

```rust
// Find a cake model first
let cheese: Option<cake::Model> = Cake::find_by_id(1).one(db).await?;
let cheese: cake::Model = cheese.unwrap();

// Then, find all related fruits of this cake
let fruits: Vec<fruit::Model> = cheese.find_related(Fruit).all(db).await?;
```

### Eager Loading

All related models are loaded at once. This provides minimum overhead on database round trips compared to lazy loading.

#### One to One

Use the [`find_also_related`](https://docs.rs/sea-orm/*/sea_orm/entity/prelude/struct.Select.html#method.find_also_related) method.

```rust
let cake_and_fruit: Vec<(cake::Model, Option<fruit::Model>)> = Cake::find().find_also_related(Fruit).all(db).await?;
```

#### One to Many

Using the [`find_with_related`](https://docs.rs/sea-orm/*/sea_orm/entity/prelude/struct.Select.html#method.find_with_related) method, the related models will be grouped by the parent models.

```rust
let cake_with_fruits: Vec<(cake::Model, Vec<fruit::Model>)> = Cake::find()
    .find_with_related(Fruit)
    .all(db)
    .await?;
```

## Paginate Result

Convert any SeaORM select into a [paginator](https://docs.rs/sea-orm/*/sea_orm/struct.Paginator.html) with custom page size.

```rust
use sea_orm::{entity::*, query::*, tests_cfg::cake};
let mut cake_pages = cake::Entity::find()
    .order_by_asc(cake::Column::Id)
    .paginate(db, 50);
 
while let Some(cakes) = cake_pages.fetch_and_next().await? {
    // Do something on cakes: Vec<cake::Model>
}
```

## Select custom

If you want to select custom columns and expressions, read the [custom select](09-advanced-query/01-custom-select.md) section.
