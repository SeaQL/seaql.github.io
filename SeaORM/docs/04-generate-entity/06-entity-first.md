# Entity First Workfllow

SeaORM also supports an Entity first approach: your entities are the source of truth, and you run run DDL on the database to match your entity definition. 

:::tip Since `2.0.0`
The following requires the `schema-sync` feature flag.
:::

```rust
// it doesn't matter which order you register entities.
// SeaORM figures out the foreign key dependencies and
// creates the tables in the right order along with foreign keys
db.get_schema_builder()
    .register(cake::Entity)
    .register(cake_filling::Entity)
    .register(filling::Entity)
    .sync(db) // synchronize the schema with database, 
              // will create missing tables, columns, indexes, foreign keys.
              // this operation is addition only, will not drop anything.
    .await?;
```
