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
    <DATABASE_URL>                               [String] A valid URL pointing to the database
    <CRATE_NAME>                                 [String] The cargo crate name of the generated project
    <DESTINATION>                                [String] Path pointing to the output folder, it will create it if does not exist

OPTIONS:
    -c, --complexity-limit <COMPLEXITY_LIMIT>    [Number] Limit GraphQL query complexity so it cannot be greater than this number.
    -d, --depth-limit <DEPTH_LIMIT>              [String] Limit GraphQL query depth so it cannot be greater than this number
    -e, --expanded-format <EXPANDED_FORMAT>      [Boolean]  If you want the Sea ORM Entities to be in extended format
    -f, --framework <FRAMEWORK>                  [Enum] Dictates the generator what web API framework to use. Possible values: actix, poem (default=poem)
    -h, --help                                   Print help information
    -V, --version                                Print version information
```

#### Notes
* **DATABASE_URL examples:** `mysql://user:pass@127.0.0.1:1235/database_name`, `postgres://user:pass@127.0.0.1/base_name`, `sqlite://my_db.db`
* [extended format](https://www.sea-ql.org/SeaORM/docs/generate-entity/expanded-entity-structure/)

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