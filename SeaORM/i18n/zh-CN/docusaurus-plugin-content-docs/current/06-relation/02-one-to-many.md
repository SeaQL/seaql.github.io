# 一对多

一对多关系与一对一关系类似。在上一节中，我们举了「一个 `Cake` Entity 最多有一个 `Fruit` 配料」的例子。要使其成为一对多关系，我们只需移除「最多一个」的约束。这样，一个 `Cake` Entity 就可以有多个 `Fruit` 配料。

## 定义关联

这与定义一对一关系几乎相同；唯一的区别是这里我们使用 `has_many` 注解。

```rust {7,8} title="entity/cake.rs"
#[sea_orm::model]
#[derive(DeriveEntityModel, ..)]
#[sea_orm(table_name = "cake")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    #[sea_orm(has_many)]
    pub fruit: HasMany<super::fruit::Entity>,
}
```

<details>
    <summary>展开后：</summary>

```rust {3,4,9}
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_many = "super::fruit::Entity")]
    Fruit,
}

impl Related<super::fruit::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Fruit.def()
    }
}
```
</details>

## 定义反向关联

与定义一对一反向关系相同，只是没有唯一键。经验法则是：始终在带有外键 `xxx_id` 的 Entity 上定义 `belongs_to`。

```rust {9,10} title="entity/fruit.rs"
#[sea_orm::model]
#[derive(DeriveEntityModel, ..)]
#[sea_orm(table_name = "fruit")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    // without unique
    pub cake_id: Option<i32>,
    #[sea_orm(belongs_to, from = "cake_id", to = "id")]
    pub cake: HasOne<super::cake::Entity>,
}
```

<details>
    <summary>展开后：</summary>

```rust
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::cake::Entity",
        from = "Column::CakeId",
        to = "super::cake::Column::Id"
    )]
    Cake,
}

impl Related<super::cake::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Cake.def()
    }
}
```
</details>

## 组合外键

使用元组语法支持复合外键。

```rust title="composite_a.rs"
#[sea_orm::model]
#[sea_orm(table_name = "composite_a")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    #[sea_orm(unique_key = "pair")]
    pub left_id: i32,
    #[sea_orm(unique_key = "pair")]
    pub right_id: i32,
    #[sea_orm(has_one)]
    pub b: Option<super::composite_b::Entity>,
}
```

```rust title="composite_b.rs"
#[sea_orm::model]
#[sea_orm(table_name = "composite_b")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub left_id: i32,
    pub right_id: i32,
    #[sea_orm(belongs_to, from = "(left_id, right_id)", to = "(left_id, right_id)")]
    pub a: Option<super::composite_a::Entity>,
}
```

<details>
    <summary>展开后：</summary>

```rust title="composite_b.rs"
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::composite_a::Entity",
        from = "(Column::LeftId, Column::RightId)",
        to = "(super::composite_a::Column::LeftId, super::composite_a::Column::RightId)",
    )]
    CakeFilling,
}
```
</details>
