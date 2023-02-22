---
slug: 2022-12-02-whats-new-in-seaography-0.3.0
title: What's new in Seaography 0.3.0
author: SeaQL Team
author_title: Panagiotis Karatakis
author_url: https://github.com/SeaQL
author_image_url: https://www.sea-ql.org/SeaORM/img/SeaQL.png
tags: [news]
---

🎉 We are pleased to release Seaography [`0.3.0`](https://github.com/SeaQL/seaography/releases/tag/0.3.0)! Here are some feature highlights 🌟:

## Dependency Upgrade

[[#93](https://github.com/SeaQL/seaography/pull/93)] We have upgraded a major dependency:
- Upgrade [`sea-orm`](https://github.com/SeaQL/sea-orm) to 0.10

You might need to upgrade the corresponding dependency in your application as well.

## Support Self Referencing Relation

[[#99](https://github.com/SeaQL/seaography/pull/99)] You can now query self referencing models and the inverse of it.

Self referencing relation should be added to the `Relation` enum, note that the `belongs_to` attribute must be `belongs_to = "Entity"`.

```rust
use sea_orm::entity::prelude::*;

#[derive(
    Clone, Debug, PartialEq, DeriveEntityModel,
    async_graphql::SimpleObject, seaography::macros::Filter,
)]
#[sea_orm(table_name = "staff")]
#[graphql(complex)]
#[graphql(name = "Staff")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub staff_id: i32,
    pub first_name: String,
    pub last_name: String,
    pub reports_to_id: Option<i32>,
}

#[derive(
    Copy, Clone, Debug, EnumIter, DeriveRelation,
    seaography::macros::RelationsCompact
)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "Entity",
        from = "Column::ReportsToId",
        to = "Column::StaffId",
    )]
    SelfRef,
}

impl ActiveModelBehavior for ActiveModel {}
```

Then, you can query the related models in GraphQL.

```graphql
{
    staff {
        nodes {
            firstName
            reportsToId
            selfRefReverse {
                staffId
                firstName
            }
            selfRef {
                staffId
                firstName
            }
        }
    }
}
```

The resulting JSON

```json
{
    "staff": {
        "nodes": [
            {
                "firstName": "Mike",
                "reportsToId": null,
                "selfRefReverse": [
                    {
                        "staffId": 2,
                        "firstName": "Jon"
                    }
                ],
                "selfRef": null
            },
            {
                "firstName": "Jon",
                "reportsToId": 1,
                "selfRefReverse": null,
                "selfRef": {
                    "staffId": 1,
                    "firstName": "Mike"
                }
            }
        ]
    }
}
```

## Web Framework Generator

[[#74](https://github.com/SeaQL/seaography/pull/74)] You can generate `seaography` project with either Actix or Poem as the web server.

### CLI Generator Option

Run `seaography-cli` to generate `seaography` code with Actix or Poem as the web framework.

```shell
# The command take three arguments, generating project with Poem web framework by default
seaography-cli <DATABASE_URL> <CRATE_NAME> <DESTINATION>

# Generating project with Actix web framework
seaography-cli -f actix <DATABASE_URL> <CRATE_NAME> <DESTINATION>

# MySQL
seaography-cli mysql://root:root@localhost/sakila seaography-mysql-example examples/mysql
# PostgreSQL
seaography-cli postgres://root:root@localhost/sakila seaography-postgres-example examples/postgres
# SQLite
seaography-cli sqlite://examples/sqlite/sakila.db seaography-sqlite-example examples/sqliteql
```

### Actix

```rust
use async_graphql::{
    dataloader::DataLoader,
    http::{playground_source, GraphQLPlaygroundConfig},
    EmptyMutation, EmptySubscription, Schema,
};
use async_graphql_actix_web::{GraphQLRequest, GraphQLResponse};
use sea_orm::Database;
use seaography_example_project::*;
// ...

async fn graphql_playground() -> Result<HttpResponse> {
    Ok(HttpResponse::Ok()
        .content_type("text/html; charset=utf-8")
        .body(
            playground_source(GraphQLPlaygroundConfig::new("http://localhost:8000"))
        ))
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    // ...

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

    let app = App::new()
        .app_data(Data::new(schema.clone()))
        .service(web::resource("/").guard(guard::Post()).to(index))
        .service(web::resource("/").guard(guard::Get()).to(graphql_playground));

    HttpServer::new(app)
        .bind("127.0.0.1:8000")?
        .run()
        .await
}
```

### Poem

```rust
use async_graphql::{
    dataloader::DataLoader,
    http::{playground_source, GraphQLPlaygroundConfig},
    EmptyMutation, EmptySubscription, Schema,
};
use async_graphql_poem::GraphQL;
use poem::{handler, listener::TcpListener, web::Html, IntoResponse, Route, Server};
use sea_orm::Database;
use seaography_example_project::*;
// ...

#[handler]
async fn graphql_playground() -> impl IntoResponse {
    Html(playground_source(GraphQLPlaygroundConfig::new("/")))
}

#[tokio::main]
async fn main() {
    // ...

    let database = Database::connect(db_url).await.unwrap();
    let orm_dataloader: DataLoader<OrmDataloader> = DataLoader::new(
        OrmDataloader { db: database.clone() },
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

## Related Query Enhancement

[[#84](https://github.com/SeaQL/seaography/pull/84)] Filtering, sorting and paginating related 1-to-many queries. Note that the pagination is work-in-progress, currently it is in memory pagination.

For example, find all inactive customers, include their address, and their payments with amount greater than 7 ordered by amount the second result. You can execute the query below at our [GraphQL playground](https://playground.sea-ql.org/seaography).

```graphql
{
  customer(
    filters: { active: { eq: 0 } }
    pagination: { cursor: { limit: 3, cursor: "Int[3]:271" } }
  ) {
    nodes {
      customerId
      lastName
      email
      address {
        address
      }
      payment(
        filters: { amount: { gt: "7" } }
        orderBy: { amount: ASC }
        pagination: { pages: { limit: 1, page: 1 } }
      ) {
        nodes {
          paymentId
          amount
        }
        pages
        current
        pageInfo {
          hasPreviousPage
          hasNextPage
        }
      }
    }
    pageInfo {
      hasPreviousPage
      hasNextPage
      endCursor
    }
  }
}
```

## Integration Examples

We have the following examples for you, alongside with the SQL scripts to initialize the database.

* [MySQL](https://github.com/SeaQL/seaography/tree/main/examples/mysql)
* [PostgreSQL](https://github.com/SeaQL/seaography/tree/main/examples/postgres)
* [SQLite](https://github.com/SeaQL/seaography/tree/main/examples/sqlite)

## Community

SeaQL is a community driven project. We welcome you to participate, contribute and together build for Rust's future.
