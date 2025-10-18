# Many to Many

A standout feature of SeaORM is its ability to model many-to-many relationships directly at the Entity level. The intermediate junction table is abstracted away, so traversing an M-N relation feels just like a simple 1-N: a single method call instead of multiple joins.

A many-to-many relation is formed by three tables, where two tables are related via a junction table. As an example, a `Cake` has many `Filling` and `Filling` are shared by many `Cake` via an intermediate entity `CakeFilling`.

## Defining the Relation

On the `Cake` entity, to define the relation:
1. Add a new field `filling` to the `Model`.
1. Annotate it with `has_many`, and specify the junction table with `via`.

```rust {10,11} title="entity/cake.rs"
#[sea_orm::model]
#[derive(DeriveEntityModel, ..)]
#[sea_orm(table_name = "cake")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
    #[sea_orm(has_one)]
    pub fruit: HasOne<super::fruit::Entity>,
    #[sea_orm(has_many, via = "cake_filling")] // M-N relation with junction
    pub fillings: HasMany<super::filling::Entity>,
}
```

<details>
    <summary>It's expanded to:</summary>

`Relation` in SeaORM is an arrow: it has `from` and `to`. `cake_filling::Relation::Cake` defines `CakeFilling -> Cake`. Calling [`rev`](https://docs.rs/sea-orm/*/sea_orm/entity/prelude/struct.RelationDef.html#method.rev) reverses it into `Cake -> CakeFilling`.

Chaining this with `cake_filling::Relation::Filling` which defines `CakeFilling -> Filling` resulting in `Cake -> CakeFilling -> Filling`.

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
</details>

Similarly, on the `Filling` entity:

```rust {8,9} title="entity/cake.rs"
#[sea_orm::model]
#[derive(DeriveEntityModel, ..)]
#[sea_orm(table_name = "filling")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
    #[sea_orm(has_many, via = "cake_filling")]
    pub cakes: HasMany<super::cake::Entity>,
}
```

## Defining the Junction Table

On the `CakeFilling` entity, its `cake_id` attribute is referencing the primary key of `Cake` entity, and its `filling_id` attribute is referencing the primary key of `Filling` entity.

To define the inverse relation:
1. Add two new fields `cake` and `filling` to the `Model`.
1. Define both relations with `belongs_to`.

```rust {9-12} title="entity/cake_filling.rs"
#[sea_orm::model]
#[derive(DeriveEntityModel, ..)]
#[sea_orm(table_name = "cake_filling")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub cake_id: i32,
    #[sea_orm(primary_key, auto_increment = false)]
    pub filling_id: i32,
    #[sea_orm(belongs_to, from = "cake_id", to = "id")]
    pub cake: Option<super::cake::Entity>,
    #[sea_orm(belongs_to, from = "filling_id", to = "id")]
    pub filling: Option<super::filling::Entity>,
}
```

<details>
    <summary>It's expanded to:</summary>

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
</details>

## Limitation of Codegen

Usually, the `Related` trait implementations are automatically generated. However, they will not be generated if there exists multiple relations to a related Entity.

The relation enum variant will still be generated, so they can be used in joins.

```rust
#[sea_orm::model]
#[derive(DeriveEntityModel, ..)]
#[sea_orm(table_name = "cake_with_many_fruits")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub fruit_id1: i32,
    pub fruit_id2: i32,
    #[sea_orm(belongs_to, relation_enum = "Fruit1", from = "fruit_id1", to = "id")]
    pub fruit_1: HasOne<super::fruit::Entity>,
    #[sea_orm(belongs_to, relation_enum = "Fruit2", from = "fruit_id2", to = "id")]
    pub fruit_2: HasOne<super::fruit::Entity>,
}

// expands to:

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(belongs_to = ..)]
    Fruit1,
    #[sea_orm(belongs_to = ..)]
    Fruit2,
}
```

The solution is to define relations with the `Linked` which will be described in the next chapter.
