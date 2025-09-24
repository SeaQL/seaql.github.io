# 插入

## 插入一条

插入一个活动模型并返回一个新的 `Model`。其值从数据库中检索，因此任何自动生成的字段都将被填充。

```rust
let pear = fruit::ActiveModel {
    name: Set("Pear".to_owned()),
    ..Default::default() // 所有其他属性都是 `NotSet`
};

let pear: fruit::Model = pear.insert(db).await?;
```

插入一个活动模型并返回最后插入的 id。其类型与模型的主键类型匹配，因此如果模型具有复合主键，它可能是一个元组。

```rust
let pear = fruit::ActiveModel {
    name: Set("Pear".to_owned()),
    ..Default::default() // 所有其他属性都是 `NotSet`
};

let res: InsertResult = fruit::Entity::insert(pear).exec(db).await?;
assert_eq!(res.last_insert_id, 28)
```

:::tip SQL Server (MSSQL) 后端

MSSQL 的 `IDENTITY INSERT` [此处](https://www.sea-ql.org/SeaORM-X/docs/basic-crud/insert/)有文档说明。

:::

## 插入多条

插入多个活动模型并返回最后插入的 id。

```rust
let apple = fruit::ActiveModel {
    name: Set("Apple".to_owned()),
    ..Default::default()
};

let orange = fruit::ActiveModel {
    name: Set("Orange".to_owned()),
    ..Default::default()
};

let res: InsertResult = Fruit::insert_many([apple, orange]).exec(db).await?;
assert_eq!(res.last_insert_id, 30)
```

向 `insert_many` 方法提供空集将导致错误。但是，你可以使用 `on_empty_do_nothing` 更改行为，它将 `InsertResult` 包装在 `TryInsertResult` 中。

```rust
let res = Bakery::insert_many(std::iter::empty())
    .on_empty_do_nothing()
    .exec(db)
    .await;

assert!(matches!(res, Ok(TryInsertResult::Empty)));
```

## 冲突时

插入具有冲突行为的活动模型。

```rust
let orange = cake::ActiveModel {
    id: ActiveValue::set(2),
    name: ActiveValue::set("Orange".to_owned()),
};

assert_eq!(
    cake::Entity::insert(orange.clone())
        .on_conflict(
            // 冲突时不做任何操作
            sea_query::OnConflict::column(cake::Column::Name)
                .do_nothing()
                .to_owned()
        )
        .build(DbBackend::Postgres)
        .to_string(),
    r#"INSERT INTO "cake" ("id", "name") VALUES (2, 'Orange') ON CONFLICT ("name") DO NOTHING"#,
);

assert_eq!(
    cake::Entity::insert(orange)
        .on_conflict(
            // 冲突时更新
            sea_query::OnConflict::column(cake::Column::Name)
                .update_column(cake::Column::Name)
                .to_owned()
        )
        .build(DbBackend::Postgres)
        .to_string(),
    r#"INSERT INTO "cake" ("id", "name") VALUES (2, 'Orange') ON CONFLICT ("name") DO UPDATE SET "name" = "excluded"."name""#,
);
```

执行 upsert 语句而不插入或更新任何行将导致 `DbErr::RecordNotInserted` 错误。

```rust
// 当 `id` 列有冲突值时，不做任何操作
let on_conflict = OnConflict::column(Column::Id).do_nothing().to_owned();

// 将 `1`、`2`、`3` 插入到表中
let res = Entity::insert_many([
    ActiveModel { id: Set(1) },
    ActiveModel { id: Set(2) },
    ActiveModel { id: Set(3) },
])
.on_conflict(on_conflict.clone())
.exec(db)
.await;

assert_eq!(res?.last_insert_id, 3);

// 将 `4` 和之前的 3 行一起插入到表中
let res = Entity::insert_many([
    ActiveModel { id: Set(1) },
    ActiveModel { id: Set(2) },
    ActiveModel { id: Set(3) },
    ActiveModel { id: Set(4) },
])
.on_conflict(on_conflict.clone())
.exec(db)
.await;

assert_eq!(res?.last_insert_id, 4);

// 重复上次插入。由于所有 4 行都已存在，这实际上没有做任何操作。
// 将抛出 `DbErr::RecordNotInserted` 错误。
let res = Entity::insert_many([
    ActiveModel { id: Set(1) },
    ActiveModel { id: Set(2) },
    ActiveModel { id: Set(3) },
    ActiveModel { id: Set(4) },
])
.on_conflict(on_conflict)
.exec(db)
.await;

assert_eq!(res.err(), Some(DbErr::RecordNotInserted));
```

如果你希望 `RecordNotInserted` 是 `Ok` 而不是错误，请调用 `.do_nothing()`：

```rust
let res = Entity::insert_many([..])
    .on_conflict(on_conflict)
    .do_nothing()
    .exec(db)
    .await;

assert!(matches!(res, Ok(TryInsertResult::Conflicted)));
```

### MySQL 支持

在主键 `ON CONFLICT` 上设置 `DO NOTHING`，但使用 MySQL 特定的 polyfill。

```rust
let orange = cake::ActiveModel {
    id: ActiveValue::set(2),
    name: ActiveValue::set("Orange".to_owned()),
};

assert_eq!(
    cake::Entity::insert(orange.clone())
        .on_conflict_do_nothing()
        .build(DbBackend::MySql)
        .to_string(),
    r#"INSERT INTO `cake` (`id`, `name`) VALUES (2, 'Orange') ON DUPLICATE KEY UPDATE `id` = `id`"#,
);
assert_eq!(
    cake::Entity::insert(orange.clone())
        .on_conflict_do_nothing()
        .build(DbBackend::Postgres)
        .to_string(),
    r#"INSERT INTO "cake" ("id", "name") VALUES (2, 'Orange') ON CONFLICT ("id") DO NOTHING"#,
);
assert_eq!(
    cake::Entity::insert(orange)
        .on_conflict_do_nothing()
        .build(DbBackend::Sqlite)
        .to_string(),
    r#"INSERT INTO "cake" ("id", "name") VALUES (2, 'Orange') ON CONFLICT ("id") DO NOTHING"#,
);
```

## 返回插入的模型

Postgres 和 SQLite 支持，以下在插入后返回新插入的模型。

```rust
assert_eq!(
    cake::Entity::insert(cake::ActiveModel {
        id: NotSet,
        name: Set("Apple Pie".to_owned()),
    })
    .exec_with_returning(&db)
    .await?,
    cake::Model {
        id: 1,
        name: "Apple Pie".to_owned(),
    }
);
```

```rust
assert_eq!(
    cake::Entity::insert_many([
        cake::ActiveModel {
            id: NotSet,
            name: Set("Apple Pie".to_owned()),
        },
        cake::ActiveModel {
            id: NotSet,
            name: Set("Choco Pie".to_owned()),
        },
    ])
    .exec_with_returning(&db)
    .await?,
    [
        cake::Model {
            id: 1,
            name: "Apple Pie".to_owned(),
        },
        cake::Model {
            id: 2,
            name: "Choco Pie".to_owned(),
        }
    ]
);
```

如果你只需要插入后的主键，还有一个 `exec_with_returning_keys`。

```rust
assert_eq!(
    cakes_bakers::Entity::insert_many([
        cakes_bakers::ActiveModel {
            cake_id: Set(1),
            baker_id: Set(2),
        },
        cakes_bakers::ActiveModel {
            cake_id: Set(2),
            baker_id: Set(1),
        },
    ])
    .exec_with_returning_keys(db)
    .await
    .unwrap(),
    [(1, 2), (2, 1)]
);