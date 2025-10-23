# Pagination

You can customize the field names of pagination inputs. But the more useful option is default and max limit for protection against overfetching.

```rust
BuilderContext {
    pagination_info_object: PaginationInputConfig {
        type_name: "PaginationInput".into(),
        cursor: "cursor".into(),
        page: "page".into(),
        offset: "offset".into(),
        default_limit: Some(10),
        max_limit: Some(100),
    },
    ..Default::default()
}
```

## Pagination Limits

### Default Limit

If no default or maximum limit is specified, queries will return *all* matching rows.

If both are specified, the lesser of the two will be used as the default. You should set `default_limit` to be less than or equal to `max_limit`.

### Max Limit

If set, requests including a pagination limit greater than this will be rejected.

If `default_limit` is _not_ set, but `max_limit` _is_, then the latter will effectively be treated as the default.

### Examples

Consider the following config:

```rust
PaginationInputConfig{
    default_limit: Some(3),
    max_limit: Some(10),
    ..Default::default()
},
```

#### Default Limit

```graphql
{
  customer {
    nodes {
      customerId
      firstName
      lastName
    }
    paginationInfo {
      pages
      current
    }
  }
}
```

```json
{
  "customer": {
    "nodes": [
      .. // only got 3 items
    ],
    "paginationInfo": {
      "pages": 200,
      "current": 0
    }
  }
}
```

#### Max Limit

```graphql
{
  customer(
    pagination: { page: { page: 1, limit: 11 } }
  ) {
    nodes {
      customerId
    }
    paginationInfo {
      pages
      current
    }
  }
}
```

Results in:

```json
Query Error: Requested pagination limit (11) exceeds maximum allowed (10)
```