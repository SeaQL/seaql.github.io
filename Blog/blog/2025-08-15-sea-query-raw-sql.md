---
slug: 2025-08-15-sea-query-raw-sql
title: SeaQuery just made writing raw SQL more enjoyable
author: SeaQL Team
author_title: Chris Tsang
author_url: https://github.com/SeaQL
author_image_url: https://www.sea-ql.org/blog/img/SeaQL.png
image: https://www.sea-ql.org/blog/img/SeaQuery%201.0%20Banner.png
tags: [news]
---

<img alt="SeaQuery 1.0 Banner" src="/blog/img/SeaQuery%201.0%20Banner.png"/>

You enjoy writing raw SQL queries, SeaQuery just made it better!

We've created a new `raw_query!` macro with neat features to make writing raw SQL queries more ergononmic.

The biggest headache when crafting complex queries is parameter binding, whether you use `?` or `$N` assigning parameters manually is laborious and error-prone.

SeaQuery's new [`raw_query!`](https://docs.rs/sea-query/1.0.0-rc.9/sea_query/index.html#4-improved-raw-sql-ergonomics) macro is designed to solve this exact problem.

## Gist

```rust
let a = 1;
struct B { b: i32 }
let b = B { b: 2 };
let c = "A";
let d = vec![3, 4, 5];

let query = sea_query::raw_query!(
    PostgresQueryBuilder,
    r#"SELECT ("size_w" + {a}) * {b.b} FROM "glyph"
       WHERE "image" LIKE {c} AND "id" IN ({..d})"#
);

assert_eq!(
    query.sql,
    r#"SELECT ("size_w" + $1) * $2 FROM "glyph"
       WHERE "image" LIKE $3 AND "id" IN ($4, $5, $6)"#
);
assert_eq!(
    query.values,
    Values(vec![1.into(), 2.into(), "A".into(), 3.into(), 4.into(), 5.into()])
);
```

There are several features packed into the snippet above!

Let's have a quick overview and we'll dive into the details:

1. named parameter: `{a}` injected
2. nested parameter access: `{b.b}` inner access
3. array expansion: `{..d}` expanded into three parameters

There are two more features that will be showcased later:

4. tuple expansion: `{values.0:2}`
5. repeating group: `{..(values.0),}`

## Motivation

While SeaQuery has long offered a way to build dynamic queries solving basically the same problem, not every one liked SeaQuery's code structure.

