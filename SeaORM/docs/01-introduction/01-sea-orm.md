# Introduction to SeaORM

## What is an ORM

An Object Relational Mapper (ORM) is a programming library to help you interact with a relational database from an Object-Oriented Programming (OOP) language.

Tables and columns in a database are mapped to objects and attributes, while additional methods allow you to load and store data from and to the database.

Services built in Rust are lightweight (small binary size, low memory usage), safe (with compile-time guarantee), correct (if unit tests are well-designed), and fast (compile-time optimizations minimize runtime overhead).

Due to Rust being a static, strongly typed, compiled, thread-safe, non-garbage-collected, and unconventional object-oriented language, working with an ORM in Rust is a bit different from other scripting languages you are already familiar with.

SeaORM tries to help you in reaping the above benefits while avoiding the hiccups when programming in Rust.

## SeaORM Concepts

In SeaORM, a database with a collection of tables is called a `Schema`.

Each table corresponds to an [`Entity`](04-generate-entity/02-entity-format.md#entity) in SeaORM, which helps you perform `CRUD` (Create, Read, Update, and Delete) operations on relevant tables.

The `Entity` trait provides an API for you to inspect its properties ([`Column`](04-generate-entity/02-entity-format.md#column), [`Relation`](04-generate-entity/02-entity-format.md#relation) and [`PrimaryKey`](04-generate-entity/02-entity-format.md#primary-key)) at runtime.

Each table has multiple columns, which are referred to as field.

These fields and their values are grouped in a Rust struct (a [`Model`](12-internal-design/05-expanded-entity-format.md#model)) so that you can manipulate them.

However, `Model` is for read operations only. To perform insert, update, or delete, you need to use [`ActiveModel`](12-internal-design/05-expanded-entity-format.md#active-model) which attaches a state on each field.

Finally, there is no singleton (global context) in SeaORM. Application code is responsible for managing the ownership of the `DatabaseConnection`. We do provide integration examples for web frameworks including [Actix](https://github.com/SeaQL/sea-orm/tree/master/examples/actix_example), [axum](https://github.com/SeaQL/sea-orm/tree/master/examples/axum_example), [poem](https://github.com/SeaQL/sea-orm/tree/master/examples/poem_example), [Loco](https://github.com/SeaQL/sea-orm/tree/master/examples/loco_example) and [salvo](https://github.com/SeaQL/sea-orm/tree/master/examples/salvo_example) to help you get started quickly.