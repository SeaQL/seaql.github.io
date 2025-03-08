---
slug: 2025-03-08-whats-new-in-seaorm-1.1
title: What's new in SeaORM 1.1
author: SeaQL Team
author_title: Chris Tsang
author_url: https://github.com/SeaQL
author_image_url: https://www.sea-ql.org/blog/img/SeaQL.png
image: https://www.sea-ql.org/blog/img/SeaORM%201.0-rc%20Banner.png
tags: [news]
---

<img alt="SeaORM 1.0 Banner" src="/blog/img/SeaORM%201.0%20Banner.png"/>

This blog post summarizes the new features and enhancements introduced in SeaORM `1.1`:

+ 2024-10-15 [`1.1.0`](https://github.com/SeaQL/sea-orm/releases/tag/1.1.0)
+ 2024-11-04 [`1.1.1`](https://github.com/SeaQL/sea-orm/releases/tag/1.1.1)
+ 2024-12-02 [`1.1.2`](https://github.com/SeaQL/sea-orm/releases/tag/1.1.2)
+ 2024-12-24 [`1.1.3`](https://github.com/SeaQL/sea-orm/releases/tag/1.1.3)
+ 2025-01-10 [`1.1.4`](https://github.com/SeaQL/sea-orm/releases/tag/1.1.4)
+ 2025-02-14 [`1.1.5`](https://github.com/SeaQL/sea-orm/releases/tag/1.1.5)
+ 2025-02-24 [`1.1.6`](https://github.com/SeaQL/sea-orm/releases/tag/1.1.6)
+ 2025-03-02 [`1.1.7`](https://github.com/SeaQL/sea-orm/releases/tag/1.1.7)

## New Features

### Support Postgres Vector

[#2500](https://github.com/SeaQL/sea-orm/pull/2500)

The popular [pgvector](https://github.com/pgvector/pgvector) extension enables efficient storage and querying of high-dimensional vector data, supporting applications like similarity search, recommendation systems, and other AI tools.

Thanks to the contribution of [@28Smiles](https://github.com/28Smiles), `PgVector` is now integrated nicely into the SeaQL ecosystem.

```rust
// Model
#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "image_model")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub embedding: PgVector,
}

// Schema
sea_query::Table::create()
    .table(image_model::Entity.table_ref())
    .col(ColumnDef::new(Column::Id).integer().not_null().auto_increment().primary_key())
    .col(ColumnDef::new(Column::Embedding).vector(None).not_null())
    ..

// Insert
ActiveModel {
    id: NotSet,
    embedding: Set(PgVector::from(vec![1., 2., 3.])),
}
.insert(db)
.await?
```

### Nested Objects in Relational Queries

[#2508](https://github.com/SeaQL/sea-orm/pull/2508) [#2179](https://github.com/SeaQL/sea-orm/pull/2179) [#1716](https://github.com/SeaQL/sea-orm/pull/1716)

We now have a good answer to [Why SeaORM does not nest objects for parent-child relation](https://www.sea-ql.org/blog/2022-05-14-faq-01/)!

The latest improvements to the `FromQueryResult` and `DerivePartialModel` macros allows you to nest objects easily, simplifying the construction of complex queries.

To illustrate, let's take a look at the [Bakery Schema](https://www.sea-ql.org/SeaORM/docs/relation/bakery-schema/) again.

![Bakery ERD](https://raw.githubusercontent.com/SeaQL/sea-orm/refs/heads/master/tests/common/bakery_chain/bakery_chain_erd.png)

As a simple first example, we'd like to select `Cake` with `Bakery`:

```rust
#[derive(FromQueryResult)]
struct Cake {
    id: i32,
    name: String,
    #[sea_orm(nested)]
    bakery: Option<Bakery>,
}

#[derive(FromQueryResult)]
struct Bakery {
    #[sea_orm(from_alias = "bakery_id")]
    id: i32,
    #[sea_orm(from_alias = "bakery_name")]
    brand: String,
}

let cake: Cake = cake::Entity::find()
    .select_only()
    .column(cake::Column::Id)
    .column(cake::Column::Name)
    .column_as(bakery::Column::Id, "bakery_id")
    .column_as(bakery::Column::Name, "bakery_name")
    .left_join(bakery::Entity)
    .order_by_asc(cake::Column::Id)
    .into_model()
    .one(db)
    .await?
    .unwrap();

assert_eq!(
    cake,
    Cake {
        id: 1,
        name: "Basque cheesecake".to_string(),
        bakery: Some(Bakery {
            id: 20,
            brand: "Super Baker".to_string(),
        })
    }
);
```

Because the tables `cake` and `bakery` have some duplicate column names, we'd have to do custom selects. `select_only` here clears the default select list, and we apply aliases with `column_as`. Then, in `FromQueryResult` we use `from_alias` to map the query result back to the nested struct.

You may wonder if there are ways to not do the alias and mapping? Yes! There's where `DerivePartialModel` comes into play. The previous example can be written as:
```rust
#[derive(DerivePartialModel)] // FromQueryResult is no longer needed
#[sea_orm(entity = "cake::Entity", from_query_result)]
struct Cake {
    id: i32,
    name: String,
    #[sea_orm(nested)]
    bakery: Option<Bakery>,
}

#[derive(DerivePartialModel)]
#[sea_orm(entity = "bakery::Entity", from_query_result)]
struct Bakery {
    id: i32,
    #[sea_orm(from_col = "Name")]
    brand: String,
}

// same as previous example, but without the custom selects
let cake: Cake = cake::Entity::find()
    .left_join(bakery::Entity)
    .order_by_asc(cake::Column::Id)
    .into_partial_model()
    .one(db)
    .await?
    .unwrap();
```

Under the hood, `bakery_` prefix will be added to the column alias in the SQL query.

Now, let's look at one more advanced three-way join. Our join tree starts from Order:

```rust
Order -> Customer
      -> LineItem -> Cake
```

```rust
#[derive(Debug, DerivePartialModel, PartialEq)]
#[sea_orm(entity = "order::Entity", from_query_result)]
struct Order {
    id: i32,
    total: Decimal,
    #[sea_orm(nested)]
    customer: Customer,
    #[sea_orm(nested)]
    line: LineItem,
}

#[derive(Debug, DerivePartialModel, PartialEq)]
#[sea_orm(entity = "customer::Entity", from_query_result)]
struct Customer {
    name: String,
}

#[derive(Debug, DerivePartialModel, PartialEq)]
#[sea_orm(entity = "lineitem::Entity", from_query_result)]
struct LineItem {
    price: Decimal,
    quantity: i32,
    #[sea_orm(nested)]
    cake: Cake,
}

#[derive(Debug, DerivePartialModel, PartialEq)]
#[sea_orm(entity = "cake::Entity", from_query_result)]
struct Cake {
    name: String,
}

let items: Vec<Order> = order::Entity::find()
    .left_join(customer::Entity)
    .left_join(lineitem::Entity)
    .join(JoinType::LeftJoin, lineitem::Relation::Cake.def())
    .order_by_asc(order::Column::Id)
    .order_by_asc(lineitem::Column::Id)
    .into_partial_model()
    .all(db)
    .await?;

assert_eq!(
    items,
    [
        Order {
            id: 101,
            total: Decimal::from(10),
            customer: Customer {
                name: "Bob".to_owned()
            },
            line: LineItem {
                cake: Cake {
                    name: "Cheesecake".to_owned()
                },
                price: Decimal::from(2),
                quantity: 2,
            }
        },
        ..
    ]
);
```

That's it! Hope you like these new features, and a huge thanks to [@Goodjooy](https://github.com/Goodjooy) for laying the foundation, [@jreppnow](https://github.com/jreppnow) for implementing the nested logic, and everyone who participated in the discussion.

#### Bonus: PartialModel -> ActiveModel

`DerivePartialModel` got another extension to derive `IntoActiveModel` as well. Absent attributes will be filled with `NotSet`. This allows you to have a cake and eat it!

```rust
#[derive(DerivePartialModel)]
#[sea_orm(entity = "cake::Entity", into_active_model)]
struct PartialCake {
    id: i32,
    name: String,
}

let partial_cake = PartialCake {
    id: 12,
    name: "Lemon Drizzle".to_owned(),
};

// this is now possible:
assert_eq!(
    cake::ActiveModel {
        ..partial_cake.into_active_model()
    },
    cake::ActiveModel {
        id: Set(12),
        name: Set("Lemon Drizzle".to_owned()),
        ..Default::default()
    }
);
```

### Three way select

[#2518](https://github.com/SeaQL/sea-orm/pull/2518)

With PartialModel being so powerful, if you still need to do non-nested selects, there's `SelectThree`, an extension to `SelectTwo`:

```rust
Order -> Lineitem -> Cake
```

```rust
let items: Vec<(order::Model, Option<lineitem::Model>, Option<cake::Model>)> =
    order::Entity::find()
        .find_also_related(lineitem::Entity)
        .and_also_related(cake::Entity)
        .order_by_asc(order::Column::Id)
        .order_by_asc(lineitem::Column::Id)
        .all(db)
        .await?;
```

### Insert heterogeneous models

[#2433](https://github.com/SeaQL/sea-orm/pull/2433)

Insert many now allows active models to have different column sets (it previously panics). Missing columns will be filled with `NULL`. This makes seeding data (e.g. [with Loco](https://loco.rs/docs/the-app/models/#seeding)) a seamless operation.

```rust
// this previously panics
let apple = cake_filling::ActiveModel {
    cake_id: ActiveValue::set(2),
    filling_id: ActiveValue::NotSet,
};
let orange = cake_filling::ActiveModel {
    cake_id: ActiveValue::NotSet,
    filling_id: ActiveValue::set(3),
};
assert_eq!(
    Insert::<cake_filling::ActiveModel>::new()
        .add_many([apple, orange])
        .build(DbBackend::Postgres)
        .to_string(),
    r#"INSERT INTO "cake_filling" ("cake_id", "filling_id") VALUES (2, NULL), (NULL, 3)"#,
);
```

### Improved Seaography Integration

[#2403](https://github.com/SeaQL/sea-orm/pull/2403)

We've simplified the code by allowing you to register entities into Seaography's GraphQL schema directly within the entity module.

```rust
pub mod prelude;

pub mod sea_orm_active_enums;

pub mod baker;
pub mod bakery;
pub mod cake;
pub mod cakes_bakers;

seaography::register_entity_modules!([
    baker,
    bakery,
    cake,
    cakes_bakers,
]);

seaography::register_active_enums!([
    sea_orm_active_enums::Tea,
]);
```

## Enhancements

* Added `Insert::exec_with_returning_keys` & `Insert::exec_with_returning_many` (Postgres only)
```rust
assert_eq!(
    Entity::insert_many([
        ActiveModel { id: NotSet, name: Set("two".into()) },
        ActiveModel { id: NotSet, name: Set("three".into()) },
    ])
    .exec_with_returning_many(db)
    .await
    .unwrap(),
    [
        Model { id: 2, name: "two".into() },
        Model { id: 3, name: "three".into() },
    ]
);

assert_eq!(
    cakes_bakers::Entity::insert_many([
        cakes_bakers::ActiveModel {
            cake_id: Set(1),
            baker_id: Set(2),
        },
        cakes_bakers::ActiveModel {
            cake_id: Set(2),
            baker_id: Set(1),
        },
    ])
    .exec_with_returning_keys(db)
    .await
    .unwrap(),
    [(1, 2), (2, 1)]
);
```
* Added `DeleteOne::exec_with_returning` & `DeleteMany::exec_with_returning` [#2432](https://github.com/SeaQL/sea-orm/pull/2432)
* Support complex type path in `DeriveIntoActiveModel` [#2517](https://github.com/SeaQL/sea-orm/pull/2517)
```rust 
#[derive(DeriveIntoActiveModel)]
#[sea_orm(active_model = "<fruit::Entity as EntityTrait>::ActiveModel")]
struct Fruit {
    cake_id: Option<Option<i32>>,
}
```
* Added `DatabaseConnection::close_by_ref` [#2511](https://github.com/SeaQL/sea-orm/pull/2511)
```rust
pub async fn close(self) -> Result<(), DbErr> { .. } // existing
pub async fn close_by_ref(&self) -> Result<(), DbErr> { .. } // new
```
* Added `Schema::json_schema_from_entity` to construct schema metadata for Entities
```rust
assert_eq!(
    Schema::new(DbBackend::MySql).json_schema_from_entity(lunch_set::Entity),
    json! {
        "columns": [
            {
                "name": "id",
                "nullable": false,
                "type": "integer"
            },
            {
                "name": "name",
                "nullable": false,
                "type": "string"
            },
            {
                "name": "tea",
                "nullable": false,
                "type": {
                    "name": "tea",
                    "variants": [
                        "EverydayTea",
                        "BreakfastTea"
                    ]
                }
            }
        ],
        "primary_key": [
            "id"
        ]
    }
);
```
* Construct `DatabaseConnection` directly from `sqlx::PgPool`, `sqlx::SqlitePool` and `sqlx::MySqlPool` [#2348](https://github.com/SeaQL/sea-orm/pull/2348)
```rust
// these are implemented:
impl From<MySqlPool> for SqlxMySqlPoolConnection { .. }
impl From<MySqlPool> for DatabaseConnection { .. }

// so this is now possible:
let db: DatabaseConnection = mysql_pool.into();
```
* Expose underlying row types (e.g. `sqlx::postgres::PgRow`) [#2265](https://github.com/SeaQL/sea-orm/pull/2265)
* [sea-orm-migration] Allow modifying the connection in migrations [#2397](https://github.com/SeaQL/sea-orm/pull/2397)
```rust
#[async_std::main]
async fn main() {
    cli::run_cli_with_connection(migration::Migrator, |connect_options| async {
        let db = Database::connect(connect_options)
             .await?;
        if db.get_database_backend() == DatabaseBackend::Sqlite {
            db::register_sqlite_functions(&db).await;
        }
        Ok(db)
    }).await;
}
```
* [sea-orm-cli] Added `MIGRATION_DIR` environment variable [#2419](https://github.com/SeaQL/sea-orm/pull/2419)
* [sea-orm-cli] Added `acquire-timeout` option [#2461](https://github.com/SeaQL/sea-orm/pull/2461)
* [sea-orm-cli] Added `impl-active-model-behavior` option [#2487](https://github.com/SeaQL/sea-orm/pull/2487)
* [sea-orm-cli] Added `with-prelude` option [#2322](https://github.com/SeaQL/sea-orm/pull/2322)
    * `all`: the default value (current behaviour), it will generates the prelude.rs file and add it to mod.rs / lib.rs
    * `all-allow-unused-imports`: it generates the prelude.rs file and add it to mod.rs, plus adding `#![allow(unused_imports)]` in the module
    * `none`: it **will not** generates the prelude.rs file and **will not** add it to mod.rs

## Upgrades

* Upgrade `sqlx` to `0.8` [#2305](https://github.com/SeaQL/sea-orm/pull/2305)  [#2371](https://github.com/SeaQL/sea-orm/pull/2371)
* Upgrade `bigdecimal` to `0.4` [#2305](https://github.com/SeaQL/sea-orm/pull/2305)
* Upgrade `sea-query` to `0.32.0` [#2305](https://github.com/SeaQL/sea-orm/pull/2305)
* Upgrade `sea-query-binder` to `0.7` [#2305](https://github.com/SeaQL/sea-orm/pull/2305)
* Upgrade `sea-schema` to `0.16` [#2305](https://github.com/SeaQL/sea-orm/pull/2305)
* Upgrade `ouroboros` to `0.18` [#2353](https://github.com/SeaQL/sea-orm/pull/2353)

## House Keeping

* Cleanup legacy `ActiveValue::Set` [#2515](https://github.com/SeaQL/sea-orm/pull/2515)
* Remove `futures` crate, replace with `futures-util` [#2466](https://github.com/SeaQL/sea-orm/pull/2466)

## Release Planning

[SeaORM 1.0](https://www.sea-ql.org/blog/2024-08-04-sea-orm-1.0/) is a stable release. As demonstrated, we are able to ship many new features without breaking the API. The 1.x version will be updated until at least October 2025, and we'll decide whether to release a 2.0 version or extend the 1.x life cycle.

## SQL Server Support

We've been beta-testing [SQL Server for SeaORM](https://www.sea-ql.org/SeaORM-X/) for a while. If you are building software for your company, please [request early access](https://forms.office.com/r/1MuRPJmYBR).

## Sponsor

If you feel generous, a small donation will be greatly appreciated, and goes a long way towards sustaining the organization.

A big shout out to our [GitHub sponsors](https://github.com/sponsors/SeaQL) 😇:

<div class="row">
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
            <a class="avatar__photo-link avatar__photo avatar__photo--m" href="https://github.com/Coolpany-SE">
                <img src="https://avatars.githubusercontent.com/u/96304487?s=200&v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Coolpany SE
                </div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--m" href="https://github.com/anshap1719">
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
</div>
<br />
<div class="row">
    <div class="col col--4 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/mjkoo">
                <img src="https://avatars.githubusercontent.com/u/30420?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Maxwell Koo
                </div>
            </div>
        </div>
    </div>
    <div class="col col--4 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/spencewenski">
                <img src="https://avatars.githubusercontent.com/u/3319370?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Spencer Ferris
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
    <div class="col col--4 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/data-intuitive">
                <img src="https://avatars.githubusercontent.com/u/15045722?s=200&v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Data Intuitive
                </div>
            </div>
        </div>
    </div>
    <div class="col col--4 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/mmuellersoppart">
                <img src="https://avatars.githubusercontent.com/u/16762461?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Marlon Mueller
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
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/gnuphie">
                <img src="https://avatars.githubusercontent.com/u/50941?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    gnuphie
                </div>
            </div>
        </div>
    </div>
</div>

### Wait... there's one more thing

"Are we web yet?" is a recurring question in the Rust community, the answer is *yes*, yes, YES!

If you are looking for a batteries-included full-stack web development framework that is strongly-typed, asynchronous, robust and high-performance, look no further than **Rust + Loco + SeaQL**. We highly recommend giving [Loco](https://loco.rs/) a try - "It’s Like Ruby on Rails, but for Rust."

With this final piece of software, my vision for a complete full-stack Rust environment is now realized. After years of development in SeaORM + Seaography, I am excited to introduce it to you:

## 🖥️ SeaORM Pro: Professional Admin Panel

<a href="https://www.sea-ql.org/sea-orm-pro/">
    <img style={{borderRadius: "25px"}} src="https://www.sea-ql.org/sea-orm-pro/img/01_banner.png#light" />
    <img style={{borderRadius: "25px"}} src="https://www.sea-ql.org/sea-orm-pro/img/01_banner_dark.png#dark" />
</a>

[SeaORM Pro](https://www.sea-ql.org/sea-orm-pro/) is an admin panel solution allowing you to quickly and easily launch an admin panel for your application - frontend development skills not required, but certainly nice to have!

Features:

+ Full CRUD
+ Built on React + GraphQL
+ Built-in GraphQL resolver
+ Customize the UI with simple TOML

Learn More

+ [Example Repo](https://github.com/SeaQL/sea-orm-pro)
+ [Getting Started with Loco](https://www.sea-ql.org/sea-orm-pro/docs/install-and-config/getting-started-loco/)
+ [Getting Started with Axum](https://www.sea-ql.org/sea-orm-pro/docs/install-and-config/getting-started-axum/)
