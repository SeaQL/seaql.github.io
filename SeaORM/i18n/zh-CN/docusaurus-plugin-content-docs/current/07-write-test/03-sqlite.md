# 使用 SQLite

若要测试不依赖数据库特定功能的高层应用领域逻辑，可以在集成测试中使用 SQLite。

当然，它不能替代针对目标数据库的集成测试，而是补充：SQLite 在内存中运行，执行快速且易于编写测试。你无需设置 Docker 容器即可执行它们，因此可以在应用的每一层进行更全面的测试。

查看简单示例[此处](https://github.com/SeaQL/sea-orm/blob/master/tests/basic.rs)。

## 集成测试

建议在[集成测试](https://doc.rust-lang.org/rust-by-example/testing/integration_testing.html)中执行更复杂的测试用例。以下代码片段展示了连接数据库、设置 schema 和执行测试的步骤。

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

## 设置数据库架构

要在 SQLite 数据库中创建用于测试的表，可以不必手动编写 [`TableCreateStatement`](https://docs.rs/sea-query/*/sea_query/table/struct.TableCreateStatement.html)，而使用 [`SchemaBuilder`](https://docs.rs/sea-orm/2.0.0-rc.11/sea_orm/schema/struct.SchemaBuilder.html) 构建复杂 schema。

```rust
async fn setup_schema(db: &DbConn) -> Result<()> {

    // it doesn't matter which order you register entities.
    // SeaORM figures out the foreign key dependencies and
    // creates the tables in the right order along with foreign keys
    db.get_schema_builder()
        .register(cake::Entity)
        .register(cake_filling::Entity)
        .register(filling::Entity)
        .apply(db)
        .await?;

    // or, write DDL manually
    db.execute(
        Table::create()
            .table(cake::Entity)
            .col(pk_auto(cake::Column::Id))
            .col(string(cake::Column::Name))
        ).await?;

    Ok(())
}
```

## 执行测试

执行测试用例并对结果进行断言。以下是一个简洁展示完整设置的简单函数：

```rust
#[tokio::test]
async fn main() {
    // create in memory database
    let db = &Database::connect("sqlite::memory:").await.unwrap();

    // setup schema
    db.get_schema_builder()
        .register(post::Entity)
        .apply(db)
        .await?;

    // this is your application request handler
    let post = Mutation::create_post(
        db,
        post::Model {
            id: 0,
            title: "Title A".to_owned(),
            text: "Text A".to_owned(),
        },
    )
    .await
    .unwrap();

    assert_eq!(
        post,
        post::ActiveModel {
            id: sea_orm::ActiveValue::Unchanged(1),
            title: sea_orm::ActiveValue::Unchanged("Title A".to_owned()),
            text: sea_orm::ActiveValue::Unchanged("Text A".to_owned())
        }
    );

    let post = Mutation::create_post(
        db,
        post::Model {
            id: 0,
            title: "Title B".to_owned(),
            text: "Text B".to_owned(),
        },
    )
    .await
    .unwrap();

    assert_eq!(
        post,
        post::ActiveModel {
            id: sea_orm::ActiveValue::Unchanged(2),
            title: sea_orm::ActiveValue::Unchanged("Title B".to_owned()),
            text: sea_orm::ActiveValue::Unchanged("Text B".to_owned())
        }
    );

    let post = Query::find_post_by_id(db, 1).await.unwrap().unwrap();

    assert_eq!(post.id, 1);
    assert_eq!(post.title, "Title A");

    let post = Mutation::update_post_by_id(
        db,
        1,
        post::Model {
            id: 1,
            title: "New Title A".to_owned(),
            text: "New Text A".to_owned(),
        },
    )
    .await
    .unwrap();

    assert_eq!(
        post,
        post::Model {
            id: 1,
            title: "New Title A".to_owned(),
            text: "New Text A".to_owned(),
        }
    );

    let result = Mutation::delete_post(db, 2).await.unwrap();
    assert_eq!(result.rows_affected, 1);

    let post = Query::find_post_by_id(db, 2).await.unwrap();
    assert!(post.is_none());

    let result = Mutation::delete_all_posts(db).await.unwrap();
    assert_eq!(result.rows_affected, 1);
}
```

这里使用 `unwrap`，因为若测试失败，它会准确告诉你失败位置。