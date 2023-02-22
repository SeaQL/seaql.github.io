---
slug: 2022-09-17-introducing-seaography
title: Introducing Seaography
author: SeaQL Team
author_title: Chris Tsang
author_url: https://github.com/SeaQL
author_image_url: https://www.sea-ql.org/SeaORM/img/SeaQL.png
tags: [news]
---

What a fruitful Summer of Code! Today, we are excited to introduce [Seaography](https://github.com/SeaQL/seaography) to the SeaQL community. Seaography is a GraphQL framework for building GraphQL resolvers using [SeaORM](https://github.com/SeaQL/sea-orm). It ships with a CLI tool that can generate ready-to-compile Rust projects from existing MySQL, Postgres and SQLite databases.

## Motivation

We observed that other ecosystems have similar tools such as PostGraphile and Hasura allowing users to query a database via GraphQL with minimal effort upfront. We decided to bring that seamless experience to the Rust ecosystem.

For existing SeaORM users, adding a GraphQL API is straight forward. Start by adding `seaography` and `async-graphql` dependencies to your crate. Then, deriving a few extra derive macros to the SeaORM entities. Finally, spin up a GraphQL server to serve queries!

If you are new to SeaORM, no worries, we have your back. You only need to provide a database connection, and `seaography-cli` will generate the SeaORM entities together with a complete Rust project!

## Design

We considered two approaches in our [initial discussion](https://github.com/SeaQL/summer-of-code/discussions/12): 1) blackbox query engine 2) code generator. The drawback with a blackbox query engine is it's difficult to customize or extend its behaviour, making it difficult to develop and operate in the long run. We opted the code generator approach, giving users full control and endless possibilities with the versatile async Rust ecosystem.

This project is separated into the following crates:

* [`seaography`](https://github.com/SeaQL/seaography): The facade crate; exporting macros, structures and helper functions to turn SeaORM entities into GraphQL nodes.

* [`seaography-cli`](https://github.com/SeaQL/seaography/tree/main/cli): The CLI tool; it generates SeaORM entities along with a full Rust project based on a user-provided database.

* [`seaography-discoverer`](https://github.com/SeaQL/seaography/tree/main/discoverer): A helper crate used by the CLI tool to discover the database schema and transform into a generic format.

* [`seaography-generator`](https://github.com/SeaQL/seaography/tree/main/generator): A helper crate used by the CLI tool to consume the database schema and generate a full Rust project.

* [`seaography-derive`](https://github.com/SeaQL/seaography/tree/main/derive): A set of procedural macros to derive types and trait implementations on SeaORM entities, turning them into GraphQL nodes.

## Features

* Relational query (1-to-1, 1-to-N)
* Pagination on query's root entity
* Filter with operators (e.g. gt, lt, eq)
* Order by any column

## Getting Started

To quick start, we have the following examples for you, alongside with the SQL scripts to initialize the database.

* [MySQL](https://github.com/SeaQL/seaography/tree/main/examples/mysql)
* [PostgreSQL](https://github.com/SeaQL/seaography/tree/main/examples/postgres)
* [SQLite](https://github.com/SeaQL/seaography/tree/main/examples/sqlite)

All examples provide a web-based GraphQL playground when running, so you can inspect the GraphQL schema and make queries. We also hosted a [demo GraphQL playground](https://playground.sea-ql.org/seaography) in case you can't wait to play with it.

For more documentation, visit [www.sea-ql.org/Seaography](https://www.sea-ql.org/Seaography/).

## What's Next?

This project passed the first milestone shipping the essential features, but it still has a long way to go. The next milestone would be:

* Query enhancements
  * Filter related queries
  * Filter based on related queries properties
  * Paginate related queries
  * Order by related queries
* Cursor based pagination
* Single entity query
* Mutations
  * Insert single entity
  * Insert batch entities
  * Update single entity
  * Update batch entities using filter
  * Delete single entity
  * Delete batch entities

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
