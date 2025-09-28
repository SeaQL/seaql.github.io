# 实体格式

让我们看一个简单的 [Cake](https://github.com/SeaQL/sea-orm/blob/master/src/tests_cfg/cake.rs) 实体。

```rust
use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "cake")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
}

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

impl ActiveModelBehavior for ActiveModel {}
```

:::info

即使 `Relation` 枚举或 `ActiveModelBehavior` impl 块为空，也不要删除它们。
:::

## 实体

`DeriveEntityModel` 宏完成了定义 `Entity` 及关联 `Model`、`Column` 和 `PrimaryKey` 的所有繁重工作。

### 表名

`table_name` 属性指定数据库中对应的表。
可选地，你还可以通过 `schema_name` 指定数据库模式（schema）或数据库名称。

### 列名

默认情况下，所有列名都假定为 snake_case。你可以通过指定 `rename_all` 属性来覆盖模型中所有列的这一行为。

```rust
#[sea_orm(rename_all = "camelCase")]
pub struct Model { ... }
```

<details>
    <summary>你可以在此处找到 `rename_all` 属性的有效值列表</summary>

- camelCase
- kebab-case
- mixed_case
- SCREAMING_SNAKE_CASE
- snake_case
- title_case
- UPPERCASE
- lowercase
- SCREAMING-KEBAB-CASE
- PascalCase

</details>

## 列

### 列名

你可以通过指定 `column_name` 属性来覆盖列名。

```rust
#[derive(DeriveEntityModel)]
#[sea_orm(table_name = "user", rename_all = "camelCase")]
pub struct Model {
    #[sea_orm(primary_key)]
    id: i32,
    first_name: String, // firstName
    #[sea_orm(column_name = "lAsTnAmE")]
    last_name: String, // lAsTnAmE
}
```

### 列类型

`column_type` 属性定义了该字段在数据库中的具体类型。通常无需显式指定，它会从 Rust 类型自动推断。例如，`i32` 默认映射到 `integer`，`String` 映射到 `varchar`。你可以在下一章中阅读有关类型映射的更多信息。

```rust
pub quantity: i32,  // 默认整数
#[sea_orm(column_type = "Decimal(Some((16, 4)))")]
pub price: Decimal, // 必须指定数字精度
```

由于 Postgres 并不原生支持无符号整数类型，因此如需保持兼容性，不建议使用无符号类型（例如 `u64`）。

### 附加属性

你可以为列添加附加属性 `default_value`、`unique`、`indexed` 和 `nullable`。

如果你为可选字段指定了自定义 `column_type`，还必须显式标注 `nullable`。

```rust
#[sea_orm(column_type = "Text", default_value = "Sam", unique, indexed, nullable)]
pub name: Option<String>
```

你可以定义跨多列的唯一键，以下将导致 `(order_id, cake_id)` 上的唯一索引。

```rust
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "lineitem")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    #[sea_orm(unique_key = "item")]
    pub order_id: i32,
    #[sea_orm(unique_key = "item")]
    pub cake_id: i32,
}
```

上述属性会用于 [create_table_from_entity](https://docs.rs/sea-orm/latest/sea_orm/schema/struct.Schema.html#method.create_table_from_entity) 来生成对应的数据库表。

### 在 Select/Save 时转换列类型

如果需要以一种类型读取列、以另一种类型写回数据库，可以通过 `select_as` 与 `save_as` 属性进行转换。典型场景是将 `citext`（不区分大小写的文本）在 Rust 中读取为 `String`，保存时写回为 `citext`：

```rust
#[sea_orm(select_as = "text", save_as = "citext")]
pub case_insensitive_text: String
```

### 忽略属性

如果你想忽略某个特定的模型字段，使其不映射到任何数据库列，可以使用 `#[sea_orm(ignore)]`。

```rust
#[sea_orm(ignore)]
pub ignore_me: String
```

## 主键

使用 `primary_key` 属性将列标记为主键。

```rust
#[sea_orm(primary_key)]
pub id: i32
```

### 自动递增

默认情况下，`primary_key` 列隐含 `auto_increment`。通过指定 `false` 来覆盖它。

```rust
#[sea_orm(primary_key, auto_increment = false)]
pub id: i32
```

### 复合键

这通常发生在连接表中，其中两列表达式（元组）用作主键。同时标注多列即可定义复合主键。复合主键的 `auto_increment` 为 `false`。

主键的最大元数为 12。

```rust
pub struct Model {
    #[sea_orm(primary_key)]
    pub cake_id: i32,
    #[sea_orm(primary_key)]
    pub fruit_id: i32,
}
```

## 关系

`DeriveRelation` 是一个宏，可帮助你实现 [`RelationTrait`](https://docs.rs/sea-orm/*/sea_orm/entity/trait.RelationTrait.html)。

```rust
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_many = "super::fruit::Entity")]
    Fruit,
}
```

如果没有任何关系，只需编写：

```rust
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}
```

[Related](https://docs.rs/sea-orm/*/sea_orm/entity/trait.Related.html) trait 将实体连接在一起，以便你可以构建选择两个实体的查询。

更多内容见[关系](06-relation/01-one-to-one.md)一章。

## Active Model 行为

包含 `ActiveModel` 上各类操作的 hooks。例如，你可以执行自定义验证逻辑或触发副作用。在事务中，你甚至可以在操作完成后中止提交，阻止其保存到数据库。

```rust
#[async_trait]
impl ActiveModelBehavior for ActiveModel {
    /// 使用默认值创建新的 ActiveModel，也会转发到 Default trait的实现中
    fn new() -> Self {
        Self {
            uuid: Set(Uuid::new_v4()),
            ..ActiveModelTrait::default()
        }
    }

    /// 将在插入/更新之前触发
    async fn before_save<C>(self, db: &C, insert: bool) -> Result<Self, DbErr>
    where
        C: ConnectionTrait,
    {
        if self.price.as_ref() <= &0.0 {
            Err(DbErr::Custom(format!(
                "[before_save] Invalid Price, insert: {}",
                insert
            )))
        } else {
            Ok(self)
        }
    }

    /// 将在插入/更新之后触发
    async fn after_save<C>(model: Model, db: &C, insert: bool) -> Result<Model, DbErr>
    where
        C: ConnectionTrait,
    {
        Ok(model)
    }

    /// 将在删除之前触发
    async fn before_delete<C>(self, db: &C) -> Result<Self, DbErr>
    where
        C: ConnectionTrait,
    {
        Ok(self)
    }

    /// 将在删除之后触发
    async fn after_delete<C>(self, db: &C) -> Result<Self, DbErr>
    where
        C: ConnectionTrait,
    {
        Ok(self)
    }
}
```

如果不需要自定义，只需编写：

```rust
impl ActiveModelBehavior for ActiveModel {}
