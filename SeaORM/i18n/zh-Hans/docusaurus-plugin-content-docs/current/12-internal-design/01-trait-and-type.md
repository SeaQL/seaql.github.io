# Trait 和类型

## Entity

一个实现了 [`EntityTrait`](#) 的单元结构体，代表数据库中的一张表。

该 Trait 包含一个实体的属性，包括：
- 表名 (实现了 [`EntityName`](#))
- 列 (实现了 [`ColumnTrait`](#))
- 关联关系 (实现了 [`RelationTrait`](#))
- 主键 (实现了 [`PrimaryKeyTrait`](#) 和 [`PrimaryKeyToColumn`](#))

该 Trait 还提供了 CRUD 操作的 API：
- 查询: `find`, `find_*`
- 插入: `insert`, `insert_*`
- 更新: `update`, `update_*`
- 删除: `delete`, `delete_*`

## Column

一个实现了 [`ColumnTrait`](#) 的枚举，代表表的所有列以及列的类型和属性。

它还实现了：
- [`IdenStatic`](#) 提供了到具有静态生命周期的列标识符的映射
- [`Iterable`](#) 允许 SeaORM 内核遍历所有列的变体

## Primary Key

一个实现了 [`PrimaryKeyTrait`](#) 的枚举，代表主键。每个主键变体都必须有一个对应的列变体。

它还实现了：
- [`IdenStatic`](#) 提供了到具有静态生命周期的主键标识符的映射
- [`Iterable`](#) 允许 SeaORM 内核遍历所有主键变体

## Model

一个实现了 [`ModelTrait`](#) 的结构体，用于在内存中存储查询结果。它仅用于只读目的，并且是无状态的。

它还实现了：
- [`FromQueryResult`](#) 将原始查询结果转换为对应的模型

## Active Model

一个实现了 [`ActiveModelTrait`](#) 的结构体，代表插入/更新操作。它可以被编辑并保存到数据库中。

它还实现了：
- [`ActiveModelBehavior`](#) 为活动模型的不同操作定义了处理程序

## Active Enum

一个实现了 [`ActiveEnum`](#) 的枚举，代表作为 Rust 枚举变体存储在数据库中的值。

## Relation

一个实现了 [`RelationTrait`](#) 的枚举，定义了与其他实体的关联关系。

它还实现了：
- [`Iterable`](#) 允许 SeaORM 内核遍历所有关联关系变体

## Related

一个泛型 Trait，[`Related`](#)，定义了连接路径，以帮助你一起查询相关的实体，这在多对多关系中特别有用。

## Linked

一个 Trait，[`Linked`](#)，定义了复杂的连接路径，包括链式关联、自引用关联以及两个实体之间的多个关联。