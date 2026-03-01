# 🧭 Seaography

<div align="center">

  <img src="https://raw.githubusercontent.com/SeaQL/seaography/main/docs/Seaography.png" width="280" alt="Seaography logo"/>

  <p><strong>🧭 面向 Rust 的 GraphQL 框架</strong></p>
  <p>快速启动 GraphQL 后端的最快方式</p>

</div>

## 简介

[Seaography](https://github.com/SeaQL/seaography) 是一个**强大且可扩展的 Rust GraphQL 框架**，它连接了 [SeaORM](https://www.sea-ql.org/SeaORM/) 和 [async-graphql](https://github.com/async-graphql/async-graphql)，
以最小化工作量即可将你的数据库架构转化为完全类型化的 GraphQL API。
通过利用 async-graphql 的动态 schema 引擎，Seaography 避免了静态方案中繁重的代码生成，从而获得更快的编译时间。
生成的 schema 与你的 SeaORM 实体保持同步，同时仍让你完全控制扩展和自定义。

使用 Seaography，你可以专注于应用逻辑而非样板代码。它使你能够：

+ 直接从 SeaORM 实体暴露完整的 GraphQL schema，包括过滤器、分页和嵌套关系
+ 使用 derive 宏定义自定义输入/输出对象、查询和变更，并与 SeaORM 模型无缝混合
+ 通过内置 CLI 生成可直接运行的 GraphQL 服务器，开箱即用支持不同的 Web 框架
+ 使用 RBAC、guards 和生命周期钩子实现授权和自定义业务逻辑

了解更多关于 Seaography：

+ [Seaography 2.0 概述](https://www.sea-ql.org/blog/2025-10-08-seaography/)
+ [Seaography 完整文档](https://www.sea-ql.org/Seaography/docs/index/)

支持的 Web 框架：

+ Actix、Axum、Poem、Loco
