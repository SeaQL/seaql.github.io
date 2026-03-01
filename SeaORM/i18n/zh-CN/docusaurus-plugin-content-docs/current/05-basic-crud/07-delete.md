# 删除

## 删除单条

从数据库查找一个模型，然后从数据库中删除对应的行。

```rust
use sea_orm::entity::ModelTrait;

let orange: Option<fruit::Model> = Fruit::find_by_id(30).one(db).await?;
let orange: fruit::Model = orange.unwrap();

let res: DeleteResult = orange.delete(db).await?;
assert_eq!(res.rows_affected, 1);
```

## 按主键删除

直接通过主键删除行，无需先选择模型。

```rust
let res: DeleteResult = Fruit::delete_by_id(38).exec(db).await?;
assert_eq!(res.rows_affected, 1);
```

:::tip Since `2.0.0`

`delete_by_id` 现在返回 `ValidatedDeleteOne` 而非 `DeleteMany`。普通的 `exec` 用法不变，但 `exec_with_returning` 现在返回 `Option<Model>` 而非 `Vec<Model>`。

:::

## 按唯一键删除

:::tip Since `2.0.0`
:::

如果 Entity 具有 `#[sea_orm(unique)]` 属性，会生成 `delete_by_*` 便捷方法：

```rust
user::Entity::delete_by_email("bob@spam.com").exec(db).await?;
```

与 `delete_by_id` 一样，这返回 `ValidatedDeleteOne`。

## 批量删除

也可以在不查找每个模型的情况下，使用 SeaORM select 从数据库中删除多行。

```rust
// DELETE FROM `fruit` WHERE `fruit`.`name` LIKE '%Orange%'
let res: DeleteResult = fruit::Entity::delete_many()
    .filter(fruit::Column::Name.contains("Orange"))
    .exec(db)
    .await?;

assert_eq!(res.rows_affected, 2);
```

## 返回删除的模型

仅 Postgres 和 SQLite 支持，MariaDB 需要 `mariadb-use-returning` feature 标志。

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

assert_eq!(deleted_models.len(), 2); // two items deleted
```
