# Error Handling

All runtime errors in SeaORM is represented by [`DbErr`](https://docs.rs/sea-orm/*/sea_orm/error/enum.DbErr.html).

## Parsing database specific errors

You can retrieve the database specific error code from any of `DbErr::Conn`, `DbErr::Exec` or `DbErr::Query`.

```rust
let mud_cake = cake::ActiveModel {
    id: Set(1),
    name: Set("Moldy Cake".to_owned()),
    price: Set(dec!(10.25)),
    gluten_free: Set(false),
    serial: Set(Uuid::new_v4()),
    bakery_id: Set(None),
};

// Insert a new cake with its primary key (`id` column) set to 1.
let cake = mud_cake.save(db).await.expect("could not insert cake");

// Insert the same row again and it failed
// because primary key of each row should be unique.
let error: DbErr = cake
    .into_active_model()
    .insert(db)
    .await
    .expect_err("inserting should fail due to duplicate primary key");

match error {
    DbErr::Exec(RuntimeErr::SqlxError(error)) => match error {
        Error::Database(e) => {
            // We check the error code thrown by the database (MySQL in this case),
            // `23000` means `ER_DUP_KEY`: we have a duplicate key in the table.
            assert_eq!(e.code().unwrap(), "23000");
        }
        _ => panic!("Unexpected sqlx-error kind"),
    },
    _ => panic!("Unexpected Error kind"),
}
```
