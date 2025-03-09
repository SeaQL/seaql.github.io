---
slug: 2025-01-08-sea-orm-inheritance
title: "Tutorial: Modeling Inheritance in SeaORM"
author: SeaQL Team
author_title: Chris Tsang
author_url: https://github.com/SeaQL
author_image_url: https://www.sea-ql.org/blog/img/SeaQL.png
image: https://www.sea-ql.org/blog/img/SeaORM%201.0%20Banner.png
tags: [news]
---

## Introduction

This tutorial walks you through the design and implementation of a REST API endpoint that involves some complex relational queries.

The API looks like this:

`POST` `/api/v1/complex-products`

Parameters (JSON body):

| Field | Type | Description |
|-----|-----|-----|
| `id` | `int[]` | Get products with these ids |
| `name` | `string` | Search products with name matching this |
| `type` | `enum` of `ProductType` | Limit products to this type |

Return example:

```json
{
    "id": 1,
    "name": "Mountain Bike V2",
    "type": "Bike",
    "price": "2500.0",
    "lot_size": "1.0",
    "date_added": "2020-01-01T00:00:00",
    "last_modified": "2025-01-02T12:18:54",
    "history": [
        {
            "from": "2020-01-01T00:00:00",
            "until": "2022-01-01T00:00:00",
            "name": "Mountain Bike V1"
        }
    ]
}
```

## Schema

Imagine we run a store with many types of products. Each product type has its own attributes and we want to factor out the common product attributes to a base class.

In OOP terms:

```rust
struct BaseProduct {
    r#type: ProductType,
    ..
}

// made up syntax, but it means inheritance
struct ComplexProduct: BaseProduct { .. }

enum ProductType { .. }
```

In SQL terms, we have 3 entities and 2 relations among them:

+ `BaseProduct` -> `ComplexProduct`
+ `BaseProduct` -> `ProductType`

Below are the SeaORM Entities:

#### `BaseProduct`

```rust
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq)]
#[sea_orm(table_name = "base_product")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i64,
    #[sea_orm(unique)]
    pub name: String,
    pub type_id: i32, // linking to product_type
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_one = "super::complex_product::Entity")]
    ComplexProduct,
    #[sea_orm(has_many = "super::product_history::Entity")]
    ProductHistory,
    #[sea_orm(
        belongs_to = "super::product_type::Entity",
        from = "Column::TypeId",
        to = "super::product_type::Column::Id",
        on_update = "NoAction",
        on_delete = "NoAction"
    )]
    ProductType,
}
```

#### `ComplexProduct`

```rust
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq)]
#[sea_orm(table_name = "complex_product")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub product_id: i64, // linking to base_product
    #[sea_orm(column_type = "Decimal(Some((30, 15)))", nullable)]
    pub price: Option<Decimal>,
    #[sea_orm(column_type = "Decimal(Some((30, 15)))", nullable)]
    pub lot_size: Option<Decimal>,
    pub date_added: DateTime,
    pub last_modified: DateTime,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::base_product::Entity",
        from = "Column::ProductId",
        to = "super::base_product::Column::Id",
        on_update = "NoAction",
        on_delete = "Cascade"
    )]
    BaseProduct,
}
```

#### `ProductType`

Basically an 'enum table'.

```rust
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq)]
#[sea_orm(table_name = "product_type")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    #[sea_orm(unique)]
    pub name: String,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_many = "super::base_product::Entity")]
    BaseProduct,
}
```

## 1. Define result data structure

```rust
#[derive(Clone, Debug, PartialEq, Eq, FromQueryResult, Serialize)]
pub struct ComplexProduct {
    pub id: i64,
    pub name: String,
    pub r#type: String,
    pub price: Decimal,
    pub lot_size: Decimal,
    pub date_added: DateTime,
    pub last_modified: DateTime,
    #[sea_orm(skip)]
    pub history: Vec<product_history::Model>,
}
```

With `Serialize`, you can transform the select result into JSON directly.

## 2. Define helper aliases

```rust
#[derive(DeriveIden, Clone, Copy)]
pub struct Id;

#[derive(DeriveIden, Clone, Copy)]
pub struct Name;

#[derive(DeriveIden, Clone, Copy)]
pub struct Base;

use complex_product::Entity as Prod;
pub type ProdCol = <Prod as EntityTrait>::Column;
type ProdRel = <Prod as EntityTrait>::Relation;
```

This would make our code much more concise and readable.

Avoid using `Alias::new` because it's error-prone and slightly more expensive.

## 3. Custom selects

```rust
fn query() -> Select<complex_product::Entity> {
    complex_product::Entity::find()
        .select_only()
        .tbl_col_as((Base, Id), "id")
        .tbl_col_as((Base, Name), "name")
        .column_as(product_type::Column::Name, "type")
        .column_as(ProdCol::Price, "price")
        .column_as(ProdCol::LotSize, "lot_size")
        .column_as(ProdCol::DateAdded, "date_added")
        .column_as(ProdCol::LastModified, "last_modified")
        .join_as(JoinType::InnerJoin, ProdRel::BaseProduct.def(), Base)
        .join(JoinType::InnerJoin, base_product::Relation::ProductType.def().from_alias(Base))
        .order_by_asc(Expr::col((Base, Id)))
}
```

Our query starts from `ComplexProduct`. We join back to `BaseProduct`, alias it as `Base`. We then join to `ProductType` via `Base`:

```
ComplexProduct -> BaseProduct as Base -> ProductType
```

