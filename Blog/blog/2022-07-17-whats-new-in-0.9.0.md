---
slug: 2022-07-17-whats-new-in-0.9.0
title: What's new in SeaORM 0.9.0
author: SeaQL Team
author_title: Chris Tsang
author_url: https://github.com/SeaQL
author_image_url: https://www.sea-ql.org/SeaORM/img/SeaQL.png
tags: [news]
---

🎉 We are pleased to release SeaORM [`0.9.0`](https://github.com/SeaQL/sea-orm/releases/tag/0.9.0) today! Here are some feature highlights 🌟:

## Dependency Upgrades

[[#834](https://github.com/SeaQL/sea-orm/pull/834)] We have upgraded a few major dependencies:
- Upgrade [`sqlx`](https://github.com/launchbadge/sqlx) to 0.6
- Upgrade [`time`](https://github.com/time-rs/time) to 0.3
- Upgrade [`uuid`](https://github.com/uuid-rs/uuid) to 1.0
- Upgrade [`sea-query`](https://github.com/SeaQL/sea-query) to 0.26
- Upgrade [`sea-schema`](https://github.com/SeaQL/sea-schema) to 0.9

Note that you might need to upgrade the corresponding dependency on your application as well.

<div class="row">
    <div class="col col--8 margin-bottom--md">
        <div class="row">
            <div class="col col--12 margin-bottom--md">
                Proposed by:
            </div>
        </div>
        <div class="row">
            <div class="col col--6 margin-bottom--md">
                <div class="avatar">
                    <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/D1plo1d">
                        <img src="https://avatars.githubusercontent.com/u/145184?v=4" />
                    </a>
                    <div class="avatar__intro">
                        <div class="avatar__name">
                            Rob Gilson
                        </div>
                    </div>
                </div>
            </div>
            <div class="col col--6 margin-bottom--md">
                <div class="avatar">
                    <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/boraarslan">
                        <img src="https://avatars.githubusercontent.com/u/44371603?v=4" />
                    </a>
                    <div class="avatar__intro">
                        <div class="avatar__name">
                            boraarslan
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col col--4 margin-bottom--md">
        <div class="row">
            <div class="col col--12 margin-bottom--md">
                Contributed by:
            </div>
        </div>
        <div class="row">
            <div class="col col--12 margin-bottom--md">
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
    </div>
</div>

## Cursor Pagination

[[#822](https://github.com/SeaQL/sea-orm/pull/822)] Paginate models based on column(s) such as the primary key.

```rust
// Create a cursor that order by `cake`.`id`
let mut cursor = cake::Entity::find().cursor_by(cake::Column::Id);

// Filter paginated result by `cake`.`id` > 1 AND `cake`.`id` < 100
cursor.after(1).before(100);

// Get first 10 rows (order by `cake`.`id` ASC)
let rows: Vec<cake::Model> = cursor.first(10).all(db).await?;

// Get last 10 rows (order by `cake`.`id` DESC but rows are returned in ascending order)
let rows: Vec<cake::Model> = cursor.last(10).all(db).await?;
```

<div class="row">
    <div class="col col--4 margin-bottom--md">
        <div class="row">
            <div class="col col--12 margin-bottom--md">
                Proposed by:
            </div>
        </div>
        <div class="row">
            <div class="col col--12 margin-bottom--md">
                <div class="avatar">
                    <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/lberezy">
                        <img src="https://avatars.githubusercontent.com/u/5207383?v=4" />
                    </a>
                    <div class="avatar__intro">
                        <div class="avatar__name">
                            Lucas Berezy
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col col--8 margin-bottom--md">
        <div class="row">
            <div class="col col--12 margin-bottom--md">
                Contributed by:
            </div>
        </div>
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
    </div>
</div>

## Insert On Conflict

[[#791](https://github.com/SeaQL/sea-orm/pull/791)] Insert an active model with on conflict behaviour.

```rust
let orange = cake::ActiveModel {
    id: ActiveValue::set(2),
    name: ActiveValue::set("Orange".to_owned()),
};

// On conflict do nothing: 
//   - INSERT INTO "cake" ("id", "name") VALUES (2, 'Orange') ON CONFLICT ("name") DO NOTHING
cake::Entity::insert(orange.clone())
    .on_conflict(
        sea_query::OnConflict::column(cake::Column::Name)
            .do_nothing()
            .to_owned()
    )
    .exec(db)
    .await?;

// On conflict do update:
//   - INSERT INTO "cake" ("id", "name") VALUES (2, 'Orange') ON CONFLICT ("name") DO UPDATE SET "name" = "excluded"."name"
cake::Entity::insert(orange)
    .on_conflict(
        sea_query::OnConflict::column(cake::Column::Name)
            .update_column(cake::Column::Name)
            .to_owned()
    )
    .exec(db)
    .await?;
```

<div class="row">
    <div class="col col--6 margin-bottom--md">
        <div class="row">
            <div class="col col--12 margin-bottom--md">
                Proposed by:
            </div>
        </div>
        <div class="row">
            <div class="col col--12 margin-bottom--md">
                <div class="avatar">
                    <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/baoyachi">
                        <img src="https://avatars.githubusercontent.com/u/10433001?v=4" />
                    </a>
                    <div class="avatar__intro">
                        <div class="avatar__name">
                            baoyachi. Aka Rust Hairy crabs
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="row">
            <div class="col col--12 margin-bottom--md">
                Contributed by:
            </div>
        </div>
        <div class="row">
            <div class="col col--12 margin-bottom--md">
                <div class="avatar">
                    <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/liberwang1013">
                        <img src="https://avatars.githubusercontent.com/u/16575148?v=4" />
                    </a>
                    <div class="avatar__intro">
                        <div class="avatar__name">
                            liberwang1013
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

## Join Table with Custom Conditions and Table Alias

[[#793](https://github.com/SeaQL/sea-orm/pull/793), [#852](https://github.com/SeaQL/sea-orm/pull/852)] Click [Custom Join Conditions](https://www.sea-ql.org/SeaORM/docs/next/relation/custom-join-condition) and [Custom Joins](https://www.sea-ql.org/SeaORM/docs/next/advanced-query/custom-joins) to learn more.

```rust
assert_eq!(
    cake::Entity::find()
        .column_as(
            Expr::tbl(Alias::new("fruit_alias"), fruit::Column::Name).into_simple_expr(),
            "fruit_name"
        )
        .join_as(
            JoinType::LeftJoin,
            cake::Relation::Fruit
                .def()
                .on_condition(|_left, right| {
                    Expr::tbl(right, fruit::Column::Name)
                        .like("%tropical%")
                        .into_condition()
                }),
            Alias::new("fruit_alias")
        )
        .build(DbBackend::MySql)
        .to_string(),
    [
        "SELECT `cake`.`id`, `cake`.`name`, `fruit_alias`.`name` AS `fruit_name` FROM `cake`",
        "LEFT JOIN `fruit` AS `fruit_alias` ON `cake`.`id` = `fruit_alias`.`cake_id` AND `fruit_alias`.`name` LIKE '%tropical%'",
    ]
    .join(" ")
);
```

<div class="row">
    <div class="col col--6 margin-bottom--md">
        <div class="row">
            <div class="col col--12 margin-bottom--md">
                Proposed by:
            </div>
        </div>
        <div class="row">
            <div class="col col--12 margin-bottom--md">
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
            <div class="col col--12 margin-bottom--md">
                <div class="avatar">
                    <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/Tuetuopay">
                        <img src="https://avatars.githubusercontent.com/u/4009336?v=4" />
                    </a>
                    <div class="avatar__intro">
                        <div class="avatar__name">
                            Tuetuopay
                        </div>
                    </div>
                </div>
            </div>
            <div class="col col--12 margin-bottom--md">
                <div class="avatar">
                    <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/nag763">
                        <img src="https://avatars.githubusercontent.com/u/55486724?v=4" />
                    </a>
                    <div class="avatar__intro">
                        <div class="avatar__name">
                            Loïc
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="row">
            <div class="col col--12 margin-bottom--md">
                Contributed by:
            </div>
        </div>
        <div class="row">
            <div class="col col--12 margin-bottom--md">
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
            <div class="col col--12 margin-bottom--md">
                <div class="avatar">
                    <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/MattGson">
                        <img src="https://avatars.githubusercontent.com/u/20088009?v=4" />
                    </a>
                    <div class="avatar__intro">
                        <div class="avatar__name">
                            Matt
                        </div>
                    </div>
                </div>
            </div>
            <div class="col col--12 margin-bottom--md">
                <div class="avatar">
                    <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/liberwang1013">
                        <img src="https://avatars.githubusercontent.com/u/16575148?v=4" />
                    </a>
                    <div class="avatar__intro">
                        <div class="avatar__name">
                            liberwang1013
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

## (de)serialize Custom JSON Type

[[#794](https://github.com/SeaQL/sea-orm/pull/794)] JSON stored in the database could be deserialized into custom struct in Rust.

```rust
#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "json_struct")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    // JSON column defined in `serde_json::Value`
    pub json: Json,
    // JSON column defined in custom struct
    pub json_value: KeyValue,
    pub json_value_opt: Option<KeyValue>,
}

// The custom struct must derive `FromJsonQueryResult`, `Serialize` and `Deserialize`
#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, FromJsonQueryResult)]
pub struct KeyValue {
    pub id: i32,
    pub name: String,
    pub price: f32,
    pub notes: Option<String>,
}
```

<div class="row">
    <div class="col col--6 margin-bottom--md">
        <div class="row">
            <div class="col col--12 margin-bottom--md">
                Proposed by:
            </div>
        </div>
        <div class="row">
            <div class="col col--12 margin-bottom--md">
                <div class="avatar">
                    <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/mara214">
                        <img src="https://avatars.githubusercontent.com/u/37018485?v=4" />
                    </a>
                    <div class="avatar__intro">
                        <div class="avatar__name">
                            Mara Schulke
                        </div>
                    </div>
                </div>
            </div>
            <div class="col col--12 margin-bottom--md">
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
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="row">
            <div class="col col--12 margin-bottom--md">
                Contributed by:
            </div>
        </div>
        <div class="row">
            <div class="col col--12 margin-bottom--md">
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
    </div>
</div>

## Derived Migration Name

[[#736](https://github.com/SeaQL/sea-orm/pull/736)] Introduce `DeriveMigrationName` procedural macros to infer migration name from the file name.

```rust
use sea_orm_migration::prelude::*;

// Used to be...
pub struct Migration;

impl MigrationName for Migration {
    fn name(&self) -> &str {
        "m20220120_000001_create_post_table"
    }
}

// Now... derive `DeriveMigrationName`,
// no longer have to specify the migration name explicitly
#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table( ... )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table( ... )
            .await
    }
}
```

<div class="row">
    <div class="col col--4 margin-bottom--md">
        <div class="row">
            <div class="col col--12 margin-bottom--md">
                Proposed by:
            </div>
        </div>
        <div class="row">
            <div class="col col--12 margin-bottom--md">
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
        </div>
    </div>
    <div class="col col--8 margin-bottom--md">
        <div class="row">
            <div class="col col--12 margin-bottom--md">
                Contributed by:
            </div>
        </div>
        <div class="row">
            <div class="col col--6 margin-bottom--md">
                <div class="avatar">
                    <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/smonv">
                        <img src="https://avatars.githubusercontent.com/u/8962973?v=4" />
                    </a>
                    <div class="avatar__intro">
                        <div class="avatar__name">
                            smonv
                        </div>
                    </div>
                </div>
            </div>
            <div class="col col--6 margin-bottom--md">
                <div class="avatar">
                    <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/inf0rm4tik3r">
                        <img src="https://avatars.githubusercontent.com/u/9355833?v=4" />
                    </a>
                    <div class="avatar__intro">
                        <div class="avatar__name">
                            Lukas Potthast
                        </div>
                    </div>
                </div>
            </div>
            <div class="col col--6 margin-bottom--md">
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
    </div>
</div>

## SeaORM CLI Improvements

- [[#735](https://github.com/SeaQL/sea-orm/pull/735)] Improve logging of generate entity command
- [[#588](https://github.com/SeaQL/sea-orm/pull/588)] Generate enum with numeric like variants
- [[#755](https://github.com/SeaQL/sea-orm/pull/755)] Allow old pending migration to be applied
- [[#837](https://github.com/SeaQL/sea-orm/pull/837)] Skip generating entity for ignored tables
- [[#724](https://github.com/SeaQL/sea-orm/pull/724)] Generate code for `time` crate
- [[#850](https://github.com/SeaQL/sea-orm/pull/850)] Add various blob column types
- [[#422](https://github.com/SeaQL/sea-orm/pull/422)] Generate entity files with Postgres's schema name
- [[#851](https://github.com/SeaQL/sea-orm/pull/851)] Skip checking connection string for credentials

<div class="row">
    <div class="col col--12 margin-bottom--md">
        Proposed & Contributed by:
    </div>
    <div class="col col--4 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/ttys3">
                <img src="https://avatars.githubusercontent.com/u/41882455?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    ttys3
                </div>
            </div>
        </div>
    </div>
    <div class="col col--4 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/kyoto7250">
                <img src="https://avatars.githubusercontent.com/u/50972773?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    kyoto7250
                </div>
            </div>
        </div>
    </div>
    <div class="col col--4 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/yb3616">
                <img src="https://avatars.githubusercontent.com/u/8839021?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    yb3616
                </div>
            </div>
        </div>
    </div>
    <div class="col col--4 margin-bottom--md">
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
    <div class="col col--4 margin-bottom--md">
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
    <div class="col col--4 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/nahuakang">
                <img src="https://avatars.githubusercontent.com/u/18533347?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Nahua
                </div>
            </div>
        </div>
    </div>
    <div class="col col--4 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/hunjixin">
                <img src="https://avatars.githubusercontent.com/u/41407352?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Mike
                </div>
            </div>
        </div>
    </div>
    <div class="col col--4 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/frankhorv">
                <img src="https://avatars.githubusercontent.com/u/6849119?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Frank Horvath
                </div>
            </div>
        </div>
    </div>
    <div class="col col--4 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/maikelwever">
                <img src="https://avatars.githubusercontent.com/u/1009019?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Maikel Wever
                </div>
            </div>
        </div>
    </div>
</div>

## Miscellaneous Enhancements

- [[#800](https://github.com/SeaQL/sea-orm/pull/800)] Added `sqlx_logging_level` to `ConnectOptions`
- [[#768](https://github.com/SeaQL/sea-orm/pull/768)] Added `num_items_and_pages` to `Paginator`
- [[#849](https://github.com/SeaQL/sea-orm/pull/849)] Added `TryFromU64` for `time`
- [[#853](https://github.com/SeaQL/sea-orm/pull/853)] Include column name in `TryGetError::Null`
- [[#778](https://github.com/SeaQL/sea-orm/pull/778)] Refactor stream metrics

<div class="row">
    <div class="col col--12 margin-bottom--md">
        Proposed & Contributed by:
    </div>
    <div class="col col--4 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/SandaruKasa">
                <img src="https://avatars.githubusercontent.com/u/50824690?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    SandaruKasa
                </div>
            </div>
        </div>
    </div>
    <div class="col col--4 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/fistons">
                <img src="https://avatars.githubusercontent.com/u/972209?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Eric
                </div>
            </div>
        </div>
    </div>
    <div class="col col--4 margin-bottom--md">
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
    <div class="col col--4 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/dinhani">
                <img src="https://avatars.githubusercontent.com/u/1139781?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Renato Dinhani
                </div>
            </div>
        </div>
    </div>
    <div class="col col--4 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/kyoto7250">
                <img src="https://avatars.githubusercontent.com/u/50972773?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    kyoto7250
                </div>
            </div>
        </div>
    </div>
    <div class="col col--4 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/nappa85">
                <img src="https://avatars.githubusercontent.com/u/7566389?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Marco Napetti
                </div>
            </div>
        </div>
    </div>
</div>

## Integration Examples

SeaORM plays well with the other crates in the async ecosystem. We maintain an array of example projects for building REST, GraphQL and gRPC services. More examples [wanted](https://github.com/SeaQL/sea-orm/issues/269)!

- [Actix v4 Example](https://github.com/SeaQL/sea-orm/tree/master/examples/actix_example)
- [Actix v3 Example](https://github.com/SeaQL/sea-orm/tree/master/examples/actix3_example)
- [Axum Example](https://github.com/SeaQL/sea-orm/tree/master/examples/axum_example)
- [GraphQL Example](https://github.com/SeaQL/sea-orm/tree/master/examples/graphql_example)
- [jsonrpsee Example](https://github.com/SeaQL/sea-orm/tree/master/examples/jsonrpsee_example)
- [Poem Example](https://github.com/SeaQL/sea-orm/tree/master/examples/poem_example)
- [Rocket Example](https://github.com/SeaQL/sea-orm/tree/master/examples/rocket_example)
- [Salvo Example](https://github.com/SeaQL/sea-orm/tree/master/examples/salvo_example)
- [Tonic Example](https://github.com/SeaQL/sea-orm/tree/master/examples/tonic_example)

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

Here is the roadmap for SeaORM [`0.10.x`](https://github.com/SeaQL/sea-orm/milestone/10).
