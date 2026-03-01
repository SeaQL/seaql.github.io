# 原始 SQL

:::tip Since `2.0.0`

新增了 `raw_sql` 宏，提供了许多便捷功能，使编写原始 SQL 查询更加顺手。

特别是可以使用 `({..ids})` 将数组展开为 `(?, ?, ?)`。

详情请参阅 [SeaQuery just made writing raw SQL more enjoyable](https://www.sea-ql.org/blog/2025-08-15-sea-query-raw-sql/)。

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

## 通过原始 SQL 查询到自定义结构体

这里也演示了嵌套 select。

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

## 原始 SQL 查询分页

可以对 [`SelectorRaw`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/struct.SelectorRaw.html) 进行分页并批量获取模型。

```rust
let ids = vec![1, 2, 3, 4];

let mut cake_pages = cake::Entity::find()
    .from_raw_sql(raw_sql!(
        Postgres,
        r#"SELECT "cake"."id", "cake"."name" FROM "cake" WHERE "id" IN ({..ids})"#
    ))
    .paginate(db, 10);

while let Some(cakes) = cake_pages.fetch_and_next().await? {
    // Do something on cakes: Vec<cake::Model>
}
```

## 检查查询生成的 SQL

在任何 CRUD 操作上使用 `build` 和 `to_string` 方法，可以获取用于调试的数据库特定原始 SQL。

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

## 使用原生查询与执行接口

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
    .execute_raw(Statement::from_string(
        DbBackend::MySql,
        "DROP DATABASE IF EXISTS `sea`;",
    ))
    .await?;
assert_eq!(exec_res.rows_affected(), 1);
```

## 执行未预处理的 SQL 语句

可以使用 [`ConnectionTrait::execute_unprepared`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/trait.ConnectionTrait.html#tymethod.execute_unprepared) 执行未准备的 SQL 语句。

```rust
let exec_res: ExecResult =
    db.execute_unprepared("CREATE EXTENSION IF NOT EXISTS citext").await?;
```
