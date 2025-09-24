# 条件表达式

你可以使用 `filter` 方法向 SeaORM 查询添加条件。你还可以使用 `having` 方法限制聚合结果。两者都接受 [`sea_query::Condition`](https://docs.rs/sea-query/*/sea_query/query/struct.Condition.html) 作为参数。

## AND 条件

使用 `Condition::all` 方法构造 AND 条件表达式，并使用 `add` 方法附加任何以 [`sea_query::SimpleExpr`](https://docs.rs/sea-query/*/sea_query/expr/enum.SimpleExpr.html) 表示的条件。

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

使用 `Condition::any` 方法构造 OR 条件表达式，并使用 `add` 方法附加任何以 [`sea_query::SimpleExpr`](https://docs.rs/sea-query/*/sea_query/expr/enum.SimpleExpr.html) 表示的条件。

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

`add` 方法也可以接受另一个条件表达式。通过这样做，我们可以灵活地构造复杂的嵌套条件。

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

## 流式条件查询

如果给定的 `Option<T>` 是 `Some(_)`，则对 QueryStatement 应用操作。它使你的查询表达式保持流畅！

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
