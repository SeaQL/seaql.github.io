---
slug: 2022-09-27-getting-started-with-seaography
title: Getting Started with Seaography
author: SeaQL Team
author_title: Chris Tsang
author_url: https://github.com/SeaQL
author_image_url: https://www.sea-ql.org/SeaORM/img/SeaQL.png
tags: [news]
---

[Seaography](https://github.com/SeaQL/seaography) is a GraphQL framework for building GraphQL resolvers using [SeaORM](https://github.com/SeaQL/sea-orm). It ships with a CLI tool that can generate ready-to-compile Rust projects from existing MySQL, Postgres and SQLite databases.

The design and implementation of seaography can be found on our [release blog post](https://www.sea-ql.org/blog/2022-09-17-introducing-seaography/) and [documentation](https://www.sea-ql.org/Seaography/).

## Setup a GraphQL Server

Since seaography is a GraphQL framework built on top of SeaORM, you can easily extend your SeaORM project to serve a GraphQL server.

If you are new to SeaORM, no worries, we have your back. You only need to provide a database connection, and `seaography-cli` will generate the SeaORM entities together with a complete Rust project!

Or, you can download one of the example below to play with it.

### Extend From Existing SeaORM Project

Start by adding seaography and GraphQL dependencies to your `Cargo.toml`.

```diff title=Cargo.toml
[dependencies]
sea-orm = { version = "^0.9", features = [ ... ] }
+ seaography = { version = "^0.1", features = [ "with-decimal", "with-chrono" ] }
+ async-graphql = { version = "4.0.10", features = ["decimal", "chrono", "dataloader"] }
+ async-graphql-poem = { version = "4.0.10" }
```

Then, derive a few more macros for all of the SeaORM entities.

```diff title=src/entities/actor.rs
use sea_orm::entity::prelude::*;

#[derive(
    Clone,
    Debug,
    PartialEq,
    DeriveEntityModel,
+   async_graphql::SimpleObject,
+   seaography::macros::Filter,
)]
+ #[graphql(complex)]
+ #[graphql(name = "Actor")]
#[sea_orm(table_name = "actor")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub actor_id: i32,
    pub first_name: String,
    pub last_name: String,
    pub last_update: DateTimeUtc,
}

#[derive(
    Copy,
    Clone,
    Debug,
    EnumIter,
    DeriveRelation,
+   seaography::macros::RelationsCompact
)]
pub enum Relation {
    #[sea_orm(has_many = "super::film_actor::Entity")]
    FilmActor,
}

impl ActiveModelBehavior for ActiveModel {}
```

We also need to define `QueryRoot` for the GraphQL server. This define which SeaORM entity can be quired.

```rust title=src/query_root.rs
#[derive(Debug, seaography::macros::QueryRoot)]
#[seaography(entity = "crate::entities::actor")]
#[seaography(entity = "crate::entities::address")]
#[seaography(entity = "crate::entities::category")]
#[seaography(entity = "crate::entities::city")]
#[seaography(entity = "crate::entities::country")]
#[seaography(entity = "crate::entities::customer")]
#[seaography(entity = "crate::entities::film")]
#[seaography(entity = "crate::entities::film_actor")]
#[seaography(entity = "crate::entities::film_category")]
#[seaography(entity = "crate::entities::film_text")]
#[seaography(entity = "crate::entities::inventory")]
#[seaography(entity = "crate::entities::language")]
#[seaography(entity = "crate::entities::payment")]
#[seaography(entity = "crate::entities::rental")]
#[seaography(entity = "crate::entities::staff")]
#[seaography(entity = "crate::entities::store")]
pub struct QueryRoot;
```

```rust title=src/lib.rs
use sea_orm::prelude::*;

pub mod entities;
pub mod query_root;

pub use query_root::QueryRoot;

pub struct OrmDataloader {
    pub db: DatabaseConnection,
}
```

Last, create a binary to run the GraphQL server.

``` rust title=src/main.rs
use async_graphql::{
    dataloader::DataLoader,
    http::{playground_source, GraphQLPlaygroundConfig},
    EmptyMutation, EmptySubscription, Schema,
};
use async_graphql_poem::GraphQL;
use dotenv::dotenv;
use poem::{handler, listener::TcpListener, web::Html, IntoResponse, Route, Server};
use sea_orm::Database;
use seaography_sqlite_example::*;
use std::env;

#[handler]
async fn graphql_playground() -> impl IntoResponse {
    Html(playground_source(GraphQLPlaygroundConfig::new("/")))
}

#[tokio::main]
async fn main() {
    // Snip...

    let database = Database::connect(db_url).await.unwrap();
    let orm_dataloader: DataLoader<OrmDataloader> = DataLoader::new(
        OrmDataloader {
            db: database.clone(),
        },
        tokio::spawn,
    );

    let schema = Schema::build(QueryRoot, EmptyMutation, EmptySubscription)
        .data(database)
        .data(orm_dataloader)
        .finish();

    let app = Route::new()
        .at("/", get(graphql_playground)
        .post(GraphQL::new(schema)));

    Server::new(TcpListener::bind("0.0.0.0:8000"))
        .run(app)
        .await
        .unwrap();
}
```

Full source code available [here](https://github.com/SeaQL/seaography/blob/main/examples/sqlite).

### Generate From Existing Database

If you are new to SeaORM, read on, we will helps you set everything up.

Install `seaography-cli`, it helps you generate SeaORM entities along with a full Rust project based on a user-provided database.

```shell
cargo install seaography-cli
```

Run `seaography-cli` to generate code for the GraphQL server.

```shell
# The command take three arguments
seaography-cli <DATABASE_URL> <CRATE_NAME> <DESTINATION>

# MySQL
seaography-cli mysql://root:root@localhost/sakila seaography-mysql-example examples/mysql
# PostgreSQL
seaography-cli postgres://root:root@localhost/sakila seaography-postgres-example examples/postgres
# SQLite
seaography-cli sqlite://examples/sqlite/sakila.db seaography-sqlite-example examples/sqliteql
```

### Download an Example

If you don't have an existing database. We have the following examples for you, alongside with the SQL scripts to initialize the database.

* [MySQL](https://github.com/SeaQL/seaography/tree/main/examples/mysql)
* [PostgreSQL](https://github.com/SeaQL/seaography/tree/main/examples/postgres)
* [SQLite](https://github.com/SeaQL/seaography/tree/main/examples/sqlite)

All examples provide a web-based GraphQL playground when running, so you can inspect the GraphQL schema and make queries. We also hosted a [demo GraphQL playground](https://playground.sea-ql.org/seaography) in case you can't wait to play with it.

## Start the GraphQL Server

Your GraphQL server is ready to launch! Go to the Rust project root then execute `cargo run` to spin it up.

```shell
$ cargo run

Playground: http://localhost:8000
```

Visit the GraphQL playground at [http://localhost:8000](http://localhost:8000)

![GraphQL Playground](https://www.sea-ql.org/Seaography/img/playground_example_database.png)

## Query Data via GraphQL

Let say we want to get the first 3 films released on or after year 2006 sorted in ascending order of its title.

```graphql
{
  film(
    pagination: { limit: 3, page: 0 }
    filters: { releaseYear: { gte: "2006" } }
    orderBy: { title: ASC }
  ) {
    data {
      filmId
      title
      description
      releaseYear
      filmActor {
        actor {
          actorId
          firstName
          lastName
        }
      }
    }
    pages
    current
  }
}
```

We got the following JSON result after running the GraphQL query.

```json
{
  "data": {
    "film": {
      "data": [
        {
          "filmId": 1,
          "title": "ACADEMY DINOSAUR",
          "description": "An Epic Drama of a Feminist And a Mad Scientist who must Battle a Teacher in The Canadian Rockies",
          "releaseYear": "2006",
          "filmActor": [
            {
              "actor": {
                "actorId": 1,
                "firstName": "PENELOPE",
                "lastName": "GUINESS"
              }
            },
            {
              "actor": {
                "actorId": 10,
                "firstName": "CHRISTIAN",
                "lastName": "GABLE"
              }
            },
            // Snip...
          ]
        },
        {
          "filmId": 2,
          "title": "ACE GOLDFINGER",
          "description": "A Astounding Epistle of a Database Administrator And a Explorer who must Find a Car in Ancient China",
          "releaseYear": "2006",
          "filmActor": [
            // Snip...
          ]
        },
        // Snip...
      ],
      "pages": 334,
      "current": 0
    }
  }
}
```

Behind the scene, following SQL was queried on the database.

```sql
SELECT "film"."film_id",
       "film"."title",
       "film"."description",
       "film"."release_year",
       "film"."language_id",
       "film"."original_language_id",
       "film"."rental_duration",
       "film"."rental_rate",
       "film"."length",
       "film"."replacement_cost",
       "film"."rating",
       "film"."special_features",
       "film"."last_update"
FROM "film"
WHERE "film"."release_year" >= '2006'
ORDER BY "film"."title" ASC
LIMIT 3 OFFSET 0

SELECT "film_actor"."actor_id", "film_actor"."film_id", "film_actor"."last_update"
FROM "film_actor"
WHERE "film_actor"."film_id" IN (1, 3, 2)

SELECT "actor"."actor_id", "actor"."first_name", "actor"."last_name", "actor"."last_update"
FROM "actor"
WHERE "actor"."actor_id" IN (24, 162, 20, 160, 1, 188, 123, 30, 53, 40, 2, 64, 85, 198, 10, 19, 108, 90)
```

Notice we query the related rows (N+1 problem) in batch, this greatly reduce the overhead of quiring deeply nested relation. Seaography uses [async_graphql::dataloader](https://docs.rs/async-graphql/latest/async_graphql/dataloader/index.html) to optimize loading of N+1 problem.

Take `film_actor` as an example, we want to fetch `film_actor` with ID `(1, 3, 2)` from the database. We give the ID to `DataLoader`, it has two purpose. It tell `DataLoader` which row to be fetched. And, it's a unique ID to determine who is the proper receiver of a piece of data.

```rust
pub struct FilmActorFK(pub sea_orm::Value);

impl Model { // film::Model
  pub async fn FilmActor<'a>(
      &self,
      ctx: &async_graphql::Context<'a>,
  ) -> Option<Vec<super::film_actor::Model>> {
      let data_loader = ctx
          .data::<async_graphql::dataloader::DataLoader<crate::OrmDataloader>>()
          .unwrap();

      let from_column: super::film::Column = // Snip...

      let key = FilmActorFK(self.get(from_column));

      let data: Option<_> = data_loader.load_one(key) // Batch querying with foreign keys
          .await
          .unwrap();

      data
  }
}
```

Inside the `DataLoader`, it will execute the select in batch. Then, return a hashmap with ID as the key. This allow us to associate the query result with the receiver thus return the corresponding result to the proper receiver.

```rust
#[async_trait::async_trait]
impl async_graphql::dataloader::Loader<FilmActorFK> for crate::OrmDataloader {
    type Value = Vec<super::film_actor::Model>;
    type Error = std::sync::Arc<sea_orm::error::DbErr>;

    async fn load(
        &self,
        keys: &[FilmActorFK],
    ) -> Result<std::collections::HashMap<FilmActorFK, Self::Value>, Self::Error> {
        let key_values: Vec<_> = keys
            .into_iter()
            .map(|key| key.0.to_owned())
            .collect();

        let to_column: super::film_actor::Column = // Snip...

        let data: std::collections::HashMap<FilmActorFK, Self::Value> = super::film_actor::Entity::find()
            .filter(to_column.is_in(key_values)) // Filter by a batch of foreign keys
            .all(&self.db)
            .await?
            .into_iter()
            .map(|model| {
                let key = FilmActorFK(model.get(to_column));
                (key, model) // Collect rows into a hashmap with foreign key as the key
            })
            .into_group_map();

        Ok(data)
    }
}
```

## Features

* Relational query (1-to-1, 1-to-N)
* Pagination on query's root entity
* Filter with operators (e.g. gt, lt, eq)
* Order by any column

(Right now there is no mutation, but it's on our plan!)

## Conclusion

Seaography is an ergonomic library that turns SeaORM entities into GraphQL nodes. It provides a set of utilities and combined with a code generator makes GraphQL API building a breeze.

However, Seaography is still a new-born. Like all other open-source projects developed by passionate Rust developers, you can contribute to it if you also find the concept interesting. With its addition to the SeaQL ecosystem, we are one step closer to the vision of Rust being the best tool for data engineering.

## People

Seaography is created by:

<div className="container">
    <div className="row">
        <div className="col col--12 margin-bottom--md">
            <div className="avatar">
                <a className="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/karatakis">
                    <img src="https://avatars.githubusercontent.com/u/7329022?v=4" />
                </a>
                <div className="avatar__intro">
                    <div className="avatar__name">
                        Panagiotis Karatakis
                    </div>
                    Summer of Code Contributor; developer of Seaography
                </div>
            </div>
        </div>
        <div className="col col--12 margin-bottom--md">
            <div className="avatar">
                <a className="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/tyt2y3">
                    <img src="https://avatars.githubusercontent.com/u/1782664?v=4" />
                </a>
                <div className="avatar__intro">
                    <div className="avatar__name">
                        Chris Tsang
                    </div>
                    Summer of Code Mentor; lead developer of SeaQL
                </div>
            </div>
        </div>
        <div className="col col--12 margin-bottom--md">
            <div className="avatar">
                <a className="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/billy1624">
                    <img src="https://avatars.githubusercontent.com/u/30400950?v=4" />
                </a>
                <div className="avatar__intro">
                    <div className="avatar__name">
                        Billy Chan
                    </div>
                    Summer of Code Mentor; core member of SeaQL
                </div>
            </div>
        </div>
    </div>
</div>
