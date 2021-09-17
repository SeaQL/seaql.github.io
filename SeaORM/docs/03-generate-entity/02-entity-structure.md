# Compact Entity Structure

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

The `table_name` attribute specify the corresponding table in database.
Optionally, you can also specify the database schema by `schema_name` (Postgres only).

```rust
#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "cake", schema_name = "public")]
pub struct Model { ... }
```

## Column

### Column Type

The column type will be derived automatically with the following mapping:

| Rust type | Database Type |
| --------- | ------------- |
| char | Char |
| String | String |
| u8, i8 | TinyInteger |
| u16, i16 | SmallInteger |
| u32, i32 | Integer |
| u64, i64 | BigInteger |
| f32 | Float |
| f64 | Double |
| bool | Boolean |
| NaiveDate | Date |
| NaiveTime | Time |
| DateTime (chrono::NaiveDateTime) | DateTime |
| DateTimeWithTimeZone (chrono::DateTime<FixedOffset>) | TimestampWithTimeZone |
| Uuid (uuid::Uuid) | Uuid |
| Json (serde_json::Value) | Json |
| Decimal (rust_decimal::Decimal) | Decimal |
| Vec<u8> | Binary |

You can override the default mappings between Rust type and `ColumnType` by the `column_type` attribute.

```rust
#[sea_orm(column_type = "Text")]
pub name: String
```

### Additional Properties

You can add additional properties `unique`, `indexed` and `nullable` to a column.

If you specified a custom `column_type` for an optional attribute, you must also specify `nullable`.

```rust
#[sea_orm(column_type = "Text", unique, indexed, nullable)]
pub name: Option<String>
```

### Ignore Attribute

If you want to ignore a particular model attribute such that it maps to no database column, you can use the `ignore` annotation.

```rust
#[sea_orm(ignore)]
pub ignore_me: String
```

## Primary Key

Use the `primary_key` attribute to mark a column as primary key.

```rust
#[sea_orm(primary_key)]
pub id: i32
```

### Auto Increment

By default, `auto_increment` is implied. Override by specifying `false`.

```rust
#[sea_orm(primary_key, auto_increment = false)]
pub id: i32
```

### Composite Key

This is usually the case in junction tables, where two column tuple is used as the primary key. Simply annotate multiple columns to define a composite primary key.

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

Learn more in the next section.

- [Relation](/docs/generate-entity/expanded-entity-structure#relation)
- [Related](/docs/generate-entity/expanded-entity-structure#related)
