# Robust & Correct

Testing is an integral part of programming in Rust. You see, [`cargo test`](https://doc.rust-lang.org/cargo/commands/cargo-test.html) is built-in.

If you don't use `unsafe` and your code compiles, then your Rust program is *safe*. However, it does not automatically become *robust*. Your program can still panic unexpectedly if you are not careful on error handling.

Even if your program does not panic, it does not mean it is *correct*. It can still misbehave and create data chaos.

You can improve the correctness of your program by writing adequate tests.

## Types of Errors

First, let's classify different causes of errors in a data-driven application:

### 1. Type Errors

1. misspelled or non-existent symbol (table or column) name
1. using incompatible functions or operators on data (e.g. add two strings)
1. invalid SQL query
	- e.g. ambiguous symbol in a `JOIN` query
	- e.g. forget to insert data on non-nullable columns
	- e.g. forget to aggregate every column in a `GROUP BY` query

### 2. Transaction Errors

1. failed to maintain entity relationships
1. failed to maintain data consistency and constraints

### 3. Behavioural Errors

1. joining or filtering on wrong conditions
1. incomplete or incorrect query results
1. insert, update or delete operations with unawared side effects
1. any other behaviour not as intended

> A note on 'unawared side effects': do not use `CASCADE` unless the relation is strictly parent-child

## Mitigations

Now, let's see how we can mitigate these errors:

### 1. Type Errors

Using Rust automatically saves you from misspelling symbols.

Using a *completely static* query builder (like Diesel) can eliminate this entire class of errors. However, it requires that every parameter be defined statically and available compile-time. This is a *harsh* requirement, as there is always something you could not know until your program starts (environment variables) and runs (runtime configuration change). This is especially awkward if you come from a scripting language background where the type system has always been dynamic.

As such, SeaORM does not attempt to check things at compile-time. We intend to (still in development) provide runtime linting on the dynamically generated queries against the mentioned problems that you can enable in unit tests but disable in production.

### 2. Transaction Errors

These problems cannot be eliminated. It usually indicates your code has some logic bugs. When they happen, it is already too late, and your only choice is to abort. Instead, they have to be actively prevented: check beforehand the constraints before attempting data operations.

You should write a bunch of unit tests that can reject bad data and prevent it from entering your database. Your unit tests should also verify that each *transaction* (in your application domain, not necessarily the database transaction) is sound.

SeaORM helps you write these unit tests using the `Mock` database interface.

### 3. Behavioural Errors

This is basically testing your entire program on a domain level, requiring you to provide seed data and simulate the common user operations. Usually, you will do it in CI against a real database. However, SeaORM encourages you to scale down these tests so that the most important data-flow can be tested by Cargo's [integration tests](https://doc.rust-lang.org/rust-by-example/testing/integration_testing.html).

Since SeaORM is abstract over MySQL, PostgreSQL, and SQLite, you can use SQLite as a backend to test your program's behaviours. It is lightweight enough to run it frequently, locally, and on CI. The catch is, SQLite lacks some advanced features of MySQL or PostgreSQL, so depending on your use of database-specific features, not all logic can be tested inside SQLite.

We are looking for SQLite alternatives that can simulate the more advanced features of MySQL and PostgreSQL.
