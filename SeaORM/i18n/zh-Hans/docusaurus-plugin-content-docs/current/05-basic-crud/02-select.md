# 选择

定义实体后，你就可以从数据库中检索数据了。数据库中的每一行数据都对应一个 `Model`。

默认情况下，SeaORM 将选择 `Column` 枚举中定义的所有列。

## 按主键查找

通过主键查找模型，它可以是单个键或复合键。我们首先在 [`Entity`](https://docs.rs/sea-orm/*/sea_orm/entity/trait.EntityTrait.html) 上调用 [`find_by_id`](https://docs.rs/sea-orm/*/sea_orm/entity/trait.EntityTrait.html#method.find_by_id)，它帮助你自动构建选择查询和条件。然后，使用 `one` 方法从数据库中获取单个模型。

```rust
use super::cake::Entity as Cake;
use super::cake_filling::Entity as CakeFilling;

// 按主键查找
let cheese: Option<cake::Model> = Cake::find_by_id(1).one(db).await?;

// 按复合主键查找
let vanilla: Option<cake_filling::Model> = CakeFilling::find_by_id((6, 8)).one(db).await?;
```

## 带条件和排序的查找

除了通过主键检索模型之外，你还可以按特定顺序检索匹配特定条件的一个或多个模型。[`find`](https://docs.rs/sea-orm/*/sea_orm/entity/trait.EntityTrait.html#method.find) 方法允许你访问 SeaORM 中的查询构建器。它支持构建所有常见的选择表达式，如 `where` 和 `order by`。它们可以分别使用 [`filter`](https://docs.rs/sea-orm/*/sea_orm/query/trait.QueryFilter.html#method.filter) 和 [`order_by_*`](https://docs.rs/sea-orm/*/sea_orm/query/trait.QueryOrder.html#method.order_by) 方法构建。

> 阅读更多关于[条件表达式](08-advanced-query/02-conditional-expression.md)的信息。

```rust
let chocolate: Vec<cake::Model> = Cake::find()
    .filter(cake::Column::Name.contains("chocolate"))
    .order_by_asc(cake::Column::Name)
    .all(db)
    .await?;
```

## 查找相关模型

> 阅读更多关于[关系](06-relation/01-one-to-one.md)一章的内容。

### 延迟加载

使用 [`find_related`](https://docs.rs/sea-orm/*/sea_orm/entity/trait.ModelTrait.html#method.find_related) 方法。

相关模型在你请求时按需加载，如果你想根据某些应用程序逻辑加载相关模型，则更可取。请注意，与急切加载相比，延迟加载会增加数据库往返次数。

```rust
// 首先查找一个蛋糕模型
let cheese: Option<cake::Model> = Cake::find_by_id(1).one(db).await?;
let cheese: cake::Model = cheese.unwrap();

// 然后，查找此蛋糕的所有相关水果
let fruits: Vec<fruit::Model> = cheese.find_related(Fruit).all(db).await?;
```

### 急切加载

所有相关模型一次性加载。与延迟加载相比，这提供了最少的数据库往返次数。

#### 一对一

使用 [`find_also_related`](https://docs.rs/sea-orm/*/sea_orm/query/struct.Select.html#method.find_also_related) 方法。

```rust
let fruits_and_cakes: Vec<(fruit::Model, Option<cake::Model>)> = Fruit::find().find_also_related(Cake).all(db).await?;
```

#### 一对多 / 多对多

使用 [`find_with_related`](https://docs.rs/sea-orm/*/sea_orm/query/struct.Select.html#method.find_with_related) 方法，相关模型将按父模型分组。此方法处理 1-N 和 M-N 两种情况，并且在涉及连接表时将执行 2 次连接。

```rust
let cake_with_fruits: Vec<(cake::Model, Vec<fruit::Model>)> = Cake::find()
    .find_with_related(Fruit)
    .all(db)
    .await?;
```

### 批量加载

自 0.11 起，我们引入了 [LoaderTrait](https://docs.rs/sea-orm/*/sea_orm/query/trait.LoaderTrait.html) 以批量加载相关实体。

与急切加载相比，它以一次（或两次，在多对多情况下）更多的数据库往返为代价节省了带宽（考虑一对多情况，一侧的行可能会重复）。

#### 一对一

使用 [load_one](https://docs.rs/sea-orm/*/sea_orm/query/trait.LoaderTrait.html#tymethod.load_one) 方法。

```rust
let fruits: Vec<fruit::Model> = Fruit::find().all(db).await?;
let cakes: Vec<Option<cake::Model>> = fruits.load_one(Cake, db).await?;
```

#### 一对多

使用 [load_many](https://docs.rs/sea-orm/*/sea_orm/query/trait.LoaderTrait.html#tymethod.load_many) 方法。

```rust
let cakes: Vec<cake::Model> = Cake::find().all(db).await?;
let fruits: Vec<Vec<fruit::Model>> = cakes.load_many(Fruit, db).await?;
```

#### 多对多

使用 [load_many_to_many](https://docs.rs/sea-orm/*/sea_orm/query/trait.LoaderTrait.html#tymethod.load_many_to_many) 方法。你必须提供连接实体。

```rust
let cakes: Vec<cake::Model> = Cake::find().all(db).await?;
let fillings: Vec<Vec<filling::Model>> = cakes.load_many_to_many(Filling, CakeFilling, db).await?;
```

## 分页结果

使用自定义页面大小将任何 SeaORM 选择转换为[分页器](https://docs.rs/sea-orm/*/sea_orm/struct.Paginator.html)。

```rust
use sea_orm::{entity::*, query::*, tests_cfg::cake};
let mut cake_pages = cake::Entity::find()
    .order_by_asc(cake::Column::Id)
    .paginate(db, 50);

while let Some(cakes) = cake_pages.fetch_and_next().await? {
    // 对 cakes: Vec<cake::Model> 执行操作
}
```

## 光标分页

如果你想根据主键等列对行进行分页，请使用光标分页。

```rust
use sea_orm::{entity::*, query::*, tests_cfg::cake};
// 创建一个按 `cake`.`id` 排序的光标
let mut cursor = cake::Entity::find().cursor_by(cake::Column::Id);

// 按 `cake`.`id` > 1 AND `cake`.`id` < 100 过滤分页结果
cursor.after(1).before(100);

// 获取前 10 行（按 `cake`.`id` 升序排序）
for cake in cursor.first(10).all(db).await? {
    // 对 cake: cake::Model 执行操作
}

// 获取后 10 行（按 `cake`.`id` 降序排序，但行按升序返回）
for cake in cursor.last(10).all(db).await? {
    // 对 cake: cake::Model 执行操作
}
```

基于复合主键的分页也可用。

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

## 选择自定义

如果你想选择自定义列和表达式，请阅读[自定义选择](08-advanced-query/01-custom-select.md)部分。