# 创建索引

你可以使用 [`Schema::create_index_from_entity`](https://docs.rs/sea-orm/*/sea_orm/schema/struct.Schema.html#method.create_index_from_entity) 从实体创建索引，或者手动构造 [`IndexCreateStatement`](https://docs.rs/sea-query/*/sea_query/index/struct.IndexCreateStatement.html)。

[`Indexes`](https://github.com/SeaQL/sea-orm/blob/master/src/tests_cfg/indexes.rs) 实体示例：

```rust title="indexes.rs"
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    #[sea_orm(indexed)]
    pub index1_attr: i32,
    #[sea_orm(unique, indexed)]
    pub index2_attr: i32,
    #[sea_orm(unique_key = "my_unique")]
    pub unique_key_a: String,
    #[sea_orm(unique_key = "my_unique")]
    pub unique_key_b: String,
}
```

```rust
use sea_orm::{sea_query, tests_cfg::*, Schema};

let builder = db.get_database_backend();

let stmts = Schema::new(builder).create_index_from_entity(indexes::Entity);

let idx: IndexCreateStatement = Index::create()
    .name("idx-indexes-index1_attr")
    .table(indexes::Entity)
    .col(indexes::Column::Index1Attr)
    .to_owned();
assert_eq!(builder.build(&stmts[0]), builder.build(&idx));

let idx: IndexCreateStatement = Index::create()
    .name("idx-indexes-index2_attr")
    .table(indexes::Entity)
    .col(indexes::Column::Index2Attr)
    .unique()
    .take();
assert_eq!(builder.build(&stmts[1]), builder.build(&idx));

let idx: IndexCreateStatement = Index::create()
    .name("idx-indexes-my_unique")
    .table(indexes::Entity)
    .col(indexes::Column::UniqueKeyA)
    .col(indexes::Column::UniqueKeyB)
    .unique()
    .take();
assert_eq!(builder.build(&stmts[2]), builder.build(&idx));