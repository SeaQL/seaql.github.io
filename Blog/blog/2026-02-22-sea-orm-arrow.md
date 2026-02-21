---
slug: 2026-02-22-sea-orm-arrow
title: 'SeaORM now supports Arrow & Parquet'
author: SeaQL Team
author_title: Chris Tsang
author_url: https://github.com/SeaQL
author_image_url: https://www.sea-ql.org/blog/img/SeaQL.png
image: https://www.sea-ql.org/blog/img/SeaORM%202.0%20Banner.png
tags: [news]
---

<img alt="SeaORM 2.0 Banner" src="/blog/img/SeaORM%202.0%20Banner.png"/>

SeaORM 2.0 adds native [Apache Arrow](https://arrow.apache.org/) and [Parquet](https://parquet.apache.org/) support. Derive an Arrow schema directly from your SeaORM entity: no redundant schema definitions, no drift.

## Motivation

Traditional ORMs are built for OLTP. But Rust backends increasingly need to:

- Export data snapshots to object storage (S3, GCS)
- Feed analytical pipelines ([DataFusion](https://datafusion.apache.org/), [Polars](https://pola.rs/), [DuckDB](https://duckdb.org/))
- Archive time-series rows efficiently in columnar format
- Seed or replicate databases from Parquet files

Arrow is the *lingua franca* of in-memory columnar data. Parquet is its on-disk counterpart. Both are supported by the entire modern data stack.

The problem: you've already defined your schema as SeaORM entities. Redefining it as an Arrow schema is redundant and error-prone. SeaORM now comes with Arrow support out-of-the-box!

<img src="/blog/img/sea-orm-parquet.png" />

## Getting Started

Enable Arrow support with the `with-arrow` feature flag:

```toml
[dependencies]
sea-orm = { version = "2.0.0-rc", features = ["with-arrow"] }
parquet = { version = "57", features = ["arrow"] }
```

Suppose you have a sensor data pipeline. You want to archive today's rows to Parquet for downstream analytics.

## Arrow Schema Derivation

Add `arrow_schema` to the `#[sea_orm(..)]` attribute on your entity:

```rust title="measurement.rs"
use sea_orm::entity::prelude::*;

#[sea_orm::model] // <- new Entity
#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "measurement", arrow_schema)] // <- enable Arrow
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

(for compact entity)

```rust title="measurement.rs"
#[derive(DeriveEntityModel, DeriveArrowSchema, ..)] // <- extra derive
#[sea_orm(table_name = "measurement")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    ..
}
```

This derives the `ArrowSchema` trait on `Entity` and `ActiveModel`, exposing three methods:

```rust
use sea_orm::ArrowSchema;

// Get the Arrow Schema matching your entity
let schema = measurement::Entity::arrow_schema();

// Serialize a slice of ActiveModels into an Arrow RecordBatch
let batch = measurement::ActiveModel::to_arrow(&models, &schema)?;

// Deserialize an Arrow RecordBatch back into ActiveModels
let models = measurement::ActiveModel::from_arrow(&batch)?;
```

## Exporting to Parquet

Step 1: convert your `ActiveModel` slice into a `RecordBatch`:

```rust
use sea_orm::ArrowSchema;

let schema = measurement::Entity::arrow_schema();

let models: Vec<measurement::ActiveModel> = vec![..];
let batch = measurement::ActiveModel::to_arrow(&models, &schema)?;
```

Step 2: write to Parquet using the `parquet` crate:

```rust
let file = std::fs::File::create("measurements.parquet")?;
let mut writer = parquet::arrow::ArrowWriter::try_new(file, schema.into(), None)?;
writer.write(&batch)?; // write many more batches
writer.close()?;
```

The resulting file is readable by any Parquet-compatible tool: DuckDB, Polars, Spark, BigQuery, pandas.

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

`from_arrow` reconstructs full `ActiveModel` values: Arrow nulls become `Set(None)`, absent columns become `NotSet`.

## Full Example

A complete working example: generate sensor readings, write to Parquet, verify the roundtrip, then insert into SQLite is available in the SeaORM repository: [`examples/parquet_example`](https://github.com/SeaQL/sea-orm/tree/master/examples/parquet_example/src/main.rs).

As a bonus, you can also use [`sea-orm-sync`](https://github.com/SeaQL/sea-orm/tree/master/sea-orm-sync/examples/parquet_example/src/main.rs) and avoid the async runtime entirely if your application is synchronous!

## Type Mapping

SeaORM maps Rust/SQL types to Arrow data types as follows:

| Rust Type | SeaORM Column Type | Arrow Type | Notes |
|---|---|---|---|
| `i8` | `TinyInteger` | `Int8` | |
| `i16` | `SmallInteger` | `Int16` | |
| `i32` | `Integer` | `Int32` | |
| `i64` | `BigInteger` | `Int64` | |
| `u8` | `TinyUnsigned` | `UInt8` | |
| `u16` | `SmallUnsigned` | `UInt16` | |
| `u32` | `Unsigned` | `UInt32` | |
| `u64` | `BigUnsigned` | `UInt64` | |
| `f32` | `Float` | `Float32` | |
| `f64` | `Double` | `Float64` | |
| `bool` | `Boolean` | `Boolean` | |
| `String` | `Char` | `Utf8` | |
| `String` | `Text` | `LargeUtf8` | unbounded strings use `LargeUtf8` |
| `Vec<u8>` | `Binary`, `VarBinary` | `Binary` | |
| `Decimal` | `Decimal(Some((p, s)))` | `Decimal128(p, s)` | precision ≤ 38; use `Decimal256` for larger |
| `Decimal` | `Money` | `Decimal128(19, 4)` | default precision/scale |
| `Json` | `Json`, `JsonBinary` | `Utf8` | serialized as JSON text |
| `Uuid` | `Uuid` | `Binary` | raw bytes |
| `ActiveEnum` | `Enum` | `Utf8` | serialized as string |
| `NaiveDate` | `Date` | `Date32` | days since epoch |
| `NaiveTime` | `Time` | `Time64(Microsecond)` | |
| `NaiveDateTime` | `DateTime`, `Timestamp` | `Timestamp(Microsecond, None)` | timezone-naive |
| `DateTime<Utc>` | `TimestampWithTimeZone` | `Timestamp(Microsecond, Some("UTC"))` | UTC-annotated |

Key behaviors:

- **String length**: `String(StringLen::N(n))` with `n ≤ 32767` maps to `Utf8`; `Text` and unbounded strings map to `LargeUtf8`.
- **Timestamp resolution**: microseconds by default. Override per-field with `arrow_timestamp_unit`.
- **Timezone annotation**: timezone-aware Rust types (`DateTime<Utc>`, `DateTime<FixedOffset>`) always produce a `Timestamp` with timezone. Naive types (`NaiveDateTime`) produce no annotation. Override with `arrow_timezone`.
- **Decimal**: precision and scale are derived from `column_type`. If not specified, defaults are `Decimal128(38, 10)`. Override per-field with `arrow_precision` and `arrow_scale`.

## Timestamp Types

### Timezone and Resolution

Arrow distinguishes timezone-aware and timezone-naive timestamps at the schema level. SeaORM maps them accordingly:

- `ChronoDateTime` / `NaiveDateTime` / `PrimitiveDateTime` → `Timestamp(Microsecond, None)`: no timezone annotation
- `ChronoDateTimeUtc` / `DateTime<Utc>`/ `OffsetDateTime` → `Timestamp(Microsecond, Some("UTC"))`: UTC annotated

```rust
#[sea_orm::model]
#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "test_chrono", arrow_schema)]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub created_date: ChronoDate,        // -> Date32
    pub created_time: ChronoTime,        // -> Time64(Microsecond)
    pub created_at: ChronoDateTime,      // -> Timestamp(Microsecond, None)
    pub updated_at: ChronoDateTimeUtc,   // -> Timestamp(Microsecond, Some("UTC"))
    pub nullable_ts: Option<ChronoDateTimeUtc>,
}

let models = vec![..];

let batch = ActiveModel::to_arrow(&models, &schema)?;
let restored = ActiveModel::from_arrow(&batch)?;

assert_eq!(restored, models);
```

The default resolution is microseconds. Both the time unit and timezone can be overridden per-field using `arrow_timestamp_unit` and `arrow_timezone`:

```rust
#[sea_orm::model]
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "event", arrow_schema)]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    #[sea_orm(column_type = "DateTime", arrow_timestamp_unit = "Nanosecond")]
    pub nano_ts: ChronoDateTime,      // -> Timestamp(Nanosecond, None)
    #[sea_orm(column_type = "DateTime", arrow_timestamp_unit = "Second")]
    pub second_ts: ChronoDateTime,    // -> Timestamp(Second, None)
    #[sea_orm(
        column_type = "DateTime",
        arrow_timestamp_unit = "Nanosecond",
        arrow_timezone = "America/New_York"
    )]
    pub nano_with_tz: ChronoDateTime, // -> Timestamp(Nanosecond, Some("America/New_York"))
}
```

Valid values for `arrow_timestamp_unit`: `"Second"`, `"Millisecond"`, `"Microsecond"`, `"Nanosecond"`.

## Decimal Types

Each `Decimal` column is stored as `Decimal128` in Arrow, preserving the exact precision and scale declared in `column_type`. Columns with different precision/scale are handled independently. Values are scaled to fit Arrow's internal `i128` representation (`value × 10^scale`).

```rust
#[sea_orm::model]
#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "test_rust_decimal", arrow_schema)]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    #[sea_orm(column_type = "Decimal(Some((10, 2)))")]
    pub price: Decimal,   // -> Decimal128(10, 2)
    #[sea_orm(
        column_type = "Decimal(Some((20, 4)))",
        arrow_precision = 20,
        arrow_scale = 4
    )]
    pub amount: Decimal,  // -> Decimal128(20, 4)
}

