---
slug: 2024-07-25-whats-new-in-seaorm-1.0
title: What's new in SeaORM 1.0
author: SeaQL Team
author_title: Chris Tsang
author_url: https://github.com/SeaQL
author_image_url: https://www.sea-ql.org/blog/img/SeaQL.png
image: https://www.sea-ql.org/blog/img/SeaORM%201.0%20Banner.png
tags: [news]
---

<img alt="SeaORM 1.0 Banner" src="/blog/img/SeaORM%201.0%20Banner.png"/>

🎉 We are pleased to release SeaORM [`1.0`](https://github.com/SeaQL/sea-orm/releases/tag/1.0)!

This blog post summarizes the new features and enhancements introduced in SeaORM `1.0`:

## New Features

### Refreshed migration schema definition

[#2099](https://github.com/SeaQL/sea-orm/pull/2099) We are aware that SeaORM's migration scripts can sometimes look verbose. Thanks to the clever design made by Loco, we've refreshed the schema definition syntax.

An old migration script looks like this:

```rust
#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Users::Table)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Users::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Users::Pid).uuid().not_null())
                    .col(ColumnDef::new(Users::Email).string().not_null().unique_key())
                    // ...
    }
}
```

Now, using the new schema helpers, you can define the schema with a simplified syntax!

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

There are three variants for each commonly used column type:

- `<COLUMN_TYPE>()` helper function, e.g. `string()`, define a non-null string column
- `<COLUMN_TYPE>_null()` helper function, e.g. `string_null()`, define a nullable string column
- `<COLUMN_TYPE>_uniq()` helper function, e.g. `string_uniq()`, define a non-null and unique string column

The new schema helpers can be used by importing `sea_orm_migration::schema::*`. The migration library is fully backward compatible, so there is no rush to migrate old scripts. The new syntax is recommended for new scripts, and all examples in the SeaORM repository have been updated for demonstration. For advanced use cases, the old SeaQuery syntax can still be used.

### Reworked SQLite Type Mappings

[sea-orm#2077](https://github.com/SeaQL/sea-orm/pull/2077) [sea-query#735](https://github.com/SeaQL/sea-query/pull/735) [sea-schema#117](https://github.com/SeaQL/sea-schema/pull/117) We've reworked the type mappings for SQLite across the SeaQL ecosystem, such that SeaQuery and SeaSchema are now reciprocal to each other. Migrations written with SeaQuery can be rediscovered by `sea-orm-cli` and generate compatible entities! In other words, the roundtrip is complete.

Data types will be mapped to SQLite types with a custom naming scheme following SQLite's affinity rule:

* `INTEGER`: `integer`, `tiny_integer`, `small_integer`, `big_integer` and `boolean` are stored as `integer`
* `REAL`: `float`, `double`, `decimal` and `money` are stored as `real`
* `BLOB`: `blob` and `varbinary_blob` are stored as `blob`
* `TEXT`: all other data types are stored as `text`, including `string`, `char`, `text`, `json`, `uuid`, `date`, `time`, `datetime`, `timestamp`, etc.

To illustrate,

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
        r#"CREATE TABLE "strange" ("#,
            r#""id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,"#,
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

The full type mapping table is [documented here](https://docs.rs/sea-query/0.31.0-rc.4/sea_query/table/enum.ColumnType.html):

| ColumnType            | MySQL data type   | PostgreSQL data type        | SQLite data type             |
|-----------------------|-------------------|-----------------------------|------------------------------|
| Char                  | char              | char                        | char                         |
| String                | varchar           | varchar                     | varchar                      |
| Text                  | text              | text                        | text                         |
| TinyInteger           | tinyint           | smallint                    | tinyint                      |
| SmallInteger          | smallint          | smallint                    | smallint                     |
| Integer               | int               | integer                     | integer                      |
| BigInteger            | bigint            | bigint                      | integer                      |
| TinyUnsigned          | tinyint unsigned  | smallint                    | tinyint                      |
| SmallUnsigned         | smallint unsigned | smallint                    | smallint                     |
| Unsigned              | int unsigned      | integer                     | integer                      |
| BigUnsigned           | bigint unsigned   | bigint                      | integer                      |
| Float                 | float             | real                        | float                        |
| Double                | double            | double precision            | double                       |
| Decimal               | decimal           | decimal                     | real                         |
| DateTime              | datetime          | timestamp without time zone | datetime_text                |
| Timestamp             | timestamp         | timestamp                   | timestamp_text               |
| TimestampWithTimeZone | timestamp         | timestamp with time zone    | timestamp_with_timezone_text |
| Time                  | time              | time                        | time_text                    |
| Date                  | date              | date                        | date_text                    |
| Year                  | year              | N/A                         | N/A                          |
| Interval              | N/A               | interval                    | N/A                          |
| Binary                | binary            | bytea                       | blob                         |
| VarBinary             | varbinary         | bytea                       | varbinary_blob               |
| Bit                   | bit               | bit                         | N/A                          |
| VarBit                | bit               | varbit                      | N/A                          |
| Boolean               | bool              | bool                        | boolean                      |
| Money                 | decimal           | money                       | real_money                   |
| Json                  | json              | json                        | json_text                    |
| JsonBinary            | json              | jsonb                       | jsonb_text                   |
| Uuid                  | binary(16)        | uuid                        | uuid_text                    |
| Enum                  | ENUM(...)         | ENUM_NAME                   | enum_text                    |
| Array                 | N/A               | DATA_TYPE[]                 | N/A                          |
| Cidr                  | N/A               | cidr                        | N/A                          |
| Inet                  | N/A               | inet                        | N/A                          |
| MacAddr               | N/A               | macaddr                     | N/A                          |
| LTree                 | N/A               | ltree                       | N/A                          |

### Introduce `PrimaryKeyArity` with `ARITY` Constant

[#2185](https://github.com/SeaQL/sea-orm/pull/2185) Introduce `PrimaryKeyArity` with `ARITY` constant

```rust
fn get_arity_of<E: EntityTrait>() -> usize {
    E::PrimaryKey::iter().count() // before; runtime
    <<E::PrimaryKey as PrimaryKeyTrait>::ValueType as PrimaryKeyArity>::ARITY // now; compile-time
}
```

### Associate `ActiveModel` to `EntityTrait`

[#2186](https://github.com/SeaQL/sea-orm/pull/2186) Associate `ActiveModel` to `EntityTrait`

```diff
pub trait EntityTrait: EntityName {
    type Model: ModelTrait<Entity = Self> + FromQueryResult;

+   type ActiveModel: ActiveModelBehavior<Entity = Self>;

    type Column: ColumnTrait;

    type Relation: RelationTrait;

    type PrimaryKey: PrimaryKeyTrait + PrimaryKeyToColumn<Column = Self::Column>;

    // ...
}
```

### Auto Generated ActiveEnum String Values and Model Column Names

[#2170](https://github.com/SeaQL/sea-orm/pull/2170) Added `rename_all` attribute to `DeriveEntityModel` & `DeriveActiveEnum`

```rust
#[derive(DeriveEntityModel)]
#[sea_orm(table_name = "user", rename_all = "camelCase")]
pub struct Model {
    #[sea_orm(primary_key)]
    id: i32,
    first_name: String, // firstName
    #[sea_orm(column_name = "lAsTnAmE")]
    last_name: String, // lAsTnAmE
}

#[derive(EnumIter, DeriveActiveEnum)]
#[sea_orm(rs_type = "String", db_type = "String(StringLen::None)", rename_all = "camelCase")]
pub enum TestEnum {
    DefaultVariant, // defaultVariant
    #[sea_orm(rename = "kebab-case")]
    VariantKebabCase, // variant-kebab-case
    #[sea_orm(rename = "snake_case")]
    VariantSnakeCase, // variant_snake_case
    #[sea_orm(string_value = "CuStOmStRiNgVaLuE")]
    CustomStringValue, // CuStOmStRiNgVaLuE
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

* Added `QuerySelect::tbl_col_as`
* [#2256](https://github.com/SeaQL/sea-orm/pull/2256)Added non-TLS runtime
* [#2244](https://github.com/SeaQL/sea-orm/pull/2244)Added `Insert::on_conflict_do_nothing`
* [#2255](https://github.com/SeaQL/sea-orm/pull/2255)Migration schema nullable column set NULL explicitly
* [#2194](https://github.com/SeaQL/sea-orm/pull/2194)Added `ActiveValue::set_if_not_equals()`
* [#2197](https://github.com/SeaQL/sea-orm/pull/2197)Added `ActiveValue::try_as_ref()`
* [#2228](https://github.com/SeaQL/sea-orm/pull/2228)Added `QuerySelect::order_by_with_nulls`
* [#2233](https://github.com/SeaQL/sea-orm/pull/2233)Expose `get_xxx_connection_pool` by default
* [#2148](https://github.com/SeaQL/sea-orm/pull/2148) Added `QueryResult::column_names`
* [#2199](https://github.com/SeaQL/sea-orm/pull/2199) [sea-orm-macro] Add `@generated` in generated code
* [#1665](https://github.com/SeaQL/sea-orm/pull/1665) [sea-orm-macro] Qualify traits in `DeriveActiveModel` macro
* [#2064](https://github.com/SeaQL/sea-orm/pull/2064) [sea-orm-cli] Fix `migrate generate` on empty `mod.rs` files

## Breaking Changes

* [#2145](https://github.com/SeaQL/sea-orm/pull/2145) Renamed `ConnectOptions::pool_options()` to `ConnectOptions::sqlx_pool_options()`
* [#2145](https://github.com/SeaQL/sea-orm/pull/2145) Made `sqlx_common` private, hiding `sqlx_error_to_xxx_err`
* [#2077](https://github.com/SeaQL/sea-orm/pull/2077), [#2078](https://github.com/SeaQL/sea-orm/pull/2078) Rework SQLite type mappings
* MySQL `money` type maps to `decimal`
* MySQL `blob` types moved to `extension::mysql::MySqlType`; `ColumnDef::blob()` now takes no parameters
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
* `ColumnDef::binary()` sets column type as `binary` with default length of `1`
* Removed `BlobSize` enum
* Added `StringLen` to represent length of `varchar` / `varbinary`
```rust
/// Length for var-char/binary; default to 255
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
* `Value::Decimal` and `Value::BigDecimal` map to `real` for SQLite
* `ColumnType::Year(Option<MySqlYear>)` changed to `ColumnType::Year`

## Bug Fixes

* [#2241](https://github.com/SeaQL/sea-orm/pull/2241) Set schema search path in Postgres without enclosing single quote
* [#2254](https://github.com/SeaQL/sea-orm/pull/2254) [sea-orm-cli] Generate `has_one` relation for foreign key of unique index / constraint

## Upgrades

* [#2267](https://github.com/SeaQL/sea-orm/pull/2267) Upgrade `time` to `0.3.36`
* [#2088](https://github.com/SeaQL/sea-orm/pull/2088) Upgrade `strum` to `0.26`
* Upgrade `sea-schema` to `0.15.0`
* Upgrade `sea-query-binder` to `0.6.0`
* Upgrade `sea-query` to `0.31.0`

## House Keeping

* [#2177](https://github.com/SeaQL/sea-orm/pull/2177) Reduce warnings in integration tests
* [#2140](https://github.com/SeaQL/sea-orm/pull/2140) Improved Actix example to return 404 not found on unexpected inputs
* [#2154](https://github.com/SeaQL/sea-orm/pull/2154) Deprecated Actix v3 example
* [#2136](https://github.com/SeaQL/sea-orm/pull/2136) Re-enabled `rocket_okapi` example


## Release Planning

After the stablization, we hope that SeaORM can offer a stable API surface that developers can use in production for the years to come.

We'd not have more than 2 major releases in a year, and each major release will be maintained for at least 1 year. It's still tentative, but that's what we have in mind for now. Moreoever, it will actually allow us to ship new features more frequently!

## SQL Server Support

We've been planning [SQL Server for SeaORM](https://www.sea-ql.org/SeaORM-X/) for a while, but it was put aside in 2023 (which I regretted). Anyway SQL Server support is coming soon! It will first be offered as a closed beta to our partners. If you are interested, please join our [waiting list](https://forms.office.com/r/1MuRPJmYBR).

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
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/trevormerritt">
                <img src="https://avatars.githubusercontent.com/u/3418965?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Trevor Merritt
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
                    Naoki Ikeguchi
                </div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/data-intuitive">
                <img src="https://avatars.githubusercontent.com/u/15045722?v=4" />
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
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/anshap1719">
                <img src="https://avatars.githubusercontent.com/u/19164745?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Anshul Sanghi
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
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/ellik159">
                <img src="https://avatars.githubusercontent.com/u/46644287?v=4" />
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
