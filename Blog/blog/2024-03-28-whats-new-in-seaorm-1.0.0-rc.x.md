---
slug: 2024-03-28-whats-new-in-seaorm-1.0.0-rc.x
title: What's new in SeaORM 1.0.0-rc.x
author: SeaQL Team
author_title: Chris Tsang
author_url: https://github.com/SeaQL
author_image_url: https://www.sea-ql.org/blog/img/SeaQL.png
tags: [news]
---

## Celebrating 2.6M downloads on crates.io 📦

We've just reached the milestone of 2,600,000 all time downloads on [crates.io](https://crates.io/crates/sea-orm). It's a testament to SeaORM's adoption in professional use. Thank you to all our users for your trust and for being a part of our community.

## New Features

### Migration Schema Helper

[#2099](https://github.com/SeaQL/sea-orm/pull/2099) Schema helpers were added to the migration. Using shorthand to define common column types, there are three variants for each common column types:
- `<COLUMN_TYPE>()` helper function, e.g. `string()`, define a non-null string column
- `<COLUMN_TYPE>_null()` helper function, e.g. `string_null()`, define a nullable string column
- `<COLUMN_TYPE>_uniq()` helper function, e.g. `string_uniq()`, define a non-null and unique string column

```rust
// Remember to import `sea_orm_migration::schema::*`
use sea_orm_migration::{prelude::*, schema::*};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Users::Table)
                    .if_not_exists()
                    .col(pk_auto(Users::Id)) // Primary key with auto-increment
                    .col(uuid(Users::Pid)) // UUID column
                    .col(string_uniq(Users::Email)) // String column with unique and not null constraint
                    .col(string(Users::Password)) // String column
                    .col(string(Users::ApiKey).unique_key())
                    .col(string(Users::Name))
                    .col(string_null(Users::ResetToken)) // Nullable string column
                    .col(timestamp_null(Users::ResetSentAt)) // Nullable timestamp column
                    .col(string_null(Users::EmailVerificationToken))
                    .col(timestamp_null(Users::EmailVerificationSentAt))
                    .col(timestamp_null(Users::EmailVerifiedAt))
                    .to_owned(),
            )
            .await
    }

    // ...
}
```

## Enhancements

* [#2137](https://github.com/SeaQL/sea-orm/pull/2137) `DerivePartialModel` macro attribute `entity` now supports `syn::Type`
```rust
#[derive(DerivePartialModel)]
#[sea_orm(entity = "<entity::Model as ModelTrait>::Entity")]
struct EntityNameNotAIdent {
    #[sea_orm(from_col = "foo2")]
    _foo: i32,
    #[sea_orm(from_col = "bar2")]
    _bar: String,
}
```

* [#2146](https://github.com/SeaQL/sea-orm/pull/2146) Added `RelationDef::from_alias()`
```rust
assert_eq!(
    cake::Entity::find()
        .join_as(
            JoinType::LeftJoin,
            cake_filling::Relation::Cake.def().rev(),
            cf.clone()
        )
        .join(
            JoinType::LeftJoin,
            cake_filling::Relation::Filling.def().from_alias(cf)
        )
        .build(DbBackend::MySql)
        .to_string(),
    [
        "SELECT `cake`.`id`, `cake`.`name` FROM `cake`",
        "LEFT JOIN `cake_filling` AS `cf` ON `cake`.`id` = `cf`.`cake_id`",
        "LEFT JOIN `filling` ON `cf`.`filling_id` = `filling`.`id`",
    ]
    .join(" ")
);
```

* [#1665](https://github.com/SeaQL/sea-orm/pull/1665) [sea-orm-macro] Qualify traits in `DeriveActiveModel` macro
* [#2064](https://github.com/SeaQL/sea-orm/pull/2064) [sea-orm-cli] Fix `migrate generate` on empty `mod.rs` files

## Breaking Changes

### SeaORM

* [#2088](https://github.com/SeaQL/sea-orm/pull/2088) Updated Strum to version 0.26
* [#2145](https://github.com/SeaQL/sea-orm/pull/2145) Renamed `ConnectOptions::pool_options()` to `ConnectOptions::sqlx_pool_options()`
* [#2145](https://github.com/SeaQL/sea-orm/pull/2145) Made `sqlx_common` private, hiding `sqlx_error_to_xxx_err`

### SeaQuery

* [#2077](https://github.com/SeaQL/sea-orm/pull/2077), [#2078](https://github.com/SeaQL/sea-orm/pull/2078) Rework SQLite type mapping
```rust
assert_eq!(
    Table::create()
        .table(Alias::new("strange"))
        .col(ColumnDef::new(Alias::new("id")).integer().not_null().auto_increment().primary_key())
        .col(ColumnDef::new(Alias::new("int1")).integer())
        .col(ColumnDef::new(Alias::new("int2")).tiny_integer())
        .col(ColumnDef::new(Alias::new("int3")).small_integer())
        .col(ColumnDef::new(Alias::new("int4")).big_integer())
        .col(ColumnDef::new(Alias::new("string1")).string())
        .col(ColumnDef::new(Alias::new("string2")).string_len(24))
        .col(ColumnDef::new(Alias::new("char1")).char())
        .col(ColumnDef::new(Alias::new("char2")).char_len(24))
        .col(ColumnDef::new(Alias::new("text_col")).text())
        .col(ColumnDef::new(Alias::new("json_col")).json())
        .col(ColumnDef::new(Alias::new("uuid_col")).uuid())
        .col(ColumnDef::new(Alias::new("decimal1")).decimal())
        .col(ColumnDef::new(Alias::new("decimal2")).decimal_len(12, 4))
        .col(ColumnDef::new(Alias::new("money1")).money())
        .col(ColumnDef::new(Alias::new("money2")).money_len(12, 4))
        .col(ColumnDef::new(Alias::new("float_col")).float())
        .col(ColumnDef::new(Alias::new("double_col")).double())
        .col(ColumnDef::new(Alias::new("date_col")).date())
        .col(ColumnDef::new(Alias::new("time_col")).time())
        .col(ColumnDef::new(Alias::new("datetime_col")).date_time())
        .col(ColumnDef::new(Alias::new("boolean_col")).boolean())
        .col(ColumnDef::new(Alias::new("binary2")).binary_len(1024))
        .col(ColumnDef::new(Alias::new("binary3")).var_binary(1024))
        .to_string(SqliteQueryBuilder),
    [
        r#"CREATE TABLE "strange" ( "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,"#,
            r#""int1" integer,"#,
            r#""int2" tinyint,"#,
            r#""int3" smallint,"#,
            r#""int4" bigint,"#,
            r#""string1" varchar,"#,
            r#""string2" varchar(24),"#,
            r#""char1" char,"#,
            r#""char2" char(24),"#,
            r#""text_col" text,"#,
            r#""json_col" json_text,"#,
            r#""uuid_col" uuid_text,"#,
            r#""decimal1" real,"#,
            r#""decimal2" real(12, 4),"#,
            r#""money1" real_money,"#,
            r#""money2" real_money(12, 4),"#,
            r#""float_col" float,"#,
            r#""double_col" double,"#,
            r#""date_col" date_text,"#,
            r#""time_col" time_text,"#,
            r#""datetime_col" datetime_text,"#,
            r#""boolean_col" boolean,"#,
            r#""binary2" blob(1024),"#,
            r#""binary3" varbinary_blob(1024)"#,
        r#")"#,
    ]
    .join(" ")
);
```
* MySQL money type maps to decimal
* MySQL blob types moved to `extension::mysql::MySqlType`; `ColumnDef::blob()` now takes no parameters
```rust
assert_eq!(
    Table::create()
        .table(BinaryType::Table)
        .col(ColumnDef::new(BinaryType::BinaryLen).binary_len(32))
        .col(ColumnDef::new(BinaryType::Binary).binary())
        .col(ColumnDef::new(BinaryType::Blob).custom(MySqlType::Blob))
        .col(ColumnDef::new(BinaryType::TinyBlob).custom(MySqlType::TinyBlob))
        .col(ColumnDef::new(BinaryType::MediumBlob).custom(MySqlType::MediumBlob))
        .col(ColumnDef::new(BinaryType::LongBlob).custom(MySqlType::LongBlob))
        .to_string(MysqlQueryBuilder),
    [
        "CREATE TABLE `binary_type` (",
            "`binlen` binary(32),",
            "`bin` binary(1),",
            "`b` blob,",
            "`tb` tinyblob,",
            "`mb` mediumblob,",
            "`lb` longblob",
        ")",
    ]
    .join(" ")
);
```
* `ColumnDef::binary()` set column type as binary with default length of 1
* Removed `BlobSize` enum
* Added `StringLen` to represent length of var-char/binary
```rust
/// Length for var-char/binary; default to 255
#[derive(Debug, Default, Clone, Copy, PartialEq, Eq)]
pub enum StringLen {
    /// String size
    N(u32),
    Max,
    #[default]
    None,
}
```
* `ValueType::columntype()` of `Vec<u8>` maps to `VarBinary(StringLen::None)`
* `ValueType::columntype()` of `String` maps to `String(StringLen::None)`
* `ColumnType::Bit` maps to `bit` for Postgres
* `ColumnType::Binary` and `ColumnType::VarBinary` map to `bytea` for Postgres
* `Value::Decimal` and `Value::BigDecimal` bind as `real` for SQLite
* `ColumnType::Year(Option<MySqlYear>)` changed to `ColumnType::Year`

### SeaSchema

* `SchemaProbe::query_tables(..)` changed to `SchemaProbe::query_tables(&self, ..)`
* `SchemaProbe::has_table(..)` changed to `SchemaProbe::has_table(&self, ..)`
* `SchemaProbe::has_column(..)` changed to `SchemaProbe::has_column(&self, ..)`
* `SchemaProbe::has_index(..)` changed to `SchemaProbe::has_index(&self, ..)`

## Upgrades

* Upgrade `sea-query` to `0.31.0-rc.3`
* Upgrade `sea-query-binder` to `0.6.0-rc.1`
* Upgrade `sea-schema` to `0.15.0-rc.4`

## House Keeping

* [#2140](https://github.com/SeaQL/sea-orm/pull/2140) Improved Actix example to return 404 not found on unexpected inputs
* [#2154](https://github.com/SeaQL/sea-orm/pull/2154) Deprecated Actix v3 example
* [#2136](https://github.com/SeaQL/sea-orm/pull/2136) Re-enabled `rocket_okapi` example

## Release planning

In the [announcement blog post](https://www.sea-ql.org/blog/2023-08-12-announcing-seaorm-0.12/) of SeaORM 0.12, we stated we want to reduce the frequency of breaking releases while maintaining the pace for feature updates and enhancements. I am glad to say we've accomplished that!

There are still a few breaking changes planned for the 1.0 major release. After some [discussions](https://github.com/SeaQL/sea-orm/discussions/2031) and consideration, we decided that the next major release will be a release candidate for 1.0!

## Sponsor

If you feel generous, a small donation will be greatly appreciated, and goes a long way towards sustaining the organization.

A big shout out to our [sponsors](https://github.com/sponsors/SeaQL) 😇:

#### Gold Sponsors

<a href="https://osmos.io/">
    <img src="https://www.sea-ql.org/static/sponsors/Osmos.svg#light" width="238" />
    <img src="https://www.sea-ql.org/static/sponsors/Osmos-dark.svg#dark" width="238" />
</a>

#### GitHub Sponsors

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
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/reneklacan">
                <img src="https://avatars.githubusercontent.com/u/1935686?v=4" />
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
                <img src="https://avatars.githubusercontent.com/u/2698243?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Apinan I.
                </div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/ktanaka101">
                <img src="https://avatars.githubusercontent.com/u/10344925?v=4" />
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
                <img src="https://avatars.githubusercontent.com/u/12772118?v=4" />
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
                <img src="https://avatars.githubusercontent.com/u/16762461?v=4" />
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
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/dsgallups">
                <img src="https://avatars.githubusercontent.com/u/44790295?v=4" />
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
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/caido">
                <img src="https://avatars.githubusercontent.com/u/78991750?v=4" />
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
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/Coolpany-SE">
                <img src="https://avatars.githubusercontent.com/u/96304487?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Coolpany SE
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
