# Custom Join Condition

Sometimes you might want to join on another table with custom conditions, such as:

```sql
SELECT
    `cake`.`id`,
    `cake`.`name`
FROM
    `cake`
    LEFT JOIN `fruit` ON `cake`.`id` = `fruit`.`cake_id`
    AND `fruit`.`name` LIKE '%tropical%' -- Custom Join Condition
```

It can be done via one of the following ways.

## Relation

Add your additional join conditions directly to the relation enum. The easiest way is to provide a `sea_query::SimpleExpr` via `on_condition` procedural macros attribute.

```rust
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_many = "super::fruit::Entity")]
    Fruit,
    #[sea_orm(
        has_many = "super::fruit::Entity",
        // Additional on_condition, accept anything implemented `sea_query::IntoCondition`
        on_condition = r#"super::fruit::Column::Name.like("%tropical%")"#
    )]
    TropicalFruit,
}
```

The procedural macros above will be expanded into:

```rust
#[derive(Copy, Clone, Debug, EnumIter)]
pub enum Relation {
    Fruit,
    TropicalFruit,
}

impl RelationTrait for Relation {
    fn def(&self) -> RelationDef {
        match self {
            Self::Fruit => Entity::has_many(super::fruit::Entity).into(),
            Self::TropicalFruit => Entity::has_many(super::fruit::Entity)
                .on_condition(|_left, _right| {
                    super::fruit::Column::Name.like("%tropical%")
                        .into_condition()
                })
                .into(),
        }
    }
}
```

The resulting SQL will be:

```rust
assert_eq!(
    cake::Entity::find()
        .join(JoinType::LeftJoin, cake::Relation::TropicalFruit.def())
        .build(DbBackend::MySql)
        .to_string(),
    [
        "SELECT `cake`.`id`, `cake`.`name` FROM `cake`",
        "LEFT JOIN `fruit` ON `cake`.`id` = `fruit`.`cake_id` AND `fruit`.`name` LIKE '%tropical%'",
    ]
    .join(" ")
);
```

## Linked

You can also define custom join conditions on `Linked`.

```rust
#[derive(Debug)]
pub struct CheeseCakeToFillingVendor;

impl Linked for CheeseCakeToFillingVendor {
    type FromEntity = super::cake::Entity;

    type ToEntity = super::vendor::Entity;

    fn link(&self) -> Vec<RelationDef> {
        vec![
            super::cake_filling::Relation::Cake
                .def()
                // The `on_condition` method takes a closure with parameters
                // denoting the left-hand side and right-hand side table in the join expression.
                .on_condition(|left, _right| {
                    Expr::tbl(left, super::cake::Column::Name)
                        .like("%cheese%")
                        .into_condition()
                })
                .rev(),
            super::cake_filling::Relation::Filling.def(),
            super::filling::Relation::Vendor.def(),
        ]
    }
}
```

The resulting SQL will be:

```rust
assert_eq!(
    cake::Entity::find()
        .find_also_linked(entity_linked::CheeseCakeToFillingVendor)
        .build(DbBackend::MySql)
        .to_string(),
    [
        r#"SELECT `cake`.`id` AS `A_id`, `cake`.`name` AS `A_name`,"#,
        r#"`r2`.`id` AS `B_id`, `r2`.`name` AS `B_name`"#,
        r#"FROM `cake`"#,
        r#"LEFT JOIN `cake_filling` AS `r0` ON `cake`.`id` = `r0`.`cake_id` AND `cake`.`name` LIKE '%cheese%'"#,
        r#"LEFT JOIN `filling` AS `r1` ON `r0`.`filling_id` = `r1`.`id`"#,
        r#"LEFT JOIN `vendor` AS `r2` ON `r1`.`vendor_id` = `r2`.`id`"#,
    ]
    .join(" ")
);
```

## Custom Join

Last but not least, custom join conditions can be defined at the point you construct the join expression.

```rust
assert_eq!(
    cake::Entity::find()
        .join(JoinType::LeftJoin, cake::Relation::TropicalFruit.def())
        .join(
            JoinType::LeftJoin,
            cake_filling::Relation::Cake
                .def()
                .rev()
                .on_condition(|_left, right| {
                    Expr::tbl(right, cake_filling::Column::CakeId)
                        .gt(10)
                        .into_condition()
                })
        )
        .join(
            JoinType::LeftJoin,
            cake_filling::Relation::Filling
                .def()
                .on_condition(|_left, right| {
                    Expr::tbl(right, filling::Column::Name)
                        .like("%lemon%")
                        .into_condition()
                })
        )
        .join(JoinType::LeftJoin, filling::Relation::Vendor.def())
        .build(DbBackend::MySql)
        .to_string(),
    [
        "SELECT `cake`.`id`, `cake`.`name` FROM `cake`",
        "LEFT JOIN `fruit` ON `cake`.`id` = `fruit`.`cake_id` AND `fruit`.`name` LIKE '%tropical%'",
        "LEFT JOIN `cake_filling` ON `cake`.`id` = `cake_filling`.`cake_id` AND `cake_filling`.`cake_id` > 10",
        "LEFT JOIN `filling` ON `cake_filling`.`filling_id` = `filling`.`id` AND `filling`.`name` LIKE '%lemon%'",
        "LEFT JOIN `vendor` ON `filling`.`vendor_id` = `vendor`.`id`",
    ]
    .join(" ")
);
```
