---
slug: 2023-07-11-whats-new-in-seaorm-0.12.0
title: What's new in SeaORM 0.12.0
author: SeaQL Team
author_title: Chris Tsang
author_url: https://github.com/SeaQL
author_image_url: https://www.sea-ql.org/SeaORM/img/SeaQL.png
tags: [news]
---

🎉 We are pleased to release SeaORM [`0.12.0`](https://github.com/SeaQL/sea-orm/releases/tag/0.12.0)!

## `DeriveValueType` for Custom Wrapper Type

[[#1720](https://github.com/SeaQL/sea-orm/pull/1720)] `DeriveValueType` derive macro will implements the required traits of custom wrapper type.

```rust
// You can customize the `column_type` and `array_type` if needed
#[derive(DeriveValueType)]
#[sea_orm(array_type = "Int")]
pub struct Integer(i32);

#[derive(DeriveValueType)]
#[sea_orm(column_type = "Boolean", array_type = "Bool")]
pub struct Boolbean(pub String);

// Or, leave it as default

#[derive(DeriveValueType)]
pub struct StringVec(pub Vec<String>);

// The `DeriveValueType` will be expanded into...

impl From<StringVec> for Value {
    fn from(source: StringVec) -> Self {
        source.0.into()
    }
}

impl sea_orm::TryGetable for StringVec {
    fn try_get_by<I: sea_orm::ColIdx>(res: &QueryResult, idx: I) -> Result<Self, sea_orm::TryGetError> {
        <Vec<String> as sea_orm::TryGetable>::try_get_by(res, idx).map(|v| StringVec(v))
    }
}

impl sea_orm::sea_query::ValueType for StringVec {
    fn try_from(v: Value) -> Result<Self, sea_orm::sea_query::ValueTypeErr> {
        <Vec<String> as sea_orm::sea_query::ValueType>::try_from(v).map(|v| StringVec(v))
    }

    fn type_name() -> String {
        stringify!(StringVec).to_owned()
    }

    fn array_type() -> sea_orm::sea_query::ArrayType {
        std::convert::Into::<sea_orm::sea_query::ArrayType>::into(
            <Vec<String> as sea_orm::sea_query::ValueType>::array_type()
        )
    }

    fn column_type() -> sea_orm::sea_query::ColumnType {
        std::convert::Into::<sea_orm::sea_query::ColumnType>::into(
            <Vec<String> as sea_orm::sea_query::ValueType>::column_type()
        )
    }
}
```

## `DerivePartialModel` for Querying Partial Model

[[#1597](https://github.com/SeaQL/sea-orm/pull/1597)] `DerivePartialModel` derive macro helps you query partial model. You can customize the field mapping with `from_col` and `from_expr` attributes.

```rust
#[derive(DerivePartialModel, FromQueryResult)]
#[sea_orm(entity = "Cake")]
struct PartialCake {
    name: String,
    #[sea_orm(from_expr = r#"SimpleExpr::FunctionCall(Func::upper(Expr::col((Cake, cake::Column::Name))))"#)]
    name_upper: String,
}

assert_eq!(
    cake::Entity::find()
        .into_partial_model::<PartialCake>()
        .into_statement(DbBackend::Sqlite)
        .to_string(),
    r#"SELECT "cake"."name", UPPER("cake"."name") AS "name_upper" FROM "cake""#
);
```

## `DeriveDisplay` for Active Enum

[[#1726](https://github.com/SeaQL/sea-orm/pull/1726)] Add `DeriveDisplay` derive macro to implements `std::fmt::Display` for active enum.

```rust
// String enum
#[derive(EnumIter, DeriveActiveEnum, DeriveDisplay)]
#[sea_orm(rs_type = "String", db_type = "String(Some(1))", enum_name = "category")]
pub enum DeriveCategory {
    #[sea_orm(string_value = "B")]
    Big,
    #[sea_orm(string_value = "S")]
    Small,
}
assert_eq!(format!("{}", DeriveCategory::Big), "Big");
assert_eq!(format!("{}", DeriveCategory::Small), "Small");

// Numeric enum
#[derive(EnumIter, DeriveActiveEnum, DeriveDisplay)]
#[sea_orm(rs_type = "i32", db_type = "Integer")]
pub enum $ident {
    #[sea_orm(num_value = -10)]
    Negative,
    #[sea_orm(num_value = 1)]
    Big,
    #[sea_orm(num_value = 0)]
    Small,
}
assert_eq!(format!("{}", $ident::Big), "Big");
assert_eq!(format!("{}", $ident::Small), "Small");
assert_eq!(format!("{}", $ident::Negative), "Negative");

// String enum with `display_value` overrides
#[derive(EnumIter, DeriveActiveEnum, DeriveDisplay)]
#[sea_orm(rs_type = "String", db_type = "Enum", enum_name = "tea")]
pub enum DisplayTea {
    #[sea_orm(string_value = "EverydayTea", display_value = "Everyday")]
    EverydayTea,
    #[sea_orm(string_value = "BreakfastTea", display_value = "Breakfast")]
    BreakfastTea,
}
assert_eq!(format!("{}", DisplayTea::BreakfastTea), "Breakfast");
assert_eq!(format!("{}", DisplayTea::EverydayTea), "Everyday");
```

## Matching Common Database Errors

[[#1707](https://github.com/SeaQL/sea-orm/pull/1707)] Add `DbErr::sql_err()` method to convert error into common database errors `SqlErr`, such as unique constraint or foreign key violation errors.

```rust
assert!(matches!(
    cake
        .into_active_model()
        .insert(db)
        .await
        .expect_err("Insert a row with duplicated primary key")
        .sql_err(),
    Some(SqlErr::UniqueConstraintViolation(_))
));

assert!(matches!(
    fk_cake
        .insert(db)
        .await
        .expect_err("Insert a row with invalid foreign key")
        .sql_err(),
    Some(SqlErr::ForeignKeyConstraintViolation(_))
));
```

## Find with Linked API

[[#1728](https://github.com/SeaQL/sea-orm/pull/1728)], [[#1743](https://github.com/SeaQL/sea-orm/pull/1743)] Add `Select::find_with_linked` method, similar to the `find_with_related` method.

```rust
fn find_with_related<R>(self, r: R) -> SelectTwoMany<E, R>
where 
    R: EntityTrait,
    E: Related<R>

fn find_with_linked<L, T>(self, l: L) -> SelectTwoMany<E, T>
where
    L: Linked<FromEntity = E, ToEntity = T>,
    T: EntityTrait

// both yields `Vec<(E::Model, Vec<F::Model>)>`
```

## Helper Methods to Append Select Expression

[[#1702](https://github.com/SeaQL/sea-orm/pull/1702)] Add `expr`, `exprs` and `expr_as` methods to `QuerySelect` trait.

```rust
use sea_orm::sea_query::Expr;
use sea_orm::{entity::*, tests_cfg::cake, DbBackend, QuerySelect, QueryTrait};

assert_eq!(
    cake::Entity::find()
        .select_only()
        .expr(Expr::col((cake::Entity, cake::Column::Id)))
        .build(DbBackend::MySql)
        .to_string(),
    "SELECT `cake`.`id` FROM `cake`"
);

assert_eq!(
    cake::Entity::find()
        .select_only()
        .exprs([
            Expr::col((cake::Entity, cake::Column::Id)),
            Expr::col((cake::Entity, cake::Column::Name)),
        ])
        .build(DbBackend::MySql)
        .to_string(),
    "SELECT `cake`.`id`, `cake`.`name` FROM `cake`"
);

assert_eq!(
    cake::Entity::find()
        .expr_as(
            Func::upper(Expr::col((cake::Entity, cake::Column::Name))),
            "name_upper"
        )
        .build(DbBackend::MySql)
        .to_string(),
    "SELECT `cake`.`id`, `cake`.`name`, UPPER(`cake`.`name`) AS `name_upper` FROM `cake`"
);
```

## Construct Chained AND / OR Join On Condition

[[#1433](https://github.com/SeaQL/sea-orm/pull/1433)] Added option to construct chained AND / OR join on condition.

```rust
use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "cake")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    #[sea_orm(column_name = "name", enum_name = "Name")]
    pub name: String,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    // By default, it's
    // `JOIN `fruit` ON `cake`.`id` = `fruit`.`cake_id` AND `fruit`.`name` LIKE '%tropical%'`
    #[sea_orm(
        has_many = "super::fruit::Entity",
        on_condition = r#"super::fruit::Column::Name.like("%tropical%")"#
    )]
    TropicalFruit,
    // Or specify `condition_type = "any"` to override it,
    // `JOIN `fruit` ON `cake`.`id` = `fruit`.`cake_id` OR `fruit`.`name` LIKE '%tropical%'`
    #[sea_orm(
        has_many = "super::fruit::Entity",
        on_condition = r#"super::fruit::Column::Name.like("%tropical%")"#
        condition_type = "any",
    )]
    OrTropicalFruit,
}

impl ActiveModelBehavior for ActiveModel {}
```

## `DeriveEntityRelated` for Seaography to Query Related Entity

[[#1599](https://github.com/SeaQL/sea-orm/pull/1599)] The `DeriveRelatedEntity` derive macro will implement `seaography::RelationBuilder` for `RelatedEntity` enumeration when the `seaography` feature is enabled.

```rust
/// ... Entity File ...

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelatedEntity)]
pub enum RelatedEntity {
    #[sea_orm(entity = "super::address::Entity")]
    Address,
    #[sea_orm(entity = "super::payment::Entity")]
    Payment,
    #[sea_orm(entity = "super::rental::Entity")]
    Rental,
    #[sea_orm(entity = "Entity", def = "Relation::SelfRef.def()")]
    SelfRef,
    #[sea_orm(entity = "super::store::Entity")]
    Store,
    #[sea_orm(entity = "Entity", def = "Relation::SelfRef.def().rev()")]
    SelfRefRev,
}
```

## Supports `default_expr` in `DeriveEntityModel`

[[#1474](https://github.com/SeaQL/sea-orm/pull/1474)] You can now set `default_expr` in model.

```rust
#[derive(DeriveEntityModel)]
#[sea_orm(table_name = "hello")]
pub struct Model {
    #[sea_orm(default_expr = "Expr::current_timestamp()")]
    pub timestamp: DateTimeUtc,
}

assert_eq!(
    Column::Timestamp.def(),
    ColumnType::TimestampWithTimeZone.def().default(Expr::current_timestamp())
);
```

## `ConnAcquireErr` for Fine Grained Connection Error

[[#1737](https://github.com/SeaQL/sea-orm/pull/1737)] Definition of `DbErr::ConnectionAcquire` changed to `ConnectionAcquire(ConnAcquireErr)`, providing more fine grained connection error.

```rust
enum DbErr {
    ConnectionAcquire(ConnAcquireErr),
    ..
}

enum ConnAcquireErr {
    Timeout,
    ConnectionClosed,
}
```

## Upgrades

* [[#1520](https://github.com/SeaQL/sea-orm/pull/1520)], [[#1544](https://github.com/SeaQL/sea-orm/pull/1544)] Upgrade `heck` dependency in `sea-orm-macros` and `sea-orm-codegen` to 0.4
* [[#1752](https://github.com/SeaQL/sea-orm/pull/1752)] Upgrade `strum` to 0.25
* [[#1562](https://github.com/SeaQL/sea-orm/pull/1562)] Upgrade `sea-query` to 0.29
* [[#1562](https://github.com/SeaQL/sea-orm/pull/1562)] Upgrade `sea-query-binder` to 0.4
* [[#1562](https://github.com/SeaQL/sea-orm/pull/1562)] Upgrade `sea-schema` to 0.12
* [[#1468](https://github.com/SeaQL/sea-orm/pull/1468)] Upgrade `clap` to 4.3
* [[#1742](https://github.com/SeaQL/sea-orm/pull/1742)] Upgrade `sqlx` to 0.7
* [[#1739](https://github.com/SeaQL/sea-orm/pull/1739)] Replace `bae` with `sea-bae`

## Breaking Changes

* [[#1513](https://github.com/SeaQL/sea-orm/pull/1513)] Supports for partial select of `Option<T>` model field. A `None` value will be filled when the select result does not contain the `Option<T>` field instead of throwing an error.
* [[#1535](https://github.com/SeaQL/sea-orm/pull/1535)] Replaced `sea-strum` dependency with upstream `strum` in `sea-orm`
    * Added `derive` and `strum` features to `sea-orm-macros`
    * The derive macro `EnumIter` is now shipped by `sea-orm-macros`
* [[#1508](https://github.com/SeaQL/sea-orm/pull/1508)] Added a new variant `Many` to `Identity`
* [[#1661](https://github.com/SeaQL/sea-orm/pull/1661)] Replace the use of `SeaRc<T>` where `T` isn't `dyn Iden` with `RcOrArc<T>`
* [[#1728](https://github.com/SeaQL/sea-orm/pull/1728)], [[#1743](https://github.com/SeaQL/sea-orm/pull/1743)] Enabled `hashable-value` feature in SeaQuery, thus `Value::Float(NaN) == Value::Float(NaN)` would be true
* [[#1726](https://github.com/SeaQL/sea-orm/pull/1726)] The `DeriveActiveEnum` derive macro no longer provide `std::fmt::Display` implementation for the enum. You need to derive an extra `DeriveDisplay` macro alongside with `DeriveActiveEnum` derive macro.
* [[#1737](https://github.com/SeaQL/sea-orm/pull/1737)] Definition of `DbErr::ConnectionAcquire` changed to `ConnectionAcquire(ConnAcquireErr)`
* `FromJsonQueryResult` removed from entity prelude
* `sea-query/derive` is no longer enabled by `sea-orm`, as such, `Iden` no longer works as a derive macro (it's still a trait). Instead, we are shipping a new macro `DeriveIden`:
```rust
// then:

#[derive(Iden)]
#[iden = "category"]
pub struct CategoryEnum;

#[derive(Iden)]
pub enum Tea {
    Table,
    #[iden = "EverydayTea"]
    EverydayTea,
}

// now:

#[derive(DeriveIden)]
#[sea_orm(iden = "category")]
pub struct CategoryEnum;

#[derive(DeriveIden)]
pub enum Tea {
    Table,
    #[sea_orm(iden = "EverydayTea")]
    EverydayTea,
}
```

## SeaORM Enhancements

* [[#1513](https://github.com/SeaQL/sea-orm/pull/1513)] Supports for partial select of `Option<T>` model field. A `None` value will be filled when the select result does not contain the `Option<T>` field without throwing an error.
* [[#1508](https://github.com/SeaQL/sea-orm/pull/1508)] Supports entity with composite primary key of length 12
* [[#1599](https://github.com/SeaQL/sea-orm/pull/1599)] Add generation of `seaography` related information to `sea-orm-codegen`
* [[#1519](https://github.com/SeaQL/sea-orm/pull/1519)] Added `Migration::name()` and `Migration::status()` getters for the name and status of `sea_orm_migration::Migration`
* [[#1565](https://github.com/SeaQL/sea-orm/pull/1565)] The `postgres-array` feature will be enabled when `sqlx-postgres` backend is selected
* [[#1439](https://github.com/SeaQL/sea-orm/pull/1439)] Replace `String` parameters in API with `Into<String>`
* [[#1661](https://github.com/SeaQL/sea-orm/pull/1661)] Re-export `sea_query::{DynIden, RcOrArc, SeaRc}` in `sea_orm::entity::prelude` module
* [[#1627](https://github.com/SeaQL/sea-orm/pull/1627)] Added `DatabaseConnection::ping`
* [[#1708](https://github.com/SeaQL/sea-orm/pull/1708)] Added `TryInsert` that does not panic on empty inserts
* [[#1712](https://github.com/SeaQL/sea-orm/pull/1712)] On conflict do nothing not resulting in Err
* [[#1677](https://github.com/SeaQL/sea-orm/pull/1677)] Added `UpdateMany::exec_with_returning()`

## CLI Enhancements

* [[#1334](https://github.com/SeaQL/sea-orm/pull/1334)] The `migrate init` command will create a `.gitignore` file when the migration folder reside in a Git repository
* [[#1570](https://github.com/SeaQL/sea-orm/pull/1570)] Added support for generating migration of space separated name, for example executing `sea-orm-cli migrate generate "create accounts table"` command will create `m20230503_000000_create_accounts_table.rs` for you
* [[#1511](https://github.com/SeaQL/sea-orm/pull/1511)] Added `MigratorTrait::migration_table_name()` method to configure the name of migration table

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
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/Iceapinan">
                <img src="https://avatars.githubusercontent.com/u/2698243?v=4" />
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

## What's Next?

SeaQL is a community driven project. We welcome you to participate, contribute and build together for Rust's future.

Here is the roadmap for SeaORM [`0.13.x`](https://github.com/SeaQL/sea-orm/milestone/13).
