---
slug: 2023-08-12-announcing-seaorm-0.12
title: Announcing SeaORM 0.12 🐚
author: SeaQL Team
author_title: Chris Tsang
author_url: https://github.com/SeaQL
author_image_url: https://www.sea-ql.org/blog/img/SeaQL.png
tags: [news]
---

<img alt="SeaORM 0.12 Banner" src="/blog/img/SeaORM%2012%20Banner.png"/>

🎉 We are pleased to announce SeaORM [`0.12`](https://github.com/SeaQL/sea-orm/releases/tag/0.12.1) today!

We still remember the time when we first [introduced SeaORM](/blog/2021-09-20-introducing-sea-orm/) to the Rust community two years ago. We set out a goal to enable developers to build asynchronous database-driven applications in Rust.

Today, many open-source projects, [a handful of startups](https://www.sea-ql.org/SeaORM/index.html#our-users) and many more closed-source projects are using SeaORM. Thank you all who participated and contributed in the making!

<img alt="SeaORM Star History" src="/blog/img/star-history-sea-orm-2023.png"/>

## New Features 🌟

### 🧭 [Seaography](https://github.com/SeaQL/seaography): GraphQL integration (preview)

<img alt="Seaography example" src="/blog/img/Seaography%20example.png"/>

Seaography is a GraphQL framework built on top of SeaORM. In `0.12`, Seaography integration is built into `sea-orm`.
Seaography allows you to build GraphQL resolvers quickly. With just a few commands, you can launch a GraphQL server from SeaORM entities!

While Seaography development is still in an early stage, it is especially useful in prototyping and building internal-use admin panels.

[Read the documentation](https://www.sea-ql.org/SeaORM/docs/seaography/seaography-intro/) to learn more.

### Added macro [`DerivePartialModel`](https://docs.rs/sea-orm/0.12.2/sea_orm/derive.DerivePartialModel.html)

[#1597](https://github.com/SeaQL/sea-orm/pull/1597) Now you can easily perform custom select to query only the columns you needed

```rust
#[derive(DerivePartialModel, FromQueryResult)]
#[sea_orm(entity = "Cake")]
struct PartialCake {
    name: String,
    #[sea_orm(
        from_expr = r#"SimpleExpr::FunctionCall(Func::upper(Expr::col((Cake, cake::Column::Name))))"#
    )]
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

### Added [`Select::find_with_linked`](https://docs.rs/sea-orm/0.12.2/sea_orm/query/struct.Select.html#method.find_with_linked)

[#1728](https://github.com/SeaQL/sea-orm/pull/1728), [#1743](https://github.com/SeaQL/sea-orm/pull/1743) Similar to `find_with_related`, you can now select related entities and consolidate the models.

```rust
// Consider the following link
pub struct BakedForCustomer;

impl Linked for BakedForCustomer {
    type FromEntity = Entity;

    type ToEntity = super::customer::Entity;

    fn link(&self) -> Vec<RelationDef> {
        vec![
            super::cakes_bakers::Relation::Baker.def().rev(),
            super::cakes_bakers::Relation::Cake.def(),
            super::lineitem::Relation::Cake.def().rev(),
            super::lineitem::Relation::Order.def(),
            super::order::Relation::Customer.def(),
        ]
    }
}

let res: Vec<(baker::Model, Vec<customer::Model>)> = Baker::find()
    .find_with_linked(baker::BakedForCustomer)
    .order_by_asc(baker::Column::Id)
    .all(db)
    .await?
```

### Added [`DeriveValueType`](https://docs.rs/sea-orm/latest/sea_orm/derive.DeriveValueType.html) derive macro for [custom wrapper types](https://www.sea-ql.org/SeaORM/docs/generate-entity/newtype/)

[#1720](https://github.com/SeaQL/sea-orm/pull/1720) So now you can use newtypes easily.

```rust
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "custom_value_type")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub number: Integer,
    // Postgres only
    pub str_vec: StringVec,
}

#[derive(Clone, Debug, PartialEq, Eq, DeriveValueType)]
pub struct Integer(i32);

#[derive(Clone, Debug, PartialEq, Eq, DeriveValueType)]
pub struct StringVec(pub Vec<String>);
```

Which saves you the boilerplate of:

```rust
impl std::convert::From<StringVec> for Value { .. }

impl TryGetable for StringVec {
    fn try_get_by<I: ColIdx>(res: &QueryResult, idx: I)
        -> Result<Self, TryGetError> { .. }
}

impl ValueType for StringVec {
    fn try_from(v: Value) -> Result<Self, ValueTypeErr> { .. }

    fn type_name() -> String { "StringVec".to_owned() }

    fn array_type() -> ArrayType { ArrayType::String }

    fn column_type() -> ColumnType { ColumnType::String(None) }
}
```

## Enhancements 🆙

#### [#1433](https://github.com/SeaQL/sea-orm/pull/1433) Chained AND / OR join ON condition

Added more macro attributes to [`DeriveRelation`](https://docs.rs/sea-orm/0.12.2/sea_orm/derive.DeriveRelation.html)

```rust
// Entity file

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    // By default, it's `JOIN `fruit` ON `cake`.`id` = `fruit`.`cake_id` AND `fruit`.`name` LIKE '%tropical%'`
    #[sea_orm(
        has_many = "super::fruit::Entity",
        on_condition = r#"super::fruit::Column::Name.like("%tropical%")"#
    )]
    TropicalFruit,
    // Specify `condition_type = "any"` to override it, now it becomes
    // `JOIN `fruit` ON `cake`.`id` = `fruit`.`cake_id` OR `fruit`.`name` LIKE '%tropical%'`
    #[sea_orm(
        has_many = "super::fruit::Entity",
        on_condition = r#"super::fruit::Column::Name.like("%tropical%")"#
        condition_type = "any",
    )]
    OrTropicalFruit,
}
```

#### [#1508](https://github.com/SeaQL/sea-orm/pull/1508) Supports entity with composite primary key of arity 12

```rust
#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "primary_key_of_12")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub id_1: String,
    ...
    #[sea_orm(primary_key, auto_increment = false)]
    pub id_12: bool,
}
```

#### [#1677](https://github.com/SeaQL/sea-orm/pull/1677) Added [`UpdateMany::exec_with_returning()`](https://docs.rs/sea-orm/0.12.2/sea_orm/query/struct.UpdateMany.html#method.exec_with_returning)

```rust
let models: Vec<Model> = Entity::update_many()
    .col_expr(Column::Values, Expr::expr(..))
    .exec_with_returning(db)
    .await?;
