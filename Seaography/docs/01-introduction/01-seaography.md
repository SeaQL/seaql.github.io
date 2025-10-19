# Why Seaography

## What is GraphQL

GraphQL, originally open-sourced by Facebook, is both a query language and a runtime for APIs. Instead of exposing multiple endpoints like REST, GraphQL provides a single endpoint where clients can specify the exact fields and relationships they want. This makes responses predictable and shaped exactly like the request.

### Benefits of GraphQL

#### Precise data fetching

Clients avoid over-fetching or under-fetching by requesting only the fields they need.

#### Strongly typed schema

The schema acts as a contract between client and server, improving validation, documentation, and developer experience.

#### Unified data access

GraphQL can aggregate data from multiple sources into one query, reducing round-trips. All API requests go through a single POST endpoint.

## Async-GraphQL

[async-graphql](https://docs.rs/async-graphql/latest/async_graphql/) is a Rust library that implements the GraphQL specification with a asynchronous execution model, strong type safety, and dynamic schema definition. It offers:

#### Concurrent field resolution

If a query requests multiple independent fields, async‑graphql can fetch them in parallel.

#### Complexity & depth limits

Built‑in guards to prevent denial‑of‑service via overly complex queries.

#### Strongly-typed schema

Automatic validation ensures schema and resolvers remain consistent.

## Seaography

Seaography is built on top of async‑graphql, offering a set of derive macros, seamless integration with SeaORM, and advanced query capabilities out of the box.

#### Derive macros & faster builds

Seaography provides a set of derive macros for dynamic schema that mirror those used for static schemas in async‑graphql. This makes defining custom GraphQL endpoints easy but also addresses the problem of slow compilation as schema complexity grows.

#### Seamless SeaORM integration

Seaography integrates directly with SeaORM, adding minimal overhead while offering advanced relational query capabilities.

#### Full‑stack solution

Seaography covers all the needs of building complex applications - from data access, backend API, access control to frontend integration ([SeaORM Pro](https://www.sea-ql.org/sea-orm-pro)).