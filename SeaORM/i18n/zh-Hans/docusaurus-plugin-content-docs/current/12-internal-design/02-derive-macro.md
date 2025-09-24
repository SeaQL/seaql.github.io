# 派生宏

## EntityModel

[`EntityModel`](#) 派生宏是“万能”宏，可根据给定的 `Model` 自动生成 `Entity`、`Column` 和 `PrimaryKey`。

## Entity

[`DeriveEntity`](#) 派生宏将为 `Entity` 实现 [`EntityTrait`](#)，并假定 `Model`、`Column`、`PrimaryKey` 和 `Relation` 存在于当前作用域中。它还为 `Entity` 提供了 [`Iden`](#) 和 [`IdenStatic`](#) 的实现。

## Column

[`DeriveColumn`](#) 派生宏将为 `Columns` 实现 [`ColumnTrait`](#)。它通过实现 [`Iden`](#) 和 [`IdenStatic`](#) 来定义每列的标识符。还派生了 [`EnumIter`](#)，从而可以遍历所有枚举变体。

## Primary Key

[`DerivePrimaryKey`](#) 派生宏将为 `PrimaryKey` 实现 [`PrimaryKeyToColumn`](#)，它定义了主键和列之间繁琐的映射。还派生了 [`EnumIter`](#)，从而可以遍历所有枚举变体。

## Model

[`DeriveModel`](#) 派生宏将为 `Model` 实现 [`ModelTrait`](#)，它为模型中的所有属性提供了 setter 和 getter。它还实现了 [`FromQueryResult`](#)，可将查询结果转换为相应的 `Model`。

## Active Model

[`DeriveActiveModel`](#) 派生宏将为 `ActiveModel` 实现 [`ActiveModelTrait`](#)，它为活动模型中的所有活动值提供了 setter 和 getter。

## Partial Model

[`DerivePartialModel`](#) 派生宏将为 `Model` 实现 [`PartialModelTrait`](#)。

## Active Enum

[`DeriveActiveEnum`](#) 派生宏将为任何枚举实现 [`ActiveEnum`](#)。

## Relation

[`DeriveRelation`](#) 派生宏将为 `Relation` 实现 [`RelationTrait`](#)。

## RelatedEntity

当启用 `seaography` 功能时，[`DeriveRelatedEntity`](#) 派生宏将为 `RelatedEntity` 枚举实现 [`seaography::RelationBuilder`](#)。

## Iterable

[`EnumIter`](#) 派生宏将实现 [`Iterable`](#)，以允许遍历所有枚举变体。

## Value Type

[`DeriveValueType`](#) 派生宏将为 `T` 实现 `From<T> for Value`、`sea_orm::TryGetable for T` 和 `sea_query::ValueType for T`。

## Display

[`DeriveDisplay`](#) 派生宏将为枚举实现 `std::fmt::Display`。