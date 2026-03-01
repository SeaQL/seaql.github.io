# 更新

## 更新单条

从查询结果中获取模型后，如果要将其保存回数据库，需要*先*将其转换为 `ActiveModel`。生成的查询只会包含 `Set` 状态的属性。

```rust
let pear: Option<fruit::Model> = Fruit::find_by_id(28).one(db).await?;

// Into ActiveModel
let mut pear: fruit::ActiveModel = pear.unwrap().into();

// Update name attribute
pear.name = Set("Sweet pear".to_owned());

// SQL: `UPDATE "fruit" SET "name" = 'Sweet pear' WHERE "id" = 28`
let pear: fruit::Model = pear.update(db).await?;
```

如果要更新所有属性，可以将 `Unchanged` 转换为 `Set`。

```rust
// Into ActiveModel
let mut pear: fruit::ActiveModel = pear.into();

// Update name attribute
pear.name = Set("Sweet pear".to_owned());

// Set a specific attribute as "dirty" (force update)
pear.reset(fruit::Column::CakeId);
// Or, set all attributes as "dirty" (force update)
pear.reset_all();

// SQL: `UPDATE "fruit" SET "name" = 'Sweet pear', "cake_id" = 10 WHERE "id" = 28`
let pear: fruit::Model = pear.update(db).await?;
```

## 批量更新

也可以在不查找每个模型的情况下，使用 SeaORM select 批量更新数据库中的多行。

```rust
// Bulk set attributes using ActiveModel
let update_result: UpdateResult = Fruit::update_many()
    .set(pear)
    .filter(fruit::Column::Id.is_in(vec![1]))
    .exec(db)
    .await?;

// UPDATE `fruit` SET `cake_id` = 1 WHERE `fruit`.`name` LIKE '%Apple%'
Fruit::update_many()
    .col_expr(fruit::Column::CakeId, Expr::value(1))
    .filter(fruit::Column::Name.contains("Apple"))
    .exec(db)
    .await?;
```

:::tip Since `2.0.0`

新增 `ColumnTrait::eq_any` 作为 `= ANY` 运算符的简写。仅 Postgres 支持。

```rust
Fruit::update_many().filter(fruit::Column::Id.eq_any(vec![2, 3]))
```

:::

## 返回更新的模型

仅 Postgres 和 SQLite 支持，MariaDB 需要 `mariadb-use-returning` feature 标志。

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
```