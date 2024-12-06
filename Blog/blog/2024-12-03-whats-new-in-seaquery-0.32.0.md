---
slug: 2024-12-03-whats-new-in-seaquery-0.32.0
title: What's new in SeaQuery 0.32.0
author: SeaQL Team
author_url: https://github.com/SeaQL
author_image_url: https://www.sea-ql.org/blog/img/SeaQL.png
tags: [news]
---

🎉 We are pleased to release SeaQuery [`0.32.0`](https://github.com/SeaQL/sea-query/releases/tag/0.32.0)! Here are some feature highlights 🌟:

## New Features

### Unify `Expr` and `SimpleExpr` Methods with `ExprTrait` [#791](https://github.com/SeaQL/sea-query/pull/791)

Previously, "operator" methods (e.g. `add`, `eq`) are duplicated across `Expr` and `SimpleExpr`, but the list of methods is slightly different for each. And since `Expr` and `SimpleExpr` are distinct types, it makes writing generic code difficult.

The [`ExprTrait`](https://docs.rs/sea-query/0.32.1/sea_query/expr/trait.ExprTrait.html) looks like this:

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
    fn add<R>(self, right: R) -> SimpleExpr where R: Into<SimpleExpr> { ... }
    fn and<R>(self, right: R) -> SimpleExpr where R: Into<SimpleExpr> { ... }
    fn between<A, B>(self, a: A, b: B) -> SimpleExpr
        where A: Into<SimpleExpr>,
              B: Into<SimpleExpr> { ... }
    fn div<R>(self, right: R) -> SimpleExpr where R: Into<SimpleExpr> { ... }
    fn eq<R>(self, right: R) -> SimpleExpr where R: Into<SimpleExpr> { ... }
    fn equals<C>(self, col: C) -> SimpleExpr where C: IntoColumnRef { ... }

    // omitting the where clause below to make it more concise ..

    fn gt<R>(self, right: R) -> SimpleExpr;
    fn gte<R>(self, right: R) -> SimpleExpr;
    fn in_subquery(self, sel: SelectStatement) -> SimpleExpr;
    fn in_tuples<V, I>(self, v: I) -> SimpleExpr;
    fn is<R>(self, right: R) -> SimpleExpr;
    fn is_in<V, I>(self, v: I) -> SimpleExpr;
    fn is_not<R>(self, right: R) -> SimpleExpr;
    fn is_not_in<V, I>(self, v: I) -> SimpleExpr;
    fn is_not_null(self) -> SimpleExpr;
    fn is_null(self) -> SimpleExpr;
    fn left_shift<R>(self, right: R) -> SimpleExpr;
    fn like<L>(self, like: L) -> SimpleExpr;
    fn lt<R>(self, right: R) -> SimpleExpr;
    fn lte<R>(self, right: R) -> SimpleExpr;
    fn modulo<R>(self, right: R) -> SimpleExpr;
    fn mul<R>(self, right: R) -> SimpleExpr;
    fn ne<R>(self, right: R) -> SimpleExpr;
    fn not(self) -> SimpleExpr;
    fn not_between<A, B>(self, a: A, b: B) -> SimpleExpr;
    fn not_equals<C>(self, col: C) -> SimpleExpr;
    fn not_in_subquery(self, sel: SelectStatement) -> SimpleExpr;
    fn not_like<L>(self, like: L) -> SimpleExpr;
    fn or<R>(self, right: R) -> SimpleExpr;
    fn right_shift<R>(self, right: R) -> SimpleExpr;
    fn sub<R>(self, right: R) -> SimpleExpr;
    fn bit_and<R>(self, right: R) -> SimpleExpr;
    fn bit_or<R>(self, right: R) -> SimpleExpr;
}
```

* Added `ExprTrait` to unify `Expr` and `SimpleExpr` methods
* Added `impl<T> ExprTrait for T where T: Into<SimpleExpr>` to maintain backwards compatibility for all `Into<SimpleExpr>` types, such as `Value` and `FunctionCall`
* Added `trait PgExpr: ExprTrait`: database specific expression for Postgres and `impl PgExpr` for `FunctionCall`, `ColumnRef`, `Keyword`, `LikeExpr`, `Value`
* Added `trait SqliteExpr: ExprTrait`: database specific expression for SQLite and `impl SqliteExpr` for `FunctionCall`, `ColumnRef`, `Keyword`, `LikeExpr`, `Value`

### Support of Postgres Vector [#774](https://github.com/SeaQL/sea-query/pull/774)

* Construct Postgres query with vector extension
* Added `postgres-vector` feature flag
* Added [`Value::Vector`](https://docs.rs/sea-query/0.32.1/sea_query/value/enum.Value.html#variant.Vector), [`ColumnType::Vector`](https://docs.rs/sea-query/0.32.1/sea_query/table/enum.ColumnType.html#variant.Vector), [`ColumnDef::vector()`](https://docs.rs/sea-query/0.32.1/sea_query/table/struct.ColumnDef.html#method.vector), `PgBinOper::EuclideanDistance`, `PgBinOper::NegativeInnerProduct` and `PgBinOper::CosineDistance`

Example:

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

### Support Partial Index [#478](https://github.com/SeaQL/sea-query/pull/478)

* Support partial index `CREATE INDEX .. WHERE ..`

Example (Postgres):

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

Example (Sqlite):

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

This one may seem a little bummer, but it is type system problem. In order to support the Postgres protocol, SeaQuery's `Value` enum does not have a `Null` variant. This new [`Value::as_null`](https://docs.rs/sea-query/0.32.1/sea_query/value/enum.Value.html#method.as_null) method allows you to:

1. construct a typed null value
2. nullify a value
3. define generic functions (`impl Into<Value>`)

```rust
let v = Value::Int(Some(2));
let n = v.as_null();

assert_eq!(n, Value::Int(None));

// one liner:
assert_eq!(Into::<Value>::into(2.2).as_null(), Value::Double(None));
```

### Bitwise AND/OR Operators [#841](https://github.com/SeaQL/sea-query/pull/841)

* Added bitwise and/or operators ([`bit_and`](https://docs.rs/sea-query/0.32.1/sea_query/expr/trait.ExprTrait.html#method.bit_and), [`bit_or`](https://docs.rs/sea-query/0.32.1/sea_query/expr/trait.ExprTrait.html#method.bit_or))

Examples:

```rust
let query = Query::select()
    .expr(1.bit_and(2).eq(3))
    .to_owned();

assert_eq!(
    query.to_string(PostgresQueryBuilder),
    r#"SELECT (1 & 2) = 3"#
);
```

```rust
let query = Query::select()
    .expr(1.bit_or(2).eq(3))
    .to_owned();

assert_eq!(
    query.to_string(PostgresQueryBuilder),
    r#"SELECT (1 | 2) = 3"#
);
```

## Enhancements

* [#817](https://github.com/SeaQL/sea-query/pull/817) Replaced `Educe` with manual implementations
    * This is an effort to cut down compilation time
* [#844](https://github.com/SeaQL/sea-query/pull/844) Added `GREATEST` & `LEAST` function
* [#836](https://github.com/SeaQL/sea-query/pull/836) Added `ValueType::enum_type_name()`
* [#835](https://github.com/SeaQL/sea-query/pull/835) Removed "one common table" restriction on recursive CTE

### `sea-query-derive`

We've finally done it! Removing the last bit of `syn` v1 from our dependency tree:

```
sea-query % cargo tree |grep 'syn '
│   └── syn v2.0.39
    │   │   └── syn v2.0.39 (*)
    │       └── syn v2.0.39 (*)
    ├── syn v2.0.39 (*)
            └── syn v2.0.39 (*)
│   │   └── syn v2.0.39 (*)
```

* Merged `#[enum_def]` into `sea-query-derive`
* [#769](https://github.com/SeaQL/sea-query/pull/769) `#[enum_def]` now impl additional `IdenStatic` and `AsRef<str>`

### `sea-query-attr`

We've merged this crate into `sea-query-derive`, and they will be maintained together from now on.

* Updated `syn`, `heck` and `darling`
* `sea-query-attr` is now deprecated

## Upgrades

* [#798](https://github.com/SeaQL/sea-query/pull/798) Upgraded `sqlx` to `0.8`
* [#798](https://github.com/SeaQL/sea-query/pull/798) Upgraded `bigdecimal` to `0.4`
* [#802](https://github.com/SeaQL/sea-query/pull/802) Upgraded `rusqlite` to `0.32`

## Integration Examples

SeaQuery plays well with the other crates in the rust ecosystem. 

- [Postgres Example](https://github.com/SeaQL/sea-query/tree/master/examples/postgres)
- [Rusqlite Example](https://github.com/SeaQL/sea-query/tree/master/examples/rusqlite)
- [SQLx MySql Example](https://github.com/SeaQL/sea-query/tree/master/examples/sqlx_mysql)
- [SQLx Postgres Example](https://github.com/SeaQL/sea-query/tree/master/examples/sqlx_postgres)
- [SQLx Sqlite Example](https://github.com/SeaQL/sea-query/tree/master/examples/sqlx_sqlite)

## Community

SeaQL.org is an independent open-source organization run by passionate ️developers. If you like our projects, please star ⭐ and share our repositories. If you feel generous, a small donation via [GitHub Sponsor](https://github.com/sponsors/SeaQL) will be greatly appreciated, and goes a long way towards sustaining the organization 🚢.

SeaStreamer is a community driven project. We welcome you to participate, contribute and together build for Rust's future 🦀.

## Rustacean Sticker Pack 🦀

The Rustacean Sticker Pack is the perfect way to express your passion for Rust.
Our stickers are made with a premium water-resistant vinyl with a unique matte finish.
Stick them on your laptop, notebook, or any gadget to show off your love for Rust!

Moreover, all proceeds contributes directly to the ongoing development of SeaQL projects.

Sticker Pack Contents:
- Logo of SeaQL projects: SeaQL, SeaORM, SeaQuery, Seaography, FireDBG
- Mascot of SeaQL: Terres the Hermit Crab
- Mascot of Rust: Ferris the Crab
- The Rustacean word

[Support SeaQL and get a Sticker Pack!](https://www.sea-ql.org/sticker-pack/)

<a href="https://www.sea-ql.org/sticker-pack/"><img style={{borderRadius: "25px"}} alt="Rustacean Sticker Pack by SeaQL" src="https://www.sea-ql.org/static/sticker-pack-1s.jpg" /></a>
