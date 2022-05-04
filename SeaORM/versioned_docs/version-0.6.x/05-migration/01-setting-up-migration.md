# Setting Up Migration

Version control you database schema with migrations written in SeaQuery or in raw SQL.

## Migration Table

A table named `seaql_migrations` will be created in your database to keep track the applied migrations. It will be created automatically when you run the migration.

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
Initializing migration directory...
Creating file `./other/migration/dir/src/lib.rs`
Creating file `./other/migration/dir/src/m20220101_000001_create_table.rs`
Creating file `./other/migration/dir/src/main.rs`
Creating file `./other/migration/dir/Cargo.toml`
Creating file `./other/migration/dir/README.md`
Done!
```

You should have a migration directory with structure like below.

```
migration
├── Cargo.toml
├── README.md
└── src
    ├── lib.rs                              # Migrator, for running migration programmatically
    ├── m20220101_000001_create_table.rs    # A sample migration file
    └── main.rs                             # Migrator CLI, for running migration in console
```

## Workspace Structure

It is recommanded to restructure your cargo workspace as follows to allow sharing of SeaORM entities across the core crate and the migration crate. Also, to ensure both of them depends on the same version of SeaORM through re-exporting.

Follow the steps below to restructure your workspace.

Checkout the integration examples:
- [Rocket Example](https://github.com/SeaQL/sea-orm/tree/master/examples/rocket_example)
- [Actix Example](https://github.com/SeaQL/sea-orm/tree/master/examples/actix_example)
- [Axum Example](https://github.com/SeaQL/sea-orm/tree/master/examples/axum_example)
- [Poem Example](https://github.com/SeaQL/sea-orm/tree/master/examples/poem_example)

### Entity Crate

Creates an entity crate in your root workspace. It should contains all SeaORM entities and shares SeaORM dependency across the workspace through re-exporting.

<details>
    <summary>If you don't have SeaORM entities defined?</summary>

You can create an entity crate with no entity files in it. Then, write the migration and run it to create tables in the database. Finally, [generate SeaORM entities](03-generate-entity/01-sea-orm-cli.md) with `sea-orm-cli` and output the entity files to `entity/src` folder.

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

Specifies SeaORM dependency.

```toml title="entity/Cargo.toml"
[dependencies]
sea-orm = { version = "^0.6", features = [ <DATABASE_DRIVER>, <ASYNC_RUNTIME>, "macros" ], default-features = false }
```

Re-exports SeaORM.

```rust title="entity/src/lib.rs"
pub use sea_orm;
```

### Migration Crate

For those existing SeaORM users, you might need SeaORM entity when defining the migration. For example, column names defined in entity can be reused in migration.

Depends on the entity crate.

```toml title="migration/Cargo.toml"
[dependencies]
entity = { path = "../entity" }
```

Writes migration for the `post` entity, more on this in the next section.

```rust title="migration/src/m20220120_000001_create_post_table.rs"
use sea_schema::migration::prelude::*;

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
                    // ...
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(
                Table::drop()
                    // ...
                    .to_owned()
            )
            .await
    }
}
```

### Core Crate

This is where you put the application logics.

Creates a workspace that contains core, entity and migration crate and includes the entity and migration crate as well.

```toml title="Cargo.toml"
[workspace]
members = [".", "entity", "migration"]

[dependencies]
entity = { path = "entity" }
migration = { path = "migration" }
```

Uses the re-exported SeaORM and entities.

```rust title="src/main.rs"
use entity::sea_orm;

pub use entity::post;
pub use entity::post::Entity as Post;
```
