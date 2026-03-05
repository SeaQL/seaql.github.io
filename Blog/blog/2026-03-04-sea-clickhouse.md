---
slug: 2026-03-04-sea-clickhouse
title: 'ClickHouse meets SeaORM: Arrow-powered data pipeline'
author: SeaQL Team
author_title: Chris Tsang
author_url: https://github.com/SeaQL
author_image_url: https://www.sea-ql.org/blog/img/SeaQL.png
image: https://www.sea-ql.org/blog/img/SeaORM%202.0%20Banner.png
tags: [news]
---

<img alt="SeaORM 2.0 Banner" src="/blog/img/SeaORM%202.0%20Banner.png"/>

[`sea-clickhouse`](https://github.com/SeaQL/clickhouse-rs) is a ClickHouse client that integrates with the SeaQL ecosystem. It is a soft fork of [`clickhouse-rs`](https://github.com/ClickHouse/clickhouse-rs): 100% compatible with all upstream features, with SeaQL's dynamic type and Arrow support added on top. The fork is continually rebased on upstream.

In this blog post we cover:

- **Dynamic rows with `try_get`**: fetch query results without defining any schema struct
- **Arrow RecordBatch streaming**: stream query results as `RecordBatch`es and insert them back into ClickHouse
- **SeaORM to ClickHouse**: convert SeaORM entities to Arrow and insert into ClickHouse
- **Schema DDL from Arrow**: derive `CREATE TABLE` DDL from an Arrow schema, no hand-written SQL

```toml
[dependencies]
sea-clickhouse = { version = "0.14", features = ["arrow"] }
```

## The Problem with Typed Rows

The native `clickhouse-rs` client requires you to define a `#[derive(Row)]` struct whose field types match the query output exactly:

```rust
#[derive(Row, Deserialize)]
struct Reading {
    #[serde(with = "special_deserializer")] // or use a custom deserializer?
    temperature: f64, // f32? f64? depends on the SQL expression
}

let mut cursor = client.query("SELECT ...").fetch::<Reading>()?;
```

If the struct says `f32` but the server returns `Float64`, you get a runtime deserialization error. For computed columns, ad-hoc queries, or `SELECT *` on evolving tables, maintaining these structs is fragile.

[`sea-clickhouse`](https://docs.rs/sea-clickhouse) reads the column types from the response metadata and maps them to [`sea_query::Value`](https://docs.rs/sea-orm/2.0.0-rc.36/sea_orm/enum.Value.html) automatically:

```rust
let mut cursor = client.query("SELECT 1::UInt32 + 1::Float32 AS value").fetch_rows()?;
let row = cursor.next().await?.expect("one row");

// UInt32 + Float32 -> Float64
assert_eq!(row.try_get::<f64, _>(0)?, 2.0);           // by index
assert_eq!(row.try_get::<f32, _>(0)?, 2.0);           // narrower type also works
assert_eq!(row.try_get::<Decimal, _>("value")?, 2.into()); // by column name
```

[`try_get`](https://docs.rs/sea-clickhouse/latest/clickhouse/struct.DataRow.html#method.try_get) coerces at runtime: access by index or column name, request the type you need, and it converts where possible.

## Arrow RecordBatch Streaming

[`next_arrow_batch(chunk_size)`](https://docs.rs/sea-clickhouse/latest/clickhouse/query/struct.DataRowCursor.html#method.next_arrow_batch) streams query results as Arrow `RecordBatch`es, ready for DataFusion, Polars, Parquet export, or any Arrow consumer.

```rust
use clickhouse::Client;
use sea_orm_arrow::arrow::{array::RecordBatch, util::pretty};

let client = Client::default().with_url("http://localhost:18123");

let sql = r#"
    SELECT
        toUInt64(number) + 1                                      AS id,
        toDateTime64('2026-01-01', 6)
            + toIntervalSecond(rand() % 86400)
            + toIntervalMillisecond(rand() % 1000)                AS recorded_at,
        toInt32(100 + rand() % 10)                                AS sensor_id,
        -10.0 + randUniform(0.0, 50.0)                            AS temperature,
        toDecimal128(3.0 + toFloat64(rand() % 5000) / 10000.0, 4) AS voltage
    FROM system.numbers
    LIMIT 20
"#;

let mut cursor = client.query(sql).fetch_rows()?;
let mut batches: Vec<RecordBatch> = Vec::new();
while let Some(batch) = cursor.next_arrow_batch(10).await? {
    batches.push(batch);
}
pretty::print_batches(&batches).unwrap();
```

```text
+----+-------------------------+-----------+----------------------+---------+
| id | recorded_at             | sensor_id | temperature          | voltage |
+----+-------------------------+-----------+----------------------+---------+
| 1  | 2026-01-01T13:35:36.736 | 106       | 36.345616831016436   | 3.2736  |
| 2  | 2026-01-01T10:07:38.458 | 108       | 10.122001773336567   | 3.3458  |
| 3  | 2026-01-01T01:15:18.518 | 108       | 35.21406789966149    | 3.1518  |
| 4  | 2026-01-01T05:36:57.017 | 107       | 22.92828141235666    | 3.2016  |
| 5  | 2026-01-01T13:17:36.056 | 106       | -2.082591477369223   | 3.0056  |
| ...                                                                       |
+----+-------------------------+-----------+----------------------+---------+
```

Those batches can be inserted back into ClickHouse directly:

```rust
let mut insert = client.insert_arrow("sensor_data", &batches[0].schema()).await?;
for batch in &batches {
    insert.write_batch(batch).await?;
}
insert.end().await?;
```

No `#[derive(Row)]` macros. The Arrow schema carries the type information end-to-end.

## SeaORM to ClickHouse

SeaORM started as an OLTP toolkit, but with Arrow and now ClickHouse support, SeaQL bridges data engineering with data science: your OLTP entities become the source of truth for OLAP pipelines too.

```rust
use sea_orm::entity::prelude::*;

#[sea_orm::model]
#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "measurement", arrow_schema)]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub recorded_at: ChronoDateTime,
    pub sensor_id: i32,
    pub temperature: f64,
    #[sea_orm(column_type = "Decimal(Some((38, 4)))")]
    pub voltage: Decimal,
}
```

Build models, convert to a `RecordBatch`, and insert:

```rust
use sea_orm::ArrowSchema;

let models: Vec<measurement::ActiveModel> = vec![..];

let schema = measurement::Entity::arrow_schema();
let batch = measurement::ActiveModel::to_arrow(&models, &schema)?;

let mut insert = client.insert_arrow("measurement", &schema).await?;
insert.write_batch(&batch).await?;
insert.end().await?;
```

[`arrow_schema`](https://docs.rs/sea-orm/2.0.0-rc.36/sea_orm/entity/trait.ArrowSchema.html#tymethod.arrow_schema) on the entity [derives the Arrow schema](https://www.sea-ql.org/blog/2026-02-22-sea-orm-arrow/) at compile time. `to_arrow` converts a slice of `ActiveModel`s into a `RecordBatch`. From there, [`insert_arrow`](https://docs.rs/sea-clickhouse/latest/clickhouse/struct.Client.html#method.insert_arrow) streams the batch into ClickHouse over HTTP. See the full [working example](https://github.com/SeaQL/clickhouse-rs/blob/main/sea-orm-arrow-example/src/main.rs).

## Arrow Schema to ClickHouse DDL

[`ClickHouseSchema::from_arrow`](https://docs.rs/sea-clickhouse/latest/clickhouse/schema/struct.ClickHouseSchema.html#method.from_arrow) derives a full `CREATE TABLE` statement from any Arrow schema, and exposes a SeaQuery-like fluent API to configure ClickHouse-specific attributes:

```rust
use clickhouse::schema::{ClickHouseSchema, Engine};

let mut schema = ClickHouseSchema::from_arrow(&batch.schema());
schema
    .table_name("sensor_readings")
    .engine(Engine::ReplacingMergeTree)
    .primary_key(["recorded_at", "device"]);
schema.find_column_mut("device").set_low_cardinality(true);

let ddl = schema.to_string();
client.query(&ddl).execute().await?;
```

Generated DDL:

```sql
CREATE TABLE sensor_readings (
    id UInt64,
    recorded_at DateTime64(6),
    device LowCardinality(String),
    temperature Nullable(Float64),
    voltage Decimal(38, 4)
) ENGINE = ReplacingMergeTree()
PRIMARY KEY (recorded_at, device)
```

The full workflow: Arrow -> derive DDL -> create table -> insert batches. Zero hand-written ClickHouse DDL. All examples shown here are available as [runnable examples](https://github.com/SeaQL/clickhouse-rs/tree/main?tab=readme-ov-file#examples) in the repository.
