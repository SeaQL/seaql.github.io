# ClickHouse

[`sea-clickhouse`](https://docs.rs/sea-clickhouse) is a ClickHouse client that integrates with the SeaQL ecosystem. It is a soft fork of [`clickhouse-rs`](https://github.com/ClickHouse/clickhouse-rs), 100% compatible with all upstream features, and continually rebased on upstream.

Query results are decoded into `sea_query::Value`, giving you first-class support for `DateTime`, `Decimal`, `BigDecimal`, `Json`, arrays, and more without defining any schema structs. Apache Arrow is also supported: stream query results directly into `RecordBatch`es, or insert Arrow batches back into ClickHouse.

## Setup

```toml
[dependencies]
# Dynamic DataRow + SeaQuery value support
sea-clickhouse = { version = "0.14", features = ["sea-ql"] }

# Apache Arrow support (includes sea-ql)
sea-clickhouse = { version = "0.14", features = ["arrow"] }
```

## Dynamic DataRow

`fetch_rows()` decodes every column into the matching `sea_query::Value` variant without needing a schema struct:

```rust
use clickhouse::{Client, DataRow, error::Result};
use sea_query::Value;

let mut cursor = client
    .query(
        "SELECT
            1::UInt8                              AS u8_col,
            3.14::Float64                         AS f64_col,
            'hello'::String                       AS str_col,
            toDate('2026-01-15')                  AS date_col,
            toDateTime('2026-01-15 12:34:56')     AS dt_col,
            toDecimal64(123.45, 2)                AS dec64_col,
            NULL::Nullable(Int32)                 AS null_col,
            ['a', 'b', 'c']::Array(String)        AS arr_col
        ",
    )
    .fetch_rows()?;

let row = cursor.next().await?.unwrap();
assert_eq!(row.values[0], Value::TinyUnsigned(Some(1)));
assert_eq!(row.values[2], Value::String(Some("hello".into())));
assert_eq!(row.values[7], Value::Json(Some(Box::new(serde_json::json!(["a", "b", "c"])))));
```

Values can be converted to a desired type at runtime:

```rust
let row = cursor.next().await?.expect("expected one row");

assert_eq!(row.try_get::<f64, _>(0)?, 2.0);          // by index
assert_eq!(row.try_get::<Decimal, _>("value")?, 2.into()); // by column name
```

## Inserting DataRows

Build `DataRow`s with a shared column list and insert them in a single streaming request:

```rust
use std::sync::Arc;
use clickhouse::{Client, DataRow};
use sea_query::Value;

let columns: Arc<[Arc<str>]> = Arc::from(["id".into(), "name".into(), "score".into()]);

let rows: Vec<DataRow> = (0u32..5)
    .map(|i| DataRow {
        columns: columns.clone(),
        values: vec![
            Value::Unsigned(Some(i)),
            Value::String(Some("original".into())),
            Value::Double(Some(i as f64 * 1.5)),
        ],
    })
    .collect();

let mut insert = client.insert_data_row("my_table", &rows[0]).await?;
for row in &rows {
    insert.write_row(row).await?;
}
insert.end().await?;
```

## Column-Oriented Batches

`next_batch(max_rows)` accumulates rows column-by-column into a `RowBatch` (one `Vec<Value>` per column), making it a natural bridge toward Apache Arrow:

```rust
let mut cursor = client
    .query("SELECT number::UInt64 AS n, number * 2 AS doubled FROM system.numbers LIMIT 1000")
    .fetch_rows()?;

while let Some(batch) = cursor.next_batch(256).await? {
    // batch.column_names[i]  - column name
    // batch.column_data[i]   - Vec<Value> for column i
    // batch.num_rows
}
```

## Apache Arrow

`next_arrow_batch(chunk_size)` streams ClickHouse results as `arrow::RecordBatch`es, ready for DataFusion, Polars, Parquet export, or any Arrow consumer:

```rust
let mut cursor = client.query("SELECT * FROM sensor_data").fetch_rows()?;

while let Some(batch) = cursor.next_arrow_batch(1000).await? {
    arrow::util::pretty::print_batches(&[batch]).unwrap();
}
```

### SeaORM to ClickHouse

Build an Arrow `RecordBatch` from SeaORM entities and insert it directly into ClickHouse:

```rust
use sea_orm::{ArrowSchema, Set};

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

let models: Vec<measurement::ActiveModel> = vec![..];
let schema = measurement::Entity::arrow_schema();
let batch = measurement::ActiveModel::to_arrow(&models, &schema)?;

let mut insert = client.insert_arrow("measurement", &batch).await?;
insert.write_batch(&batch).await?;
insert.end().await?;
```

### Arrow Schema to ClickHouse Table

`ClickHouseSchema::from_arrow` derives a full `CREATE TABLE` DDL from an Arrow schema:

```rust
use clickhouse::schema::{ClickHouseSchema, Engine};

let mut schema = ClickHouseSchema::from_arrow(&batch.schema());
schema
    .table_name("measurement")
    .engine(Engine::ReplacingMergeTree)
    .primary_key(["recorded_at", "sensor_id"]);
schema.find_column_mut("sensor_id").set_low_cardinality(true);

let ddl = schema.to_string();
client.query(&ddl).execute().await?;
```

The generated DDL:

```sql
CREATE TABLE measurement (
    id Int32,
    recorded_at DateTime64(6),
    sensor_id Int32,
    temperature Float64,
    voltage Decimal(38, 4)
) ENGINE = ReplacingMergeTree()
PRIMARY KEY (recorded_at, sensor_id)
```

## Type Mapping

| ClickHouse Type | `sea_query::Value` Variant |
|---|---|
| `Bool` | `Value::Bool` |
| `Int8`–`Int64` | `Value::TinyInt`–`Value::BigInt` |
| `UInt8`–`UInt64` | `Value::TinyUnsigned`–`Value::BigUnsigned` |
| `Int128` / `Int256` / `UInt128` / `UInt256` | `Value::BigDecimal` (scale 0) |
| `Float32` / `Float64` | `Value::Float` / `Value::Double` |
| `String` | `Value::String` |
| `FixedString(n)` | `Value::Bytes` |
| `UUID` | `Value::Uuid` |
| `Date` / `Date32` | `Value::ChronoDate` |
| `DateTime` / `DateTime64` | `Value::ChronoDateTime` |
| `Decimal32` / `Decimal64` | `Value::Decimal` |
| `Decimal128` | `Value::Decimal` or `Value::BigDecimal` if scale > 28 |
| `Decimal256` | `Value::BigDecimal` |
| `Array(T)` / `Tuple(...)` / `Map(K,V)` | `Value::Json` |
| `Nullable(T)` null | Typed `None` variant |

## Full Examples

Working examples are available in the [sea-clickhouse repository](https://github.com/SeaQL/clickhouse-rs):

- [`data_rows`](https://github.com/SeaQL/clickhouse-rs/blob/main/examples/data_rows.rs) — fetch rows and assert type mappings
- [`data_row_insert`](https://github.com/SeaQL/clickhouse-rs/blob/main/examples/data_row_insert.rs) — insert, mutate, re-insert (ReplacingMergeTree)
- [`arrow_sensor_data`](https://github.com/SeaQL/clickhouse-rs/blob/main/examples/arrow_sensor_data.rs) — sensor data processing via Arrow
- [`sea-orm-arrow-example`](https://github.com/SeaQL/clickhouse-rs/blob/main/sea-orm-arrow-example/src/main.rs) — SeaORM entity to Arrow to ClickHouse
