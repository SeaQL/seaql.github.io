# Transaction

A transaction is a group of SQL statements executed with ACID guarantee. There are two transaction APIs supported in SeaORM, and you can pick one best suited to your programming paradigm.

## With a Closure

Perform a [transaction with a closure](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/trait.TransactionTrait.html#tymethod.transaction). The transaction will be committed if the closure returned `Ok`, rollbacked if returned `Err`. The 2nd and 3rd type parameters are the Ok and Err types respectively. Since `async_closure` is not yet stabilized, you have to `Pin<Box<_>>` it.

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

## `begin` & `commit`

[`begin`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/trait.TransactionTrait.html#tymethod.begin) the transaction followed by a `commit` or `rollback`. If `txn` goes out of scope, the transaction is automatically rollbacked.

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

## Nested transaction

Nested transaction is implemented with database's `SAVEPOINT`.

### With Closures

The example below illustrates the behavior with the closure API.

```rust
assert_eq!(Bakery::find().all(db).await?.len(), 0);

ctx.db.transaction::<_, _, DbErr>(|txn| {
    Box::pin(async move {
        let _ = bakery::ActiveModel {..}.save(txn).await?;
        let _ = bakery::ActiveModel {..}.save(txn).await?;
        assert_eq!(Bakery::find().all(txn).await?.len(), 2);

        // Try nested transaction committed
        txn.transaction::<_, _, DbErr>(|txn| {
            Box::pin(async move {
                let _ = bakery::ActiveModel {..}.save(txn).await?;
                assert_eq!(Bakery::find().all(txn).await?.len(), 3);

                // Try nested-nested transaction rollbacked
                assert!(txn.transaction::<_, _, DbErr>(|txn| {
                        Box::pin(async move {
                            let _ = bakery::ActiveModel {..}.save(txn).await?;
                            assert_eq!(Bakery::find().all(txn).await?.len(), 4);

                            Err(DbErr::Query(RuntimeErr::Internal(
                                "Force Rollback!".to_owned(),
                            )))
                        })
                    })
                    .await
                    .is_err()
                );

                assert_eq!(Bakery::find().all(txn).await?.len(), 3);

                // Try nested-nested transaction committed
                txn.transaction::<_, _, DbErr>(|txn| {
                    Box::pin(async move {
                        let _ = bakery::ActiveModel {..}.save(txn).await?;
                        assert_eq!(Bakery::find().all(txn).await?.len(), 4);

                        Ok(())
                    })
                })
                .await;

                assert_eq!(Bakery::find().all(txn).await?.len(), 4);

                Ok(())
            })
        })
        .await;

        Ok(())
    })
})
.await;

assert_eq!(Bakery::find().all(db).await?.len(), 4);
```

### `begin` & `commit`

```rust
assert_eq!(Bakery::find().all(db).await?.len(), 0);

let txn = db.begin().await?;

// First create 2 bakeries
seaside_bakery().save(&txn).await?;
lakeside_bakery().save(&txn).await?;

assert_eq!(Bakery::find().all(&txn).await?.len(), 2);

// Try nested transaction committed
{
    let txn = txn.begin().await?;
    let _ = bakery::ActiveModel {
        name: Set("Hillside Bakery".to_owned()),
        profit_margin: Set(88.88),
        ..Default::default()
    }
    .save(&txn)
    .await?;

    assert_eq!(Bakery::find().all(txn).await?.len(), 3);

    // Try nested-nested transaction rollbacked
    {
        let txn = txn.begin().await?;
        let _ = bakery::ActiveModel {
            name: Set("Canalside Bakery".to_owned()),
            profit_margin: Set(28.8),
            ..Default::default()
        }
        .save(&txn)
        .await?;

        assert_eq!(Bakery::find().all(txn).await?.len(), 4);
    }

    txn.commit().await?;
}

assert_eq!(Bakery::find().all(&txn).await?.len(), 3);

txn.commit().await?;

assert_eq!(Bakery::find().all(db).await?.len(), 3);
```

## Isolation Level and Access Mode

Introduced in `0.10.5`, [`transaction_with_config`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/trait.TransactionTrait.html#tymethod.transaction_with_config) and [`begin_with_config`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/trait.TransactionTrait.html#tymethod.begin_with_config) allows you to specify the [IsolationLevel](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/enum.IsolationLevel.html) and [AccessMode](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/enum.AccessMode.html).

For now, they are only implemented for MySQL and Postgres. In order to align their semantic difference, MySQL will execute `SET TRANSACTION` commands before begin transaction, while Postgres will execute `SET TRANSACTION` commands after begin transaction.

### IsolationLevel

`RepeatableRead`: Consistent reads within the same transaction read the snapshot established by the first read.

`ReadCommitted`: Each consistent read, even within the same transaction, sets and reads its own fresh snapshot.

`ReadUncommitted`: SELECT statements are performed in a nonlocking fashion, but a possible earlier version of a row might be used.

`Serializable`: All statements of the current transaction can only see rows committed before the first query or data-modification statement was executed in this transaction.

### AccessMode

`ReadOnly`: Data can’t be modified in this transaction

`ReadWrite`: Data can be modified in this transaction (default)