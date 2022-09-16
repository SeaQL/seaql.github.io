---
slug: 2022-09-16-introducing-seaography
title: Introducing Seaography
author: SeaQL Team
author_title: Chris Tsang
author_url: https://github.com/SeaQL
author_image_url: https://www.sea-ql.org/SeaORM/img/SeaQL.png
tags: [news]
---

Today, We are excited to introduce [Seaography](https://github.com/SeaQL/seaography) to the Rust community. Seaography is a GraphQL framework for building [async-graphql](https://github.com/async-graphql/async-graphql) resolvers using [SeaORM](https://github.com/SeaQL/sea-orm) entities. It ships with a CLI tool that can generate ready-to-compile Rust GraphQL servers from existing MySQL, Postgres and SQLite databases.

## Motivation

We observed that other languages had similar tools such as [PostGraphile](https://github.com/graphile/postgraphile) and [Hasura](https://github.com/hasura/graphql-engine) allowing user to query a database via GraphQL server with minimal effort to setup. So, we decided to bring that seamless experience to the Rust community.

For existing SeaORM users, adding a GraphQL API is simple. Start by deriving a few extra derive macros on their SeaORM entities. Then, adds `seaography` and `async-graphql` dependencies to the crate. Finally, spin up the GraphQL server with a main function.

Anyone who are new to SeaORM, no worries, we have your back. You only need to provide a database connection, the `seaography-cli` will helps you generate the SeaORM entities from scratch together with all the steps mentioned above.

## Design

Lets "pop under the hood" and explore how this project is structured. The project is separated into the following crates:

* [`seaography`](https://github.com/SeaQL/seaography): The library crate, it re-export all the macros and define helper structures and functions required to extend a SeaORM entity into a GraphQL node.

* [`seaography-cli`](https://github.com/SeaQL/seaography/tree/main/cli): The CLI tool, it generates a ready to run GraphQL API server and SeaORM entities based on a user provided database URL. Code generation pipeline have two parts. It will first discover the database schema and represent it in a vendor agnostic way. Then, perform the actual code generation based on it.

* [`seaography-discoverer`](https://github.com/SeaQL/seaography/tree/main/discoverer): A helper crate that will be used by the CLI tool to discover the database schema and parsing it as a vendor agnostic schema.

* [`seaography-generator`](https://github.com/SeaQL/seaography/tree/main/generator): A helper crate that will be used by the CLI tool to consumes the vendor agnostic schema and generates the SeaORM entities and the required server boilerplate for the GraphQL API server.

* [`seaography-derive`](https://github.com/SeaQL/seaography/tree/main/derive): A procedural macros crate responsible to derive types and implementations to integrate SeaORM entity with GraphQL types.

### Supported Features

* Relational query (1-to-1, 1-to-N)
* Pagination on query's root entity
* Filter with operators (e.g. gt, lt, eq)
* Order by any column

Right now there is no mutation, but it's on our plan!

## Getting Started

To quick start, we have the following examples for you, alongside with the SQL scripts to initialize the database.

* [MySQL](https://github.com/SeaQL/seaography/tree/main/examples/mysql)
* [PostgreSQL](https://github.com/SeaQL/seaography/tree/main/examples/postgres)
* [SQLite](https://github.com/SeaQL/seaography/tree/main/examples/sqlite)

All examples provide a web-based GraphQL playground when running, on it you can inspect the GraphQL schema and query data. We also hosted a [demo GraphQL playground](https://playground.sea-ql.org/seaography) in case you can't wait to play with it.

If you wish to start a GraphQL server for your own database. Please read on.

* [Extending SeaORM entity to support GraphQL queries](https://www.sea-ql.org/Seaography/docs/getting-started/)
* [Generating from scratch with an existing database](https://www.sea-ql.org/Seaography/docs/getting-started/)

## What's Next?

The project passed the first milestones that contains the essential features to be published, but it has a long way to go. The next milestones are the following:

* Query enhancements
  * Filter related queries
  * Filter based on related queries properties
  * Paginate related queries
  * Order by related queries
* Cursor based alternative pagination
* Single entity query
* Mutations
  * Insert single entity
  * Insert batch entities
  * Update single entity
  * Update batch entities using filter
  * Delete single entity
  * Delete batch entities

## Conclusion

To conclude, Seaography is an ergonomic library that turns SeaORM entities into GraphQL nodes. It provides a set of utilities and combined with a code generator makes GraphQL API building a breeze.

However, Seaography is still very young and everything is subject to change. Fortunately, the good thing about this is, like all other open-source projects developed by brilliant Rust developers, you can contribute to it if you also find the concept interesting. With its addition to the SeaQL ecosystem, together we are one step closer to the vision of Rust for data engineering.

## People

Seaography is created by the following SeaQL team members:

<div className="container">
    <div className="row">
        <div className="col col--3 margin-bottom--md">
            <div className="avatar">
                <a className="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/karatakis">
                    <img src="https://avatars.githubusercontent.com/u/7329022?v=4" />
                </a>
                <div className="avatar__intro">
                    <div className="avatar__name">
                        Panagiotis Karatakis
                    </div>
                </div>
            </div>
        </div>
        <div className="col col--3 margin-bottom--md">
            <div className="avatar">
                <a className="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/tyt2y3">
                    <img src="https://avatars.githubusercontent.com/u/1782664?v=4" />
                </a>
                <div className="avatar__intro">
                    <div className="avatar__name">
                        Chris Tsang
                    </div>
                </div>
            </div>
        </div>
        <div className="col col--3 margin-bottom--md">
            <div className="avatar">
                <a className="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/billy1624">
                    <img src="https://avatars.githubusercontent.com/u/30400950?v=4" />
                </a>
                <div className="avatar__intro">
                    <div className="avatar__name">
                        Billy Chan
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

## Contributing

SeaQL is a community driven project. We welcome you to participate, contribute and together build for Rust's future.
