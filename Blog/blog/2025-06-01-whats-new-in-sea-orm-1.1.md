---
slug: 2025-06-01-whats-new-in-sea-orm-1.1
title: What's new in SeaORM 1.1.12
author: SeaQL Team
author_title: Chris Tsang
author_url: https://github.com/SeaQL
author_image_url: https://www.sea-ql.org/blog/img/SeaQL.png
image: https://www.sea-ql.org/blog/img/SeaORM%201.0-rc%20Banner.png
tags: [news]
---

<img alt="SeaORM 1.0 Banner" src="/blog/img/SeaORM%201.0%20Banner.png"/>

This blog post summarizes the new features and enhancements introduced in SeaORM `1.1`:

+ 2025-03-30 [`1.1.8`](https://github.com/SeaQL/sea-orm/releases/tag/1.1.8)
+ 2025-04-14 [`1.1.9`](https://github.com/SeaQL/sea-orm/releases/tag/1.1.9)
+ 2025-04-14 [`1.1.10`](https://github.com/SeaQL/sea-orm/releases/tag/1.1.10)
+ 2025-05-07 [`1.1.11`](https://github.com/SeaQL/sea-orm/releases/tag/1.1.11)
+ 2025-05-27 [`1.1.12`](https://github.com/SeaQL/sea-orm/releases/tag/1.1.12)

## New Features

### Implement `DeriveValueType` for enum strings

`DeriveValueType` now supports `enum` types. It offers a simpler alternative to `DeriveActiveEnum` for client-side enums backed by string database types.

```rust
#[derive(DeriveValueType)]
#[sea_orm(value_type = "String")]
pub enum Tag {
    Hard,
    Soft,
}

// `from_str` defaults to `std::str::FromStr::from_str`
impl std::str::FromStr for Tag {
    type Err = sea_orm::sea_query::ValueTypeErr;
    fn from_str(s: &str) -> Result<Self, Self::Err> { .. }
}

// `to_str` defaults to `std::string::ToString::to_string`.
impl std::fmt::Display for Tag {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result { .. }
}
```

The following trait impl are generated, removing the boilerplate previously needed:

<details>
    <summary>DeriveValueType expansion</summary>

```rust
#[automatically_derived]
impl std::convert::From<Tag> for sea_orm::Value {
    fn from(source: Tag) -> Self {
        std::string::ToString::to_string(&source).into()
    }
}

#[automatically_derived]
impl sea_orm::TryGetable for Tag {
    fn try_get_by<I: sea_orm::ColIdx>(res: &sea_orm::QueryResult, idx: I)
        -> std::result::Result<Self, sea_orm::TryGetError> {
        let string = String::try_get_by(res, idx)?;
        std::str::FromStr::from_str(&string).map_err(|err| sea_orm::TryGetError::DbErr(sea_orm::DbErr::Type(format!("{err:?}"))))
    }
}

#[automatically_derived]
impl sea_orm::sea_query::ValueType for Tag {
    fn try_from(v: sea_orm::Value) -> std::result::Result<Self, sea_orm::sea_query::ValueTypeErr> {
        let string = <String as sea_orm::sea_query::ValueType>::try_from(v)?;
        std::str::FromStr::from_str(&string).map_err(|_| sea_orm::sea_query::ValueTypeErr)
    }

    fn type_name() -> std::string::String {
        stringify!(Tag).to_owned()
    }

    fn array_type() -> sea_orm::sea_query::ArrayType {
        sea_orm::sea_query::ArrayType::String
    }

    fn column_type() -> sea_orm::sea_query::ColumnType {
        sea_orm::sea_query::ColumnType::String(sea_orm::sea_query::StringLen::None)
    }
}

#[automatically_derived]
impl sea_orm::sea_query::Nullable for Tag {
    fn null() -> sea_orm::Value {
        sea_orm::Value::String(None)
    }
}
```
</details>

You can override from_str and to_str with custom functions, which is especially useful if you're using [`strum::Display`](https://docs.rs/strum/latest/strum/derive.Display.html) and [`strum::EnumString`](https://docs.rs/strum/latest/strum/derive.EnumString.html), or manually implemented methods:

```rust
#[derive(DeriveValueType)]
#[sea_orm(
    value_type = "String",
    from_str = "Tag::from_str",
    to_str = "Tag::to_str"
)]
pub enum Tag {
    Color,
    Grey,
}

impl Tag {
    fn from_str(s: &str) -> Result<Self, ValueTypeErr> { .. }

    fn to_str(&self) -> &'static str { .. }
}
```

### Support Postgres IpNetwork

[#2395](https://github.com/SeaQL/sea-orm/pull/2395) (under feature flag `with-ipnetwork`)

```rust
// Model
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "host_network")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub ipaddress: IpNetwork,
    #[sea_orm(column_type = "Cidr")]
    pub network: IpNetwork,
}

// Schema
sea_query::Table::create()
    .table(host_network::Entity)
    .col(ColumnDef::new(host_network::Column::Id).integer().not_null().auto_increment().primary_key())
    .col(ColumnDef::new(host_network::Column::Ipaddress).inet().not_null())
    .col(ColumnDef::new(host_network::Column::Network).cidr().not_null())
    .to_owned();

// CRUD
host_network::ActiveModel {
    ipaddress: Set(IpNetwork::new(Ipv6Addr::new(..))),
    network: Set(IpNetwork::new(Ipv4Addr::new(..))),
    ..Default::default()
}
```

### Added `default_values` to `ActiveModelTrait`

The `ActiveModel::default()` returns `ActiveModel { .. NotSet }` by default (it can also be overridden).

We've added a new method `default_values()` which would set all fields to their actual `Default::default()` values.

This fills in a gap in the type system to help with serde. A real-world use case is to improve `ActiveModel::from_json`, an upcoming [new feature](https://github.com/SeaQL/sea-orm/pull/2599) (which is a breaking change, sadly).

```rust
#[derive(DeriveEntityModel)]
#[sea_orm(table_name = "fruit")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
    pub cake_id: Option<i32>,
    pub type_without_default: active_enums::Tea,
}

assert_eq!(
    fruit::ActiveModel::default_values(),
    fruit::ActiveModel {
        id: Set(0), // integer
        name: Set("".into()), // string
        cake_id: Set(None), // option
        type_without_default: NotSet, // not available
    },
);
```

If you are interested in how this works under the hood, a new method [`Value::dummy_value`](https://docs.rs/sea-query/latest/sea_query/value/enum.Value.html#method.dummy_value) is added in SeaQuery:

```rust
use sea_orm::sea_query::Value;
let v = Value::Int(None);
let n = v.dummy_value();
assert_eq!(n, Value::Int(Some(0)));
```

The real magic happens with a set of new traits, [`DefaultActiveValue`](https://docs.rs/sea-orm/latest/sea_orm/value/trait.DefaultActiveValue.html), [`DefaultActiveValueNone`](https://docs.rs/sea-orm/latest/sea_orm/value/trait.DefaultActiveValueNone.html) and [`DefaultActiveValueNotSet`](https://docs.rs/sea-orm/latest/sea_orm/value/trait.DefaultActiveValueNotSet.html), and taking advantage of Rust's autoref specialization mechanism used by [anyhow](https://github.com/dtolnay/case-studies/blob/master/autoref-specialization/README.md):

```rust
use sea_orm::value::{DefaultActiveValue, DefaultActiveValueNone, DefaultActiveValueNotSet};

let v = (&ActiveValue::<i32>::NotSet).default_value();
assert_eq!(v, ActiveValue::Set(0));

let v = (&ActiveValue::<Option<i32>>::NotSet).default_value();
assert_eq!(v, ActiveValue::Set(None));

let v = (&ActiveValue::<String>::NotSet).default_value();
assert_eq!(v, ActiveValue::Set("".to_owned()));

let v = (&ActiveValue::<Option<String>>::NotSet).default_value();
assert_eq!(v, ActiveValue::Set(None));

let v = (&ActiveValue::<TimeDateTime>::NotSet).default_value();
assert!(matches!(v, ActiveValue::Set(_)));
```

This enables progressive enhancements based on the traits of the individual `ActiveValue` type.

### Make sea-orm-cli & sea-orm-migration dependencies optional 

[#2367](https://github.com/SeaQL/sea-orm/pull/2367)

Some engineering teams prefer vendoring `sea-orm-cli` into their own project as part of the cargo workspace, and so would like to have more control of the dependency graph. This change makes it possible to pick the exact features needed by your project.

## Enhancements

* Impl `IntoCondition` for `RelationDef` [#2587](https://github.com/SeaQL/sea-orm/pull/2587)<br />
This allows using `RelationDef` directly where the query API expects an `IntoCondition`
```rust
let query = Query::select()
    .from(fruit::Entity)
    .inner_join(cake::Entity, fruit::Relation::Cake.def())
    .to_owned();

assert_eq!(
    query.to_string(MysqlQueryBuilder),
    r#"SELECT  FROM `fruit` INNER JOIN `cake` ON `fruit`.`cake_id` = `cake`.`id`"#
);
assert_eq!(
    query.to_string(PostgresQueryBuilder),
    r#"SELECT  FROM "fruit" INNER JOIN "cake" ON "fruit"."cake_id" = "cake"."id""#
);
assert_eq!(
    query.to_string(SqliteQueryBuilder),
    r#"SELECT  FROM "fruit" INNER JOIN "cake" ON "fruit"."cake_id" = "cake"."id""#
);
```
* Use fully-qualified syntax for ActiveEnum associated type [#2552](https://github.com/SeaQL/sea-orm/pull/2552)
* Added `try_getable_postgres_array!(Vec<u8>)` (to support `bytea[]`) [#2503](https://github.com/SeaQL/sea-orm/pull/2503)
* Accept `LikeExpr` in `like` and `not_like` [#2549](https://github.com/SeaQL/sea-orm/pull/2549)
* Loader: retain only unique key values in the query condition [#2569](https://github.com/SeaQL/sea-orm/pull/2569)
* Add proxy transaction impl [#2573](https://github.com/SeaQL/sea-orm/pull/2573)
* Relax `TransactionError`'s trait bound for errors to allow `anyhow::Error` [#2602](https://github.com/SeaQL/sea-orm/pull/2602)
* [sea-orm-cli] Fix `PgVector` codegen [#2589](https://github.com/SeaQL/sea-orm/pull/2589)
* [sea-orm-cli] Support postgres array in expanded format [#2545](https://github.com/SeaQL/sea-orm/pull/2545)

## Bug fixes

* Quote type properly in `AsEnum` casting [#2570](https://github.com/SeaQL/sea-orm/pull/2570)
```rust
assert_eq!(
    lunch_set::Entity::find()
        .select_only()
        .column(lunch_set::Column::Tea)
        .build(DbBackend::Postgres)
        .to_string(),
    r#"SELECT CAST("lunch_set"."tea" AS "text") FROM "lunch_set""#
    // "text" is now quoted; will work for "text"[] as well
);
```
* Include custom `column_name` in DeriveColumn `Column::from_str` impl [#2603](https://github.com/SeaQL/sea-orm/pull/2603)
```rust
#[derive(DeriveEntityModel)]
pub struct Model {
    #[sea_orm(column_name = "lAsTnAmE")]
    last_name: String,
}

assert!(matches!(Column::from_str("lAsTnAmE").unwrap(), Column::LastName));
```
* Check if url is well-formed before parsing (avoid panic) [#2558](https://github.com/SeaQL/sea-orm/pull/2558)
```rust
let db = Database::connect("postgre://sea:sea@localhost/bakery").await?;
// note the missing `s`; results in `DbErr::Conn`
```
* `QuerySelect::column_as` method cast ActiveEnum column [#2551](https://github.com/SeaQL/sea-orm/pull/2551)
```rust
#[derive(Debug, FromQueryResult, PartialEq)]
struct SelectResult {
    tea_alias: Option<Tea>,
}

assert_eq!(
    SelectResult {
        tea_alias: Some(Tea::EverydayTea),
    },
    Entity::find()
        .select_only()
        .column_as(Column::Tea, "tea_alias")
        .into_model()
        .one(db)
        .await?
        .unwrap()
);
```
* Fix unicode string enum [#2218](https://github.com/SeaQL/sea-orm/pull/2218)
```rust
#[derive(Debug, Clone, PartialEq, Eq, EnumIter, DeriveActiveEnum)]
#[sea_orm(rs_type = "String", db_type = "String(StringLen::None)")]
pub enum SeaORM {
    #[sea_orm(string_value = "씨오알엠")]
    씨오알엠,
}
```

## Upgrades

* Upgrade sqlx to 0.8.4 [#2562](https://github.com/SeaQL/sea-orm/pull/2562)
* Upgrade `sea-query` to `0.32.5`
* Upgrade `sea-schema` to `0.16.2`
* Upgrade `heck` to `0.5` [#2218](https://github.com/SeaQL/sea-orm/pull/2218)

## House Keeping

* Replace `once_cell` crate with `std` equivalent [#2524](https://github.com/SeaQL/sea-orm/pull/2524)
(available since rust 1.80)

## Release Planning

[SeaORM 1.0](https://www.sea-ql.org/blog/2024-08-04-sea-orm-1.0/) is a stable release. As demonstrated, we are able to ship many new features without breaking the API. The 1.1 version will be maintained until October 2025, and we'll likely release a 1.2 version with some breaking changes afterwards.

The underlying library SeaQuery will undergo an overhaul and be promoted to 1.0.

If you have suggestions on breaking changes, you are welcome to post them in the discussions:
* [Wanted breaking changes in SeaORM](https://github.com/SeaQL/sea-orm/discussions/2548)
* [Wanted breaking changes in SeaQuery](https://github.com/SeaQL/sea-query/discussions/795)

## SQL Server Support

We've been beta-testing [SQL Server for SeaORM](https://www.sea-ql.org/SeaORM-X/) for a while. SeaORM X offers the same SeaORM API for MSSQL. We ported all test cases and most examples, complemented by MSSQL specific documentation. If you are building enterprise software for your company, you can [request commercial access](https://forms.office.com/r/1MuRPJmYBR).

Features:

+ SeaQuery + SeaSchema
+ Entity generation with sea-orm-cli
+ GraphQL with Seaography
+ Nested transaction, connection pooling and multi-async runtime

## 🖥️ SeaORM Pro: Professional Admin Panel

<img src="/blog/img/sea-orm-pro-light.png#light" />
<img src="/blog/img/sea-orm-pro-dark.png#dark" />

[SeaORM Pro](https://www.sea-ql.org/sea-orm-pro/) is an admin panel solution allowing you to quickly and easily launch an admin panel for your application - frontend development skills not required, but certainly nice to have!

Features:

+ Full CRUD
+ Built on React + GraphQL
+ Built-in GraphQL resolver
+ Customize the UI with simple TOML

### Getting Started

+ [Example Repo](https://github.com/SeaQL/sea-orm-pro)
+ [Getting Started with Loco](https://www.sea-ql.org/sea-orm-pro/docs/install-and-config/getting-started-loco/)
+ [Getting Started with Axum](https://www.sea-ql.org/sea-orm-pro/docs/install-and-config/getting-started-axum/)

### Latest features

The [latest release](https://github.com/SeaQL/sea-orm-pro/releases/tag/0.2.0) of SeaORM Pro has a new feature, [Model Editor](https://www.sea-ql.org/sea-orm-pro/docs/raw-table-config/editor/). Instead of updating data in a pop-up dialog, editor offers a dedicated page with deep link to view and update data. It also offers more control to the UI layout.

<img src="/blog/img/raw-table-config-table-editor.png#light" />
<img src="/blog/img/raw-table-config-table-editor-dark.png#dark" />

## Sponsor

If you feel generous, a small donation will be greatly appreciated, and goes a long way towards sustaining the organization.

A big shout out to our [GitHub sponsors](https://github.com/sponsors/SeaQL) 😇:


#### Gold Sponsors

<a href="https://qdx.co/">
    <img src="https://www.sea-ql.org/static/sponsors/QDX.svg" width="128" />
</a>

[QDX](https://qdx.co/) pioneers quantum dynamics–powered drug discovery, leveraging AI and supercomputing to accelerate molecular modeling.
We're grateful to QDX for sponsoring the development of SeaORM, the SQL toolkit that powers their data intensive applications.

#### GitHub Sponsors

<div class="row">
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--m" href="https://github.com/numeusxyz">
                <img src="https://avatars.githubusercontent.com/u/82152211?s=200&v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Numeus
                </div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--m" href="https://github.com/caido-community">
                <img src="https://avatars.githubusercontent.com/u/168573261?s=200&v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Caido
                </div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--m" href="https://github.com/data-intuitive">
                <img src="https://avatars.githubusercontent.com/u/15045722?s=200&v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Data Intuitive
                </div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--m" href="https://github.com/marcusbuffett">
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
            <a class="avatar__photo-link avatar__photo avatar__photo--m" href="https://github.com/marcson909">
                <img src="https://avatars.githubusercontent.com/u/16665353?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    MS
                </div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--m" href="https://github.com/wh7f">
                <img src="https://avatars.githubusercontent.com/u/59872041?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    wh7f
                </div>
            </div>
        </div>
    </div>
</div>
<br />
<div class="row">
    <div class="col col--4 margin-bottom--md">
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
    <div class="col col--4 margin-bottom--md">
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
    <div class="col col--4 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/kallydev">
                <img src="https://avatars.githubusercontent.com/u/36319157?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    KallyDev
                </div>
            </div>
        </div>
    </div>
    <div class="col col--4 margin-bottom--md">
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
    <div class="col col--4 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/yuly3">
                <img src="https://avatars.githubusercontent.com/u/25814001?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    MasakiMiyazaki
                </div>
            </div>
        </div>
    </div>
</div>
