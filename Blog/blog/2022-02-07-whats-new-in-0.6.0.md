---
slug: 2022-02-07-whats-new-in-0.6.0
title: What's new in SeaORM 0.6.0
author: SeaQL Team
author_title: Chris Tsang
author_url: https://github.com/SeaQL
author_image_url: https://www.sea-ql.org/SeaORM/img/SeaQL.png
tags: [news]
---

🎉 We are pleased to release SeaORM [`0.6.0`](https://github.com/SeaQL/sea-orm/releases/tag/0.6.0) today! Here are some feature highlights 🌟:

## Migration

[[#335](https://github.com/SeaQL/sea-orm/pull/335)] Version control you database schema with migrations written in SeaQuery or in raw SQL. View [migration docs](/SeaORM/docs/migration/setting-up-migration) to learn more.

1. Setup the migration directory by executing `sea-orm-cli migrate init`.
    ```
    migration
    ├── Cargo.toml
    ├── README.md
    └── src
        ├── lib.rs
        ├── m20220101_000001_create_table.rs
        └── main.rs
    ```
2. Defines the migration in SeaQuery.
    ```rust
    use sea_schema::migration::prelude::*;

    pub struct Migration;

    impl MigrationName for Migration {
        fn name(&self) -> &str {
            "m20220101_000001_create_table"
        }
    }

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
3. Apply the migration by executing `sea-orm-cli migrate`.
    ```shell
    $ sea-orm-cli migrate
    Applying all pending migrations
    Applying migration 'm20220101_000001_create_table'
    Migration 'm20220101_000001_create_table' has been applied
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

## Support DateTimeUtc & DateTimeLocal in Model

[[#489](https://github.com/SeaQL/sea-orm/pull/489)] Represents database's timestamp column in Model with attribute of type `DateTimeLocal` (`chrono::DateTime<Local>`) or `DateTimeUtc` (`chrono::DateTime<Utc>`).

```rust
#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "satellite")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub satellite_name: String,
    pub launch_date: DateTimeUtc,
    pub deployment_date: DateTimeLocal,
}
```

<div class="row">
    <div class="col col--6 margin-bottom--md">
        Proposed by:
        <br/><br/>
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/lz1998">
                <img src="https://avatars.githubusercontent.com/u/9082086?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    lz1998
                </div>
            </div>
        </div>
        <br/>
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
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/charleschege">
                <img src="https://avatars.githubusercontent.com/u/33346042?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Charles·Chege
                </div>
            </div>
        </div>
        <br/>
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

## Mock Join Results

[[#455](https://github.com/SeaQL/sea-orm/pull/455)] Constructs mock results of related model with tuple of model.

```rust
let db = MockDatabase::new(DbBackend::Postgres)
    // Mocking result of cake with its related fruit
    .append_query_results(vec![vec![(
        cake::Model {
            id: 1,
            name: "Apple Cake".to_owned(),
        },
        fruit::Model {
            id: 2,
            name: "Apple".to_owned(),
            cake_id: Some(1),
        },
    )]])
    .into_connection();

assert_eq!(
    cake::Entity::find()
        .find_also_related(fruit::Entity)
        .all(&db)
        .await?,
    vec![(
        cake::Model {
            id: 1,
            name: "Apple Cake".to_owned(),
        },
        Some(fruit::Model {
            id: 2,
            name: "Apple".to_owned(),
            cake_id: Some(1),
        })
    )]
);
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
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/cemoktra">
                <img src="https://avatars.githubusercontent.com/u/15634263?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Bastian
                </div>
            </div>
        </div>
        <br/>
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

## Support Max Connection Lifetime Option

[[#493](https://github.com/SeaQL/sea-orm/pull/493)] You can set the maximum lifetime of individual connection with the `max_lifetime` method.

```rust
let mut opt = ConnectOptions::new("protocol://username:password@host/database".to_owned());
opt.max_lifetime(Duration::from_secs(8))
    .max_connections(100)
    .min_connections(5)
    .connect_timeout(Duration::from_secs(8))
    .idle_timeout(Duration::from_secs(8))
    .sqlx_logging(true);

let db = Database::connect(opt).await?;
```

<div class="row">
    <div class="col col--6 margin-bottom--md">
        Proposed by:
        <br/><br/>
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


## SeaORM CLI & Codegen Updates

- [[#433](https://github.com/SeaQL/sea-orm/pull/433)] Generates the `column_name` macro attribute for column which is not named in snake case
- [[#335](https://github.com/SeaQL/sea-orm/pull/335)] Introduces migration subcommands `sea-orm-cli migrate`

<div class="row">
    <div class="col col--6 margin-bottom--md">
        Proposed by:
        <br/><br/>
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/Gabriel-Paulucci">
                <img src="https://avatars.githubusercontent.com/u/43076727?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Gabriel Paulucci
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

Here is the roadmap for SeaORM [`0.7.x`](https://github.com/SeaQL/sea-orm/milestone/7).