# Project Structure

The generated project looks like:

```sh
Cargo.toml
src
├── entities
│   ├── actor.rs
│   ├── address.rs
│   ├── category.rs
│   ├── city.rs
│   ├── country.rs
│   ├── mod.rs
│   ├── prelude.rs
│   ├── sea_orm_active_enums.rs
│   └── ..
├── lib.rs
├── main.rs
└── query_root.rs
```

## Entities

This is the folder containing all SeaORM entities. Each file corresponds to a database table.

### `mod.rs`

This is the module file listing all entities. These two macros `register_entity_modules!` and `register_active_enums!` register these entities to Seaography. If you want to ignore certain tables, you can remove them from this list.

```rust
pub mod prelude;

pub mod actor;
pub mod address;
pub mod category;
pub mod city;
pub mod country;

seaography::register_entity_modules!([
    actor,
    address,
    category,
    city,
    country,
    ..
]);
seaography::register_active_enums!([ .. ]);
```

## GraphQL schema

### `query_root.rs`

This is the root of the GraphQL schema.

```rust
lazy_static! {
    static ref CONTEXT: BuilderContext = BuilderContext::default();
}
```

The builder context has many config options, and allow you to customize the type mappings of the GraphQL schema. It also allows you to register field guards and lifecycle hooks.

Here it takes all the entities defined in `entities/mod.rs` and register them to Seaography schema builder.
If you added custom input, output or query endpoints, this is where you'd register them dynamically into the schema.
You can also attach custom data to the GraphQL schema.

```rust
pub fn schema_builder(
    context: &'static BuilderContext,
    database: DatabaseConnection,
    depth: Option<usize>,
    complexity: Option<usize>,
) -> SchemaBuilder {
    let mut builder = Builder::new(context, database.clone());
    builder = register_entity_modules(builder);
    builder = register_active_enums(builder);
    builder
        .set_depth_limit(depth)
        .set_complexity_limit(complexity)
        .schema_builder()
        .data(database)
}
```

## App

### `Cargo.toml`

```toml
[dependencies]
sea-orm = { version = "~2.0.0-rc", features = ["sqlx-postgres", "runtime-tokio-native-tls", "seaography"] }
..

[dependencies.seaography]
version = "~2.0.0-rc" # seaography version
features = ["with-decimal", "with-chrono"]
```

`sea-orm` version must match `seaography`'s version. If you're using other database, replace `sqlx-postgres` with `sqlx-mysql` / `sqlx-sqlite`.

There are some useful feature flags for `seaography`:

+ `macros`: derive macros
+ `schema-meta`: additional endpoints for schema metadata
+ `rbac`: RBAC support
+ `field-snake-case`: use snake case instead of camel case for fields
+ `field-pluralize`: pluralize complex fields. i.e. use `posts` instead of `post`
<br/>

+ `with-json`: support JSON as scalar value
+ `with-chrono`: support `chrono` crate
+ `with-time`: support `time` crate
+ `with-uuid`: support `uuid` crate
+ `with-decimal`: support `rust_decimal` crate
+ `with-bigdecimal`: support `bigdecimal` crate
+ `with-postgres-array`: support Postgres' array type

### `main.rs`

This is the entry point to the web app. It setups the routes, i.e. `GET` for GrapQL playground, `POST` for handling GraphQL queries.

You will find a config section:

```rust
lazy_static! {
    static ref URL: String = env::var("URL").unwrap_or(..);
    static ref ENDPOINT: String = env::var("ENDPOINT").unwrap_or(..);
    static ref DATABASE_URL: String = env::var("DATABASE_URL").expect(..);
    static ref DEPTH_LIMIT: Option<usize> = ..
    static ref COMPLEXITY_LIMIT: Option<usize> = ..
}
```

These are some config options you can override via environment variables, or by `.env`.
