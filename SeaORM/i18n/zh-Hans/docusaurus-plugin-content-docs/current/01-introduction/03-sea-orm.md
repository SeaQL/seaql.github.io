# SeaORM 概念

在 SeaORM 中，包含多个表的数据库称为 `Schema`。

每个表对应 SeaORM 中的一个 [`Entity`](04-generate-entity/02-entity-format.md#entity)，它帮助你对相关表执行 `CRUD`（创建、读取、更新和删除）操作。

`Entity` trait 提供了一个 API，供你在运行时检查其属性（包括 [`Column`](04-generate-entity/02-entity-format.md#column)、[`Relation`](04-generate-entity/02-entity-format.md#relation) 和 [`PrimaryKey`](04-generate-entity/02-entity-format.md#primary-key)）。

每个表都有多个列，这些列被称为 `attribute`。

这些属性及其对应的值会被组合到一个 Rust 结构体中（即 [`Model`](12-internal-design/05-expanded-entity-format.md#model)），方便你进行操作。

不过，`Model` 仅用于读取。要执行插入、更新或者删除，你需要使用 [`ActiveModel`](12-internal-design/05-expanded-entity-format.md#active-model)，它为每个属性上附加元数据。

最后，SeaORM 中没有单例（全局上下文）的概念。应用程序代码需要负责管理 `DatabaseConnection` 的所有权。我们提供了一些与 Web 框架（包括 [Rocket](https://github.com/SeaQL/sea-orm/tree/master/examples/rocket_example)、[Actix](https://github.com/SeaQL/sea-orm/tree/master/examples/actix_example)、[axum](https://github.com/SeaQL/sea-orm/tree/master/examples/axum_example) 和 [poem](https://github.com/SeaQL/sea-orm/tree/master/examples/poem_example)）的集成示例，帮助你快速上手。