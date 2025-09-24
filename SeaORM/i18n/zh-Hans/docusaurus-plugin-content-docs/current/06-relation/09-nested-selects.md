# 嵌套查询

`FromQueryResult` 和 `DerivePartialModel` 宏允许你轻松地嵌套对象，从而简化复杂查询的构建。

## 嵌套 FromQueryResult

作为一个简单的第一个例子，我们想选择带有 `Bakery` 的 `Cake`：

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
    #[sea_orm(alias = "bakery_id")]
    id: i32,
    #[sea_orm(alias = "bakery_name")]
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

因为 `cake` 和 `bakery` 表有一些重复的列名，我们必须进行自定义选择。这里的 `select_only` 清除了默认的选择列表，我们使用 [`column_as`](https://docs.rs/sea-orm/latest/sea_orm/query/trait.QuerySelect.html#method.column_as) 应用别名。然后，在 `FromQueryResult` 中，我们使用 `alias` 将查询结果映射回嵌套结构。

## 嵌套模型

[`DerivePartialModel`](https://docs.rs/sea-orm/latest/sea_orm/derive.DerivePartialModel.html) 允许你省略自定义选择和别名。前面的例子可以写成：
```rust
#[derive(DerivePartialModel)]
#[sea_orm(entity = "cake::Entity")]
struct Cake {
    id: i32,
    name: String,
    #[sea_orm(nested)]
    bakery: Option<Bakery>,
}

#[derive(DerivePartialModel)]
#[sea_orm(entity = "bakery::Entity")]
struct Bakery {
    id: i32,
    #[sea_orm(from_col = "Name")]
    brand: String,
}

// 与前面的例子相同，但没有自定义选择
let cake: Cake = cake::Entity::find()
    .left_join(bakery::Entity)
    .order_by_asc(cake::Column::Id)
    .into_partial_model()
    .one(db)
    .await?
    .unwrap();
```

在底层，`bakery_` 前缀将被添加到 SQL 查询中的列别名。

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

### 常规模型可以嵌套！

:::tip 自 `2.0.0` 版本起
:::

所以前面的例子也可以是：

```rust
#[derive(DerivePartialModel)]
#[sea_orm(entity = "cake::Entity")]
struct Cake {
    id: i32,
    name: String,
    #[sea_orm(nested)]
    bakery: Option<bakery::Model>, // <- 一个常规的完整模型
}
```

其中选择了嵌套模型的所有列。

### 带别名的连接

当同一个表在同一个查询中多次连接时，需要使用别名。你可以使用 `alias` 属性从别名中选择列。

```rust
#[derive(DerivePartialModel)]
#[sea_orm(entity = "cake::Entity")]
struct CakeFactory {
    id: i32,
    name: String,
    #[sea_orm(nested, alias = "factory")]
    bakery: Option<Factory>,
}

#[derive(DerivePartialModel)]
#[sea_orm(entity = "bakery::Entity")]
struct Factory {
    id: i32,
    #[sea_orm(from_col = "name")]
    plant: String,
}

let cake_factory: CakeFactory = cake::Entity::find()
    .join_as(
        JoinType::LeftJoin,
        cake::Relation::Bakery.def(),
        "factory",
    )
    .order_by_asc(cake::Column::Id)
    .into_partial_model()
    .one(db)
    .await?
    .unwrap();
```

结果是：

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

:::tip

你可以通过两个关系将同一个实体连接两次，并在同一个查询中为它们设置不同的别名。

```rust
#[derive(DerivePartialModel)]
#[sea_orm(entity = "bakery::Entity")]
struct Bakery {
    name: String,
    #[sea_orm(nested, alias = "manager")]
    manager: Worker,
    #[sea_orm(nested, alias = "cashier")]
    cashier: Worker,
}

let bakery: Bakery = bakery::Entity::find()
    .join_as(
        sea_orm::JoinType::LeftJoin,
        bakery::Relation::Manager.def(),
        "manager",
    )
    .join_as(
        sea_orm::JoinType::LeftJoin,
        bakery::Relation::Cashier.def(),
        "cashier",
    )
    ..
```

:::

## 三向连接

我们的连接计划从 Order 开始：

```rust
Order -> Customer
      -> LineItem -> Cake
```

```rust
#[derive(Debug, DerivePartialModel, PartialEq)]
#[sea_orm(entity = "order::Entity")]
struct Order {
    id: i32,
    total: Decimal,
    #[sea_orm(nested)]
    customer: Customer,
    #[sea_orm(nested)]
    line: LineItem,
}

#[derive(Debug, DerivePartialModel, PartialEq)]
#[sea_orm(entity = "customer::Entity")]
struct Customer {
    name: String,
}

#[derive(Debug, DerivePartialModel, PartialEq)]
#[sea_orm(entity = "lineitem::Entity")]
struct LineItem {
    price: Decimal,
    quantity: i32,
    #[sea_orm(nested)]
    cake: Cake,
}

#[derive(Debug, DerivePartialModel, PartialEq)]
#[sea_orm(entity = "cake::Entity")]
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

由于 Cake 是 LineItem 的相关实体，而不是 Order 的相关实体，因此它不满足 `left_join` 的 trait 约束。因此，有必要使用更灵活的 `join` 方法。

### 替代结构

在上面，我们使嵌套结构类似于连接计划的拓扑。但没有限制。实际上，SQL 将选择展平为一个平面表，因此只要能找到所有列，我们就可以自由地安排结果数据结构。

```rust
#[derive(Debug, DerivePartialModel, PartialEq)]
#[sea_orm(entity = "order::Entity")]
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
#[sea_orm(entity = "order::Entity")]
struct Order {
    #[sea_orm(from_col = "id")]
    order_id: i32,
    total: Decimal,
}

#[derive(Debug, DerivePartialModel, PartialEq)]
#[sea_orm(entity = "customer::Entity")]
struct Customer {
    name: String,
}

#[derive(Debug, DerivePartialModel, PartialEq)]
#[sea_orm(entity = "lineitem::Entity")]
struct LineItem {
    price: Decimal,
    quantity: i32,
}

#[derive(Debug, DerivePartialModel, PartialEq)]
#[sea_orm(entity = "cake::Entity")]
struct Cake {
    name: String,
}

// 完全相同的选择查询

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

## 三模型选择

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

`find_also_related` 基于第一个实体的关系。
`and_also_related` 基于第二个实体的关系。

要改为这样做，你可以这样写：

```rust
Order -> Customer
      -> LineItem
```

```rust
order::Entity::find()
    .find_also_related(customer::Entity)
    .find_also_related(lineitem::Entity)
```