# Field Names

## snake_case

Seaography supports customizing field names, in `camelCase` (default) or `snake_case`. You can turn on snake case with:

```toml title="Cargo.toml"
[dependencies.seaography]
version = "~2.0.0-rc" # seaography version
features = ["field-snake-case"]
```

Turning on snake case the GraphQL schema would look like the following:

```graphql
type Actor {
  actor_id: Int!
  first_name: String!
  last_name: String!
  last_update: String!
  film(
    filters: FilmFilterInput
    order_by: FilmOrderInput
    pagination: PaginationInput
  ): FilmConnection!
}
```

## Plural fields

```toml title="Cargo.toml"
[dependencies.seaography]
version = "~2.0.0-rc" # seaography version
features = ["field-pluralize"]
```

The GraphQL schema looks like, note the `actor` `s`:

```graphql
actors(
  filters: ActorFilterInput
  having: ActorHavingInput
  order_by: ActorOrderInput
  pagination: PaginationInput
): ActorsConnection!
```

A new singular endpoint would be added:

```graphql
actor(
  id: Int!
): Actor
```