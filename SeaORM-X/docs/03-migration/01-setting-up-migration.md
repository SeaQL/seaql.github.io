# Setting Up Migration

## Installing SeaORM X CLI

Install `sea-orm-cli` with `cargo` locally.

```shell
cargo install --path "<SEA_ORM_X_ROOT>/sea-orm-x/sea-orm-cli"
```

## Workspace Structure

It is recommended to structure your cargo workspace as follows to share SeaORM entities between the app crate and the migration crate. Checkout the [integration examples](https://github.com/SeaQL/sea-orm-x/tree/main/sea-orm-x/examples) for demonstration.

### Migration Crate

Import the `sea-orm-migration` and [`async-std`](https://crates.io/crates/async-std) crate.

```toml title="migration/Cargo.toml"
[dependencies]
async-std = { version = "1", features = ["attributes", "tokio1"] }

[dependencies.sea-orm-migration]
version = "0.12"
path = "<SEA_ORM_X_ROOT>/sea-orm-x/sea-orm-migration"
features = [
  # Enable at least one `ASYNC_RUNTIME` and `DATABASE_DRIVER` feature if you want to run migration via CLI.
  # View the list of supported features at https://www.sea-ql.org/SeaORM/docs/install-and-config/database-and-async-runtime.
  # e.g.
  # "runtime-tokio-rustls",  # `ASYNC_RUNTIME` feature
  # "sqlz-mssql",            # `DATABASE_DRIVER` feature
]
```

### Entity Crate

Specify SeaORM X dependency.

```toml title="entity/Cargo.toml"
[dependencies]
sea-orm = { version = "0.12", path = "<SEA_ORM_X_ROOT>/sea-orm-x" }
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
sea-orm = { version = "0.12", path = "<SEA_ORM_X_ROOT>/sea-orm-x", features = [..] }
```
