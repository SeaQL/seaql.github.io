# Entity Loader

The Entity Loader intelligently uses join and data loader different relation types, eliminating the N+1 problem even when performing nested queries.

For 1-1 relations, it does a join and select up to three tables together in a single query.

For 1-N or M-N relations, it uses the data loader. Note that, it's a single query even for M-N relation, as the junction table will be joined.

For nested queries, it uses the data loader. It consolidates the id of all the models in the 2nd query and issue one query for the 3rd.

This is a new feature in 2.0, and is only available to Entities defined with `#[sea_orm::model]` or `#[sea_orm::compact_model]`.

## Using Entity Loader

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

## Under the hood

An `EntityLoader` struct will be generated for each Entity. It works *conceptually* like the following:

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