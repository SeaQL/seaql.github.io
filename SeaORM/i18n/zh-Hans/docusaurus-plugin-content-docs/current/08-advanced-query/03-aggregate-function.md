# 聚合函数

你可以使用 `group_by` 方法对从 SeaORM find 中选择的结果进行分组。如果你希望进一步限制分组结果集，`having` 方法可以帮助你实现这一点。

## 分组 (Group By)

`group_by` 方法可以接受实体的一个列或一个复杂的 [`sea_query::SimpleExpr`](https://docs.rs/sea-query/*/sea_query/expr/enum.SimpleExpr.html)。

```rust
assert_eq!(
    cake::Entity::find()
        .select_only()
        .column(cake::Column::Name)
        .group_by(cake::Column::Name)
        .build(DbBackend::Postgres)
        .to_string(),
    r#"SELECT "cake"."name" FROM "cake" GROUP BY "cake"."name""#
);

assert_eq!(
    cake::Entity::find()
        .select_only()
        .column_as(cake::Column::Id.count(), "count")
        .column_as(cake::Column::Id.sum(), "sum_of_id")
        .group_by(cake::Column::Name)
        .build(DbBackend::Postgres)
        .to_string(),
    r#"SELECT COUNT("cake"."id") AS "count", SUM("cake"."id") AS "sum_of_id" FROM "cake" GROUP BY "cake"."name""#
);
```

## 筛选 (Having)

`having` 方法可以接受上一节中介绍的任何条件表达式。

```rust
assert_eq!(
    cake::Entity::find()
        .having(cake::Column::Id.eq(4))
        .having(cake::Column::Id.eq(5))
        .build(DbBackend::MySql)
        .to_string(),
    "SELECT `cake`.`id`, `cake`.`name` FROM `cake` HAVING `cake`.`id` = 4 AND `cake`.`id` = 5"
);

assert_eq!(
    cake::Entity::find()
        .select_only()
        .column_as(cake::Column::Id.count(), "count")
        .column_as(cake::Column::Id.sum(), "sum_of_id")
        .group_by(cake::Column::Name)
        .having(Expr::col("count").gt(6))
        .build(DbBackend::MySql)
        .to_string(),
    "SELECT COUNT(`cake`.`id`) AS `count`, SUM(`cake`.`id`) AS `sum_of_id` FROM `cake` GROUP BY `cake`.`name` HAVING `count` > 6"
);
```

:::info

聚合函数，例如 `max`、`min`、`sum`、`count`，在 [`ColumnTrait`](https://docs.rs/sea-orm/*/sea_orm/entity/prelude/trait.ColumnTrait.html) 中可用。

:::