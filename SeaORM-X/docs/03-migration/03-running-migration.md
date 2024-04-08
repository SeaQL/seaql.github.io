# Running Migration

## Running Migration on Any MSSQL Schema

By default migration will be run on the `dbo` schema, you can now override it when running migration on the CLI or programmatically.

For CLI, you can specify the target schema with `-s` / `--database_schema` option:
* via sea-orm-cli: `sea-orm-cli migrate -u mssql://root:root@localhost/database -s my_schema`
* via SeaORM migrator: `cargo run -- -u mssql://root:root@localhost/database -s my_schema`

You can also run the migration on the target schema programmatically:

```rust
// With the default `dbo` schema
let connect_options = ConnectOptions::new("mssql://root:root@localhost/database");
// Or, override the default schema
let connect_options = ConnectOptions::new("mssql://root:root@localhost/database?currentSchema=my_schema");

let db = Database::connect(connect_options).await?

migration::Migrator::up(&db, None).await?;
```
