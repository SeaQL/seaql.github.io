# One to Many

A one-to-many relation is similar to a one-to-one relation. In the previous section, we gave the example of "a `Cake` entity has at most one `Fruit` topping". To make it a one-to-many relation, we remove the "at most one" constraint. So, we have a `Cake` entity that might have many `Fruit` toppings.

## Defining the Relation

This is almost identical to defining a one-to-one relation; the only difference is that we use `Entity::has_many()` method here.

```rust title="entity/cake.rs"
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_many = "super::fruit::Entity")]
    Fruit,
}

impl Related<super::fruit::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Fruit.def()
    }
}
```

<details>
    <summary>It's expanded to:</summary>

```rust {3,9,16}
#[derive(Copy, Clone, Debug, EnumIter)]
pub enum Relation {
    Fruit,
}

impl RelationTrait for Relation {
    fn def(&self) -> RelationDef {
        match self {
            Self::Fruit => Entity::has_many(super::fruit::Entity).into(),
        }
    }
}

impl Related<super::fruit::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Fruit.def()
    }
}
```
</details>

## Defining the Inverse Relation

It is the same as defining the one-to-one inverse relation. The rule of thumb is, always define a `belongs_to` on the Entity with a foreign key `xxx_id`.

```rust title="entity/fruit.rs"
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::cake::Entity",
        from = "Column::CakeId",
        to = "super::cake::Column::Id"
    )]
    Cake,
}

impl Related<super::cake::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Cake.def()
    }
}
```

<details>
    <summary>It's expanded to:</summary>

```rust
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
</details>