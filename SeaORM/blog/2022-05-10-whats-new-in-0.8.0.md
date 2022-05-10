---
slug: 2022-05-10-whats-new-in-0.8.0
title: What's new in SeaORM 0.8.0
author: SeaQL Team
author_title: Chris Tsang
author_url: https://github.com/SeaQL
author_image_url: https://www.sea-ql.org/SeaORM/img/SeaQL.png
tags: [news]
---

🎉 We are pleased to release SeaORM [`0.8.0`](https://github.com/SeaQL/sea-orm/releases/tag/0.8.0) today! Here are some feature highlights 🌟:

## Migration Utilities Moved to `sea-orm-migration` crate

[[#666](https://github.com/SeaQL/sea-orm/pull/666)] Utilities of SeaORM migration has been moved from `sea-schema` to `sea-orm-migration` crate. Users are advised to upgrade from older version by following the steps below:

1. Bump `sea-orm` version to `0.8.0`.
2. Replace `sea-schema` dependency with `sea-orm-migration` in your `migration` crate.
    ```diff title=migration/Cargo.toml
    [dependencies]
    - sea-schema = { version = "^0.7.0", ... }
    + sea-orm-migration = { version = "^0.8.0" }
    ```
3. Find and replace `use sea_schema::migration::` with `use sea_orm_migration::` in your `migration` crate.
    ```diff
    - use sea_schema::migration::prelude::*;
    + use sea_orm_migration::prelude::*;

    - use sea_schema::migration::*;
    + use sea_orm_migration::*;
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

## Generating New Migration

[[#656](https://github.com/SeaQL/sea-orm/pull/656)] You can create a new migration with `migrate generate` subcommand. This simplifies the migration process, new migrations no longer need to be added manually.

```shell
# A migration file `MIGRATION_DIR/src/mYYYYMMDD_HHMMSS_create_product_table.rs` will be created.
# And, the migration file will be imported and included in the migrator located at `MIGRATION_DIR/src/lib.rs`.
sea-orm-cli migrate generate create_product_table
```

<div class="row">
    <div class="col col--6 margin-bottom--md">
        Proposed & Contributed by:
        <br/><br/>
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/viktorbahr">
                <img src="https://avatars.githubusercontent.com/u/8578264?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Viktor Bahr
                </div>
            </div>
        </div>
    </div>
</div>

## Inserting One with Default

[[#589](https://github.com/SeaQL/sea-orm/pull/589)] Insert a row populate with default values. Note that the target table should have default value for all of its columns.

```rust
let pear = fruit::ActiveModel {
    ..Default::default() // all attributes are `NotSet`
};

// The SQL statement:
//   - MySQL: INSERT INTO `fruit` VALUES ()
//   - SQLite: INSERT INTO "fruit" DEFAULT VALUES
//   - PostgreSQL: INSERT INTO "fruit" VALUES (DEFAULT) RETURNING "id", "name", "cake_id"
let pear: fruit::Model = pear.insert(db).await?;
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

## Checking `ActiveModel` are changed

[[#683](https://github.com/SeaQL/sea-orm/pull/683)] You can check any field in the `ActiveModel` are `Set` with the help of `is_changed` method.

```rust
let mut fruit: fruit::ActiveModel = Default::default();
assert!(!fruit.is_changed());

fruit.set(fruit::Column::Name, "apple".into());
assert!(fruit.is_changed());
```

<div class="row">
    <div class="col col--6 margin-bottom--md">
        Proposed by:
        <br/><br/>
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/kudlatyamroth">
                <img src="https://avatars.githubusercontent.com/u/2165237?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Karol Fuksiewicz
                </div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        Contributed by:
        <br/><br/>
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/kirawi">
                <img src="https://avatars.githubusercontent.com/u/67773714?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Kirawi
                </div>
            </div>
        </div>
    </div>
</div>

## Minor Improvements

- [[#670](https://github.com/SeaQL/sea-orm/pull/670)] Add `max_connections` option to `sea-orm-cli generate entity` subcommand
- [[#677](https://github.com/SeaQL/sea-orm/pull/677)] Derive `Eq` and `Clone` for `DbErr`

<div class="row">
    <div class="col col--6 margin-bottom--md">
        Proposed & Contributed by:
        <br/><br/>
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/benluelo">
                <img src="https://avatars.githubusercontent.com/u/57334811?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    benluelo
                </div>
            </div>
        </div>
        <br/>
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/SebastienGllmt">
                <img src="https://avatars.githubusercontent.com/u/2608559?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Sebastien Guillemot
                </div>
            </div>
        </div>
    </div>
</div>

## Community

SeaQL is a community driven project. We welcome you to participate, contribute and together build for Rust's future.

Here is the roadmap for SeaORM [`0.9.x`](https://github.com/SeaQL/sea-orm/milestone/9).