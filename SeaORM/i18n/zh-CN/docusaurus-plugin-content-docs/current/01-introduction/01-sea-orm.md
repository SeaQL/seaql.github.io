# SeaORM 简介

## 什么是 ORM

对象关系映射（ORM）是一种编程库，帮助你在面向对象编程语言中与关系型数据库交互。

数据库中的表和列映射为对象和属性，方法则用于加载和存储数据。

用 Rust 构建的服务具有轻量级（小二进制文件、低内存占用）、安全（编译期保证）、正确（良好的单元测试）和高性能（编译期优化减少运行时开销）的特点。

由于 Rust 是一门静态的、强类型的、编译型的、线程安全的、无垃圾回收的、非传统面向对象的语言，在 Rust 中使用 ORM 与你熟悉的脚本语言有所不同。

SeaORM 致力于帮助你享受以上优势，同时避免 Rust 编程中的常见陷阱。

## SeaORM 核心概念

在 SeaORM 中，包含一组表的数据库称为 `Schema`。

每个表对应 SeaORM 中的一个 [`Entity`](04-generate-entity/02-entity-format.md#entity)，用于对相关表执行 `CRUD`（创建、读取、更新、删除）操作。

`Entity` trait 提供了一组 API，让你在运行时检查其属性：[`Column`](04-generate-entity/02-entity-format.md#column)、[`Relation`](04-generate-entity/02-entity-format.md#relation) 和 [`PrimaryKey`](04-generate-entity/02-entity-format.md#primary-key)。

每个表有多个列，在 SeaORM 中称为字段（field）。

这些字段及其值被组织在一个 Rust 结构体（[`Model`](13-internal-design/05-expanded-entity-format.md#model)）中，方便你进行操作。

但 `Model` 仅用于读取操作。要执行插入、更新或删除，你需要使用 [`ActiveModel`](13-internal-design/05-expanded-entity-format.md#active-model)，它为每个字段附加了状态信息。

最后，SeaORM 中没有单例（全局上下文）。应用代码负责管理 `DatabaseConnection` 的所有权。我们提供了多个 Web 框架的集成示例，包括 [Actix](https://github.com/SeaQL/sea-orm/tree/master/examples/actix_example)、[axum](https://github.com/SeaQL/sea-orm/tree/master/examples/axum_example)、[poem](https://github.com/SeaQL/sea-orm/tree/master/examples/poem_example)、[Loco](https://github.com/SeaQL/sea-orm/tree/master/examples/loco_example) 和 [salvo](https://github.com/SeaQL/sea-orm/tree/master/examples/salvo_example)，帮助你快速上手。
