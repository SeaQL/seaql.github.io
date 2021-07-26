# Derive Macros

## Entity

The [`DeriveEntity`](#) derive macro will implement [`EntityTrait`](#) for `Entity` and it assumes `Model`, `Column`, `PrimaryKey` and `Relation` exist in the current scope. It also provides implementation of [`Iden`](#) and [`IdenStatic`](#) for `Entity`.

## Column

The [`DeriveColumn`](#) derive macro will implement [`ColumnTrait`](#) for `Columns`. It defines the identifier of each columns by implementing [`Iden`](#) and [`IdenStatic`](#). The [`EnumIter`](#) is also derived allowing iteration over all enum variants.

## Primary Key

The [`DerivePrimaryKey`](#) derive macro will implement [`PrimaryKeyToColumn`](#) for `PrimaryKey` which defines tedious mappings between primary keys and columns. The [`EnumIter`](#) is also derived allowing iteration over all enum variants.

## Model

The [`DeriveModel`](#) derive macro will implement [`ModelTrait`](#) for `Model` which provides setters and getters for all attributes in the model. It also implement [`FromQueryResult`](#) to convert query result into corresponding `Model`.

## Active Model

The [`DeriveActiveModel`](#) derive macro will implement [`ActiveModelTrait`](#) for `ActiveModel` which provides setters and getters for all active values in the active model.

## Relation

The [`EnumIter`](#) is derived allowing iteration over all enum variants.
