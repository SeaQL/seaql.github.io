# 错误处理

SeaORM 中的所有运行时错误都由 [`DbErr`](https://docs.rs/sea-orm/*/sea_orm/error/enum.DbErr.html) 表示。

## 处理常见的 SQL 错误

你可以使用 `DbErr::sql_err()` 方法将 SQL 相关错误转换为常见的数据库错误 `SqlErr`，例如唯一约束或外键冲突错误。

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

## 处理数据库特定错误

你可以从 `RuntimeErr` 中检索数据库特定的错误代码：

```rust
let my_cake = cake::ActiveModel { id: Set(1), .. };

// 插入一个主键 (`id` 列) 设置为 1 的新蛋糕。
let cake = my_cake.save(db).await.expect("could not insert cake");

// 再次插入相同的行，但失败了，因为每行的主键应该是唯一的。
let error: DbErr = cake
    .into_active_model()
    .insert(db)
    .await
    .expect_err("inserting should fail due to duplicate primary key");

match error {
    DbErr::Exec(RuntimeErr::SqlxError(error)) => match error {
        sqlx::Error::Database(e) => {
            // 我们检查数据库（本例中为 MySQL）抛出的错误代码，
            // `23000` 表示 `ER_DUP_KEY`：表中存在重复键。
            assert_eq!(e.code().unwrap(), "23000");
        }
        _ => panic!("Unexpected sqlx::Error kind"),
    },
    _ => panic!("Unexpected DbErr kind"),
}