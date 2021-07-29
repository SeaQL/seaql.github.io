# Using `sea-orm-cli`

First, install `sea-orm-cli` with `cargo install`.

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
# Show all available commands
$ sea-orm-cli -h

# Show all subcommand available in `generate` command
$ sea-orm-cli generate -h

# Show how to use `generate entity` subcommand
$ sea-orm-cli generate entity -h
```

## Generating Entity Files

Discover all tables in a database and generate corresponding SeaORM entity file for each table.

Command options:
- `-url` / `--database-url`: database URL (default: DATABASE_URL specified in env file)
- `-schema` / `--database-schema`: database schema (default: DATABASE_SCHEMA specified in env file)
- `-o` / `--output-dir`: entity file output directory (default: current directory)
  - It is recommanded to output entity files to a separate folder

```shell
# Generate entity files to `src/entity` folder
$ sea-orm-cli generate entity -o src/entity

# Generate entity files with explicit database URL and schema
$ sea-orm-cli generate entity \
    -url mysql://sea:sea@localhost/bakery \
    -schema bakery \
    -o src/entity
```

See the full working example [here](https://github.com/SeaQL/sea-orm/tree/master/examples/cli).
