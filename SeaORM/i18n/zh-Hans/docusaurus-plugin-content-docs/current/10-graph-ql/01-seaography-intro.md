# 🧭 Seaography

如果你正在构建一个带有 Web GUI 的全栈应用程序，那么你很可能会使用 GraphQL 作为前端和后端之间的通信接口。然而，对于后端开发人员来说，构建 GraphQL 解析器并非易事。

[Seaography](https://github.com/SeaQL/seaography) 是一个基于 SeaORM 和 [async-graphql](https://github.com/async-graphql/async-graphql) 构建的 GraphQL 框架。给定一组 SeaORM 实体，你可以立即启动一个功能齐全的 GraphQL 服务器/解析器，支持关系查询、过滤器、分页和突变。

SeaORM 在设计上是动态的，并提供一流的 GraphQL 支持。`async-graphql` `v5.0` 引入了[动态 schema](https://docs.rs/async-graphql/latest/async_graphql/dynamic/index.html)，与 SeaORM 完美契合。

Seaography 最初是 [2022 年编程之夏项目](https://github.com/SeaQL/summer-of-code/blob/main/2022/README.md#1-a-graphql-framework-on-top-of-seaorm)的一部分。