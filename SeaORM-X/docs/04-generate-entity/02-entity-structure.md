# Entity Structure

## Column

### Column Type

The column type will be derived automatically with the following mapping:

For the mappings of Rust primitive data types.

| Rust type | Database Type <br/> ([`ColumnType`](https://docs.rs/sea-orm/*/sea_orm/entity/enum.ColumnType.html)) | MSSQL <br/> datatype |
| --------- | --------- | --------- |
| `String` | Char | nchar |
| `String` | String | nvarchar |
| `i8` | TinyInteger | tinyint |
| `u8` | TinyUnsigned | tinyint |
| `i16` | SmallInteger | smallint |
| `u16` | SmallUnsigned | smallint |
| `i32` | Integer | int |
| `u32` | Unsigned | int |
| `i64` | BigInteger | bigint |
| `u64` | BigUnsigned | bigint |
| `f32` | Float | real |
| `f64` | Double | float |
| `bool` | Boolean | bit |
| `Vec<u8>` | Binary | binary |

For the mappings of Rust non-primitive data types. You can check [`entity/prelude.rs`](https://github.com/SeaQL/sea-orm/blob/master/src/entity/prelude.rs) for all of the reexported types.

| Rust type | Database Type <br/> ([`ColumnType`](https://docs.rs/sea-orm/*/sea_orm/entity/enum.ColumnType.html)) | MSSQL <br/> datatype |
| --------- | --------- | --------- |
| `Date`: chrono::NaiveDate <br/>`TimeDate`: time::Date | Date | date |
| `Time`: chrono::NaiveTime <br/>`TimeTime`: time::Time | Time | time |
| `DateTime`: chrono::NaiveDateTime <br/>`TimeDateTime`: time::PrimitiveDateTime | DateTime | datetime |
| `DateTimeLocal`: chrono::DateTime&lt;Local&gt; <br/>`DateTimeUtc`: chrono::DateTime&lt;Utc&gt; | Timestamp | datetime2 |
| `DateTimeWithTimeZone`: chrono::DateTime&lt;FixedOffset&gt; <br/>`TimeDateTimeWithTimeZone`: time::OffsetDateTime | TimestampWithTimeZone | datetimeoffset |
| `Uuid`: uuid::Uuid, uuid::fmt::Braced, uuid::fmt::Hyphenated, uuid::fmt::Simple, uuid::fmt::Urn | Uuid | uniqueidentifier |
| `Json`: serde_json::Value | Json | nvarchar(max) |
| `Decimal`: rust_decimal::Decimal | Decimal | decimal |
