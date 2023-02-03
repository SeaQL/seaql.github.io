# Transaction

A transaction is a group of SQL statements executed with ACID guarantee. There are two transaction APIs.

## With a `Closure`

Perform a [transaction with a closure](https://docs.rs/sea-orm/*/sea_orm/trait.TransactionTrait.html#tymethod.transaction). The transaction will be committed if the closure returned `Ok`, rollbacked if returned `Err`. The 2nd and 3rd type parameters are the Ok and Err types respectively. Since `async_closure` is not yet stabilized, you have to `Pin<Box<_>>` it.

```rust
use sea_orm::TransactionTrait;

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

This is the preferred way for most cases. However, if you happen to run into an *impossible lifetime* while trying to capture a reference in the async block, then the following API is the solution.

## `begin` & `commit` / `rollback`

[`begin`](https://docs.rs/sea-orm/*/sea_orm/trait.TransactionTrait.html#tymethod.begin) the transaction followed by a `commit` or `rollback`. If `txn` goes out of scope, the transaction is automatically rollbacked.

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

## Isolation Level and Access Mode

Introduced in `0.10.5`, [`transaction_with_config`](https://docs.rs/sea-orm/*/sea_orm/trait.TransactionTrait.html#tymethod.transaction_with_config) and [`begin_with_config`](https://docs.rs/sea-orm/*/sea_orm/trait.TransactionTrait.html#tymethod.begin_with_config) allows you to specify the [IsolationLevel](https://docs.rs/sea-orm/*/sea_orm/enum.IsolationLevel.html) and [AccessMode](https://docs.rs/sea-orm/*/sea_orm/enum.AccessMode.html).

### IsolationLevel

`RepeatableRead`: Consistent reads within the same transaction read the snapshot established by the first read.

`ReadCommitted`: Each consistent read, even within the same transaction, sets and reads its own fresh snapshot.

`ReadUncommitted`: SELECT statements are performed in a nonlocking fashion, but a possible earlier version of a row might be used.

`Serializable`: All statements of the current transaction can only see rows committed before the first query or data-modification statement was executed in this transaction.

### AccessMode

`ReadOnly`: Data can’t be modified in this transaction

`ReadWrite`: Data can be modified in this transaction (default)