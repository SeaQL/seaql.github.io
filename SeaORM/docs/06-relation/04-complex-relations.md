# Complex Relations

## Linked

The `Related` trait is a representation of the arrows (1-1, 1-N, M-N) we draw on Entity Relationship Diagrams. A [`Linked`](https://docs.rs/sea-orm/*/sea_orm/entity/trait.Linked.html) is composed of a chain of relations, and is useful when:

1. there exist multiple join paths between a pair of entities, making it impossible to impl `Related`
1. joining across multiple entities in a relational query

Implementing `Linked` trait is completely optional, as there are other ways of doing relational queries in SeaORM, which will be explained in later chapters.
With `Linked` implemented, several `find_*_linked` helper methods become available, and relationships can be defined in a single place.

### Defining the Link

Take [this](https://github.com/SeaQL/sea-orm/blob/1.1.x/src/tests_cfg/entity_linked.rs) as an example, where we join cake and filling via an intermediate `cake_filling` table.

```rust title="entity/links.rs"
pub struct CakeToFilling;

impl Linked for CakeToFilling {
    type FromEntity = cake::Entity;

    type ToEntity = filling::Entity;

    fn link(&self) -> Vec<RelationDef> {
        vec![
            cake_filling::Relation::Cake.def().rev(),
            cake_filling::Relation::Filling.def(),
        ]
    }
}
```

Alternatively, the `RelationDef` can be defined on the fly, where the following is equivalent to the above:

```rust
pub struct CakeToFilling;

impl Linked for CakeToFilling {
    type FromEntity = cake::Entity;

    type ToEntity = filling::Entity;

    fn link(&self) -> Vec<RelationDef> {
        vec![
            cake_filling::Relation::Cake.def().rev(),
            cake_filling::Entity::belongs_to(filling::Entity)
                .from(cake_filling::Column::FillingId)
                .to(filling::Column::Id)
                .into(),
        ]
    }
}
```

### Lazy Loading

Find fillings that can be filled into a cake with the [`find_linked`](https://docs.rs/sea-orm/*/sea_orm/entity/prelude/trait.ModelTrait.html#method.find_linked) method.

```rust
let cake_model = cake::Model {
    id: 12,
    name: "".to_owned(),
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
        r#"SELECT `cake`.`id` AS `A_id`, `cake`.`name` AS `A_name`,"#,
        r#"`r1`.`id` AS `B_id`, `r1`.`name` AS `B_name`, `r1`.`vendor_id` AS `B_vendor_id`"#,
        r#"FROM `cake`"#,
        r#"LEFT JOIN `cake_filling` AS `r0` ON `cake`.`id` = `r0`.`cake_id`"#,
        r#"LEFT JOIN `filling` AS `r1` ON `r0`.`filling_id` = `r1`.`id`"#,
    ]
    .join(" ")
);
```

## Self Referencing Relations

The `Link` trait can also define self referencing relations.

The following example defines an Entity that references itself.

```rust
use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "self_join")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub uuid: Uuid,
    pub uuid_ref: Option<Uuid>,
    pub time: Option<Time>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(belongs_to = "Entity", from = "Column::UuidRef", to = "Column::Uuid")]
    SelfReferencing,
}

pub struct SelfReferencingLink;

impl Linked for SelfReferencingLink {
    type FromEntity = Entity;

    type ToEntity = Entity;

    fn link(&self) -> Vec<RelationDef> {
        vec![Relation::SelfReferencing.def()]
    }
}
```

## Diamond Relations

Sometimes there exist multiple relations between a pair of entities. Here we take the simplest example, where `Cake` can have multiple `Fruit`.

```rust
#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "cake")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
    pub topping: i32,
    pub filling: i32,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::fruit::Entity",
        from = "Column::Topping",
        to = "super::fruit::Column::Id"
    )]
    Topping,
    #[sea_orm(
        belongs_to = "super::fruit::Entity",
        from = "Column::Filling",
        to = "super::fruit::Column::Id"
    )]
    Filling,
}
```

How can we define the `Fruit` Entity?
By default, `has_many` invokes the `Related` trait to define the relation.
As a consequence, it's not possible to define the Relation without `Related` impl.

Here we have to specify the Relation variant of the related entity manually with the `via` attribute.

```rust
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "fruit")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_many = "super::cake::Entity", via = "Relation::Topping")]
    CakeTopping,
    #[sea_orm(has_many = "super::cake::Entity", via = "Relation::Filling")]
    CakeFilling,
}
```
