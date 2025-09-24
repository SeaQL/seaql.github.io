# 模拟接口

你可以使用模拟数据库接口对应用程序逻辑进行单元测试。

:::info
你需要在 `Cargo.toml` 中启用 `mock` 功能标志。
:::

模拟数据库中没有任何数据，因此你必须定义在执行 CRUD 操作时要返回的预期数据。
- 应提供查询结果以支持选择操作
- 应提供执行结果以支持插入、更新和删除操作

为确保应用程序逻辑的正确性，你还可以验证模拟数据库中的事务日志。

在此处查看我们如何使用模拟连接编写单元测试[此处](https://github.com/SeaQL/sea-orm/blob/master/src/executor/paginator.rs#L250)。

## 模拟查询结果

我们使用 `MockDatabase::new(DatabaseBackend::Postgres)` 为 PostgreSQL 创建一个模拟数据库。然后，使用 `append_query_results` 方法准备查询结果。请注意，我们向其传递一个向量的向量，表示多个查询结果，每个结果都有多个模型。最后，我们将其转换为连接，并像正常的实时连接一样使用它来执行 CRUD 操作。

关于 `MockDatabase` 的一件特别之处是你可以检查其事务日志。在模拟数据库上运行的任何 SQL 查询都将被记录下来；你可以验证每个日志以确保应用程序逻辑的正确性。

```rust
#[cfg(test)]
mod tests {
    use sea_orm::{
        entity::prelude::*, entity::*, tests_cfg::*,
        DatabaseBackend, MockDatabase, Transaction,
    };

    #[async_std::test]
    async fn test_find_cake() -> Result<(), DbErr> {
        // 使用模拟查询结果创建 MockDatabase
        let db = MockDatabase::new(DatabaseBackend::Postgres)
            .append_query_results([
                // 第一个查询结果
                vec![cake::Model {
                    id: 1,
                    name: "New York Cheese".to_owned(),
                }],
                // 第二个查询结果
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
                // 第三个查询结果
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

        // 从 MockDatabase 中查找蛋糕
        // 返回第一个查询结果
        assert_eq!(
            cake::Entity::find().one(&db).await?,
            Some(cake::Model {
                id: 1,
                name: "New York Cheese".to_owned(),
            })
        );

        // 从 MockDatabase 中查找所有蛋糕
        // 返回第二个查询结果
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

        // 查找所有蛋糕及其相关水果
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

        // 检查事务日志
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

这与模拟查询结果非常相似，不同之处在于我们在这里使用 `append_exec_results` 方法，并且我们在单元测试中执行插入、更新和删除操作。`append_exec_results` 方法接受一个 `MockExecResult` 的向量，每个都表示相应操作的执行结果。

```rust
#[cfg(test)]
mod tests {
    use sea_orm::{
        entity::prelude::*, entity::*, tests_cfg::*,
        DatabaseBackend, MockDatabase, MockExecResult, Transaction,
    };

    #[async_std::test]
    async fn test_insert_cake() -> Result<(), DbErr> {
        // 使用模拟执行结果创建 MockDatabase
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

        // 准备 ActiveModel
        let apple = cake::ActiveModel {
            name: Set("Apple Pie".to_owned()),
            ..Default::default()
        };

        // 将 ActiveModel 插入 MockDatabase
        assert_eq!(
            apple.clone().insert(&db).await?,
            cake::Model {
                id: 15,
                name: "Apple Pie".to_owned()
            }
        );

        // 如果要检查最后插入的 id
        let insert_result = cake::Entity::insert(apple).exec(&db).await?;
        assert_eq!(insert_result.last_insert_id, 16);

        // 检查事务日志
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