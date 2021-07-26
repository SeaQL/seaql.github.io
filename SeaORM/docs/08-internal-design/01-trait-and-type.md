# Traits and Types

## Entity

An unit struct implements [`EntityTrait`](#) representing a table in the database.

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

An enum that implements [`ColumnTrait`](#) representing all columns in the entity. It defines the entity that it representing and all its column definition.

It also implements
- [`IdenStatic`](#) provides mapping to column identifier with static lifetime
- [`Iterable`](#) allows SeaORM core to iterate over all column variants

## Primary Key

An enum that implements [`PrimaryKeyTrait`](#) representing all primary keys in the entity. Each primary key variant must also exits in column enum, for example, variant "Id" exists in both column and primary key enum.

It also implements
- [`IdenStatic`](#) provides mapping to primary key identifier with static lifetime
- [`Iterable`](#) allows SeaORM core to iterate over all primary key variants

## Model

A struct that implements [`ModelTrait`](#) storing the query result in Rust representation. This is intended for readonly purpose and it is stateless.

It also implements
- [`FromQueryResult`](#) converts raw query result into corresponding model

## Active Model

A struct that implements [`ActiveModelTrait`](#) storing editable query result in Rust representation. This is intended to be edited and saved into database.

It also implements
- [`ActiveModelBehavior`](#) defines handlers for different actions on an active model

## Relation

An enum that implements [`RelationTrait`](#) defined relations with other entities.

It also implements
- [`Iterable`](#) allows SeaORM core to iterate over all relation variants

## Related

A trait, [`Related`](#), that define join paths to help you query related entities together, especially helpful in many-to-many relations.
