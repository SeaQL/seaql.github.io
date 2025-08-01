# One to One

:::tip Rustacean Sticker Pack 🦀
[Our stickers](https://www.sea-ql.org/sticker-pack/) are made with a premium water-resistant vinyl with a unique matte finish.
Stick them on your laptop, notebook, or any gadget to show off your love for Rust!
:::

A one-to-one relation is the most basic type of database relation. Let say a `Cake` entity has at most one `Fruit` topping.

## Defining the Relation

On the `Cake` entity, to define the relation:
1. Add a new variant `Fruit` to the `Relation` enum.
1. Define it with `has_one`.
1. Implement the `Related<Entity>` trait.

```rust title="entity/cake.rs"
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_one = "super::fruit::Entity")]
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

```rust {3,9,16} title="entity/cake.rs"
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
```
</details>

Alternatively, the definition can be shortened by the `DeriveRelation` macro,
where the following eliminates the need for the `RelationTrait` implementation above:

## Defining the Inverse Relation

On the `Fruit` entity, its `cake_id` attribute is referencing the primary key of `Cake` entity.

To define the inverse relation:
1. Add a new enum variant `Relation::Cake` to the `Fruit` entity.
1. Write the definition of it with the `Entity::belongs_to()` method, we always define the inverse relation using this method.
1. Implement the `Related<cake::Entity>` trait.

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