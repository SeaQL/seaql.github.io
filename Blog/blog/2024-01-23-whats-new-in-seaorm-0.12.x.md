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

It had been 5 months, since the first SeaORM 0.12 release. Many new features and enhancements has been published from SeaORM `0.12.2` through `0.12.11`!

## Changelog

### New Features

* [#2037](https://github.com/SeaQL/sea-orm/pull/2037) Added `desc` to `Cursor` paginator
```rust
// After 5 DESC, i.e. id < 5

let mut cursor = Entity::find().cursor_by(Column::Id);

cursor.after(5).desc();

assert_eq!(
    cursor.first(3).all(db).await?,
    [Model { id: 4 }, Model { id: 3 }, Model { id: 2 },]
);
```

* [#2009](https://github.com/SeaQL/sea-orm/pull/2009) [sea-orm-macro] Comment attribute for Entity (`#[sea_orm(comment = "action")]`); `create_table_from_entity` supports comment
```rust
use sea_orm::entity::prelude::*;

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

* [#1881](https://github.com/SeaQL/sea-orm/pull/1881), [#2000](https://github.com/SeaQL/sea-orm/pull/2000) Added "proxy" (feature flag `proxy`) to database backend  
    See [SeaORM Proxy Demo for GlueSQL](https://github.com/SeaQL/sea-orm/tree/master/examples/proxy_gluesql_example) for the usage.

* [#1954](https://github.com/SeaQL/sea-orm/pull/1954) Added `#[sea_orm(skip)]` for `FromQueryResult` derive macro
```rust
#[derive(Clone, Debug, PartialEq, Eq, Deserialize, Serialize, FromQueryResult)]
pub struct PublicUser {
    pub id: i64,
    pub name: String,
    pub username: String,
    pub avatar: String,
    pub group: Group,
    pub banned: bool,
    #[serde(skip_serializing_if = "Vec::is_empty")]
    #[sea_orm(skip)]
    pub connections: UserConnections,
    pub created: DateTimeWithTimeZone,
}
```

* [#1898](https://github.com/SeaQL/sea-orm/pull/1898) Add support for root JSON arrays  
    Now the following works (requires the `json-array` / `postgres-array` feature)!
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

* [#1826](https://github.com/SeaQL/sea-orm/pull/1826) Added `cursor_by` to `SelectTwo`
```rust
assert_eq!(
    bakery::Entity::find()
        .find_also_related(Baker)
        .cursor_by(bakery::Column::Id)
        .before(5)
        .first(20)
        .all(db)
        .await?,
    [
        (bakery(1), Some(baker('A'))),
        (bakery(1), Some(baker('K'))),
        (bakery(1), Some(baker('U'))),
        (bakery(2), Some(baker('B'))),
        (bakery(2), Some(baker('L'))),
        (bakery(2), Some(baker('V'))),
        (bakery(3), Some(baker('C'))),
        (bakery(3), Some(baker('M'))),
        (bakery(3), Some(baker('W'))),
        (bakery(4), Some(baker('D'))),
        (bakery(4), Some(baker('N'))),
        (bakery(4), Some(baker('X'))),
    ]
);
```

### Enhancements

* [#2030](https://github.com/SeaQL/sea-orm/pull/2030) Improve query performance of `Paginator`'s `COUNT` query
* [#2055](https://github.com/SeaQL/sea-orm/pull/2055) Added SQLx slow statements logging to `ConnectOptions`
* [#1867](https://github.com/SeaQL/sea-orm/pull/1867) Added `QuerySelect::lock_with_behavior`
* [#2002](https://github.com/SeaQL/sea-orm/pull/2002) Cast enums in `is_in` and `is_not_in`
* [#1999](https://github.com/SeaQL/sea-orm/pull/1999) Add source annotations to errors
* [#1960](https://github.com/SeaQL/sea-orm/issues/1960) Implement `StatementBuilder` for `sea_query::WithQuery`
* [#1979](https://github.com/SeaQL/sea-orm/pull/1979) Added method `expr_as_` that accepts `self`
* [#1868](https://github.com/SeaQL/sea-orm/pull/1868) Loader: use `ValueTuple` as hash key
* [#1693](https://github.com/SeaQL/sea-orm/pull/1693) [sea-orm-cli] Support generation of related entity with composite foreign key
* [#1598](https://github.com/SeaQL/sea-orm/pull/1598) Added support for Postgres arrays in `FromQueryResult` impl of `JsonValue`

### Bug fixes

* [#2054](https://github.com/SeaQL/sea-orm/pull/2054) [sea-orm-macro] Qualify types in `DeriveValueType` macro
* [#1953](https://github.com/SeaQL/sea-orm/pull/1953) [sea-orm-cli] Fix duplicated active enum use statements on generated entities
* [#1934](https://github.com/SeaQL/sea-orm/pull/1934) [sea-orm-cli] Added `--enum-extra-derives`
* [#1952](https://github.com/SeaQL/sea-orm/pull/1952) [sea-orm-cli] Added `--enum-extra-attributes`
* [#1855](https://github.com/SeaQL/sea-orm/pull/1855) [sea-orm-macro] Fixed `DeriveValueType` by qualifying `QueryResult`
* [#1800](https://github.com/SeaQL/sea-orm/issues/1800) Fixed `find_with_related` consolidation logic
* Fixed `Loader` panic on empty inputs

### Upgrades

* [#1984](https://github.com/SeaQL/sea-orm/pull/1984) Upgraded `axum` example to `0.7`
* [#1858](https://github.com/SeaQL/sea-orm/pull/1858) Upgraded `chrono` to `0.4.30`
* Upgraded `sea-query` to `0.30.5`
* Upgraded `sea-schema` to `0.14.2`
* Upgraded `salvo` to `0.50`

### House Keeping

* [#2057](https://github.com/SeaQL/sea-orm/pull/2057) Fix clippy warnings on 1.75
* [#1811](https://github.com/SeaQL/sea-orm/pull/1811) Added test cases for `find_xxx_related/linked`

## First Stable Release of SeaORM!

> It's been the **12th** release of SeaORM! Initially, a major version was released every month. It gradually became 2 to 3 months, and now, it's been 6 months since the last major release. As our userbase grew and some are already [using SeaORM in production](https://github.com/SeaQL/sea-orm/blob/master/COMMUNITY.md#startups), we understand the importance of having a stable API surface and feature set.
> 
> That's why we are committed to:
> 
> 1. Reviewing breaking changes with strict scrutiny
> 2. Expanding our test suite to cover all features of our library
> 3. Never remove features, and consider deprecation carefully
> 
> Today, the architecture of SeaORM is pretty solid and stable, and with the `0.12` release where we paid back a lot of technical debt, we will be able to deliver new features and enhancements without breaking. As our major dependency [SQLx](https://github.com/launchbadge/sqlx) is not `1.0` yet, technically we cannot be `1.0`.
> 
> We are still advancing rapidly, and we will always make a new release as soon as SQLx makes a new release, so that you can upgrade everything at once. As a result, the next major release of SeaORM will come out **6 months from now, or when SQLx makes a new release**, whichever is earlier.

## [Community Survey](https://www.sea-ql.org/community-survey) 📝

SeaQL is an independent open-source organization. Our goal is to enable developers to build data intensive applications in Rust. If you are using SeaORM, please participate in the [SeaQL Community Survey](https://www.sea-ql.org/community-survey)!

By completing this survey, you will help us gather insights into how you, the developer, are using our libraries and identify means to improve your developer experience. We will also publish an annual survey report to summarize our findings.

If you are a happy user of SeaORM, consider [writing us a testimonial](https://forms.office.com/r/YbeqfTAgkJ)!

## Sponsor 🥇

A big thank to [DigitalOcean](https://www.digitalocean.com/) who sponsored our server hosting, and [JetBrains](https://www.jetbrains.com/) who sponsored our IDE, and every sponsor on [GitHub Sponsor](https://github.com/sponsors/SeaQL)!

If you feel generous, a small donation will be greatly appreciated, and goes a long way towards sustaining the organization.

A big shout out to our sponsors 😇:

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
Stick them on your laptop, notebook, or any gadget to show off your love for coding!

Moreover, all proceeds contributes directly to the ongoing development of SeaQL projects.

Sticker Pack Contents:
- Logo of SeaQL projects: SeaQL, SeaORM, SeaQuery, Seaography, FireDBG
- Mascot of SeaQL: Terres the Hermit Crab
- Mascot of Rust: Ferris the Crab
- The Rustacean word

[Support SeaQL and get a Sticker Pack!](https://www.sea-ql.org/sticker-pack/)

<a href="https://www.sea-ql.org/sticker-pack/"><img style={{borderRadius: "25px"}} alt="Rustacean Sticker Pack by SeaQL" src="https://www.sea-ql.org/static/sticker-pack-1s.jpg" /></a>
