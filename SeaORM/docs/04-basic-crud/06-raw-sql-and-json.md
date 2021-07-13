# Raw SQL & JSON

This section discuss utilities that can be used.

## Get Raw SQL for Debug

Use `.build(QueryBuilder).to_string()` on any CRUD operations to get the database specific raw SQL for debugging purpose.

```rust
// All query building available in `sea_query`
use sea_orm::sea_query::{
    MysqlQueryBuilder,
    PostgresQueryBuilder,
    SqliteQueryBuilder,
};

assert_eq!(
    cake_filling::Entity::find_by_id((6, 8))
        .build(MysqlQueryBuilder)
        .to_string(),
    vec![
        "SELECT `cake_filling`.`cake_id`, `cake_filling`.`filling_id` FROM `cake_filling`",
        "WHERE `cake_filling`.`cake_id` = 6 AND `cake_filling`.`filling_id` = 8",
    ].join(" ")
);

assert_eq!(
    fruit::Entity::update_many()
        .col_expr(fruit::Column::CakeId, Expr::value(Value::Null))
        .filter(fruit::Column::Name.contains("Apple"))
        .build(MysqlQueryBuilder)
        .to_string(),
    "UPDATE `fruit` SET `cake_id` = NULL WHERE `fruit`.`name` LIKE '%Apple%'".to_owned()
);

assert_eq!(
    fruit::Entity::delete_many()
        .filter(fruit::Column::Name.contains("Orange"))
        .build(MysqlQueryBuilder)
        .to_string(),
    "DELETE FROM `fruit` WHERE `fruit`.`name` LIKE '%Orange%'".to_owned()
);
```

## Select JSON Result

All SeaORM selects are capable of returning `serde_json::Value`.

```rust
// Find by id
let _: Option<serde_json::Value> = Cake::find_by_id(1)
    .into_json()
    .one(&db)
    .await?;

// Find with filter
let _: Vec<serde_json::Value> = Cake::find()
    .filter(cake::Column::Name.contains("chocolate"))
    .order_by_asc(cake::Column::Name)
    .into_json()
    .all(db)
    .await?;

// Paginate json result
let _: Paginator<_> = Cake::find()
    .filter(cake::Column::Name.contains("chocolate"))
    .order_by_asc(cake::Column::Name)
    .into_json()
    .paginate(db, 50);
```
