---
slug: 2022-05-15-whats-new-in-0.8.0
title: What's new in SeaORM 0.8.0
author: SeaQL Team
author_title: Chris Tsang
author_url: https://github.com/SeaQL
author_image_url: https://www.sea-ql.org/SeaORM/img/SeaQL.png
tags: [news]
---

🎉 We are pleased to release SeaORM [`0.8.0`](https://github.com/SeaQL/sea-orm/releases/tag/0.8.0) today! Here are some feature highlights 🌟:

## Migration Utilities Moved to `sea-orm-migration` crate

[[#666](https://github.com/SeaQL/sea-orm/pull/666)] Utilities of SeaORM migration have been moved from `sea-schema` to `sea-orm-migration` crate. Users are advised to upgrade from older versions with the following steps:

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

[[#656](https://github.com/SeaQL/sea-orm/pull/656)] You can create a new migration with the `migrate generate` subcommand. This simplifies the migration process, as new migrations no longer need to be added manually.

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

[[#589](https://github.com/SeaQL/sea-orm/pull/589)] Insert a row populate with default values. Note that the target table should have default values defined for all of its columns.

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

## Checking if an `ActiveModel` is changed

[[#683](https://github.com/SeaQL/sea-orm/pull/683)] You can check whether any field in an `ActiveModel` is `Set` with the help of the `is_changed` method.

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

## Integration Examples

SeaORM plays well with the other crates in the async ecosystem. It can be integrated easily with common RESTful frameworks and also gRPC frameworks; check out our new [Tonic example](https://github.com/SeaQL/sea-orm/tree/master/examples/tonic_example) to see how it works. More examples [wanted](https://github.com/SeaQL/sea-orm/issues/269)!

- [Rocket Example](https://github.com/SeaQL/sea-orm/tree/master/examples/rocket_example)
- [Actix Example](https://github.com/SeaQL/sea-orm/tree/master/examples/actix_example)
- [Axum Example](https://github.com/SeaQL/sea-orm/tree/master/examples/axum_example)
- [Poem Example](https://github.com/SeaQL/sea-orm/tree/master/examples/poem_example)
- [GraphQL Example](https://github.com/SeaQL/sea-orm/tree/master/examples/graphql_example)
- [jsonrpsee Example](https://github.com/SeaQL/sea-orm/tree/master/examples/jsonrpsee_example)
- [Tonic Example](https://github.com/SeaQL/sea-orm/tree/master/examples/tonic_example)

## Who's using SeaORM?

The following products are powered by SeaORM:

<table>
  <tbody>
    <tr>
      <td><br/><a href="https://caido.io/"><img src="https://www.sea-ql.org/SeaORM/img/other/caido-logo.png" width="250"/></a><br/>A lightweight web security auditing toolkit</td>
      <td><a href="https://l2.technology/sensei"><img src="https://www.sea-ql.org/SeaORM/img/other/sensei-logo.svg" width="250"/></a><br/>A Bitcoin lightning node implementation</td>
      <td><a href="https://www.svix.com/"><img src="https://www.sea-ql.org/SeaORM/img/other/svix-logo.svg" width="250"/></a><br/>The enterprise ready webhooks service</td>
    </tr>
  </tbody>
</table>

SeaORM is the foundation of [StarfishQL](https://github.com/SeaQL/starfish-ql), an experimental graph database and query engine.

For more projects, see [Built with SeaORM](https://github.com/SeaQL/sea-orm/blob/master/COMMUNITY.md#built-with-seaorm).

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

Here is the roadmap for SeaORM [`0.9.x`](https://github.com/SeaQL/sea-orm/milestone/9).

## GSoC 2022

We are super excited to be selected as a Google Summer of Code 2022 [mentor organization](https://summerofcode.withgoogle.com/programs/2022/organizations/seaql). The application is now closed, but the program is about to start! If you have thoughts over how we are going to implement the [project ideas](https://github.com/SeaQL/summer-of-code/tree/main/2022), feel free to participate in the discussion.
