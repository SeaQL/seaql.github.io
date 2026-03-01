# 与 Diesel 对比

这是一个不可避免且富有争议的话题，SeaORM 与 Diesel 之间的技术差异已被广泛讨论。因此，我想指出我们刻意做出的一些不同设计选择，旨在让使用 SeaORM 的体验更愉快。

## 异步优先

SeaORM 从一开始就提供一流的异步支持。你不需要引入连接池依赖（如 `r2d2`）。我们为流行的 Web 框架提供了许多示例，它们是我们 CI 的一部分，因此永远不会出问题。

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

我们强烈推荐 [Loco.rs](https://loco.rs/)。如果你在寻找开箱即用的框架，它提供了最接近 Rust 版「Ruby on Rails」的体验。

（Diesel 提供的示例有限，对 Web 框架的一手支持也有限）

### 事务 API

基于闭包的 API 与 `begin()` / `commit()` 接口（即 `TransactionManager`）各有优劣。SeaORM 两者都支持，但 Diesel actively 不鼓励你使用 `begin()` / `commit()` API。

因此，当你需要时可以这样做：

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

## 数据库后端泛型

SeaORM 的 Entity API 是后端泛型门面，在编译时不需要数据库后端。（事实上，编译实体时甚至不需要异步执行环境）。这意味着你可以设计一个复杂的应用，在生产环境使用 Postgres，但大量测试针对 SQLite 编写。

事实上，[Zed Editor](https://zed.dev/) 的 [collab](https://github.com/zed-industries/zed/blob/main/crates/collab/README.md) API 服务器就是这样做的。

SeaORM 在合理的地方尝试提供跨数据库特性的抽象。初创公司可以构建数据库无关的产品。事实上，[RisingWave](https://docs.risingwave.com/get-started/architecture) 就是这样实现其数据存储以支持 Postgres、MySQL 和 SQLite 的。

Diesel 最近提供了一些编写多数据库泛型代码的能力，但你仍然需要自己处理跨数据库差异。但从根本上讲，在 SeaORM 中你只需编译一次：业务逻辑是一次编译的（即非 trait 基于），差异由后端的 `match` 语句处理。相比之下，Diesel 的代码必须为每个后端单独单态化。

## 基于 Entity 的关系模型

SeaORM 的关系建模在更高层次：我们将 M-N 关系视为原子单元，在许多场景下可以跳过中间表连接。

考虑我们的 readme 示例，

```rust
// SeaORM
let cake_with_filling: Vec<(cake::Model, Option<fruit::Model>)> =
    Cake::find().find_also_related(Filling).all(db).await?;
```

在 Diesel 中要做到这一点，需要两次 join：

```rust
// Diesel
let cake_with_filling: Vec<(Cake, Filling)> =
    cake::table
        .inner_join(cake_filling::table.inner_join(filling::table))
        .select((cake::all_columns, filling::all_columns))
        .load::<(Cake, Filling)>(conn)?;
```

以下仅在 SeaORM 中可能：

```rust
// SeaORM
let cake_with_fillings: Vec<(cake::Model, Vec<filling::Model>)> = Cake::find()
    .find_with_related(Filling) // two joins are performed
    .all(db) // rows are consolidated by left entity
    .await?;
```

## 反射

SeaORM 的模型和 ActiveModel 具有一些有用的反射能力。你可以在运行时动态获取/设置属性。

```rust
let mut fruit = fruit::Model { .. };
fruit.set("name".parse().unwrap(), "orange".into());
assert_eq!(fruit.name, "orange");
```

事实上，你可以轻松处理 JSON 输入：

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

（在 Diesel 中无法进行任何反射，事实上，你必须自己编写结构体。）

## 内置工具

例如，SeaORM 开箱即用提供基于偏移和基于游标的分页，所以你不需要自己编写。

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

（Diesel 不提供此类工具。）

## 可以 Entity 优先

Entity 包含数据库架构的所有必要信息，所以你只需查看一个地方，就可以使用它们来设置数据库架构。

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

（在 Diesel 中无法从 schema 描述反推回 DDL）

## 嵌套 select 及其他人体工程学

SeaORM 2.0 引入了许多 Diesel 中不可能实现的新特性。

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

SeaORM：
+ `#[derive(DerivePartialModel)]` 自动生成投影
+ `into_partial_model()` 仅选择需要的列
+ 连接可以从 entity 关系推断

Diesel：
+ 你必须显式选择列
+ 你必须显式将元组映射到你的结构体
+ 没有内置的「局部模型」derive

### 人体工程学的 raw SQL

当查询复杂到需要手写 SQL 时，带参数展开的 raw SQL 是救星！

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

## 编译时意识

为什么 Diesel 中复杂的 schema 编译如此缓慢？以下是高层解释：

+ Diesel 的 `table!` 宏生成大量代码：每表一个模块、每列一个结构体、用于 join 的 trait 等。这提供了类型安全的查询构建器，但也意味着在底层生成了数千种不同的类型
+ Diesel 将 SQL 查询编码到 Rust 类型中。这意味着你写的每个查询都会产生一个唯一的、深层嵌套的类型。类型推断和 trait 解析会变得非常重
+ 所有东西都必须在一个大 crate 中，所以 rustc 无法有效并行编译

最糟糕的是：[`allow_tables_to_appear_in_same_query` 具有 O(N^2) 复杂度](https://github.com/diesel-rs/diesel/issues/4333)
```rust
allow_tables_to_appear_in_same_query!(users, posts, comments);
```
展开为：
```rust
allow_tables_to_appear_in_same_query!(users, posts);
allow_tables_to_appear_in_same_query!(users, comments);
allow_tables_to_appear_in_same_query!(posts, comments);
```
如果你有 100 个实体，它会展开为 `100 C 2 = 4950`，即二项式展开。

SeaORM 设计为随复杂度良好扩展，并对增量编译友好。

+ SeaQuery，底层查询构建器，是一个独立的 crate。虽然这是必需依赖，但它非常轻量，不重度泛型，编译快速
+ SeaORM 为每个 entity 生成固定数量的结构体：`Entity`、`Model`、`ActiveModel`、`Column` 和 `PrimaryKey`。无论列数多少，`Column` 都是单个枚举
+ SeaORM 随 schema 复杂度线性扩展：与实体数量及其关系成正比
+ 如上所述，SeaORM 的 Entity 可以在纯 crate 中编译。如果你有非常复杂的 schema，可以简单地将它们拆分成多个 crate

## 社区采用

SeaORM 团队痴迷于改进文档、示例和生态系统集成。

我们很高兴看到公司和初创公司使用 SeaORM 构建的真实应用。以下按字母顺序排列：

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

事实上，SeaORM 在 [crates.io](https://crates.io/crates/sea-orm) 上有 25 万周下载量，其中大部分发生在工作日，表明 SeaORM 在专业场景中被大量使用。这一指标暗示 SeaORM 的用户活跃度可能高于 Diesel（请对此说法持保留态度）。
