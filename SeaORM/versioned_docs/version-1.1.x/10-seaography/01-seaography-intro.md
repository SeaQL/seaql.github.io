# 🧭 Seaography Intro

If you are building a full-stack application with a web GUI these days, it's likely you'd use GraphQL as the communication interface between frontend and backend. A GraphQL schema is strongly typed and self-documenting, so no doubt frontend developers love them!

However, building GraphQL resolvers is no easy task for backend developers. There is a huge impedance mismatch between GraphQL and SQL, even though they both deemed relational. Luckily, we've got your back!

[Seaography](https://github.com/SeaQL/seaography) is a GraphQL framework built on top of SeaORM and [async-graphql](https://github.com/async-graphql/async-graphql). Together with many other Rust libraries (e.g. `tokio`, `serde`), we argue, the Rust ecosystem provides the best technology for building GraphQL backends!

SeaORM is dynamic by design. `async-graphql` `v5.0` introduced [dynamic schema](https://docs.rs/async-graphql/latest/async_graphql/dynamic/index.html) and is a perfect match with SeaORM, as we can take a SeaORM Entity and upgrade it into a GraphQL Entity.

Seaography started out as a [Summer of Code 2022 project](https://github.com/SeaQL/summer-of-code/blob/main/2022/README.md#1-a-graphql-framework-on-top-of-seaorm). It is still in an early stage, the current limitations are: 1) No mutation 2) No Data Loader, but nonetheless can be useful in prototyping and building internal-use admin panels.

With just a few commands, you can launch a GraphQL server from SeaORM entities!