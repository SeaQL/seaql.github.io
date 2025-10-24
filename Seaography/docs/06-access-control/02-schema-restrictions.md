# Schema Restrictions

By default, the schema builder register full CRUD for all entities:

```rust
pub fn schema_builder(..) -> SchemaBuilder {
    let mut builder = Builder::new(context, database.clone());

    builder = register_entity_modules(builder);

    ..
}
```

You can register entities individually:

```rust
seaography::register_entity!(builder, actor);
seaography::register_entity!(builder, address);
..
```

## Hide Entity

You can omit certain entities from the schema.

However, if the Entity is related to other Entities, you need to remove it from all relations as well.
For example, to remove `Customer`:

```rust
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelatedEntity)]
pub enum RelatedEntity {
    #[sea_orm(entity = "super::customer::Entity")] // remove this
    Customer,                                      // remove this
}
```

## No mutation

You can also register entities without mutation if you intend to implement all mutations with custom operations:

```rust
seaography::register_entity!(builder, actor, mutation: false);
```

## Hide Column

You can remove a column from the GraphQL schema by annotating the SeaORM Model:

```rust
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Deserialize)]
#[sea_orm(table_name = "user")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i64,
    #[seaography(ignore)] // ⬅ remove from GraphQL schema
    pub password: String,
}
```

This column will still be usable in other parts of the application, for example in custom operations. But it will not be visible to clients.

If you remove this field from the struct, then this column will not be visible to the entire application.