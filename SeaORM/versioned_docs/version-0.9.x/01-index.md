# Index

## Introduction

1. Introduction

    1.1. [What is an ORM](01-introduction/01-orm.md)

    1.2. [Async Programming in Rust](01-introduction/02-async.md)

    1.3. [SeaORM Concepts](01-introduction/03-sea-orm.md)

    1.4. [Tutorial & Examples](01-introduction/04-tutorial.md)

## Basics

2. Installation & Configuration

    2.1 [Choosing a Database & Async Runtime](02-install-and-config/01-database-and-async-runtime.md)

    2.2 [Schema Management](02-install-and-config/02-schema.md)

    2.3 [Connection Pool](02-install-and-config/03-connection.md)

    2.4 [Debug Log](02-install-and-config/04-debug-log.md)

3. Migration

    3.1 [Setting Up Migration](03-migration/01-setting-up-migration.md)

    3.2 [Writing Migration](03-migration/02-writing-migration.md)

    3.3 [Running Migration](03-migration/03-running-migration.md)

    3.4 [Seeding Data](03-migration/04-seeding-data.md)

4. Generating Entities

    4.1 [Using `sea-orm-cli`](04-generate-entity/01-sea-orm-cli.md)

    4.2 [Entity Structure](04-generate-entity/02-entity-structure.md)

    4.3 [Expanded Entity Structure](04-generate-entity/03-expanded-entity-structure.md)

    4.4 [Enumeration](04-generate-entity/04-enumeration.md)

5. Basic CRUD

    5.1 [SELECT: find, filter, sort, paging](05-basic-crud/01-select.md)

    5.2 [INSERT: Model & ActiveModel, insert many](05-basic-crud/02-insert.md)

    5.3 [UPDATE: find & save, update many](05-basic-crud/03-update.md)

    5.4 [SAVE: insert or update](05-basic-crud/04-save.md)

    5.5 [DELETE: delete one & delete many](05-basic-crud/05-delete.md)

    5.6 [JSON](05-basic-crud/06-json.md)

    5.7 [Raw SQL query](05-basic-crud/07-raw-sql.md)

## Advanced Topics

6. Relations

    6.1 [One to One](06-relation/01-one-to-one.md)

    6.2 [One to Many](06-relation/02-one-to-many.md)

    6.3 [Many to Many](06-relation/03-many-to-many.md)

    6.4 [Chained Relations](06-relation/04-chained-relations.md)

    6.5 [Self Referencing](06-relation/05-self-referencing.md)

    6.6 [Custom Join Condition](06-relation/06-custom-join-condition.md)

    6.7 [Bakery Schema](06-relation/07-bakery-schema.md)

7. Writing Tests

    7.1 [Robust & Correct](07-write-test/01-testing.md)

    7.2 [Mock Interface](07-write-test/02-mock.md)

    7.3 [Using SQLite](07-write-test/03-sqlite.md)

8. Advanced Queries

    8.1 [Custom select](08-advanced-query/01-custom-select.md)

    8.2 [Conditional expressions](08-advanced-query/02-conditional-expression.md)

    8.3 [Aggregate functions](08-advanced-query/03-aggregate-function.md)

    8.4 [Custom Joins](08-advanced-query/04-custom-joins.md)

    8.5 [Sub Query](08-advanced-query/05-subquery.md)

    8.6 [Transaction](08-advanced-query/06-transaction.md)

    8.7 [Streaming](08-advanced-query/07-streaming.md)

    8.8 [Custom Active Model](08-advanced-query/08-custom-active-model.md)

9. Generating SeaQuery Statement

    9.1 [Create Table](09-generate-sea-query-statement/01-create-table.md)

    9.2 [Create Enum](09-generate-sea-query-statement/02-create-enum.md)

    9.3 [Create Index](09-generate-sea-query-statement/03-create-index.md)

10. Internal Design

    10.1 [Traits and Types](10-internal-design/01-trait-and-type.md)

    10.2 [Derive Macros](10-internal-design/02-derive-macro.md)

    10.3 [Compare with Diesel](10-internal-design/03-diesel.md)

    10.4 [Architecture](10-internal-design/04-architecture.md)