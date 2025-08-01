# Nested Selects

## Nested Models

`FromQueryResult` and `DerivePartialModel` macros allows you to nest objects easily, simplifying the construction of complex queries.

As a simple first example, we'd like to select `Cake` with `Bakery`:

```rust
#[derive(FromQueryResult)]
struct Cake {
    id: i32,
    name: String,
    #[sea_orm(nested)]
    bakery: Option<Bakery>,
}

#[derive(FromQueryResult)]
struct Bakery {
    #[sea_orm(from_alias = "bakery_id")]
    id: i32,
    #[sea_orm(from_alias = "bakery_name")]
    brand: String,
}

let cake: Cake = cake::Entity::find()
    .select_only()
    .column(cake::Column::Id)
    .column(cake::Column::Name)
    .column_as(bakery::Column::Id, "bakery_id")
    .column_as(bakery::Column::Name, "bakery_name")
    .left_join(bakery::Entity)
    .order_by_asc(cake::Column::Id)
    .into_model()
    .one(db)
    .await?
    .unwrap();

assert_eq!(
    cake,
    Cake {
        id: 1,
        name: "Basque cheesecake".to_string(),
        bakery: Some(Bakery {
            id: 20,
            brand: "Super Baker".to_string(),
        })
    }
);
```

Because the tables `cake` and `bakery` have some duplicate column names, we'd have to do custom selects. `select_only` here clears the default select list, and we apply aliases with [`column_as`](https://docs.rs/sea-orm/latest/sea_orm/query/trait.QuerySelect.html#method.column_as). Then, in `FromQueryResult` we use `from_alias` to map the query result back to the nested struct.

