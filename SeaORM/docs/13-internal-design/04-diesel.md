# Compare with Diesel

This is an inevitable and controversial topic, and the technical difference between SeaORM and Diesel is already widely discussed. So I'd like to point out a few design choices we made different deliberately that's intended to make working with SeaORM a nicer experience.

## Async first

SeaORM started out to offer first-class async support. You don't need to bring in a connection pool dependency (e.g. `r2d2`). We offer many examples for popular web frameworks, they are part of our CI so they never breaks.

+ [Actix Example](https://github.com/SeaQL/sea-orm/tree/master/examples/actix_example)
+ [Axum Example](https://github.com/SeaQL/sea-orm/tree/master/examples/axum_example)
+ [GraphQL Example](https://github.com/SeaQL/sea-orm/tree/master/examples/graphql_example)
+ [jsonrpsee Example](https://github.com/SeaQL/sea-orm/tree/master/examples/jsonrpsee_example)
+ [Loco TODO Example](https://github.com/SeaQL/sea-orm/tree/master/examples/loco_example) / [Loco REST Starter](https://github.com/SeaQL/sea-orm/tree/master/examples/loco_starter)
+ [Poem Example](https://github.com/SeaQL/sea-orm/tree/master/examples/poem_example)
+ [Rocket Example](https://github.com/SeaQL/sea-orm/tree/master/examples/rocket_example) / [Rocket OpenAPI Example](https://github.com/SeaQL/sea-orm/tree/master/examples/rocket_okapi_example)
+ [Salvo Example](https://github.com/SeaQL/sea-orm/tree/master/examples/salvo_example)
+ [Tonic Example](https://github.com/SeaQL/sea-orm/tree/master/examples/tonic_example)
+ [Seaography Example (Bakery)](https://github.com/SeaQL/sea-orm/tree/master/examples/seaography_example) / [Seaography Example (Sakila)](https://github.com/SeaQL/seaography/tree/main/examples/sqlite)

We highly recommend [Loco.rs](https://loco.rs/). If you're looking for a batteries-included framework, this offers an experience closest to "Ruby on Rails" in Rust.

(Diesel offers limited examples and first-party support to web frameworks)

### Transaction API

There are pros and cons with closure-based API or `begin()` / `commit()` interface (Aka `TransactionManager`). SeaORM supports both, but Diesel actively discourages you from using `begin()` / `commit()` API.

So you can do this when you need it:

```rust
let txn = db.begin().await?;

{
    let txn = txn.begin().await?;

    {
        let txn = txn.begin().await?;
        // this will not be committed
    }

    // commit nested transaction
    txn.commit().await?;
}

txn.commit().await?;
```

## Database Backend Generic

SeaORM's Entity API is a backend generic facade, it doesn't require a database backend at compile time. (In fact it doesn't even require an async runtime to compile the entities). That means you can design a complex application that uses Postgres in production but have lots of tests written against SQLite.

In fact, this is what [Zed Editor](https://zed.dev/) did with their [collab](https://github.com/zed-industries/zed/blob/main/crates/collab/README.md) API server.

SeaORM tries to offer abstraction across database features where sensible. Startups can build their products to be database generic. In fact, this how [RisingWave](https://docs.risingwave.com/get-started/architecture) implement their data store to support Postgres, MySQL, and SQLite.

Diesel offers some capabilities to write code generic to multiple databases *lately*, but you'd still have to manage cross-database differences yourself. But fundamentally, in SeaORM you only compile once: business logic is compiled-once (i.e. not trait based), and the differences are handled with `match` statements in the backend. Compared to Diesel, where code has to be monomorphized once for each backend.

## Entity-based Relational Model

SeaORM's relational modelling is on a higher level: we consider M-N relation as an atomic unit and can skip the junction table join in many scenarios.

Consider our readme example,

```rust
// SeaORM
let cake_with_filling: Vec<(cake::Model, Option<fruit::Model>)> =
    Cake::find().find_also_related(Filling).all(db).await?;
```

To do this in Diesel, you'd need two joins:

```rust
// Diesel
let cake_with_filling: Vec<(Cake, Filling)> =
    cake::table
        .inner_join(cake_filling::table.inner_join(filling::table))
        .select((cake::all_columns, filling::all_columns))
        .load::<(Cake, Filling)>(conn)?;
```

The following is only possible in SeaORM:

```rust
// SeaORM
let cake_with_fillings: Vec<(cake::Model, Vec<filling::Model>)> = Cake::find()
    .find_with_related(Filling) // two joins are performed
    .all(db) // rows are consolidated by left entity
    .await?;
```

## Reflection

SeaORM Model and ActiveModel have some useful reflection capabilities. You can get / set attributes dynamically on runtime.

```rust
let mut fruit = fruit::Model { .. };
fruit.set("name".parse().unwrap(), "orange".into());
assert_eq!(fruit.name, "orange");
```

In fact, you can work easily with JSON inputs:

```rust
let fruit = fruit::ActiveModel::from_json(json!({
    "name": "Apple",
}))?;

assert_eq!(
    fruit,
    fruit::ActiveModel {
        id: ActiveValue::NotSet,
        name: ActiveValue::Set("Apple".to_owned()),
        cake_id: ActiveValue::NotSet,
    }
);
```

(You can't do any reflection in Diesel, in fact, you have to write the struct yourself.)

## Utilities included

For example, SeaORM offers offset based and cursor based pagination out of the box, so you don't have to write your own.

```rust
let paginator = Post::find()
    .order_by_asc(post::Column::Id)
    .paginate(db, posts_per_page);
let num_pages = paginator.num_pages().await?;
let posts: Vec<post::Model> = paginator.fetch_page(current_page).await?;
```

```rust
let mut cursor = post::Entity::find().cursor_by(post::Column::Id);

// Filter paginated result by "post"."id" > 1 AND "post"."id" < 100
cursor.after(1).before(100);

// Get first 10 rows (order by "post"."id" ASC)
let posts: Vec<post::Model> = cursor.first(10).all(db).await?
```

(Diesel doesn't provide such utilities.)

## You can go Entity first

An Entity contains all the essential information about the database schema, so you only have one place to look at, and can use them to setup database schema.

```rust
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "lineitem")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    #[sea_orm(unique_key = "item")]
    pub order_id: i32,
    #[sea_orm(unique_key = "item")]
    pub cake_id: i32,
}

let stmts = Schema::new(backend).create_index_from_entity(lineitem::Entity);

assert_eq!(
    backend.build(stmts[0]),
    r#"CREATE UNIQUE INDEX "idx-lineitem-item" ON "lineitem" ("order_id", "cake_id")"#
);
```

(In Diesel it's not possible to go back from schema description to DDL)

## Nested select and other ergonomics

SeaORM 2.0 introduced many new features that's not possible in Diesel.

```rust
use sea_orm::DerivePartialModel;

#[derive(DerivePartialModel)]
#[sea_orm(entity = "cake::Entity")]
struct CakeWithFruit {
    id: i32,
    name: String,
    #[sea_orm(nested)]
    fruit: Option<fruit::Model>,
}

let cakes: Vec<CakeWithFruit> = Cake::find()
    .left_join(fruit::Entity) // no need to specify join condition
    .into_partial_model() // only the columns in the partial model will be selected
    .all(db)
    .await?;
```

SeaORM:
+ `#[derive(DerivePartialModel)]` auto‑generates the projection
+ `into_partial_model()` selects only the needed columns
+ Joins can be inferred from entity relations

Diesel:
+ You must explicitly select the columns
+ You must explicitly map the tuple into your struct
+ No built‑in "partial model" derive

### Ergononmic raw SQL

Raw SQL with parameter expansion is a life-saver when a query is complex enough to require writing it in SQL!

```rust
let item = Item { id: 2 }; // nested parameter access

let cake_ids = [2, 3, 4]; // expanded by the `..` operator

// can use nested select with raw SQL
let cake: Option<CakeWithBakery> = CakeWithBakery::find_by_statement(raw_sql!(
    Sqlite,
    r#"SELECT "cake"."name", "bakery"."name" AS "bakery_name"
       FROM "cake"
       LEFT JOIN "bakery" ON "cake"."bakery_id" = "bakery"."id"
       WHERE "cake"."id" = {item.id} OR "cake"."id" IN ({..cake_ids})"#
))
.one(db)
.await?;
```

## Compile-time consciousness

Why complex schema compiles so slowly in Diesel? Here's a high-level explanation:

+ Diesel's `table!` macro generates a lot of code: one module per table, one struct per column, traits for joins, etc. This gives you the type‑safe query builder, but it means thousands of distinct types are generated under the hood
+ Diesel encodes SQL queries into Rust types. That means every query you write produces a unique, deeply nested type. Type inference and trait resolution can get very heavy
+ Everything has to be in one big crate, so rustc can't parallelize compilation effectively

The worst part: [`allow_tables_to_appear_in_same_query` has O(N^2) complexity](https://github.com/diesel-rs/diesel/issues/4333)
```rust
allow_tables_to_appear_in_same_query!(users, posts, comments);
```
Expands to:
```rust
allow_tables_to_appear_in_same_query!(users, posts);
allow_tables_to_appear_in_same_query!(users, comments);
allow_tables_to_appear_in_same_query!(posts, comments);
```
If you have 100 entities, it expands to `100 C 2 = 4950` which is a binomial expansion.

SeaORM is designed to scale well with complexity and be friendly with incremental compilation.

+ SeaQuery, the underlying query builder, is a separate crate. While this is a mandatory dependency, it's very lightweight, not generics-heavy and quick to compile
+ SeaORM generates a fixed number of structs per entity: `Entity`, `Model`, `ActiveModel`, `Column` and `PrimaryKey`. `Column` is a single enum regardless of number of columns
+ SeaORM scales linearly with schema complexity: it is proprotional to the number of entities and relations among them
+ As mentioned above, SeaORM Entities can be compiled in pure crates. In case you've got a really complex schema, you can simply break them down into multiple crates

## Community Adoption

The SeaORM team is obsessed on improving documentation, examples and ecosystem integration.

We are excited to see real-world applications built by companies and startups using SeaORM. Here's a few, ordered alphabetically:

<a href = "https://caido.io/"><img style={{width:200}} src="https://www.sea-ql.org/SeaORM/img/other/caido-logo.png"/></a>&nbsp;&nbsp;&nbsp;&nbsp;
<a href = "https://lap.dev/"><img style={{width:200}} src="https://www.sea-ql.org/SeaORM/img/other/lapdev-logo.png"/></a>&nbsp;&nbsp;&nbsp;&nbsp;
<a href = "https://mydatamyconsent.com/"><img style={{width:250}} src="https://www.sea-ql.org/SeaORM/img/other/mydatamyconsent-logo.png"/></a>&nbsp;&nbsp;&nbsp;&nbsp;
<a href = "https://openobserve.ai/"><img style={{width:200}} src="https://www.sea-ql.org/SeaORM/img/other/openobserve-logo.svg"/></a>&nbsp;&nbsp;&nbsp;&nbsp;
<a href = "https://prefix.dev/"><img style={{width:200}} src="https://www.sea-ql.org/SeaORM/img/other/prefixdev-logo.png"/></a>&nbsp;&nbsp;&nbsp;&nbsp;
<a href = "https://qdx.co/"><img style={{width:80}} src="https://www.sea-ql.org/static/sponsors/QDX.svg"/></a>&nbsp;&nbsp;&nbsp;&nbsp;
<a href = "https://risingwave.com/"><img style={{width:220}} src="https://www.sea-ql.org/SeaORM/img/other/risingwave-logo.svg"/></a>&nbsp;&nbsp;&nbsp;&nbsp;
<a href = "https://www.svix.com/"><img style={{width:180}} src="https://www.sea-ql.org/SeaORM/img/other/svix-logo.svg"/></a>&nbsp;&nbsp;&nbsp;&nbsp;
<a href = "https://www.systeminit.com/"><img style={{width:200}} src="https://www.sea-ql.org/SeaORM/img/other/systeminit-logo.png"/></a>&nbsp;&nbsp;&nbsp;&nbsp;
<a href = "https://upvpn.app/"><img style={{width:200}} src="https://www.sea-ql.org/SeaORM/img/other/upvpn-logo.png"/></a>&nbsp;&nbsp;&nbsp;&nbsp;
<a href = "https://zed.dev/"><img style={{width:200}} src="https://www.sea-ql.org/SeaORM/img/other/zed-logo.png"/></a>&nbsp;&nbsp;&nbsp;&nbsp;

In fact, SeaORM has 250k weekly downloads on [crates.io](https://crates.io/crates/sea-orm), most of them happening on weekdays, suggesting that SeaORM is used heavily in professional contexts. This one metric hints that SeaORM has more user activity than Diesel (please take this claim with a grain of salt).