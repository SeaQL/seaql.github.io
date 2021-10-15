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

<div class="row">
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

## Transaction

[[#222](https://github.com/SeaQL/sea-orm/pull/222)] [[#199](https://github.com/SeaQL/sea-orm/pull/199)] [[#142](https://github.com/SeaQL/sea-orm/pull/142)] Perform atomic actions with the help of transaction.

Two transaction API are provided:

- `begin` the transaction follow by `commit` or `rollback`
    ```rust
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

- perform atomic actions in transaction `closure`
    ```rust
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

## API for Custom Validation Logics on Save & Delete

[[#210](https://github.com/SeaQL/sea-orm/pull/210)] You can now enforce custom validation logics before or after save and delete operation.

```rust
impl ActiveModelBehavior for ActiveModel {
    // Override default values
    fn new() -> Self {
        Self {
            serial: Set(Uuid::new_v4()),
            ..ActiveModelTrait::default()
        }
    }

    // Triggered before insert / update
    fn before_save(self, insert: bool) -> Result<Self, DbErr> {
        if self.price.as_ref() <= &0.0 {
            Err(DbErr::Custom(format!(
                "[before_save] Invalid Price, insert: {}",
                insert
            )))
        } else {
            Ok(self)
        }
    }

    // Triggered after insert / update
    fn after_save(self, insert: bool) -> Result<Self, DbErr> {
        Ok(self)
    }

    // Triggered before delete
    fn before_delete(self) -> Result<Self, DbErr> {
        Ok(self)
    }

    // Triggered after delete
    fn after_delete(self) -> Result<Self, DbErr> {
        Ok(self)
    }
}
```

Contributed by:

<div class="row">
    <div class="col col--3 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/MuhannadAlrusayni">
                <img src="https://avatars.githubusercontent.com/u/14802524?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Muhannad
                </div>
            </div>
        </div>
    </div>
    <div class="col col--3 margin-bottom--md">
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

## Generate Entity Models That Derive Serialize / Deserialize

[[#237](https://github.com/SeaQL/sea-orm/pull/237)] You can use sea-orm-cli to generate entity models that derive serde Serialize / Deserialize traits.

```rust
//! SeaORM Entity. Generated by sea-orm-codegen 0.3.0

use sea_orm::entity::prelude:: * ;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Serialize, Deserialize)]
#[sea_orm(table_name = "cake")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    #[sea_orm(column_type = "Text", nullable)]
    pub name: Option<String> ,
}

// ...
```

Contributed by:

<div class="row">
    <div class="col col--3 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/elbart">
                <img src="https://avatars.githubusercontent.com/u/48974?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Tim Eggert
                </div>
            </div>
        </div>
    </div>
</div>

## Introduce Derive DeriveIntoActiveModel & IntoActiveValue Trait

[[#240](https://github.com/SeaQL/sea-orm/pull/240)] Creates a new derive macro DeriveIntoActiveModel for implementing IntoActiveModel on structs. This is useful for creating your own struct with only partial fields of a model, for example an insert struct, or update struct.

```rust
// Define regular model as usual
#[derive(Clone, Debug, PartialEq, DeriveModel, DeriveActiveModel)]
#[sea_orm(table_name = "users")]
pub struct Model {
    pub id: Uuid,
    pub created_at: DateTimeWithTimeZone,
    pub updated_at: DateTimeWithTimeZone,
    pub email: String,
    pub password: String,
    pub full_name: Option<String>,
    pub phone: Option<String>,
}

// Create a new struct with some fields omitted
#[derive(DeriveIntoActiveModel)]
pub struct NewUser {
    // id, created_at and updated_at are omitted from this struct,
    // and will always be `ActiveValue::unset`
    pub email: String,
    pub password: String,
    // Full name is usually optional, but it can be required here
    pub full_name: String,
    // Option implements `IntoActiveValue`, and when `None` will be `unset`
    pub phone: Option<String>,
}

#[derive(DeriveIntoActiveModel)]
pub struct UpdateUser {
    // Option<Option<T>> allows for Some(None) to update the column to be NULL
    pub phone: Option<Option<String>>,
}
```

Additionally, an attribute active_model is available in case your active model struct has a custom name.

```rust
#[derive(DeriveIntoActiveModel)]
#[sea_orm(active_model = MyActiveModel)]
pub struct NewProduct {
    // ...
}
```

Contributed by:

<div class="row">
    <div class="col col--3 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/Acidic9">
                <img src="https://avatars.githubusercontent.com/u/16362377?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Ari Seyhun
                </div>
            </div>
        </div>
    </div>
</div>

## Community

SeaQL is a community driven project. We welcome you to participate, contribute and together build for Rust's future.

Here is the roadmap for SeaORM [`0.4.x`](https://github.com/SeaQL/sea-orm/milestone/4).