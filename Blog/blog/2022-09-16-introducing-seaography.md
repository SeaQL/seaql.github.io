---
slug: 2022-09-16-introducing-seaography
title: Introducing Seaography
author: SeaQL Team
author_title: Chris Tsang
author_url: https://github.com/SeaQL
author_image_url: https://www.sea-ql.org/SeaORM/img/SeaQL.png
tags: [news]
---

# Introduction

During the past summer, I had the opportunity to work alongside the **[SeaQL](https://www.sea-ql.org/)** developers on a new product named **[Seaography](https://github.com/SeaQL/seaography)**. Seaography is a *"A GraphQL framework and code generator for SeaORM"*. To elaborate, the project is a collection of Rust macros that extend [SeaORM](https://github.com/SeaQL/sea-orm) entities to be GraphQL compatible with the [async-graphql](https://github.com/async-graphql/async-graphql) library. Lastly, the project also comes with a CLI tool which is able to generate a GraphQL API server for any supported database.

# Motivation
Behind all projects there is intent, behind this one we had the following goals in mind:

1) We observed that other languages had similar tools ([postgraphile](https://github.com/graphile/postgraphile), [hasura](https://github.com/hasura/graphql-engine)) but there was not anything similar for Rust.

2) Due to the complexity of the problem, this project would act as a great open source example for the SeaORM capabilities.

3) Lastly, trough exploring a complex real world use case of SeaORM we had in mind to fix and add more features that would benefit the SeaQL ecosystem in the long run.

# Design

Lets "pop under the hood" and explore how this project is structured. The project is separated into 2 crates.

The main crates are:

* `seaography`: is the library crate, it contains all the macros and helper utilities required to extend a SeaORM entity into a GraphQL node.
* `seaography-cli`: is the CLI tool, if supplied with a database url and the required parameters it generates a complete GraphQL API server ready to be compiled.

## `seaography` crate
The crate itself provides utilities structures and functions that are used to use SeaORM entities with a GraphQL server. The macros come from the `seaography_derive` sub-crate.

## `seaography-cli` crate
The crate depends on the following 2 sub-crates.

* `seaography_discoverer`: this crate is responsible of parsing any database into a vendor agnostic schema.
* `seaography_generator`: this crate consumes the vendor agnostic schema and generates the SeaORM entities and the required server boilerplate for the GraphQL API server.

## Current features
Currently the generator combined with the macros provide the following features:
* Relational query (1-to-1, 1-to-N)
* Pagination on query's root entity
* Filter with operators (e.g. gt, lt, eq)
* Order by any column

## Limitations
Due to the compiled nature or Rust and the static natures of the libraries  you have to modify the code and compile it if changes have been made to the database. To compare, tools like Hasura or Postgraphile parse the database schema on runtime and provide an updated.

# Example

Bellow we will "dive into" an example on how to use Seaography. We will use SQLite database as an example because its easier to get started, but the tool works also with MySQL and PostgreSQL databases.

## Setup Environment
1. Download the database [file](https://github.com/SeaQL/seaography/raw/main/examples/sqlite/chinook.db) and place it where the project you want to be.

2. Install Seaography CLI tool
    ```bash
    cargo install seaography-cli
    ```

## Generating & Compiling
1. Open terminal on the same folder as the database file.

2. Generate the project
    ```bash
    seaography-cli sqlite://chinook.db name-of-project .
    ```

3. Compile
    ```bash
    cargo build
    ```

## Running Server and Executing Queries
1. Run server
    ```bash
    cargo run
    ```

2. Open in browser https://localhost:8000/

## Example queries

* Fetch all stores with their employees
    ```graphql
    {
      store {
        data {
          storeId
          staff {
            firstName
            lastName
          }
        }
      }
    }
    ```
* Fetch store and its employees where store_id = 1
    ```graphql
    {
        store(filters: {storeId:{eq: 1}}) {
          data {
            storeId
            staff {
              firstName
              lastName
            }
          }
        }
    }
    ```

* Fetch the second page with the ids of the inactive customers limited 3 items per page
    ```graphql
    {
      customer (
        filters: { active: { eq: 0 } },
        pagination:{ page: 2, limit: 3 }
      ) {
        data {
          customerId
        }
        pages
        current
      }
    }
    ```

* Fetch the first page with the payment_id and the amount of the payments with amount greater than 11.1 limited 1 items per page
    ```graphql
    {
      payment(
        filters: { amount: { gt: "11.1" } },
        pagination: { limit: 2 }
      ) {
        data {
          paymentId
          amount
        }
        pages
        current
      }
    }
    ```

# Next steps
The project passed the first milestones that were essential in order to be published, but it has a long way to go. The next milestones are the following:
* Query enhancements
* * filter related queries
* * filter based on related queries properties
* * paginate related queries
* * order by related queries
* Cursor based alternative pagination
* Single entity query
* Mutations
* * Insert single entity
* * Insert batch entities
* * Update single entity
* * Update batch entities using filter
* * Delete single entity
* * Delete batch entities

# Conclusion

To conclude, Seaography is an ergonomic library that turns SeaORM entities into GraphQL nodes. It provides a set of utilities structures and functions and combined with a code generator makes GraphQL API building a breeze.


# People
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
TODO
