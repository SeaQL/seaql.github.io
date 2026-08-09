# 插入

## 插入单条

插入一个 ActiveModel 并获取返回的新鲜 `Model`。其值从数据库检索，因此任何自动生成的字段都会被填充。

```rust
let pear = fruit::ActiveModel {
    name: Set("Pear".to_owned()),
    ..Default::default() // all other attributes are `NotSet`
};

let pear: fruit::Model = pear.insert(db).await?;
```

插入一个 ActiveModel 并获取最后插入的 id。其类型与模型的主键类型匹配，因此如果模型有复合主键，可能是元组。

```rust
let pear = fruit::ActiveModel {
    name: Set("Pear".to_owned()),
    ..Default::default() // all other attributes are `NotSet`
};

let res: InsertResult = fruit::Entity::insert(pear).exec(db).await?;
assert_eq!(res.last_insert_id, 28)
```

:::tip SQL Server (MSSQL) 后端

MSSQL 的 `IDENTITY INSERT` 相关文档请参阅[此处](https://www.sea-ql.org/SeaORM-X/docs/basic-crud/insert/)。

:::

## 批量插入

插入多个 ActiveModel 并获取最后插入的 id。

```rust
let apple = fruit::ActiveModel {
    name: Set("Apple".to_owned()),
    ..Default::default()
};

let orange = fruit::ActiveModel {
    name: Set("Orange".to_owned()),
    ..Default::default()
};

let res: InsertManyResult = Fruit::insert_many([apple, orange]).exec(db).await?;
assert_eq!(res.last_insert_id, Some(30))
```

自 SeaORM 2.0 起，`insert_many` 返回一个 [`InsertManyResult`](https://docs.rs/sea-orm/2.0.0/sea_orm/struct.InsertManyResult.html)，其 `last_insert_id` 是一个 `Option`。提供空集合不再是错误；它只是不插入任何内容，并返回 `last_insert_id: None`。

```rust
let res: InsertManyResult = Bakery::insert_many(std::iter::empty()).exec(db).await?;

assert_eq!(res.last_insert_id, None);
```

## 冲突处理

使用 on conflict 行为插入 ActiveModel。

```rust
let orange = cake::ActiveModel {
    id: ActiveValue::set(2),
    name: ActiveValue::set("Orange".to_owned()),
};

assert_eq!(
    cake::Entity::insert(orange.clone())
        .on_conflict(
            // on conflict do nothing
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
            // on conflict do update
            sea_query::OnConflict::column(cake::Column::Name)
                .update_column(cake::Column::Name)
                .to_owned()
        )
        .build(DbBackend::Postgres)
        .to_string(),
    r#"INSERT INTO "cake" ("id", "name") VALUES (2, 'Orange') ON CONFLICT ("name") DO UPDATE SET "name" = "excluded"."name""#,
);
```

执行 upsert 语句但不插入或更新任何行会导致 `DbErr::RecordNotInserted` 错误。

```rust
// When `id` column have conflicting value, do nothing
let on_conflict = OnConflict::column(Column::Id).do_nothing().to_owned();

// Insert `1`, `2`, `3` into the table
let res = Entity::insert_many([
    ActiveModel { id: Set(1) },
    ActiveModel { id: Set(2) },
    ActiveModel { id: Set(3) },
])
.on_conflict(on_conflict.clone())
.exec(db)
.await;

assert_eq!(res?.last_insert_id, Some(3));

// Insert `4` into the table together with the previous 3 rows
let res = Entity::insert_many([
    ActiveModel { id: Set(1) },
    ActiveModel { id: Set(2) },
    ActiveModel { id: Set(3) },
    ActiveModel { id: Set(4) },
])
.on_conflict(on_conflict.clone())
.exec(db)
.await;

assert_eq!(res?.last_insert_id, Some(4));

// Repeat last insert. Since all 4 rows already exist, this essentially did nothing.
// A `DbErr::RecordNotInserted` error will be thrown.
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

如果希望 `RecordNotInserted` 返回 `Ok` 而不是错误，请调用 `.try_insert()`，它会将其转换为 `TryInsertResult`（或者，使用 `on_conflict_do_nothing*` 方法之一）：

```rust
let res = Entity::insert_many([..])
    .on_conflict(on_conflict)
    .try_insert()
    .exec(db)
    .await;

assert!(matches!(res, Ok(TryInsertResult::Conflicted)));
```

### MySQL 支持

在主键上设置 `ON CONFLICT` 为 `DO NOTHING`，但使用 MySQL 特定的 polyfill。

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

:::tip Since `2.0.0`

`Entity::insert` 和 `Entity::insert_many` 现在是不同的类型，`exec_with_returning` 方法会返回对应的正确类型。因此 `exec_with_returning_many` 已被弃用。

:::

Postgres 和 SQLite 支持，以下在 insert 后返回新插入的模型。

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

如果只需要 insert 后的主键，还有 `exec_with_returning_keys`。

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
```