```

#### [#1511](https://github.com/SeaQL/sea-orm/pull/1511) Added [`MigratorTrait::migration_table_name()`](https://docs.rs/sea-orm-migration/0.12.2/sea_orm_migration/migrator/trait.MigratorTrait.html#method.migration_table_name) method to configure the name of migration table
```rust
#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    // Override the name of migration table
    fn migration_table_name() -> sea_orm::DynIden {
        Alias::new("override_migration_table_name").into_iden()
    }
    ...
}
```
#### [#1707](https://github.com/SeaQL/sea-orm/pull/1707) Added [`DbErr::sql_err()`](https://docs.rs/sea-orm/0.12.2/sea_orm/error/enum.DbErr.html#method.sql_err) method to parse common database errors
```rust
assert!(matches!(
    cake.into_active_model().insert(db).await
        .expect_err("Insert a row with duplicated primary key")
        .sql_err(),
    Some(SqlErr::UniqueConstraintViolation(_))
));

assert!(matches!(
    fk_cake.insert(db).await
        .expect_err("Insert a row with invalid foreign key")
        .sql_err(),
    Some(SqlErr::ForeignKeyConstraintViolation(_))
));
```
#### [#1737](https://github.com/SeaQL/sea-orm/pull/1737) Introduced new [`ConnAcquireErr`](https://docs.rs/sea-orm/0.12.2/sea_orm/error/enum.ConnAcquireErr.html)
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
#### [#1627](https://github.com/SeaQL/sea-orm/pull/1627) Added [`DatabaseConnection::ping()`](https://docs.rs/sea-orm/0.12.2/sea_orm/error/enum.ConnAcquireErr.html)
```rust
|db: DatabaseConnection| {
    assert!(db.ping().await.is_ok());
    db.clone().close().await;
    assert!(matches!(db.ping().await, Err(DbErr::ConnectionAcquire)));
}
```
#### [#1708](https://github.com/SeaQL/sea-orm/pull/1708) Added [`TryInsert`](https://docs.rs/sea-orm/0.12.2/sea_orm/query/struct.TryInsert.html) that does not panic on empty inserts
```rust
// now, you can do:
let res = Bakery::insert_many(std::iter::empty())
    .on_empty_do_nothing()
    .exec(db)
    .await;

