# 更新

## 更新一条

你将从查找结果中获得一个 `Model`。如果你想将模型保存回数据库，你需要*首先*将其转换为 `ActiveModel`。生成的查询将只包含 `Set` 属性。

```rust
let pear: Option<fruit::Model> = Fruit::find_by_id(28).one(db).await?;

// 转换为 ActiveModel
let mut pear: fruit::ActiveModel = pear.unwrap().into();

// 更新名称属性
pear.name = Set("Sweet pear".to_owned());

// SQL: `UPDATE "fruit" SET "name" = 'Sweet pear' WHERE "id" = 28`
let pear: fruit::Model = pear.update(db).await?;```

要更新所有属性，你可以将 `Unchanged` 转换为 `Set`。

```rust
// 转换为 ActiveModel
let mut pear: fruit::ActiveModel = pear.into();

// 更新名称属性
pear.name = Set("Sweet pear".to_owned());

// 将特定属性设置为“脏”（强制更新）
pear.reset(fruit::Column::CakeId);
// 或者，将所有属性设置为“脏”（强制更新）
pear.reset_all();

// SQL: `UPDATE "fruit" SET "name" = 'Sweet pear', "cake_id" = 10 WHERE "id" = 28`
let pear: fruit::Model = pear.update(db).await?;
```

## 更新多条

你还可以更新数据库中的多行，而无需使用 SeaORM select 查找每个 `Model`。

```rust
// 使用 ActiveModel 批量设置属性
let update_result: UpdateResult = Fruit::update_many()
    .set(pear)
    .filter(fruit::Column::Id.eq(1))
    .exec(db)
    .await?;

// UPDATE `fruit` SET `cake_id` = 1 WHERE `fruit`.`name` LIKE '%Apple%'
Fruit::update_many()
    .col_expr(fruit::Column::CakeId, Expr::value(1))
    .filter(fruit::Column::Name.contains("Apple"))
    .exec(db)
    .await?;
```

## 返回更新的模型

仅 Postgres 支持，SQLite 需要 `sqlite-use-returning-for-3_35` 功能标志。

```rust
let fruits: Vec<fruit::Model> = Fruit::update_many()
    .col_expr(fruit::Column::CakeId, Expr::value(1))
    .filter(fruit::Column::Name.contains("Apple"))
    .exec_with_returning(db)
    .await?;

assert_eq!(
    fruits[0],
    fruit::Model {
        id: 2,
        name: "Apple".to_owned(),
        cake_id: Some(1),
    }
);