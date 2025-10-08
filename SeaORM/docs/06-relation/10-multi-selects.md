## Multi Selects

In the previous chapter, we used partial models for querying multiple entities together. We can achieve the same using the multi-select API.

### Select Three Models

```rust
Order -> LineItem -> Cake
```

```rust
let items: Vec<(order::Model, Option<lineitem::Model>, Option<cake::Model>)> =
    order::Entity::find()
        .find_also_related(lineitem::Entity)
        .and_also_related(cake::Entity)
        .all(db)
        .await?;
```

`find_also_related` is based on relations of the first entity.
`and_also_related` is based on relations of the second entity.

To have a different join topology, you can write:

```rust
Order -> Customer
      -> LineItem
```

```rust
order::Entity::find()
    .find_also_related(customer::Entity)
    .find_also_related(lineitem::Entity)
```

### Consolidate results

You can consolidate query results on three model selects. The output has different shape depending on the topology of the join.

:::tip Since `2.0.0`
:::

#### Chain

```rust
Order -> LineItem -> Cake
```

```rust
let items: Vec<(order::Model, Option<lineitem::Model>, Option<cake::Model>)> =
    order::Entity::find()
        .find_also_related(lineitem::Entity)
        .and_also_related(cake::Entity)
        .order_by_asc(order::Column::Id)
        .order_by_asc(lineitem::Column::Id)
        .all(&ctx.db)
        .await?;

// flat result
assert_eq!(
    items,
    vec![
        (order, Some(line_1), Some(cake_1)),
        (order, Some(line_2), Some(cake_2)),
    ]
);

let items: Vec<(order::Model, Vec<(lineitem::Model, Vec<cake::Model>)>)> =
    order::Entity::find()
        .find_also_related(lineitem::Entity)
        .and_also_related(cake::Entity)
        .order_by_asc(order::Column::Id)
        .order_by_asc(lineitem::Column::Id)
        .consolidate() // <-
        .all(&ctx.db)
        .await?;

// consolidated by order first, then by line
assert_eq!(
    items,
    vec![(
        order,
        vec![(line_1, vec![cake_1]), (line_2, vec![cake_2])]
    )]
);
```

It can comprise two one-to-many relations. For example,

```rust
vec![
    (bakery, Some(baker_1), Some(cake_1)),
    (bakery, Some(baker_1), Some(cake_2)),
    (bakery, Some(baker_2), Some(cake_3)),
]
// would be consolidated into:
vec![(
    bakery,
    vec![
        (baker_1, vec![cake_1, cake_2]),
        (baker_2, vec![cake_3]),
    ]
)]
```

#### Star

```rust
Order -> Customer
      -> LineItem
```

```rust
let items: Vec<(order::Model, Option<customer::Model>, Option<lineitem::Model>)> =
    order::Entity::find()
        .find_also_related(customer::Entity)
        .find_also_related(lineitem::Entity)
        .order_by_asc(order::Column::Id)
        .order_by_asc(lineitem::Column::Id)
        .all(&ctx.db)
        .await?;

// flat result
assert_eq!(
    items,
    vec![
        (order, Some(customer), Some(line_1)),
        (order, Some(customer), Some(line_2)),
    ]
);

let items: Vec<(order::Model, Vec<customer::Model>, Vec<lineitem::Model>)> =
    order::Entity::find()
        .find_also_related(customer::Entity)
        .find_also_related(lineitem::Entity)
        .order_by_asc(order::Column::Id)
        .order_by_asc(lineitem::Column::Id)
        .consolidate() // <-
        .all(&ctx.db)
        .await?;

// consolidated by order
assert_eq!(
    items,
    vec![(
        order,
        vec![customer],
        vec![line_1, line_2]
    )]
);
```
