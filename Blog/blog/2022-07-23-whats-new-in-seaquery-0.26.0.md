---
slug: 2022-07-23-whats-new-in-seaquery-0.26.0
title: What's new in SeaQuery 0.26.0
author: SeaQL Team
author_title: Ivan Krivosheev
author_url: https://github.com/SeaQL
author_image_url: https://www.sea-ql.org/SeaORM/img/SeaQL.png
tags: [news]
---

🎉 We are pleased to release SeaQuery [`0.26.0`](https://github.com/SeaQL/sea-query/releases/tag/0.26.0) today! Here are some feature highlights 🌟:

## Dependency Upgrades

[[#356](https://github.com/SeaQL/sea-query/issues/356)] We have upgraded a few major dependencies:
- Upgrade [`sqlx`](https://github.com/launchbadge/sqlx) to 0.6
- Upgrade [`time`](https://github.com/time-rs/time) to 0.3
- Upgrade [`uuid`](https://github.com/uuid-rs/uuid) to 1.0
- Upgrade [`bigdecimal`](https://github.com/akubera/bigdecimal-rs) to 0.3
- Upgrade [`ipnetwork`](https://github.com/achanda/ipnetwork) to 0.19

Note that you might need to upgrade the corresponding dependency on your application as well.

## Add support for VALUES lists in PostgreSQL backend

[[#351]](https://github.com/SeaQL/sea-query/issues/350)] 

## Introduce sea-query-binder

[[#273](https://github.com/SeaQL/sea-query/issues/273)]

## Support LIKE ESCAPE 

[[#352](https://github.com/SeaQL/sea-query/pull/352)]
[[#353](https://github.com/SeaQL/sea-query/pull/353)]

## Add method to make column nullable

[[#365](https://github.com/SeaQL/sea-query/pull/365)]

## Add is/is\_not to Expr

[[#348](https://github.com/SeaQL/sea-query/pull/348)]

## Add in\_tuple method

[[#345](https://github.com/SeaQL/sea-query/pull/345)]

## Integration Examples

SeaQuery plays well with the other crates in the rust ecosystem. 

- [Postgres Example](https://github.com/SeaQL/sea-query/tree/master/examples/postgres)
- [Rusqlute Example](https://github.com/SeaQL/sea-query/tree/master/examples/rusqlite)
- [SQLx Any Example](https://github.com/SeaQL/sea-query/tree/master/examples/sqlx_any)
- [SQLx Postgres Example](https://github.com/SeaQL/sea-query/tree/master/examples/sqlx_postgres)
- [SQLx MySql Example](https://github.com/SeaQL/sea-query/tree/master/examples/sqlx_mysql)
- [SQLx Sqlite Example](https://github.com/SeaQL/sea-query/tree/master/examples/sqlx_sqlite)

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