assert!(matches!(res, Ok(TryInsertResult::Empty)));
```
#### [#1712](https://github.com/SeaQL/sea-orm/pull/1712) Insert on conflict do nothing to return Ok
```rust
let on = OnConflict::column(Column::Id).do_nothing().to_owned();

// Existing behaviour
let res = Entity::insert_many([..]).on_conflict(on).exec(db).await;
assert!(matches!(res, Err(DbErr::RecordNotInserted)));

// New API; now you can:
let res =
Entity::insert_many([..]).on_conflict(on).do_nothing().exec(db).await;
assert!(matches!(res, Ok(TryInsertResult::Conflicted)));
```
#### [#1740](https://github.com/SeaQL/sea-orm/pull/1740), [#1755](https://github.com/SeaQL/sea-orm/pull/1755) Replacing `sea_query::Iden` with [`sea_orm::DeriveIden`](https://docs.rs/sea-orm/0.12.2/sea_orm/derive.DeriveIden.html)

To provide a more consistent interface, `sea-query/derive` is no longer enabled by `sea-orm`, as such, `Iden` no longer works as a derive macro (it's still a trait).

```rust
// then:

#[derive(Iden)]
#[iden = "category"]
pub struct CategoryEnum;

#[derive(Iden)]
pub enum Tea {
    Table,
    #[iden = "AfternoonTea"]
    EverydayTea,
}

// now:

#[derive(DeriveIden)]
#[sea_orm(iden = "category")]
pub struct CategoryEnum;

#[derive(DeriveIden)]
pub enum Tea {
    Table,
    #[sea_orm(iden = "AfternoonTea")]
    EverydayTea,
}
```

## New Release Train 🚅

It's been the **12th** release of SeaORM! Initially, a major version was released every month. It gradually became 2 to 3 months, and now, it's been 6 months since the last major release. As our userbase grew and some are already [using SeaORM in production](https://github.com/SeaQL/sea-orm/blob/master/COMMUNITY.md#startups), we understand the importance of having a stable API surface and feature set.

That's why we are committed to:

1. Reviewing breaking changes with strict scrutiny
2. Expanding our test suite to cover all features of our library
3. Never remove features, and consider deprecation carefully

Today, the architecture of SeaORM is pretty solid and stable, and with the `0.12` release where we paid back a lot of technical debt, we will be able to deliver new features and enhancements without breaking. As our major dependency [SQLx](https://github.com/launchbadge/sqlx) is not `1.0` yet, technically we cannot be `1.0`.

We are still advancing rapidly, and we will always make a new release as soon as SQLx makes a new release, so that you can upgrade everything at once. As a result, the next major release of SeaORM will come out **6 months from now, or when SQLx makes a new release**, whichever is earlier.

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

## What's Next for SeaORM? ⛵

Open-source project is a never-ending work, and we are actively looking for ways to sustain the project. You can support our endeavour by starring & sharing our repositories and becoming a sponsor.

We are considering multiple directions to generate revenue for the organization. If you have any suggestion, or want to join or collaborate with us, please contact us via `hello[at]sea-ql.org`.

Thank you for your support, and together we can make open-source sustainable.