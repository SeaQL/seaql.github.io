# Using SQLite

If you want to test high level application domain logic that's not tied to database specific features, you can use SQLite in integration tests.

Of course, it is not a substitute to integration testing against the target database, but a supplement: SQLite runs in memory, and is quick to run and easy to write tests. You don't have to setup Docker container for executing them, so you can have more comprehensive tests on every layer of the application.

Check out a simple example [here](https://github.com/SeaQL/sea-orm/blob/master/tests/basic.rs).

## Integration Test

It is recommended to execute more complex test cases in [integration tests](https://doc.rust-lang.org/rust-by-example/testing/integration_testing.html). The following code snippet illustrates the steps of connecting to a database, setting up schema and performing tests.

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

## Setup database schema

To create tables in SQLite database for testing, instead of writing [`TableCreateStatement`](https://docs.rs/sea-query/*/sea_query/table/struct.TableCreateStatement.html) manually, you can construct a complex schema using [`SchemaBuilder`](https://docs.rs/sea-orm/2.0.0-rc.11/sea_orm/schema/struct.SchemaBuilder.html).

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

## Performing tests

Execute test cases and assert against the results. Here is a simple function that demonstrates the whole setup neatly:

```rust
#[tokio::test]
async fn main() {
    // create in memory database
    let db = &Database::connect("sqlite::memory:").await.unwrap();

    // setup schema
    db.execute(
        &Schema::new(db.get_database_backend())
            .create_table_from_entity(post::Entity)
    )
    .await
    .unwrap();

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

Here `unwrap` is used, because in case the test fails, it tells you exactly where.