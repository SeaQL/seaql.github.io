# 事务

事务是一组以 ACID 保证执行的 SQL 语句。有两种事务 API。

## 使用闭包

使用闭包执行事务。如果闭包返回 `Ok`，事务将被提交；如果返回 `Err`，事务将被回滚。第二个和第三个类型参数分别是 Ok 和 Err 类型。由于 `async_closure` 尚未稳定，你必须将其 `Pin<Box<_>>`。

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
.await;```

这是大多数情况下的首选方式。但是，如果你在异步块中尝试捕获引用时遇到“不可能的生命周期”，那么以下 API 是解决方案。

## `begin` & `commit` / `rollback`

`begin` 事务，然后是 `commit` 或 `rollback`。如果 `txn` 超出作用域，事务将自动回滚。

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

嵌套事务通过数据库的 `SAVEPOINT` 实现。下面的示例说明了使用闭包 API 的行为。

```rust
assert_eq!(Bakery::find().all(txn).await?.len(), 0);

ctx.db.transaction::<_, _, DbErr>(|txn| {
    Box::pin(async move {
        let _ = bakery::ActiveModel {..}.save(txn).await?;
        let _ = bakery::ActiveModel {..}.save(txn).await?;
        assert_eq!(Bakery::find().all(txn).await?.len(), 2);

        // 尝试提交嵌套事务
        txn.transaction::<_, _, DbErr>(|txn| {
            Box::pin(async move {
                let _ = bakery::ActiveModel {..}.save(txn).await?;
                assert_eq!(Bakery::find().all(txn).await?.len(), 3);

                // 尝试回滚嵌套的嵌套事务
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

                // 尝试提交嵌套的嵌套事务
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

assert_eq!(Bakery::find().all(txn).await?.len(), 4);
```

## 隔离级别和访问模式

在 `0.10.5` 中引入的 [`transaction_with_config`](https://docs.rs/sea-orm/*/sea_orm/trait.TransactionTrait.html#tymethod.transaction_with_config) 和 [`begin_with_config`](https://docs.rs/sea-orm/*/sea_orm/trait.TransactionTrait.html#tymethod.begin_with_config) 允许你指定 [IsolationLevel](https://docs.rs/sea-orm/*/sea_orm/enum.IsolationLevel.html) 和 [AccessMode](https://docs.rs/sea-orm/*/sea_orm/enum.AccessMode.html)。

目前，它们仅针对 MySQL 和 Postgres 实现。为了统一它们的语义差异，MySQL 将在事务开始前执行 `SET TRANSACTION` 命令，而 Postgres 将在事务开始后执行 `SET TRANSACTION` 命令。

### 隔离级别 (IsolationLevel)

`RepeatableRead`：同一事务中的一致性读取会读取由第一次读取建立的快照。

`ReadCommitted`：每次一致性读取，即使在同一事务中，也会设置并读取自己的新快照。

`ReadUncommitted`：SELECT 语句以非锁定方式执行，但可能会使用行的早期版本。

`Serializable`：当前事务的所有语句只能看到在该事务中执行第一个查询或数据修改语句之前提交的行。

### 访问模式 (AccessMode)

`ReadOnly`：此事务中不能修改数据。

`ReadWrite`：此事务中可以修改数据（默认）。