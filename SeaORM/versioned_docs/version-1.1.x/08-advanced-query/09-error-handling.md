# Error Handling

All runtime errors in SeaORM is represented by [`DbErr`](https://docs.rs/sea-orm/1.1.19/sea_orm/error/enum.DbErr.html).

## Handling common SQL errors

You can use `DbErr::sql_err()` method to convert SQL related error into common database errors `SqlErr`, such as unique constraint or foreign key violation errors.

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

## Handling database specific errors

You can retrieve the database specific error code from `RuntimeErr`:

```rust
let my_cake = cake::ActiveModel { id: Set(1), .. };

// Insert a new cake with its primary key (`id` column) set to 1.
let cake = my_cake.save(db).await.expect("could not insert cake");

// Insert the same row again and it failed because primary key of each row should be unique.
let error: DbErr = cake
    .into_active_model()
    .insert(db)
    .await
    .expect_err("inserting should fail due to duplicate primary key");

match error {
    DbErr::Exec(RuntimeErr::SqlxError(error)) => match error {
        sqlx::Error::Database(e) => {
            // We check the error code thrown by the database (MySQL in this case),
            // `23000` means `ER_DUP_KEY`: we have a duplicate key in the table.
            assert_eq!(e.code().unwrap(), "23000");
        }
        _ => panic!("Unexpected sqlx::Error kind"),
    },
    _ => panic!("Unexpected DbErr kind"),
}
```
