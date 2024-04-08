# Entity Structure

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

```rust
#[sea_orm(table_name = "cake", schema_name = "public")]
pub struct Model { ... }
```

## Column

### Column Name

All column names are assumed to be in snake-case. You can override the column name by specifying the `column_name` attribute.

```rust
#[sea_orm(column_name = "name")]
pub name: String
```

### Column Type

The column type will be derived automatically with the following mapping:

:::tip MSSQL support available in SeaORM X 🎉

The column type mapping of MSSQL can be found [here](https://www.sea-ql.org/SeaORM-X/docs/generate-entity/entity-structure/).

:::

For the mappings of Rust primitive data types.

| Rust type | Database Type <br/> ([`ColumnType`](https://docs.rs/sea-orm/*/sea_orm/entity/enum.ColumnType.html)) | SQLite <br/> datatype | MySQL <br/> datatype | PostgreSQL <br/> datatype |
| --------- | --------- | --------- | --------- | --------- |
| `String` | Char | text | char | char |
| `String` | String | text | varchar | varchar |
| `i8` | TinyInteger | integer | tinyint | char |
| `u8` | TinyUnsigned | integer  | tinyint unsigned | N/A |
| `i16` | SmallInteger | integer | smallint | smallint |
| `u16` | SmallUnsigned | integer | smallint unsigned | N/A |
| `i32` | Integer | integer | int | integer |
| `u32` | Unsigned | integer | int unsigned | N/A |
| `i64` | BigInteger | integer | bigint | bigint |
| `u64` | BigUnsigned | N/A | bigint unsigned | N/A |
| `f32` | Float | real | float | real |
| `f64` | Double | real | double | double precision |
| `bool` | Boolean | integer | bool | bool |
| `Vec<u8>` | Binary | blob | blob | bytea |

For the mappings of Rust non-primitive data types. You can check [`entity/prelude.rs`](https://github.com/SeaQL/sea-orm/blob/master/src/entity/prelude.rs) for all of the reexported types.

| Rust type | Database Type <br/> ([`ColumnType`](https://docs.rs/sea-orm/*/sea_orm/entity/enum.ColumnType.html)) | SQLite <br/> datatype | MySQL <br/> datatype | PostgreSQL <br/> datatype |
| --------- | --------- | --------- | --------- | --------- |
| `Date`: chrono::NaiveDate <br/>`TimeDate`: time::Date | Date | text | date | date |
| `Time`: chrono::NaiveTime <br/>`TimeTime`: time::Time | Time | text | time | time |
| `DateTime`: chrono::NaiveDateTime <br/>`TimeDateTime`: time::PrimitiveDateTime | DateTime | text | datetime | timestamp |
| `DateTimeLocal`: chrono::DateTime&lt;Local&gt; <br/>`DateTimeUtc`: chrono::DateTime&lt;Utc&gt; | Timestamp | text | timestamp | N/A |
| `DateTimeWithTimeZone`: chrono::DateTime&lt;FixedOffset&gt; <br/>`TimeDateTimeWithTimeZone`: time::OffsetDateTime | TimestampWithTimeZone | text | timestamp | timestamp with time zone |
| `Uuid`: uuid::Uuid, uuid::fmt::Braced, uuid::fmt::Hyphenated, uuid::fmt::Simple, uuid::fmt::Urn | Uuid | text | binary(16) | uuid |
| `Json`: serde_json::Value | Json | text | json | json |
| `Decimal`: rust_decimal::Decimal | Decimal | real | decimal | decimal |

You can override the default mappings between a Rust type and `ColumnType` by the `column_type` attribute.

```rust
#[sea_orm(column_type = "Text")]
pub name: String
```

If you need your JSON field to be deserialized into a struct. You would need to derive `FromJsonQueryResult` for it.

```rust
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "json_struct")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    // JSON column defined in `serde_json::Value`
    pub json: Json,
    // JSON column defined in custom struct
    pub json_value: KeyValue,
    pub json_value_opt: Option<KeyValue>,
}

// The custom struct must derive `FromJsonQueryResult`, `Serialize` and `Deserialize`
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize, FromJsonQueryResult)]
pub struct KeyValue {
    pub id: i32,
    pub name: String,
    pub price: f32,
    pub notes: Option<String>,
}
```

:::info
Array datatype is a Postgres-only feature. You can define a vector of types that are already supported by SeaORM.
:::

```rust
#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "collection")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub integers: Vec<i32>,
    pub integers_opt: Option<Vec<i32>>,
    pub floats: Vec<f32>,
    pub doubles: Vec<f64>,
    pub strings: Vec<String>,
}
```

### Additional Properties

You can add additional properties `default_value`, `unique`, `indexed` and `nullable` to a column.

If you specified a custom `column_type` for an optional attribute, you must also specify `nullable`.

```rust
#[sea_orm(column_type = "Text", default_value = "Sam", unique, indexed, nullable)]
pub name: Option<String>
```

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

`DeriveRelation` is a macro to help you implement the [`RelationTrait`](https://docs.rs/sea-orm/*/sea_orm/entity/trait.RelationTrait.html).

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

The [Related](https://docs.rs/sea-orm/*/sea_orm/entity/trait.Related.html) trait connects entities together, such that you can build queries selecting both entities.

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
