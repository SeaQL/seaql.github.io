---
slug: 2021-10-15-whats-new-in-0.3.0
title: What's new in SeaORM 0.3.0
author: Chris Tsang
author_title: SeaQL Team
author_url: https://github.com/tyt2y3
author_image_url: https://avatars.githubusercontent.com/u/1782664?v=4
tags: [news]
---

We are pleased to release SeaORM [`0.3.0`](https://github.com/SeaQL/sea-orm/releases/tag/0.3.0) today. Some feature highlights:

## Connect Options

[[@c673017](https://github.com/SeaQL/sea-orm/commit/c673017b975e3cf9e3127d6719b8fc97a140f5f3)] Configure [DatabaseConnection](https://docs.rs/sea-orm/0.3.0/sea_orm/enum.DatabaseConnection.html) with [ConnectOptions](https://docs.rs/sea-orm/0.*/sea_orm/struct.ConnectOptions.html), you can change the default settings such as the maximum and minimum number of connections managed by the connection pool.

```rust
let mut opt = ConnectOptions::new("protocol://username:password@host/database".to_owned());
opt.max_connections(100)
    .min_connections(5)
    .connect_timeout(Duration::from_secs(8))
    .idle_timeout(Duration::from_secs(8));

let db = Database::connect(opt).await?;
```

Contributed by:

<div class="col col--3 margin-bottom--md">
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

## Transaction

[[#222](https://github.com/SeaQL/sea-orm/pull/222)] [[#199](https://github.com/SeaQL/sea-orm/pull/199)] [[#142](https://github.com/SeaQL/sea-orm/pull/142)] Perform atomic actions with the help of transaction.

Two transaction API are provided:
- `begin` the transaction follow by `commit` or `rollback`
- perform actions in transaction `closure`

```rust
// Transaction begin ... commit / rollback
let txn = db.begin().await?;

bakery::ActiveModel {
    name: Set("SeaSide Bakery".to_owned()),
    profit_margin: Set(10.4),
    ..Default::default()
}
.save(&txn)
.await?;

bakery::ActiveModel {
    name: Set("Top Bakery".to_owned()),
    profit_margin: Set(15.0),
    ..Default::default()
}
.save(&txn)
.await?;

txn.commit().await?;
```

```rust
// Transaction closure
db.transaction::<_, _, DbErr>(|txn| {
    Box::pin(async move {
        bakery::ActiveModel {
            name: Set("SeaSide Bakery".to_owned()),
            profit_margin: Set(10.4),
            ..Default::default()
        }
        .save(txn)
        .await?;

        bakery::ActiveModel {
            name: Set("Top Bakery".to_owned()),
            profit_margin: Set(15.0),
            ..Default::default()
        }
        .save(txn)
        .await?;

        Ok(())
    })
})
.await;
```

Contributed by:

<div class="row">
    <div class="col col--3 margin-bottom--md">
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
    <div class="col col--3 margin-bottom--md">
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

## Community

SeaQL is a community driven project. We welcome you to participate, contribute and together build for Rust's future.

Here is the roadmap for SeaORM [`0.4.x`](https://github.com/SeaQL/sea-orm/milestone/4).