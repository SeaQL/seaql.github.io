# Relational Queries

## Nested Relational Query

You can perform deeply nested relational query with Seaography. `async-graphql`'s data loader is used to solve the N+1 problem.

Junction tables can be skipped in many-to-many relations. For example, `film` `<->` `actor` via the junction table `film_actor`.

You can query films with their list of actors in one query:

```graphql
{
  film {
    nodes {
      filmId
      title
      actor {
        nodes {
          firstName
          lastName
        }
      }
    }
  }
}
```

Results in:

```json
{
  "film": {
    "nodes": [
      {
        "filmId": 3,
        "title": "ADAPTATION HOLES",
        "actor": {
          "nodes": [
            {
              "firstName": "NICK",
              "lastName": "WAHLBERG"
            },
            ..
          ]
        }
      }
    ]
  }
}
```

## Filter by Related Entity

The following query finds us all the documentaries starred by the actor "David" along with the stores having it in stock so that we can go rent it.

```graphql
{
  film(
    # ⬇ filter by related entity
    having: { # ⬅ where exists (..) AND (..)
      actor: { firstName: { eq: "David" } }
      category: { name: { eq: "Documentary" } }
    }
  ) {
    nodes {
      filmId
      title
      # ⬇ skipped the film_actor junction
      actor {
        nodes {
          firstName
          lastName
        }
      }
      # ⬇ nested relational query
      inventory {
        nodes {
          store {
            address {
              address
              city {
                city
              }
            }
          }
        }
      }
    }
  }
}
```

There are two join paths in this query:

```rust
film -> film_actor -> actor
     -> inventory -> store -> address -> city
```
