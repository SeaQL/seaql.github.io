# 事务

事务是一组以 ACID 保证执行的 SQL 语句。SeaORM 支持两种事务 API，你可以选择最适合你编程范式的一种。

## 使用闭包

使用[闭包执行事务](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/trait.TransactionTrait.html#tymethod.transaction)。若闭包返回 `Ok` 则提交事务，返回 `Err` 则回滚。第 2 和第 3 个类型参数分别为 Ok 和 Err 类型。由于 `async_closure` 尚未稳定，你必须使用 `Pin<Box<_>>`。

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

这是大多数情况下的首选方式。然而，若在 async 块中尝试捕获引用时遇到*不可能的生命周期*，则以下 API 是解决方案。

## `begin` 与 `commit`

[`begin`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/trait.TransactionTrait.html#tymethod.begin) 开始事务，随后执行 `commit` 或 `rollback`。若 `txn` 超出作用域，事务将自动回滚。

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

## 嵌套事务

嵌套事务通过数据库的 `SAVEPOINT` 实现。

### 使用闭包

以下示例说明使用闭包 API 时的行为。

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

### `begin` 与 `commit`

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

## 隔离级别与访问模式

自 `0.10.5` 起，[`transaction_with_config`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/trait.TransactionTrait.html#tymethod.transaction_with_config) 和 [`begin_with_config`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/trait.TransactionTrait.html#tymethod.begin_with_config) 允许你指定 [IsolationLevel](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/enum.IsolationLevel.html) 和 [AccessMode](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/enum.AccessMode.html)。

目前仅对 MySQL 和 Postgres 实现。为对齐语义差异，MySQL 将在 begin transaction 之前执行 `SET TRANSACTION` 命令，而 Postgres 将在 begin transaction 之后执行 `SET TRANSACTION` 命令。

### 隔离级别

`RepeatableRead`（可重复读）：同一事务内的快照读读取由首次读建立的快照。

`ReadCommitted`（读已提交）：每次快照读，即使在同一事务内，都会设置并读取自己的新快照。

`ReadUncommitted`（读未提交）：SELECT 语句以非锁定方式执行，但可能使用行的较早版本。

`Serializable`（可串行化）：当前事务的所有语句只能看到在本事务中首次执行查询或数据修改语句之前已提交的行。

### 访问模式

`ReadOnly`：此事务中不能修改数据

`ReadWrite`：此事务中可以修改数据（默认）