# Create Index

To create indexes in database instead of writing [`IndexCreateStatement`](https://docs.rs/sea-query/*/sea_query/index/struct.IndexCreateStatement.html) manually, you can derive it from `Entity` using [`Schema::create_index_from_entity`](https://docs.rs/sea-orm/*/sea_orm/schema/struct.Schema.html#method.create_index_from_entity). This method will help you create database indexes defined in `Entity`.

Below we use [`Indexes`](https://github.com/SeaQL/sea-orm/blob/master/src/tests_cfg/indexes.rs) entity to demo its generated SQL statement. You can construct the same statement with [`IndexCreateStatement`](https://docs.rs/sea-query/*/sea_query/index/struct.IndexCreateStatement.html).

```rust
use sea_orm::{sea_query, tests_cfg::*, Schema};

let builder = db.get_database_backend();
let schema = Schema::new(builder);

let stmts = schema.create_index_from_entity(indexes::Entity);
assert_eq!(stmts.len(), 2);

let idx = sea_query::Index::create()
    .name("idx-indexes-index1_attr")
    .table(indexes::Entity)
    .col(indexes::Column::Index1Attr)
    .to_owned();
assert_eq!(builder.build(&stmts[0]), builder.build(&idx));

let idx = sea_query::Index::create()
    .name("idx-indexes-index2_attr")
    .table(indexes::Entity)
    .col(indexes::Column::Index2Attr)
    .to_owned();
assert_eq!(builder.build(&stmts[1]), builder.build(&idx));
```
