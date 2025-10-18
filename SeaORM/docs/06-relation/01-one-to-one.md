# One to One

:::tip Rustacean Sticker Pack 🦀
[Our stickers](https://www.sea-ql.org/sticker-pack/) are made with a premium water-resistant vinyl with a unique matte finish.
Stick them on your laptop, notebook, or any gadget to show off your love for Rust!
:::

A one-to-one relation is the most basic type of database relation. Let say a `Cake` entity has at most one `Fruit` topping.

## Defining the Relation

On the `Cake` entity, to define the relation:
1. Add a new field `fruit` to the `Model`.
1. Annotate it with `has_one`.

```rust {7,8} title="entity/cake.rs"
#[sea_orm::model]
#[derive(DeriveEntityModel, ..)]
#[sea_orm(table_name = "cake")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    #[sea_orm(has_one)]
    pub fruit: HasOne<super::fruit::Entity>,
}
```

<details>
    <summary>It's expanded to:</summary>

```rust {3,4,9} title="entity/cake.rs"
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
</details>

## Defining the Inverse Relation

On the `Fruit` entity, its `cake_id` attribute is referencing the primary key of `Cake` entity.

:::tip

The rule of thumb is, always define a `belongs_to` on the Entity with a foreign key `xxx_id`.

:::

To define the inverse relation:
1. Add a new field `cake` to the fruit `Model`.
1. Annotate the relation with `belongs_to`.
1. Implement the `Related<cake::Entity>` trait.

```rust {9,10} title="entity/fruit.rs"
#[sea_orm::model]
#[derive(DeriveEntityModel, ..)]
#[sea_orm(table_name = "fruit")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    #[sea_orm(unique)]
    pub cake_id: Option<i32>,
    #[sea_orm(belongs_to, from = "cake_id", to = "id")]
    pub cake: HasOne<super::cake::Entity>,
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