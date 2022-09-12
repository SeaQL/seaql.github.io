# Getting started


## Installing CLI
```bash
cargo install seaography-cli
```

## CLI parameters

```bash
seaography-cli

USAGE:
    seaography-cli [OPTIONS] <DATABASE_URL> <CRATE_NAME> <DESTINATION>

ARGS:
    <DATABASE_URL>
    <CRATE_NAME>
    <DESTINATION>

OPTIONS:
    -c, --complexity-limit <COMPLEXITY_LIMIT>
    -d, --depth-limit <DEPTH_LIMIT>
    -e, --expanded-format <EXPANDED_FORMAT>
    -h, --help                                   Print help information
    -V, --version                                Print version information
```

* **DATABASE_URL:** a valid URL pointing to the database.
  examples: `mysql://user:pass@127.0.0.1:1235/database_name`, `postgres://user:pass@127.0.0.1/base_name`, `sqlite://my_db.db`
* **CRATE_NAME:** the cargo crate name of the generated project
* **DESTINATION:** path pointing to the output folder, it will create it if does not exist
* **COMPLEXITY_LIMIT:** [Number] Limit GraphQL query complexity so it cannot be greater than this number
* **DEPTH_LIMIT:** [Number] Limit GraphQL query depth so it cannot be greater than this number
* **EXPANDED_FORMAT:** [Boolean] If you want the Sea ORM Entities to be in [extended format](https://www.sea-ql.org/SeaORM/docs/generate-entity/expanded-entity-structure/)

## Prerequisites

In order to understand how the generated code works its recommended to study the following resources:

1. [async-graphql](https://docs.rs/async-graphql/latest/async_graphql/)

    Is a server side GraphQL library for Rust.

2. [sea-orm](https://docs.rs/sea-orm/latest/sea_orm/)

    SeaORM is a relational ORM to help you build web services in Rust.

3. [poem](https://docs.rs/crate/poem/latest)

    A full-featured and easy-to-use web framework with the Rust programming language.

4. [tokio*](https://docs.rs/tokio/latest/tokio/)

    A runtime for writing reliable, asynchronous, and slim applications with the Rust programming language.