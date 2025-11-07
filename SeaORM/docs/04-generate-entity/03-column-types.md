# Column Types

## Type mappings

The column type will be derived automatically with the following mapping.

:::tip SQL Server (MSSQL) backend

The type mappings of MSSQL can be found [here](https://www.sea-ql.org/SeaORM-X/docs/generate-entity/entity-structure/).

:::

For the mappings of Rust primitive data types:

| Rust type | Database Type <br/> ([`ColumnType`](https://docs.rs/sea-orm/*/sea_orm/entity/enum.ColumnType.html)) | SQLite <br/> datatype | MySQL <br/> datatype | PostgreSQL <br/> datatype |
| --------- | --------- | --------- | --------- | --------- |
| `String` | Char | char | char | char |
| `String` | String | varchar | varchar | varchar |
| `i8` | TinyInteger | tinyint | tinyint | char |
| `u8` | TinyUnsigned | tinyint  | tinyint unsigned | N/A |
| `i16` | SmallInteger | smallint | smallint | smallint |
| `u16` | SmallUnsigned | smallint | smallint unsigned | N/A |
| `i32` | Integer | integer | int | integer |
| `u32` | Unsigned | integer | int unsigned | N/A |
| `i64` | BigInteger | integer | bigint | bigint |
| `u64` | BigUnsigned | integer | bigint unsigned | N/A |
| `f32` | Float | float | float | real |
| `f64` | Double | double | double | double precision |
| `bool` | Boolean | boolean | bool | bool |
| `Vec<u8>` | Binary | blob | blob | bytea |

For the mappings of Rust non-primitive data types. You can check [`entity/prelude.rs`](https://github.com/SeaQL/sea-orm/blob/master/src/entity/prelude.rs) for all of the reexported types.

| Rust type | Database Type <br/> ([`ColumnType`](https://docs.rs/sea-orm/*/sea_orm/entity/enum.ColumnType.html)) | SQLite <br/> datatype | MySQL <br/> datatype | PostgreSQL <br/> datatype |
| --------- | --------- | --------- | --------- | --------- |
| `Date`: chrono::NaiveDate <br/>`TimeDate`: time::Date | Date | date_text | date | date |
| `Time`: chrono::NaiveTime <br/>`TimeTime`: time::Time | Time | time_text | time | time |
| `DateTime`: chrono::NaiveDateTime <br/>`TimeDateTime`: time::PrimitiveDateTime | DateTime | datetime_text | datetime | timestamp |
| `DateTimeLocal`: chrono::DateTime&lt;Local&gt; <br/>`DateTimeUtc`: chrono::DateTime&lt;Utc&gt; | Timestamp | timestamp_text | timestamp | N/A |
| `DateTimeWithTimeZone`: chrono::DateTime&lt;FixedOffset&gt; <br/>`TimeDateTimeWithTimeZone`: time::OffsetDateTime | TimestampWithTimeZone | timestamp_with_timezone_text | timestamp | timestamp with time zone |
| `Uuid`: uuid::Uuid, uuid::fmt::Braced, uuid::fmt::Hyphenated, uuid::fmt::Simple, uuid::fmt::Urn | Uuid | uuid_text | binary(16) | uuid |
| `Json`: serde_json::Value | Json | json_text | json | json |
| `Decimal`: rust_decimal::Decimal | Decimal | real | decimal | decimal |
| `PgVector`: pgvector::Vector | Vector | N/A | N/A | vector |
| `IpNetwork`: ipnetwork::IpNetwork | Inet | N/A | N/A | inet |

You can override the default mappings between a Rust type and `ColumnType` with the `column_type` attribute.

```rust
#[sea_orm(column_type = "Text")]
pub name: String
#[sea_orm(column_type = "Decimal(Some((16, 4)))")]
pub price: Decimal,
```

## JSON column

If you need your JSON field to be deserialized into a struct. You would need to derive `FromJsonQueryResult` for it.

```rust
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "json_struct")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    // JSON column as `serde_json::Value`
    pub json: Json,
    // JSON column as custom struct
    pub json_value: KeyValue,
    // nullable JSON column as custom struct, backed by jsonb (Postgres only)
    #[sea_orm(column_type = "JsonBinary")]
    pub json_value_opt: Option<KeyValue>,
    // JSON column storing a vector of objects
    pub json_value_vec: Vec<KeyValue>,
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

If you want a cross-database way of implementing array column, you can wrap it with a wrapper type.

```rust
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "json_string_vec")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    // nullable JSON column storing a vector of string
    pub str_vec: Option<StringVec>,
}

#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize, FromJsonQueryResult)]
pub struct StringVec(pub Vec<String>);
```

More details and examples in the next chapter.

## Postgres Array

Array datatype is a Postgres-only feature. You can define a vector of primitive types that is already supported by SeaORM.

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

## Postgres Vector

Since `1.1.6`, PgVector support is added. Requires `postgres-vector` feature flag.

```rust
#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "image_model")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: i32,
    pub embedding: PgVector,
}
```

For a complete example, see [embedding_tests](https://github.com/SeaQL/sea-orm/blob/master/tests/embedding_tests.rs).

## IpNetwork (Postgres)

Since `1.1.8`, IpNetwork support is added. Requires `with-ipnetwork` feature flag.

```rust
#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "host_network")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub ipaddress: IpNetwork,
    #[sea_orm(column_type = "Cidr")]
    pub network: IpNetwork,
}
