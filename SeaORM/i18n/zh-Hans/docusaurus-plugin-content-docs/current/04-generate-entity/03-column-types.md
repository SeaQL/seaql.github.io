# 列类型

## 类型映射

列类型将按照以下映射自动推断。

:::tip SQL Server (MSSQL) 后端

MSSQL 的类型映射可以在[这里](https://www.sea-ql.org/SeaORM-X/docs/generate-entity/entity-structure/)找到。

:::

Rust 原始数据类型的映射：

| Rust 类型 | 数据库类型 <br/> ([`ColumnType`](https://docs.rs/sea-orm/*/sea_orm/entity/enum.ColumnType.html)) | SQLite <br/> 数据类型 | MySQL <br/> 数据类型 | PostgreSQL <br/> 数据类型 |
| --------- | --------- | --------- | --------- | --------- |
| `String` | Char | char | char | char |
| `String` | String | varchar | varchar | varchar |
| `i8` | TinyInteger | tinyint | tinyint | char |
| `u8` | TinyUnsigned | tinyint  | tinyint unsigned | N/A |
| `i16` | SmallInteger | smallint | smallint | smallint |
| `u16` | SmallUnsigned | smallint | smallint unsigned | N/A |
| `i32` | Integer | integer | int | integer |
| `u32` | Unsigned | integer | int unsigned | N/A |
| `i64` | BigInteger | bigint | bigint | bigint |
| `u64` | BigUnsigned | bigint | bigint unsigned | N/A |
| `f32` | Float | float | float | real |
| `f64` | Double | double | double | double precision |
| `bool` | Boolean | boolean | bool | bool |
| `Vec<u8>` | Binary | blob | blob | bytea |

Rust 非原始数据类型的映射。你可以在 [`entity/prelude.rs`](https://github.com/SeaQL/sea-orm/blob/master/src/entity/prelude.rs) 查看所有重新导出的类型。

| Rust 类型 | 数据库类型 <br/> ([`ColumnType`](https://docs.rs/sea-orm/*/sea_orm/entity/enum.ColumnType.html)) | SQLite <br/> 数据类型 | MySQL <br/> 数据类型 | PostgreSQL <br/> 数据类型 |
| --------- | --------- | --------- | --------- | --------- |
| `Date`：chrono::NaiveDate <br/>`TimeDate`：time::Date | Date | date_text | date | date |
| `Time`：chrono::NaiveTime <br/>`TimeTime`：time::Time | Time | time_text | time | time |
| `DateTime`：chrono::NaiveDateTime <br/>`TimeDateTime`：time::PrimitiveDateTime | DateTime | datetime_text | datetime | timestamp |
| `DateTimeLocal`：chrono::DateTime<Local> <br/>`DateTimeUtc`：chrono::DateTime<Utc> | Timestamp | timestamp_text | timestamp | N/A |
| `DateTimeWithTimeZone`：chrono::DateTime<FixedOffset> <br/>`TimeDateTimeWithTimeZone`：time::OffsetDateTime | TimestampWithTimeZone | timestamp_with_timezone_text | timestamp | timestamp with time zone |
| `Uuid`：uuid::Uuid, uuid::fmt::Braced, uuid::fmt::Hyphenated, uuid::fmt::Simple, uuid::fmt::Urn | Uuid | uuid_text | binary(16) | uuid |
| `Json`：serde_json::Value | Json | json_text | json | json |
| `Decimal`：rust_decimal::Decimal | Decimal | real | decimal | decimal |
| `PgVector`：pgvector::Vector | Vector | N/A | N/A | vector |
| `IpNetwork`：ipnetwork::IpNetwork | Inet | N/A | N/A | inet |

你可以使用 `column_type` 属性覆盖 Rust 类型与 `ColumnType` 之间的默认映射。

```rust
#[sea_orm(column_type = "Text")]
pub name: String
```

## JSON 列

如果需要将 JSON 字段反序列化为结构体，则需要为结构体派生 `FromJsonQueryResult`。

```rust
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "json_struct")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    // JSON 列作为 `serde_json::Value`
    pub json: Json,
    // JSON 列作为自定义结构体
    pub json_value: KeyValue,
    // 可空 JSON 列作为自定义结构体，由 jsonb 支持（仅限 Postgres）
    #[sea_orm(column_type = "JsonBinary")]
    pub json_value_opt: Option<KeyValue>,
    // 存储对象向量的 JSON 列
    pub json_value_vec: Vec<KeyValue>,
}

// 自定义结构体必须派生 `FromJsonQueryResult`、`Serialize` 和 `Deserialize`
#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize, FromJsonQueryResult)]
pub struct KeyValue {
    pub id: i32,
    pub name: String,
    pub price: f32,
    pub notes: Option<String>,
}
```

如果你可以使用自定义包装类型实现跨数据库的“数组列”。

```rust
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "json_string_vec")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    // 可空 JSON 列存储字符串向量
    pub str_vec: Option<StringVec>,
}

#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize, FromJsonQueryResult)]
pub struct StringVec(pub Vec<String>);
```

更多详细信息和示例见下一章。

## Postgres 数组

数组数据类型是 Postgres 独有的功能。你可以定义一个 SeaORM 已支持的原始类型向量。

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

## Postgres 向量

自 `1.1.6` 起新增 PgVector 支持，需要启用 `postgres-vector` 功能标志。

```rust
#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "image_model")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub id: i32,
    pub embedding: PgVector,
}
```

完整示例参见 [embedding_tests](https://github.com/SeaQL/sea-orm/blob/1.1.x/tests/embedding_tests.rs)。

## IpNetwork (Postgres)

自 `1.1.8` 起新增 IpNetwork 支持，需要启用 `with-ipnetwork` 功能标志。

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
