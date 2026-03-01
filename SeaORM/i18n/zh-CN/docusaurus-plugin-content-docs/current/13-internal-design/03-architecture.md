# 架构

> 让我们潜入海底 🤿

<img width="100%" src="/SeaORM/img/SeaORM Architecture.svg" />

要理解 SeaORM 的架构，先来谈谈什么是 ORM。ORM 的存在是为了对数据库的常见操作提供抽象，并隐藏诸如实际 SQL 查询之类的实现细节。

有了好的 ORM，你通常不必关心 API 表面之下的实现。直到你需要时。我听到你说「抽象泄漏」，是的，确实如此。

SeaORM 采用的是**「分层抽象」**思路：若你需要，可以往下一层深入。这也是我们将 SeaQuery 做成独立仓库的原因。它本身就有用，而且有了公开 API 和独立命名空间，相比单体架构，更难产生令人困惑的内部 API。

SeaORM 的核心思想是：几乎所有东西都可在运行时配置。在编译时，实体和查询构建器并不知道要连接的是哪种数据库。

与数据库无关能带来什么好处？例如，你可以：

1. 根据运行时配置，让应用运行在任意数据库上
1. 使用相同的模型，并在不同数据库之间迁移
1. 通过创建「数据结构 crate」在不同项目间共享实体，数据库由下游「应用 crate」选择

SeaORM 的 API 不是薄壳，而是由多层组成，越往下越不抽象。

API 被使用时存在不同阶段。

因此，浏览 SeaORM 代码库有两个维度：**「阶段」**和**「抽象程度」**。

首先是声明阶段。通过 `EntityTrait`、`ColumnTrait`、`RelationTrait` 等定义实体及其关系。

其次是查询构建阶段。

最顶层是 `Entity` 的 `find*`、`insert`、`update` 和 `delete` 方法，你可以直观地执行基本 CRUD 操作。

往下一层是 `Select`、`Insert`、`Update` 和 `Delete` 结构体，各自有更高级操作的 API。

再往下一层是 SeaQuery 的 `SelectStatement`、`InsertStatement`、`UpdateStatement` 和 `DeleteStatement`，提供丰富的 API 供你操作 SQL 语法树。

第三是执行阶段。一组独立的结构体 `Selector`、`Inserter`、`Updater` 和 `Deleter` 负责通过数据库连接执行语句。

最后是解析阶段，查询结果被转换为 Rust 类型并填入结构体。若为关系查询，随后会按关系将结构体组装起来。

由于只有执行和解析阶段与数据库相关，我们有可能通过替换这些部分来使用不同的驱动。

我想总有一天，我们会支持多种数据库，涵盖不同的语法、协议和形态。
