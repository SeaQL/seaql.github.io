# 查询

定义好 Entity 后，就可以从数据库中检索数据了。数据库中的每一行数据都对应一个模型。

默认情况下，SeaORM 会选择 `Column` 枚举中定义的所有列。

## 按主键查找

通过主键查找模型，可以是单主键或复合主键。我们首先在 [`Entity`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/entity/trait.EntityTrait.html) 上调用 [`find_by_id`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/entity/trait.EntityTrait.html#method.find_by_id)，它会自动帮你构建 SELECT 查询和条件。然后，使用 `one` 方法从数据库中获取单个模型。

```rust
use super::cake::Entity as Cake;
use super::cake_filling::Entity as CakeFilling;

// Find by primary key
let cheese: Option<cake::Model> = Cake::find_by_id(1).one(db).await?;

// Find by composite primary keys
let vanilla: Option<cake_filling::Model> = CakeFilling::find_by_id((6, 8)).one(db).await?;
```

## 条件查询与排序

除了通过主键检索模型外，还可以按特定条件和顺序检索一个或多个模型。[`find`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/entity/trait.EntityTrait.html#method.find) 方法让你可以访问 SeaORM 的查询构建器。它支持构建所有常见的 select 表达式，如 `where` 和 `order by`。可以分别使用 [`filter`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/query/trait.QueryFilter.html#method.filter) 和 [`order_by_*`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/query/trait.QueryOrder.html#method.order_by) 方法来构建。

> 更多关于[条件表达式](08-advanced-query/02-conditional-expression.md)的内容。

```rust
let chocolate: Vec<cake::Model> = Cake::find()
    .filter(cake::Column::Name.contains("chocolate"))
    .order_by_asc(cake::Column::Name)
    .all(db)
    .await?;
```

### 强类型 COLUMN 常量

:::tip Since `2.0.0`
需要 `#[sea_orm::model]` 或 `#[sea_orm::compact_model]`。
:::

SeaORM 2.0 为每列生成一个带有类型感知方法的 `COLUMN` 常量。与使用 `Column` 枚举（接受任意值类型）不同，使用 `COLUMN` 可以在编译时进行类型检查：

```rust
// Column enum: compiles even if the type is wrong
cake::Column::Name.contains("chocolate")

// COLUMN constant: type-checked, lowercase field names
cake::COLUMN.name.contains("chocolate")

// compile error: `like` expects a string, not an integer
cake::COLUMN.name.like(2)
```

每列都被包装在特定类型的结构体中（`StringColumn`、`NumericColumn`、`DateLikeColumn` 等），只暴露与该类型相关的方法：

```rust
user::COLUMN.name.contains("Bob")           // StringColumn: LIKE '%Bob%'
user::COLUMN.id.between(1, 100)             // NumericColumn
user::COLUMN.created_at.gt(some_date)       // DateTimeLikeColumn
collection::COLUMN.tags.contains(vec!["a"]) // ArrayColumn: @> ARRAY['a']
```

`COLUMN` 常量也可以通过 `Entity::COLUMN` 访问：

```rust
user::Entity::find().filter(user::Entity::COLUMN.name.contains("Bob"))
```

## 按唯一键查找

:::tip Since `2.0.0`
:::

如果 Entity 具有 `#[sea_orm(unique)]` 属性，SeaORM 会生成 `find_by_*` 和 `filter_by_*` 便捷方法：

```rust
#[sea_orm::model]
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "user")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    #[sea_orm(unique)]
    pub email: String,
    ..
}
```

```rust
let bob = user::Entity::find_by_email("bob@sea-ql.org").one(db).await?;
```

对于使用 `#[sea_orm(unique_key = "pair")]` 定义的复合唯一键，会生成 `find_by_pair` 方法：

```rust
let item = composite_a::Entity::find_by_pair((1, 2)).one(db).await?;
```

这些方法也可在 Entity Loader 上使用：

```rust
let bob = user::Entity::load()
    .filter_by_email("bob@sea-ql.org")
    .with(profile::Entity)
    .one(db)
    .await?;
```

## 查找关联 Model

> 更多内容请参阅 [Relation](06-relation/01-one-to-one.md) 章节。

### Lazy Loading

使用 [`find_related`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/entity/trait.ModelTrait.html#method.find_related) 方法。

相关模型在请求时按需加载，适用于根据某些应用逻辑加载相关模型的场景。注意，与 eager loading 相比，lazy loading 会增加数据库往返次数。

```rust
// Find a cake model first
let cheese: Option<cake::Model> = Cake::find_by_id(1).one(db).await?;
let cheese: cake::Model = cheese.unwrap();

// Then, find all related fruits of this cake
let fruits: Vec<fruit::Model> = cheese.find_related(Fruit).all(db).await?;
```

### Eager Loading

所有相关模型通过 join 在同一查询中加载。

#### One to One

使用 [`find_also_related`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/query/struct.Select.html#method.find_also_related) 方法。

```rust
let fruits_and_cakes: Vec<(fruit::Model, Option<cake::Model>)> = Fruit::find().find_also_related(Cake).all(db).await?;
```

#### One to Many / Many to Many

使用 [`find_with_related`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/query/struct.Select.html#method.find_with_related) 方法，相关模型会按父模型分组。该方法同时处理 1-N 和 M-N 情况，当涉及关联表时会执行 2 次 join。

```rust
let cake_with_fruits: Vec<(cake::Model, Vec<fruit::Model>)> = Cake::find()
    .find_with_related(Fruit)
    .all(db)
    .await?;
```

### Entity Loader

可以将相关 Entity 加载到名为 `ModelEx` 的嵌套结构体中。

:::tip Since `2.0.0`
需要在 entity 定义上使用 `#[sea_orm::model]` 或 `#[sea_orm::compact_model]` 宏。详情请参阅 [SeaORM 2.0 博客文章](https://www.sea-ql.org/blog/2025-10-20-sea-orm-2.0/) (英文)。
:::

```rust
// join paths:
// cake -> fruit
// cake -> cake_filling -> filling

let super_cake = cake::Entity::load()
    .with(fruit::Entity) // 1-1 uses join
    .with(filling::Entity) // M-N uses data loader
    .one(db)
    .await?
    .unwrap();

super_cake
    == cake::ModelEx {
        id: 12,
        name: "Black Forest".into(),
        fruit: Some(fruit::ModelEx {
            name: "Cherry".into(),
        }.into()),
        fillings: vec![filling::ModelEx {
            name: "Chocolate".into(),
        }],
    };
```

### Model Loader

使用 [LoaderTrait](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/query/trait.LoaderTrait.html) 批量加载相关 Entity。

与 eager loading 相比，它节省带宽（考虑一对多的情况，一方行可能会重复），代价是多一次数据库查询。

#### One to One

使用 [load_one](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/query/trait.LoaderTrait.html#tymethod.load_one) 方法。

```rust
let fruits: Vec<fruit::Model> = Fruit::find().all(db).await?;
let cakes: Vec<Option<cake::Model>> = fruits.load_one(Cake, db).await?;
```

#### One to Many

使用 [load_many](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/query/trait.LoaderTrait.html#tymethod.load_many) 方法。

```rust
let cakes: Vec<cake::Model> = Cake::find().all(db).await?;
let fruits: Vec<Vec<fruit::Model>> = cakes.load_many(Fruit, db).await?;
```

#### Many to Many

使用相同的 [load_many](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/query/trait.LoaderTrait.html#tymethod.load_many) 方法。

:::tip Since `2.0.0`
不需要提供中间表 Entity。这正是 SeaORM 的亮点！
:::

```rust
let cakes: Vec<cake::Model> = Cake::find().all(db).await?;
let fillings: Vec<Vec<filling::Model>> = cakes.load_many(Filling, db).await?;
```

## 分页结果

将任何 SeaORM select 转换为具有自定义页面大小的 [paginator](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/struct.Paginator.html)。

```rust
use sea_orm::{entity::*, query::*, tests_cfg::cake};
let mut cake_pages = cake::Entity::find()
    .order_by_asc(cake::Column::Id)
    .paginate(db, 50);
 
while let Some(cakes) = cake_pages.fetch_and_next().await? {
    // Do something on cakes: Vec<cake::Model>
}
```

## 游标分页

如果希望基于列（如主键）进行分页，可使用 cursor 分页。

```rust
use sea_orm::{entity::*, query::*, tests_cfg::cake};
// Create a cursor that order by `cake`.`id`
let mut cursor = cake::Entity::find().cursor_by(cake::Column::Id);

// Filter paginated result by `cake`.`id` > 1 AND `cake`.`id` < 100
cursor.after(1).before(100);

// Get first 10 rows (order by `cake`.`id` ASC)
for cake in cursor.first(10).all(db).await? {
    // Do something on cake: cake::Model
}

// Get last 10 rows (order by `cake`.`id` DESC but rows are returned in ascending order)
for cake in cursor.last(10).all(db).await? {
    // Do something on cake: cake::Model
}
```

基于复合主键的分页也受支持。

```rust
use sea_orm::{entity::*, query::*, tests_cfg::cake_filling};
let rows = cake_filling::Entity::find()
    .cursor_by((cake_filling::Column::CakeId, cake_filling::Column::FillingId))
    .after((0, 1))
    .before((10, 11))
    .first(3)
    .all(&db)
    .await?;
```

## 查询 PartialModel

如果只想选择部分列，可以定义 PartialModel。

```rust
use sea_orm::DerivePartialModel;

#[derive(DerivePartialModel)]
#[sea_orm(entity = "cake::Entity")]
struct CakeWithFruit {
    name: String,
    #[sea_orm(nested)]
    fruit: Option<fruit::Model>, // this can be a regular or another partial model
}

let cakes: Vec<CakeWithFruit> = Cake::find()
    .left_join(fruit::Entity)
    .into_partial_model() // only the columns in the partial model will be selected
    .all(db)
    .await?;
```
