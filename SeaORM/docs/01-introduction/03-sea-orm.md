# SeaORM Concepts

In SeaORM, a database with a collection of tables are called `Schema`.

Each table corresponds to an `Entity` in SeaORM, which helps you perform `CRUD` (Create, Read, Update, and Delete) operations on relevant tables.

The `Entity` trait provides an API for you to inspect it's properties (`Column`, `Relation` and `PrimaryKey`) at runtime.

Each table have multiple columns, and those are called `attribute`.

These attributes and their values are grouped in a Rust struct so that you can manipulate them, and we call them `Model`.

However, `Model` is read-only. To perform insert, update or delete, you need to use an `ActiveModel` which attaches meta-data on each attribute.

Finally, there is no singleton (global context) in SeaORM. You must manage the ownership of the `DatabaseConnection` (aliased to `DbConn`) and pass it around for execution.