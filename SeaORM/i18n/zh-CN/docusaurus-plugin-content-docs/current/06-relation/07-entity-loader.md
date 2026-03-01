# 实体批量加载器

实体批量加载器针对不同的关系类型使用 join 和数据加载器策略，消除了嵌套查询中的 N+1 问题。

对于 1-1 关系，它执行 join 并在单个查询中一起选择最多三个表。

对于 1-N 或 M-N 关系，它使用数据加载器。即使是 M-N 关系也是单次查询，因为连接表会被 join。

对于嵌套查询，它会在第二次查询中合并所有模型的 ID，并为第三次查询发出一次查询。

:::tip 自 `2.0.0` 起
需要 `#[sea_orm::model]` 或 `#[sea_orm::compact_model]`。
:::

## 使用 Entity Loader

```rust
// join paths:
// cake -> fruit
// cake -> cake_filling -> filling
//                         filling -> ingredient

let super_cake = cake::Entity::load()
    .filter_by_id(42) // shorthand for .filter(cake::Column::Id.eq(42))
    .with(fruit::Entity) // 1-1 uses join
    .with((filling::Entity, ingredient::Entity)) // M-N uses data loader
    .one(db)
    .await?
    .unwrap();

// 3 queries are executed under the hood:
// 1. SELECT FROM cake JOIN fruit WHERE id = $
// 2. SELECT FROM filling JOIN cake_filling WHERE cake_id IN (..)
// 3. SELECT FROM ingredient WHERE filling_id IN (..)

super_cake
    == cake::ModelEx {
        id: 42,
        name: "Black Forest".into(),
        fruit: Some(
            fruit::ModelEx {
                name: "Cherry".into(),
            }
            .into(),
        ),
        fillings: vec![filling::ModelEx {
            name: "Chocolate".into(),
            ingredients: vec![ingredient::ModelEx {
                name: "Syrup".into(),
            }],
        }],
    };
```

## 分页

Entity Loader 支持使用 `paginate` 进行分页：

```rust
let mut paginator = user::Entity::load()
    .with(profile::Entity)
    .order_by_asc(user::COLUMN.id)
    .paginate(db, 10);

while let Some(users) = paginator.fetch_and_next().await? {
    for user in users {
        // user: user::ModelEx with profile loaded
    }
}
```

## 实现原理

每个 Entity 都会生成一个 `EntityLoader` 结构体。其*概念上*的工作方式如下：

```rust
impl EntityLoader {
    pub async fn all<C: sea_orm::ConnectionTrait>(mut self, db: &C) -> Result<Vec<Model>, DbErr> {
        let mut select = self.select;

        if self.with.fruit {
            select = select.find_also(Entity, super::fruit::Entity);
        }

        let mut cakes = Vec::new();

        for (mut cake, fruit) in select.all(db).await? {
            cake.fruit = Some(fruit);
            cakes.push(cake);
        }

        if self.with.filling {
            let fillings = cakes.load_many(super::filling::Entity, db).await?;

            for (cake, fillings) in cakes.iter_mut().zip(fillings) {
                cake.fillings = fillings;
            }
        }

        Ok(cakes)
    }
}
```
