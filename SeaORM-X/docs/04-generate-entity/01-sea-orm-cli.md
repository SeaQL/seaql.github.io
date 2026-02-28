# Using `sea-orm-cli`

Install `sea-orm-cli` with `cargo` locally.

```shell
cargo install --path "<SEA_ORM_X_ROOT>/sea-orm-x/sea-orm-cli"
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
- MSSQL
- MySQL
- PostgreSQL
- SQLite

Command line options:
- `-u` / `--database-url`: database URL (default: DATABASE_URL specified in ENV)
- `-s` / `--database-schema`: database schema (default: DATABASE_SCHEMA specified in ENV)
    - for MySQL & SQLite, this argument is ignored
    - for PostgreSQL, this argument is optional with default value 'public'
    - for MSSQL, this argument is optional with default value 'dbo'
- `-o` / `--output-dir`: entity file output directory (default: current directory)
- `-v` / `--verbose`: print debug messages
- `-l` / `--lib`: generate index file as `lib.rs` instead of `mod.rs`
- `--include-hidden-tables`: generate entity files from hidden tables (tables with names starting with an underscore are hidden and ignored by default)
- `--ignore-tables`: skip generating entity file for specified tables (default: `seaql_migrations`)
- `--entity-format`: entity format to generate (`compact`, `dense`, `expanded`) (default: `compact`)
  - `dense` (recommended for 2.0): inline relations on the model struct with `#[sea_orm::model]`
  - `compact`: the classic compact format
  - `expanded`: fully expanded format with all boilerplate spelled out
- `--with-serde`: automatically derive serde Serialize / Deserialize traits for the entity (`none`, `serialize`, `deserialize`, `both`) (default: `none`)
    - `--serde-skip-deserializing-primary-key`: generate entity model with primary key field labeled as `#[serde(skip_deserializing)]`
    - `--serde-skip-hidden-column`: generate entity model with hidden column (column name starts with `_`) field labeled as `#[serde(skip)]`
- `--date-time-crate`: the datetime crate to use for generating entities (`chrono`, `time`) (default: `chrono`)
- `--max-connections`: maximum number of database connections to be initialized in the connection pool (default: `1`)
- `--model-extra-derives`: append extra derive macros to the generated model struct
- `--model-extra-attributes`: append extra attributes to generated model struct
- `--seaography`: generate addition structs in entities for seaography integration

```shell
# Generate entity files of database `bakery` to `entity/src`
sea-orm-cli generate entity -u mssql://sa:password@localhost/bakery -o entity/src
```

### Example: AdventureWorks

```sh
sea-orm-cli generate entity \
  --database-url "mssql://sa:YourStrong()Passw0rd@localhost/AdventureWorksLT2016" \
  --database-schema "SalesLT" \
  --entity-format dense \
  -o entity/src
```

```
Connecting to MSSQL ...
Discovering schema ...
... discovered.
Generating address.rs
    > Column `AddressID`: i32, auto_increment, not_null
    > Column `AddressLine1`: String, not_null
    > Column `AddressLine2`: Option<String>
    > Column `City`: String, not_null
    > Column `StateProvince`: String, not_null
    > Column `CountryRegion`: String, not_null
    > Column `PostalCode`: String, not_null
    > Column `rowguid`: Uuid, not_null, unique
    > Column `ModifiedDate`: DateTime, not_null
...
```

The generated entity file:

```rust title="address.rs"
use sea_orm::entity::prelude::*;

#[sea_orm::model]
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq)]
#[sea_orm(schema_name = "SalesLT", table_name = "Address")]
pub struct Model {
    #[sea_orm(column_name = "AddressID", primary_key)]
    pub address_id: i32,
    #[sea_orm(column_name = "AddressLine1")]
    pub address_line1: String,
    #[sea_orm(column_name = "AddressLine2")]
    pub address_line2: Option<String>,
    #[sea_orm(column_name = "City")]
    pub city: String,
    #[sea_orm(column_name = "StateProvince")]
    pub state_province: String,
    #[sea_orm(column_name = "CountryRegion")]
    pub country_region: String,
    #[sea_orm(column_name = "PostalCode")]
    pub postal_code: String,
    #[sea_orm(unique)]
    pub rowguid: Uuid,
    #[sea_orm(column_name = "ModifiedDate")]
    pub modified_date: DateTime,
}
```
