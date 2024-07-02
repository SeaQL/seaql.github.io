---
slug: 2024-07-01-graphql-support-with-loco-seaography
title: Adding GraphQL Support to Loco with Seaography
author: Billy Chan
author_title: SeaQL Team
author_url: https://github.com/billy1624
author_image_url: https://avatars.githubusercontent.com/u/30400950?v=4
image: https://www.sea-ql.org/blog/img/Loco%20x%20SeaORM.png
tags: [news]
---

<img src="/blog/img/Loco%20x%20SeaORM.png" />

In this tutorial, we would add a GraphQL endpoint with [Seaography](https://github.com/SeaQL/seaography) based on our Loco starter application. Read our first tutorial of the series, [Getting Started with Loco & SeaORM](https://www.sea-ql.org/blog/2024-05-28-getting-started-with-loco-seaorm/), if you haven't.

The full source code can be found [here](https://github.com/SeaQL/sea-orm/tree/master/examples/loco_seaography).

## What is Seaography

Seaography is a GraphQL framework for building GraphQL resolvers using SeaORM entities. It ships with a CLI tool that can generate ready-to-compile Rust GraphQL servers from existing MySQL, Postgres and SQLite databases.

## Adding Dependency

Modify `Cargo.toml` and add a few more dependencies: `seaography`, `async-graphql`, `async-graphql-axum` and `lazy_static`.

```toml title="loco_seaography/Cargo.toml"
seaography = { version = "1.0.0-rc.4", features = ["with-decimal", "with-chrono"] }
async-graphql = { version = "7.0", features = ["decimal", "chrono", "dataloader", "dynamic-schema"] }
async-graphql-axum = { version = "7.0" }
lazy_static = { version = "1.4" }
tower-service = { version = "0.3" }
```

## Setting up SeaORM Entities for Seaography

Seaography Entities are basically SeaORM Entities with some additions. They are fully compatible with SeaORM.

You can generate Seaography Entities by using `sea-orm-cli` with the extra `--seaography` flag.

```sh
sea-orm-cli generate entity -o src/models/_entities -u postgres://loco:loco@localhost:5432/loco_seaography_development --seaography
```

```diff title="loco_seaography/src/models/_entities/notes.rs"
use sea_orm::entity::prelude::*;
use serde::{Serialize, Deserialize};

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize)]
#[sea_orm(table_name = "notes")]
pub struct Model {
    pub created_at: DateTime,
    pub updated_at: DateTime,
    #[sea_orm(primary_key)]
    pub id: i32,
    pub title: Option<String>,
    pub content: Option<String>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_many = "super::files::Entity")]
    Files,
}

impl Related<super::files::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Files.def()
    }
}

+ // Defining `RelatedEntity` to relate one entity with another
+ #[derive(Copy, Clone, Debug, EnumIter, DeriveRelatedEntity)]
+ pub enum RelatedEntity {
+     #[sea_orm(entity = "super::files::Entity")]
+     Files,
+ }
```

We can see that a new enum `RelatedEntity` is generated in the Entity files. This helps Seaography to locate the related Entities for making relational queries.

## Implementing GraphQL Query Root

We have finished setting up SeaORM entity for Seaography. Now, we implement the query root of Seaography where we bridge SeaORM and Async GraphQL with the help of Seaography.

```rust title="loco_seaography/src/graphql/query_root.rs"
use async_graphql::dynamic::*;
use sea_orm::DatabaseConnection;
use seaography::{Builder, BuilderContext};

use crate::models::_entities::*;

lazy_static::lazy_static! { static ref CONTEXT: BuilderContext = BuilderContext::default(); }

pub fn schema(
    database: DatabaseConnection,
    depth: usize,
    complexity: usize,
) -> Result<Schema, SchemaError> {
    // Builder of Seaography query root
    let mut builder = Builder::new(&CONTEXT, database.clone());
    // Register SeaORM entities
    seaography::register_entities!(
        builder,
        // List all models we want to include in the GraphQL endpoint here
        [files, notes, users]
    );
    // Configure async GraphQL limits
    let schema = builder
        .schema_builder()
        // The depth is the number of nesting levels of the field
        .limit_depth(depth)
        // The complexity is the number of fields in the query
        .limit_complexity(complexity);
    // Finish up with including SeaORM database connection
    schema.data(database).finish()
}
```

## Writing Loco Controller to Handle GraphQL Endpoint

For convenience we use the built-in GraphQL playground UI in `async-graphql` to test the GraphQL endpoint. And handle the GraphQL request with `async_graphql_axum` and Seaography.

```rust title="loco_seaography/src/controllers/graphql.rs"
use async_graphql::http::{playground_source, GraphQLPlaygroundConfig};
use axum::{body::Body, extract::Request};
use loco_rs::prelude::*;
use tower_service::Service;

use crate::graphql::query_root;

// GraphQL playground UI
async fn graphql_playground() -> Result<Response> {
    // The `GraphQLPlaygroundConfig` take one parameter
    // which is the URL of the GraphQL handler: `/api/graphql`
    let res = playground_source(GraphQLPlaygroundConfig::new("/api/graphql"));

    Ok(Response::new(res.into()))
}

async fn graphql_handler(
    State(ctx): State<AppContext>,
    req: Request<Body>,
) -> Result<Response> {
    const DEPTH: usize = 10;
    const COMPLEXITY: usize = 100;
    // Construct the the GraphQL query root
    let schema = query_root::schema(ctx.db.clone(), DEPTH, COMPLEXITY).unwrap();
    // GraphQL handler
    let mut graphql_handler = async_graphql_axum::GraphQL::new(schema);
    // Execute GraphQL request and fetch the results
    let res = graphql_handler.call(req).await.unwrap();

    Ok(res)
}

pub fn routes() -> Routes {
    // Define route
    Routes::new()
        // We put all GraphQL route behind `graphql` prefix
        .prefix("graphql")
        // GraphQL playground page is a GET request
        .add("/", get(graphql_playground))
        // GraphQL handler is a POST request
        .add("/", post(graphql_handler))
}
```

## Opening GraphQL Playground

Compile and run the Loco application, then visit [http://localhost:3000/api/graphql](http://localhost:3000/api/graphql).

```sh
$ cargo run start

    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.60s
     Running `target/debug/loco_seaography-cli start`
2024-06-24T08:04:52.173924Z  INFO app: loco_rs::config: loading environment from selected_path="config/development.yaml" environment=development
2024-06-24T08:04:52.180447Z  WARN app: loco_rs::boot: pretty backtraces are enabled (this is great for development but has a runtime cost for production. disable with `logger.pretty_backtrace` in your config yaml) environment=development
2024-06-24T08:04:52.272392Z  INFO app: loco_rs::db: auto migrating environment=development
2024-06-24T08:04:52.275198Z  INFO app: sea_orm_migration::migrator: Applying all pending migrations environment=development
2024-06-24T08:04:52.280720Z  INFO app: sea_orm_migration::migrator: No pending migrations environment=development
2024-06-24T08:04:52.281280Z  INFO app: loco_rs::boot: initializers loaded initializers="" environment=development
2024-06-24T08:04:52.308827Z  INFO app: loco_rs::controller::app_routes: [GET] /api/_ping environment=development
2024-06-24T08:04:52.308936Z  INFO app: loco_rs::controller::app_routes: [GET] /api/_health environment=development
2024-06-24T08:04:52.309021Z  INFO app: loco_rs::controller::app_routes: [GET] /api/notes environment=development
2024-06-24T08:04:52.309088Z  INFO app: loco_rs::controller::app_routes: [POST] /api/notes environment=development
2024-06-24T08:04:52.309158Z  INFO app: loco_rs::controller::app_routes: [GET] /api/notes/:id environment=development
2024-06-24T08:04:52.309234Z  INFO app: loco_rs::controller::app_routes: [DELETE] /api/notes/:id environment=development
2024-06-24T08:04:52.309286Z  INFO app: loco_rs::controller::app_routes: [POST] /api/notes/:id environment=development
2024-06-24T08:04:52.309334Z  INFO app: loco_rs::controller::app_routes: [POST] /api/auth/register environment=development
2024-06-24T08:04:52.309401Z  INFO app: loco_rs::controller::app_routes: [POST] /api/auth/verify environment=development
2024-06-24T08:04:52.309471Z  INFO app: loco_rs::controller::app_routes: [POST] /api/auth/login environment=development
2024-06-24T08:04:52.309572Z  INFO app: loco_rs::controller::app_routes: [POST] /api/auth/forgot environment=development
2024-06-24T08:04:52.309662Z  INFO app: loco_rs::controller::app_routes: [POST] /api/auth/reset environment=development
2024-06-24T08:04:52.309752Z  INFO app: loco_rs::controller::app_routes: [GET] /api/user/current environment=development
2024-06-24T08:04:52.309827Z  INFO app: loco_rs::controller::app_routes: [POST] /api/files/upload/:notes_id environment=development
2024-06-24T08:04:52.309910Z  INFO app: loco_rs::controller::app_routes: [GET] /api/files/list/:notes_id environment=development
2024-06-24T08:04:52.309997Z  INFO app: loco_rs::controller::app_routes: [GET] /api/files/view/:files_id environment=development
2024-06-24T08:04:52.310088Z  INFO app: loco_rs::controller::app_routes: [GET] /api/graphql environment=development
2024-06-24T08:04:52.310172Z  INFO app: loco_rs::controller::app_routes: [POST] /api/graphql environment=development
2024-06-24T08:04:52.310469Z  INFO app: loco_rs::controller::app_routes: [Middleware] Adding limit payload data="5mb" environment=development
2024-06-24T08:04:52.310615Z  INFO app: loco_rs::controller::app_routes: [Middleware] Adding log trace id environment=development
2024-06-24T08:04:52.310934Z  INFO app: loco_rs::controller::app_routes: [Middleware] Adding cors environment=development
2024-06-24T08:04:52.311008Z  INFO app: loco_rs::controller::app_routes: [Middleware] Adding etag layer environment=development

                      ▄     ▀
                                 ▀  ▄
                  ▄       ▀     ▄  ▄ ▄▀
                                    ▄ ▀▄▄
                        ▄     ▀    ▀  ▀▄▀█▄
                                          ▀█▄
▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄   ▄▄▄▄▄▄▄▄▄▄▄ ▄▄▄▄▄▄▄▄▄ ▀▀█
 ██████  █████   ███ █████   ███ █████   ███ ▀█
 ██████  █████   ███ █████   ▀▀▀ █████   ███ ▄█▄
 ██████  █████   ███ █████       █████   ███ ████▄
 ██████  █████   ███ █████   ▄▄▄ █████   ███ █████
 ██████  █████   ███  ████   ███ █████   ███ ████▀
   ▀▀▀██▄ ▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀ ██▀
       ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
                https://loco.rs

environment: development
   database: automigrate
     logger: debug
compilation: debug
      modes: server

listening on [::]:3000
```

## Creating Notes

Create a new notes with the GraphQL mutator.

```graphql
mutation {
  notesCreateOne(
    data: {
      id: 1
      title: "Notes 001"
      content: "Content 001"
      createdAt: "2024-06-24 00:00:00"
      updatedAt: "2024-06-24 00:00:00"
    }
  ) {
    id
    title
    content
    createdAt
    updatedAt
  }
}
```

![](<https://www.sea-ql.org/blog/img/Loco x Seaography create.png>)

## Querying Notes

Query notes with its related files.

```graphql
query {
  notes {
    nodes {
      id
      title
      content
      files {
        nodes {
          id
          filePath
        }
      }
    }
  }
}
```

![](<https://www.sea-ql.org/blog/img/Loco x Seaography query.png>)

## Adding User Authentication to GraphQL Endpoint

Our GraphQL handler can be accessed without user authentication. Next, we want to only allow logged in user to access the GraphQL handler.

To do so, we add `_auth: auth::JWT` to the `graphql_handler` function.

```diff title="loco_seaography/src/controllers/graphql.rs"
async fn graphql_handler(
+   _auth: auth::JWT,
    State(ctx): State<AppContext>,
    req: Request<Body>,
) -> Result<Response> {
    const DEPTH: usize = 10;
    const COMPLEXITY: usize = 100;
    // Construct the the GraphQL query root
    let schema = query_root::schema(ctx.db.clone(), DEPTH, COMPLEXITY).unwrap();
    // GraphQL handler
    let mut graphql_handler = async_graphql_axum::GraphQL::new(schema);
    // Execute GraphQL request and fetch the results
    let res = graphql_handler.call(req).await.unwrap();

    Ok(res)
}
```

Then, run the Loco application and visit the GraphQL playground again. You should see unauthorize error.

![](<https://www.sea-ql.org/blog/img/Loco x Seaography unauthorize.png>)

## Adding Authentication header to GraphQL Playground

First, we generate a valid authorization token by logging in the user account with the corresponding email and password:

```sh
$ curl --location 'http://localhost:3000/api/auth/login' \
--data-raw '{
    "email": "cwchan.billy@gmail.com",
    "password": "password"
}'

{
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJwaWQiOiIwN2NjMDk5Ni03YWYxLTQ5YmYtYmY2NC01OTg4ZjFhODM2OTkiLCJleHAiOjE3MTk4MjIzMzN9.CgKp_aE-DyAuBJIvFGJ6l68ooAlEiJGhjWeaetDtHrupaYDm0ldVxf24vj3fPgkCqZ_njv2129n2pSCzHOjaow",
    "pid": "07cc0996-7af1-49bf-bf64-5988f1a83699",
    "name": "Billy",
    "is_verified": true
}
```

Go to the setting page of GraphQL playground. And add a new header under `request. globalHeaders`:

![](<https://www.sea-ql.org/blog/img/Loco x Seaography authorization.png>)

Then, we can access GraphQL handler as usual.

![](<https://www.sea-ql.org/blog/img/Loco x Seaography query.png>)

## Conclusion

Adding GraphQL support to Loco application is easy with the help of Seaography. It is an ergonomic library that turns SeaORM entities into GraphQL nodes and provides a set of utilities and combined with a code generator makes GraphQL API building a breeze.

## SQL Server Support

[SQL Server for SeaORM](https://www.sea-ql.org/SeaORM-X/) is now available as a closed beta. If you are interested`, please signup [here](https://forms.office.com/r/1MuRPJmYBR).

Migrating from `sea-orm` to `sea-orm-x` is straightforward with two simple steps. First, update the existing `sea-orm` dependency to `sea-orm-x` and enable the `sqlz-mssql` feature. Note that you might need to patch SeaORM dependency for the upstream dependencies.

```toml title="Cargo.toml"
sea-orm = { path = "<SEA_ORM_X_ROOT>/sea-orm-x", features = ["runtime-async-std-rustls", "sqlz-mssql"] }
sea-orm-migration = { path = "<SEA_ORM_X_ROOT>/sea-orm-x/sea-orm-migration" }

# Patch SeaORM dependency for the upstream dependencies
[patch.crates-io]
sea-orm = { path = "<SEA_ORM_X_ROOT>/sea-orm-x" }
sea-orm-migration = { path = "<SEA_ORM_X_ROOT>/sea-orm-x/sea-orm-migration" }
```

Second, update the connection string to connect to the MSSQL database.

```sh
# If the schema is `dbo`, simply write:
mssql://username:password@host/database

# Or, specify the schema name by providing an extra `currentSchema` query param.
mssql://username:password@host/database?currentSchema=my_schema

# You can trust peer certificate by providing an extra trustCertificate query param.
mssql://username:password@host/database?trustCertificate=true
```

SeaORM X has full Loco support and integrate seamlessly with many web frameworks:

+ Actix
+ Axum
+ Async GraphQL
+ jsonrpsee
+ Loco
+ Poem
+ Salvo
+ Tonic

Happy Coding!