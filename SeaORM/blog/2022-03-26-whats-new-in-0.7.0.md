---
slug: 2022-03-26-whats-new-in-0.7.0
title: What's new in SeaORM 0.7.0
author: SeaQL Team
author_title: Chris Tsang
author_url: https://github.com/SeaQL
author_image_url: https://www.sea-ql.org/SeaORM/img/SeaQL.png
tags: [news]
---

🎉 We are pleased to release SeaORM [`0.7.0`](https://github.com/SeaQL/sea-orm/releases/tag/0.7.0) today! Here are some feature highlights 🌟:

## Update ActiveModel by JSON

[[#492](https://github.com/SeaQL/sea-orm/pull/492)] If you want to save user input into the database you can easily convert JSON value into ActiveModel.

```rust
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "fruit")]
pub struct Model {
    #[sea_orm(primary_key)]
    #[serde(skip_deserializing)] // Skip deserializing
    pub id: i32,
    pub name: String,
    pub cake_id: Option<i32>,
}
```

Set the attributes in ActiveModel with `set_from_json` method.

```rust
// A ActiveModel with primary key set
let mut fruit = fruit::ActiveModel {
    id: ActiveValue::Set(1),
    name: ActiveValue::NotSet,
    cake_id: ActiveValue::NotSet,
};

// Note that this method will not alter the primary key values in ActiveModel
fruit.set_from_json(json!({
    "id": 8,
    "name": "Apple",
    "cake_id": 1,
}))?;

assert_eq!(
    fruit,
    fruit::ActiveModel {
        id: ActiveValue::Set(1),
        name: ActiveValue::Set("Apple".to_owned()),
        cake_id: ActiveValue::Set(Some(1)),
    }
);
```

Create a new ActiveModel from JSON value with the `from_json` method.

```rust
let fruit = fruit::ActiveModel::from_json(json!({
    "name": "Apple",
}))?;

assert_eq!(
    fruit,
    fruit::ActiveModel {
        id: ActiveValue::NotSet,
        name: ActiveValue::Set("Apple".to_owned()),
        cake_id: ActiveValue::NotSet,
    }
);
```

<div class="row">
    <div class="col col--6 margin-bottom--md">
        Proposed by:
        <br/><br/>
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/qyihua">
                <img src="https://avatars.githubusercontent.com/u/13034668?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    qltk
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

## Support `time` crate in Model

[[#602](https://github.com/SeaQL/sea-orm/pull/602)] You can define datetime column in Model with `time` crate. You can migrate your Model originally defined in `chrono` to `time` crate.

Model defined in `chrono` crate.

```rust
use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "transaction_log")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub date: Date, // chrono::NaiveDate
    pub time: Time, // chrono::NaiveTime
    pub date_time: DateTime, // chrono::NaiveDateTime
    pub date_time_tz: DateTimeWithTimeZone, // chrono::DateTime<chrono::FixedOffset>
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
```

Model defined in `time` crate.

```rust
use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "transaction_log")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub date: TimeDate, // time::Date
    pub time: TimeTime, // time::Time
    pub date_time: TimeDateTime, // time::PrimitiveDateTime
    pub date_time_tz: TimeDateTimeWithTimeZone, // time::OffsetDateTime
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
```

<div class="row">
    <div class="col col--6 margin-bottom--md">
        Proposed by:
        <br/><br/>
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/tasn">
                <img src="https://avatars.githubusercontent.com/u/108670?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Tom Hacohen
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

## Delete by Primary Key

[[#590](https://github.com/SeaQL/sea-orm/pull/590)] Instead of selecting `Model` from the database then deleting it. You could also delete a row from database directly by its primary key.

```rust
let res: DeleteResult = Fruit::delete_by_id(38).exec(db).await?;
assert_eq!(res.rows_affected, 1);
```

<div class="row">
    <div class="col col--6 margin-bottom--md">
        Proposed by:
        <br/><br/>
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/ShouvikGhosh2048">
                <img src="https://avatars.githubusercontent.com/u/91585022?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Shouvik Ghosh
                </div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        Contributed by:
        <br/><br/>
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/Ilqjx">
                <img src="https://avatars.githubusercontent.com/u/53934234?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Zhenwei Guo
                </div>
            </div>
        </div>
    </div>
</div>

## Paginate Results from Raw Query

[[#617](https://github.com/SeaQL/sea-orm/pull/617)] You can paginate [`SelectorRaw`](https://docs.rs/sea-orm/0.6.0/sea_orm/struct.SelectorRaw.html) and fetch `Model` in batch.

```rust
let mut cake_pages = cake::Entity::find()
    .from_raw_sql(Statement::from_sql_and_values(
        DbBackend::Postgres,
        r#"SELECT "cake"."id", "cake"."name" FROM "cake" WHERE "id" = $1"#,
        vec![1.into()],
    ))
    .paginate(db, 50);
 
while let Some(cakes) = cake_pages.fetch_and_next().await? {
    // Do something on cakes: Vec<cake::Model>
}
```

<div class="row">
    <div class="col col--6 margin-bottom--md">
        Proposed by:
        <br/><br/>
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/cemoktra">
                <img src="https://avatars.githubusercontent.com/u/15634263?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Bastian
                </div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        Contributed by:
        <br/><br/>
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/shinbunbun">
                <img src="https://avatars.githubusercontent.com/u/34409044?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    shinbunbun
                </div>
            </div>
        </div>
    </div>
</div>

## Create Database Index

[[#593](https://github.com/SeaQL/sea-orm/pull/593)] To create indexes in database instead of writing [`IndexCreateStatement`](https://docs.rs/sea-query/*/sea_query/index/struct.IndexCreateStatement.html) manually, you can derive it from `Entity` using [`Schema::create_index_from_entity`](https://docs.rs/sea-orm/0.5/sea_orm/schema/struct.Schema.html#method.create_index_from_entity).

```rust
use sea_orm::{sea_query, tests_cfg::*, Schema};

let builder = db.get_database_backend();
let schema = Schema::new(builder);

let stmts = schema.create_index_from_entity(indexes::Entity);
assert_eq!(stmts.len(), 2);

let idx = sea_query::Index::create()
    .name("idx-indexes-index1_attr")
    .table(indexes::Entity)
    .col(indexes::Column::Index1Attr)
    .to_owned();
assert_eq!(builder.build(&stmts[0]), builder.build(&idx));

let idx = sea_query::Index::create()
    .name("idx-indexes-index2_attr")
    .table(indexes::Entity)
    .col(indexes::Column::Index2Attr)
    .to_owned();
assert_eq!(builder.build(&stmts[1]), builder.build(&idx));
```

<div class="row">
    <div class="col col--6 margin-bottom--md">
        Proposed by:
        <br/><br/>
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/grtlr">
                <img src="https://avatars.githubusercontent.com/u/3404250?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Jochen Görtler
                </div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        Contributed by:
        <br/><br/>
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/nickb937">
                <img src="https://avatars.githubusercontent.com/u/1443207?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Nick Burrett
                </div>
            </div>
        </div>
    </div>
</div>

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

Here is the roadmap for SeaORM [`0.8.x`](https://github.com/SeaQL/sea-orm/milestone/8).

## GSoC 2022

We are super excited to be selected as a Google Summer of Code 2022 mentor organization. Prospective contributors, please visit our [GSoC 2022 Organization Profile](https://summerofcode.withgoogle.com/programs/2022/organizations/seaql)!