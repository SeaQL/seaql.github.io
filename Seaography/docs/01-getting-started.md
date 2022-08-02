# Getting started


## Installing CLI
```bash
cargo install seaography
```

## CLI parameters

```bash
seaography <database_url> <crate_name> <output_folder>
```

* **database_url:** a valid URL pointing to the database.
  examples: `mysql://user:pass@127.0.0.1:1235/database_name`, `sqlite://my_db.db`, `pgsql://user:pass@127.0.0.1/base_name`
* **crate_name:** the cargo crate name of the generated project
* **output_folder:** path pointing to the output folder, it will create it if does not exist

## Prerequisites

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