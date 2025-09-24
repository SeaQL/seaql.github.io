# 删除

## 删除一条

从数据库中查找 `Model`，然后从数据库中删除相应的行。

```rust
use sea_orm::entity::ModelTrait;

let orange: Option<fruit::Model> = Fruit::find_by_id(30).one(db).await?;
let orange: fruit::Model = orange.unwrap();

let res: DeleteResult = orange.delete(db).await?;
assert_eq!(res.rows_affected, 1);
```

## 按主键删除

除了从数据库中选择 `Model` 然后删除它之外。你还可以直接通过主键从数据库中删除一行。

```rust
let res: DeleteResult = Fruit::delete_by_id(38).exec(db).await?;
assert_eq!(res.rows_affected, 1);
```

## 删除多条

你还可以从数据库中删除多行，而无需使用 SeaORM select 查找每个 `Model`。

```rust
// DELETE FROM `fruit` WHERE `fruit`.`name` LIKE '%Orange%'
let res: DeleteResult = fruit::Entity::delete_many()
    .filter(fruit::Column::Name.contains("Orange"))
    .exec(db)
    .await?;

assert_eq!(res.rows_affected, 2);
```

## 返回已删除的模型

仅 Postgres 支持，SQLite 需要 `sqlite-use-returning-for-3_35` 功能标志。

```rust
assert_eq!(
    fruit::Entity::delete(ActiveModel {
        id: Set(3),
        ..Default::default()
    })
    .exec_with_returning(db)
    .await?,
    Some(fruit::Model {
        id: 3,
        name: "Apple".to_owned(),
    })
);
```

```rust
let deleted_models: Vec<order::Model> = order::Entity::delete_many()
    .filter(order::Column::CustomerId.eq(22))
    .exec_with_returning(db)
    .await?

assert_eq!(deleted_models.len(), 2); // 删除两项