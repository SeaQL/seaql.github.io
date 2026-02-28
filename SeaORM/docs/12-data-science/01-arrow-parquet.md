# Arrow & Parquet

:::tip Since `2.0.0`
:::

SeaORM derives an [Apache Arrow](https://arrow.apache.org/) schema directly from your entity definition. This bridges your ORM layer with the columnar data ecosystem: [Parquet](https://parquet.apache.org/), [DataFusion](https://datafusion.apache.org/), [Polars](https://pola.rs/), [DuckDB](https://duckdb.org/), and others.

For a detailed walkthrough, see the [blog post](https://www.sea-ql.org/blog/2026-02-22-sea-orm-arrow/).

## Setup

Enable Arrow support with the `with-arrow` feature flag:

```toml
[dependencies]
sea-orm = { version = "2.0.0-rc", features = ["with-arrow"] }
parquet = { version = "57", features = ["arrow"] }
```

## Deriving the Arrow Schema

Add `arrow_schema` to the `#[sea_orm(..)]` attribute:

```rust
use sea_orm::entity::prelude::*;

#[sea_orm::model]
#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "measurement", arrow_schema)]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub recorded_at: ChronoDateTimeUtc,
    pub sensor_id: i32,
    pub temperature: f64,
    #[sea_orm(column_type = "Decimal(Some((10, 4)))")]
    pub voltage: Decimal,
}
```

For compact entities, use `DeriveArrowSchema` as an extra derive:

```rust
#[derive(DeriveEntityModel, DeriveArrowSchema, ..)]
#[sea_orm(table_name = "measurement")]
pub struct Model { .. }
```

This derives the [`ArrowSchema`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/trait.ArrowSchema.html) trait, exposing three methods:

```rust
use sea_orm::ArrowSchema;

let schema = measurement::Entity::arrow_schema();
let batch = measurement::ActiveModel::to_arrow(&models, &schema)?;
let models = measurement::ActiveModel::from_arrow(&batch)?;
```

## Exporting to Parquet

Convert ActiveModels into a `RecordBatch`, then write with the `parquet` crate:

```rust
use sea_orm::ArrowSchema;

let schema = measurement::Entity::arrow_schema();
let models: Vec<measurement::ActiveModel> = vec![..];
let batch = measurement::ActiveModel::to_arrow(&models, &schema)?;

let file = std::fs::File::create("measurements.parquet")?;
let mut writer = parquet::arrow::ArrowWriter::try_new(file, schema.into(), None)?;
writer.write(&batch)?;
writer.close()?;
```

The resulting file is readable by any Parquet-compatible tool.

## Importing from Parquet

Read a Parquet file back into ActiveModels and insert into any SeaORM-supported database:

```rust
use parquet::arrow::arrow_reader::ParquetRecordBatchReaderBuilder;

let file = std::fs::File::open("measurements.parquet")?;
let reader = ParquetRecordBatchReaderBuilder::try_new(file)?.build()?;

let batches: Vec<_> = reader.collect::<Result<_, _>>()?;
let restored = measurement::ActiveModel::from_arrow(&batches[0])?;

measurement::Entity::insert_many(restored).exec(&db).await?;
```

Arrow nulls become `Set(None)`, absent columns become `NotSet`.

## Type Mapping

| Rust Type | SeaORM Column Type | Arrow Type |
|---|---|---|
| `i8` | `TinyInteger` | `Int8` |
| `i16` | `SmallInteger` | `Int16` |
| `i32` | `Integer` | `Int32` |
| `i64` | `BigInteger` | `Int64` |
| `u8`–`u64` | `TinyUnsigned`–`BigUnsigned` | `UInt8`–`UInt64` |
| `f32` | `Float` | `Float32` |
| `f64` | `Double` | `Float64` |
| `bool` | `Boolean` | `Boolean` |
| `String` | `Char`, `String(N)` | `Utf8` |
| `String` | `Text` | `LargeUtf8` |
| `Vec<u8>` | `Binary` | `Binary` |
| `Decimal` | `Decimal(Some((p, s)))` | `Decimal128(p, s)` |
| `Json` | `Json`, `JsonBinary` | `Utf8` |
| `Uuid` | `Uuid` | `Binary` |
| `NaiveDate` | `Date` | `Date32` |
| `NaiveTime` | `Time` | `Time64(Microsecond)` |
| `NaiveDateTime` | `DateTime` | `Timestamp(Microsecond, None)` |
| `DateTime<Utc>` | `TimestampWithTimeZone` | `Timestamp(Microsecond, Some("UTC"))` |

## Overriding Timestamp and Decimal Mapping

Override the timestamp resolution or timezone per-field:

```rust
#[sea_orm::model]
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "event", arrow_schema)]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    #[sea_orm(column_type = "DateTime", arrow_timestamp_unit = "Nanosecond")]
    pub nano_ts: ChronoDateTime,
    #[sea_orm(
        column_type = "DateTime",
        arrow_timestamp_unit = "Nanosecond",
        arrow_timezone = "America/New_York"
    )]
    pub nano_with_tz: ChronoDateTime,
}
```

Valid values for `arrow_timestamp_unit`: `"Second"`, `"Millisecond"`, `"Microsecond"`, `"Nanosecond"`.

Override decimal precision and scale per-field:

```rust
#[sea_orm(
    column_type = "Decimal(Some((20, 4)))",
    arrow_precision = 20,
    arrow_scale = 4
)]
pub amount: Decimal,
```

## Full Example

A complete working example (generate data → write Parquet → roundtrip → insert into SQLite) is available in the [SeaORM repository](https://github.com/SeaQL/sea-orm/tree/master/examples/parquet_example).
