---
slug: 2024-12-03-whats-new-in-seaquery-0.32.0
title: What's new in SeaQuery 0.32.0
author: Billy Chan
author_title: SeaQL Team
author_url: https://github.com/billy1624
author_image_url: https://avatars.githubusercontent.com/u/30400950?v=4
tags: [news]
---

🎉 We are pleased to release SeaQuery [`0.32.0`](https://github.com/SeaQL/sea-query/releases/tag/0.32.0)! Here are some feature highlights 🌟:

## New Features

### Support of Postgres Vector

* [#774](https://github.com/SeaQL/sea-query/pull/774) Construct Postgres query with vector extension
* Added `postgres-vector` feature flag
* Added `Value::Vector`, `ColumnType::Vector`, `ColumnDef::vector()`, `PgBinOper::EuclideanDistance`, `PgBinOper::NegativeInnerProduct` and `PgBinOper::CosineDistance`

```rust
assert_eq!(
    Query::select()
        .columns([Char::Character])
        .from(Char::Table)
        .and_where(
            Expr::col(Char::Character).eq(Expr::val(pgvector::Vector::from(vec![1.0, 2.0])))
        )
        .to_string(PostgresQueryBuilder),
    r#"SELECT "character" FROM "character" WHERE "character" = '[1,2]'"#
);
```

### Unify `Expr` and `SimpleExpr` Methods with `ExprTrait`

* [#791](https://github.com/SeaQL/sea-query/pull/791) Added `ExprTrait` to unify `Expr` and `SimpleExpr` methods

- `trait ExprTrait`: consolidate `Expr` and `SimpleExpr` methods
- `impl<T> ExprTrait for T where T: Into<SimpleExpr>`: backward compatibility for all `Into<SimpleExpr>` types, such as `Value` and `FunctionCall`
- `trait PgExpr: ExprTrait`: database specific expression for Postgres and `impl PgExpr` for `FunctionCall`, `ColumnRef`, `Keyword`, `LikeExpr`, `Value`
- `trait SqliteExpr: ExprTrait`: database specific expression for SQLite and `impl SqliteExpr` for `FunctionCall`, `ColumnRef`, `Keyword`, `LikeExpr`, `Value`

```rust
pub trait ExprTrait: Sized {
    // Required methods
    fn as_enum<N>(self, type_name: N) -> SimpleExpr
        where N: IntoIden;
    fn binary<O, R>(self, op: O, right: R) -> SimpleExpr
        where O: Into<BinOper>,
    R: Into<SimpleExpr>;
    fn cast_as<N>(self, type_name: N) -> SimpleExpr
        where N: IntoIden;
    fn unary(self, o: UnOper) -> SimpleExpr;

    // Provided methods
    fn add<R>(self, right: R) -> SimpleExpr
        where R: Into<SimpleExpr> { /* ... */ }
    fn and<R>(self, right: R) -> SimpleExpr
        where R: Into<SimpleExpr> { /* ... */ }
    fn between<A, B>(self, a: A, b: B) -> SimpleExpr
        where A: Into<SimpleExpr>,
        B: Into<SimpleExpr> { /* ... */ }
    fn div<R>(self, right: R) -> SimpleExpr
        where R: Into<SimpleExpr> { /* ... */ }
    fn eq<R>(self, right: R) -> SimpleExpr
        where R: Into<SimpleExpr> { /* ... */ }
    fn equals<C>(self, col: C) -> SimpleExpr
        where C: IntoColumnRef { /* ... */ }
    // ...
}
```

### Support Partial Index

* [#478](https://github.com/SeaQL/sea-query/pull/478) Support partial index `CREATE INDEX .. WHERE ..`

```rust
assert_eq!(
    Index::create()
        .unique()
        .nulls_not_distinct()
        .name("partial-index-glyph-image-not-null")
        .table(Glyph::Table)
        .col(Glyph::Image)
        .and_where(Expr::col(Glyph::Image).is_not_null())
        .to_string(PostgresQueryBuilder),
    r#"CREATE UNIQUE INDEX "partial-index-glyph-image-not-null" ON "glyph" ("image") NULLS NOT DISTINCT WHERE "image" IS NOT NULL"#
);
```

```rust
assert_eq!(
    Index::create()
        .if_not_exists()
        .unique()
        .name("partial-index-glyph-image-not-null")
        .table(Glyph::Table)
        .col(Glyph::Image)
        .and_where(Expr::col(Glyph::Image).is_not_null())
        .to_string(SqliteQueryBuilder),
    r#"CREATE UNIQUE INDEX IF NOT EXISTS "partial-index-glyph-image-not-null" ON "glyph" ("image") WHERE "image" IS NOT NULL"#
);
```

### Get Null Value

* Added `Value::as_null`

```rust
let v = Value::Int(Some(2));
let n = v.as_null();

assert_eq!(n, Value::Int(None));
```

### Support Bitwise AND/OR Operators

* [#841](https://github.com/SeaQL/sea-query/pull/841) Added bitwise and/or operators (`bit_and`, `bit_or`)

```rust
let query = Query::select()
    .expr(1.bit_and(2).eq(3))
    .to_owned();

assert_eq!(
    query.to_string(PostgresQueryBuilder),
    r#"SELECT (1 & 2) = 3"#
);
```

## Enhancements

* [#817](https://github.com/SeaQL/sea-query/pull/817) Replace `Educe` with manual implementations
* [#844](https://github.com/SeaQL/sea-query/pull/844) Added `GREATEST` & `LEAST` function
* [#836](https://github.com/SeaQL/sea-query/pull/836) Added `ValueType::enum_type_name()`
* [#835](https://github.com/SeaQL/sea-query/pull/835) Removed "one common table" restriction on recursive CTE

### sea-query-derive

* Merged `#[enum_def]` into `sea-query-derive`
* [#769](https://github.com/SeaQL/sea-query/pull/769) `#[enum_def]` now impl additional `IdenStatic` and `AsRef<str>`

### sea-query-attr

* Updated `syn`, `heck` and `darling`
* `sea-query-attr` is now deprecated

## Upgrades

* [#798](https://github.com/SeaQL/sea-query/pull/798) Upgrade `sqlx` to `0.8`
* [#798](https://github.com/SeaQL/sea-query/pull/798) Upgrade `bigdecimal` to `0.4`
* [#802](https://github.com/SeaQL/sea-query/pull/802) Upgrade `rusqlite` to `0.32`

## Integration Examples

SeaQuery plays well with the other crates in the rust ecosystem. 

- [Postgres Example](https://github.com/SeaQL/sea-query/tree/master/examples/postgres)
- [Rusqlite Example](https://github.com/SeaQL/sea-query/tree/master/examples/rusqlite)
- [SQLx Any Example](https://github.com/SeaQL/sea-query/tree/master/examples/sqlx_any)
- [SQLx Postgres Example](https://github.com/SeaQL/sea-query/tree/master/examples/sqlx_postgres)
- [SQLx MySql Example](https://github.com/SeaQL/sea-query/tree/master/examples/sqlx_mysql)
- [SQLx Sqlite Example](https://github.com/SeaQL/sea-query/tree/master/examples/sqlx_sqlite)

## Community

SeaQL is a community driven project. We welcome you to participate, contribute and together build for Rust's future.
