# Query Filters

Seaography has a rich set of built-in filters for different data types.

## Operators

| Operator | GraphQL Field | Supported Types |
| :-: | :-: | :-: |
| `=` / `!=` | `eq` / `ne` | String, String-like, Integer, Float, Boolean, Json |
| `>` / `>=` | `gt` / `gte` | String, String-like, Integer, Float, Boolean |
| `<` / `<=` | `lt` / `lte` | String, String-like, Integer, Float, Boolean |
| case insensitive `=` | `ci_eq` | String |
| `IN (..)` / `NOT IN (..)` | `is_in` / `is_not_in` | String, String-like, Integer, Float, Boolean |
| `IS NULL` | `is_null` | String, String-like, Integer, Float, Boolean |
| contains (`LIKE '%abc%'`) | `contains` | String |
| starts_with (`LIKE 'abc%'`) | `starts_with` | String |
| ends_with (`LIKE '%abc'`) | `ends_with` | String |
| `LIKE` / `NOT LIKE` | `like` / `not_like` | String |
| `ILIKE` (Postgres) | `ilike` | String |
| `BETWEEN` / `NOT BETWEEN` | `between` / `not_between` | String, String-like, Integer, Float |
| contains `@>` (Postgres) | `array_contains` | Array |
| contained `<@` (Postgres) | `array_contained` | Array |
| overlap `&&` (Postgres) | `array_overlap` | Array |

`Date`, `DateTime`, `Decimal` etc are String-like.

## Chaining Filters

You can specify multi fields in `filters` and they will be chained with `AND`.

You can also combine multiple filters with `AND` / `OR`:

```graphql
{
  film(
    filters: {
      or: [{ title: { contains: "LIFE" } }, { title: { contains: "WAR" } }]
    }
  ) {
    nodes {
      title
    }
  }
}
```

Results in following SQL:

```sql
WHERE `film`.`title` LIKE '%LIFE%' OR `film`.`title` LIKE '%WAR%'
```

## Examples

### `IS NULL`

There is no `IS NOT NULL`, because `is_null` has a single `bool` value, with `false` meaning `IS NOT NULL`.

```graphql
{
  address(
    filters: { postalCode: { is_null: true } }
  ) {
    nodes {
      address
      postalCode
    }
  }
}
```

### `ILIKE`

Postgres only. Requires custom config in `BuilderContext`:

```rust
EntityQueryFieldConfig {
    use_ilike: true,
    ..Default::default()
}
```

```graphql
{
  customer(filters: {
    firstName: {
      ilike: "mario%"
    }
  }) {
    nodes {
      firstName
      lastName
    }
  }
}
```

### `IN`

```graphql
{
  customer(filters: {
    firstName: {
      is_in: ["PETER", "MARY"]
    }
  }) {
    nodes {
      firstName
      lastName
    }
  }
}
```

### String `contains`

```graphql
{
  address(filters: { address: { contains: "Lane" } }) {
    nodes {
      address
      address2
      postalCode
    }
  }
}
```

### `array_contains`

Postgres only, requires `with-postgres-array` feature.

```graphql
{
  film(filters: {
    title: { contains: "LIFE" }
    specialFeatures: { array_contains: ["Trailers"] }
  }) {
    nodes {
      title
      specialFeatures
    }
  }
}
```

### JSON `=`

Requires `with-json` feature. Let's say you've added a `metadata` field to the `film` table:

```rust
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq)]
#[sea_orm(table_name = "film")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub film_id: i32,
    pub title: String,
    #[sea_orm(column_type = "JsonBinary", nullable)]
    pub metadata: Option<Json>,
}
```

You can then filter by JSON value:

```graphql
{
  film(
    filters: {
      metadata: { eq: { imax: true, dolby: "Atmos" } }
    }
  ) {
    nodes {
      filmId
      title
      metadata
    }
  }
}
```

### MySQL / Postgres Enums

You can filter using MySQL / Postgres enums. The filter operands are typed:

```graphql
input FilmFilterInput {
  rating: MpaaRatingEnumFilterInput
  ..
}

input MpaaRatingEnumFilterInput {
  eq: MpaaRatingEnum
  ne: MpaaRatingEnum
  ..
}

enum MpaaRatingEnum {
  G
  PG
  PG13
  R
  NC17
}
```

Such that you can do the following:

```graphql
{
  film(
    filters: { rating: { eq: NC17 } }
    pagination: { page: { page: 1, limit: 5 } }
  ) {
    nodes {
      filmId
      title
      rating
    }
  }
}
```