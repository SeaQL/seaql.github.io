# 🧭 Seaography

<div align="center">

  <img src="https://raw.githubusercontent.com/SeaQL/seaography/main/docs/Seaography.png" width="280" alt="Seaography logo"/>

  <p><strong>🧭 A GraphQL framework for Rust</strong></p>
  <p>Quick to start, type‑safe, powerful and extensible</p>

</div>

## Introduction

[Seaography](https://github.com/SeaQL/seaography) is a GraphQL framework for Rust that bridges [SeaORM](https://www.sea-ql.org/SeaORM/) and [async-graphql](https://github.com/async-graphql/async-graphql),
turning your database schema into a fully-typed GraphQL API with minimal effort.
By leveraging async-graphql's dynamic schema engine, Seaography avoids the heavy code generation of static approaches, resulting in faster compile times.
The generated schema stays in sync with your SeaORM entities, while still giving you full control to extend and customize it.

With Seaography you can focus on application logic instead of boilerplate. It enables you to:

+ Expose a complete GraphQL schema directly from your SeaORM entities, including filters, pagination, and nested relations
+ Use derive macros to define custom input/output objects, queries, and mutations, and seamlessly mix them with SeaORM models
+ Generate ready-to-run GraphQL servers via the included CLI, supporting different web frameworks out of the box
+ Use RBAC, guards, and lifecycle hooks to implement authorization and custom business logic

Learn more about Seaography:

+ [Overview of Seaography 2.0](https://www.sea-ql.org/blog/2025-10-08-seaography/)
+ [Seaography's Extensive Documentation](https://www.sea-ql.org/Seaography/docs/index/)

Supported web frameworks:

+ Actix, Axum, Poem, Loco