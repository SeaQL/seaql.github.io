# Data Types

GraphQL only has these built-in scalar types:

+ `Int`: A signed 32‐bit integer.
+ `Float`: A signed double-precision floating-point value.
+ `String`: A UTF‐8 character sequence.
+ `Boolean`: `true` or `false`.

The SeaORM type system supports a richer set of types, including:

+ `Date`, `Time`, `Datetime`: will be mapped to `String`
+ `Decimal`, `BigDecimal`: will be mapped to `String`
+ `Uuid`: will be mapped to `String`
+ `Json`: will be mapped to a custom scalar type `Json`

### MySQL / Postgres Enums

MySQL / Postgres enums are supported with SeaORM's `ActiveEnum`.

For example, the following Rust enum would be mapped to a GraphQL enum:
```rust
#[derive(Debug, Clone, PartialEq, Eq, EnumIter, DeriveActiveEnum)]
#[sea_orm(rs_type = "String", db_type = "Enum", enum_name = "mpaa_rating")]
pub enum MpaaRating {
    #[sea_orm(string_value = "G")]
    G,
    #[sea_orm(string_value = "PG")]
    Pg,
    #[sea_orm(string_value = "PG-13")]
    Pg13,
    #[sea_orm(string_value = "R")]
    R,
    #[sea_orm(string_value = "NC-17")]
    Nc17,
}
```

```graphql
enum MpaaRatingEnum {
  G
  PG
  PG13
  R
  NC17
}
```