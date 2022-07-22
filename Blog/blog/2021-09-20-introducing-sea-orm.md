---
slug: 2021-09-20-introducing-sea-orm
title: Introducing SeaORM
author: Chris Tsang
author_title: SeaQL Team
author_url: https://github.com/tyt2y3
author_image_url: https://avatars.githubusercontent.com/u/1782664?v=4
tags: [news]
---

We are pleased to introduce SeaORM [`0.2.2`](https://github.com/SeaQL/sea-orm/releases/tag/0.2.2) to the Rust community today. It's our pleasure to have received feedback and contributions from awesome people to SeaQuery and SeaORM since `0.1.0`.

Rust is a wonderful language that can be used to build anything. One of the FAQs is "Are We Web Yet?", and if Rocket (or your favourite web framework) is Rust's Rail, then SeaORM is precisely Rust's ActiveRecord.

SeaORM is an async ORM built from the ground up, designed to play well with the async ecosystem, whether it's actix, async-std, tokio or any web framework built on top.

Let's have a quick tour of SeaORM.

## Async

Here is how you'd execute multiple queries in parallel:

```rust
// execute multiple queries in parallel
let cakes_and_fruits: (Vec<cake::Model>, Vec<fruit::Model>) =
    futures::try_join!(Cake::find().all(&db), Fruit::find().all(&db))?;
```

## Dynamic

You can use SeaQuery to build complex queries without 'fighting the ORM':

```rust
// build subquery with ease
let cakes_with_filling: Vec<cake::Model> = cake::Entity::find()
    .filter(
        Condition::any().add(
            cake::Column::Id.in_subquery(
                Query::select()
                    .column(cake_filling::Column::CakeId)
                    .from(cake_filling::Entity)
                    .to_owned(),
            ),
        ),
    )
    .all(&db)
    .await?;
```

[More on SeaQuery](https://docs.rs/sea-query/*/sea_query/)

## Testable

To write unit tests, you can use our mock interface:

```rust
// Setup mock connection
let db = MockDatabase::new(DbBackend::Postgres)
    .append_query_results(vec![
        vec![
            cake::Model {
                id: 1,
                name: "New York Cheese".to_owned(),
            },
        ],
    ])
    .into_connection();

// Perform your application logic
assert_eq!(
    cake::Entity::find().one(&db).await?,
    Some(cake::Model {
        id: 1,
        name: "New York Cheese".to_owned(),
    })
);

// Compare it against the expected transaction log
assert_eq!(
    db.into_transaction_log(),
    vec![
        Transaction::from_sql_and_values(
            DbBackend::Postgres,
            r#"SELECT "cake"."id", "cake"."name" FROM "cake" LIMIT $1"#,
            vec![1u64.into()]
        ),
    ]
);
```

[More on testing](/docs/write-test/mock)

## Service Oriented

Here is an example `Rocket` handler with pagination:

```rust
#[get("/?<page>&<posts_per_page>")]
async fn list(
    conn: Connection<Db>,
    page: Option<usize>,
    per_page: Option<usize>,
) -> Template {
    // Set page number and items per page
    let page = page.unwrap_or(1);
    let per_page = per_page.unwrap_or(10);

    // Setup paginator
    let paginator = Post::find()
        .order_by_asc(post::Column::Id)
        .paginate(&conn, per_page);
    let num_pages = paginator.num_pages().await.unwrap();

    // Fetch paginated posts
    let posts = paginator
        .fetch_page(page - 1)
        .await
        .expect("could not retrieve posts");

    Template::render(
        "index",
        context! {
            page: page,
            per_page: per_page,
            posts: posts,
            num_pages: num_pages,
        },
    )
}
```

[Full Rocket example](https://github.com/SeaQL/sea-orm/tree/master/examples/rocket_example)

We are building more examples for other web frameworks too.

## People

SeaQL is a community driven project. We welcome you to participate, contribute and together build for Rust's future.

### Core Members

<div class="container">
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

### Contributors

As a courtesy, here is the list of SeaQL's early contributors (in alphabetic order):

<div class="container">
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
        <div class="col col--3 margin-bottom--md">
            <div class="avatar">
                <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/MozarellaMan">
                    <img src="https://avatars.githubusercontent.com/u/48062697?v=4" />
                </a>
                <div class="avatar__intro">
                    <div class="avatar__name">
                        Ayomide Bamidele
                    </div>
                </div>
            </div>
        </div>
        <div class="col col--3 margin-bottom--md">
            <div class="avatar">
                <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/benarmstead">
                    <img src="https://avatars.githubusercontent.com/u/70973680?v=4" />
                </a>
                <div class="avatar__intro">
                    <div class="avatar__name">
                        Ben Armstead
                    </div>
                </div>
            </div>
        </div>
        <div class="col col--3 margin-bottom--md">
            <div class="avatar">
                <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/bobbyng626">
                    <img src="https://avatars.githubusercontent.com/u/67236456?v=4" />
                </a>
                <div class="avatar__intro">
                    <div class="avatar__name">
                        Bobby Ng
                    </div>
                </div>
            </div>
        </div>
        <div class="col col--3 margin-bottom--md">
            <div class="avatar">
                <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/scrblue">
                    <img src="https://avatars.githubusercontent.com/u/1524936?v=4" />
                </a>
                <div class="avatar__intro">
                    <div class="avatar__name">
                        Daniel Lyne
                    </div>
                </div>
            </div>
        </div>
        <div class="col col--3 margin-bottom--md">
            <div class="avatar">
                <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/Hirtol">
                    <img src="https://avatars.githubusercontent.com/u/55356909?v=4" />
                </a>
                <div class="avatar__intro">
                    <div class="avatar__name">
                        Hirtol
                    </div>
                </div>
            </div>
        </div>
        <div class="col col--3 margin-bottom--md">
            <div class="avatar">
                <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/Follpvosten">
                    <img src="https://avatars.githubusercontent.com/u/22855787?v=4" />
                </a>
                <div class="avatar__intro">
                    <div class="avatar__name">
                        Jonas Rinner
                    </div>
                </div>
            </div>
        </div>
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
                <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/code-mm">
                    <img src="https://avatars.githubusercontent.com/u/43041831?v=4" />
                </a>
                <div class="avatar__intro">
                    <div class="avatar__name">
                        Markus Merklinger
                    </div>
                </div>
            </div>
        </div>
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
                <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/duchainer">
                    <img src="https://avatars.githubusercontent.com/u/11084784?v=4" />
                </a>
                <div class="avatar__intro">
                    <div class="avatar__name">
                        Raphaël Duchaîne
                    </div>
                </div>
            </div>
        </div>
        <div class="col col--3 margin-bottom--md">
            <div class="avatar">
                <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/RemiKalbe">
                    <img src="https://avatars.githubusercontent.com/u/8604600?v=4" />
                </a>
                <div class="avatar__intro">
                    <div class="avatar__name">
                        Rémi Kalbe
                    </div>
                </div>
            </div>
        </div>
        <div class="col col--3 margin-bottom--md">
            <div class="avatar">
                <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/samsamai">
                    <img src="https://avatars.githubusercontent.com/u/3764355?v=4" />
                </a>
                <div class="avatar__intro">
                    <div class="avatar__name">
                        Sam Samai
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
