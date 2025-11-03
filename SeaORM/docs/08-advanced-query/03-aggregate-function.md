# Aggregate Functions

You can group results selected from SeaORM find with the `group_by` method. If you wish to further restrict the grouped result set, the `having` method can help you achieve that.

## Sum

### Sum a single column

```rust
let sum_order_total: Decimal = order::Entity::find()
    .select_only()
    .column_as(order::Column::Total.sum(), "sum")
    .into_tuple()
    .one(db)
    .await?
    .unwrap();
```

### Sum with group by

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

## Group By

The `group_by` method can take a column of the entity or a complex [`sea_query::SimpleExpr`](https://docs.rs/sea-query/*/sea_query/expr/enum.SimpleExpr.html).

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

### Using group by with aggregate functions

:::info

Aggregation functions such as `max`, `min`, `sum`, `count` are available in [`ColumnTrait`](https://docs.rs/sea-orm/*/sea_orm/entity/trait.ColumnTrait.html).

:::

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

## Having

The `having` method can take any conditional expressions introduced in the previous section.

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
