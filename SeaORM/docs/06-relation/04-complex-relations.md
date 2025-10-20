# Complex Relations

## Linked

The `Related` trait is a representation of the arrows (1-1, 1-N, M-N) we draw on Entity Relationship Diagrams. A [`Linked`](https://docs.rs/sea-orm/*/sea_orm/entity/trait.Linked.html) is composed of a chain of relations, and is useful when:

1. there exist multiple join paths between a pair of entities, making it impossible to impl `Related`
1. joining across multiple entities in a relational query

Implementing `Linked` trait is completely optional, as there are other ways of doing relational queries in SeaORM, which will be explained in later chapters.
With `Linked` implemented, several `find_*_linked` helper methods become available, and relationships can be defined in a single place.

### Defining the Link

Take [this](https://github.com/SeaQL/sea-orm/blob/master/src/tests_cfg/entity_linked.rs) as an example, where we join cake and filling via an intermediate `cake_filling` table.

```rust title="entity/links.rs"
pub struct CakeToFilling;

impl Linked for CakeToFilling {
    type FromEntity = cake::Entity;
    type ToEntity = filling::Entity;

    fn link(&self) -> Vec<RelationDef> {
        vec![
            cake_filling::Relation::Cake.def().rev(), // cake -> cake_filling
            cake_filling::Relation::Filling.def(),    // cake_filling -> filling
        ]
    }
}
```

### Lazy Loading

Find fillings that can be filled into a cake with the [`find_linked`](https://docs.rs/sea-orm/*/sea_orm/entity/prelude/trait.ModelTrait.html#method.find_linked) method.

```rust
let cake_model = cake::Model {
    id: 12,
    name: "Chocolate".into(),
};

assert_eq!(
    cake_model
        .find_linked(cake::CakeToFilling)
        .build(DbBackend::MySql)
        .to_string(),
    [
        "SELECT `filling`.`id`, `filling`.`name`, `filling`.`vendor_id`",
        "FROM `filling`",
        "INNER JOIN `cake_filling` AS `r0` ON `r0`.`filling_id` = `filling`.`id`",
        "INNER JOIN `cake` AS `r1` ON `r1`.`id` = `r0`.`cake_id`",
        "WHERE `r1`.`id` = 12",
    ]
    .join(" ")
);
```

### Eager Loading

[`find_also_linked`](https://docs.rs/sea-orm/*/sea_orm/entity/prelude/struct.Select.html#method.find_also_linked) is a dual of `find_also_related`; [`find_with_linked`](https://docs.rs/sea-orm/*/sea_orm/entity/prelude/struct.Select.html#method.find_with_linked) is a dual of `find_with_related`; :

```rust
assert_eq!(
    cake::Entity::find()
        .find_also_linked(links::CakeToFilling)
        .build(DbBackend::MySql)
        .to_string(),
    [
        "SELECT `cake`.`id` AS `A_id`, `cake`.`name` AS `A_name`,",
        "`r1`.`id` AS `B_id`, `r1`.`name` AS `B_name`, `r1`.`vendor_id` AS `B_vendor_id`",
        "FROM `cake`",
        "LEFT JOIN `cake_filling` AS `r0` ON `cake`.`id` = `r0`.`cake_id`",
        "LEFT JOIN `filling` AS `r1` ON `r0`.`filling_id` = `r1`.`id`",
    ]
    .join(" ")
);
```

## Self Referencing Relations

The `Link` trait can also define self referencing relations. The following example defines an Entity that references itself.

```rust title="self_join.rs"
use sea_orm::entity::prelude::*;

#[sea_orm::model]
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "self_join")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub uuid: Uuid,
    pub uuid_ref: Option<Uuid>,
    pub time: Option<Time>,
    #[sea_orm(self_ref, relation_enum = "SelfRef", from = "uuid_ref", to = "uuid")]
    pub other: HasOne<Entity>,
}

pub struct SelfReferencingLink;

impl Linked for SelfReferencingLink {
    type FromEntity = Entity;
    type ToEntity = Entity;

    fn link(&self) -> Vec<RelationDef> {
        vec![Relation::SelfRef.def()] // <- use the relation here
    }
}

impl ActiveModelBehavior for ActiveModel {}
```

### Querying model pairs

```rust
let models: Vec<(self_join::Model, Option<self_join::Model>)> = self_join::Entity::find()
    .find_also_linked(self_join::SelfReferencingLink)
    .order_by_asc(self_join::Column::Time)
    .all(db)
    .await?;
```

## Diamond Relations

Sometimes there exist multiple relations between a pair of entities. Here we take the simplest example, where `Cake` can have multiple `Fruit`.

```rust
#[sea_orm::model]
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "cake")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
    pub topping_id: i32,
    pub filling_id: i32,
    #[sea_orm(belongs_to, relation_enum = "Topping", from = "topping_id", to = "id")]
    pub topping: HasOne<super::fruit::Entity>,
    #[sea_orm(belongs_to, relation_enum = "Filling", from = "filling_id", to = "id")]
    pub filling: HasOne<super::fruit::Entity>,
}
```

How can we define the `Fruit` Entity?
By default, `has_many` invokes the `Related` trait to define the relation.
As a consequence, we have to specify the `Relation` variant of the related entity manually with the `via_rel` attribute.

```rust
#[sea_orm::model]
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "fruit")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
    #[sea_orm(has_many, relation_enum = "ToppingOf", via_rel = "Topping")]
    pub topping_of: HasMany<super::cake::Entity>,
    #[sea_orm(has_many, relation_enum = "FillingOf", via_rel = "Filling")]
    pub filling_of: HasMany<super::cake::Entity>,
}
```

Then you can use the relations like:

```rust
fruit::Entity::find().join(JoinType::LeftJoin, fruit::Relation::ToppingOf.def());
```