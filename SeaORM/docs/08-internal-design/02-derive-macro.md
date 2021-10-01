# Derive Macros

## EntityModel

The [`EntityModel`](#) derive macro is the 'almighty' macro which automatically generates `Entity`, `Column`, and `PrimaryKey` from a given `Model`.

## Entity

The [`DeriveEntity`](#) derive macro will implement [`EntityTrait`](#) for `Entity` and it assumes `Model`, `Column`, `PrimaryKey` and `Relation` exist in the current scope. It also provides implementation of [`Iden`](#) and [`IdenStatic`](#) for `Entity`.

## Column

The [`DeriveColumn`](#) derive macro will implement [`ColumnTrait`](#) for `Columns`. It defines the identifier of each column by implementing [`Iden`](#) and [`IdenStatic`](#). The [`EnumIter`](#) is also derived, allowing iteration over all enum variants.

## Primary Key

The [`DerivePrimaryKey`](#) derive macro will implement [`PrimaryKeyToColumn`](#) for `PrimaryKey` which defines tedious mappings between primary keys and columns. The [`EnumIter`](#) is also derived, allowing iteration over all enum variants.

## Model

The [`DeriveModel`](#) derive macro will implement [`ModelTrait`](#) for `Model`, which provides setters and getters for all attributes in the model. It also implements [`FromQueryResult`](#) to convert a query result into the corresponding `Model`.

## Active Model

The [`DeriveActiveModel`](#) derive macro will implement [`ActiveModelTrait`](#) for `ActiveModel` which provides setters and getters for all active values in the active model.

## Relation

The [`DeriveRelation`](#) derive macro will implement [`RelationTrait`](#) for `Relation`.

## Iterable

The [`EnumIter`](#) derived macro will implement [`Iterable`](#) to allow iteration over all enum variants.