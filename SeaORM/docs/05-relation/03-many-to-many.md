# Many to Many

An many-to-many relation is formed by three tables, two end tables are related vai an intermediate table. For example, a `Cake` has many `Filling` and `Filling` are shared by many `Cake` via an intermediate entity `CakeFilling`.

## Defining the Relation

On the `Cake` entity, implement the `Related<filling::Entity>` trait. First, join with intermediate table `via` the inverse of `cake_filling::Relation::Cake` relation, then join `to` `Filling` entity  with `cake_filling::Relation::Filling` relation.

```rust title="entity/cake.rs"
#[derive(Copy, Clone, Debug, EnumIter, DeriveColumn)]
pub enum Column {
    Id,
    Name,
}

impl Related<super::filling::Entity> for Entity {
    fn to() -> RelationDef {
        super::cake_filling::Relation::Filling.def()
    }

    fn via() -> Option<RelationDef> {
        Some(super::cake_filling::Relation::Cake.def().rev())
    }
}
// ...
```

On the `Filling` entity, implement the `Related<cake::Entity>` trait. First, join with intermediate table `via` the inverse of `cake_filling::Relation::Filling` relation, then join `to` `Cake` entity  with `cake_filling::Relation::Cake` relation.

```rust title="entity/filling.rs"
#[derive(Copy, Clone, Debug, EnumIter, DeriveColumn)]
pub enum Column {
    Id,
    Name,
}

impl Related<super::cake::Entity> for Entity {
    fn to() -> RelationDef {
        super::cake_filling::Relation::Cake.def()
    }

    fn via() -> Option<RelationDef> {
        Some(super::cake_filling::Relation::Filling.def().rev())
    }
}
// ...
```

## Defining the Inverse Relation

On the `CakeFilling` entity, its `cake_id` attribute is referencing the primary key of `Cake` entity and its `filling_id` attribute is referencing the primary key of `Filling` entity.

To define the inverse relation:
1. Add two new enum variant `Relation::Cake` and `Relation::Filling` to the `Fruit` entity.
1. Write the definition of both relations with `Entity::belongs_to()` method.

```rust title="entity/cake_filling.rs"
#[derive(Copy, Clone, Debug, EnumIter, DeriveColumn)]
pub enum Column {
    CakeId,
    FillingId,
}

#[derive(Copy, Clone, Debug, EnumIter)]
pub enum Relation {
    Cake,
    Filling,
}

impl RelationTrait for Relation {
    fn def(&self) -> RelationDef {
        match self {
            Self::Cake => Entity::belongs_to(super::cake::Entity)
                .from(Column::CakeId)
                .to(super::cake::Column::Id)
                .into(),
            Self::Filling => Entity::belongs_to(super::filling::Entity)
                .from(Column::FillingId)
                .to(super::filling::Column::Id)
                .into(),
        }
    }
}
// ...
```
