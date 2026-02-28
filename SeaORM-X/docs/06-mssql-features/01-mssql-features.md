# MSSQL-Specific Features

This page documents behaviors and features specific to the SQL Server backend in SeaORM X.

## Nested Transactions via Savepoints

SQLz tracks transaction depth and maps it to MSSQL's savepoint syntax transparently:

| Depth | `begin` | `commit` | `rollback` |
|---|---|---|---|
| 0 → 1 | `BEGIN TRAN` | `COMMIT TRAN` | `ROLLBACK TRAN` |
| n → n+1 | `SAVE TRAN _sqlz_savepoint_n` | _(no-op: SQL Server releases savepoints implicitly)_ | `ROLLBACK TRAN _sqlz_savepoint_n` |

Rolling back an inner block unwinds only to the savepoint, leaving the outer transaction intact:

```rust
let txn = db.begin().await?;

{
    let txn = txn.begin().await?;
    let _ = bakery::ActiveModel {
        name: Set("Nested Bakery".to_owned()), ..
    }.save(&txn).await?;
    assert_eq!(Bakery::find().all(&txn).await?.len(), 3);

    {
        let txn = txn.begin().await?;
        let _ = bakery::ActiveModel {
            name: Set("Rock n Roll Bakery".to_owned()), ..
        }.save(&txn).await?;
        assert_eq!(Bakery::find().all(&txn).await?.len(), 4);
        // txn dropped here without commit: rolls back to savepoint
    }
    assert_eq!(Bakery::find().all(&txn).await?.len(), 3);

    {
        let txn = txn.begin().await?;
        let _ = bakery::ActiveModel {
            name: Set("Rock n Roll Bakery".to_owned()), ..
        }.save(&txn).await?;
        txn.commit().await?;
    }
    txn.commit().await?;
}

assert_eq!(Bakery::find().all(&txn).await?.len(), 4);
txn.commit().await?;
```

When a `Transaction` is dropped without an explicit commit, SQLz spawns a local async task to execute `ROLLBACK` immediately and marks the connection as `RollingBack`. Any subsequent use of that connection awaits the rollback task before proceeding.

## Automatic Schema Rewriting

When a connection is configured with a non-default schema (e.g. `currentSchema=my_schema`), SeaORM X automatically prefixes every outgoing statement with that schema. No manual `[schema].[table]` boilerplate needed.

The rewriting propagates recursively into subqueries, JOINs, and CTE branches.

```rust
let db = Database::connect(
    "mssql://user:pass@localhost:1433/my_db?currentSchema=my_schema"
).await?;
```

```rust
let related = cake::Entity::find()
    .has_related(filling::Entity, filling::Column::Name.eq("Marmalade"))
    .all(db)
    .await?;
```

```sql
SELECT [cake].[id], [cake].[name] FROM [my_schema].[cake]
WHERE EXISTS(SELECT 1 FROM [my_schema].[filling]
  INNER JOIN [my_schema].[cake_filling]
    ON [cake_filling].[filling_id] = [filling].[id]
  WHERE [filling].[name] = 'Marmalade'
  AND [cake].[id] = [cake_filling].[cake_id])
```

## Tuple `IN` Fallback

MSSQL does not support tuple value syntax (`(c1, c2) IN ((v1, v2), ...)`). SeaORM X provides `EntityTrait::column_tuple_in()`, which expands to `(c1 = v1 AND c2 = v2) OR ...` when targeting MSSQL:

```rust
cake::Entity::find()
    .filter(cake::Entity::column_tuple_in(
        [cake::Column::Id, cake::Column::Name],
        &[(1i32, "a").into_value_tuple(), (2i32, "b").into_value_tuple()],
        DbBackend::MsSql,
    ).unwrap())
    .build(DbBackend::MsSql)
    .to_string();
```

```sql
-- MSSQL: automatically expands to AND/OR
SELECT [cake].[id], [cake].[name] FROM [cake]
WHERE ([cake].[id] = 1 AND [cake].[name] = 'a')
   OR ([cake].[id] = 2 AND [cake].[name] = 'b')
```

On MySQL or PostgreSQL, the same method generates native tuple syntax.

## i64 / i32 Type Coercion

MSSQL returns `INT` columns as `i32` at the wire level. SeaORM X handles the coercion to `i64` transparently: no schema changes or manual casting required.

## `execute_unprepared` via Raw TDS Batch

