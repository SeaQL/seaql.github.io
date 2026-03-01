# 条件表达式

你可以使用 `filter` 方法向 SeaORM 的 find 添加条件。你也可以使用 `having` 方法限制聚合结果。两者都接受 [`sea_query::Condition`](https://docs.rs/sea-query/*/sea_query/query/struct.Condition.html) 作为参数。

## AND 条件

使用 `Condition::all` 方法构建 AND 条件表达式，并使用 `add` 方法添加以 [`sea_query::SimpleExpr`](https://docs.rs/sea-query/*/sea_query/expr/enum.SimpleExpr.html) 表示的任何条件。

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

## OR 条件

使用 `Condition::any` 方法构建 OR 条件表达式，并使用 `add` 方法添加以 [`sea_query::SimpleExpr`](https://docs.rs/sea-query/*/sea_query/expr/enum.SimpleExpr.html) 表示的任何条件。

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

## 嵌套条件

`add` 方法也可以接受另一个条件表达式，使我们能够轻松构建复杂的嵌套条件。
不会有多余的括号 `((((`  使查询杂乱，因为 SeaQuery 在注入时会尊重运算符优先级。

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

## Has Related 过滤

:::tip 自 `2.0.0` 起
:::

使用 `has_related` 过滤具有（或不具有）匹配条件的关联 Entity 的 Entity。这会生成 `EXISTS` subquery：

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

这适用于所有关系类型（1-1、1-N、M-N）。SeaORM 根据声明的关系自动解析 join 路径。

## 流式条件查询

当给定的 `Option<T>` 为 `Some(_)` 时，对 QueryStatement 应用操作。它使你的查询表达式保持流式！

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
