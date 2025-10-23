# Project Structure

It is recommended that you structure the project like the following:

```sh
Cargo.toml
src
├── entities
│   └── ..
├── query_root
│   ├── mutations.rs
│   ├── queries.rs
│   └── types.rs
├── lib.rs
├── main.rs
└── query_root.rs
```

```rust title="query_root.rs"
// define new modules
mod mutations;
mod queries;
mod types;

pub fn schema_builder(
    context: &'static BuilderContext,
    database: DatabaseConnection,
    depth: Option<usize>,
    complexity: Option<usize>,
) -> SchemaBuilder {
    let mut builder = Builder::new(context, database.clone());
    builder = register_entity_modules(builder);

    // here you register them to the schema
    seaography::register_custom_inputs!(builder, [types::RentalRequest, ..]);
    seaography::register_custom_outputs!(builder, [types::PurchaseOrder, ..]);
    seaography::register_complex_custom_outputs!(builder, [types::Rectangle, ..]);
    seaography::register_custom_unions!(builder, [types::Shape, ..]);
    seaography::register_custom_queries!(builder, [queries::Operations]);
    seaography::register_custom_mutations!(builder, [mutations::Operations]);

    builder
        .set_depth_limit(depth)
        .set_complexity_limit(complexity)
        .schema_builder()
        .enable_uploading() // ⬅ if you need to handle uploads
        .data(database)
}
```