# Entity Structure

Let's look at a simple [Cake](https://github.com/SeaQL/sea-orm/blob/master/src/tests_cfg/cake.rs) entity.

```rust
use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
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

impl ActiveModelBehavior for ActiveModel {}
```

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

For the mappings of Rust primitive data types.

| Rust type | Database Type <br/> ([`ColumnType`](https://docs.rs/sea-orm/*/sea_orm/entity/enum.ColumnType.html)) |
| --------- | ------------- |
| `String` | Char |
| `String` | String |
| `i8` | TinyInteger |
| `u8` | TinyUnsigned |
| `i16` | SmallInteger |
| `u16` | SmallUnsigned |
| `i32` | Integer |
| `u32` | Unsigned |
| `i64` | BigInteger |
| `u64` | BigUnsigned |
| `f32` | Float |
| `f64` | Double |
| `bool` | Boolean |
| `Vec<u8>` | Binary |

For the mappings of Rust non-primitive data types. You can check [`entity/prelude.rs`](https://github.com/SeaQL/sea-orm/blob/master/src/entity/prelude.rs) for all of the reexported types.

| Rust type | Database Type <br/> ([`ColumnType`](https://docs.rs/sea-orm/*/sea_orm/entity/enum.ColumnType.html)) |
| --------- | ------------- |
| `Date`: chrono::NaiveDate <br/>`TimeDate`: time::Date | Date |
| `Time`: chrono::NaiveTime <br/>`TimeTime`: time::Time | Time |
| `DateTime`: chrono::NaiveDateTime <br/>`TimeDateTime`: time::PrimitiveDateTime | DateTime |
| `DateTimeLocal`: chrono::DateTime&lt;Local&gt; <br/>`DateTimeUtc`: chrono::DateTime&lt;Utc&gt; | Timestamp |
| `DateTimeWithTimeZone`: chrono::DateTime&lt;FixedOffset&gt; <br/>`TimeDateTimeWithTimeZone`: time::OffsetDateTime | TimestampWithTimeZone |
| `Uuid`: uuid::Uuid | Uuid |
| `Json`: serde_json::Value | Json |
| `Decimal`: rust_decimal::Decimal | Decimal |

You can override the default mappings between a Rust type and `ColumnType` by the `column_type` attribute.

```rust
#[sea_orm(column_type = "Text")]
pub name: String
```

### Additional Properties

You can add additional properties `default_value`, `unique`, `indexed` and `nullable` to a column.

If you specified a custom `column_type` for an optional attribute, you must also specify `nullable`.

```rust
#[sea_orm(column_type = "Text", default_value = "Sam", unique, indexed, nullable)]
pub name: Option<String>
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

This is usually the case in junction tables, where a two-column tuple is used as the primary key. Simply annotate multiple columns to define a composite primary key. By default, `auto_increment` is `false` for composite key.

```rust
pub struct Model {
    #[sea_orm(primary_key)]
    pub cake_id: i32,
    #[sea_orm(primary_key)]
    pub fruit_id: i32,
}
```

## Relation

The `DeriveRelation` macro is a simple wrapper to impl the `RelationTrait`.

```rust
#[derive(DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_many = "super::fruit::Entity")]
    Fruit,
}
```

expands into

```rust
impl RelationTrait for Relation {
    fn def(&self) -> RelationDef {
        match self {
            Self::Fruit => Entity::has_many(super::fruit::Entity).into(),
        }
    }
}
```

Learn more about relations in the next section.