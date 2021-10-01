# Mock Interface

You can unit test your application logic using the mock database interface.

The mock database has no data in it, so you have to define the expected data to be returned when CRUD operations are performed.
- The query result should be provided to support select operations
- The exec result should be provided to support insert, update and delete operations

To ensure the correctness of your application logic, you can also validate the transaction log in the mock database.

Check out how we write unit tests using mock connection [here](https://github.com/SeaQL/sea-orm/blob/master/src/executor/paginator.rs#L159).

## Mocking Query Result

We create a mock database for Postgres with `MockDatabase::new(DatabaseBackend::Postgres)`. Then, query results are prepared using `append_query_results` method. Note that we pass a vector of vector to it, representing multiple query results, each with more than one model. Finally, we convert it into a connection and use it to perform CRUD operations just like a normal live connection.

One special thing about `MockDatabase` is that you can check the transaction log of it. Any SQL query run on the mock database will be recorded; you can validate each of it to ensure the correctness of your application logic.

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
            .append_query_results(vec![
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
            vec![
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

        // Checking transaction log
        assert_eq!(
            db.into_transaction_log(),
            vec![
                Transaction::from_sql_and_values(
                    DatabaseBackend::Postgres,
                    r#"SELECT "cake"."id", "cake"."name" FROM "cake" LIMIT $1"#,
                    vec![1u64.into()]
                ),
                Transaction::from_sql_and_values(
                    DatabaseBackend::Postgres,
                    r#"SELECT "cake"."id", "cake"."name" FROM "cake""#,
                    vec![]
                ),
            ]
        );

        Ok(())
    }
}
```

## Mocking Execution Result

This is very similar to mocking query result, the differences are that we use the `append_exec_results` method here and we perform insert, update and delete operations here in the unit test. The `append_exec_results` method takes a vector of `MockExecResult` each represents the exec result of the corresponding operation.

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
            .append_exec_results(vec![
                MockExecResult {
                    last_insert_id: 15,
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
        let insert_result = apple.insert(&db).await?;

        // Checking last insert id
        assert_eq!(insert_result.last_insert_id, 15);

        // Checking transaction log
        assert_eq!(
            db.into_transaction_log(),
            vec![
                Transaction::from_sql_and_values(
                    DatabaseBackend::Postgres,
                    r#"INSERT INTO "cake" ("name") VALUES ($1)"#,
                    vec!["Apple Pie".into()]
                ),
            ]
        );

        Ok(())
    }
}
```
