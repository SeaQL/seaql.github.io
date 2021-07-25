# SeaORM Concepts

In SeaORM, a database with a collection of tables are called `Schema`.

Each table corresponds to an [`Entity`](/docs/generate-entity/entity-structure#entity) in SeaORM, which helps you perform `CRUD` (Create, Read, Update, and Delete) operations on relevant tables.

The `Entity` trait provides an API for you to inspect it's properties ([`Column`](/docs/generate-entity/entity-structure#column), [`Relation`](/docs/generate-entity/entity-structure#relation) and [`PrimaryKey`](/docs/generate-entity/entity-structure#primary-key)) at runtime.

Each table have multiple columns, and those are called `attribute`.

These attributes and their [`Value`](#) are grouped in a Rust struct so that you can manipulate them, and we call them [`Model`](/docs/generate-entity/entity-structure#model).

However, `Model` is for read operations only. To perform insert, update or delete, you need to use an [`ActiveModel`](/docs/generate-entity/entity-structure#active-model) which attaches meta-data on each attribute.

Finally, there is no singleton (global context) in SeaORM. You must manage the ownership of the [`DatabaseConnection`](/docs/install-and-config/connection) and pass it around for use.