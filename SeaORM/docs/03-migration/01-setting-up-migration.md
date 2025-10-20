# Setting Up Migration

:::tip Rustacean Sticker Pack 🦀
[Our stickers](https://www.sea-ql.org/sticker-pack/) are made with a premium water-resistant vinyl with a unique matte finish.
Stick them on your laptop, notebook, or any gadget to show off your love for Rust!
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
        "override_migration_table_name".into_iden()
    }
    ..
}
```  
</details>

## Creating Migration Directory

First, install `sea-orm-cli` with `cargo`.

```shell
cargo install sea-orm-cli@^2.0.0-rc
```

:::tip SQL Server (MSSQL) backend

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

It is recommended to structure your project as a cargo workspace to separate the app crate and the migration crate. Checkout the [integration examples](https://github.com/SeaQL/sea-orm/tree/master/examples) for demonstration.

### Migration Crate

Import the [`sea-orm-migration`](https://crates.io/crates/sea-orm-migration) and [`async-std`](https://crates.io/crates/async-std) crate.

```toml title="migration/Cargo.toml"
[dependencies]
tokio = { version = "1", features = ["macros", "rt-multi-thread"] }

[dependencies.sea-orm-migration]
version = "~2.0.0-rc" # sea-orm-migration version
features = [
  # Enable following runtime and db backend features if you want to run migration via CLI
  # "runtime-tokio-native-tls",
  # "sqlx-postgres",
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

### App Crate

This is where the application logic belongs.

Create a workspace that contains app, entity and migration crates and import the entity crate into the app crate.

If we want to bundle the migration utility as part of your app, you'd also want to import the migration crate.

```toml title="./Cargo.toml"
[workspace]
members = [".", "migration"]

[dependencies]
migration = { path = "migration" }

[dependencies]
sea-orm = { version = "2.0.0-rc", features = [..] }
```

In your app, you can then run the migrator on startup.

```rust title="src/main.rs"
use migration::{Migrator, MigratorTrait};

let connection = sea_orm::Database::connect(&database_url).await?;
Migrator::up(&connection, None).await?;
```