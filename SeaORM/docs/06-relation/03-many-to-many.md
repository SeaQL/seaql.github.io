# Many to Many

A many-to-many relation is formed by three tables, where two tables are related via a junction table. As an example, a `Cake` has many `Filling` and `Filling` are shared by many `Cake` via an intermediate entity `CakeFilling`.

## Defining the Relation

On the `Cake` entity, implement the `Related<filling::Entity>` trait. First, join with intermediate table `via` the inverse of `cake_filling::Relation::Cake` relation, then join `to` `Filling` entity  with `cake_filling::Relation::Filling` relation.

```rust {4,10} title="entity/cake.rs"
impl Related<super::filling::Entity> for Entity {
    // The final relation is Cake -> CakeFilling -> Filling
    fn to() -> RelationDef {
        super::cake_filling::Relation::Filling.def()
    }

    fn via() -> Option<RelationDef> {
        // The original relation is CakeFilling -> Cake,
        // after `rev` it becomes Cake -> CakeFilling
        Some(super::cake_filling::Relation::Cake.def().rev())
    }
}
```

Similarly, on the `Filling` entity, implement the `Related<cake::Entity>` trait. First, join with intermediate table `via` the inverse of `cake_filling::Relation::Filling` relation, then join `to` `Cake` entity  with `cake_filling::Relation::Cake` relation.

```rust {3,7} title="entity/filling.rs"
impl Related<super::cake::Entity> for Entity {
    fn to() -> RelationDef {
        super::cake_filling::Relation::Cake.def()
    }

    fn via() -> Option<RelationDef> {
        Some(super::cake_filling::Relation::Filling.def().rev())
    }
}
```

## Defining the Inverse Relation

On the `CakeFilling` entity, its `cake_id` attribute is referencing the primary key of `Cake` entity, and its `filling_id` attribute is referencing the primary key of `Filling` entity.

To define the inverse relation:
1. Add two new variants `Cake` and `Filling` to the `Relation` enum.
1. Define both relations with `Entity::belongs_to()`.

```rust title="entity/cake_filling.rs"
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
```

Alternatively, the definition can be shortened by the `DeriveRelation` macro,
where the following is equivalent to above:

```rust
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::cake::Entity",
        from = "Column::CakeId",
        to = "super::cake::Column::Id"
    )]
    Cake,
    #[sea_orm(
        belongs_to = "super::filling::Entity",
        from = "Column::FillingId",
        to = "super::filling::Column::Id"
    )]
    Filling,
}
```