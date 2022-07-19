# Index

## Project Description

Seaography is a CLI tool that generates a ready to compile Rust GraphQL API for a relational database.

The tool connects to a relational database, explores its schema and based on it generates the ORM entities and GraphQL queries.

## Benefits

* Generate the boilerplate
* Focus on business logic
* Easy and fast to get started


## Current features

* Query entities with filters and relations
* Dataloader optimized to solve 1+N problem

## Upcoming features
* Procedural macro API to reduce code surface
* Single entity queries with relations
* Create mutations
* Update mutations
* Delete mutations

## Generated code dependencies

In order to understand how the generated code works its recommended to study the following resources:

1. [async-graphql](https://docs.rs/async-graphql/latest/async_graphql/)

  Is a server side GraphQL library for Rust.

2. [sea-orm](https://docs.rs/sea-orm/latest/sea_orm/)

  SeaORM is a relational ORM to help you build web services in Rust with the familiarity of dynamic languages.

3. [poem](https://docs.rs/crate/poem/latest)

  A full-featured and easy-to-use web framework with the Rust programming language.

4. [tokio*](https://docs.rs/tokio/latest/tokio/)

  A runtime for writing reliable, asynchronous, and slim applications with the Rust programming language.

5. [itertools*](https://docs.rs/itertools/latest/itertools/)

  Extra iterator adaptors, functions and macros.

* Recommended to study, but not required

## How to use

1. Install the CLI tool
  ```shell
  $ cargo install seaography
  ```

2. Generate the API
  ```shell
  $ seaography mysql://root:root@127.0.0.1/ generated ./generated
  ```

3. Modify code if needed
  * Add authentication
  * Add rate limiting
  * Add business logic
  * etc.

4. Compile and run project
  ```shell
  $ cd ./generated
  $ cargo run
  ```

## More documentation

1. [How the CLI works](./tool-internals)
2. [Generated project guide](./generated-project-explained)
3. [Enchantments cookbook](./enchantments-cookbook)