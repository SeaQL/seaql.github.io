# JSON

## 查询 JSON 结果

所有 SeaORM select 都能返回 `serde_json::Value`。

```rust
// Find by id
let cake: Option<serde_json::Value> = Cake::find_by_id(1)
    .into_json()
    .one(db)
    .await?;

assert_eq!(
    cake,
    Some(serde_json::json!({
        "id": 1,
        "name": "Cheese Cake"
    }))
);

// Find with filter
let cakes: Vec<serde_json::Value> = Cake::find()
    .filter(cake::Column::Name.contains("chocolate"))
    .order_by_asc(cake::Column::Name)
    .into_json()
    .all(db)
    .await?;

assert_eq!(
    cakes,
    [
        serde_json::json!({
            "id": 2,
            "name": "Chocolate Forest"
        }),
        serde_json::json!({
            "id": 8,
            "name": "Chocolate Cupcake"
        }),
    ]
);

// Paginate json result
let cake_pages: Paginator<_> = Cake::find()
    .filter(cake::Column::Name.contains("chocolate"))
    .order_by_asc(cake::Column::Name)
    .into_json()
    .paginate(db, 50);

while let Some(cakes) = cake_pages.fetch_and_next().await? {
    // Do something on cakes: Vec<serde_json::Value>
}
```

## 从原始 SQL 查询 JSON

```rust
let result: Vec<serde_json::Value> = serde_json::Value::find_by_statement(Statement::from_sql_and_values(
        DbBackend::Postgres,
        r#"SELECT "cake"."name" FROM "cake" GROUP BY "cake"."name"#,
        [],
    ))
    .all(&db)
    .await?;
```

## 将 JSON 转换为 ActiveModel

如果希望将用户输入保存到数据库，可以轻松地将 JSON 值转换为 `ActiveModel`。你可能需要[跳过反序列化](https://serde.rs/attr-skip-serializing.html) 某些不需要的属性。

:::tip Since `2.0.0`

JSON 输入中不需要包含模型的所有字段，未定义的字段将变为 `ActiveValue::NotSet`。

:::

```rust
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "fruit")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
    pub cake_id: Option<i32>,
}
```

使用 `set_from_json` 方法设置 `ActiveModel` 中的属性。

```rust
// An ActiveModel with primary key set
let mut fruit = fruit::ActiveModel {
    id: ActiveValue::Set(1),
    name: ActiveValue::NotSet,
    cake_id: ActiveValue::NotSet,
};

// Note that this method will not alter the primary key values in ActiveModel
fruit.set_from_json(json!({
    "id": 8,
    "name": "Apple",
    "cake_id": 1,
}))?;

assert_eq!(
    fruit,
    fruit::ActiveModel {
        id: ActiveValue::Set(1),
        name: ActiveValue::Set("Apple".to_owned()),
        cake_id: ActiveValue::Set(Some(1)),
    }
);
```

也可以使用 `from_json` 方法从 JSON 值创建新的 `ActiveModel`。

```rust
let fruit = fruit::ActiveModel::from_json(json!({
    "name": "Apple",
}))?;

assert_eq!(
    fruit,
    fruit::ActiveModel {
        id: ActiveValue::NotSet,
        name: ActiveValue::Set("Apple".to_owned()),
        cake_id: ActiveValue::NotSet,
    }
);
```
