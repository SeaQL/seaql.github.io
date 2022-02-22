# Index

## SeaORM Tutorials

If you prefer step-by-step tutorials on how to use SeaORM. You can checkout [SeaORM Tutorials](https://www.sea-ql.org/sea-orm-tutorial/)!

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

4. Migration

	4.1 [Setting Up Migration](05-migration/01-setting-up-migration.md)

	4.2 [Writing Migration](05-migration/02-writing-migration.md)

	4.3 [Running Migration](05-migration/03-running-migration.md)

5. Basic CRUD

	5.1 [SELECT: find, filter, sort, paging](06-basic-crud/01-select.md)

	5.2 [INSERT: Model & ActiveModel, insert many](06-basic-crud/02-insert.md)

	5.3 [UPDATE: find & save, update many](06-basic-crud/03-update.md)

	5.4 [SAVE: insert or update](06-basic-crud/04-save.md)

	5.5 [DELETE: delete one & delete many](06-basic-crud/05-delete.md)

	5.6 [JSON](06-basic-crud/06-json.md)

	5.7 [Raw SQL query](06-basic-crud/07-raw-sql.md)

## Learn More

6. Relations

	6.1 [One to One](07-relation/01-one-to-one.md)

	6.2 [One to Many](07-relation/02-one-to-many.md)

	6.3 [Many to Many](07-relation/03-many-to-many.md)

	6.4 [Chained Relations](07-relation/04-chained-relations.md)

	6.5 [Self Referencing](07-relation/05-self-referencing.md)

	6.6 [Bakery Schema](07-relation/06-bakery-schema.md)

7. Writing Tests

	7.1 [Robust & Correct](08-write-test/01-testing.md)

	7.2 [Mock Interface](08-write-test/02-mock.md)

	7.3 [Using SQLite](08-write-test/03-sqlite.md)

8. Advanced Queries

	8.1 [Custom select](09-advanced-query/01-custom-select.md)

	8.2 [Conditional expressions](09-advanced-query/02-conditional-expression.md)

	8.3 [Aggregate functions](09-advanced-query/03-aggregate-function.md)

	8.4 [Custom Joins](09-advanced-query/04-custom-joins.md)

	8.5 [Subquery](09-advanced-query/05-subquery.md)

	8.6 [Transaction](09-advanced-query/06-transaction.md)

	8.7 [Streaming](09-advanced-query/07-streaming.md)

	8.8 [Custom Active Model](09-advanced-query/08-custom-active-model.md)

9. Internal Design

	9.1 [Traits and Types](10-internal-design/01-trait-and-type.md)

	9.2 [Derive Macros](10-internal-design/02-derive-macro.md)

	9.3 [Compare with Diesel](10-internal-design/03-diesel.md)