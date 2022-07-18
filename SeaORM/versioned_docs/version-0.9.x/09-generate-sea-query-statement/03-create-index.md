# Create Index

You can create indices from entities using [`Schema::create_index_from_entity`](https://docs.rs/sea-orm/0.9/sea_orm/schema/struct.Schema.html#method.create_index_from_entity), or construct [`IndexCreateStatement`](https://docs.rs/sea-query/0.9/sea_query/index/struct.IndexCreateStatement.html) manually.

Example [`Indexes`](https://github.com/SeaQL/sea-orm/blob/master/src/tests_cfg/indexes.rs) entity:

```rust title="indexes.rs"
impl ColumnTrait for Column {
    type EntityName = Entity;

    fn def(&self) -> ColumnDef {
        match self {
            Self::Index1Attr => ColumnType::Integer.def().indexed(),
            Self::Index2Attr => ColumnType::Integer.def().indexed().unique(),
        }
    }
}
```

```rust
use sea_orm::{sea_query, tests_cfg::*, Schema};

let builder = db.get_database_backend();
let schema = Schema::new(builder);

let stmts = schema.create_index_from_entity(indexes::Entity);

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
