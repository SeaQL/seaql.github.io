# Entity Format

Let's look at a simple [Cake](https://github.com/SeaQL/sea-orm/blob/master/src/tests_cfg/cake.rs) entity.

```rust
use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "cake")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_many = "super::fruit::Entity")]
    Fruit,
}

impl Related<super::fruit::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Fruit.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
```

:::info

Do not delete the `Relation` enum or `ActiveModelBehavior` impl block even if they are empty.
:::

## Entity

The `DeriveEntityModel` macro does all the heavy lifting of defining an `Entity` with associating `Model`, `Column` and `PrimaryKey`.

### Table Name

The `table_name` attribute specifies the corresponding table in the database.
Optionally, you can also specify the database schema or database name by `schema_name`.

### Column Names

By default, all column names are assumed to be in snake_case. You can override this behaviour for all columns in a model by specifying the `rename_all` attribute.

```rust
#[sea_orm(rename_all = "camelCase")]
pub struct Model { ... }
```

<details>
    <summary>You can find a list of valid values for the `rename_all` attribute here</summary>

- camelCase
- kebab-case
- mixed_case
- SCREAMING_SNAKE_CASE
- snake_case
- title_case
- UPPERCASE
- lowercase
- SCREAMING-KEBAB-CASE
- PascalCase

</details>

## Column

### Column Name

You can override the column name by specifying the `column_name` attribute.

```rust
#[derive(DeriveEntityModel)]
#[sea_orm(table_name = "user", rename_all = "camelCase")]
pub struct Model {
    #[sea_orm(primary_key)]
    id: i32,
    first_name: String, // firstName
    #[sea_orm(column_name = "lAsTnAmE")]
    last_name: String, // lAsTnAmE
}
```

### Column Type

The `column_type` attribute defines the database type backing the attribute. Usually you don't have to specify this, as it will inferred from the rust type. For example, `i32` maps to `integer` and `String` maps to `varchar` by default. You can read more about type mappings in the next chapter.

```rust
pub quantity: i32,  // integer by default
#[sea_orm(column_type = "Decimal(Some((16, 4)))")]
pub price: Decimal, // have to specify numeric precision
```

Because Postgres does not natively support unsigned integer types, using unsigned types (such as `u64`) is not recommended if you want to maintain compatibility.

### Additional Properties

You can add additional properties `default_value`, `unique`, `indexed` and `nullable` to a column.

If you specified a custom `column_type` for an optional attribute, you must also specify `nullable`.

```rust
#[sea_orm(column_type = "Text", default_value = "Sam", unique, indexed, nullable)]
pub name: Option<String>
```

These properties are used in [create_table_from_entity](https://docs.rs/sea-orm/latest/sea_orm/schema/struct.Schema.html#method.create_table_from_entity) to generate the table for the entity.

### Cast Column Type on Select and Save

If you need to select a column as one type but save it into the database as another, you can specify the `select_as` and the `save_as` attributes to perform the casting. A typical use case is selecting a column of type `citext` (case-insensitive text) as `String` in Rust and saving it into the database as `citext`. One should define the model field as below:

```rust
#[sea_orm(select_as = "text", save_as = "citext")]
pub case_insensitive_text: String
```

### Ignore Attribute

If you want to ignore a particular model attribute such that it maps to no database column, you can use the `ignore` annotation.

```rust
#[sea_orm(ignore)]
pub ignore_me: String
```

## Primary Key

Use the `primary_key` attribute to mark a column as the primary key.

```rust
#[sea_orm(primary_key)]
pub id: i32
```

### Auto Increment

By default, `auto_increment` is implied for `primary_key` column. Override it by specifying `false`.

```rust
#[sea_orm(primary_key, auto_increment = false)]
pub id: i32
```

### Composite Key

This is usually the case in junction tables, where a two-column tuple is used as the primary key. Simply annotate multiple columns to define a composite primary key. `auto_increment` is `false` for composite key.

The max arity of a primary key is 12.

```rust
pub struct Model {
    #[sea_orm(primary_key)]
    pub cake_id: i32,
    #[sea_orm(primary_key)]
    pub fruit_id: i32,
}
```

## Relation

`DeriveRelation` is a macro to help you implement the [`RelationTrait`](https://docs.rs/sea-orm/1.1.19/sea_orm/entity/trait.RelationTrait.html).

```rust
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_many = "super::fruit::Entity")]
    Fruit,
}
```

If there are no relations, simply write:

```rust
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}
```

The [Related](https://docs.rs/sea-orm/1.1.19/sea_orm/entity/trait.Related.html) trait connects entities together, such that you can build queries selecting both entities.

Learn more about relations in the [Relation](06-relation/01-one-to-one.md) chapter.

## Active Model Behavior

Hooks for different actions on an `ActiveModel`. For example, you can perform custom validation logic or trigger side effects. Inside a transaction, you can even abort an action after it is done, preventing it from saving into the database.

```rust
#[async_trait]
impl ActiveModelBehavior for ActiveModel {
    /// Create a new ActiveModel with default values. Also used by `Default::default()`.
    fn new() -> Self {
        Self {
            uuid: Set(Uuid::new_v4()),
            ..ActiveModelTrait::default()
        }
    }

    /// Will be triggered before insert / update
    async fn before_save<C>(self, db: &C, insert: bool) -> Result<Self, DbErr>
    where
        C: ConnectionTrait,
    {
        if self.price.as_ref() <= &0.0 {
            Err(DbErr::Custom(format!(
                "[before_save] Invalid Price, insert: {}",
                insert
            )))
        } else {
            Ok(self)
        }
    }

    /// Will be triggered after insert / update
    async fn after_save<C>(model: Model, db: &C, insert: bool) -> Result<Model, DbErr>
    where
        C: ConnectionTrait,
    {
        Ok(model)
    }

    /// Will be triggered before delete
    async fn before_delete<C>(self, db: &C) -> Result<Self, DbErr>
    where
        C: ConnectionTrait,
    {
        Ok(self)
    }

    /// Will be triggered after delete
    async fn after_delete<C>(self, db: &C) -> Result<Self, DbErr>
    where
        C: ConnectionTrait,
    {
        Ok(self)
    }
}
```

If no customization is needed, simply write:

```rust
impl ActiveModelBehavior for ActiveModel {}
```
