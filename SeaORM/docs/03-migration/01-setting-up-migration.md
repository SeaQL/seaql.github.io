# Setting Up Migration

:::tip We need your help! 📝
Thank you for reading this documentation. While we have you, would you spare a few minutes into completing our [SeaQL Community Survey](https://www.sea-ql.org/community-survey)? This is essential for the continued development and maintenance of SeaORM.
:::

If you are starting from a fresh database, it's better to version control your database schema. SeaORM ships with a migration tool, allowing you to write migrations in SeaQuery or SQL.

If you already have a database with tables and data, you can skip this chapter and move on to [generating SeaORM entities](04-generate-entity/01-sea-orm-cli.md).

## Migration Table

A table will be created in your database to keep track of the applied migrations. It will be created automatically when you run the migration.

<details>
    <summary>By default, it will be named `seaql_migrations`. You can also use a custom name for your migration table.</summary>

```rust
#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    // Override the name of migration table
    fn migration_table_name() -> sea_orm::DynIden {
        Alias::new("override_migration_table_name").into_iden()
    }
    ..
}
```  
</details>

## Creating Migration Directory

First, install `sea-orm-cli` with `cargo`.

```shell
cargo install sea-orm-cli
```

:::tip MSSQL support available in SeaORM X 🎉

The installation of `sea-orm-cli` with MSSQL support can be found [here](https://www.sea-ql.org/SeaORM-X/docs/migration/setting-up-migration/).

:::

Then, setup the migration directory by executing `sea-orm-cli migrate init`.

```shell
# Setup the migration directory in `./migration`
$ sea-orm-cli migrate init
Initializing migration directory...
Creating file `./migration/src/lib.rs`
Creating file `./migration/src/m20220101_000001_create_table.rs`
Creating file `./migration/src/main.rs`
Creating file `./migration/Cargo.toml`
Creating file `./migration/README.md`
Done!

# If you want to setup the migration directory in else where
$ sea-orm-cli migrate init -d ./other/migration/dir
```

You should have a migration directory with a structure like below.

```
migration
├── Cargo.toml
├── README.md
└── src
    ├── lib.rs                              # Migrator API, for integration
    ├── m20220101_000001_create_table.rs    # A sample migration file
    └── main.rs                             # Migrator CLI, for running manually
```

Note that if you setup the migration directory directly within a Git repository, a `.gitignore` file will also be created.

## Workspace Structure

It is recommended to structure your cargo workspace as follows to share SeaORM entities between the app crate and the migration crate. Checkout the [integration examples](https://github.com/SeaQL/sea-orm/tree/master/examples) for demonstration.

### Migration Crate

Import the [`sea-orm-migration`](https://crates.io/crates/sea-orm-migration) and [`async-std`](https://crates.io/crates/async-std) crate.

```toml title="migration/Cargo.toml"
[dependencies]
async-std = { version = "1", features = ["attributes", "tokio1"] }

[dependencies.sea-orm-migration]
version = "0.12"
features = [
  # Enable at least one `ASYNC_RUNTIME` and `DATABASE_DRIVER` feature if you want to run migration via CLI.
  # View the list of supported features at https://www.sea-ql.org/SeaORM/docs/install-and-config/database-and-async-runtime.
  # e.g.
  # "runtime-tokio-rustls",  # `ASYNC_RUNTIME` feature
  # "sqlx-postgres",         # `DATABASE_DRIVER` feature
]
```

Let's write a migration. Detailed instructions in the next section.

```rust title="migration/src/m20220120_000001_create_post_table.rs"
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Replace the sample below with your own migration scripts
        todo!();
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Replace the sample below with your own migration scripts
        todo!();
    }
}
```

### Entity Crate

Create an entity crate in your root workspace.

<details>
    <summary>You don't have SeaORM entities defined?</summary>

You can create an entity crate without any entity files. Then, write the migration and run it to create tables in the database. Finally, [generate SeaORM entities](04-generate-entity/01-sea-orm-cli.md) with `sea-orm-cli` and output the entity files to `entity/src/entities` folder.

After generating the entity files, you can re-export the generated entities by adding following lines in `entity/src/lib.rs`:

```rust
mod entities;
pub use entities::*;
```
</details>

```
entity
├── Cargo.toml      # Include SeaORM dependency
└── src
    ├── lib.rs      # Re-export SeaORM and entities
    └── post.rs     # Define the `post` entity
```

Specify SeaORM dependency.

```toml title="entity/Cargo.toml"
[dependencies]
sea-orm = { version = "0.12" }
```

### App Crate

This is where the application logic goes.

Create a workspace that contains app, entity and migration crates and import the entity crate into the app crate.

If we want to bundle the migration utility as part of your app, you'd also want to import the migration crate.

```toml title="./Cargo.toml"
[workspace]
members = [".", "entity", "migration"]

[dependencies]
entity = { path = "entity" }
migration = { path = "migration" } # depends on your needs

[dependencies]
sea-orm = { version = "0.12", features = [..] }
```

In your app, you can then run the migrator on startup.

```rust title="src/main.rs"
use migration::{Migrator, MigratorTrait};

let connection = sea_orm::Database::connect(&database_url).await?;
Migrator::up(&connection, None).await?;
```