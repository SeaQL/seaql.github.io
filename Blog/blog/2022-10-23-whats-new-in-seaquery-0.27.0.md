---
slug: 2022-10-21-whats-new-in-seaquery-0.27.0
title: What's new in SeaQuery 0.27.0
author: SeaQL Team
author_title: Ivan Krivosheev
author_url: https://github.com/SeaQL
author_image_url: https://www.sea-ql.org/SeaORM/img/SeaQL.png
tags: [news]
---

🎉 We are pleased to release SeaQuery [`0.27.0`](https://github.com/SeaQL/sea-query/releases/tag/0.27.0)! Here are some feature highlights 🌟:

## Dependency Upgrades

[[#356](https://github.com/SeaQL/sea-query/issues/356)] We have upgraded a major dependence:
- Upgrade [`sqlx`](https://github.com/launchbadge/sqlx) to 0.6.1

Note that you might need to upgrade the corresponding dependency on your application as well.

## Drivers support

[[#383](https://github.com/SeaQL/sea-query/issues/383)] Remove `sea-query-driver` in favour of `sea-query-binder`

[[#422](https://github.com/SeaQL/sea-query/pull/422)] Rusqlite support is moved to `sea-query-rusqlite`

[[#433](https://github.com/SeaQL/sea-query/pull/433)] Postgres support is moved to `sea-query-postgres`

```rust
// before
sea_query::sea_query_driver_postgres!();
use sea_query_driver_postgres::{bind_query, bind_query_as};

let (sql, values) = Query::select()
    .from(Character::Table)
    .expr(Func::count(Expr::col(Character::Id)))
    .build(PostgresQueryBuilder);

let row = bind_query(sqlx::query(&sql), &values)
    .fetch_one(&mut pool)
    .await
    .unwrap();

// now
use sea_query_binder::SqlxBinder;

let (sql, values) = Query::select()
    .from(Character::Table)
    .expr(Func::count(Expr::col(Character::Id)))
    .build_sqlx(PostgresQueryBuilder);

let row = sqlx::query_with(&sql, values)
    .fetch_one(&mut pool)
    .await
    .unwrap();

// You can now make use of SQLx's `query_as_with` nicely:
let rows = sqlx::query_as_with::<_, StructWithFromRow, _>(&sql, values)
    .fetch_all(&mut pool)
    .await
    .unwrap();
```

## Support sub-query operators: `EXISTS`, `ALL`, `ANY`, `SOME`

[[#118](https://github.com/SeaQL/sea-query/issues/118)] Added sub-query operators: `EXISTS`, `ALL`, `ANY`, `SOME`

```rust
let query = Query::select()
    .column(Char::Id)
    .from(Char::Table)
    .and_where(
        Expr::col(Char::Id)
            .eq(
                Expr::any(
                    Query::select().column(Char::Id).from(Char::Table).take()
                )
            )
    )
    .to_owned();

assert_eq!(
    query.to_string(MysqlQueryBuilder),
    r#"SELECT `id` FROM `character` WHERE `id` = ANY(SELECT `id` FROM `character`)"#
);
assert_eq!(
    query.to_string(PostgresQueryBuilder),
    r#"SELECT "id" FROM "character" WHERE "id" = ANY(SELECT "id" FROM "character")"#
);
```

## Support `ON CONFLICT WHERE`

[[#366](https://github.com/SeaQL/sea-query/issues/366)] Added support to `ON CONFLICT WHERE`

```rust
let query = Query::insert()
    .into_table(Glyph::Table)
    .columns([Glyph::Aspect, Glyph::Image])
    .values_panic(vec![
        2.into(),
        3.into(),
    ])
    .on_conflict(
        OnConflict::column(Glyph::Id)
            .update_expr((Glyph::Image, Expr::val(1).add(2)))
            .target_and_where(Expr::tbl(Glyph::Table, Glyph::Aspect).is_null())
            .to_owned()
    )
    .to_owned();

assert_eq!(
    query.to_string(MysqlQueryBuilder),
    r#"INSERT INTO `glyph` (`aspect`, `image`) VALUES (2, 3) ON DUPLICATE KEY UPDATE `image` = 1 + 2"#
);
assert_eq!(
    query.to_string(PostgresQueryBuilder),
    r#"INSERT INTO "glyph" ("aspect", "image") VALUES (2, 3) ON CONFLICT ("id") WHERE "glyph"."aspect" IS NULL DO UPDATE SET "image" = 1 + 2"#
);
assert_eq!(
    query.to_string(SqliteQueryBuilder),
    r#"INSERT INTO "glyph" ("aspect", "image") VALUES (2, 3) ON CONFLICT ("id") WHERE "glyph"."aspect" IS NULL DO UPDATE SET "image" = 1 + 2"#
);
```

## Changed cond_where chaining semantics

[[#414](https://github.com/SeaQL/sea-query/issues/414)] Changed cond_where chaining semantics

```rust
// Before: will extend current Condition
assert_eq!(
    Query::select()
        .cond_where(any![Expr::col(Glyph::Id).eq(1), Expr::col(Glyph::Id).eq(2)])
        .cond_where(Expr::col(Glyph::Id).eq(3))
        .to_owned()
        .to_string(PostgresQueryBuilder),
    r#"SELECT WHERE "id" = 1 OR "id" = 2 OR "id" = 3"#
);
// Before: confusing, since it depends on the order of invocation:
assert_eq!(
    Query::select()
        .cond_where(Expr::col(Glyph::Id).eq(3))
        .cond_where(any![Expr::col(Glyph::Id).eq(1), Expr::col(Glyph::Id).eq(2)])
        .to_owned()
        .to_string(PostgresQueryBuilder),
    r#"SELECT WHERE "id" = 3 AND ("id" = 1 OR "id" = 2)"#
);
// Now: will always conjoin with `AND`
assert_eq!(
    Query::select()
        .cond_where(Expr::col(Glyph::Id).eq(1))
        .cond_where(any![Expr::col(Glyph::Id).eq(2), Expr::col(Glyph::Id).eq(3)])
        .to_owned()
        .to_string(PostgresQueryBuilder),
    r#"SELECT WHERE "id" = 1 AND ("id" = 2 OR "id" = 3)"#
);
// Now: so they are now equivalent
assert_eq!(
    Query::select()
        .cond_where(any![Expr::col(Glyph::Id).eq(2), Expr::col(Glyph::Id).eq(3)])
        .cond_where(Expr::col(Glyph::Id).eq(1))
        .to_owned()
        .to_string(PostgresQueryBuilder),
    r#"SELECT WHERE ("id" = 2 OR "id" = 3) AND "id" = 1"#
);
```

## Added `OnConflict::value` and `OnConflict::values`

[[#451](https://github.com/SeaQL/sea-query/issues/451)] Implementation `From<T>` for any `Into<Value>` into `SimpleExpr`

```rust
// Before:
OnConflict::column(Glyph::Id).update_expr((Glyph::Image, Expr::val(1).add(2))
// After:
OnConflict::column(Glyph::Id).value(Glyph::Image, Expr::val(1).add(2))
```

## Improvement `ColumnDef::default`

[[#347](https://github.com/SeaQL/sea-query/issues/347)] `ColumnDef::default` now accepts `Into<SimpleExpr>` instead `Into<Value>`

```rust
// Now we can write:
ColumnDef::new(Char::FontId)
    .timestamp()
    .default(Keyword::CurrentTimestamp)
```


## Breaking Changes

- [[#386](https://github.com/SeaQL/sea-query/pull/386)] Changed `in_tuples` interface to accept `IntoValueTuple`
- [[#320](https://github.com/SeaQL/sea-query/issues/320)] Removed deprecated methods
- [[#440](https://github.com/SeaQL/sea-query/issues/440)] `CURRENT_TIMESTAMP` changed from being a function to keyword
- [[#375](https://github.com/SeaQL/sea-query/issues/375)] Update SQLite `boolean` type from `integer to `boolean`
- [[#451](https://github.com/SeaQL/sea-query/issues/451)] Deprecated `OnConflict::update_value`, `OnConflict::update_values`, `OnConflict::update_expr`, `OnConflict::update_exprs`
- [[#451](https://github.com/SeaQL/sea-query/issues/451)] Deprecated `InsertStatement::exprs`, `InsertStatement::exprs_panic`
- [[#451](https://github.com/SeaQL/sea-query/issues/451)] Deprecated `UpdateStatement::col_expr`, `UpdateStatement::value_expr`, `UpdateStatement::exprs`
- [[#451](https://github.com/SeaQL/sea-query/issues/451)] `UpdateStatement::value` now accept `Into<SimpleExpr>` instead of `Into<Value>`
- [[#451](https://github.com/SeaQL/sea-query/issues/451)] `Expr::case`, `CaseStatement::case` and `CaseStatement::finally` now accepts `Into<SimpleExpr>` instead of `Into<Expr>`
- [[#460](https://github.com/SeaQL/sea-query/pull/460)] `InsertStatement::values`, `UpdateStatement::values` now accepts `IntoIterator<Item = SimpleExpr>` instead of `IntoIterator<Item = Value>`
- [[#409](https://github.com/SeaQL/sea-query/issues/409)] Use native api from SQLx for SQLite to work with time
- [[#435](https://github.com/SeaQL/sea-query/pull/435)] Changed type of `ColumnType::Enum` from `(String, Vec<String>)` to `Enum { name: DynIden, variants: Vec<DynIden>}`

## Miscellaneous Enhancements

- [[#336](https://github.com/SeaQL/sea-query/issues/336)] Added support one dimension Postgres array for SQLx
- [[#373](https://github.com/SeaQL/sea-query/issues/373)] Support CROSS JOIN
- [[#457](https://github.com/SeaQL/sea-query/issues/457)] Added support `DROP COLUMN` for SQLite
- [[#466](https://github.com/SeaQL/sea-query/pull/466)] Added `YEAR`, `BIT` and `VARBIT` types
- [[#338](https://github.com/SeaQL/sea-query/issues/338)] Handle Postgres schema name for schema statements
- [[#418](https://github.com/SeaQL/sea-query/issues/418)] Added `%`, `<<` and `>>` binary operators
- [[#329](https://github.com/SeaQL/sea-query/pull/430)] Added RAND function
- [[#425](https://github.com/SeaQL/sea-query/pull/425)] Implements `Display` for `Value`
- [[#427](https://github.com/SeaQL/sea-query/issues/427)] Added `INTERSECT` and `EXCEPT` to UnionType
- [[#448](https://github.com/SeaQL/sea-query/pull/448)] `OrderedStatement::order_by_customs`, `OrderedStatement::order_by_columns`, `OverStatement::partition_by_customs`, `OverStatement::partition_by_columns` now accepts `IntoIterator<Item = T>` instead of `Vec<T>`
- [[#452](https://github.com/SeaQL/sea-query/issues/452)] `TableAlterStatement::rename_column`, `TableAlterStatement::drop_column`, `ColumnDef::new`, `ColumnDef::new_with_type` now accepts `IntoIden` instead of `Iden`
- [[#426](https://github.com/SeaQL/sea-query/pull/426)] Cleanup `IndexBuilder` trait methods
- [[#436](https://github.com/SeaQL/sea-query/pull/436)] Introduce `SqlWriter` trait
- [[#448](https://github.com/SeaQL/sea-query/pull/448)] Remove unneeded `vec!` from examples

## Bug Fixes

- [[#449](https://github.com/SeaQL/sea-query/issues/449)] `distinct_on` properly handles `ColumnRef`
- [[#461](https://github.com/SeaQL/sea-query/issues/461)] Removed `ON` for `DROP INDEX` for SQLite
- [[#468](https://github.com/SeaQL/sea-query/pull/468)] Change datetime string format to include microseconds
- [[#452](https://github.com/SeaQL/sea-query/issues/452)] `ALTER TABLE` for PosgreSQL with `UNIQUE` constraint

## Integration Examples

SeaQuery plays well with the other crates in the rust ecosystem. 

- [Postgres Example](https://github.com/SeaQL/sea-query/tree/master/examples/postgres)
- [Rusqlute Example](https://github.com/SeaQL/sea-query/tree/master/examples/rusqlite)
- [SQLx Any Example](https://github.com/SeaQL/sea-query/tree/master/examples/sqlx_any)
- [SQLx Postgres Example](https://github.com/SeaQL/sea-query/tree/master/examples/sqlx_postgres)
- [SQLx MySql Example](https://github.com/SeaQL/sea-query/tree/master/examples/sqlx_mysql)
- [SQLx Sqlite Example](https://github.com/SeaQL/sea-query/tree/master/examples/sqlx_sqlite)

## Community

SeaQL is a community driven project. We welcome you to participate, contribute and together build for Rust's future.
