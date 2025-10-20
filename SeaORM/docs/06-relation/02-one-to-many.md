# One to Many

A one-to-many relation is similar to a one-to-one relation. In the previous section, we gave the example of "a `Cake` entity has at most one `Fruit` topping". To make it a one-to-many relation, we remove the "at most one" constraint. So, we have a `Cake` entity that might have many `Fruit` toppings.

## Defining the Relation

This is almost identical to defining a one-to-one relation; the only difference is that we use `has_many` annotation here.

```rust {7,8} title="entity/cake.rs"
#[sea_orm::model]
#[derive(DeriveEntityModel, ..)]
#[sea_orm(table_name = "cake")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    #[sea_orm(has_many)]
    pub fruit: HasMany<super::fruit::Entity>,
}
```

<details>
    <summary>It's expanded to:</summary>

```rust {3,4,9}
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
</details>

## Defining the Inverse Relation

It is the same as defining the one-to-one inverse relation. The rule of thumb is, always define a `belongs_to` on the Entity with a foreign key `xxx_id`.

```rust {9,10} title="entity/fruit.rs"
#[sea_orm::model]
#[derive(DeriveEntityModel, ..)]
#[sea_orm(table_name = "fruit")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    // without unique
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

## Composite Foreign Key

Composite foreign key is supported using a tuple syntax.

```rust
mod composite_a {
    #[sea_orm::model]
    #[sea_orm(table_name = "composite_a")]
    pub struct Model {
        #[sea_orm(primary_key)]
        pub id: i32,
        #[sea_orm(unique_key = "pair")]
        pub left_id: i32,
        #[sea_orm(unique_key = "pair")]
        pub right_id: i32,
        #[sea_orm(has_one)]
        pub b: Option<super::composite_b::Entity>,
    }
}

mod composite_b {
    #[sea_orm::model]
    #[sea_orm(table_name = "composite_b")]
    pub struct Model {
        #[sea_orm(primary_key)]
        pub id: i32,
        pub left_id: i32,
        pub right_id: i32,
        #[sea_orm(belongs_to, from = "(left_id, right_id)", to = "(left_id, right_id)")]
        pub a: Option<super::composite_a::Entity>,
    }
}
```