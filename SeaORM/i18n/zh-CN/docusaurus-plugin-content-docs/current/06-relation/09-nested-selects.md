# 嵌套查询

`FromQueryResult` 和 `DerivePartialModel` 宏允许你轻松嵌套对象，简化复杂查询的构建。

## 嵌套 FromQueryResult

作为第一个简单示例，我们想要选择带有 `Bakery` 的 `Cake`：

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

因为 `cake` 和 `bakery` 表有一些重复的列名，我们必须进行自定义选择。这里的 `select_only` 会清除默认的选择列表，我们使用 [`column_as`](https://docs.rs/sea-orm/latest/sea_orm/query/trait.QuerySelect.html#method.column_as) 应用别名。然后，在 `FromQueryResult` 中使用 `alias` 将查询结果映射回嵌套结构体。

## 嵌套模型

:::tip 自 `2.0.0` 起

```rust
#[derive(DerivePartialModel)]
#[sea_orm(entity = "cake::Entity", from_query_result)]
//                                 ^^^^^^^^^^^^^^^^^ no longer needed
```

:::

[`DerivePartialModel`](https://docs.rs/sea-orm/latest/sea_orm/derive.DerivePartialModel.html) 允许你省略自定义选择和别名。
前面的示例可以写成：

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
    #[sea_orm(from_col = "name")]
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

在底层，SQL 查询中会为列别名添加 `bakery_` 前缀。

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

### 常规模型也可以嵌套！

:::tip 自 `2.0.0` 起
:::

所以前面的示例也可以是：

```rust
#[derive(DerivePartialModel)]
#[sea_orm(entity = "cake::Entity")]
struct Cake {
    id: i32,
    name: String,
    #[sea_orm(nested)]
    bakery: Option<bakery::Model>, // <- a regular full Model
}
```

其中会选择嵌套模型的所有列。

### 与 Linked 一起使用

:::tip 自 `2.0.0` 起
:::

你也可以使用 `Linked` 关系选择 局部模型，但必须应用与底层查询匹配的别名。以下与前面的示例等效。

```rust
pub struct ToBakery;
impl Linked for ToBakery {
    type FromEntity = super::cake::Entity;
    type ToEntity = super::bakery::Entity;

    fn link(&self) -> Vec<RelationDef> {
        vec![cake::Relation::Bakery.def()]
    }
}
```

```rust
#[derive(Debug, DerivePartialModel)]
#[sea_orm(entity = "cake::Entity")]
struct Cake {
    id: i32,
    name: String,
    #[sea_orm(nested, alias = "r0")] // <- apply alias
    bakery: Option<Bakery>,
}

let cake: Cake = cake::Entity::find()
    .left_join_linked(ToBakery)
    .order_by_asc(cake::Column::Id)
    .into_partial_model()
    .one(&ctx.db)
    .await?;
    .unwrap();
```

### 使用别名联结

当同一张表在同一查询中被 join 多次时，必须使用别名。你可以使用 `alias` 属性从别名中选择列。

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

结果为：

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

### 多个别名

你可以通过两个关系在同一查询中 join 同一 Entity 两次，并为每个使用不同的别名。

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

## 三表联结

我们的联结计划从 Order 开始：

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

由于 Cake 是 LineItem 的相关 Entity，而不是 Order，它不满足 `left_join` 的特征约束。因此有必要使用更灵活的 `join` 方法。

### 替代结构

在上面的示例中，我们使嵌套结构与联结计划的拓扑结构相一致。
但没有限制。实际上，SQL 将选择扁平化为平面表，因此只要可以找到所有列，
我们就可以自由安排结果数据结构。

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

// the exact same select query
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
