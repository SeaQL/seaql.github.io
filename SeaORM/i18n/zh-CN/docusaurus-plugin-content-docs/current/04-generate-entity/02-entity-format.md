# Entity 格式

让我们来看一个简单的 [Cake](https://github.com/SeaQL/sea-orm/blob/master/src/tests_cfg/cake.rs) entity。

```rust
use sea_orm::entity::prelude::*;

#[sea_orm::model]
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "cake")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
    #[sea_orm(has_one)]
    pub fruit: Option<super::fruit::Entity>,
    #[sea_orm(has_many, via = "cake_filling")]
    pub fillings: Vec<super::filling::Entity>,
}

impl ActiveModelBehavior for ActiveModel {}
```

:::info

即使 `ActiveModelBehavior` 的实现块为空，也不要删除它。

:::

## Entity

`DeriveEntityModel` 宏负责定义 `Entity` 及其关联的 `Model`、`Column` 和 `PrimaryKey` 的所有繁重工作。

### 表名

`table_name` 属性指定数据库中对应的表。
可选地，你也可以通过 `schema_name` 指定数据库架构或数据库名称。

### 列名

默认情况下，所有列名假定为 snake_case。你可以通过指定 `rename_all` 属性来覆盖模型中所有列的这一行为。

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

## Column

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

`column_type` 属性定义支持该属性的数据库类型。通常你不需要指定此项，因为会从 Rust 类型推断。例如，`i32` 默认映射到 `integer`，`String` 默认映射到 `varchar`。你可以在下一章中了解更多关于类型映射的内容。

```rust
pub quantity: i32,  // integer by default
#[sea_orm(column_type = "Decimal(Some((16, 4)))")]
pub price: Decimal, // have to specify numeric precision
```

由于 Postgres 本身不支持无符号整数类型，如果需要保持兼容性，不建议使用无符号类型（如 `u64`）。

### 附加属性

你可以为列添加 `default_value`、`unique`、`indexed` 和 `nullable` 等附加属性。

如果你为可选属性指定了自定义 `column_type`，则还必须指定 `nullable`。

```rust
#[sea_orm(column_type = "Text", default_value = "Sam", unique, indexed, nullable)]
pub name: Option<String>
```

你可以定义跨多列的唯一键，以下将产生 `(order_id, cake_id)` 上的唯一索引。

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

这些属性在 [create_table_from_entity](https://docs.rs/sea-orm/latest/sea_orm/schema/struct.Schema.html#method.create_table_from_entity) 中用于为 entity 生成表。

### 在 Select 和 Save 时转换列类型

如果你需要以一种类型选择列，但以另一种类型保存到数据库，可以指定 `select_as` 和 `save_as` 属性来执行转换。典型用例是将 `citext`（不区分大小写的文本）类型的列在 Rust 中作为 `String` 选择，并作为 `citext` 保存到数据库。应如下定义模型字段：

```rust
#[sea_orm(select_as = "text", save_as = "citext")]
pub case_insensitive_text: String
```

### 忽略属性

如果你想忽略某个特定的模型属性，使其不映射到任何数据库列，可以使用 `ignore` 宏属性。

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

### 自增

默认情况下，`primary_key` 列隐含 `auto_increment`。通过指定 `false` 来覆盖。

```rust
#[sea_orm(primary_key, auto_increment = false)]
pub id: i32
```

### 复合主键

这通常出现在联结表中，使用两列元组作为主键。只需注解多个列即可定义复合主键。复合主键的 `auto_increment` 为 `false`。

主键的最大元数为 12。

```rust
pub struct Model {
    #[sea_orm(primary_key)]
    pub cake_id: i32,
    #[sea_orm(primary_key)]
    pub fruit_id: i32,
}
```

## Relation

在 [Relation](06-relation/01-one-to-one.md) 章节中了解更多关于关系的内容。

## ActiveModel 行为

对 `ActiveModel` 执行不同操作时的钩子。例如，你可以执行自定义验证逻辑或触发副作用。在事务中，你甚至可以在操作完成后中止操作，防止其保存到数据库。

```rust
#[async_trait]
impl ActiveModelBehavior for ActiveModel {
    /// Create a new ActiveModel with default values. Also used by `Default::default()`.
    fn new() -> Self {
        Self {
            uuid: Set(Uuid::new_v4()),
            ..ActiveModelTrait::default()
        }
    }

    /// Will be triggered before insert / update
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

    /// Will be triggered after insert / update
    async fn after_save<C>(model: Model, db: &C, insert: bool) -> Result<Model, DbErr>
    where
        C: ConnectionTrait,
    {
        Ok(model)
    }

    /// Will be triggered before delete
    async fn before_delete<C>(self, db: &C) -> Result<Self, DbErr>
    where
        C: ConnectionTrait,
    {
        Ok(self)
    }

    /// Will be triggered after delete
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
```
