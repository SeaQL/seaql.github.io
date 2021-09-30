# Conditional Expressions

You can add conditions to SeaORM find with the `filter` method. You can also restrict the aggregated result with `having` method. Both of them take [`sea_query::Condition`](https://docs.rs/sea-query/0.12.7/sea_query/query/struct.Condition.html) as a parameter.

## AND Condition

Construct the AND conditional expression with `Condition::all` method, and append any condition represented in [`sea_query::SimpleExpr`](https://docs.rs/sea-query/*/sea_query/expr/enum.SimpleExpr.html) with the `add` method.

```rust
assert_eq!(
    cake::Entity::find()
        .filter(
            Condition::all()
                .add(cake::Column::Id.gte(1))
                .add(cake::Column::Name.like("%Cheese%"))
        )
        .build(DbBackend::MySql)
        .to_string(),
    [
        "SELECT `cake`.`id`, `cake`.`name` FROM `cake`",
        "WHERE `cake`.`id` >= 1 AND `cake`.`name` LIKE '%Cheese%'",
    ].join(" ")
);
```

## OR Condition

Construct the OR conditional expression with `Condition::any` method, and append any condition represented in [`sea_query::SimpleExpr`](https://docs.rs/sea-query/*/sea_query/expr/enum.SimpleExpr.html) with the `add` method.

```rust
assert_eq!(
    cake::Entity::find()
        .filter(
            Condition::any()
                .add(cake::Column::Id.eq(4))
                .add(cake::Column::Id.eq(5))
        )
        .build(DbBackend::MySql)
        .to_string(),
    [
        "SELECT `cake`.`id`, `cake`.`name` FROM `cake`",
        "WHERE `cake`.`id` = 4 OR `cake`.`id` = 5",
    ].join(" ")
);
```

## Nested Condition

The `add` method can also take another conditional expression. By doing this, we can construct complex nested conditions flexibly.

```rust
assert_eq!(
    cake::Entity::find()
        .filter(
            Condition::any()
                .add(
                    Condition::all()
                        .add(cake::Column::Id.lte(30))
                        .add(cake::Column::Name.like("%Chocolate%"))
                )
                .add(
                    Condition::all()
                        .add(cake::Column::Id.gte(1))
                        .add(cake::Column::Name.like("%Cheese%"))
                )
        )
        .build(DbBackend::MySql)
        .to_string(),
    [
        "SELECT `cake`.`id`, `cake`.`name` FROM `cake`",
        "WHERE (`cake`.`id` <= 30 AND `cake`.`name` LIKE '%Chocolate%') OR",
        "(`cake`.`id` >= 1 AND `cake`.`name` LIKE '%Cheese%')",
    ].join(" ")
);
```
