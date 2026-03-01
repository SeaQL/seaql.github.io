# 聚合函数

你可以使用 `group_by` 方法对结果进行分组。如果希望进一步限制分组结果集，可以应用 `having` 方法。

:::info

包括 `max`、`min`、`sum`、`avg`、`count` 在内的聚合函数可在 [`ColumnTrait`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/entity/trait.ColumnTrait.html) 中使用。

:::

## 求和

### 对单列求和

```rust
let sum_order_total: Decimal = order::Entity::find()
    .select_only()
    .column_as(order::Column::Total.sum(), "sum")
    .into_tuple()
    .one(db)
    .await?
    .unwrap();
```

### 带 group by 的求和

```rust
let (customer, total_spent): (String, Decimal) = customer::Entity::find()
    .left_join(order::Entity)
    .select_only()
    .column(customer::Column::Name)
    .column_as(order::Column::Total.sum(), "sum")
    .group_by(customer::Column::Name)
    .into_tuple()
    .one(db)
    .await?
    .unwrap();

assert_eq!(customer, "Kate");
assert_eq!(total_spent, 25.into());
```

## 分组

`group_by` 方法可以接受 Entity 的列或复杂的 [`sea_query::SimpleExpr`](https://docs.rs/sea-query/*/sea_query/expr/enum.SimpleExpr.html)。

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

### 将 group by 与聚合函数结合使用

```rust
#[derive(Debug, FromQueryResult)]
struct SelectResult {
    name: String,
    num_orders: i64,
    total_spent: Decimal,
    min_spent: Decimal,
    max_spent: Decimal,
}

let select = customer::Entity::find()
    .left_join(order::Entity)
    .select_only()
    .column(customer::Column::Name)
    .column_as(order::Column::Total.count(), "num_orders")
    .column_as(order::Column::Total.sum(), "total_spent")
    .column_as(order::Column::Total.min(), "min_spent")
    .column_as(order::Column::Total.max(), "max_spent")
    .order_by_asc(customer::Column::Name)
    .group_by(customer::Column::Name);

let result: Option<SelectResult> = select
    .into_model()
    .one(&ctx.db)
    .await?;
```

## Having 条件

`having` 方法可以接受前一节介绍的任何条件表达式。

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
