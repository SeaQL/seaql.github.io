# Self Referencing

From previous section, you learn the [`Linked`](https://docs.rs/sea-orm/0.*/sea_orm/entity/trait.Linked.html) trait. It can also help you define self referencing relations.

Defining an Entity that reference itself.

```rust
use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
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

impl ActiveModelBehavior for ActiveModel {}
```

### Lazy Loading

Use the [`find_linked`](https://docs.rs/sea-orm/0.*/sea_orm/entity/prelude/trait.ModelTrait.html#method.find_linked) method.

Linked models are loaded on demand when you ask for them, preferable if you want to load linked models based on some application logic. Note that lazy loading will increase database round trips compared to eager loading.

```rust
let self_join_model = Model {
    uuid: Uuid::default(),
    uuid_ref: None,
    time: None,
};

assert_eq!(
    self_join_model
        .find_linked(SelfReferencingLink)
        .build(DbBackend::MySql)
        .to_string(),
    [
        "SELECT `self_join`.`uuid`, `self_join`.`uuid_ref`, `self_join`.`time`",
        "FROM `self_join`",
        "INNER JOIN `self_join` AS `r0` ON `r0`.`uuid_ref` = `self_join`.`uuid`",
        "WHERE `r0`.`uuid` = '00000000-0000-0000-0000-000000000000'",
    ]
    .join(" ")
);
```

### Eager Loading

Use the [`find_also_linked`](https://docs.rs/sea-orm/0.*/sea_orm/entity/prelude/struct.Select.html#method.find_also_linked) method.

All linked models are loaded at once. This provides minimum overhead on database round trips compared to lazy loading.

```rust
assert_eq!(
    Entity::find()
        .find_also_linked(SelfReferencingLink)
        .build(DbBackend::MySql)
        .to_string(),
    [
        "SELECT `self_join`.`uuid` AS `A_uuid`, `self_join`.`uuid_ref` AS `A_uuid_ref`, `self_join`.`time` AS `A_time`,",
        "`r0`.`uuid` AS `B_uuid`, `r0`.`uuid_ref` AS `B_uuid_ref`, `r0`.`time` AS `B_time`",
        "FROM `self_join`",
        "LEFT JOIN `self_join` AS `r0` ON `self_join`.`uuid_ref` = `r0`.`uuid`",
    ]
    .join(" ")
);
```
