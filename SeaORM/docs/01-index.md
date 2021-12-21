# Index

## Introduction

1. [What is an ORM](01-introduction/01-orm.md)

2. [Async Programming in Rust](01-introduction/02-async.md)

3. [SeaORM Concepts](01-introduction/03-sea-orm.md)

## Getting Started

1. Installation & Configuration

	1.1 [Choosing a Database & Async Runtime](02-install-and-config/01-database-and-async-runtime.md)

	1.2 [Schema Management](02-install-and-config/02-schema.md)

	1.3 [Connection Pool](02-install-and-config/03-connection.md)

	1.4 [Debug Log](02-install-and-config/04-debug-log.md)

2. Generating Entities

	2.1 [Using `sea-orm-cli`](03-generate-entity/01-sea-orm-cli.md)

	2.2 [Entity Structure](03-generate-entity/02-entity-structure.md)

	2.3 [Expanded Entity Structure](03-generate-entity/03-expanded-entity-structure.md)

	2.4 [Enumeration](03-generate-entity/04-enumeration.md)

3. Generating Database Schema

	3.1 [Create Table](04-generate-database-schema/01-create-table.md)

	3.2 [Create Enum](04-generate-database-schema/02-create-enum.md)

4. Basic CRUD

	4.1 [SELECT: find, filter, sort, paging](05-basic-crud/01-select.md)

	4.2 [INSERT: Model & ActiveModel, insert many](05-basic-crud/02-insert.md)

	4.3 [UPDATE: find & save, update many](05-basic-crud/03-update.md)

	4.4 [SAVE: insert or update](05-basic-crud/04-save.md)

	4.5 [DELETE: delete one & delete many](05-basic-crud/05-delete.md)

	4.6 [JSON](05-basic-crud/06-json.md)

	4.7 [Raw SQL query](05-basic-crud/07-raw-sql.md)

## Learn More

5. Relations

	5.1 [One to One](06-relation/01-one-to-one.md)

	5.2 [One to Many](06-relation/02-one-to-many.md)

	5.3 [Many to Many](06-relation/03-many-to-many.md)

	5.4 [Chained Relations](06-relation/04-chained-relations.md)

	5.5 [Self Referencing](06-relation/05-self-referencing.md)

	5.6 [Bakery Schema](06-relation/06-bakery-schema.md)

6. Writing Tests

	6.1 [Robust & Correct](07-write-test/01-testing.md)

	6.2 [Mock Interface](07-write-test/02-mock.md)

	6.3 [Using SQLite](07-write-test/03-sqlite.md)

7. Advanced Queries

	7.1 [Custom select](08-advanced-query/01-custom-select.md)

	7.2 [Conditional expressions](08-advanced-query/02-conditional-expression.md)

	7.3 [Aggregate functions](08-advanced-query/03-aggregate-function.md)

	7.4 [Custom Joins](08-advanced-query/04-custom-joins.md)

	7.5 [Subquery](08-advanced-query/05-subquery.md)

	7.6 [Transaction](08-advanced-query/06-transaction.md)

	7.7 [Streaming](08-advanced-query/07-streaming.md)

	7.8 [Custom Active Model](08-advanced-query/08-custom-active-model.md)

8. Internal Design

	8.1 [Traits and Types](09-internal-design/01-trait-and-type.md)

	8.2 [Derive Macros](09-internal-design/02-derive-macro.md)

	8.3 [Compare with Diesel](09-internal-design/03-diesel.md)