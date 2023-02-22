# Running Migration

After you have defined the migrations, you can apply or revert migrations in console or on application startup.

## Command Line Interface (CLI)

Running migration manually in console. You should set `DATABASE_URL` in your environment, follow the instruction [here](03-generate-entity/01-sea-orm-cli.md#configure-environment) to configure it.

Supported commands:
- `init`: Initialize migration directory
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

Runs migrator CLI defined in `migration/main.rs`.

```shell
$ cd migration
$ cargo run -- COMMAND
```

## Migrating Programmatically

Performs migration on application startup with `Migrator`, given that it implements [`MigratorTrait`](https://docs.rs/sea-schema/0.5/sea_schema/migration/migrator/trait.MigratorTrait.html).

```rust title="src/main.rs"
use migration::{Migrator, MigratorTrait};

/// Apply all pending migrations
Migrator::up(db, None).await?;

/// Apply 10 pending migrations
Migrator::up(db, Some(10)).await?;

/// Rollback last applied migrations
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
