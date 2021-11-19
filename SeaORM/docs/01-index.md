# Index

## Introduction

1. [What is an ORM](/docs/introduction/orm)

2. [Async Programming in Rust](/docs/introduction/async)

3. [SeaORM Concepts](/docs/introduction/sea-orm)

## Getting Started

1. Installation & Configuration

	1.1 [Choosing a Database & Async Runtime](/docs/install-and-config/database-and-async-runtime)

	1.2 [Schema Management](/docs/install-and-config/schema)

	1.3 [Connection Pool](/docs/install-and-config/connection)

	1.4 [Debug Log](/docs/install-and-config/debug-log)

2. Generating Entities

	2.1 [Using `sea-orm-cli`](/docs/generate-entity/sea-orm-cli)

	2.2 [Entity Structure](/docs/generate-entity/entity-structure)

	2.3 [Expanded Entity Structure](/docs/generate-entity/expanded-entity-structure)

3. Generating Database Schema

	3.1 [Create Table](/docs/generate-database-schema/create-table)

	3.2 [Create Enum](/docs/generate-database-schema/create-enum)

4. Basic CRUD

	4.1 [SELECT: find, filter, sort, paging](/docs/basic-crud/select)

	4.2 [INSERT: Model & ActiveModel, insert many](/docs/basic-crud/insert)

	4.3 [UPDATE: find & save, update many](/docs/basic-crud/update)

	4.4 [SAVE: insert or update](/docs/basic-crud/save)

	4.5 [DELETE: delete one & delete many](/docs/basic-crud/delete)

	4.6 [JSON](/docs/basic-crud/json)

	4.7 [Raw SQL query](/docs/basic-crud/raw-sql)

	4.8 [ActiveEnum](/docs/basic-crud/active-enum)

## Learn More

5. Relations

	5.1 [One to One](/docs/relation/one-to-one)

	5.2 [One to Many](/docs/relation/one-to-many)

	5.3 [Many to Many](/docs/relation/many-to-many)

	5.4 [Chained Relations](/docs/relation/chained-relations)

	5.5 [Self Referencing](/docs/relation/self-referencing)

	5.6 [Bakery Schema](/docs/relation/bakery-schema)

6. Writing Tests

	6.1 [Robust & Correct](/docs/write-test/testing)

	6.2 [Mock Interface](/docs/write-test/mock)

	6.3 [Using SQLite](/docs/write-test/sqlite)

7. Advanced Queries

	7.1 [Custom select](/docs/advanced-query/custom-select)

	7.2 [Conditional expressions](/docs/advanced-query/conditional-expression)

	7.3 [Aggregate functions](/docs/advanced-query/aggregate-function)

	7.4 [Advanced Relations](/docs/advanced-query/advanced-relations)

	7.5 [Subquery](/docs/advanced-query/subquery)

	7.6 [Transaction](/docs/advanced-query/transaction)

	7.7 [Streaming](/docs/advanced-query/streaming)

	7.8 [Custom Active Model](/docs/advanced-query/custom-active-model)

8. Internal Design

	8.1 [Traits and Types](/docs/internal-design/trait-and-type)

	8.2 [Derive Macros](/docs/internal-design/derive-macro)

	8.3 [Compare with Diesel](/docs/internal-design/diesel)