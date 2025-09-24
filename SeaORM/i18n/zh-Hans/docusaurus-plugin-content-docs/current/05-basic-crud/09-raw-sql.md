# 原始 SQL

:::tip 自 `2.0.0` 起

新增了 `raw_sql` 宏，它具有许多简洁的特性，使编写原始 SQL 查询更加符合人体工程学。

特别是，你可以使用 `({..ids})` 将数组扩展为 `(?, ?, ?)`。

在 [SeaQuery 刚刚让编写原始 SQL 变得更加愉快](https://www.sea-ql.org/blog/2025-08-15-sea-query-raw-sql/) 中了解更多。

:::

## 通过原始 SQL 查找模型

```rust
let id = 1;

let cake: Option<cake::Model> = cake::Entity::find()
    .from_raw_sql(raw_sql!(
        Postgres,
        r#"SELECT "cake"."id", "cake"."name" FROM "cake" WHERE "id" = {id}"#
    ))
    .one(&db)
    .await?;
```

## 通过原始 SQL 选择到自定义结构体

这里也演示了嵌套选择。

```rust
#[derive(FromQueryResult)]
struct Cake {
    name: String,
    #[sea_orm(nested)]
    bakery: Option<Bakery>,
}

#[derive(FromQueryResult)]
struct Bakery {
    #[sea_orm(alias = "bakery_name")]
    name: String,
}

let cake_ids = [2, 3, 4];

let cake: Option<Cake> = Cake::find_by_statement(raw_sql!(
    Sqlite,
    r#"SELECT "cake"."name", "bakery"."name" AS "bakery_name"
       FROM "cake"
       LEFT JOIN "bakery" ON "cake"."bakery_id" = "bakery"."id"
       WHERE "cake"."id" IN ({..cake_ids})"#
))
.one(db)
.await?;
```

## 分页原始 SQL 查询

你可以对 [`SelectorRaw`](https://docs.rs/sea-orm/*/sea_orm/struct.SelectorRaw.html) 进行分页并批量获取 `Model`。

```rust
let ids = vec![1, 2, 3, 4];

let mut cake_pages = cake::Entity::find()
    .from_raw_sql(raw_sql!(
        Postgres,
        r#"SELECT "cake"."id", "cake"."name" FROM "cake" WHERE "id" IN ({..ids})"#
    ))
    .paginate(db, 10);

while let Some(cakes) = cake_pages.fetch_and_next().await? {
    // 对 cakes: Vec<cake::Model> 进行操作
}
```

## 从查询中检查原始 SQL

在任何 CRUD 操作上使用 `build` 和 `to_string` 方法来获取特定于数据库的原始 SQL，用于调试目的。

```rust
use sea_orm::{DbBackend, QueryTrait};

assert_eq!(
    cake_filling::Entity::find_by_id((6, 8))
        .build(DbBackend::MySql)
        .to_string(),
    [
        "SELECT `cake_filling`.`cake_id`, `cake_filling`.`filling_id` FROM `cake_filling`",
        "WHERE `cake_filling`.`cake_id` = 6 AND `cake_filling`.`filling_id` = 8",
    ].join(" ")
);
```

## 使用原始查询和执行接口

你可以使用 `sea-query` 构建 SQL 语句，并直接在 SeaORM 内部的 `DatabaseConnection` 接口上查询/执行它。

### 使用 `query_one` 和 `query_all` 方法获取自定义结果

```rust
let query_res: Option<QueryResult> = db
    .query_one_raw(Statement::from_string(
        DbBackend::MySql,
        "SELECT * FROM `cake`;",
    ))
    .await?;
let query_res = query_res.unwrap();
let id: i32 = query_res.try_get("", "id")?;

let query_res_vec: Vec<QueryResult> = db
    .query_all_raw(Statement::from_string(
        DbBackend::MySql,
        "SELECT * FROM `cake`;",
    ))
    .await?;
```

### 使用 `execute` 方法执行查询

```rust
let exec_res: ExecResult = db
    .execute(Statement::from_string(
        DbBackend::MySql,
        "DROP DATABASE IF EXISTS `sea`;",
    ))
    .await?;
assert_eq!(exec_res.rows_affected(), 1);
```

## 执行未预处理的 SQL 语句

你可以使用 [`ConnectionTrait::execute_unprepared`](https://docs.rs/sea-orm/*/sea_orm/trait.ConnectionTrait.html#tymethod.execute_unprepared) 执行未预处理的 SQL 语句。

```rust
let exec_res: ExecResult =
    db.execute_unprepared("CREATE EXTENSION IF NOT EXISTS citext").await?;