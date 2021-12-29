# SeaORM Concepts

In SeaORM, a database with a collection of tables is called a `Schema`.

Each table corresponds to an [`Entity`](03-generate-entity/02-entity-structure.md#entity) in SeaORM, which helps you perform `CRUD` (Create, Read, Update, and Delete) operations on relevant tables.

The `Entity` trait provides an API for you to inspect its properties ([`Column`](03-generate-entity/02-entity-structure.md#column), [`Relation`](03-generate-entity/02-entity-structure.md#relation) and [`PrimaryKey`](03-generate-entity/02-entity-structure.md#primary-key)) at runtime.

Each table has multiple columns, which are referred to as `attribute`.

These attributes and their values are grouped in a Rust struct (a [`Model`](03-generate-entity/03-expanded-entity-structure.md#model)) so that you can manipulate them.

However, `Model` is for read operations only. To perform insert, update, or delete, you need to use [`ActiveModel`](03-generate-entity/03-expanded-entity-structure.md#active-model) which attaches meta-data on each attribute.

Finally, there is no singleton (global context) in SeaORM. Application code is responsible for managing the ownership of the [`DatabaseConnection`](02-install-and-config/03-connection.md). We do provide integration examples for web frameworks including [Rocket](https://github.com/SeaQL/sea-orm/tree/master/examples/rocket_example), [Actix](https://github.com/SeaQL/sea-orm/tree/master/examples/actix_example) and [axum](https://github.com/SeaQL/sea-orm/tree/master/examples/axum_example) to help you get started quickly.