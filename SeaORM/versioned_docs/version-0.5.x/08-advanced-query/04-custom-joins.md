# Custom Joins

You can use the `join` method to construct complex join select queries. It takes any `RelationDef` defined in entity files, and you can define relation with the `belongs_to` method as well. Join type is specified using `JoinType` such as inner join, left join and right join.

```rust
use sea_orm::{JoinType, RelationTrait};
use sea_query::Expr;

assert_eq!(
    cake::Entity::find()
        .column_as(filling::Column::Id.count(), "count")
        .join_rev(
            // construct `RelationDef` on the fly
            JoinType::InnerJoin,
            cake_filling::Entity::belongs_to(cake::Entity)
                .from(cake_filling::Column::CakeId)
                .to(cake::Column::Id)
                .into()
        )
        // reuse a `Relation` from existing Entity
        .join(JoinType::InnerJoin, cake_filling::Relation::Filling.def())
        .group_by(cake::Column::Id)
        .having(filling::Column::Id.count().equals(Expr::value(2)))
        .build(DbBackend::MySql)
        .to_string(),
    [
        "SELECT `cake`.`id`, `cake`.`name`, COUNT(`filling`.`id`) AS `count` FROM `cake`",
        "INNER JOIN `cake_filling` ON `cake_filling`.`cake_id` = `cake`.`id`",
        "INNER JOIN `filling` ON `cake_filling`.`filling_id` = `filling`.`id`",
        "GROUP BY `cake`.`id`",
        "HAVING COUNT(`filling`.`id`) = 2",
    ]
    .join(" ")
);
```

> You can use a custom `struct` derived from the `FromQueryResult` trait to handle the result of such complex query. See [here](08-advanced-query/01-custom-select.md#handling-custom-selects) for details.
