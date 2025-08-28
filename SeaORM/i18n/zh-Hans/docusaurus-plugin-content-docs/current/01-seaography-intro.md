# 🧭 Seaography

If you are building a full-stack application with a web GUI these days, it's likely you'd use GraphQL as the communication interface between frontend and backend. However, building GraphQL resolvers is no easy task for backend developers.

[Seaography](https://github.com/SeaQL/seaography) is a GraphQL framework built on top of SeaORM and [async-graphql](https://github.com/async-graphql/async-graphql). Given a set of SeaORM entities, you can instantly launch a fully-featured GraphQL server / resolver with relational query, filters, pagination and mutations.

SeaORM is dynamic by design with first-class GraphQL support. `async-graphql` `v5.0` introduced [dynamic schema](https://docs.rs/async-graphql/latest/async_graphql/dynamic/index.html) and is a perfect match with SeaORM.

Seaography started out as a [Summer of Code 2022 project](https://github.com/SeaQL/summer-of-code/blob/main/2022/README.md#1-a-graphql-framework-on-top-of-seaorm).