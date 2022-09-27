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

You can spin a GraphQL server to query your existing database with a few commands. Or, you can download one of the example below to play with it.

### Generate From Existing Database

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

Let say we want to get the first 3 inactivated customers sorted in ascending order of customer ID.

```graphql
{
  customer(
    filters: { active: { eq: 0 } }
    pagination: { page: 0, limit: 3 }
    orderBy: { customerId: ASC }
  ) {
    data {
      customerId
      lastName
      email
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
    "customer": {
      "data": [
        {
          "customerId": 16,
          "lastName": "MARTIN",
          "email": "SANDRA.MARTIN@sakilacustomer.org"
        },
        {
          "customerId": 64,
          "lastName": "COX",
          "email": "JUDITH.COX@sakilacustomer.org"
        },
        {
          "customerId": 124,
          "lastName": "WELLS",
          "email": "SHEILA.WELLS@sakilacustomer.org"
        }
      ],
      "pages": 5,
      "current": 0
    }
  }
}
```

Behind the scene, following SQL was queried on the database.

```sql
SELECT
  "customer"."customer_id",
  "customer"."store_id",
  "customer"."first_name",
  "customer"."last_name",
  "customer"."email",
  "customer"."address_id",
  "customer"."active",
  "customer"."create_date",
  "customer"."last_update"
FROM
  "customer"
WHERE
  "customer"."active" = 0
ORDER BY
  "customer"."customer_id" ASC
LIMIT
  3 OFFSET 0
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
