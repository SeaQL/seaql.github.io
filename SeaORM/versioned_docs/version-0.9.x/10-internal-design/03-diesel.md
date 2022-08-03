# Compare with Diesel

[SeaORM](https://github.com/SeaQL/sea-orm) and [Diesel](https://github.com/diesel-rs/diesel) share the same goal: to offer you a complete solution in interfacing with databases.

Both SeaORM and Diesel work with MySQL, PostgreSQL, and SQLite, so you aren't constrained going with either. While Diesel allows third parties to implement custom backends, SeaORM does not.

There are also other things we chose to do differently.

## Architecture

First off, perhaps the number one requested feature, async Rust support. While using async may not offer you better performance today, programming in async is an architectural decision you have to make early on. By choosing SeaORM, we together look forward to Rust's async ecosystem maturing.

Under the hood, SeaORM together with [SQLx](https://crates.io/crates/sqlx) offers you a pure Rust technology stack. Diesel uses native drivers by default and it may take some effort for you to replace it with a pure Rust driver. Each side has their pros and cons, so it's up to your preference.

SeaORM has a modular design. If you don't like the idea of an ORM, you'll definitely still want to use [SeaQuery](https://crates.io/crates/sea-query), the underlying query builder. It is lightweight and can be easily integrated into any project. The SeaQuery API is also available to you when using SeaORM, so you receive the benefits of high-level abstraction while still having the power of a flexible query builder when you need it.

## Programming paradigm

In addition to the sync vs async foundation, the biggest distinction between Diesel and SeaORM is static vs dynamic.

Diesel provides an everything-compile-time API where types can be checked entirely statically. You can also do dynamic queries with Diesel, but you'd lose some of the benefits of compile-time type-checking.

SeaORM is dynamic, in which things are established at runtime. It offers more flexibility. While you lose some compile-time checkings, SeaORM helps you to prove correctness by testing instead.

Both libraries make heavy use of traits and generics, but SeaORM generates less types: each column in Diesel is a struct (each struct impl several traits), while each column in SeaORM is an enum variant (all columns of an entity together form one enum, which impl some traits).

There are also no deeply nested generics in SeaORM (e.g.`A<B<C<D<E>>>>`).

## Schema Builder

While in the Diesel ecosystem there are awesome libraries like [barrel](https://git.irde.st/spacekookie/barrel), SeaQL maintains the tools for schema building (SeaQuery) and management ([SeaSchema](https://github.com/SeaQL/sea-schema)). That means a familiar API and a unified experience.

## Similarities

Both Diesel and SeaORM are schema first, meaning it all starts from your existing database schema, instead of starting from your OOP classes.

Both Diesel and SeaORM are relational, meaning you can do complex joins with defined relations.

## Final words

Diesel is a well-established library in the Rust ecosystem. SeaORM is very new. Neither can replace the other. We hope that the Rust community will grow stronger together.
