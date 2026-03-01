# 特征与类型

## Entity

实现 [`EntityTrait`](#) 的单元结构体，代表数据库中的一张表。

该特征包含实体的属性，包括
- 表名（实现 [`EntityName`](#)）
- 列（实现 [`ColumnTrait`](#)）
- 关系（实现 [`RelationTrait`](#)）
- 主键（实现 [`PrimaryKeyTrait`](#) 和 [`PrimaryKeyToColumn`](#)）

该特征还提供 CRUD 操作的 API
- 查询：`find`、`find_*`
- 插入：`insert`、`insert_*`
- 更新：`update`、`update_*`
- 删除：`delete`、`delete_*`

## Column

实现 [`ColumnTrait`](#) 的枚举，代表表中所有列及其列类型和属性。

它还实现
- [`IdenStatic`](#) 提供与静态生命周期的列标识符的映射
- [`Iterable`](#) 允许 SeaORM 核心遍历所有列成员

## Primary Key

实现 [`PrimaryKeyTrait`](#) 的枚举，代表主键。每个主键成员必须有对应的列成员。

它还实现
- [`IdenStatic`](#) 提供与静态生命周期的主键标识符的映射
- [`Iterable`](#) 允许 SeaORM 核心遍历所有主键成员

## Model

实现 [`ModelTrait`](#) 的结构体，在内存中存储查询结果。用于只读目的，且是无状态的。

它还实现
- [`FromQueryResult`](#) 将原始查询结果转换为对应的模型

## ActiveModel

实现 [`ActiveModelTrait`](#) 的结构体，代表插入/更新操作。用于编辑并保存到数据库。

它还实现
- [`ActiveModelBehavior`](#) 定义对 ActiveModel 执行不同操作时的处理程序

## Active Enum

实现 [`ActiveEnum`](#) 的枚举，代表以 Rust 枚举成员形式存储在数据库中的值。

## Relation

实现 [`RelationTrait`](#) 的枚举，定义与其他实体的关系。

它还实现
- [`Iterable`](#) 允许 SeaORM 核心遍历所有关系成员

## 关联实体

泛型特征 [`Related`](#) 定义连接路径，帮助你一起查询相关实体，在多对多关系中尤其有用。

## 链接关联

特征 [`Linked`](#) 定义复杂的连接路径，包括链式关系、自引用关系以及两个实体之间的多重关系。