[`column_as`](https://docs.rs/sea-orm/latest/sea_orm/query/trait.QuerySelect.html#method.column_as) automatically prefix the column with the table name.
[`from_alias`](https://docs.rs/sea-orm/latest/sea_orm/entity/struct.RelationDef.html#method.from_alias) is doing the magic here, allowing us to reuse the existing Relation by overwriting the left hand side of the on condition.

You can use the [`join`](https://docs.rs/sea-orm/latest/sea_orm/query/trait.QuerySelect.html#method.join) method to construct complex joins in select queries. It takes any [`RelationDef`](https://docs.rs/sea-orm/latest/sea_orm/entity/struct.RelationDef.html), and you can further customize the join conditions. You can find more examples [here](https://www.sea-ql.org/SeaORM/docs/advanced-query/advanced-joins/#custom-join-conditions).

## 4. Filter Conditions

Let's define struct for query parameters. Again, using serde here so it can be deserialized from JSON.

```rust
#[derive(Default, Deserialize)]
pub struct Query {
    #[serde(default)]
    pub id: Vec<i64>, // if unspecified, will be an empty vec
    pub name: Option<String>,
    pub r#type: Option<String>,
}
```

Then, we transform the parameters into SQL where conditions:

```rust
fn condition(query: Query) -> Condition {
    Condition::all()
        .add_option(if !query.id.is_empty() {
            Some(Expr::col((Base, Id)).is_in(query.id))
        } else { None })
        .add_option(if let Some(name) = &query.name {
            Some(Expr::col((Base, Name)).like(name))
        } else { None })
        .add_option(if let Some(r#type) = &query.r#type {
            Some(product_type::Column::Name.eq(r#type))
        } else { None })
}
```

Bonus tip: if you're only using Postgres you can replace `is_in` with `any`:

```rust
use sea_orm::sea_query::extension::postgres::PgFunc;

Expr::col((Base, Id)).eq(PgFunc::any(query.id)) // WHERE base.id = ANY($N)
```

Combining the above functions, here is how we implement the API endpoint:

```rust
pub async fn query_products(db: DbConn, q: Query)
    -> Result<Vec<ComplexProduct>, DbErr>
{
    query()
        .filter(condition(q))
        .into_model::<ComplexProduct>()
        .all(&db)
        .await
}
```

## 5. Associated models

Suppose we have a data structure associated with each `BaseProduct` recording its history.

#### `ProductHistory`

```rust
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize)]
#[sea_orm(table_name = "product_history")]
pub struct Model {
    #[sea_orm(primary_key)]
    #[serde(skip)]
    pub id: i32,
    #[serde(skip)]
    pub product_id: i64,
    pub from: DateTime,
    pub until: DateTime,
    pub name: Option<String>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::base_product::Entity",
        from = "Column::ProductId",
        to = "super::base_product::Column::Id",
        on_update = "NoAction",
        on_delete = "Cascade"
    )]
    BaseProduct,
}
```

Let's make a helper function to query the histories associated to a set of products:

```rust
fn history_of(ids: Vec<i64>) -> Select<product_history::Entity> {
    product_history::Entity::find()
        .filter(Expr::col(product_history::Column::ProductId).is_in(ids))
        .order_by_asc(product_history::Column::Id)
}

let histories = history_of(products.iter().map(|s| s.id).collect::<Vec<_>>())
    .all(&db)
    .await?;
```

The final step is to associate `product_history::Model` to `ComplexProduct`:

```rust
// parent should be unique and already ordered by id.
fn associate(
    mut parent: Vec<ComplexProduct>,
    children: Vec<product_history::Model>,
) -> Vec<ComplexProduct> {
    let len = parent.len();
    parent.dedup_by_key(|s| s.id);
    if len != parent.len() {
        warn!("parent is not unique.");
    }

    let parent_id_map: HashMap<i64, usize> = parent
        .iter()
        .enumerate()
        .map(|(i, s)| (s.id, i))
        .collect();

    // put children into associated parent
    for item in children {
        if let Some(index) = parent_id_map.get(&item.product_id) {
            parent[*index].history.push(item);
        }
    }

    parent
}

let products = associate(products, histories);
```

This is sometimes called "data loader" pattern, and can be generalized with generics to work with any models.

## Conclusion

SeaORM's type system encourages you to write modular and reusable code, embracing the "Don't repeat yourself" principle.

You define the Entities and Relations once.

You define the aliases and query helpers once.

You can pass the [`Select<T>`](https://docs.rs/sea-orm/latest/sea_orm/query/struct.Select.html) and [`Condition`](https://docs.rs/sea-orm/latest/sea_orm/query/struct.Condition.html) around.

You then assemble these pieces together to implement any complex API!

## Introducing SeaORM Pro

[SeaORM Pro](https://www.sea-ql.org/sea-orm-pro/) is an admin panel solution allowing you to quickly and easily launch an admin panel for your application - frontend development skills not required, but certainly nice to have!

Features:
* Full CRUD
* Built on React + GraphQL
* Built in GraphQL resolver
* Customize the UI with simple TOML

<a href="https://www.sea-ql.org/sea-orm-pro/">
    <img style={{borderRadius: "25px"}} src="https://www.sea-ql.org/sea-orm-pro/img/01_banner.png#light" />
    <img style={{borderRadius: "25px"}} src="https://www.sea-ql.org/sea-orm-pro/img/01_banner_dark.png#dark" />
</a>
