# Index

## Project Description

Seaography is a CLI tool that generates a ready to compile Rust GraphQL API for a relational database.

The tool connects to a relational database, explores its schema and based on it generates the ORM entities and GraphQL queries.

<img src="img/playground_example_database.png" alt="Application preview" />

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

## Getting started

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

1. [Getting started](/docs/getting-started)
2. [How the CLI works](/docs/tool-internals)
3. [Generated project guide](/docs/generated-project-structure)
4. [How to extend generated code](/docs/extending-code)
5. [Running an example](/docs/running-example)