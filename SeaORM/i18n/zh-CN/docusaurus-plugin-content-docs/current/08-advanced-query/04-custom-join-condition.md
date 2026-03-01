# 自定义连接条件

有时你可能希望使用自定义条件 join 另一个表，例如：

```sql
SELECT
    `cake`.`id`,
    `cake`.`name`
FROM
    `cake`
    LEFT JOIN `fruit` ON `cake`.`id` = `fruit`.`cake_id`
    AND `fruit`.`name` LIKE '%tropical%' -- Custom Join Condition
```

可以通过多种方式实现。

## 关联

将额外的 join 条件直接添加到 relation 枚举。最简单的方式是通过 `on_condition` 过程宏属性提供 `sea_query::SimpleExpr`。

```rust
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_many = "super::fruit::Entity")]
    Fruit,
    #[sea_orm(
        has_many = "super::fruit::Entity",
        // Additional on_condition, accept anything that implements `sea_query::IntoCondition`
        on_condition = r#"super::fruit::Column::Name.like("%tropical%")"#
    )]
    TropicalFruit,
}
```

上述过程宏将展开为：

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

生成的 SQL 将是：

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

## 链接关联

你也可以在 `Linked` 上定义自定义 join 条件。

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
                    Expr::col((left, super::cake::Column::Name))
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

生成的 SQL 将是：

```rust
assert_eq!(
    cake::Entity::find()
        .find_also_linked(entity_linked::CheeseCakeToFillingVendor)
        .build(DbBackend::MySql)
        .to_string(),
    [
        r#"SELECT `cake`.`id` AS `A_id`, `cake`.`name` AS `A_name","#,
        r#"`r2`.`id` AS `B_id`, `r2`.`name` AS `B_name`"#,
        r#"FROM `cake`"#,
        r#"LEFT JOIN `cake_filling` AS `r0` ON `cake`.`id` = `r0`.`cake_id` AND `cake`.`name` LIKE '%cheese%'"#,
        r#"LEFT JOIN `filling` AS `r1` ON `r0`.`filling_id` = `r1`.`id`"#,
        r#"LEFT JOIN `vendor` AS `r2` ON `r1`.`vendor_id` = `r2`.`id`"#,
    ]
    .join(" ")
);
```

## 临时定义

最后，自定义 join 条件可以在你构建 join 表达式时定义。

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
                    Expr::col((right, cake_filling::Column::CakeId))
                        .gt(10)
                        .into_condition()
                })
        )
        .join(
            JoinType::LeftJoin,
            cake_filling::Relation::Filling
                .def()
                .on_condition(|_left, right| {
                    Expr::col((right, filling::Column::Name))
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

你可以在 join 语句中指定表别名：

```rust
let cf = "cf";

assert_eq!(
    cake::Entity::find()
        .join_as(
            JoinType::LeftJoin,
            cake_filling::Relation::Cake.def().rev(),
            cf.clone()
        )
        .join(
            JoinType::LeftJoin,
            cake_filling::Relation::Filling.def().from_alias(cf)
        )
        .build(DbBackend::MySql)
        .to_string(),
    [
        "SELECT `cake`.`id`, `cake`.`name` FROM `cake`",
        "LEFT JOIN `cake_filling` AS `cf` ON `cake`.`id` = `cf`.`cake_id`",
        "LEFT JOIN `filling` ON `cf`.`filling_id` = `filling`.`id`",
    ]
    .join(" ")
);
```

## `OR` 条件

```rust {6}
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        has_many = "super::fruit::Entity",
        on_condition = r#"super::fruit::Column::Name.like("%tropical%")"#
        condition_type = "any",
    )]
    OrTropicalFruit,
}
```

```rust {7,12}
assert_eq!(
    cake::Entity::find()
        .column_as(
            Expr::col(("cake_filling_alias", cake_filling::Column::CakeId)),
            "cake_filling_cake_id"
        )
        .join(JoinType::LeftJoin, cake::Relation::OrTropicalFruit.def())
        .join_as_rev(
            JoinType::LeftJoin,
            cake_filling::Relation::Cake
                .def()
                .condition_type(ConditionType::Any)
                .on_condition(|left, _right| {
                    Expr::col((left, cake_filling::Column::CakeId))
                        .gt(10)
                        .into_condition()
                }),
            "cake_filling_alias"
        )
        .build(DbBackend::MySql)
        .to_string(),
    [
        "SELECT `cake`.`id`, `cake`.`name`, `cake_filling_alias`.`cake_id` AS `cake_filling_cake_id` FROM `cake`",
        "LEFT JOIN `fruit` ON `cake`.`id` = `fruit`.`cake_id` OR `fruit`.`name` LIKE '%tropical%'",
        "LEFT JOIN `cake_filling` AS `cake_filling_alias` ON `cake_filling_alias`.`cake_id` = `cake`.`id` OR `cake_filling_alias`.`cake_id` > 10",
    ]
    .join(" ")
);
```
