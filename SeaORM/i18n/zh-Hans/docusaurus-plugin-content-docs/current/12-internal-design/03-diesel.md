# 与 Diesel 对比

[SeaORM](https://github.com/SeaQL/sea-orm) 和 [Diesel](https://github.com/diesel-rs/diesel) 有着相同的目标：为你提供与数据库交互的完整解决方案。

SeaORM 和 Diesel 都支持 MySQL、PostgreSQL 和 SQLite，所以你选择任何一个都不会受到限制。Diesel 允许第三方实现自定义后端，而 SeaORM 不支持。

我们还在其他一些方面做出了不同的选择。

## 架构

首先，也许是需求排名第一的功能，即异步 Rust 支持。虽然使用异步在今天可能不会为你带来更好的性能，但在异步中编程是你必须尽早做出的架构决策。通过选择 SeaORM，我们共同期待 Rust 异步生态系统的成熟。

在底层，SeaORM 与 [SQLx](https://crates.io/crates/sqlx) 一起为你提供了一个纯 Rust 技术栈。Diesel 默认使用原生驱动程序，你可能需要花费一些精力才能将其替换为纯 Rust 驱动程序。两者各有优缺点，这取决于你的偏好。

SeaORM 采用模块化设计。如果你不喜欢 ORM 的想法，你肯定仍然会想使用 [SeaQuery](https://crates.io/crates/sea-query)，它是底层的查询构建器。它轻量级，可以轻松集成到任何项目中。使用 SeaORM 时，SeaQuery API 也可供你使用，因此你可以获得高级抽象的好处，同时在需要时仍然拥有灵活查询构建器的强大功能。

## 编程范式

除了同步与异步的基础之外，Diesel 和 SeaORM 之间最大的区别是静态与动态。

Diesel 提供了一个完全在编译时检查类型的 API。你也可以使用 Diesel 进行动态查询，但会失去一些编译时类型检查的好处。

SeaORM 是动态的，其中事物在运行时建立。它提供了更大的灵活性。虽然你失去了一些编译时检查，但 SeaORM 通过测试来帮助你证明正确性。

这两个库都大量使用了 trait 和泛型，但 SeaORM 生成的类型更少：Diesel 中的每一列都是一个结构体（每个结构体都实现了多个 trait），而 SeaORM 中的每一列都是一个枚举变体（一个实体的所有列共同组成一个枚举，该枚举实现了一些 trait）。

SeaORM 中也没有深度嵌套的泛型（例如 `A<B<C<D<E>>>>`）。

## Schema 构建器

虽然在 Diesel 生态系统中有像 [barrel](https://git.irde.st/spacekookie/barrel) 这样很棒的库，但 SeaQL 维护着用于 schema 构建 (SeaQuery) 和管理 ([SeaSchema](https://github.com/SeaQL/sea-schema)) 的工具。这意味着熟悉的 API 和统一的体验。

## 相似之处

Diesel 和 SeaORM 都是 schema 优先的，这意味着一切都从你现有的数据库 schema 开始，而不是从你的 OOP 类开始。

Diesel 和 SeaORM 都是关系型的，这意味着你可以通过定义的关系进行复杂的连接。

## 最后的话

Diesel 是 Rust 生态系统中一个成熟的库。SeaORM 还很新。两者都无法取代对方。我们希望 Rust 社区能够共同成长壮大。