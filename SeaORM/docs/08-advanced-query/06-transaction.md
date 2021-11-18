# Transaction

A transaction is a group of SQL statements executed with ACID guarantee. There are two transaction APIs.

## Within a `Closure`

The transaction will be committed if the closure returned `Ok`, rollbacked if returned `Err`. The 2nd and 3rd type parameters are the Ok and Err types respectively.

```rust
// <Fn, A, B> -> Result<A, B>
db.transaction::<_, (), DbErr>(|txn| {
    Box::pin(async move {
        bakery::ActiveModel {
            name: Set("SeaSide Bakery".to_owned()),
            profit_margin: Set(10.4),
            ..Default::default()
        }
        .save(txn)
        .await?;

        bakery::ActiveModel {
            name: Set("Top Bakery".to_owned()),
            profit_margin: Set(15.0),
            ..Default::default()
        }
        .save(txn)
        .await?;

        Ok(())
    })
})
.await;
```

This is the preferred way for most cases. However, if you happens to run into an *impossible lifetime* while trying to capture a reference in the async block, then the following API is the solution.

## `begin` & `commit` / `rollback`

`begin` the transaction followed by a `commit` or `rollback`. If `txn` goes out of scope, it would automatically rollback the transaction.

```rust
let txn = db.begin().await?;

bakery::ActiveModel {
    name: Set("SeaSide Bakery".to_owned()),
    profit_margin: Set(10.4),
    ..Default::default()
}
.save(&txn)
.await?;

bakery::ActiveModel {
    name: Set("Top Bakery".to_owned()),
    profit_margin: Set(15.0),
    ..Default::default()
}
.save(&txn)
.await?;

txn.commit().await?;
```
