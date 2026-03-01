# 多表查询

在上一章中，我们使用 局部模型来一起查询多个 Entity。我们也可以使用 multi-select API 实现相同的效果。

## 查询三个模型

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

`find_also_related` 基于第一个 Entity 的关系。
`and_also_related` 基于第二个 Entity 的关系。

要使用不同的 join 拓扑，可以这样写：

```rust
Order -> Customer
      -> LineItem
```

```rust
order::Entity::find()
    .find_also_related(customer::Entity)
    .find_also_related(lineitem::Entity)
```

### 整合结果

你可以在三个模型选择上合并查询结果。输出形状取决于 join 的拓扑结构。

:::tip 自 `2.0.0` 起
:::

#### 链式

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

它可以包含两个一对多关系。例如，

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

#### 星型

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

## 查询最多六个模型

:::tip 自 `2.0.0` 起
:::

```rust
// join paths:
// one -> two -> three -> four -> five
// one -> six
let (one, two, three, four, five, six) = one::Entity::find()
    //         from entity -> to entity
    .find_also(one::Entity,   two::Entity)   // same as .find_also_related(two::Entity)
    .find_also(two::Entity,   three::Entity) // same as .and_also_related(three::Entity)
    .find_also(three::Entity, four::Entity)
    .find_also(four::Entity,  five::Entity)
    .find_also(one::Entity,   six::Entity)
    .one(db)
    .await?
    .unwrap();
```
