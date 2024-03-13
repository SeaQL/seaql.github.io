---
slug: 2022-11-10-whats-new-in-0.10.x
title: What's new in SeaORM 0.10.x
author: SeaQL Team
author_title: Chris Tsang
author_url: https://github.com/SeaQL
author_image_url: https://www.sea-ql.org/SeaORM/img/SeaQL.png
tags: [news]
---

🎉 We are pleased to release SeaORM [`0.10.0`](https://github.com/SeaQL/sea-orm/releases/tag/0.10.0)!

## Rust 1.65

The long-anticipated Rust [1.65](https://blog.rust-lang.org/2022/11/03/Rust-1.65.0.html) has been released! Generic associated types (GATs) must be the hottest newly-stabilized feature.

How is GAT useful to SeaORM? Let's take a look at the following:

```rust
trait StreamTrait<'a>: Send + Sync {
    type Stream: Stream<Item = Result<QueryResult, DbErr>> + Send;

    fn stream(
        &'a self,
        stmt: Statement,
    ) -> Pin<Box<dyn Future<Output = Result<Self::Stream, DbErr>> + 'a + Send>>;
}
```

You can see that the `Future` has a lifetime `'a`, but as a side effect the lifetime is tied to `StreamTrait`.

With GAT, the lifetime can be elided:

```rust
trait StreamTrait: Send + Sync {
    type Stream<'a>: Stream<Item = Result<QueryResult, DbErr>> + Send
    where
        Self: 'a;

    fn stream<'a>(
        &'a self,
        stmt: Statement,
    ) -> Pin<Box<dyn Future<Output = Result<Self::Stream<'a>, DbErr>> + 'a + Send>>;
}
```

What benefit does it bring in practice? Consider you have a function that accepts a generic `ConnectionTrait` and calls `stream()`: 

```rust
async fn processor<'a, C>(conn: &'a C) -> Result<...>
where C: ConnectionTrait + StreamTrait<'a> {...}
```

The fact that the lifetime of the connection is tied to the stream can create confusion to the compiler, most likely when you are making transactions:

```rust
async fn do_transaction<C>(conn: &C) -> Result<...>
where C: ConnectionTrait + TransactionTrait
{
    let txn = conn.begin().await?;
    processor(&txn).await?;
    txn.commit().await?;
}
```

But now, with the lifetime of the stream elided, it's much easier to work on streams inside transactions because the two lifetimes are now distinct and the stream's lifetime is implicit:

```rust
async fn processor<C>(conn: &C) -> Result<...>
where C: ConnectionTrait + StreamTrait {...}
```

Big thanks to [@nappa85](https://github.com/nappa85) for the [contribution](https://github.com/SeaQL/sea-orm/pull/1161).

 ---

Below are some feature highlights 🌟:

## Support Array Data Types in Postgres

[[#1132](https://github.com/SeaQL/sea-orm/pull/1132)] Support model field of type `Vec<T>`. (by [@hf29h8sh321](https://github.com/hf29h8sh321), [@ikrivosheev](https://github.com/ikrivosheev), [@tyt2y3](https://github.com/tyt2y3), [@billy1624](https://github.com/billy1624))

You can define a vector of types that are already supported by SeaORM in the model.

```rust
#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "collection")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub integers: Vec<i32>,
    pub integers_opt: Option<Vec<i32>>,
    pub floats: Vec<f32>,
    pub doubles: Vec<f64>,
    pub strings: Vec<String>,
}
```

Keep in mind that you need to enable the `postgres-array` feature and this is a Postgres only feature.

```toml
sea-orm = { version = "0.10", features = ["postgres-array", ...] }
```

## Better Error Types

[[#750](https://github.com/SeaQL/sea-orm/pull/750), [#1002](https://github.com/SeaQL/sea-orm/pull/1002)] Error types with parsable database specific error. (by [@mohs8421](https://github.com/mohs8421), [@tyt2y3](https://github.com/tyt2y3))

```rust
let mud_cake = cake::ActiveModel {
    id: Set(1),
    name: Set("Moldy Cake".to_owned()),
    price: Set(dec!(10.25)),
    gluten_free: Set(false),
    serial: Set(Uuid::new_v4()),
    bakery_id: Set(None),
};

// Insert a new cake with its primary key (`id` column) set to 1.
let cake = mud_cake.save(db).await.expect("could not insert cake");

// Insert the same row again and it failed
// because primary key of each row should be unique.
let error: DbErr = cake
    .into_active_model()
    .insert(db)
    .await
    .expect_err("inserting should fail due to duplicate primary key");

match error {
    DbErr::Exec(RuntimeErr::SqlxError(error)) => match error {
        Error::Database(e) => {
            // We check the error code thrown by the database (MySQL in this case),
            // `23000` means `ER_DUP_KEY`: we have a duplicate key in the table.
            assert_eq!(e.code().unwrap(), "23000");
        }
        _ => panic!("Unexpected sqlx-error kind"),
    },
    _ => panic!("Unexpected Error kind"),
}
```

## Run Migration on Any Postgres Schema

[[#1056](https://github.com/SeaQL/sea-orm/pull/1056)] By default migration will be run on the `public` schema, you can now override it when running migration on the CLI or programmatically. (by [@MattGson](https://github.com/MattGson), [@nahuakang](https://github.com/nahuakang), [@billy1624](https://github.com/billy1624))

For CLI, you can specify the target schema with `-s` / `--database_schema` option:
* via sea-orm-cli: `sea-orm-cli migrate -u postgres://root:root@localhost/database -s my_schema`
* via SeaORM migrator: `cargo run -- -u postgres://root:root@localhost/database -s my_schema`

You can also run the migration on the target schema programmatically:

```rust
let connect_options = ConnectOptions::new("postgres://root:root@localhost/database".into())
    .set_schema_search_path("my_schema".into()) // Override the default schema
    .to_owned();

let db = Database::connect(connect_options).await?

migration::Migrator::up(&db, None).await?;
```

## Breaking Changes

* [[#789](https://github.com/SeaQL/sea-orm/pull/789)] Replaced `usize` with `u64` in `PaginatorTrait` (by [@liberwang1013](https://github.com/liberwang1013))
* [[#1002](https://github.com/SeaQL/sea-orm/pull/1002)] Type signature of `DbErr` changed as a result of the PR (by [@mohs8421](https://github.com/mohs8421), [@tyt2y3](https://github.com/tyt2y3))

* `ColumnType::Enum` structure changed:
```rust
enum ColumnType {
    // then
    Enum(String, Vec<String>)

    // now
    Enum {
        /// Name of enum
        name: DynIden,
        /// Variants of enum
        variants: Vec<DynIden>,
    }
    ...
}
```

* A new method `array_type` was added to `ValueType`:
```rust
impl sea_orm::sea_query::ValueType for MyType {
    fn array_type() -> sea_orm::sea_query::ArrayType {
        sea_orm::sea_query::ArrayType::TypeName
    }
    ...
}
```

* `ActiveEnum::name()` changed return type to `DynIden`:
```rust
#[derive(Debug, Iden)]
#[iden = "category"]
pub struct CategoryEnum;

impl ActiveEnum for Category {
    // then
    fn name() -> String {
        "category".to_owned()
    }

    // now
    fn name() -> DynIden {
        SeaRc::new(CategoryEnum)
    }
    ...
}
```

## SeaORM Enhancements

* [[#995](https://github.com/SeaQL/sea-orm/pull/995)] Support `time` crate for SQLite (by [@billy1624](https://github.com/billy1624))
* [[#902](https://github.com/SeaQL/sea-orm/pull/902)] Support `distinct` & `distinct_on` expression (by [@edg](https://github.com/edg)-l, [@kyoto7250](https://github.com/kyoto7250))
* [[#973](https://github.com/SeaQL/sea-orm/pull/973)] `fn column()` also handle enum type (by [@tyt2y3](https://github.com/tyt2y3), [@billy1624](https://github.com/billy1624))
* [[#897](https://github.com/SeaQL/sea-orm/pull/897)] Added `acquire_timeout` on `ConnectOptions` (by [@001wwang](https://github.com/001wwang), [@billy1624](https://github.com/billy1624))
* [[#1020](https://github.com/SeaQL/sea-orm/pull/1020)] Better compile error for entity without primary key (by [@Sytten](https://github.com/Sytten), [@billy1624](https://github.com/billy1624))
* [[#833](https://github.com/SeaQL/sea-orm/pull/833)] Added blanket implementations of `IntoActiveValue` for `Option` values (by [@wdcocq](https://github.com/wdcocq))
* [[#1112](https://github.com/SeaQL/sea-orm/pull/1112)] Added `into_model` & `into_json` to `Cursor` (by [@jukanntenn](https://github.com/jukanntenn), [@billy1624](https://github.com/billy1624))
* [[#1056](https://github.com/SeaQL/sea-orm/pull/1056)] Added `set_schema_search_path` method to `ConnectOptions` for setting schema search path of PostgreSQL connection (by [@MattGson](https://github.com/MattGson), [@billy1624](https://github.com/billy1624))
* [[#1042](https://github.com/SeaQL/sea-orm/pull/1042)] Serialize `time` types as `serde_json::Value` (by [@jimmycuadra](https://github.com/jimmycuadra), [@billy1624](https://github.com/billy1624))
* [[#986](https://github.com/SeaQL/sea-orm/pull/986)] Implements `fmt::Display` for `ActiveEnum` (by [@jesseduffield](https://github.com/jesseduffield), [@billy264](https://github.com/billy264))
* [[#990](https://github.com/SeaQL/sea-orm/pull/990)] Implements `TryFrom<ActiveModel>` for `Model` (by [@MattGson](https://github.com/MattGson), [@greenhandatsjtu](https://github.com/greenhandatsjtu))

## CLI Enhancements

* [[#1052](https://github.com/SeaQL/sea-orm/pull/1052)] Escape module name defined with Rust keywords (by [@andy128k](https://github.com/andy128k))
* [[#879](https://github.com/SeaQL/sea-orm/pull/879), [#1155](https://github.com/SeaQL/sea-orm/pull/1155)] Check to make sure migration name doesn't contain hyphen `-` in it (by [@AngelOnFira](https://github.com/AngelOnFira))
* [[#953](https://github.com/SeaQL/sea-orm/pull/953)] Generate entity files as a library or module (by [@viktorbahr](https://github.com/viktorbahr), [@HigherOrderLogic](https://github.com/HigherOrderLogic))
* [[#947](https://github.com/SeaQL/sea-orm/pull/947)] Generate a new migration template with name prefix of unix timestamp (by [@Animeshz](https://github.com/Animeshz))
* [[#933](https://github.com/SeaQL/sea-orm/pull/933)] Generate migration in modules (by [@remlse](https://github.com/remlse))
* [[#1019](https://github.com/SeaQL/sea-orm/pull/1019)] Generate `DeriveRelation` on empty `Relation` enum (by [@alper](https://github.com/alper), [@billy1624](https://github.com/billy1624))
* [[#988](https://github.com/SeaQL/sea-orm/pull/988)] Generate entity derive `Eq` if possible (by [@billy1624](https://github.com/billy1624), [@w93163red](https://github.com/w93163red))
* [[#1056](https://github.com/SeaQL/sea-orm/pull/1056)] Run migration on any PostgreSQL schema (by [@MattGson](https://github.com/MattGson), [@billy1624](https://github.com/billy1624))
* [[#864](https://github.com/SeaQL/sea-orm/pull/864), [#991](https://github.com/SeaQL/sea-orm/pull/991)] `migrate fresh` command will drop all PostgreSQL types (by [@MaderNoob](https://github.com/MaderNoob), [@karpa4o4](https://github.com/karpa4o4))

Please check [here](https://github.com/SeaQL/sea-orm/blob/master/CHANGELOG.md#0101---2022-10-27) for the complete changelog.

## Integration Examples

SeaORM plays well with the other crates in the async ecosystem. We maintain an array of example projects for building REST, GraphQL and gRPC services. More examples [wanted](https://github.com/SeaQL/sea-orm/issues/269)!

- [Actix v4 Example](https://github.com/SeaQL/sea-orm/tree/master/examples/actix_example)
- [Axum Example](https://github.com/SeaQL/sea-orm/tree/master/examples/axum_example)
- [GraphQL Example](https://github.com/SeaQL/sea-orm/tree/master/examples/graphql_example)
- [jsonrpsee Example](https://github.com/SeaQL/sea-orm/tree/master/examples/jsonrpsee_example)
- [Poem Example](https://github.com/SeaQL/sea-orm/tree/master/examples/poem_example)
- [Rocket Example](https://github.com/SeaQL/sea-orm/tree/master/examples/rocket_example)
- [Salvo Example](https://github.com/SeaQL/sea-orm/tree/master/examples/salvo_example)
- [Tonic Example](https://github.com/SeaQL/sea-orm/tree/master/examples/tonic_example)

## Sponsor

Our [GitHub Sponsor](https://github.com/sponsors/SeaQL) profile is up! If you feel generous, a small donation will be greatly appreciated.

A big shout out to our sponsors 😇:

<div class="row">
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
            <a class="avatar__photo-link avatar__photo avatar__photo--sm">
                <img style={{width: '100%'}} src="data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="/>
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Unnamed Sponsor
                </div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm">
                <img style={{width: '100%'}} src="data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="/>
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Unnamed Sponsor
                </div>
            </div>
        </div>
    </div>
</div>

## Community

SeaQL is a community driven project. We welcome you to participate, contribute and together build for Rust's future.

Here is the roadmap for SeaORM [`0.11.x`](https://github.com/SeaQL/sea-orm/milestone/11).