For DDL and migration scenarios, `execute_unprepared` uses the raw TDS `execute_batch` path rather than prepared statements. This preserves temp-table visibility across statement batches, which is a common requirement for MSSQL migration and stored-procedure patterns that break under prepared statement isolation.

## Entity-First Workflow

Define entities in Rust and let SeaORM sync the schema to MSSQL. Tables, columns, unique keys, and foreign keys are created in topological order:

```rust
db.get_schema_builder()
    .register(order::Entity)
    .register(store::Entity)
    .sync(db)
    .await?;
```

This requires the `schema-sync` feature flag.

## Schema-First Codegen

Point `sea-orm-cli` at an existing MSSQL database to generate entity files:

```sh
sea-orm-cli generate entity \
  --database-url "mssql://sa:pass@localhost/AdventureWorksLT2016" \
  --database-schema "SalesLT" \
  --entity-format dense
```

```rust
#[sea_orm::model]
#[sea_orm(schema_name = "SalesLT", table_name = "Address")]
pub struct Model {
    #[sea_orm(column_name = "AddressID", primary_key)]
    pub address_id: i32,
    #[sea_orm(column_name = "AddressLine1")]
    pub address_line1: String,
    pub rowguid: Uuid,
    // ...
}
```

## Query Builder with `MsSqlQueryBuilder`

SeaQuery X generates MSSQL-native syntax with bracket quoting and `@P` parameter binding:

```rust
assert_eq!(
    Query::select()
        .column(Glyph::Image)
        .from(Glyph::Table)
        .and_where(Expr::col(Glyph::Image).like("A"))
        .and_where(Expr::col(Glyph::Id).is_in([1, 2, 3]))
        .build(MsSqlQueryBuilder),
    (
        "SELECT [image] FROM [glyph] WHERE [image] LIKE @P1 AND [id] IN (@P2, @P3, @P4)"
            .to_owned(),
        Values(vec![
            Value::String(Some(Box::new("A".to_owned()))),
            Value::Int(Some(1)),
            Value::Int(Some(2)),
            Value::Int(Some(3))
        ])
    )
);
```

DDL uses MSSQL-native types (`IDENTITY`, `nvarchar`, etc.):

```rust
let table = Table::create()
    .table(Glyph::Table)
    .col(
        ColumnDef::new(Glyph::Id)
            .integer()
            .not_null()
            .auto_increment()
            .primary_key(),
    )
    .col(ColumnDef::new(Glyph::Image).string().not_null())
    .to_owned();

assert_eq!(
    table.to_string(MsSqlQueryBuilder),
    [
        r#"CREATE TABLE [glyph] ("#,
        r#"[id] int NOT NULL IDENTITY PRIMARY KEY,"#,
        r#"[image] nvarchar(255) NOT NULL"#,
        r#")"#,
    ]
    .join(" ")
);
```

## Schema Discovery

SeaSchema X discovers MSSQL schemas programmatically, including columns, data types, identity columns, indexes, foreign keys, collations, and default expressions:

```rust
let options: MsSqlConnectOptions =
    "mssql://sa:password@localhost/AdventureWorksLT2016".parse()?;
let connection = MsSqlPool::connect_with(options).await?;
let schema_discovery = SchemaDiscovery::new(connection, Some("SalesLT"));

let schema = schema_discovery.discover().await?;
// schema.tables contains full table definitions with columns, indexes, and foreign keys
```

## API Documentation

- [sea-orm-x](https://www.sea-ql.org/docs/sea-orm-x/sea_orm/)
- [sea-query-x](https://www.sea-ql.org/docs/sea-orm-x/sea_query/)
- [sea-schema-x](https://www.sea-ql.org/docs/sea-orm-x/sea_schema/)
- [sqlz](https://www.sea-ql.org/docs/sea-orm-x/sqlz/)

## Limitations

SQLz is a purpose-built SQL Server driver, not a full SQLx port. Known gaps:

- **No compile-time query checking.** SQLx's `sqlx::query!` macro verifies SQL against a live database at compile time. SQLz has no equivalent; queries are checked at runtime only.
- **No custom type encoding/decoding.** SQLx supports user-defined `Encode`/`Decode` implementations for arbitrary Rust types. SQLz ships a fixed set of supported types (primitives, `uuid`, `Decimal`, `BigDecimal`, `chrono`, `time`, `serde_json`) behind feature flags. Adding a new wire type requires changes inside SQLz itself.
