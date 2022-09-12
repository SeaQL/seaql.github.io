# Index

## Project Description

Seaography is a set of macros that turn Sea ORM Entities into GraphQL Nodes and a CLI tool
that generates a ready to compile Rust GraphQL API for a relational database.

<img src="img/playground_example_database.png" alt="Application preview" />

## Benefits

* Easy and fast to get started
* Hides the boilerplate
* Focus on business logic
* Based on popular projects

## Current features

* Pagination for queries
* Filter using complex queries
* Order results based on their fields
* Query Related Entities (Joins)
* Dataloader optimized to solve 1+N problem

## Upcoming features
* Single entity queries with relations
* Create mutations
* Update mutations
* Delete mutations

## Getting started

1. Install the CLI tool
  ```shell
  $ cargo install seaography-cli
  ```

2. Generate the API
  ```shell
  $ seaography-cli mysql://root:root@127.0.0.1/ generated ./generated
  ```

3. Modify code if needed
  * Secure or hide Entity fields
  * Add authentication middleware
  * Add business logic
  * etc.

4. Compile and run project
  ```shell
  $ cd ./generated
  $ cargo run
  ```

## More documentation

1. [Getting started](/docs/getting-started)
2. [Running an example](/docs/running-example)
3. [Generated project structure](/docs/generated-project-structure)
4. [How to extend generated code](/docs/extending-code)
5. [Macros documentation](/docs/macros-documentation)