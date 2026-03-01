# Arrow & Parquet

:::tip 自 `2.0.0` 起
:::

SeaORM 可直接从实体定义派生 [Apache Arrow](https://arrow.apache.org/) 的 Schema。这使你的 ORM 层与列式数据生态无缝衔接：[Parquet](https://parquet.apache.org/)、[DataFusion](https://datafusion.apache.org/)、[Polars](https://pola.rs/)、[DuckDB](https://duckdb.org/) 等。

详细说明请参阅[博客文章](https://www.sea-ql.org/blog/2026-02-22-sea-orm-arrow/)。

## 设置

通过 `with-arrow` 特性启用 Arrow 支持：

```toml
[dependencies]
sea-orm = { version = "2.0.0-rc", features = ["with-arrow"] }
parquet = { version = "57", features = ["arrow"] }
```

## 派生 Arrow 架构

在 `#[sea_orm(..)]` 属性中添加 `arrow_schema`：

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

对于紧凑型实体，可使用 `DeriveArrowSchema` 作为额外 derive：

```rust
#[derive(DeriveEntityModel, DeriveArrowSchema, ..)]
#[sea_orm(table_name = "measurement")]
pub struct Model { .. }
```

这会派生 [`ArrowSchema`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/trait.ArrowSchema.html) 特征，并暴露三个方法：

```rust
use sea_orm::ArrowSchema;

let schema = measurement::Entity::arrow_schema();
let batch = measurement::ActiveModel::to_arrow(&models, &schema)?;
let models = measurement::ActiveModel::from_arrow(&batch)?;
```

## 导出到 Parquet

将 ActiveModel 转换为 `RecordBatch`，然后使用 `parquet` crate 写入：

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

生成的文件可被任何兼容 Parquet 的工具读取。

## 从 Parquet 导入

将 Parquet 文件读回为 ActiveModel，并插入到任意 SeaORM 支持的数据库：

```rust
use parquet::arrow::arrow_reader::ParquetRecordBatchReaderBuilder;

let file = std::fs::File::open("measurements.parquet")?;
let reader = ParquetRecordBatchReaderBuilder::try_new(file)?.build()?;

let batches: Vec<_> = reader.collect::<Result<_, _>>()?;
let restored = measurement::ActiveModel::from_arrow(&batches[0])?;

measurement::Entity::insert_many(restored).exec(&db).await?;
```

Arrow 的 null 会变为 `Set(None)`，缺失的列会变为 `NotSet`。

## 类型映射

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

## 覆盖时间戳和小数映射

可按字段覆盖时间戳精度或时区：

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

`arrow_timestamp_unit` 的有效值：`"Second"`、`"Millisecond"`、`"Microsecond"`、`"Nanosecond"`。

按字段覆盖 decimal 精度和小数位：

```rust
#[sea_orm(
    column_type = "Decimal(Some((20, 4)))",
    arrow_precision = 20,
    arrow_scale = 4
)]
pub amount: Decimal,
```

## 完整示例

完整可运行示例（生成数据 → 写入 Parquet → 往返 → 插入 SQLite）可在 [SeaORM 仓库](https://github.com/SeaQL/sea-orm/tree/master/examples/parquet_example) 中查看。
