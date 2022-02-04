---
slug: 2022-02-01-whats-new-in-0.6.0
title: What's new in SeaORM 0.6.0
author: SeaQL Team
author_title: Chris Tsang
author_url: https://github.com/SeaQL
author_image_url: https://www.sea-ql.org/SeaORM/img/SeaQL.png
tags: [news]
---

🎉 We are pleased to release SeaORM [`0.6.0`](https://github.com/SeaQL/sea-orm/releases/tag/0.6.0) today! Here are some feature highlights 🌟:

## Migration

[[#335](https://github.com/SeaQL/sea-orm/pull/335)] Version control you database schema with migrations written in SeaQuery or in raw SQL. View [migration docs](#) to learn more.

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
2. Define the migration in SeaQuery.
    ```rust
    use sea_schema::migration::{
        sea_query::{self, *},
        *,
    };

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
    Appling all pending migrations
    Appling migration 'm20220101_000001_create_table'
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

## Insert with Default Values

[[#432](https://github.com/SeaQL/sea-orm/pull/432)] Insert an active model with its database's default values.

```rust
let pear = fruit::ActiveModel {
    ..Default::default() // all attributes are `NotSet`
};

// The SQL statement:
//   - MySQL: INSERT INTO `fruit` VALUES (DEFAULT)
//   - SQLite: INSERT INTO "fruit" DEFAULT VALUES
//   - PostgreSQL: INSERT INTO "fruit" DEFAULT VALUES RETURNING "id", "name", "cake_id"
let res: InsertResult = fruit::Entity::insert(pear).exec(db).await?;
```

<div class="row">
    <div class="col col--6 margin-bottom--md">
        Proposed by:
        <br/><br/>
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/Crypto-Virus">
                <img src="https://avatars.githubusercontent.com/u/6034171?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Crypto-Virus
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

## Set ActiveModel from JSON value

[[#492](https://github.com/SeaQL/sea-orm/pull/492)] If you want to save user input into the database you can easily convert JSON value into `ActiveModel`.

Set the attributes in `ActiveModel` with `set_from_json` method.

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
```

Create a new `ActiveModel` from JSON value with the `from_json` method.

```rust
let fruit = fruit::ActiveModel::from_json(json!({
    "name": "Apple",
}))?;
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

[[#455](https://github.com/SeaQL/sea-orm/pull/455)]

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

[[#493](https://github.com/SeaQL/sea-orm/pull/493)] You can set the maximum lifetime of individual connections with the `max_lifetime` method.

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

- [[#397](https://github.com/SeaQL/sea-orm/pull/397)] Map MySQL unsigned integer columns to `u8`, `u16`, `u32` and `u64` respectively
- [[#433](https://github.com/SeaQL/sea-orm/pull/433)] Generate the `column_name` macro attribute for column which is not in snake case
- [[#422](https://github.com/SeaQL/sea-orm/pull/422)] Generate the `schema_name` macro attribute for PostgreSQL's entity
- [[#463](https://github.com/SeaQL/sea-orm/pull/463)] Generate Serde's `Serialize` and `Deserialize` derive macros for Enums

<div class="row">
    <div class="col col--6 margin-bottom--md">
        Proposed by:
        <br/><br/>
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
        <br/>
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
        <br/>
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/frankhorv">
                <img src="https://avatars.githubusercontent.com/u/6849119?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    frankhorv
                </div>
            </div>
        </div>
        <br/>
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/BenJeau">
                <img src="https://avatars.githubusercontent.com/u/22248828?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Benoît Jeaurond
                </div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        Contributed by:
        <br/><br/>
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/BenJeau">
                <img src="https://avatars.githubusercontent.com/u/22248828?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Benoît Jeaurond
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