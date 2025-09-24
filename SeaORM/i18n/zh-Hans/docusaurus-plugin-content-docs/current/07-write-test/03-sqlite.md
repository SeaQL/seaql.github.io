# 使用 SQLite

如果你想测试不需要特定数据库功能的应用程序逻辑，SQLite 将是一个不错的选择。

请在此处查看一个简单示例：[here](https://github.com/SeaQL/sea-orm/blob/master/tests/basic.rs)。

## 集成测试

建议在[集成测试](https://doc.rust-lang.org/rust-by-example/testing/integration_testing.html)中执行更复杂的测试用例。以下代码片段说明了连接到数据库、设置模式和执行测试的步骤。

```rust
async fn main() -> Result<(), DbErr> {
    // Connecting SQLite
    let db = Database::connect("sqlite::memory:").await?;

    // Setup database schema
    setup_schema(&db).await?;

    // Performing tests
    testcase(&db).await?;

    Ok(())
}
```

## 设置数据库模式

为了在 SQLite 数据库中创建用于测试的表，你可以不手动编写 [`TableCreateStatement`](https://docs.rs/sea-query/*/sea_query/table/struct.TableCreateStatement.html)，而是使用 [`Schema::create_table_from_entity`](https://docs.rs/sea-orm/*/sea_orm/schema/struct.Schema.html#method.create_table_from_entity) 从 `Entity` 派生它。

```rust
async fn setup_schema(db: &DbConn) {

    // Setup Schema helper
    let schema = Schema::new(DbBackend::Sqlite);

    // Derive from Entity
    let stmt: TableCreateStatement = schema.create_table_from_entity(MyEntity);

    // Or setup manually
    assert_eq!(
        stmt.build(SqliteQueryBuilder),
        Table::create()
            .table(MyEntity)
            .col(integer(MyEntity::Column::Id))
            //...
            .build(SqliteQueryBuilder)
    );

    // Execute create table statement
    let result = db
        .execute(db.get_database_backend().build(&stmt))
        .await;
}
```

## 执行测试

执行测试用例并对结果进行断言。

```rust
async fn testcase(db: &DbConn) -> Result<(), DbErr> {

    let baker_bob = baker::ActiveModel {
        name: Set("Baker Bob".to_owned()),
        contact_details: Set(serde_json::json!({
            "mobile": "+61424000000",
            "home": "0395555555",
            "address": "12 Test St, Testville, Vic, Australia"
        })),
        bakery_id: Set(2),
        ..Default::default()
    };

    let baker_insert_res = Baker::insert(baker_bob)
        .exec(db)
        .await
        .expect("could not insert baker");

    assert_eq!(baker_insert_res.last_insert_id, 1);

    Ok(())
}
```
