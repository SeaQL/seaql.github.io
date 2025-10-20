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