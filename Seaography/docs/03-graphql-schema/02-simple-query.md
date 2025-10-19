# Simple Query

## Query All

The simplest query you can do, which by default return all rows in a table.

```graphql
{
  film {
    nodes {
      filmId
      title
    }
  }
}
```

:::tip
You can apply a default and maximum pagination `limit` using `PaginationInputConfig` in `BuilderContext`.
:::

If `field-pluralize` is enabled, the endpoint is the plural form of the name:

```graphql
{
  films {
    nodes {
      filmId
      title
    }
  }
}
```

Both returns:

```json
{
  "film": {
    "nodes": [
      {
        "filmId": 1,
        "title": "ACADEMY DINOAUR",
        "releaseYear": 2006
      },
      ..
    ],
  }
}
```

## Query Single Item

You can query a single item by applying a filter with the id:

```graphql
{
  film(filters: { filmId: { eq: 1 } }) {
    nodes {
      filmId
      title
      releaseYear
    }
  }
}
```

The query result is same as before.

If `field-pluralize` is enabled, the endpoint is the singular form of the name:

```graphql
{
  film(id: 1) {
    filmId
    title
    releaseYear
  }
}
```

And the query result is the model itself, so wouldn't be nested under `nodes`:

```json
{
  "film": {
    "filmId": 1,
    "title": "ACADEMY DINOSAUR",
    "releaseYear": 2006
  }
}
```

## Order By

You can apply order by on any fields of the Model. By default, the type for `Film` is `FilmOrderInput`.

## Offset-based Pagination

Can switch page by the `page` parameter. `limit` specify the number of items per page.

```graphql
{
  film(pagination: { page: { limit: 10, page: 0 } }, orderBy: { filmId: ASC }) {
    nodes {
      filmId
      title
      releaseYear
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
  "film": {
    "nodes": [
      {
        "filmId": 1,
        "title": "ACADEMY DINOAUR",
        "releaseYear": 2006
      },
      {
        "filmId": 2,
        "title": "ACE GOLDFINGER",
        "releaseYear": 2006
      },
      ..
    ],
    "paginationInfo": {
      "pages": 100,
      "current": 0
    }
  }
}
```

## Cursor-based Pagination

To use cursor-based pagination, the first query is issued with `cursor` equals `null`:

```graphql
{
  film(
    pagination: { cursor: { limit: 3, cursor: null } }
    orderBy: { filmId: ASC }
  ) {
    nodes {
      filmId
      title
      releaseYear
    }
    pageInfo {
      hasPreviousPage
      hasNextPage
      endCursor
    }
  }
}
```

Here `hasPreviousPage` is `false`, meaning we're at the beginning. You then use the `endCursor` value for the next query's `cursor`.

```json
{
  "film": {
    "nodes": [
      {
        "filmId": 1,
        "title": "ACADEMY DINOSAUR",
        "releaseYear": 2006
      },
      {
        "filmId": 2,
        "title": "ACE GOLDFINGER",
        "releaseYear": 2006
      },
      {
        "filmId": 3,
        "title": "ADAPTATION HOLES",
        "releaseYear": 2006
      }
    ],
    "pageInfo": {
      "hasPreviousPage": false,
      "hasNextPage": true,
      "endCursor": "Int[1]:3"
    }
  }
}
```

```graphql
{
  film(
    pagination: { cursor: { limit: 3, cursor: "Int[1]:3" } }
    orderBy: { filmId: ASC }
  ) {
    nodes {
      filmId
      title
      releaseYear
    }
    pageInfo {
      hasPreviousPage
      hasNextPage
      endCursor
    }
  }
}
```
