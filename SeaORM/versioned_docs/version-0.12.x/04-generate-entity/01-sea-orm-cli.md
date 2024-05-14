# Using `sea-orm-cli`

First, install `sea-orm-cli` with `cargo`.

```shell
cargo install sea-orm-cli
```

## Configure Environment

Set `DATABASE_URL` in your environment, or create a `.env` file in your project root. Specify your database connection.

```env title=".env"
DATABASE_URL=protocol://username:password@localhost/database
```

## Getting Help

Use `-h` flag on any CLI command or subcommand for help.

```shell
# List all available commands
sea-orm-cli -h

# List all subcommands available in `generate` command
sea-orm-cli generate -h

# Show how to use `generate entity` subcommand
sea-orm-cli generate entity -h
```

## Generating Entity Files

Discover all tables in a database and generate a corresponding SeaORM entity file for each table.

Supported databases:
- MySQL
- PostgreSQL
- SQLite

Command line options:
- `-u` / `--database-url`: database URL (default: DATABASE_URL specified in ENV)
- `-s` / `--database-schema`: database schema (default: DATABASE_SCHEMA specified in ENV)
    - for MySQL & SQLite, this argument is ignored
    - for PostgreSQL, this argument is optional with default value 'public'
- `-o` / `--output-dir`: entity file output directory (default: current directory)
- `-v` / `--verbose`: print debug messages
- `-l` / `--lib`: generate index file as `lib.rs` instead of `mod.rs`
- `--include-hidden-tables`: generate entity files from hidden tables (tables with names starting with an underscore are hidden and ignored by default)
- `--ignore-tables`: skip generating entity file for specified tables (default: `seaql_migrations`)
- `--compact-format`: generate entity file of [compact format](04-generate-entity/02-entity-structure.md) (default: true)
- `--expanded-format`: generate entity file of [expanded format](04-generate-entity/03-expanded-entity-structure.md)
- `--with-serde`: automatically derive serde Serialize / Deserialize traits for the entity (`none`, `serialize`, `deserialize`, `both`) (default: `none`)
    - `--serde-skip-deserializing-primary-key`: generate entity model with primary key field labeled as `#[serde(skip_deserializing)]`
    - `--serde-skip-hidden-column`: generate entity model with hidden column (column name starts with `_`) field labeled as `#[serde(skip)]`
- `--date-time-crate`: the datetime crate to use for generating entities (`chrono`, `time`) (default: `chrono`)
- `--max-connections`: maximum number of database connections to be initialized in the connection pool (default: `1`)
- `--model-extra-derives`: append extra derive macros to the generated model struct
- `--model-extra-attributes`: append extra attributes to generated model struct
- `--enum-extra-derives`: append extra derive macros to generated enums
- `--enum-extra-attributes`: append extra attributes to generated enums
- `--seaography`: generate addition structs in entities for seaography integration

```shell
# Generate entity files of database `bakery` to `entity/src`
sea-orm-cli generate entity -u protocol://username:password@localhost/bakery -o entity/src
```
