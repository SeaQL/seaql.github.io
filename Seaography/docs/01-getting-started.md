# Getting started

## Installing SeaORM and Seaography CLI

```bash
cargo install sea-orm-cli@^0.12
cargo install seaography-cli@1
```

## CLI parameters

```bash
🧭 A GraphQL framework and code generator for SeaORM

Usage: seaography-cli [OPTIONS] <DESTINATION> <ENTITIES> <DATABASE_URL> <CRATE_NAME>

Arguments:
  <DESTINATION>   Project destination folder
  <ENTITIES>      SeaORM entities folder
  <DATABASE_URL>  Database URL to write in .env
  <CRATE_NAME>    Crate name for generated project

Options:
  -f, --framework <FRAMEWORK>
          Which web framework to use [default: poem] [possible values: actix, poem]
      --depth-limit <DEPTH_LIMIT>
          GraphQL depth limit
      --complexity-limit <COMPLEXITY_LIMIT>
          GraphQL complexity limit
  -h, --help
          Print help
  -V, --version
          Print version
```

* `DATABASE_URL` examples: `mysql://user:pass@127.0.0.1:1235/database_name`, `postgres://user:pass@127.0.0.1/base_name`, `sqlite://my_db.db`

## Prerequisites

In order to understand how the generated code works its recommended to study the following resources:

1. [async-graphql](https://docs.rs/async-graphql/latest/async_graphql/)

    Is a server side GraphQL library for Rust.

2. [sea-orm](https://docs.rs/sea-orm/latest/sea_orm/)

    SeaORM is a relational ORM to help you build web services in Rust.

3. The web API of the generated project

    [poem](https://docs.rs/crate/poem/latest)
    [actix](https://docs.rs/crate/actix/latest)

4. [tokio*](https://docs.rs/tokio/latest/tokio/)

    A runtime for writing reliable, asynchronous, and slim applications with the Rust programming language.