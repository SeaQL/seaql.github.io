# 🧭 Seaography

GraphQL has become the preferred interface for product teams. Both frontend and backend developers benefit from its type-safety, contractual guarantees, and composability. Yet the real challenge lies on the backend: implementing relational resolvers that can traverse complex schemas is often difficult and time-consuming.

[Seaography](https://github.com/SeaQL/seaography) is a GraphQL framework built on top of SeaORM and [async-graphql](https://github.com/async-graphql/async-graphql). Given a set of SeaORM entities, you can instantly launch a fully-featured GraphQL server / resolver with relational query, filters, pagination and mutations.

In addition, Seaography is an extensible GraphQL framework allowing you grow it into a complex application backend:

+ Automatic GraphQL resolver generation with data loader integration to solve the N+1 problem
+ Extensive customization options and the ability to add custom endpoints easily
+ Authorization: Role-Based Access Control (RBAC) and fine-grained control with hooks / guards

Learn more about the [latest features of Seaography 2.0](https://www.sea-ql.org/blog/2025-10-08-seaography/).