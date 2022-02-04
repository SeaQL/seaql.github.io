# Subquery

## Conditional Expression With Subquery

Use the `in_subquery` or `not_in_subquery` methods to construct conditional expressions with subqueries.

```rust
use sea_orm::Condition;
use sea_query::Query;

assert_eq!(
    cake::Entity::find()
        .filter(
            Condition::any().add(
                cake::Column::Id.in_subquery(
                    Query::select()
                        .expr(cake::Column::Id.max())
                        .from(cake::Entity)
                        .to_owned()
                )
            )
        )
        .build(DbBackend::MySql)
        .to_string(),
    [
        "SELECT `cake`.`id`, `cake`.`name` FROM `cake`",
        "WHERE `cake`.`id` IN (SELECT MAX(`cake`.`id`) FROM `cake`)",
    ]
    .join(" ")
);
```
