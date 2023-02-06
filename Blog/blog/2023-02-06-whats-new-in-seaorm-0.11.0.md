---
slug: 2023-02-06-whats-new-in-seaorm-0.11.0
title: What's new in SeaORM 0.11.0
author: SeaQL Team
author_title: Chris Tsang
author_url: https://github.com/SeaQL
author_image_url: https://www.sea-ql.org/SeaORM/img/SeaQL.png
tags: [news]
---

🎉 We are pleased to release SeaORM [`0.11.0`](https://github.com/SeaQL/sea-orm/releases/tag/0.11.0)!

## Data Loader

[[#1443](https://github.com/SeaQL/sea-orm/pull/1443), [#1238](https://github.com/SeaQL/sea-orm/pull/1238)] The [LoaderTrait](https://docs.rs/sea-orm/*/sea_orm/query/trait.LoaderTrait.html) provides an API to load related entities in batches.

Consider this one to many relation:

```rust
let cake_with_fruits: Vec<(cake::Model, Vec<fruit::Model>)> = Cake::find()
    .find_with_related(Fruit)
    .all(db)
    .await?;
```

The generated SQL is:

```sql
SELECT
    "cake"."id" AS "A_id",
    "cake"."name" AS "A_name",
    "fruit"."id" AS "B_id",
    "fruit"."name" AS "B_name",
    "fruit"."cake_id" AS "B_cake_id"
FROM "cake"
LEFT JOIN "fruit" ON "cake"."id" = "fruit"."cake_id"
ORDER BY "cake"."id" ASC
```

The 1 side's (Cake) data will be duplicated. If N is a large number, this would results in more data being transferred over the wire. Using the Loader would ensure each model is transferred only once.

The following loads the same data as above, but with two queries:

```rust
let cakes: Vec<cake::Model> = Cake::find().all(db).await?;
let fruits: Vec<Vec<fruit::Model>> = cakes.load_many(Fruit, db).await?;

for (cake, fruits) in cakes.into_iter().zip(fruits.into_iter()) { .. }
```

```sql
SELECT "cake"."id", "cake"."name" FROM "cake"
SELECT "fruit"."id", "fruit"."name", "fruit"."cake_id" FROM "fruit" WHERE "fruit"."cake_id" IN (..)
```

You can even apply filters on the related entity:

```rust
let fruits_in_stock: Vec<Vec<fruit::Model>> = cakes.load_many(
    fruit::Entity::find().filter(fruit::Column::Stock.gt(0i32))
    db
).await?;
```

```sql
SELECT "fruit"."id", "fruit"."name", "fruit"."cake_id" FROM "fruit"
WHERE "fruit"."stock" > 0 AND "fruit"."cake_id" IN (..)
```

To learn more, read the [relation docs](https://www.sea-ql.org/SeaORM/docs/relation/data-loader/).

## Transaction Isolation Level and Access Mode

[[#1230](https://github.com/SeaQL/sea-orm/pull/1230)] The [`transaction_with_config`](https://docs.rs/sea-orm/*/sea_orm/trait.TransactionTrait.html#tymethod.transaction_with_config) and [`begin_with_config`](https://docs.rs/sea-orm/*/sea_orm/trait.TransactionTrait.html#tymethod.begin_with_config) allows you to specify the [IsolationLevel](https://docs.rs/sea-orm/*/sea_orm/enum.IsolationLevel.html) and [AccessMode](https://docs.rs/sea-orm/*/sea_orm/enum.AccessMode.html).

For now, they are only implemented for MySQL and Postgres. In order to align their semantic difference, MySQL will execute `SET TRANSACTION` commands before begin transaction, while Postgres will execute `SET TRANSACTION` commands after begin transaction.

```rust
db.transaction_with_config::<_, _, DbErr>(
    |txn| { ... },
    Some(IsolationLevel::ReadCommitted),
    Some(AccessMode::ReadOnly),
)
.await?;

let transaction = db
    .begin_with_config(IsolationLevel::ReadCommitted, AccessMode::ReadOnly)
    .await?;
```

To learn more, read the [transaction docs](https://www.sea-ql.org/SeaORM/docs/advanced-query/transaction/).

## Cast Column Type on Select and Save

[[#1304](https://github.com/SeaQL/sea-orm/pull/1304)] If you need to select a column as one type but save it into the database as another, you can specify the `select_as` and the `save_as` attributes to perform the casting. A typical use case is selecting a column of type `citext` (case-insensitive text) as `String` in Rust and saving it into the database as `citext`. One should define the model field as below:

```rust
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "ci_table")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    #[sea_orm(select_as = "text", save_as = "citext")]
    pub case_insensitive_text: String
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
```

## Changes to `ActiveModelBehavior`

[[#1328](https://github.com/SeaQL/sea-orm/pull/1328), [#1145](https://github.com/SeaQL/sea-orm/pull/1145)] The methods of `ActiveModelBehavior` now have `Connection` as an additional parameter. It enables you to perform database operations, for example, logging the changes made to the existing model or validating the data before inserting it.

```rust
#[async_trait]
impl ActiveModelBehavior for ActiveModel {
    /// Create a new ActiveModel with default values. Also used by `Default::default()`.
    fn new() -> Self {
        Self {
            uuid: Set(Uuid::new_v4()),
            ..ActiveModelTrait::default()
        }
    }

    /// Will be triggered before insert / update
    async fn before_save<C>(self, db: &C, insert: bool) -> Result<Self, DbErr>
    where
        C: ConnectionTrait,
    {
        // Logging changes
        edit_log::ActiveModel {
            action: Set("before_save".into()),
            values: Set(serde_json::json!(model)),
            ..Default::default()
        }
        .insert(db)
        .await?;

        Ok(self)
    }
}
```

To learn more, read the [entity docs](https://www.sea-ql.org/SeaORM/docs/generate-entity/entity-structure/#active-model-behavior).

## Execute Unprepared SQL Statement

[[#1327](https://github.com/SeaQL/sea-orm/pull/1327)] You can execute an unprepared SQL statement with [`ConnectionTrait::execute_unprepared`](https://docs.rs/sea-orm/*/sea_orm/trait.ConnectionTrait.html#tymethod.execute_unprepared).

```rust
// Use `execute_unprepared` if the SQL statement doesn't have value bindings
db.execute_unprepared(
    "CREATE TABLE `cake` (
        `id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,
        `name` varchar(255) NOT NULL
    )"
)
.await?;

// Construct a `Statement` if the SQL contains value bindings
let stmt = Statement::from_sql_and_values(
    manager.get_database_backend(),
    r#"INSERT INTO `cake` (`name`) VALUES (?)"#,
    ["Cheese Cake".into()]
);
db.execute(stmt).await?;
```

## Select Into Tuple

[[#1311](https://github.com/SeaQL/sea-orm/pull/1311)] You can select a tuple (or single value) with the [`into_tuple`](https://docs.rs/sea-orm/*/sea_orm/struct.Selector.html#method.into_tuple) method.

```rust
let res: Vec<(String, i64)> = cake::Entity::find()
    .select_only()
    .column(cake::Column::Name)
    .column(cake::Column::Id.count())
    .group_by(cake::Column::Name)
    .into_tuple()
    .all(&db)
    .await?;
```

## Atomic Migration

[[#1379](https://github.com/SeaQL/sea-orm/pull/1379)] Migration will be executed in Postgres atomically that means migration scripts will be executed inside a transaction. Changes done to the database will be rolled back if the migration failed. However, atomic migration is not supported in MySQL and SQLite.

You can start a transaction inside each migration to perform operations like [seeding sample data](https://www.sea-ql.org/SeaORM/docs/migration/seeding-data/#seeding-data-transactionally) for a newly created table.

## Types Support

* [[#1325](https://github.com/SeaQL/sea-orm/pull/1325)] Support various UUID formats that are available in `uuid::fmt` module

```rust
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "uuid_fmt")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub uuid: Uuid,
    pub uuid_braced: uuid::fmt::Braced,
    pub uuid_hyphenated: uuid::fmt::Hyphenated,
    pub uuid_simple: uuid::fmt::Simple,
    pub uuid_urn: uuid::fmt::Urn,
}
```

* [[#1210](https://github.com/SeaQL/sea-orm/pull/1210)] Support vector of enum for Postgres

```rust
#[derive(Debug, Clone, PartialEq, Eq, EnumIter, DeriveActiveEnum)]
#[sea_orm(rs_type = "String", db_type = "Enum", enum_name = "tea")]
pub enum Tea {
    #[sea_orm(string_value = "EverydayTea")]
    EverydayTea,
    #[sea_orm(string_value = "BreakfastTea")]
    BreakfastTea,
}

#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "enum_vec")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub teas: Vec<Tea>,
    pub teas_opt: Option<Vec<Tea>>,
}
```

* [[#1414](https://github.com/SeaQL/sea-orm/pull/1414)] Support `ActiveEnum` field as primary key

```rust
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "enum_primary_key")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: Tea,
    pub category: Option<Category>,
    pub color: Option<Color>,
}
```

## Opt-in Unstable Internal APIs

By enabling `sea-orm-internal` feature you opt-in unstable internal APIs including:

* Accessing the inner connection pool of SQLx with [`get_*_connection_pool`](https://docs.rs/sea-orm/*/sea_orm/enum.DatabaseConnection.html#impl-DatabaseConnection-2) method
* Re-exporting [SQLx errors types](https://docs.rs/sea-orm/*/sea_orm/error/index.html): `SqlxError`, `SqlxMySqlError`, `SqlxPostgresError` and `SqlxSqliteError`

## Breaking Changes

* [[#1420](https://github.com/SeaQL/sea-orm/pull/1420)] sea-orm-cli: `generate entity` command enable `--universal-time` flag by default

* [[#1425](https://github.com/SeaQL/sea-orm/pull/1425)] Added `RecordNotInserted` and `RecordNotUpdated` to `DbErr`

* [[#1327](https://github.com/SeaQL/sea-orm/pull/1327)] Added `ConnectionTrait::execute_unprepared` method

* [[#1311](https://github.com/SeaQL/sea-orm/pull/1311)] The required method of `TryGetable` changed:

```rust
// then
fn try_get(res: &QueryResult, pre: &str, col: &str) -> Result<Self, TryGetError>;
// now; ColIdx can be `&str` or `usize`
fn try_get_by<I: ColIdx>(res: &QueryResult, index: I) -> Result<Self, TryGetError>;
```

So if you implemented it yourself:

```diff
impl TryGetable for XXX {
-   fn try_get(res: &QueryResult, pre: &str, col: &str) -> Result<Self, TryGetError> {
+   fn try_get_by<I: sea_orm::ColIdx>(res: &QueryResult, idx: I) -> Result<Self, TryGetError> {
-       let value: YYY = res.try_get(pre, col).map_err(TryGetError::DbErr)?;
+       let value: YYY = res.try_get_by(idx).map_err(TryGetError::DbErr)?;
        ..
    }
}
```

* [[#1328](https://github.com/SeaQL/sea-orm/pull/1328)] The `ActiveModelBehavior` trait becomes async trait.
If you overridden the default `ActiveModelBehavior` implementation:

```rust
#[async_trait::async_trait]
impl ActiveModelBehavior for ActiveModel {
    async fn before_save<C>(self, db: &C, insert: bool) -> Result<Self, DbErr>
    where
        C: ConnectionTrait,
    {
        // ...
    }

    // ...
}
```

* [[#1425](https://github.com/SeaQL/sea-orm/pull/1425)] `DbErr::RecordNotFound("None of the database rows are affected")` is moved to a dedicated error variant `DbErr::RecordNotUpdated`

```rust
let res = Update::one(cake::ActiveModel {
        name: Set("Cheese Cake".to_owned()),
        ..model.into_active_model()
    })
    .exec(&db)
    .await;

// then
assert_eq!(
    res,
    Err(DbErr::RecordNotFound(
        "None of the database rows are affected".to_owned()
    ))
);

// now
assert_eq!(res, Err(DbErr::RecordNotUpdated));
```

* [[#1395](https://github.com/SeaQL/sea-orm/pull/1395)] `sea_orm::ColumnType` was replaced by `sea_query::ColumnType`
    * Method `ColumnType::def` was moved to `ColumnTypeTrait`
    * `ColumnType::Binary` becomes a tuple variant which takes in additional option `sea_query::BlobSize`
    * `ColumnType::Custom` takes a `sea_query::DynIden` instead of `String` and thus a new method `custom` is added (note the lowercase)

```diff
// Compact Entity
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "fruit")]
pub struct Model {
-   #[sea_orm(column_type = r#"Custom("citext".to_owned())"#)]
+   #[sea_orm(column_type = r#"custom("citext")"#)]
    pub column: String,
}
```

```diff
// Expanded Entity
impl ColumnTrait for Column {
    type EntityName = Entity;

    fn def(&self) -> ColumnDef {
        match self {
-           Self::Column => ColumnType::Custom("citext".to_owned()).def(),
+           Self::Column => ColumnType::custom("citext").def(),
        }
    }
}
```

## SeaORM Enhancements

* [[#1256](https://github.com/SeaQL/sea-orm/pull/1256)] Refactor schema module to expose functions for database alteration
* [[#1346](https://github.com/SeaQL/sea-orm/pull/1346)] Generate compact entity with `#[sea_orm(column_type = "JsonBinary")]` macro attribute
* `MockDatabase::append_exec_results()`, `MockDatabase::append_query_results()`, `MockDatabase::append_exec_errors()` and `MockDatabase::append_query_errors()` [[#1367](https://github.com/SeaQL/sea-orm/pull/1367)] take any types implemented `IntoIterator` trait
* [[#1362](https://github.com/SeaQL/sea-orm/pull/1362)] `find_by_id` and `delete_by_id` take any `Into` primary key value
* [[#1410](https://github.com/SeaQL/sea-orm/pull/1410)] `QuerySelect::offset` and `QuerySelect::limit` takes in `Into<Option<u64>>` where `None` would reset them
* [[#1236](https://github.com/SeaQL/sea-orm/pull/1236)] Added `DatabaseConnection::close`
* [[#1381](https://github.com/SeaQL/sea-orm/pull/1381)] Added `is_null` getter for `ColumnDef`
* [[#1177](https://github.com/SeaQL/sea-orm/pull/1177)] Added `ActiveValue::reset` to convert `Unchanged` into `Set`
* [[#1415](https://github.com/SeaQL/sea-orm/pull/1415)] Added `QueryTrait::apply_if` to optionally apply a filter
* Added the `sea-orm-internal` feature flag to expose some SQLx types
    * [[#1297](https://github.com/SeaQL/sea-orm/pull/1297)] Added `DatabaseConnection::get_*_connection_pool()` for accessing the inner SQLx connection pool
    * [[#1434](https://github.com/SeaQL/sea-orm/pull/1434)] Re-exporting SQLx errors

## CLI Enhancements

* [[#846](https://github.com/SeaQL/sea-orm/pull/846), [#1186](https://github.com/SeaQL/sea-orm/pull/1186), [#1318](https://github.com/SeaQL/sea-orm/pull/1318)] Generate `#[serde(skip_deserializing)]` for primary key columns
* [[#1171](https://github.com/SeaQL/sea-orm/pull/1171), [#1320](https://github.com/SeaQL/sea-orm/pull/1320)] Generate `#[serde(skip)]` for hidden columns
* [[#1124](https://github.com/SeaQL/sea-orm/pull/1124), [#1321](https://github.com/SeaQL/sea-orm/pull/1321)] Generate entity with extra derives and attributes for model struct

## Integration Examples

SeaORM plays well with the other crates in the async ecosystem. We maintain an array of example projects for building REST, GraphQL and gRPC services. More examples [wanted](https://github.com/SeaQL/sea-orm/issues/269)!

* [Actix v4 Example](https://github.com/SeaQL/sea-orm/tree/master/examples/actix_example)
* [Actix v3 Example](https://github.com/SeaQL/sea-orm/tree/master/examples/actix3_example)
* [Axum Example](https://github.com/SeaQL/sea-orm/tree/master/examples/axum_example)
* [GraphQL Example](https://github.com/SeaQL/sea-orm/tree/master/examples/graphql_example)
* [jsonrpsee Example](https://github.com/SeaQL/sea-orm/tree/master/examples/jsonrpsee_example)
* [Poem Example](https://github.com/SeaQL/sea-orm/tree/master/examples/poem_example)
* [Rocket Example](https://github.com/SeaQL/sea-orm/tree/master/examples/rocket_example)
* [Salvo Example](https://github.com/SeaQL/sea-orm/tree/master/examples/salvo_example)
* [Tonic Example](https://github.com/SeaQL/sea-orm/tree/master/examples/tonic_example)

## Sponsor

Our [GitHub Sponsor](https://github.com/sponsors/SeaQL) profile is up! SeaQL.org is an independent open-source organization run by passionate developers. If you enjoy using SeaORM, please star and share our repositories. If you feel generous, a small donation will be greatly appreciated, and goes a long way towards sustaining the project.

A big shout out to our sponsors 😇:

<div class="row">
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/tugascript">
                <img src="https://avatars.githubusercontent.com/u/64930104?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Afonso Barracha
                </div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/Sytten">
                <img src="https://avatars.githubusercontent.com/u/2366731?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Émile Fugulin
                </div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/deansheather">
                <img src="https://avatars.githubusercontent.com/u/11241812?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Dean Sheather
                </div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/shanesveller">
                <img src="https://avatars.githubusercontent.com/u/831?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Shane Sveller
                </div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/sakti">
                <img src="https://avatars.githubusercontent.com/u/196178?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Sakti Dwi Cahyono
                </div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/DominoTree">
                <img src="https://avatars.githubusercontent.com/u/5438118?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Nick Price
                </div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/rgoracz">
                <img src="https://avatars.githubusercontent.com/u/6758092?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Roland Gorácz
                </div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/hgiesel">
                <img src="https://avatars.githubusercontent.com/u/7188844?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Henrik Giesel
                </div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/trueb2">
                <img src="https://avatars.githubusercontent.com/u/8592049?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Jacob Trueb
                </div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/siketyan">
                <img src="https://avatars.githubusercontent.com/u/12772118?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Naoki Ikeguchi
                </div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/manfredcml">
                <img src="https://avatars.githubusercontent.com/u/27536502?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Manfred Lee
                </div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/marcusbuffett">
                <img src="https://avatars.githubusercontent.com/u/1834328?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Marcus Buffett
                </div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/efrain2007">
                <img src="https://avatars.githubusercontent.com/u/65697999?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    efrain2007
                </div>
            </div>
        </div>
    </div>
</div>

## What's Next?

SeaQL is a community driven project. We welcome you to participate, contribute and build together for Rust's future.

Here is the roadmap for SeaORM [`0.12.x`](https://github.com/SeaQL/sea-orm/milestone/12).
