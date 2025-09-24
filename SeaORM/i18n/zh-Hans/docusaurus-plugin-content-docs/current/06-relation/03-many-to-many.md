# 多对多关系

多对多关系由三张表组成，其中两张表通过一张连接表关联。例如，一个 `Cake` 有许多 `Filling`，而 `Filling` 通过一个中间实体 `CakeFilling` 被许多 `Cake` 共享。

## 定义关系

在 `Cake` 实体上，实现 `Related<filling::Entity>` trait。

SeaORM 中的 `Relation` 是一个箭头：它有 `from` 和 `to`。`cake_filling::Relation::Cake` 定义了 `CakeFilling -> Cake`。调用 [`rev`](https://docs.rs/sea-orm/*/sea_orm/entity/prelude/struct.RelationDef.html#method.rev) 将其反转为 `Cake -> CakeFilling`。

将其与定义 `CakeFilling -> Filling` 的 `cake_filling::Relation::Filling` 链接起来，结果是 `Cake -> CakeFilling -> Filling`。

```rust {4,10} title="entity/cake.rs"
impl Related<super::filling::Entity> for Entity {
    // 最终关系是 Cake -> CakeFilling -> Filling
    fn to() -> RelationDef {
        super::cake_filling::Relation::Filling.def()
    }

    fn via() -> Option<RelationDef> {
        // 原始关系是 CakeFilling -> Cake，
        // 在 `rev` 之后变为 Cake -> CakeFilling
        Some(super::cake_filling::Relation::Cake.def().rev())
    }
}
```

类似地，在 `Filling` 实体上，实现 `Related<cake::Entity>` trait。首先，通过 `via` 中间表的 `cake_filling::Relation::Filling` 关系的反向连接，然后通过 `cake_filling::Relation::Cake` 关系连接到 `Cake` 实体。

```rust {3,7} title="entity/filling.rs"
impl Related<super::cake::Entity> for Entity {
    fn to() -> RelationDef {
        super::cake_filling::Relation::Cake.def()
    }

    fn via() -> Option<RelationDef> {
        Some(super::cake_filling::Relation::Filling.def().rev())
    }
}
```

## 定义反向关系

在 `CakeFilling` 实体上，其 `cake_id` 属性引用 `Cake` 实体的主键，其 `filling_id` 属性引用 `Filling` 实体的主键。

要定义反向关系：
1. 向 `Relation` 枚举添加两个新的变体 `Cake` 和 `Filling`。
2. 使用 `Entity::belongs_to()` 定义这两个关系。

```rust title="entity/cake_filling.rs"
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::cake::Entity",
        from = "Column::CakeId",
        to = "super::cake::Column::Id"
    )]
    Cake,
    #[sea_orm(
        belongs_to = "super::filling::Entity",
        from = "Column::FillingId",
        to = "super::filling::Column::Id"
    )]
    Filling,
}
```

<details>
    <summary>它展开为：</summary>

```rust
#[derive(Copy, Clone, Debug, EnumIter)]
pub enum Relation {
    Cake,
    Filling,
}

impl RelationTrait for Relation {
    fn def(&self) -> RelationDef {
        match self {
            Self::Cake => Entity::belongs_to(super::cake::Entity)
                .from(Column::CakeId)
                .to(super::cake::Column::Id)
                .into(),
            Self::Filling => Entity::belongs_to(super::filling::Entity)
                .from(Column::FillingId)
                .to(super::filling::Column::Id)
                .into(),
        }
    }
}
```
</details>

## 代码生成器的限制

请注意，如果存在通过中间表的多个路径，则不会生成带有 `via` 和 `to` 方法的 `Related` 实现。

例如，在下面定义的模式中，存在两条路径：
+ 路径 1. `users <-> users_votes <-> bills`
+ 路径 2. `users <-> users_saved_bills <-> bills`

因此，不会生成 `Related<R>` 的实现。

```sql
CREATE TABLE users
(
  id uuid  PRIMARY KEY  DEFAULT uuid_generate_v1mc(),
  email TEXT UNIQUE NOT NULL,
  ...
);
``````sql
CREATE TABLE bills
(
  id uuid  PRIMARY KEY  DEFAULT uuid_generate_v1mc(),
  ...
);
``````sql
CREATE TABLE users_votes
(
  user_id uuid REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
  bill_id uuid REFERENCES bills (id) ON UPDATE CASCADE ON DELETE CASCADE,
  vote boolean NOT NULL,
  CONSTRAINT users_bills_pkey PRIMARY KEY (user_id, bill_id)
);
``````sql
CREATE TABLE users_saved_bills
(
  user_id uuid REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
  bill_id uuid REFERENCES bills (id) ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT users_saved_bills_pkey PRIMARY KEY (user_id, bill_id)
);