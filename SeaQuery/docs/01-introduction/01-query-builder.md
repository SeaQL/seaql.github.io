# What is an Query Builder

SeaQuery is a query builder to help you construct dynamic SQL queries in Rust.
You can construct expressions, queries and schema as abstract syntax trees using an ergonomic API.
We support MySQL, Postgres and SQLite behind a common interface that aligns their behaviour where appropriate.

We provide integration for [SQLx](https://crates.io/crates/sqlx),
[postgres](https://crates.io/crates/postgres) and [rusqlite](https://crates.io/crates/rusqlite).
See [examples](https://github.com/SeaQL/sea-query/blob/master/examples) for usage.

SeaQuery is the foundation of [SeaORM](https://github.com/SeaQL/sea-orm), an async & dynamic ORM for Rust.

