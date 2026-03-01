# 错误处理

SeaORM 中的所有运行时错误由 [`DbErr`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/error/enum.DbErr.html) 表示。

## 处理常见 SQL 错误

使用 `DbErr::sql_err()` 将 SQL 相关错误转换为常见数据库错误 [`SqlErr`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/error/enum.SqlErr.html)，例如唯一约束或外键违反错误。

```rust
assert!(matches!(
    cake.into_active_model().insert(db).await
        .expect_err("Insert a row with duplicated primary key")
        .sql_err(),
    Some(SqlErr::UniqueConstraintViolation(_))
));

assert!(matches!(
    fk_cake.insert(db).await
        .expect_err("Insert a row with invalid foreign key")
        .sql_err(),
    Some(SqlErr::ForeignKeyConstraintViolation(_))
));
```

## 2.0 中新增的错误变体

:::tip 自 `2.0.0` 起
:::

SeaORM 2.0 用适当的错误变体替换了多个 panic：

| 错误变体 | 替换 | 何时 |
|---|---|---|
| `DbErr::PrimaryKeyNotSet` | `Update::one` 中的 panic | `UpdateOne` 或 `DeleteOne` 上主键未设置 |
| `DbErr::BackendNotSupported` | panic | 在 MySQL 上调用 `exec_with_returning_keys` |
| `DbErr::AccessDenied` | N/A | RBAC：操作被 `RestrictedConnection` 阻止 |

`Update::one` 和 `Delete::one` 现在需要在 `.build()` 之前调用 `.validate()?`，以在调用处捕获 `PrimaryKeyNotSet`：

```rust
let stmt = Update::one(fruit::ActiveModel {
    id: ActiveValue::NotSet,
    name: ActiveValue::Set("Apple".to_owned()),
    ..Default::default()
})
.validate(); // returns Err(DbErr::PrimaryKeyNotSet)
```

## 处理数据库特定错误

你可以从 `RuntimeErr` 中获取数据库特定的错误代码：

```rust
let my_cake = cake::ActiveModel { id: Set(1), .. };

let cake = my_cake.save(db).await.expect("could not insert cake");

// Insert the same row again; fails because primary key must be unique.
let error: DbErr = cake
    .into_active_model()
    .insert(db)
    .await
    .expect_err("inserting should fail due to duplicate primary key");

match error {
    DbErr::Exec(RuntimeErr::SqlxError(error)) => match error {
        sqlx::Error::Database(e) => {
            // MySQL error code `23000` means `ER_DUP_KEY`
            assert_eq!(e.code().unwrap(), "23000");
        }
        _ => panic!("Unexpected sqlx::Error kind"),
    },
    _ => panic!("Unexpected DbErr kind"),
}
```
