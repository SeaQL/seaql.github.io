# 列类型

## 类型映射

列类型将根据以下映射自动派生。

:::tip SQL Server (MSSQL) 后端

MSSQL 的类型映射可在[此处](https://www.sea-ql.org/SeaORM-X/docs/generate-entity/entity-structure/)找到。

:::

Rust 基本数据类型的映射：

| Rust type | Database Type <br/> ([`ColumnType`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/entity/enum.ColumnType.html)) | SQLite <br/> datatype | MySQL <br/> datatype | PostgreSQL <br/> datatype |
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

Rust 非基本数据类型的映射。你可以查看 [`entity/prelude.rs`](https://github.com/SeaQL/sea-orm/blob/master/src/entity/prelude.rs) 了解所有重新导出的类型。

| Rust type | Database Type <br/> ([`ColumnType`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/entity/enum.ColumnType.html)) | SQLite <br/> datatype | MySQL <br/> datatype | PostgreSQL <br/> datatype |
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

你可以使用 `column_type` 属性覆盖 Rust 类型与 `ColumnType` 之间的默认映射。

```rust
#[sea_orm(column_type = "Text")]
pub name: String
#[sea_orm(column_type = "Decimal(Some((16, 4)))")]
pub price: Decimal,
```

## JSON 列

如果你需要将 JSON 字段反序列化为结构体，需要为其派生 `FromJsonQueryResult`。

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

如果你想要一种跨数据库实现数组列的方式，可以使用封装类型包装它。

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

更多细节和示例请参阅下一章。

## Postgres 数组

数组数据类型是 Postgres 专有功能。你可以定义 SeaORM 已支持的原始类型的向量。

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

自 `1.1.6` 起，添加了 PgVector 支持。需要 `postgres-vector` feature 标志。

```rust
#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "image_model")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: i32,
    pub embedding: PgVector,
}
```

完整示例请参阅 [embedding_tests](https://github.com/SeaQL/sea-orm/blob/master/tests/embedding_tests.rs)。

## IpNetwork (Postgres)

自 `1.1.8` 起，添加了 IpNetwork 支持。需要 `with-ipnetwork` feature 标志。

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
```

## Unix 时间戳

自 `2.0.0` 起，添加了多个新的封装类型，用于将 chrono / time 的 datetime 映射为 `BigInteger`。这些值在发送到数据库之前会转换为 `i64`。

```rust
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "access_log")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub ts: ChronoUnixTimestamp,
    pub ms: ChronoUnixTimestampMillis,
    pub ts: TimeUnixTimestamp,
    pub ms: TimeUnixTimestampMillis,
}
```
