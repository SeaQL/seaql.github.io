---
slug: 2024-01-23-whats-new-in-seaorm-0.12.x
title: What's new in SeaORM 0.12.x
author: SeaQL Team
author_title: Chris Tsang
author_url: https://github.com/SeaQL
author_image_url: https://www.sea-ql.org/blog/img/SeaQL.png
tags: [news]
---

<img alt="SeaORM 0.12 Banner" src="/blog/img/SeaORM%2012%20Banner.png"/>

It had been a while since the initial [SeaORM 0.12 release](https://www.sea-ql.org/blog/2023-08-12-announcing-seaorm-0.12/). This blog post summarizes the new features and enhancements introduced in SeaORM [`0.12.2`](https://github.com/SeaQL/sea-orm/releases/tag/0.12.2) through [`0.12.12`](https://github.com/SeaQL/sea-orm/releases/tag/0.12.12)!

## Celebrating 2M downloads on crates.io 📦

We've just reached the milestone of 2,000,000 all time downloads on [crates.io](https://crates.io/crates/sea-orm). It's a testament to SeaORM's adoption in professional use. Thank you to all our users for your trust and for being a part of our community.

## New Features

### Entity format update

* [#1898](https://github.com/SeaQL/sea-orm/pull/1898) Add support for root JSON arrays (requires the `json-array` / `postgres-array` feature)! It involved an intricate type system refactor to work around the orphan rule.
```rust
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "json_struct_vec")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    #[sea_orm(column_type = "Json")]
    pub struct_vec: Vec<JsonColumn>,
}

#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize, FromJsonQueryResult)]
pub struct JsonColumn {
    pub value: String,
}
```

* [#2009](https://github.com/SeaQL/sea-orm/pull/2009) Added `comment` attribute for Entity; `create_table_from_entity` now supports comment on MySQL
```rust
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "applog", comment = "app logs")]
pub struct Model {
    #[sea_orm(primary_key, comment = "ID")]
    pub id: i32,
    #[sea_orm(comment = "action")]
    pub action: String,
    pub json: Json,
    pub created_at: DateTimeWithTimeZone,
}
```

### Cursor paginator improvements

* [#2037](https://github.com/SeaQL/sea-orm/pull/2037) Added descending order to Cursor:

```rust
// (default behaviour) Before 5 ASC, i.e. id < 5

let mut cursor = Entity::find().cursor_by(Column::Id);
cursor.before(5);

assert_eq!(
    cursor.first(4).all(db).await?,
    [
        Model { id: 1 },
        Model { id: 2 },
        Model { id: 3 },
        Model { id: 4 },
    ]
);

// (new API) After 5 DESC, i.e. id < 5

let mut cursor = Entity::find().cursor_by(Column::Id);
cursor.after(5).desc();

assert_eq!(
    cursor.first(4).all(db).await?,
    [
        Model { id: 4 },
        Model { id: 3 },
        Model { id: 2 },
        Model { id: 1 },
    ]
);
```

* [#1826](https://github.com/SeaQL/sea-orm/pull/1826) Added cursor support to `SelectTwo`:

```rust
// Join with linked relation; cursor by first table's id

cake::Entity::find()
    .find_also_linked(entity_linked::CakeToFillingVendor)
    .cursor_by(cake::Column::Id)
    .before(10)
    .first(2)
    .all(&db)
    .await?

// Join with relation; cursor by the 2nd table's id 

cake::Entity::find()
    .find_also_related(Fruit)
    .cursor_by_other(fruit::Column::Id)
    .before(10)
    .first(2)
    .all(&db)
    .await?
```

### Added "proxy" to database backend

[#1881](https://github.com/SeaQL/sea-orm/pull/1881), [#2000](https://github.com/SeaQL/sea-orm/pull/2000) Added "proxy" to database backend (requires feature flag `proxy`).

It enables the possibility of using SeaORM on edge / client-side! See the [GlueSQL demo](https://github.com/SeaQL/sea-orm/tree/master/examples/proxy_gluesql_example) for an example.

## Enhancements

* [#1954](https://github.com/SeaQL/sea-orm/pull/1954) [sea-orm-macro] Added `#[sea_orm(skip)]` to `FromQueryResult` derive macro
```rust
#[derive(Clone, Debug, PartialEq, Eq, Deserialize, Serialize, FromQueryResult)]
pub struct PublicUser {
    pub id: i64,
    pub name: String,
    #[serde(skip_serializing_if = "Vec::is_empty")]
    #[sea_orm(skip)]
    pub something: Something,
}
```

* [#1598](https://github.com/SeaQL/sea-orm/pull/1598) [sea-orm-macro] Added support for Postgres arrays in `FromQueryResult` impl of `JsonValue`
```rust
// existing API:

assert_eq!(
    Entity::find_by_id(1).one(db).await?,
    Some(Model {
        id: 1,
        name: "Collection 1".into(),
        integers: vec![1, 2, 3],
        teas: vec![Tea::BreakfastTea],
        colors: vec![Color::Black],
    })
);

// new API:

assert_eq!(
    Entity::find_by_id(1).into_json().one(db).await?,
    Some(json!({
        "id": 1,
        "name": "Collection 1",
        "integers": [1, 2, 3],
        "teas": ["BreakfastTea"],
        "colors": [0],
    }))
);
```

* [#1828](https://github.com/SeaQL/sea-orm/pull/1828) [sea-orm-migration] Check if an index exists
```rust
use sea_orm_migration::prelude::*;
#[derive(DeriveMigrationName)]
pub struct Migration;
#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // ...

        // Make sure the index haven't been created
        assert!(!manager.has_index("cake", "cake_name_index").await?);

        manager
            .create_index(
                Index::create()
                    .name("cake_name_index")
                    .table(Cake::Table)
                    .col(Cake::Name)
                    .to_owned(),
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // ...
    }
}
```

* [#2030](https://github.com/SeaQL/sea-orm/pull/2030) Improve query performance of `Paginator`'s `COUNT` query
* [#2055](https://github.com/SeaQL/sea-orm/pull/2055) Added SQLx slow statements logging to `ConnectOptions`
* [#1867](https://github.com/SeaQL/sea-orm/pull/1867) Added `QuerySelect::lock_with_behavior`
* [#2002](https://github.com/SeaQL/sea-orm/pull/2002) Cast enums in `is_in` and `is_not_in`
* [#1999](https://github.com/SeaQL/sea-orm/pull/1999) Add source annotations to errors
* [#1960](https://github.com/SeaQL/sea-orm/issues/1960) Implement `StatementBuilder` for `sea_query::WithQuery`
* [#1979](https://github.com/SeaQL/sea-orm/pull/1979) Added method `expr_as_` that accepts `self`
* [#1868](https://github.com/SeaQL/sea-orm/pull/1868) Loader: use `ValueTuple` as hash key
* [#1934](https://github.com/SeaQL/sea-orm/pull/1934) [sea-orm-cli] Added `--enum-extra-derives`
* [#1952](https://github.com/SeaQL/sea-orm/pull/1952) [sea-orm-cli] Added `--enum-extra-attributes`
* [#1693](https://github.com/SeaQL/sea-orm/pull/1693) [sea-orm-cli] Support generation of related entity with composite foreign key

## Bug fixes

* [#1855](https://github.com/SeaQL/sea-orm/pull/1855), [#2054](https://github.com/SeaQL/sea-orm/pull/2054) [sea-orm-macro] Qualify types in `DeriveValueType` macro
* [#1953](https://github.com/SeaQL/sea-orm/pull/1953) [sea-orm-cli] Fix duplicated active enum use statements on generated entities
* [#1821](https://github.com/SeaQL/sea-orm/pull/1821) [sea-orm-cli] Fix entity generation for non-alphanumeric enum variants
* [#2071](https://github.com/SeaQL/sea-orm/pull/2071) [sea-orm-cli] Fix entity generation for relations with composite keys
* [#1800](https://github.com/SeaQL/sea-orm/issues/1800) Fixed `find_with_related` consolidation logic
* [5a6acd67](https://github.com/SeaQL/sea-orm/commit/5a6acd67312601e4dba32896600044950e20f99f) Fixed `Loader` panic on empty inputs

## Upgrades

* [#1984](https://github.com/SeaQL/sea-orm/pull/1984) Upgraded `axum` example to `0.7`
* [#1858](https://github.com/SeaQL/sea-orm/pull/1858) Upgraded `chrono` to `0.4.30`
* [#1959](https://github.com/SeaQL/sea-orm/pull/1959) Upgraded `rocket` to `0.5.0`
* Upgraded `sea-query` to `0.30.5`
* Upgraded `sea-schema` to `0.14.2`
* Upgraded `salvo` to `0.50`

## House Keeping

* [#2057](https://github.com/SeaQL/sea-orm/pull/2057) Fix clippy warnings on 1.75
* [#1811](https://github.com/SeaQL/sea-orm/pull/1811) Added test cases for `find_xxx_related/linked`

## Release planning

In the [announcement blog post](https://www.sea-ql.org/blog/2023-08-12-announcing-seaorm-0.12/) of SeaORM 0.12, we stated we want to reduce the frequency of breaking releases while maintaining the pace for feature updates and enhancements. I am glad to say we've accomplished that!

There are still a few breaking changes planned for the next major release. After some [discussions](https://github.com/SeaQL/sea-orm/discussions/2031) and consideration, we decided that the next major release will be a release candidate for 1.0!

## Sponsor

A big thank to [DigitalOcean](https://www.digitalocean.com/) who sponsored our servers, and [JetBrains](https://www.jetbrains.com/) who sponsored our IDE, and every sponsor on [GitHub Sponsor](https://github.com/sponsors/SeaQL)!

If you feel generous, a small donation will be greatly appreciated, and goes a long way towards sustaining the organization.

A big shout out to our sponsors 😇:

#### Gold Sponsors

<a href="https://osmos.io/">
    <img src="https://www.sea-ql.org/static/sponsors/Osmos.svg#light" width="238" />
    <img src="https://www.sea-ql.org/static/sponsors/Osmos-dark.svg#dark" width="238" />
</a>

#### Sponsors

<div class="row">
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/Sytten">
                <img src="https://avatars.githubusercontent.com/u/2366731?u=2f43900772265deac96eb7a816d28a5a48b9a8dd&v=4" />
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
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/tugascript">
                <img src="https://avatars.githubusercontent.com/u/64930104?u=1171ed4ccb6da73b52de274109077686290da3a5&v=4" />
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
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/shanesveller">
                <img src="https://avatars.githubusercontent.com/u/831?u=474c7b31ddf0a5c1a03d1142dd18a300279c644a&v=4" />
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
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/deansheather">
                <img src="https://avatars.githubusercontent.com/u/11241812?u=260538c7d8b8c3c5350dba175ebb8294358441e0&v=4" />
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
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/marcusbuffett">
                <img src="https://avatars.githubusercontent.com/u/1834328?u=fd066d99cf4a6333bfb3927d1c756af4bb8baf7e&v=4" />
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
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/reneklacan">
                <img src="https://avatars.githubusercontent.com/u/1935686?u=132be985351312fcf96999daef515f551a93bb0d&v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    René Klačan
                </div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/Iceapinan">
                <img src="https://avatars.githubusercontent.com/u/2698243?u=a852c75ac10098b9980f57af298be1399f6de66b&v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    IceApinan
                </div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/trueb2">
                <img src="https://avatars.githubusercontent.com/u/8592049?u=031c9ee96b47c27e3a8c485c3c0ebcd4f96120c9&v=4" />
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
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/ktanaka101">
                <img src="https://avatars.githubusercontent.com/u/10344925?u=a96d92e7cdd73f774b35fd0bc998964c07b24e29&v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Kentaro Tanaka
                </div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/siketyan">
                <img src="https://avatars.githubusercontent.com/u/12772118?u=1a51e0a06690e52982e7594bc7379481e65155a1&v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Natsuki Ikeguchi
                </div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/mmuellersoppart">
                <img src="https://avatars.githubusercontent.com/u/16762461?u=bef7454cb73c164b2d18e077e5ba6b7891aae3d2&v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Marlon Mueller-Soppart
                </div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/gitmalong">
                <img src="https://avatars.githubusercontent.com/u/18363591?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    ul
                </div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/manfredcml">
                <img src="https://avatars.githubusercontent.com/u/27536502?u=b71636bdabbc698458b32e2ac05c5771ad41097e&v=4" />
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
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/kallydev">
                <img src="https://avatars.githubusercontent.com/u/36319157?u=5be882aa4dbe7eea97b1a80a6473857369146df6&v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    KallyDev
                </div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/dsgallups">
                <img src="https://avatars.githubusercontent.com/u/44790295?u=d1c8d2a60930dfbe95497df7fecf52cf5d95dd5f&v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Daniel Gallups
                </div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/Coolpany-SE">
                <img src="https://avatars.githubusercontent.com/u/96304487?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Coolpany-SE
                </div>
            </div>
        </div>
    </div>
</div>

## Rustacean Sticker Pack 🦀

The Rustacean Sticker Pack is the perfect way to express your passion for Rust.
Our stickers are made with a premium water-resistant vinyl with a unique matte finish.
Stick them on your laptop, notebook, or any gadget to show off your love for Rust!

Moreover, all proceeds contributes directly to the ongoing development of SeaQL projects.

Sticker Pack Contents:
- Logo of SeaQL projects: SeaQL, SeaORM, SeaQuery, Seaography, FireDBG
- Mascot of SeaQL: Terres the Hermit Crab
- Mascot of Rust: Ferris the Crab
- The Rustacean word

[Support SeaQL and get a Sticker Pack!](https://www.sea-ql.org/sticker-pack/)

<a href="https://www.sea-ql.org/sticker-pack/"><img style={{borderRadius: "25px"}} alt="Rustacean Sticker Pack by SeaQL" src="https://www.sea-ql.org/static/sticker-pack-1s.jpg" /></a>
