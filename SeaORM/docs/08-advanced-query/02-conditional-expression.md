# Conditional Expressions

You can add conditions to SeaORM find with the `filter` method. You can also restrict the aggregated result with `having` method. Both of them take [`sea_query::Condition`](https://docs.rs/sea-query/*/sea_query/query/struct.Condition.html) as a parameter.

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

The `add` method can also take another conditional expression, allowing us to construct complex nested conditions easily.
There is no superfluous parentheses `((((` cluttering the query, because SeaQuery respects operator precedence when injecting them.

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

## Has Related

:::tip Since `2.0.0`
:::

Use `has_related` to filter entities that have (or do not have) related entities matching a condition. This generates an `EXISTS` subquery:

```rust
let related = cake::Entity::find()
    .has_related(filling::Entity, filling::Column::Name.eq("Marmalade"))
    .all(db)
    .await?;
```

```sql
SELECT "cake"."id", "cake"."name" FROM "cake"
WHERE EXISTS(
    SELECT 1 FROM "filling"
    INNER JOIN "cake_filling" ON "cake_filling"."filling_id" = "filling"."id"
    WHERE "filling"."name" = 'Marmalade'
    AND "cake"."id" = "cake_filling"."cake_id"
)
```

This works across all relation types (1-1, 1-N, M-N). SeaORM resolves the join path automatically based on the declared relations.

## Fluent conditional query

Apply an operation on the QueryStatement if the given `Option<T>` is `Some(_)`. It keeps your query expression fluent!

```rust
use sea_orm::{entity::*, query::*, tests_cfg::cake, DbBackend};

assert_eq!(
    cake::Entity::find()
        .apply_if(Some(3), |mut query, v| {
            query.filter(cake::Column::Id.eq(v))
        })
        .apply_if(Some(100), QuerySelect::limit)
        .apply_if(None, QuerySelect::offset::<Option<u64>>) // no-op
        .build(DbBackend::Postgres)
        .to_string(),
    r#"SELECT "cake"."id", "cake"."name" FROM "cake" WHERE "cake"."id" = 3 LIMIT 100"#
);
```
