# Error Handling

All runtime errors in SeaORM are represented by [`DbErr`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/error/enum.DbErr.html).

## Handling Common SQL Errors

Use `DbErr::sql_err()` to convert SQL-related errors into common database errors [`SqlErr`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/error/enum.SqlErr.html), such as unique constraint or foreign key violation errors.

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

## Error Variants Added in 2.0

:::tip Since `2.0.0`
:::

SeaORM 2.0 replaced several panics with proper error variants:

| Error Variant | Replaces | When |
|---|---|---|
| `DbErr::PrimaryKeyNotSet` | panic in `Update::one` | Primary key not set on `UpdateOne` or `DeleteOne` |
| `DbErr::BackendNotSupported` | panic | Calling `exec_with_returning_keys` on MySQL |
| `DbErr::AccessDenied` | N/A | RBAC: operation blocked by `RestrictedConnection` |

`Update::one` and `Delete::one` now require calling `.validate()?` before `.build()` to catch `PrimaryKeyNotSet` at the call site:

```rust
let stmt = Update::one(fruit::ActiveModel {
    id: ActiveValue::NotSet,
    name: ActiveValue::Set("Apple".to_owned()),
    ..Default::default()
})
.validate(); // returns Err(DbErr::PrimaryKeyNotSet)
```

## Handling Database-Specific Errors

You can retrieve the database-specific error code from `RuntimeErr`:

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
