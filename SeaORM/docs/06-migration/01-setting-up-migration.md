# Setting Up Migration

Version control your database schema with migrations written in SeaQuery or SQL.

## Migration Table

A table named `seaql_migrations` will be created in your database to keep track of the applied migrations. It will be created automatically when you run the migration.

```rust
#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "seaql_migrations")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub version: String,
    pub applied_at: i64,
}
```

## Creating Migration Directory

Setup the migration directory by executing `sea-orm-cli migrate init`.

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

## Workspace Structure

It is recommended to structure your cargo workspace as follows to share SeaORM entities between the app crate and the migration crate. Checkout the [integration examples](https://github.com/SeaQL/sea-orm/tree/master/examples) for demonstration.

### Entity Crate

Create an entity crate in your root workspace.

<details>
    <summary>You don't have SeaORM entities defined?</summary>

You can create an entity crate with no entity files. Then, write the migration and run it to create tables in the database. Finally, [generate SeaORM entities](03-generate-entity/01-sea-orm-cli.md) with `sea-orm-cli` and output the entity files to `entity/src/entities` folder.

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
sea-orm = { version = "^0" }
```

### Migration Crate

Import the [`sea-orm-migration`](https://crates.io/crates/sea-orm-migration) crate. If you need some SeaORM entities when writing migrations, you can import the entity crate.

```toml title="migration/Cargo.toml"
[dependencies]
sea-orm-migration = { version = "^0" }
entity = { path = "../entity" } # depends on your needs
```

Let's write a migration. Detailed instructions in the next section.

```rust title="migration/src/m20220120_000001_create_post_table.rs"
use entity::post::*;
use sea_orm_migration::prelude::*;

pub struct Migration;

impl MigrationName for Migration {
    fn name(&self) -> &str {
        "m20220120_000001_create_post_table"
    }
}

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Entity)
                    .if_not_exists()
                    .col(
                        ColumnDef::new(Column::Id)
                            .integer()
                            .not_null()
                            .auto_increment()
                            .primary_key(),
                    )
                    .col(ColumnDef::new(Column::Title).string().not_null())
                    .col(ColumnDef::new(Column::Text).string().not_null())
                    .to_owned(),
            )
            .await
    }

    // if you are against backward migrations, you do not have to impl this
    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Entity).to_owned())
            .await
    }
}
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

[dependencies.sea-orm]
version = "^0"
features = [ ... ]
```

In your app, you can then run the migrator on startup.

```rust title="src/main.rs"
use migration::{Migrator, MigratorTrait};

let connection = sea_orm::Database::connect(&database_url).await?;
Migrator::up(&connection, None).await?;
```