I recently came across this [SQLx issue](https://github.com/launchbadge/sqlx/issues/875), and was enticed to solve it.

I am heavily inspired by Rust's `format!` macro and other languages template literals for string interpolation, and figured it could probably be achieved in Rust as well!

## Challenges

First, the above cannot be implemented with standard `macro_rules` because of caller hygiene, such that expanded code cannot access the variables in the surrounding scope. But proc macros do not have this limitation.

Second, if we want to expand an array, the number of elements cannot be known until runtime. So a compile-time approach couldn't work.

Third, we have to support all of Rust's primitive and container types as well as third party data types.

## Dive in

Let's take a look at what the above code expands into!

```rust
let a = 1;
struct B {
    b: i32,
}
let b = B { b: 2 };
let c = "A";
let d = <[_]>::into_vec(#[rustc_box] ::alloc::boxed::Box::new([3, 4, 5]));

let query = {
    use sea_query::raw_sql::*;
    let mut builder = RawSqlQueryBuilder::new(sea_query::PostgresQueryBuilder);
    builder
        .push_fragment("SELECT (\"size_w\" + ")
        .push_parameters(1)
        .push_fragment(") * ")
        .push_parameters(1)
        .push_fragment(" FROM \"glyph\"\n        WHERE \"image\" LIKE ")
        .push_parameters(1)
        .push_fragment(" AND \"id\" IN (")
        .push_parameters((&d).len())
        .push_fragment(")");
    let sql = builder.finish();
    let mut query = seaql::query(&sql);
    query = query.bind(&a);
    query = query.bind(&b.b);
    query = query.bind(&c);
    for v in (&d).iter() {
        query = query.bind(v);
    }
    query
};
```

I created `RawSqlQueryBuilder` that is somewhat similar to SeaQuery's query building backend. It serializes the query string in a single pass.

The derive macro first tokenized and parsed the raw SQL to identify the splice points, and then call a special method `push_parameters` to push a variable number of parameters. This can be numbered, i.e. for Postgres.

After finishing the SQL building part, it then proceeds to bind the parameters. This mechanism is designed around SQLx's query API.

If the variable has a spread `..` operator, we'd loop over it and bind all items.

### Other ideas

Originally I wanted to implement auto-expansion, meaning if the parameter is a container type, we'd expand it automagically. But there are quite a few special cases - most importantly `Vec<u8>` is used as bytes and should be bound as a single parameter. Moreover, in Postgres you can use arrays directly, and so we can't decide whether to expand.

## More goodies

### Tuple expansion

There are two more features that'll make your life much easier.

```rust
let var = (1, "2".to_owned(), 3);

let query = sea_query::raw_query!(
    PostgresQueryBuilder,
    "SELECT {var.0}, {var.1}, {var.2}"
);

let new_query = sea_query::raw_query!(
    PostgresQueryBuilder,
    r#"SELECT {var.0:2}"#
);

assert_eq!(query, new_query);
```

We can already support accessing tuple members, why not offer a range operator?

The `:` token is chosen because it somewhat resembles the Python operator. `[0:2]` is un-natural because tuple members in Rust can only be accessed by `.0`. Feel free to offer your thoughts!

It's not possible to automatically expand a tuple like an array because its arity (the number of elements) is not known at the time the macro is expanded. If the tuple consists of elements with a uniform type, it can be made iterable like a vector by implementing the appropriate traits. However, that approach doesn't apply in the case above, where the tuple's structure is not uniform.

You can do inserts with this:

```rust
let values = (1, "2", 3);

let query = sea_query::raw_query!(
    MysqlQueryBuilder,
    "INSERT INTO `glyph` (`aspect`, `image`, `font_size`) VALUES ({values.0:2})"
);
assert_eq!(
    query.sql,
    "INSERT INTO `glyph` (`aspect`, `image`, `font_size`) VALUES (?, ?, ?)"
);
assert_eq!(query.values, Values(vec![1.into(), "2".into(), 3.into()]));
```

You may ask, then how do we insert multiple elements? Which brings us to the next feature:

## Repeating Group

```rust
let values = vec![(1, "2", 3), (4, "5", 6)];

let query = sea_query::raw_query!(
    PostgresQueryBuilder,
    r#"INSERT INTO "glyph" ("aspect", "image", "font_size")
       VALUES {..(values.0:2),}"#
);
assert_eq!(
    query.sql,
    r#"INSERT INTO "glyph" ("aspect", "image", "font_size")
       VALUES ($1, $2, $3), ($4, $5, $6)"#
);
```

This syntax almost looks like regex now. Please let me explain:

It's expanded upon the previous example, in which `values.0:2` means tuple expansion. We want to repeat this tuple as a group, surrounded by parenthesis, so we wrap it with `()`. Then we apply the same spread operator `..` to expand the vector of tuples. Finally, the trailing `,` means they should be connected with `,`.

This repeating group is not fully-generalized yet, but is quite flexible:

```rust
struct Item {
    a: i32,
    b: String,
    c: u16,
}

let values = vec![
    Item { a: 1, b: "2".to_owned(), c: 3 },
    Item { a: 4, b: "5".to_owned(), c: 6 },
];

let query = sea_query::raw_query!(
    PostgresQueryBuilder,
    r#"INSERT INTO "glyph" ("aspect", "image", "font_size")
       VALUES {..(values.a, values.b, values.c),}"#
);
```

This is equivalent to the previous example.

## SQLx Integration

SeaQuery offers tight SQLx integration. So in practice you can do:

```rust
let mut sql;
let res = sea_query::sqlx::sqlite::query!(
    sql = r#"INSERT INTO "character"
             ("uuid", "font_size", "character")
             VALUES {..(values.0:2),}"#
).execute(pool).await?;
```

Note the salient `sql` variable. SQLx's `Query` object can only borrow the SQL as `&str`, and so someone has to own the `String`. I couldn't think of a better API, suggestions welcome.

It calls the underlying [`Query`](https://docs.rs/sqlx/latest/sqlx/query/struct.Query.html)'s bind method directly, so no extra copy is involved. This is the lowest possible overhead!

One final example:

```rust
let mut character = Character { id: 1, font_size: 0 };
character.font_size = 18;

let res = sea_query::sqlx::sqlite::query!(
    sql = r#"UPDATE "character"
             SET "font_size" = {character.font_size}
             WHERE "id" = {character.id}"#
).execute(pool).await?;
```

Full example can be found [here](https://github.com/SeaQL/sea-query/blob/master/examples/sqlx_sqlite/src/main.rs).

It almost feels like a mini ORM ... although [SeaORM 🐚](https://github.com/SeaQL/sea-orm) is still highly recommended by us!

## SeaQuery 1.0

This is just one of many new features we've added while preparing SeaQuery 1.0. This is currently an `rc` release, if you have ideas please [join the discussion](https://github.com/SeaQL/sea-query/discussions/795).

## Sponsor

If you feel generous, a small donation will be greatly appreciated, and goes a long way towards sustaining the organization.

A big shout out to our [GitHub sponsors](https://github.com/sponsors/SeaQL) 😇:

<img src="/blog/img/github-sponsors-20250812.jpg#light" />
<img src="/blog/img/github-sponsors-20250812-dark.jpg#dark" />

#### Gold Sponsor

<a href="https://qdx.co/">
    <img src="https://www.sea-ql.org/static/sponsors/QDX.svg" width="128" />
</a>

[QDX](https://qdx.co/) pioneers quantum dynamics–powered drug discovery, leveraging AI and supercomputing to accelerate molecular modeling.
We're grateful to QDX for sponsoring the development of SeaORM, the SQL toolkit that powers their data engineering workflows.

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
