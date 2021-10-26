---
slug: 2021-10-15-whats-new-in-0.3.0
title: What's new in SeaORM 0.3.0
author: SeaQL Team
author_title: Chris Tsang
author_url: https://github.com/SeaQL
author_image_url: https://www.sea-ql.org/SeaORM/img/SeaQL.png
tags: [news]
---

🎉 We are pleased to release SeaORM [`0.3.0`](https://github.com/SeaQL/sea-orm/releases/tag/0.3.0) today! Here are some feature highlights 🌟:

## Transaction

[[#222](https://github.com/SeaQL/sea-orm/pull/222)] Use database transaction to perform atomic operations

Two transaction APIs are provided:

- `closure` style. Will be committed on Ok and rollback on Err.
    ```rust
    // <Fn, A, B> -> Result<A, B>
    db.transaction::<_, _, DbErr>(|txn| {
        Box::pin(async move {
            bakery::ActiveModel {
                name: Set("SeaSide Bakery".to_owned()),
                ..Default::default()
            }
            .save(txn)
            .await?;

            bakery::ActiveModel {
                name: Set("Top Bakery".to_owned()),
                ..Default::default()
            }
            .save(txn)
            .await?;

            Ok(())
        })
    })
    .await;
    ```

- RAII style. `begin` the transaction followed by `commit` or `rollback`. If `txn` goes out of scope, it'd automatically rollback.
    ```rust
    let txn = db.begin().await?;

    // do something with txn

    txn.commit().await?;
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

## Streaming

[[#222](https://github.com/SeaQL/sea-orm/pull/222)] Use async stream on any `Select` for memory efficiency.

```rust
let mut stream = Fruit::find().stream(&db).await?;

while let Some(item) = stream.try_next().await? {
    let item: fruit::ActiveModel = item.into();
    // do something with item
}
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
</div>

## API for custom logic on save & delete

[[#210](https://github.com/SeaQL/sea-orm/pull/210)] We redefined the trait methods of `ActiveModelBehavior`. You can now perform custom validation before and after `insert`, `update`, `save`, `delete` actions. You can abort an action even after it is done, if you are inside a transaction.

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

[[#237](https://github.com/SeaQL/sea-orm/pull/237)] You can use `sea-orm-cli` to generate entity models that also derive serde `Serialize` / `Deserialize` traits.

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

## Introduce `DeriveIntoActiveModel` macro & `IntoActiveValue` Trait

[[#240](https://github.com/SeaQL/sea-orm/pull/240)] introduced a new derive macro `DeriveIntoActiveModel` for implementing `IntoActiveModel` on structs. This is useful when creating your own struct with only partial fields of a model, for example as a form submission in a REST API.

`IntoActiveValue` trait allows converting `Option<T>` into `ActiveValue<T>` with the method `into_active_value`.

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