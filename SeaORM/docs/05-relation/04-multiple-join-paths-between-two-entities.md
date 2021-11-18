# Multiple Join Paths Between Two Entities

If you have multiple join paths between two tables or have complex joins that involve multiple tables, you can define it with [`Linked`](https://docs.rs/sea-orm/0.*/sea_orm/entity/trait.Linked.html). Take [this](https://github.com/SeaQL/sea-orm/blob/master/src/tests_cfg/cake.rs) as an example. We join cake and filling via an intermediate cake_filling table.

```rust
#[derive(Debug)]
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

### Lazy Loading

Use the [`find_linked`](https://docs.rs/sea-orm/0.*/sea_orm/entity/prelude/trait.ModelTrait.html#method.find_linked) method.

Linked models are loaded on demand when you ask for them, preferable if you want to load linked models based on some application logic. Note that lazy loading will increase database round trips compared to eager loading.

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
        r#"SELECT `filling`.`id`, `filling`.`name`"#,
        r#"FROM `filling`"#,
        r#"INNER JOIN `cake_filling` ON `cake_filling`.`filling_id` = `filling`.`id`"#,
        r#"INNER JOIN `cake` ON `cake`.`id` = `cake_filling`.`cake_id`"#,
        r#"WHERE `cake`.`id` = 12"#,
    ]
    .join(" ")
);
```

### Eager Loading

Use the [`find_also_linked`](https://docs.rs/sea-orm/0.2.1/sea_orm/entity/prelude/struct.Select.html#method.find_also_linked) method.

All linked models are loaded at once. This provides minimum overhead on database round trips compared to lazy loading.

```rust
assert_eq!(
    cake::Entity::find()
        .find_also_linked(cake::CakeToFilling)
        .build(DbBackend::MySql)
        .to_string(),
    [
        "SELECT `cake`.`id` AS `A_id`, `cake`.`name` AS `A_name`,",
        "`filling`.`id` AS `B_id`, `filling`.`name` AS `B_name`",
        "FROM `cake`",
        "LEFT JOIN `cake_filling` ON `cake`.`id` = `cake_filling`.`cake_id`",
        "LEFT JOIN `filling` ON `cake_filling`.`filling_id` = `filling`.`id`",
    ]
    .join(" ")
);
```
