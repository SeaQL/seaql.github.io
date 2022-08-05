---
slug: 2022-08-05-whats-new-in-seaquery-0.26.0
title: What's new in SeaQuery 0.26.0
author: SeaQL Team
author_title: Ivan Krivosheev
author_url: https://github.com/SeaQL
author_image_url: https://www.sea-ql.org/SeaORM/img/SeaQL.png
tags: [news]
---

🎉 We are pleased to release SeaQuery [`0.26.0`](https://github.com/SeaQL/sea-query/releases/tag/0.26.0)! Here are some feature highlights 🌟:

## Dependency Upgrades

[[#356](https://github.com/SeaQL/sea-query/issues/356)] We have upgraded a few major dependencies:
- Upgrade [`sqlx`](https://github.com/launchbadge/sqlx) to 0.6
- Upgrade [`time`](https://github.com/time-rs/time) to 0.3
- Upgrade [`uuid`](https://github.com/uuid-rs/uuid) to 1.0
- Upgrade [`bigdecimal`](https://github.com/akubera/bigdecimal-rs) to 0.3
- Upgrade [`ipnetwork`](https://github.com/achanda/ipnetwork) to 0.19

Note that you might need to upgrade the corresponding dependency on your application as well.

## VALUES lists

[[#351](https://github.com/SeaQL/sea-query/issues/350)] Add support for VALUES lists

```rust
// SELECT * FROM (VALUES (1, 'hello'), (2, 'world')) AS "x"
let query = SelectStatement::new()
    .expr(Expr::asterisk())
    .from_values(vec![(1i32, "hello"), (2, "world")], Alias::new("x"))
    .to_owned();

 assert_eq!(
     query.to_string(PostgresQueryBuilder), 
     r#"SELECT * FROM (VALUES (1, 'hello'), (2, 'world')) AS "x""#
 );
```

## Introduce sea-query-binder

[[#273](https://github.com/SeaQL/sea-query/issues/273)] Native support SQLx without marcos

```rust
use sea_query_binder::SqlxBinder;

// Create SeaQuery query with prepare SQLx
let (sql, values) = Query::select()
    .columns([
        Character::Id,
        Character::Uuid,
        Character::Character,
        Character::FontSize,
        Character::Meta,
        Character::Decimal,
        Character::BigDecimal,
        Character::Created,
        Character::Inet,
        Character::MacAddress,
    ])
    .from(Character::Table)
    .order_by(Character::Id, Order::Desc)
    .build_sqlx(PostgresQueryBuilder);

// Execute query
let rows = sqlx::query_as_with::<_, CharacterStructChrono, _>(&sql, values)
    .fetch_all(&mut pool)
    .await?;

// Print rows
for row in rows.iter() {
    println!("{:?}", row);
}
```

## CASE WHEN statement support 

[[#304](https://github.com/SeaQL/sea-query/pull/304)] Add support for `CASE WHEN` statement

```rust
let query = Query::select()
    .expr_as(
        CaseStatement::new()
            .case(Expr::tbl(Glyph::Table, Glyph::Aspect).is_in(vec![2, 4]), Expr::val(true))
            .finally(Expr::val(false)),
        Alias::new("is_even")
    )
    .from(Glyph::Table)
    .to_owned();
    
assert_eq!(
    query.to_string(PostgresQueryBuilder),
    r#"SELECT (CASE WHEN ("glyph"."aspect" IN (2, 4)) THEN TRUE ELSE FALSE END) AS "is_even" FROM "glyph""#
);
```

## Add support for Ip(4,6)Network and MacAddress

[[#309](https://github.com/SeaQL/sea-query/pull/309)] Add support for Network types in PostgreSQL backend

## Introduce sea-query-attr

[[#296](https://github.com/SeaQL/sea-query/issues/296)] Proc-macro for deriving Iden enum from struct

```rust
use sea_query::gen_type_def;

#[gen_type_def]
pub struct Hello {
    pub name: String
}

println!("{:?}", HelloTypeDef::Name);
```

## Add ability to alter foreign keys

[[#299](https://github.com/SeaQL/sea-query/pull/299)] Add support for `ALTER` foreign Keys

```rust
let foreign_key_char = TableForeignKey::new()
    .name("FK_character_glyph")
    .from_tbl(Char::Table)
    .from_col(Char::FontId)
    .from_col(Char::Id)
    .to_tbl(Glyph::Table)
    .to_col(Char::FontId)
    .to_col(Char::Id)
    .to_owned();

let table = Table::alter()
    .table(Character::Table)
    .add_foreign_key(&foreign_key_char)
    .to_owned();

assert_eq!(
    table.to_string(PostgresQueryBuilder),
    vec![
        r#"ALTER TABLE "character""#,
        r#"ADD CONSTRAINT "FK_character_glyph""#,
        r#"FOREIGN KEY ("font_id", "id") REFERENCES "glyph" ("font_id", "id")"#,
        r#"ON DELETE CASCADE ON UPDATE CASCADE,"#,
    ]
    .join(" ")
);
```

## Select DISTINCT ON

[[#250](https://github.com/SeaQL/sea-query/issues/250)]

```rust
let query = Query::select()
    .from(Char::Table)
    .distinct_on(vec![Char::Character])
    .column(Char::Character)
    .column(Char::SizeW)
    .column(Char::SizeH)
    .to_owned();
    
 assert_eq!(
     query.to_string(PostgresQueryBuilder),
     r#"SELECT DISTINCT ON ("character") "character", "size_w", "size_h" FROM "character""#
 );
```

## Miscellaneous Enhancements

- [[#353](https://github.com/SeaQL/sea-query/pull/353)] Support `LIKE ... ESCAPE ...`  expression  
- [[#306](https://github.com/SeaQL/sea-query/pull/306)] Move `escape` and `unescape` string to backend
- [[#365](https://github.com/SeaQL/sea-query/pull/365)] Add method to make a column nullable
- [[#348](https://github.com/SeaQL/sea-query/pull/348)] Add `is` & `is_not` to Expr
- [[#349](https://github.com/SeaQL/sea-query/pull/349)] Add `CURRENT_TIMESTAMP` function
- [[#345](https://github.com/SeaQL/sea-query/pull/345)] Add `in_tuple` method to Expr
- [[#266](https://github.com/SeaQL/sea-query/pull/266)] Insert Default
- [[#324](https://github.com/SeaQL/sea-query/pull/324)] Make `sea-query-driver` an optional dependency
- [[#334](https://github.com/SeaQL/sea-query/pull/334)] Add `ABS` function
- [[#332](https://github.com/SeaQL/sea-query/pull/332)] Support `IF NOT EXISTS` when create index
- [[#314](https://github.com/SeaQL/sea-query/pull/314)] Support different `blob` types in MySQL
- [[#331](https://github.com/SeaQL/sea-query/pull/331)] Add `VarBinary` column type
- [[#335](https://github.com/SeaQL/sea-query/pull/335)] `RETURNING` expression supporting `SimpleExpr`

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
