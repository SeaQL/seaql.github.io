# Type Mappings

## Type Names

You can customize the names of various support types via `BuilderContext`.

For example, the Entity `Actor` has `ActorInsertInput` and `ActorUpdateInput` for insert and update respectively.

You can customize this suffix using `EntityInputConfig`:

```rust
lazy_static::lazy_static! {
    static ref CONTEXT : BuilderContext = {
        BuilderContext {
            entity_input: EntityInputConfig {
                insert_suffix: "InsertInput".into(),
                update_suffix: "UpdateInput".into(),
                ..Default::default()
            },
            ..Default::default()
        }
    };
}
```

You can also customize the type name of connection objects:

```rust
BuilderContext {
    connection_object: ConnectionObjectConfig {
        type_name: Box::new(|object_name: &str| -> String {
            format!("{object_name}Connection")
        }),
    },
    ..Default::default()
}
```

## Type Mapping

### Type Library

SeaORM support different libraries for the same column type, there are two supported date time library: `chrono` and `time`, and two supported decimal library `rust_decimal` and `BigDecimal`.

If your entities uses one over the other, you have to config it accordingly:

```rust
BuilderContext {
    types: TypesMapConfig {
        time_library: TimeLibrary::Time | TimeLibrary::Chrono,
        decimal_library: DecimalLibrary::Decimal | DecimalLibrary::BigDecimal,
        ..Default::default()
    },
    ..Default::default()
}
```

### Custom Conversion

You can override the type for individual columns, and even use custom functions for input / output conversion:

```rust
BuilderContext {
    types: TypesMapConfig {
        column_options: {
            let mut map = BTreeMap::new();
            map.insert(
                EntityColumnId::of::<my_entity::Entity>(&my_entity::Column::MyColumn),
                ColumnOptions {
                    /// used to map entity_name.column_name to a custom Type
                    overwrite: Some(ConvertedType::BigDecimal),
                    /// used to map entity_name.column_name input to a custom parser
                    input_conversion: Some(Arc::new(
                        |value: &ValueAccessor| -> SeaResult<sea_orm::Value> {
                            Ok(..)
                        }
                    )),
                    /// used to map entity_name.column_name output to a custom formatter
                    output_conversion: Some(Arc::new(
                        |value: &sea_orm::Value|
                            -> async_graphql::Result<Option<async_graphql::dynamic::FieldValue<'static>>>
                        {
                            Ok(..)
                        }
                    )),
                    /// used to override the type of this column in input objects
                    input_type: Some(TypeRef::STRING),
                    /// used to override the type of this column in output objects
                    output_type: Some(TypeRef::named_nn("MyType")),
                }
            );
            map
        }
        ..Default::default()
    },
    ..Default::default()
}
```

## Filter Type Mappings

You can also customize what operators are available on each data type.

```rust
BuilderContext {
    filter_types: FilterTypesMapConfig {
        string_filter_info: FilterInfo {
            type_name: "StringFilterInput".into(),
            base_type: TypeRef::STRING.into(),
            supported_operations: BTreeSet::from([
                FilterOperation::Equals,
                FilterOperation::NotEquals,
                ..
            ]),
        },
        ..Default::default()
    },
    ..Default::default()
}
```

You can override the filter type on individual columns and supply a custom function:

```rust
BuilderContext {
    filter_types: FilterTypesMapConfig {
        overwrites: [(
            EntityColumnId::of::<my_entity::Entity>(&my_entity::Column::MyColumn),
            Some(FilterType::Custom("MyType".into()))
        )].into_iter().collect(),
        condition_functions: [(
            EntityColumnId::of::<my_entity::Entity>(&my_entity::Column::MyColumn),
            Box::new(|condition: Condition, object: &ObjectAccessor| -> SeaResult<Condition> {
                // do something with condition
                Ok(condition)
            })
        )].into_iter().collect(),
        ..Default::default()
    },
    ..Default::default()
}
```

### ILIKE

```rust
BuilderContext {
    entity_query_field: EntityQueryFieldConfig {
        use_ilike: true,
        ..Default::default()
    },
    ..Default::default()
}
```

This enables the `ilike` operator.

## Timestamp Format

You can turn on this option to use ISO format for timestamps:

```rust
BuilderContext {
    types: TypesMapConfig {
        timestamp_rfc3339: true,
        ..Default::default()
    },
    ..Default::default()
}
```

Query:

```graphql
{
    film(filters:{filmId: {eq: 1}}) {
      nodes {
        title
        lastUpdate
      }
    }
}
```

Result:

```json
{
  "film": {
    "nodes": [
      {
        "title": "ACADEMY DINOSAUR",
        "lastUpdate": "2022-11-14T10:30:09+00:00"
      }
    ]
  }
}
```