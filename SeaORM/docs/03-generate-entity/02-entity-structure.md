# Entity Structure

An entity file in SeaORM correspond to a table in database, it helps you perform CURD operations via [`Entity`](#entity) on a table and encapsulate specification of database schema including [`Column`](#column), [`Relation`](#relation) and [`PrimaryKey`](#primary-key).

In the followings, we will disassemble the component in SeaORM entity. All the code snippet adapted from [this](https://github.com/SeaQL/sea-orm/blob/master/src/tests_cfg/cake.rs) example cake entity.

## Entity

An unit struct which glue all table specification together.

```rust
#[derive(Copy, Clone, Default, Debug, DeriveEntity)]
pub struct Entity;

impl EntityName for Entity {
    fn table_name(&self) -> &str {
        "cake"
    }
}
```

### Table Name

The case-sensitive table name should be returned from the `EntityName::table_name()` method.

### CRUD

- [Select](/docs/basic-crud/select)
- [Insert](/docs/basic-crud/insert)
- [Update](/docs/basic-crud/update)
- [Save](/docs/basic-crud/save)
- [Delete](/docs/basic-crud/delete)

### DeriveEntity Procedural Macro

Implement
- `EntityTrait` for `Entity`
- `Iden` for `Entity`
- `IdenStatic` for `Entity`

See [here](/docs/internal-design/derive-macro#) for details.

## Column

An enum represents all columns in this table.

```rust
#[derive(Copy, Clone, Debug, EnumIter, DeriveColumn)]
pub enum Column {
    Id,
    Name,
}

impl ColumnTrait for Column {
    type EntityName = Entity;

    fn def(&self) -> ColumnDef {
        match self {
            Self::Id => ColumnType::Integer.def(),
            Self::Name => ColumnType::String(None).def(),
        }
    }
}
```

### Column Name

All column names are assumed to be in snake-case. For example

```rust
#[derive(Copy, Clone, Debug, EnumIter, DeriveColumn)]
pub enum Column {
    Id,       // correspond to "id" column
    Name,     // correspond to "name" column
    CreateAt  // correspond to "create_at" column
}
```

### ColumnType

Specifying the datatype of each column.

`ColumnType::DataType.def()` will convert `ColumnType` into `ColumnDef`.

See [here](#) for all available `ColumnType`.

```rust {6-7}
impl ColumnTrait for Column {
    type EntityName = Entity;

    fn def(&self) -> ColumnDef {
        match self {
            Self::Id => ColumnType::Integer.def(),
            Self::Name => ColumnType::String(None).def(),
        }
    }
}
```

### ColumnDef

Specifying the additional info of each column.

Such as
- Unique constraint
- Nullability

```rust {7}
impl ColumnTrait for Column {
    type EntityName = Entity;

    fn def(&self) -> ColumnDef {
        match self {
            Self::Id => ColumnType::Integer.def(),
            Self::Name => ColumnType::String(None).def().unique().null(), // Unique & Nullable column
        }
    }
}
```

### DeriveColumn Procedural Macro

Implement
- `Iden` for `Column`
- `IdenStatic` for `Column`

See [here](/docs/internal-design/derive-macro#) for details.

## Primary Key

An enum represents primary key in this table. If `PrimaryKey` enum has more than one variant, then this primary key is a composite primary key.

```rust
#[derive(Copy, Clone, Debug, EnumIter, DerivePrimaryKey)]
pub enum PrimaryKey {
    Id,
}
```

### Primary Key is-a Column

Variant in `PrimaryKey` must have a variant with identical name in `Column`. Otherwise, compilation error will be thrown.

### DerivePrimaryKey Procedural Macro

Implement
- `Iden` for `PrimaryKey`
- `IdenStatic` for `PrimaryKey`
- `PrimaryKeyToColumn` for `PrimaryKey`

See [here](/docs/internal-design/derive-macro#) for details.

## Model

Rust representation of a corresponding table row.

```rust
#[derive(Clone, Debug, PartialEq, DeriveModel, DeriveActiveModel)]
pub struct Model {
    pub id: i32,
    pub name: String,
}
```

### Attribute

Attribute represents the column in database table, that is for example, id column is represented by an i32 integer in Rust.

### Nullable Attribute

To correctly handle null value in Rust, we need to wrap any nullable attribute with `Option<T>`.

Let say the name column is nullable. Then `Model` should be defined as follows. Then, we will get `None` if name column is null, otherwise `Some(String)`.

```rust {4}
#[derive(Clone, Debug, PartialEq, DeriveModel, DeriveActiveModel)]
pub struct Model {
    pub id: i32,
    pub name: Option<String>,
}
```

### DeriveActiveModel Procedural Macro

Implement
- `ActiveModel`
- `Default` for `ActiveModel`
- `From<<Entity as EntityTrait>::Model>` for `ActiveModel`
- `IntoActiveModel<ActiveModel>` for `<Entity as EntityTrait>::Model`
- `ActiveModelTrait` for `ActiveModel`

See [here](/docs/internal-design/derive-macro#) for details.

## Active Model

Overriding default event hook of `ActiveModel`.

```rust
impl ActiveModelBehavior for ActiveModel {
    /// Will be called before saving
    fn before_save(self) -> Self {
        self
    }

    /// Will be called after saving
    fn after_save(self) -> Self {
        self
    }

    /// Will be called before deleting
    fn before_delete(self) -> Self {
        self
    }
}
```

if no customization is needed, simply write

```rust
impl ActiveModelBehavior for ActiveModel {}
```

## Relation

Specifying relation between tables.

```rust
#[derive(Copy, Clone, Debug, EnumIter)]
pub enum Relation {
    Fruit,
}

impl RelationTrait for Relation {
    fn def(&self) -> RelationDef {
        match self {
            Self::Fruit => Entity::has_many(super::fruit::Entity).into(),
        }
    }
}
```

Each relation can be referred by a `Relation` enum variant.

And the definition of each relation is defined in `RelationTrait::def()`.

There are three kinds of relation, namely
- `belongs_to`, when relation form by column referencing a foreign table column, snippet adapted from [fruit.rs](https://github.com/SeaQL/sea-orm/blob/master/src/tests_cfg/fruit.rs).
    ```rust
    Self::Cake => Entity::belongs_to(super::cake::Entity)
        .from(Column::CakeId)
        .to(super::cake::Column::Id)
        .into(),
    ```
- `has_many`, when relation form by column being referenced by a foreign table column.
    ```rust
    Entity::has_many(super::fruit::Entity).into()
    ```
- `has_one`, a special case of `has_many`, when foreign table column has unique constraint.
    ```rust
    Entity::has_one(super::fruit::Entity).into()
    ```

## Related

Specifying how to join related tables with `Relation`.

```rust
impl Related<super::fruit::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Fruit.def()
    }
}

impl Related<super::filling::Entity> for Entity {
    fn to() -> RelationDef {
        super::cake_filling::Relation::Filling.def()
    }

    fn via() -> Option<RelationDef> {
        Some(super::cake_filling::Relation::Cake.def().rev())
    }
}
```

### Simple Related

Indicate corresponding `Entity` related to another entity by replacing `T` in `Related<T>`, for example, `Related<super::fruit::Entity>`.

Return the `RelationDef` in `Related::to()` using `Relation::Variant.def()`.

```rust {1,3}
impl Related<super::fruit::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Fruit.def()
    }
}
```

### Related via Conjunction Entity

If two entities can be related via an intermediate conjunction table, then we can defined the followings.

- Specify `RelationDef` from the conjunction table to `T` of `Related<T>` in `Related::to()`
- Specify `RelationDef` from the corresponding table to conjunction table in `Related::via()`

```rust {3,7}
impl Related<super::filling::Entity> for Entity {
    fn to() -> RelationDef {
        super::cake_filling::Relation::Filling.def()
    }

    fn via() -> Option<RelationDef> {
        Some(super::cake_filling::Relation::Cake.def().rev())
    }
}
```
