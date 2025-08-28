# Running Migration

After you have defined the migrations, you can apply or revert migrations in the terminal or on application startup.

## Command Line Interface (CLI)

Migrations can be run manually in the terminal. `DATABASE_URL` must be set in your environment, follow the instructions [here](04-generate-entity/01-sea-orm-cli.md#configure-environment) to configure it.

Supported commands:
- `init`: Initialize migration directory
- `generate`: Generate a new migration file
- `up`: Apply all pending migrations
- `up -n 10`: Apply 10 pending migrations
- `down`: Rollback last applied migration
- `down -n 10`: Rollback last 10 applied migrations
- `status`: Check the status of all migrations
- `fresh`: Drop all tables from the database, then reapply all migrations
- `refresh`: Rollback all applied migrations, then reapply all migrations
- `reset`: Rollback all applied migrations

### Via `sea-orm-cli`

The `sea-orm-cli` will execute `cargo run --manifest-path ./migration/Cargo.toml -- COMMAND` under the hood.

```shell
$ sea-orm-cli migrate COMMAND
```

You can customize the manifest path.

```shell
$ sea-orm-cli migrate COMMAND -d ./other/migration/dir
```

### Via SeaSchema Migrator CLI

Run the migrator CLI defined in `migration/main.rs`.

```shell
cd migration
cargo run -- COMMAND
```

## Migrating Programmatically

You can perform migration on application startup with `Migrator`, which implements the [`MigratorTrait`](https://docs.rs/sea-orm-migration/*/sea_orm_migration/migrator/trait.MigratorTrait.html).

```rust title="src/main.rs"
use migration::{Migrator, MigratorTrait};

/// Apply all pending migrations
Migrator::up(db, None).await?;

/// Apply 10 pending migrations
Migrator::up(db, Some(10)).await?;

/// Rollback all applied migrations
Migrator::down(db, None).await?;

/// Rollback last 10 applied migrations
Migrator::down(db, Some(10)).await?;

/// Check the status of all migrations
Migrator::status(db).await?;

/// Drop all tables from the database, then reapply all migrations
Migrator::fresh(db).await?;

/// Rollback all applied migrations, then reapply all migrations
Migrator::refresh(db).await?;

/// Rollback all applied migrations
Migrator::reset(db).await?;
```

## Running Migration on Any PostgreSQL Schema

By default migration will be run on the `public` schema, you can now override it when running migration on the CLI or programmatically.

For CLI, you can specify the target schema with `-s` / `--database_schema` option:
* via sea-orm-cli: `sea-orm-cli migrate -u postgres://root:root@localhost/database -s my_schema`
* via SeaORM migrator: `cargo run -- -u postgres://root:root@localhost/database -s my_schema`

You can also run the migration on the target schema programmatically:

```rust
let connect_options = ConnectOptions::new("postgres://root:root@localhost/database")
    .set_schema_search_path("my_schema") // Override the default schema
    .to_owned();

let db = Database::connect(connect_options).await?

migration::Migrator::up(&db, None).await?;
```

:::tip SQL Server (MSSQL) backend

The configuration of running migration on any MSSQL schema can be found [here](https://www.sea-ql.org/SeaORM-X/docs/migration/running-migration/).

:::

## Checking Migration Status

You can use `MigratorTrait::get_pending_migrations()` and `MigratorTrait::get_applied_migrations()` to retrieve the list of migrations.

```rust
let migrations = Migrator::get_pending_migrations(db).await?;
assert_eq!(migrations.len(), 5);

let migration = migrations[0];
assert_eq!(migration.name(), "m20220118_000002_create_fruit_table");
assert_eq!(migration.status(), MigrationStatus::Pending);
```
