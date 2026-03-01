# Derive 宏

## EntityModel

[`DeriveEntityModel`](#) derive 宏是「全能」宏，可从给定的 `Model` 自动生成 `Entity`、`Column` 和 `PrimaryKey`。

## Entity

[`DeriveEntity`](#) derive 宏将为 `Entity` 实现 [`EntityTrait`](#)，并假定 `Model`、`Column`、`PrimaryKey` 和 `Relation` 存在于当前作用域中。它还提供 `Entity` 的 [`Iden`](#) 和 [`IdenStatic`](#) 实现。

## Column

[`DeriveColumn`](#) derive 宏将为 `Columns` 实现 [`ColumnTrait`](#)。通过实现 [`Iden`](#) 和 [`IdenStatic`](#) 定义每列的标识符。同时派生 [`EnumIter`](#)，允许遍历所有枚举成员。

## Primary Key

[`DerivePrimaryKey`](#) derive 宏将为 `PrimaryKey` 实现 [`PrimaryKeyToColumn`](#)，定义主键与列之间繁琐的映射。同时派生 [`EnumIter`](#)，允许遍历所有枚举成员。

## Model

[`DeriveModel`](#) derive 宏将为 `Model` 实现 [`ModelTrait`](#)，为模型中的所有属性提供 setter 和 getter。它还实现 [`FromQueryResult`](#)，将查询结果转换为对应的 `Model`。

## ActiveModel

[`DeriveActiveModel`](#) derive 宏将为 `ActiveModel` 实现 [`ActiveModelTrait`](#)，为 ActiveModel 中的所有 active 值提供 setter 和 getter。

## PartialModel

[`DerivePartialModel`](#) derive 宏将为 `Model` 实现 [`PartialModelTrait`](#)。

## Active Enum

[`DeriveActiveEnum`](#) derive 宏将为任意枚举实现 [`ActiveEnum`](#)。

## Relation

[`DeriveRelation`](#) derive 宏将为 `Relation` 实现 [`RelationTrait`](#)。

## RelatedEntity

[`DeriveRelatedEntity`](#) derive 宏将在启用 `seaography` feature 时为 `RelatedEntity` 枚举实现 [`seaography::RelationBuilder`](#)

## Iterable

[`EnumIter`](#) derive 宏将实现 [`Iterable`](#)，允许遍历所有枚举成员。

## Value Type

[`DeriveValueType`](#) derive 宏将为 `T` 实现 `From<T> for Value`、`sea_orm::TryGetable for T` 和 `sea_query::ValueType for T`。
