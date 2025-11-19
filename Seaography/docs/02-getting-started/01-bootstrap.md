# Bootstrap Project

## Install cli tools

First, install our cli tools with `cargo`.

```shell
cargo install sea-orm-cli@^2.0.0-rc
cargo install seaography-cli@^2.0.0-rc
```

## Config database url

Set `DATABASE_URL` in your environment to your database connection.

```sh
export DATABASE_URL=protocol://username:password@localhost/database
```

Here are some tips for database specific options:

#### MySQL

```
mysql://username:password@host/database
```

#### Postgres

Specify a schema

```
postgres://username:password@host/database?options=--search_path=my_schema
```

#### SQLite

In memory

```
sqlite::memory:
```

Create file if not exists

```
sqlite://path/to/db.sqlite?mode=rwc
```

Read only

```
sqlite://path/to/db.sqlite?mode=ro
```

## Generate SeaORM Entities

```sh
sea-orm-cli generate entity -o src/entities --seaography
```

You will see something like:

```
Writing src/entities/actor.rs
Writing src/entities/address.rs
Writing src/entities/category.rs
Writing src/entities/city.rs
Writing src/entities/country.rs
Writing src/entities/customer.rs
Writing src/entities/film.rs
Writing src/entities/film_actor.rs
Writing src/entities/film_category.rs
Writing src/entities/inventory.rs
Writing src/entities/language.rs
Writing src/entities/payment.rs
Writing src/entities/rental.rs
Writing src/entities/staff.rs
Writing src/entities/store.rs
Writing src/entities/mod.rs
Writing src/entities/prelude.rs
Writing src/entities/sea_orm_active_enums.rs
... Done.
```

## Generate Seaography Project

```sh
seaography-cli -o . -e src/entities --framework axum my-seaography-project
```

You can choose between `actix`, `poem`, `axum` as the web framework. The generated project will have a crate named `my-seaography-project`.

### CLI options

```sh
🧭 A dynamic GraphQL framework for SeaORM

Usage: seaography-cli [OPTIONS] --entities <ENTITIES> --database-url <DATABASE_URL> <CRATE_NAME>

Arguments:
  <CRATE_NAME>  Crate name for generated project

Options:
  -o, --output-dir <OUTPUT_DIR>
          Project output directory [default: ./]
  -e, --entities <ENTITIES>
          Entities directory
  -u, --database-url <DATABASE_URL>
          Database URL [env: DATABASE_URL]
  -f, --framework <FRAMEWORK>
          Which web framework to use [default: poem] [possible values: actix, poem, axum]
      --depth-limit <DEPTH_LIMIT>
          GraphQL depth limit
      --complexity-limit <COMPLEXITY_LIMIT>
          GraphQL complexity limit
  -h, --help
          Print help
  -V, --version
          Print version
```

## Launch!

```sh
cargo build
```

You should see something like:

```sh
   Compiling seaography v2.0.0-rc.2
   Compiling seaography-postgres-example v0.1.0 (/Users/chris/seaography/examples/postgres)
    Finished `dev` profile [unoptimized + debuginfo] target(s) in 28.24s
```

If the build succeeds, then you can launch it:

```sh
cargo run
```

You should see something like:

```sh
Visit GraphQL Playground at http://localhost:8000
```