[`DerivePartialModel`](https://docs.rs/sea-orm/latest/sea_orm/derive.DerivePartialModel.html) allows you to omit the custom selects and aliases.
The previous example can be written as:
```rust
#[derive(DerivePartialModel)] // FromQueryResult is no longer needed
#[sea_orm(entity = "cake::Entity", from_query_result)]
struct Cake {
    id: i32,
    name: String,
    #[sea_orm(nested)]
    bakery: Option<Bakery>,
}

#[derive(DerivePartialModel)]
#[sea_orm(entity = "bakery::Entity", from_query_result)]
struct Bakery {
    id: i32,
    #[sea_orm(from_col = "Name")]
    brand: String,
}

// same as previous example, but without the custom selects
let cake: Cake = cake::Entity::find()
    .left_join(bakery::Entity)
    .order_by_asc(cake::Column::Id)
    .into_partial_model()
    .one(db)
    .await?
    .unwrap();
```

Under the hood, `bakery_` prefix will be added to the column alias in the SQL query.

```sql
SELECT
    "cake"."id" AS "id",
    "cake"."name" AS "name",
    "bakery"."id" AS "bakery_id",
    "bakery"."name" AS "bakery_brand"
FROM "cake"
LEFT JOIN "bakery" ON "cake"."bakery_id" = "bakery"."id"
ORDER BY "cake"."id" ASC LIMIT 1
```

### Join with alias

When the same table is joined more than once in the same query, it's necessary to use an alias. You can use the `alias` attribute to select columns from an alias.

```rust
#[derive(DerivePartialModel)]
#[sea_orm(entity = "cake::Entity", from_query_result)]
struct CakeFactory {
    id: i32,
    name: String,
    #[sea_orm(nested)]
    bakery: Option<Factory>,
}

#[derive(DerivePartialModel)]
#[sea_orm(entity = "bakery::Entity", alias = "factory", from_query_result)]
struct Factory {
    id: i32,
    #[sea_orm(from_col = "name")]
    plant: String,
}

let cake_factory: CakeFactory = cake::Entity::find()
    .join_as(
        JoinType::LeftJoin,
        cake::Relation::Bakery.def(),
        Alias::new("factory"),
    )
    .order_by_asc(cake::Column::Id)
    .into_partial_model()
    .one(db)
    .await?
    .unwrap();
```

Results in:

```sql
SELECT
    "cake"."id" AS "id",
    "cake"."name" AS "name",
    "factory"."id" AS "bakery_id",
    "factory"."name" AS "bakery_plant"
FROM "cake"
LEFT JOIN "bakery" AS "factory" ON "cake"."bakery_id" = "factory"."id"
ORDER BY "cake"."id" ASC LIMIT 1
```

## Three-way Join

Our join plan starts from Order:

```rust
Order -> Customer
      -> LineItem -> Cake
```

```rust
#[derive(Debug, DerivePartialModel, PartialEq)]
#[sea_orm(entity = "order::Entity", from_query_result)]
struct Order {
    id: i32,
    total: Decimal,
    #[sea_orm(nested)]
    customer: Customer,
    #[sea_orm(nested)]
    line: LineItem,
}

#[derive(Debug, DerivePartialModel, PartialEq)]
#[sea_orm(entity = "customer::Entity", from_query_result)]
struct Customer {
    name: String,
}

#[derive(Debug, DerivePartialModel, PartialEq)]
#[sea_orm(entity = "lineitem::Entity", from_query_result)]
struct LineItem {
    price: Decimal,
    quantity: i32,
    #[sea_orm(nested)]
    cake: Cake,
}

#[derive(Debug, DerivePartialModel, PartialEq)]
#[sea_orm(entity = "cake::Entity", from_query_result)]
struct Cake {
    name: String,
}

let items: Vec<Order> = order::Entity::find()
    .left_join(customer::Entity)
    .left_join(lineitem::Entity)
    .join(JoinType::LeftJoin, lineitem::Relation::Cake.def())
    .order_by_asc(order::Column::Id)
    .order_by_asc(lineitem::Column::Id)
    .into_partial_model()
    .all(db)
    .await?;

assert_eq!(
    items,
    [
        Order {
            id: 101,
            total: Decimal::from(10),
            customer: Customer {
                name: "Bob".to_owned()
            },
            line: LineItem {
                cake: Cake {
                    name: "Cheesecake".to_owned()
                },
                price: Decimal::from(2),
                quantity: 2,
            }
        },
        ..
    ]
);
```

Since Cake is a related Entity of LineItem, not Order, it does not satisfy the trait bound of `left_join`. It is thus necessary to use the more flexible `join` method.

### Alternative shape

In the above, we make the nested structure resembles the topology of the join plan.
But there is no restriction. Indeed, SQL flattens the select into a flat table, so as long as all columns can be found,
we can freely arrange the result data structure.

```rust
#[derive(Debug, DerivePartialModel, PartialEq)]
#[sea_orm(entity = "order::Entity", from_query_result)]
struct OrderItem {
    #[sea_orm(nested)]
    order: Order,
    #[sea_orm(nested)]
    customer: Customer,
    #[sea_orm(nested)]
    line: LineItem,
    #[sea_orm(nested)]
    cake: Cake,
}

#[derive(Debug, DerivePartialModel, PartialEq)]
#[sea_orm(entity = "order::Entity", from_query_result)]
struct Order {
    #[sea_orm(from_col = "id")]
    order_id: i32,
    total: Decimal,
}

#[derive(Debug, DerivePartialModel, PartialEq)]
#[sea_orm(entity = "customer::Entity", from_query_result)]
struct Customer {
    name: String,
}

#[derive(Debug, DerivePartialModel, PartialEq)]
#[sea_orm(entity = "lineitem::Entity", from_query_result)]
struct LineItem {
    price: Decimal,
    quantity: i32,
}

#[derive(Debug, DerivePartialModel, PartialEq)]
#[sea_orm(entity = "cake::Entity", from_query_result)]
struct Cake {
    name: String,
}

// the exact same select query

assert_eq!(
    items,
    [
        OrderItem {
            order: Order {
                order_id: 101,
                total: Decimal::from(10),
            },
            customer: Customer {
                name: "Bob".to_owned()
            },
            line: LineItem {
                price: Decimal::from(2),
                quantity: 2,
            },
            cake: Cake {
                name: "Cheesecake".to_owned()
            },
        },
        ..
    ]
);
```

## Three-Model select

```rust
Order -> Lineitem -> Cake
```

```rust
let items: Vec<(order::Model, Option<lineitem::Model>, Option<cake::Model>)> =
    order::Entity::find()
        .find_also_related(lineitem::Entity)
        .and_also_related(cake::Entity)
        .order_by_asc(order::Column::Id)
        .order_by_asc(lineitem::Column::Id)
        .all(db)
        .await?;
```

`find_also_related` is based on relations of the first entity.
`and_also_related` is based on relations of the second entity.

To do this instead, you can write:

```rust
Order -> Customer
      -> LineItem
```

```rust
order::Entity::find()
    .find_also_related(customer::Entity)
    .find_also_related(lineitem::Entity)
```