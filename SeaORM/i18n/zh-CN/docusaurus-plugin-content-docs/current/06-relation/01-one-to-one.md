# 一对一

:::tip SeaQL 的 Rust 贴纸包 🦀
[我们的贴纸](https://www.sea-ql.org/sticker-pack/)由优质防水 PVC 制成，具有独特的哑光表面，非常适合粘贴在笔记本电脑或其他小工具的背面！
:::

一对一关系是最基本的数据库关系类型。假设一个 `Cake` Entity 最多有一个 `Fruit` 配料。

## 定义关联

在 `Cake` Entity 上定义关系：
1. 在 `Model` 中添加新字段 `fruit`。
1. 使用 `has_one` 注解。

```rust {7,8} title="entity/cake.rs"
#[sea_orm::model]
#[derive(DeriveEntityModel, ..)]
#[sea_orm(table_name = "cake")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    #[sea_orm(has_one)]
    pub fruit: HasOne<super::fruit::Entity>,
}
```

<details>
    <summary>展开后：</summary>

```rust {3,4,9} title="entity/cake.rs"
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_one = "super::fruit::Entity")]
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

在 `Fruit` Entity 上，其 `cake_id` 属性引用 `Cake` Entity 的主键。

:::tip

经验法则是：始终在带有外键 `xxx_id` 的 Entity 上定义 `belongs_to`。

:::

定义反向关系：
1. 在 fruit `Model` 中添加新字段 `cake`。
1. 使用 `belongs_to` 注解该关系。
1. 实现 `Related<cake::Entity>` trait。

```rust {9,10} title="entity/fruit.rs"
#[sea_orm::model]
#[derive(DeriveEntityModel, ..)]
#[sea_orm(table_name = "fruit")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    #[sea_orm(unique)]
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
