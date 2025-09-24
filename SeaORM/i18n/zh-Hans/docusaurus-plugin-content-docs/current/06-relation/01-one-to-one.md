# 一对一关系

:::tip Rustacean 贴纸包 🦀
[我们的贴纸](https://www.sea-ql.org/sticker-pack/) 采用优质防水乙烯基材料制成，具有独特的哑光表面。
将它们贴在你的笔记本电脑、记事本或任何小工具上，以展示你对 Rust 的热爱！
:::

一对一关系是最基本的数据库关系类型。假设一个 `Cake` 实体最多有一个 `Fruit` 配料。

## 定义关系

在 `Cake` 实体上，定义关系：
1. 向 `Relation` 枚举添加一个新的变体 `Fruit`。
2. 使用 `has_one` 定义它。
3. 实现 `Related<Entity>` trait。

```rust title="entity/cake.rs"
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

<details>
    <summary>它展开为：</summary>

```rust {3,9,16} title="entity/cake.rs"
#[derive(Copy, Clone, Debug, EnumIter)]
pub enum Relation {
    Fruit,
}

impl RelationTrait for Relation {
    fn def(&self) -> RelationDef {
        match self {
            Self::Fruit => Entity::has_one(super::fruit::Entity).into(),
        }
    }
}

impl Related<super::fruit::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Fruit.def()
    }
}
```
</details>

或者，可以使用 `DeriveRelation` 宏缩短定义，
其中以下内容消除了对上述 `RelationTrait` 实现的需求：

## 定义反向关系

在 `Fruit` 实体上，其 `cake_id` 属性引用 `Cake` 实体的主键。

:::tip

经验法则是，始终在外键 `xxx_id` 的实体上定义 `belongs_to`。

:::

要定义反向关系：
1. 向 `Fruit` 实体添加一个新的枚举变体 `Relation::Cake`。
2. 使用 `Entity::belongs_to()` 方法编写其定义，我们始终使用此方法定义反向关系。
3. 实现 `Related<cake::Entity>` trait。

```rust title="entity/fruit.rs"
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

<details>
    <summary>它展开为：</summary>

```rust
#[derive(Copy, Clone, Debug, EnumIter)]
pub enum Relation {
    Cake,
}

impl RelationTrait for Relation {
    fn def(&self) -> RelationDef {
        match self {
            Self::Cake => Entity::belongs_to(super::cake::Entity)
                .from(Column::CakeId)
                .to(super::cake::Column::Id)
                .into(),
        }
    }
}

impl Related<super::cake::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Cake.def()
    }
}
```
</details>