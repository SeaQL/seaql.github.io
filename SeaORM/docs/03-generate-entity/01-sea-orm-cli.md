# Using `sea-orm-cli`

First, install `sea-orm-cli` with `cargo`.

```shell
$ cargo install sea-orm-cli
```

## Configure Environment

Setting `DATABASE_URL` in your environment, or create a `.env` file in your project root. Specify your database connection.

```env title=".env"
DATABASE_URL=sql://username:password@localhost/database
```

## Getting Help

Use `-h` flag on any CLI command or subcommand for help.

```shell
# List all available commands
$ sea-orm-cli -h

# List all subcommands available in `generate` command
$ sea-orm-cli generate -h

# Show how to use `generate entity` subcommand
$ sea-orm-cli generate entity -h
```

## Generating Entity Files

Discover all tables in a database and generate corresponding SeaORM entity file for each table.

Command line options:
- `-url` / `--database-url`: database URL (default: DATABASE_URL specified in ENV)
- `-schema` / `--database-schema`: database schema (optional; default: DATABASE_SCHEMA specified in ENV)
- `-o` / `--output-dir`: entity file output directory (default: current directory)

```shell
# Generate entity files of database `bakery` to `src/entity`
$ sea-orm-cli generate entity \
    -url sql://sea:sea@localhost/bakery \
    -o src/entity
```
