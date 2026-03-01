# 模拟接口

要对具有异步接口和多个底层查询的更复杂应用逻辑进行单元测试，可以使用模拟数据库接口。

:::info
你需要在 Cargo.toml 中启用 `mock` feature 标志。
:::

模拟数据库中没有数据，因此你必须定义执行 CRUD 操作时返回的预期数据。
- 需要提供查询结果以支持 select 操作
- 需要提供 exec 结果以支持 insert、update 和 delete 操作

为确保应用逻辑的正确性，你还可以验证模拟数据库中的事务日志。

查看我们如何使用模拟连接编写单元测试[此处](https://github.com/SeaQL/sea-orm/blob/master/src/executor/paginator.rs#L250)。

## 模拟查询结果

我们使用 `MockDatabase::new(DatabaseBackend::Postgres)` 为 PostgreSQL 创建模拟数据库。然后，使用 `append_query_results` 方法准备查询结果。注意我们向其传递向量的向量，表示多个查询结果，每个结果包含多个 model。最后，我们将其转换为连接，并像普通实时连接一样用它执行 CRUD 操作。

`MockDatabase` 的一个特别之处在于你可以检查其事务日志。在模拟数据库上运行的任何 SQL 查询都会被记录；你可以验证每条日志以确保应用逻辑的正确性。

```rust
#[cfg(test)]
mod tests {
    use sea_orm::{
        entity::prelude::*, entity::*, tests_cfg::*,
        DatabaseBackend, MockDatabase, Transaction,
    };

    #[async_std::test]
    async fn test_find_cake() -> Result<(), DbErr> {
        // Create MockDatabase with mock query results
        let db = MockDatabase::new(DatabaseBackend::Postgres)
            .append_query_results([
                // First query result
                vec![cake::Model {
                    id: 1,
                    name: "New York Cheese".to_owned(),
                }],
                // Second query result
                vec![
                    cake::Model {
                        id: 1,
                        name: "New York Cheese".to_owned(),
                    },
                    cake::Model {
                        id: 2,
                        name: "Chocolate Forest".to_owned(),
                    },
                ],
            ])
            .append_query_results([
                // Third query result
                [(
                    cake::Model {
                        id: 1,
                        name: "Apple Cake".to_owned(),
                    },
                    fruit::Model {
                        id: 2,
                        name: "Apple".to_owned(),
                        cake_id: Some(1),
                    },
                )],
            ])
            .into_connection();

        // Find a cake from MockDatabase
        // Return the first query result
        assert_eq!(
            cake::Entity::find().one(&db).await?,
            Some(cake::Model {
                id: 1,
                name: "New York Cheese".to_owned(),
            })
        );

        // Find all cakes from MockDatabase
        // Return the second query result
        assert_eq!(
            cake::Entity::find().all(&db).await?,
            [
                cake::Model {
                    id: 1,
                    name: "New York Cheese".to_owned(),
                },
                cake::Model {
                    id: 2,
                    name: "Chocolate Forest".to_owned(),
                },
            ]
        );

        // Find all cakes with its related fruits
        assert_eq!(
            cake::Entity::find()
                .find_also_related(fruit::Entity)
                .all(&db)
                .await?,
            [(
                cake::Model {
                    id: 1,
                    name: "Apple Cake".to_owned(),
                },
                Some(fruit::Model {
                    id: 2,
                    name: "Apple".to_owned(),
                    cake_id: Some(1),
                })
            )]
        );

        // Checking transaction log
        assert_eq!(
            db.into_transaction_log(),
            [
                Transaction::from_sql_and_values(
                    DatabaseBackend::Postgres,
                    r#"SELECT "cake"."id", "cake"."name" FROM "cake" LIMIT $1"#,
                    [1u64.into()]
                ),
                Transaction::from_sql_and_values(
                    DatabaseBackend::Postgres,
                    r#"SELECT "cake"."id", "cake"."name" FROM "cake""#,
                    []
                ),
                Transaction::from_sql_and_values(
                    DatabaseBackend::Postgres,
                    r#"SELECT "cake"."id" AS "A_id", "cake"."name" AS "A_name", "fruit"."id" AS "B_id", "fruit"."name" AS "B_name", "fruit"."cake_id" AS "B_cake_id" FROM "cake" LEFT JOIN "fruit" ON "cake"."id" = "fruit"."cake_id""#,
                    []
                ),
            ]
        );

        Ok(())
    }
}
```

## 模拟执行结果

这与模拟查询结果非常相似，区别在于这里我们使用 `append_exec_results` 方法，并在单元测试中执行 insert、update 和 delete 操作。`append_exec_results` 方法接受 `MockExecResult` 的向量，每个元素表示对应操作的 exec 结果。

```rust
#[cfg(test)]
mod tests {
    use sea_orm::{
        entity::prelude::*, entity::*, tests_cfg::*,
        DatabaseBackend, MockDatabase, MockExecResult, Transaction,
    };

    #[async_std::test]
    async fn test_insert_cake() -> Result<(), DbErr> {
        // Create MockDatabase with mock execution result
        let db = MockDatabase::new(DatabaseBackend::Postgres)
            .append_query_results([
                [cake::Model {
                    id: 15,
                    name: "Apple Pie".to_owned(),
                }],
                [cake::Model {
                    id: 16,
                    name: "Apple Pie".to_owned(),
                }],
            ])
            .append_exec_results([
                MockExecResult {
                    last_insert_id: 15,
                    rows_affected: 1,
                },
                MockExecResult {
                    last_insert_id: 16,
                    rows_affected: 1,
                },
            ])
            .into_connection();

        // Prepare the ActiveModel
        let apple = cake::ActiveModel {
            name: Set("Apple Pie".to_owned()),
            ..Default::default()
        };

        // Insert the ActiveModel into MockDatabase
        assert_eq!(
            apple.clone().insert(&db).await?,
            cake::Model {
                id: 15,
                name: "Apple Pie".to_owned()
            }
        );

        // If you want to check the last insert id
        let insert_result = cake::Entity::insert(apple).exec(&db).await?;
        assert_eq!(insert_result.last_insert_id, 16);

        // Checking transaction log
        assert_eq!(
            db.into_transaction_log(),
            [
                Transaction::from_sql_and_values(
                    DatabaseBackend::Postgres,
                    r#"INSERT INTO "cake" ("name") VALUES ($1) RETURNING "id", "name""#,
                    ["Apple Pie".into()]
                ),
                Transaction::from_sql_and_values(
                    DatabaseBackend::Postgres,
                    r#"INSERT INTO "cake" ("name") VALUES ($1) RETURNING "id""#,
                    ["Apple Pie".into()]
                ),
            ]
        );

        Ok(())
    }
}
```
