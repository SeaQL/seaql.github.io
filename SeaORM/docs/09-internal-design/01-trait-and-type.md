# Traits and Types

## Entity

A unit struct that implements [`EntityTrait`](#) representing a table in the database.

This trait contains the properties of an entity including
- Table Name (implemented [`EntityName`](#))
- Column (implemented [`ColumnTrait`](#))
- Relation (implemented [`RelationTrait`](#))
- Primary Key (implemented [`PrimaryKeyTrait`](#) and [`PrimaryKeyToColumn`](#))

This trait also provides an API for CRUD actions
- Select: `find`, `find_*`
- Insert: `insert`, `insert_*`
- Update: `update`, `update_*`
- Delete: `delete`, `delete_*`

## Column

An enum that implements [`ColumnTrait`](#) representing all columns of the table and the column types and attributes.

It also implements
- [`IdenStatic`](#) provides mapping to column identifier with static lifetime
- [`Iterable`](#) allows SeaORM core to iterate over all column variants

## Primary Key

An enum that implements [`PrimaryKeyTrait`](#) representing the primary key. Each primary key variant must have a corresponding column variant.

It also implements
- [`IdenStatic`](#) provides mapping to primary key identifier with static lifetime
- [`Iterable`](#) allows SeaORM core to iterate over all primary key variants

## Model

A struct that implements [`ModelTrait`](#) storing the query result in memory. This is intended for readonly purposes, and it is stateless.

It also implements
- [`FromQueryResult`](#) converts raw query result into corresponding model

## Active Model

A struct that implements [`ActiveModelTrait`](#) representing insert/update actions. This is intended to be edited and saved into database.

It also implements
- [`ActiveModelBehavior`](#) defines handlers for different actions on an active model

## Active Enum

A enum that implements [`ActiveEnum`](#) representing value stored in database as a Rust enum variant.

## Relation

An enum that implements [`RelationTrait`](#) defined relations with other entities.

It also implements
- [`Iterable`](#) allows SeaORM core to iterate over all relation variants

## Related

A generic trait, [`Related`](#), defines join paths to help you query related entities together, especially helpful in many-to-many relations.

## Linked

A trait, [`Linked`](#), defines complex join paths including chained relation, self referencing relation and multiple relations between two entities.
