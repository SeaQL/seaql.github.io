---
slug: 2022-12-30-whats-new-in-seaquery-0.28.0
title: What's new in SeaQuery 0.28.0
author: SeaQL Team
author_title: Ivan Krivosheev
author_url: https://github.com/SeaQL
author_image_url: https://www.sea-ql.org/SeaORM/img/SeaQL.png
tags: [news]
---

🎉 We are pleased to release SeaQuery [`0.28.0`](https://github.com/SeaQL/sea-query/releases/tag/0.28.0)! Here are some feature highlights 🌟:

## New `IdenStatic` trait for static identifier

[[#508](https://github.com/SeaQL/sea-query/pull/508)] Representing a identifier with `&'static str`. The `IdenStatic` trait looks like this:

```rust
pub trait IdenStatic: Iden + Copy + 'static {
    fn as_str(&self) -> &'static str;
}
```

You can derive it easily for your existing `Iden`. Just changing the `#[derive(Iden)]` into `#[derive(IdenStatic)]`.

```rust
#[derive(IdenStatic)]
enum User {
    Table,
    Id,
    FirstName,
    LastName,
    #[iden = "_email"]
    Email,
}

assert_eq!(User::Email.as_str(), "_email");
```

## New `PgExpr` and `SqliteExpr` traits for backend specific expressions

[[#519](https://github.com/SeaQL/sea-query/pull/519)] Postgres specific and SQLite specific expressions are being moved into its corresponding trait. You need to import the trait into scope before construct the expression with those backend specific methods.

```rust
// Importing `PgExpr` trait before constructing Postgres expression
use sea_query::{extension::postgres::PgExpr, tests_cfg::*, *};

let query = Query::select()
    .columns([Font::Name, Font::Variant, Font::Language])
    .from(Font::Table)
    .and_where(Expr::val("a").concatenate("b").concat("c").concat("d"))
    .to_owned();

assert_eq!(
    query.to_string(PostgresQueryBuilder),
    r#"SELECT "name", "variant", "language" FROM "font" WHERE 'a' || 'b' || 'c' || 'd'"#
);
```

```rust
// Importing `SqliteExpr` trait before constructing SQLite expression
 use sea_query::{extension::sqlite::SqliteExpr, tests_cfg::*, *};

 let query = Query::select()
    .column(Font::Name)
    .from(Font::Table)
    .and_where(Expr::col(Font::Name).matches("a"))
    .to_owned();

 assert_eq!(
    query.to_string(SqliteQueryBuilder),
    r#"SELECT "name" FROM "font" WHERE "name" MATCH 'a'"#
 );
```

## Bug Fixes

* Wrap unions into parenthesis https://github.com/SeaQL/sea-query/pull/498
* Syntax error on empty condition https://github.com/SeaQL/sea-query/pull/505
```rust
// given
let (statement, values) = sea_query::Query::select()
    .column(Glyph::Id)
    .from(Glyph::Table)
    .cond_where(Cond::any()
        .add(Cond::all()) // empty all() => TRUE
        .add(Cond::any()) // empty any() => FALSE
    )
    .build(sea_query::MysqlQueryBuilder);

// old behavior
assert_eq!(statement, r#"SELECT `id` FROM `glyph`"#);

// new behavior
assert_eq!(
    statement,
    r#"SELECT `id` FROM `glyph` WHERE (TRUE) OR (FALSE)"#
);
```

## Breaking Changes

* [[#535](https://github.com/SeaQL/sea-query/pull/535)] MSRV is up to 1.62
```shell
# Make sure you're running SeaQuery with Rust 1.62+ 🦀
$ rustup update
```

* [[#492](https://github.com/SeaQL/sea-query/pull/492)] `ColumnType::Array` definition changed from `Array(SeaRc<Box<ColumnType>>)` to `Array(SeaRc<ColumnType>)`
* [[#475](https://github.com/SeaQL/sea-query/pull/475)] `Func::*` now returns `FunctionCall` instead of `SimpleExpr`
* [[#475](https://github.com/SeaQL/sea-query/pull/475)] `Func::coalesce` now accepts `IntoIterator<Item = SimpleExpr>` instead of `IntoIterator<Item = Into<SimpleExpr>`
* [[#475](https://github.com/SeaQL/sea-query/pull/475)] Removed `Expr::arg` and `Expr::args` - these functions are no longer needed
* [[#507](https://github.com/SeaQL/sea-query/pull/507)] Moved all Postgres specific operators to `PgBinOper`
* [[#476](https://github.com/SeaQL/sea-query/pull/476)] `Expr` methods used to accepts `Into<Value>` now accepts `Into<SimpleExpr>`
* [[#476](https://github.com/SeaQL/sea-query/pull/476)] `Expr::is_in`, `Expr::is_not_in` now accepts `Into<SimpleExpr>` instead of `Into<Value>` and convert it to `SimpleExpr::Tuple` instead of `SimpleExpr::Values`
* [[#475](https://github.com/SeaQL/sea-query/pull/475)] `Expr::expr` now accepts `Into<SimpleExpr>` instead of `SimpleExpr`
* [[#519](https://github.com/SeaQL/sea-query/pull/519)] Moved Postgres specific `Expr` methods to new trait `PgExpr`
* [[#528](https://github.com/SeaQL/sea-query/pull/528)] `Expr::equals` now accepts `C: IntoColumnRef` instead of `T: IntoIden, C: IntoIden`
```diff
use sea_query::{*, tests_cfg::*};

let query = Query::select()
    .columns([Char::Character, Char::SizeW, Char::SizeH])
    .from(Char::Table)
    .and_where(
        Expr::col((Char::Table, Char::FontId))
-           .equals(Font::Table, Font::Id)
+           .equals((Font::Table, Font::Id))
    )
    .to_owned();

assert_eq!(
    query.to_string(MysqlQueryBuilder),
    r#"SELECT `character`, `size_w`, `size_h` FROM `character` WHERE `character`.`font_id` = `font`.`id`"#
);
```

* [[#525](https://github.com/SeaQL/sea-query/pull/525)] Removed integer and date time column types' display length / precision option

## API Additions

* [[#475](https://github.com/SeaQL/sea-query/pull/475)] Added `SelectStatement::from_function`
```rust
use sea_query::{tests_cfg::*, *};

let query = Query::select()
    .column(ColumnRef::Asterisk)
    .from_function(Func::random(), Alias::new("func"))
    .to_owned();

assert_eq!(
    query.to_string(MysqlQueryBuilder),
    r#"SELECT * FROM RAND() AS `func`"#
);
```

* [[#486](https://github.com/SeaQL/sea-query/pull/486)] Added binary operators from the Postgres `pg_trgm` extension
* [[#473](https://github.com/SeaQL/sea-query/pull/473)] Added `ILIKE` and `NOT ILIKE` operators
* [[#510](https://github.com/SeaQL/sea-query/pull/510)] Added the `mul` and `div` methods for `SimpleExpr`
* [[#513](https://github.com/SeaQL/sea-query/pull/513)] Added the `MATCH`, `->` and `->>` operators for SQLite
* [[#497](https://github.com/SeaQL/sea-query/pull/497)] Added the `FULL OUTER JOIN`
* [[#530](https://github.com/SeaQL/sea-query/pull/530)] Added `PgFunc::get_random_uuid`
* [[#528](https://github.com/SeaQL/sea-query/pull/528)] Added `SimpleExpr::eq`, `SimpleExpr::ne`, `Expr::not_equals`
* [[#529](https://github.com/SeaQL/sea-query/pull/529)] Added `PgFunc::starts_with`
* [[#535](https://github.com/SeaQL/sea-query/pull/535)] Added `Expr::custom_keyword` and `SimpleExpr::not`
```rust
use sea_query::*;

let query = Query::select()
    .expr(Expr::custom_keyword(Alias::new("test")))
    .to_owned();

assert_eq!(query.to_string(MysqlQueryBuilder), r#"SELECT test"#);
assert_eq!(query.to_string(PostgresQueryBuilder), r#"SELECT test"#);
assert_eq!(query.to_string(SqliteQueryBuilder), r#"SELECT test"#);
```

* [[#539](https://github.com/SeaQL/sea-query/pull/539)] Added `SimpleExpr::like`, `SimpleExpr::not_like` and `Expr::cast_as`
* [[#532](https://github.com/SeaQL/sea-query/pull/532)] Added support for `NULLS NOT DISTINCT` clause for Postgres
* [[#531](https://github.com/SeaQL/sea-query/pull/531)] Added `Expr::cust_with_expr` and `Expr::cust_with_exprs`
```rust
use sea_query::{tests_cfg::*, *};

let query = Query::select()
    .expr(Expr::cust_with_expr("data @? ($1::JSONPATH)", "hello"))
    .to_owned();

assert_eq!(
    query.to_string(PostgresQueryBuilder),
    r#"SELECT data @? ('hello'::JSONPATH)"#
);
```

* [[#538](https://github.com/SeaQL/sea-query/pull/538)] Added support for converting `&String` to Value

## Miscellaneous Enhancements

* [[#475](https://github.com/SeaQL/sea-query/pull/475)] New struct `FunctionCall` which hold function and arguments
* [[#503](https://github.com/SeaQL/sea-query/pull/503)] Support `BigDecimal`, `IpNetwork` and `MacAddress` for `sea-query-postgres`
* [[#511](https://github.com/SeaQL/sea-query/pull/511)] Made `value::with_array` module public and therefore making `NotU8` trait public
* [[#524](https://github.com/SeaQL/sea-query/pull/524)] Drop the `Sized` requirement on implementers of `SchemaBuilders`

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
