---
slug: 2023-01-24-introducing-otter-sql
title: Introducing OtterSQL 🦦
author: SeaQL Team
author_title: Chris Tsang
author_url: https://github.com/SeaQL
author_image_url: https://www.sea-ql.org/SeaORM/img/SeaQL.png
tags: [news]
---

[OtterSQL](https://github.com/SeaQL/otter-sql) is an Embeddable SQL Executor implemented in Rust.

On the surface, is just another in-memory SQL database. Under the hood, it provides a generic intermediate representation (IR) that can be used to build executors for (conceivably) any SQL dialect. In some sense, like WASM but for SQL.

### Why create OtterSQL?

Applications written with [SeaORM](https://github.com/SeaQL/sea-orm) have multiple levels of testing: unit tests with a mock database and integration tests against a real database. To setup mock testing, one has to lay down every SQL statement and their outputs in detail, which is quite mundane.

If we have a SQL executor written in Rust, we can use it to replace some of those mock tests. In the long run, we hope to have a have an embeddable SQL VM for use in client-side applications.

### Why not just use SQLite?

SeaORM allows you to write tests against an in-memory SQLite database, even when your application targets MySQL or Postgres in production. While SQLite does help to test some aspect of the application logic, the SQLite dialect is substantially different from MySQL or PostgreSQL and thus offers limited coverage.

### How is it different from GlueSQL?

[GlueSQL](https://github.com/gluesql/gluesql) is great, but:
+ GlueSQL only uses the [generic dialect](https://github.com/gluesql/gluesql/blob/56204973524ceacb3752ce15bca7505262c1c530/core/src/parse_sql.rs#L15) from `sqlparser` with no way to configure or extend this.
+ It executes directly on an AST. If a new dialect needs to be implemented here, it would need a new executor which works on the slightly different AST produced for them. Whereas, the IR in OtterSQL allows a new dialect to be implemented by writing a code gen pass for it.

## Design and Implementation

The fundamental idea is: a VM is responsible for managing the memory for a set of tables and the IR defines operations to query and manipulate the data. For reference, [here](https://github.com/SeaQL/summer-of-code/discussions/11) is the initial design document. The following are some design decisions we end up making along the way:

### What is the design of the intermediate representation (IR)?

The IR is like a [query plan](https://en.wikipedia.org/wiki/Query_plan) but lower level and linear (instead of being a tree). It has a similar concept to the [SQLite opcode](https://www.sqlite.org/opcode.html), but on a higher level - it does not concern individual rows; data is transformed in entire columns. The entire instruction set can be found [here](https://docs.rs/otter-sql/latest/otter_sql/ic/enum.Instruction.html).

Let's see it in action for a simple query: `SELECT * FROM table1`. This is what the generated code looks like:

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
```rust
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

### What is the execution model? *Eager* or *Lazy*?

Eager refers to executing instructions sequentially with no regards to its next or previous instructions. This could lead to extra data being processed which could have been avoided from a more holistic perspective. On the other hand, a lazy executor only performs the operations when the data is needed and processes just the right amount of data.

For example, in a query like:
```sql
SELECT col1, col2 FROM table1 WHERE col1 = 10
```
The eager executor will first filter out the table (with all columns present) and then select `col1` and `col2` from the filtered table. Whereas the lazy executor would select only the two required columns *while* filtering the tables.

We decided to use an eager executor because it simplifies the design of the executor.

In the example given in the previous section, we noticed that the `HAVING` clause is performed by a second `Filter` instruction on an intermediate table. Have the executor been a lazily evaluated one, we'd need a two stage pipeline to implement that.

### Why did we start with the generic dialect?

[MySQL](https://dev.mysql.com/doc/refman/8.0/en/introduction.html) and [PostgreSQL](https://www.postgresql.org/docs/current/index.html) have very detailed docs that describe every functionality and quirk of the database. These are comprehensive and might take years to fully implement.

We decided not to focus on a single database specification for the initial implementation. The goal was to design a good, general IR and then implement code generators for specific dialects afterwards.

### How does the *virtual machine* look like?

The VM is register-based but with an *unlimited* number of registers. The number of registers used will depend on the size of the SQL statement being executed. There is no "garbage collection" for now as we expect the VM to be relatively short-lived.

### Did we implement the parser ourselves?

We decided to rely on the awesome [`sqlparser`](https://crates.io/crates/sqlparser) crate. The only drawback is that it does not preserve token spans (or locations) which means for now precise diagnostics on the SQL statement is not possible if there is an error.

## Summary

OtterSQL:

 + is in-memory
 + is written in Rust
 + can be embedded into any Rust program
 + has a dialect-agnostic IR

Currently, OtterSQL only supports a tiny subset of a generic dialect of SQL:

 + `CREATE SCHEMA` / `CREATE TABLE`: implemented but constraints are not supported yet
 + `INSERT`: implemented
 + `SELECT`: select expressions, complex `WHERE` clause, `LIMIT` and `ORDER BY` are implemented

We will be expanding on the feature set as the project progresses. We'd welcome and encourage any contribution to this project!

It is not practically usable yet, but we hope to implement a good enough subset of MySQL and PostgreSQL to support SeaORM soon.

## Dive In

Check out the [OtterSQL](https://github.com/SeaQL/otter-sql) repository and read the [documentation](https://docs.rs/otter-sql).

Go to [issues](https://github.com/SeaQL/otter-sql/issues) to take part in the discussion and future planning.

## The Team

OtterSQL is created by:

<div className="container">
    <div className="row">
        <div className="col col--12 margin-bottom--md">
            <div className="avatar">
                <a className="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/tyt2y3">
                    <img src="https://avatars.githubusercontent.com/u/1782664?v=4" />
                </a>
                <div className="avatar__intro">
                    <div className="avatar__name">
                        Chris Tsang
                    </div>
                    Mentor
                </div>
            </div>
        </div>
        <div className="col col--12 margin-bottom--md">
            <div className="avatar">
                <a className="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/Samyak2">
                    <img src="https://avatars.githubusercontent.com/u/34161949?v=4" />
                </a>
                <div className="avatar__intro">
                    <div className="avatar__name">
                        Samyak Sarnayak
                    </div>
                    Contributor
                </div>
            </div>
        </div>
    </div>
</div>

Oh and by the way, let us introduce our official mascot, a sea otter / bookworm:

<img src="https://raw.githubusercontent.com/SeaQL/otter-sql/main/assets/OtterSQL.png" style={{width: '400px', maxWidth: '100%'}} />

## Acknowledgment

This experimental project is funded by SeaQL.org and is part of [SeaQL Summer of Code 2022](https://github.com/SeaQL/summer-of-code/tree/main/2022) - an internship experience offered to university students. This project *may likely* also be part of [GSoC 2023](https://github.com/SeaQL/summer-of-code/tree/main/2023).

In addition to maintaining Rust libraries for data engineering - most notably [SeaORM](https://github.com/SeaQL/sea-orm) and [Seaography](https://github.com/SeaQL/seaography), we are committed to nurturing the next generation of open source developers. You can support us financially via [GitHub Sponsor](https://github.com/sponsors/SeaQL) if you want to see more projects like this coming out of SeaQL.org!
