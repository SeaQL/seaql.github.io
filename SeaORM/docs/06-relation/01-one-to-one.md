# One to One

A one-to-one relation is the most basic type of database relation. Let say a `Cake` entity has at most one `Fruit` topping.

## Defining the Relation

On the `Cake` entity, to define the relation:
1. Add a new variant `Fruit` to the `Relation` enum.
1. Define it with `Entity::has_one()`.
1. Implement the `Related<Entity>` trait.

```rust {2,8,13} title="entity/cake.rs"
pub enum Relation {
    Fruit,
}

impl RelationTrait for Relation {
    fn def(&self) -> RelationDef {
        match self {
            Self::Fruit => Entity::has_one(super::fruit::Entity).into(),
        }
    }
}

impl Related<super::fruit::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Fruit.def()
    }
}
```

## Defining the Inverse Relation

On the `Fruit` entity, its `cake_id` attribute is referencing the primary key of `Cake` entity.

To define the inverse relation:
1. Add a new enum variant `Relation::Cake` to the `Fruit` entity.
1. Write the definition of it with the `Entity::belongs_to()` method, we always define the inverse relation using this method.
1. Implement the `Related<cake::Entity>` trait.

```rust title="entity/fruit.rs"
#[derive(Copy, Clone, Debug, EnumIter)]
pub enum Relation {
    Cake,
}

impl RelationTrait for Relation {
    fn def(&self) -> RelationDef {
        match self {
            Self::Cake => Entity::belongs_to(super::cake::Entity)
                .from(Column::CakeId)
                .to(super::cake::Column::Id)
                .into(),
        }
    }
}

impl Related<super::cake::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Cake.def()
    }
}
```
