---
slug: 2021-10-01-whats-new-in-0.2.4
title: What's new in SeaORM 0.2.4
author: SeaQL Team
author_title: Chris Tsang
author_url: https://github.com/SeaQL
author_image_url: https://www.sea-ql.org/SeaORM/img/SeaQL.png
tags: [news]
---

🎉 We are pleased to release SeaORM [`0.2.4`](https://github.com/SeaQL/sea-orm/releases/tag/0.2.4) today! Some feature highlights:

## Better ergonomic when working with custom select list

[[#208](https://github.com/SeaQL/sea-orm/pull/208)] Use [Select::into_values](https://docs.rs/sea-orm/0.2.4/sea_orm/entity/prelude/struct.Select.html#method.into_values) to quickly select a custom column list and destruct as tuple.

```rust
use sea_orm::{entity::*, query::*, tests_cfg::cake, DeriveColumn, EnumIter};

#[derive(Copy, Clone, Debug, EnumIter, DeriveColumn)]
enum QueryAs {
    CakeName,
    NumOfCakes,
}

let res: Vec<(String, i64)> = cake::Entity::find()
    .select_only()
    .column_as(cake::Column::Name, QueryAs::CakeName)
    .column_as(cake::Column::Id.count(), QueryAs::NumOfCakes)
    .group_by(cake::Column::Name)
    .into_values::<_, QueryAs>()
    .all(&db)
    .await?;

assert_eq!(
    res,
    vec![("Chocolate Forest".to_owned(), 2i64)]
);
```

Contributed by:

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

## Rename column name & column enum variant

[[#209](https://github.com/SeaQL/sea-orm/pull/209)] Rename the column name and enum variant of a model attribute, especially helpful when the column name is a Rust keyword.

```rust
mod my_entity {
    use sea_orm::entity::prelude::*;

    #[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
    #[sea_orm(table_name = "my_entity")]
    pub struct Model {
        #[sea_orm(primary_key, enum_name = "IdentityColumn", column_name = "id")]
        pub id: i32,
        #[sea_orm(column_name = "type")]
        pub type_: String,
    }

    //...
}

assert_eq!(my_entity::Column::IdentityColumn.to_string().as_str(), "id");
assert_eq!(my_entity::Column::Type.to_string().as_str(), "type");
```

Contributed by:

<div class="container">
    <div class="row">
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
</div>

## `not` on a condition tree

[[#145](https://github.com/SeaQL/sea-query/pull/145)] Build a complex condition tree with [Condition](https://docs.rs/sea-query/0.16.5/sea_query/query/struct.Condition.html).

```rust
use sea_orm::{entity::*, query::*, tests_cfg::cake, sea_query::Expr, DbBackend};

assert_eq!(
    cake::Entity::find()
        .filter(
            Condition::all()
                .add(
                    Condition::all()
                        .not()
                        .add(Expr::val(1).eq(1))
                        .add(Expr::val(2).eq(2))
                )
                .add(
                    Condition::any()
                        .add(Expr::val(3).eq(3))
                        .add(Expr::val(4).eq(4))
                )
        )
        .build(DbBackend::Postgres)
        .to_string(),
    r#"SELECT "cake"."id", "cake"."name" FROM "cake" WHERE (NOT (1 = 1 AND 2 = 2)) AND (3 = 3 OR 4 = 4)"#
);
```

Contributed by:

<div class="container">
    <div class="row">
        <div class="col col--3 margin-bottom--md">
            <div class="avatar">
                <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/nitnelave">
                    <img src="https://avatars.githubusercontent.com/u/796633?v=4" />
                </a>
                <div class="avatar__intro">
                    <div class="avatar__name">
                        nitnelave
                    </div>
                </div>
            </div>
        </div>
        <div class="col col--3 margin-bottom--md">
            <div class="avatar">
                <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/6xzo">
                    <img src="https://avatars.githubusercontent.com/u/36180574?v=4" />
                </a>
                <div class="avatar__intro">
                    <div class="avatar__name">
                        6xzo
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

## Community

SeaQL is a community driven project. We welcome you to participate, contribute and together build for Rust's future.

Here is the roadmap for SeaORM [`0.3.x`](https://github.com/SeaQL/sea-orm/milestone/3).