let price = Decimal::new(1234567, 2); // 12345.67
let amount = Decimal::new(98765432109, 4); // 9876543.2109

let models = vec![
    decimal_entity::ActiveModel {
        id: Set(1),
        price: Set(price),
        amount: Set(amount),
        nullable_decimal: Set(Some(price)),
    },
];

let batch = ActiveModel::to_arrow(&models, &schema)?;

// Arrow column carries the declared precision and scale
let price_arr = batch.column_by_name("price").unwrap()
    .as_any().downcast_ref::<Decimal128Array>().unwrap();
assert_eq!(price_arr.value(0), 1234567); // 12345.67 stored as 1234567 (× 10^-2)
assert_eq!(price_arr.precision(), 10);
assert_eq!(price_arr.scale(), 2);

// Full roundtrip
assert_eq!(ActiveModel::from_arrow(&batch)?, models);
```

`BigDecimal` is also supported with `Decimal256` but not illustrated here.

## SeaORM 2.0

SeaORM 2.0 is shaping up to be our most significant release yet - with a few breaking changes, plenty of enhancements, and a clear focus on developer experience.

SeaORM 2.0 has reached its release candidate phase. We'd love for you to try it out and help shape the final release by [sharing your feedback](https://github.com/SeaQL/sea-orm/discussions/2548).

## 🌟 Sponsors

#### Gold Sponsor

<a href="https://qdx.co/">
    <img src="https://www.sea-ql.org/static/sponsors/QDX.svg" width="128" />
</a>

[QDX](https://qdx.co/) pioneers quantum dynamics-powered drug discovery, leveraging AI and supercomputing to accelerate molecular modeling.
We're grateful to QDX for sponsoring the development of SeaORM, the SQL toolkit that powers their data intensive applications.

#### GitHub Sponsors

If you feel generous, a small donation will be greatly appreciated, and goes a long way towards sustaining the organization.

A big shout out to our [GitHub sponsors](https://github.com/sponsors/SeaQL):

<div class="row">
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--md" href="https://github.com/sanctusgee">
                <img src="https://avatars.githubusercontent.com/u/2237695?u=c46344d34b510cb2aea10d4ee2c349277802e408&v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">Godwin Effiong</div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--md" href="https://github.com/ryanswrt">
                <img src="https://avatars.githubusercontent.com/u/87781?u=10a9d256e741f905f3dd2cf641de8b325720732e&v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">Ryan Swart</div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--md" href="https://github.com/OteroRafael">
                <img src="https://avatars.githubusercontent.com/u/175388115?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">OteroRafael</div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--md" href="https://github.com/higumachan">
                <img src="https://avatars.githubusercontent.com/u/1011298?u=de4c2f0d0929c2c6dc433981912f794d0e50f2cd&v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">Yuta Hinokuma</div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--md" href="https://github.com/wh7f">
                <img src="https://avatars.githubusercontent.com/u/59872041?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">wh7f</div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--md" href="https://github.com/marcson909">
                <img src="https://avatars.githubusercontent.com/u/16665353?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">MS</div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--md" href="https://github.com/numeusxyz">
                <img src="https://avatars.githubusercontent.com/u/82152211?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">Numeus</div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--md" href="https://github.com/caido-community">
                <img src="https://avatars.githubusercontent.com/u/168573261?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">Caido Community</div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--md" href="https://github.com/marcusbuffett">
                <img src="https://avatars.githubusercontent.com/u/1834328?u=fd066d99cf4a6333bfb3927d1c756af4bb8baf7e&v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">Marcus Buffett</div>
            </div>
        </div>
    </div>
</div>
<div class="row">
    <div class="col col--4 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/yuly3">
                <img src="https://avatars.githubusercontent.com/u/25814001?u=4b57756e7d8060e48262a9edba687927fe7934a6&v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">MasakiMiyazaki</div>
            </div>
        </div>
    </div>
    <div class="col col--4 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/kallydev">
                <img src="https://avatars.githubusercontent.com/u/36319157?u=5be882aa4dbe7eea97b1a80a6473857369146df6&v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">KallyDev</div>
            </div>
        </div>
    </div>
    <div class="col col--4 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/manfredcml">
                <img src="https://avatars.githubusercontent.com/u/27536502?u=b71636bdabbc698458b32e2ac05c5771ad41097e&v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">Manfred Lee</div>
            </div>
        </div>
    </div>
    <div class="col col--4 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/tugascript">
                <img src="https://avatars.githubusercontent.com/u/64930104?u=ad9f63e8e221dbe71bf23de59e3611c99cda1181&v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">Afonso Barracha</div>
            </div>
        </div>
    </div>
    <div class="col col--4 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/deansheather">
                <img src="https://avatars.githubusercontent.com/u/11241812?u=260538c7d8b8c3c5350dba175ebb8294358441e0&v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">Dean Sheather</div>
            </div>
        </div>
    </div>
</div>

## 🦀 Rustacean Sticker Pack

The Rustacean Sticker Pack is the perfect way to express your passion for Rust.
Our stickers are made with a premium water-resistant vinyl with a unique matte finish.

Sticker Pack Contents:
- Logo of SeaQL projects: SeaQL, SeaORM, SeaQuery, Seaography
- Mascots: Ferris the Crab x 3, Terres the Hermit Crab
- The Rustacean wordmark

[Support SeaQL and get a Sticker Pack!](https://www.sea-ql.org/sticker-pack/)

<a href="https://www.sea-ql.org/sticker-pack/"><img style={{borderRadius: "25px"}} alt="Rustacean Sticker Pack by SeaQL" src="https://www.sea-ql.org/static/sticker-pack-1s.jpg" /></a>
