# One to One

An one-to-one relationship is the most basic type of database relationship. Let say a `Cake` entity has at most one `Fruit` topping.

## Defining the Relation

On the `Cake` entity, to define the relation
1. Add a new enum variant `Relation::Fruit` to the `Cake` entity.
1. Write the definition for this relationship with `Entity::has_one()`.
1. Implement the `Related<fruit::Entity>`.

```rust {9,15,20} title="entity/cake.rs"
#[derive(Copy, Clone, Debug, EnumIter, DeriveColumn)]
pub enum Column {
    Id,
    Name,
}

#[derive(Copy, Clone, Debug, EnumIter)]
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
// ...
```

## Defining the Inverse Relation

On the `Fruit` entity, its `cake_id` attribute is referencing the primary key of `Cake` entity.

To define the inverse relation
1. Add a new enum variant `Relation::Cake` to the `Fruit` entity.
1. Write the definition for this relationship, we always define the inverse relation with `Entity::belongs_to()`.
1. Implement the `Related<cake::Entity>`.

```rust {10,16,24} title="entity/fruit.rs"
#[derive(Copy, Clone, Debug, EnumIter, DeriveColumn)]
pub enum Column {
    Id,
    Name,
    CakeId,
}

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
// ...
```
