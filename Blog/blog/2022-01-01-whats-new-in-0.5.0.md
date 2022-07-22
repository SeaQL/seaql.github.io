---
slug: 2022-01-01-whats-new-in-0.5.0
title: What's new in SeaORM 0.5.0
author: SeaQL Team
author_title: Chris Tsang
author_url: https://github.com/SeaQL
author_image_url: https://www.sea-ql.org/SeaORM/img/SeaQL.png
tags: [news]
---

🎉 We are pleased to release SeaORM [`0.5.0`](https://github.com/SeaQL/sea-orm/releases/tag/0.5.0) today! Here are some feature highlights 🌟:

## Insert and Update Return `Model`

[[#339](https://github.com/SeaQL/sea-orm/pull/339)] As asked and requested by many of our community members. You can now get the refreshed `Model` after insert or update operations. If you want to mutate the model and save it back to the database you can convert it into `ActiveModel` with the method `into_active_model`.

Breaking Changes:
- `ActiveModel::insert` and `ActiveModel::update` return `Model` instead of `ActiveModel`
- Method `ActiveModelBehavior::after_save` takes `Model` as input instead of `ActiveModel`

```rust
// Construct a `ActiveModel`
let active_model = ActiveModel {
    name: Set("Classic Vanilla Cake".to_owned()),
    ..Default::default()
};
// Do insert
let cake: Model = active_model.insert(db).await?;
assert_eq!(
    cake,
    Model {
        id: 1,
        name: "Classic Vanilla Cake".to_owned(),
    }
);

// Covert `Model` into `ActiveModel`
let mut active_model = cake.into_active_model();
// Change the name of cake
active_model.name = Set("Chocolate Cake".to_owned());
// Do update
let cake: Model = active_model.update(db).await?;
assert_eq!(
    cake,
    Model {
        id: 1,
        name: "Chocolate Cake".to_owned(),
    }
);

// Do delete
cake.delete(db).await?;
```

<div class="row">
    <div class="col col--6 margin-bottom--md">
        Proposed by:
        <br/><br/>
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/nicoulaj">
                <img src="https://avatars.githubusercontent.com/u/3162?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Julien Nicoulaud
                </div>
            </div>
        </div>
        <br/>
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/edg-l">
                <img src="https://avatars.githubusercontent.com/u/15859336?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Edgar
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

## `ActiveValue` Revamped

[[#340](https://github.com/SeaQL/sea-orm/pull/340)] The `ActiveValue` is now defined as an enum instead of a struct. The public API of it remains unchanged, except `Unset` was deprecated and `ActiveValue::NotSet` should be used instead.

Breaking Changes:
- Rename method `sea_orm::unchanged_active_value_not_intended_for_public_use` to `sea_orm::Unchanged`
- Rename method `ActiveValue::unset` to `ActiveValue::not_set`
- Rename method `ActiveValue::is_unset` to `ActiveValue::is_not_set`
- `PartialEq` of `ActiveValue` will also check the equality of state instead of just checking the equality of value

```rust
/// Defines a stateful value used in ActiveModel.
pub enum ActiveValue<V>
where
    V: Into<Value>,
{
    /// A defined [Value] actively being set
    Set(V),
    /// A defined [Value] remain unchanged
    Unchanged(V),
    /// An undefined [Value]
    NotSet,
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

## SeaORM CLI & Codegen Updates

Install latest version of `sea-orm-cli`:

```sh
cargo install sea-orm-cli
```

Updates related to entity files generation (`cargo generate entity`):

- [[#348](https://github.com/SeaQL/sea-orm/pull/348)] Discovers and defines PostgreSQL enums
- [[#386](https://github.com/SeaQL/sea-orm/pull/386)] Supports SQLite database, you can generate entity files from all supported databases including MySQL, PostgreSQL and SQLite

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

## Tracing

[[#373](https://github.com/SeaQL/sea-orm/pull/373)] You can trace the query executed by SeaORM with `debug-print` feature enabled and [`tracing-subscriber`](https://crates.io/crates/tracing-subscriber) up and running.

```rust
pub async fn main() {
    tracing_subscriber::fmt()
        .with_max_level(tracing::Level::DEBUG)
        .with_test_writer()
        .init();

    // ...
}
```

Contributed by:

<div class="row">
    <div class="col col--6 margin-bottom--md">
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

## Sponsor

Our [GitHub Sponsor](https://github.com/sponsors/SeaQL) profile is up! If you feel generous, a small donation will be greatly appreciated.

A big shout out to our sponsors 😇:

<div class="row">
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
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/praveenperera">
                <img src="https://avatars.githubusercontent.com/u/1775346?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Praveen Perera
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

Here is the roadmap for SeaORM [`0.6.x`](https://github.com/SeaQL/sea-orm/milestone/6).