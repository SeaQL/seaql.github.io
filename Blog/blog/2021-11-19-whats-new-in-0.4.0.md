---
slug: 2021-11-19-whats-new-in-0.4.0
title: What's new in SeaORM 0.4.0
author: SeaQL Team
author_title: Chris Tsang
author_url: https://github.com/SeaQL
author_image_url: https://www.sea-ql.org/SeaORM/img/SeaQL.png
tags: [news]
---

🎉 We are pleased to release SeaORM [`0.4.0`](https://github.com/SeaQL/sea-orm/releases/tag/0.4.0) today! Here are some feature highlights 🌟:

## Rust Edition 2021

[[#273](https://github.com/SeaQL/sea-orm/pull/273)] Upgrading SeaORM to [Rust Edition 2021](https://blog.rust-lang.org/2021/10/21/Rust-1.56.0.html#rust-2021) 🦀❤🐚!

Contributed by:

<div class="row">
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/sno2">
                <img src="https://avatars.githubusercontent.com/u/43641633?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Carter Snook
                </div>
            </div>
        </div>
    </div>
</div>

## Enumeration

[[#252](https://github.com/SeaQL/sea-orm/issues/252)] You can now use Rust enums in model where the values are mapped to a database string, integer or native enum. Learn more [here](/SeaORM/docs/generate-entity/enumeration).

```rust
#[derive(Debug, Clone, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "active_enum")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    // Use our custom enum in a model
    pub category: Option<Category>,
    pub color: Option<Color>,
    pub tea: Option<Tea>,
}

#[derive(Debug, Clone, PartialEq, EnumIter, DeriveActiveEnum)]
#[sea_orm(rs_type = "String", db_type = "String(Some(1))")]
// An enum serialized into database as a string value
pub enum Category {
    #[sea_orm(string_value = "B")]
    Big,
    #[sea_orm(string_value = "S")]
    Small,
}

#[derive(Debug, Clone, PartialEq, EnumIter, DeriveActiveEnum)]
#[sea_orm(rs_type = "i32", db_type = "Integer")]
// An enum serialized into database as an integer value
pub enum Color {
    #[sea_orm(num_value = 0)]
    Black,
    #[sea_orm(num_value = 1)]
    White,
}

#[derive(Debug, Clone, PartialEq, EnumIter, DeriveActiveEnum)]
#[sea_orm(rs_type = "String", db_type = "Enum", enum_name = "tea")]
// An enum serialized into database as a database native enum
pub enum Tea {
    #[sea_orm(string_value = "EverydayTea")]
    EverydayTea,
    #[sea_orm(string_value = "BreakfastTea")]
    BreakfastTea,
}
```


<div class="row">
    <div class="col col--6 margin-bottom--md">
        Designed by:
        <br/><br/>
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/tyt2y3">
                <img src="https://avatars.githubusercontent.com/u/1782664?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Chris Tsang
                </div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        Contributed by:
        <br/><br/>
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/billy1624">
                <img src="https://avatars.githubusercontent.com/u/30400950?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Billy Chan
                </div>
            </div>
        </div>
    </div>
</div>

## Supports `RETURNING` Clause on PostgreSQL

[[#183](https://github.com/SeaQL/sea-orm/issues/183)] When performing insert or update operation on `ActiveModel` against PostgreSQL, `RETURNING` clause will be used to perform select in a single SQL statement.

```rust
// For PostgreSQL
cake::ActiveModel {
    name: Set("Apple Pie".to_owned()),
    ..Default::default()
}
.insert(&postgres_db)
.await?;

assert_eq!(
    postgres_db.into_transaction_log(),
    vec![Transaction::from_sql_and_values(
        DbBackend::Postgres,
        r#"INSERT INTO "cake" ("name") VALUES ($1) RETURNING "id", "name""#,
        vec!["Apple Pie".into()]
    )]);
```

```rust
// For MySQL & SQLite
cake::ActiveModel {
    name: Set("Apple Pie".to_owned()),
    ..Default::default()
}
.insert(&other_db)
.await?;

assert_eq!(
    other_db.into_transaction_log(),
    vec![
        Transaction::from_sql_and_values(
            DbBackend::MySql,
            r#"INSERT INTO `cake` (`name`) VALUES (?)"#,
            vec!["Apple Pie".into()]
        ),
        Transaction::from_sql_and_values(
            DbBackend::MySql,
            r#"SELECT `cake`.`id`, `cake`.`name` FROM `cake` WHERE `cake`.`id` = ? LIMIT ?"#,
            vec![15.into(), 1u64.into()]
        )]);
```


<div class="row">
    <div class="col col--6 margin-bottom--md">
        Proposed by:
        <br/><br/>
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/marlon-sousa">
                <img src="https://avatars.githubusercontent.com/u/21093041?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Marlon Brandão de Sousa
                </div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        Contributed by:
        <br/><br/>
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/billy1624">
                <img src="https://avatars.githubusercontent.com/u/30400950?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Billy Chan
                </div>
            </div>
        </div>
    </div>
</div>

## Axum Integration Example

[[#297](https://github.com/SeaQL/sea-orm/pull/297)] Added [Axum integration example](https://github.com/SeaQL/sea-orm/tree/master/examples/axum_example). More examples [wanted](https://github.com/SeaQL/sea-orm/issues/269)!

Contributed by:

<div class="row">
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/YoshieraHuang">
                <img src="https://avatars.githubusercontent.com/u/38752027?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Yoshiera
                </div>
            </div>
        </div>
    </div>
</div>

## Sponsor

Our [GitHub Sponsor](https://github.com/sponsors/SeaQL) profile is up! If you feel generous, a small donation will be greatly appreciated.

A big shout out to our first sponsors 😇:

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
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/exzachlyvv">
                <img src="https://avatars.githubusercontent.com/u/46034847?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Zachary Vander Velden
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

Here is the roadmap for SeaORM [`0.5.x`](https://github.com/SeaQL/sea-orm/milestone/5).