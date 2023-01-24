---
slug: 2023-01-23-introducing-otter-sql
title: OtterSql - An embeddable SQL executor for use in tests
author: SeaQL Team
author_title: Chris Tsang
author_url: https://github.com/SeaQL
author_image_url: https://www.sea-ql.org/SeaORM/img/SeaQL.png
tags: [news]
---

# OtterSql - An embeddable SQL executor for use in tests

## What is it?

OtterSql, at its core, is just another in-memory SQL database.

Under the hood, it provides a dialect-agnostic intermediate representation (IR) that can be used to build in-memory clones of (conceivably) any SQL dialect. Something like WASM but for SQL.

### Why do we need yet another SQL database?

To understand this, we need to look at [SeaORM](https://github.com/SeaQL/sea-orm), a relational ORM written in Rust. It currently supports PostgreSQL, MySQL and SQLite. As such, its tests require one or all of these databases to be installed separately. This makes it harder for developers to run SeaORM's test suite and the tests themselves are slower.

An in-memory database written in Rust, that can be plugged into these tests, would solve the problem.

### Why not just use SQLite?

SQLite is ubiquitous and can work in-memory. So why not use that for all tests?

Firstly, SeaORM does use an in-memory SQLite for some of its tests. While this does help in testing the SQLite dialect and some of the generic SQL functionalities, it cannot capture the idiosyncrasies of the other two dialects. The SQLite dialect is too different from MySQL and PostgreSQL to effectively test SQL of the latter dialects.

### How is this different from GlueSQL?

[GlueSQL](https://github.com/gluesql/gluesql) is great, but does not work for the SeaORM tests use case because:
- GlueSQL only uses the [generic dialect](https://github.com/gluesql/gluesql/blob/56204973524ceacb3752ce15bca7505262c1c530/core/src/parse_sql.rs#L15) from `sqlparser` with no way to configure or extend this.
- It executes directly on an AST. If a new dialect (like MySQL or PostgreSQL) needs to be implemented here, it would need a new executor which works on the slightly different AST produced for them. Whereas, the IR in OtterSQL allows a new dialect to be implemented by writing a code gen pass for it.

## Design and Implementation

As an in-memory database, the question of *what* it is supposed to do was clear. It takes an SQL statement as input and makes changes or gets data from the database.

Yet some design decisions had to be made.

### Do we design and use an *intermediate representation (IR)*? or execute directly on the *abstract syntax tree (AST)*?

In this case, an IR would look like an [execution plan](https://en.wikipedia.org/wiki/Query_plan) (but without the optimizers).

It was decided to design a generic IR. The entire instruction set can be found [here](https://docs.rs/otter_sql/ic/enum.Instruction.html). For now, let's see it in action for a simple query: `SELECT * FROM table1`. This is what the generated code looks like:

```json
// "load" table1 into register 0
Source  { index: %0, name: table1 }
// create an empty table in register 1
Empty   { index: %1 }
// project "*" from register 0 to register 1
Project { input: %0, output: %1, expr: *, alias: None }
// return table in register 1
Return  { index: %1 }
```

Note that the `expr` in a `Project` instruction holds the entire expression tree. So this IR is not a constant-width representation and is meant to be closer to an execution plan rather than an assembly.

This works for more complex queries too. Such as:
```sql
SELECT col2, MAX(col3) AS max_col3
FROM table1
WHERE col1 = 1
GROUP BY col2
HAVING MAX(col3) > 10
ORDER BY col2
LIMIT 10
```

The generated code is:
```json
Source  { index: %0, name: table1 }
Filter  { index: %0, expr: (column 'col1' = 1) }
GroupBy { index: %0, expr: column 'col2' }
Filter  { index: %0, expr: (MAX(column 'col3') > 10) }
Empty   { index: %1 }
Project { input: %0, output: %1, expr: column 'col2', alias: None }
Project { input: %0, output: %1, expr: MAX(column 'col3'), alias: max_col3 }
Order   { index: %1, expr: column 'col2', ascending: true }
Limit   { index: %1, limit: 10 }
Return  { index: %1 }
```

Note that the `Filter` instruction is being used for the `HAVING` clause too.

### How would the execution model look like? *Eager* or *Lazy* execution?

Eager refers to executing instructions sequentially with no regards to its next or previous instructions. This could lead to extra data being processed which could have been avoided from a more holistic perspective. On the other hand, a lazy executor only performs the operations when the data is needed and processes just the right amount of data.

For example, in a query like:
```sql
SELECT col1, col2 FROM table1 WHERE col1 = 10
```
The eager executor will first filter out the table (with all columns present) and then select `col1` and `col2` from the filtered table. Whereas the lazy executor would select only the two required columns *while* filtering the tables.

We decided to use an **Eager executor** since performance was a non-goal at this time and because it simplifies the instruction set and the executor greatly. This allows different dialects to be implemented faster.

In the example given in the previous section, we noticed that the `HAVING` clause was reduced to a single `Filter` instruction. This was made possible by the fact that the executor is eager. A filter on aggregated values would need special handling in a lazy executor designed for performance.

### For the initial implementation, do we adopt a specific database's specification or start with the generic dialect?

For example, [MySQL](https://dev.mysql.com/doc/refman/8.0/en/introduction.html) and [PostgreSQL](https://www.postgresql.org/docs/current/index.html) have very detailed docs that describe every functionality and every quirk of the database. Though, these are extremely large and focusing on a single database might not make the IR (or AST) generic enough to capture other dialects.

We decided not to focus on a single database specification for the initial implementation. The goal was to design a good, general IR and then implement code generators for specific dialects.

### If an IR is used, what will the *virtual machine* that executes it look like? Will it be stack-based or register-based?

The VM is register-based but with an *unlimited* number of registers. The number of registers used will depend on the size of the SQL statement being executed. There's no practical risk of a memory leak because if the query itself is too large, we would have other problems.

### Do we implement the parser ourselves or rely on an existing one?

We decided to use the existing [`sqlparser`](https://docs.rs/sqlparser/latest/sqlparser/). The only drawback is that it does not preserve token spans (or locations) yet which means nicer diagnostics on the SQL input are not possible.

---

For reference, [here](https://github.com/SeaQL/summer-of-code/discussions/11) is the initial design planned for OtterSql. Since then, it has changed significantly and we presented the final design above.

## Features

OtterSql:
- is completely in-memory
- is written in Rust
- can be embedded into any Rust program
- provides an IR to implement many different dialects on the same executor

Currently, OtterSql only supports a tiny subset of a generic dialect of SQL:
- `CREATE SCHEMA` / `CREATE TABLE`: implemented but constraints are not supported yet.
- `INSERT`: implemented
- `SELECT`: selecting specific columns (or expressions), complex `WHERE` clauses, `LIMIT` and `ORDER BY` are supported. `GROUP BY`, joins, nested selects, CTEs, etc. are not yet supported

We will be expanding on this as the project progresses. We welcome and encourage any contributions towards this :)

Specifically, we would like to implement the subsets of MySQL and PostgreSQL that SeaORM supports.

## Getting started

To use OtterSql as a library i.e., embed it inside other application (such as a test), see [**the crate documentation**](https://docs.rs/otter-sql/latest).

## What's next

See [the README](https://github.com/SeaQL/otter-sql/blob/main/README.md#features) for the latest updates on the near future and far future plans.

---

OtterSql was built at and made possible by the [SeaQL Summer of Code 2022 program](https://github.com/SeaQL/summer-of-code).

Thank you for reading!

