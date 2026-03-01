# ClickHouse

[`sea-clickhouse`](https://docs.rs/sea-clickhouse) 是一款与 SeaQL 生态集成的 ClickHouse 客户端。它是 [`clickhouse-rs`](https://github.com/ClickHouse/clickhouse-rs) 的软分支，100% 兼容上游所有特性，并持续基于上游 rebase。

查询结果会解码为 `sea_query::Value`，让你无需定义任何 Schema 结构体即可获得对 `DateTime`、`Decimal`、`BigDecimal`、`Json`、数组等的原生支持。同时支持 Apache Arrow：可将查询结果直接流式输出为 `RecordBatch`，或将 Arrow 批次插入回 ClickHouse。

## 安装

```toml
[dependencies]
# Dynamic DataRow + SeaQuery value support
sea-clickhouse = { version = "0.14", features = ["sea-ql"] }

# Apache Arrow support (includes sea-ql)
sea-clickhouse = { version = "0.14", features = ["arrow"] }
```

## 动态 DataRow

`fetch_rows()` 会将每列解码为对应的 `sea_query::Value` 变体，无需 Schema 结构体：

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

值可在运行时转换为所需类型：

```rust
let row = cursor.next().await?.expect("expected one row");

assert_eq!(row.try_get::<f64, _>(0)?, 2.0);          // by index
assert_eq!(row.try_get::<Decimal, _>("value")?, 2.into()); // by column name
```

## 插入 DataRow

使用共享列列表构建 `DataRow`，并在单次流式请求中插入：

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

## 列式批量操作

`next_batch(max_rows)` 按列累积行到 `RowBatch`（每列一个 `Vec<Value>`），使其成为通往 Apache Arrow 的自然桥梁：

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

`next_arrow_batch(chunk_size)` 将 ClickHouse 结果以 `arrow::RecordBatch` 形式流式输出，可直接用于 DataFusion、Polars、Parquet 导出或任意 Arrow 消费者：

```rust
let mut cursor = client.query("SELECT * FROM sensor_data").fetch_rows()?;

while let Some(batch) = cursor.next_arrow_batch(1000).await? {
    arrow::util::pretty::print_batches(&[batch]).unwrap();
}
```

### SeaORM 到 ClickHouse

从 SeaORM 实体构建 Arrow `RecordBatch`，并直接插入 ClickHouse：

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

### Arrow Schema 到 ClickHouse 表

`ClickHouseSchema::from_arrow` 可从 Arrow Schema 派生完整的 `CREATE TABLE` DDL：

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

生成的 DDL：

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

## 类型映射

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
| `Decimal128` | `Value::Decimal` 或 scale > 28 时为 `Value::BigDecimal` |
| `Decimal256` | `Value::BigDecimal` |
| `Array(T)` / `Tuple(...)` / `Map(K,V)` | `Value::Json` |
| `Nullable(T)` null | 对应类型的 `None` 变体 |

## 完整示例

可运行示例可在 [sea-clickhouse 仓库](https://github.com/SeaQL/clickhouse-rs) 中查看：

- [`data_rows`](https://github.com/SeaQL/clickhouse-rs/blob/main/examples/data_rows.rs) — 获取行并断言类型映射
- [`data_row_insert`](https://github.com/SeaQL/clickhouse-rs/blob/main/examples/data_row_insert.rs) — 插入、修改、重新插入（ReplacingMergeTree）
- [`arrow_sensor_data`](https://github.com/SeaQL/clickhouse-rs/blob/main/examples/arrow_sensor_data.rs) — 通过 Arrow 处理传感器数据
- [`sea-orm-arrow-example`](https://github.com/SeaQL/clickhouse-rs/blob/main/sea-orm-arrow-example/src/main.rs) — SeaORM 实体到 Arrow 到 ClickHouse
