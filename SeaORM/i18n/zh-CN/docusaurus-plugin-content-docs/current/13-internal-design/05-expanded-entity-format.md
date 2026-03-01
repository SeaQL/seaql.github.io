# 展开的 Entity 格式

这是 Compact 格式之前的实体格式，如今 Compact 格式已成为默认，所有新功能都建立在 Compact 格式之上。

展开格式被视为遗留格式。如果你好奇 `DeriveEntityModel` 会展开成什么，请继续阅读。

展开的实体格式可通过 `sea-orm-cli` 使用 `--entity-format=expanded` 选项生成。

让我们浏览展开后的 [Cake](https://github.com/SeaQL/sea-orm/blob/master/src/tests_cfg/cake_expanded.rs) 实体的各个部分。

## 实体

通过实现 [`EntityTrait`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/entity/trait.EntityTrait.html)，你可以对给定表执行 CRUD 操作。

```rust
#[derive(Copy, Clone, Default, Debug, DeriveEntity)]
pub struct Entity;

impl EntityName for Entity {
    fn schema_name(&self) -> Option<&str> {
        None
    }

    fn table_name(&self) -> &str {
        "cake"
    }
}
```

## 列

表示此表中所有列的枚举。

```rust
#[derive(Copy, Clone, Debug, EnumIter, DeriveColumn)]
pub enum Column {
    Id,
    Name,
}

impl ColumnTrait for Column {
    type EntityName = Entity;

    fn def(&self) -> ColumnDef {
        match self {
            Self::Id => ColumnType::Integer.def(),
            Self::Name => ColumnType::String(StringLen::None).def(),
        }
    }
}
```

所有列名默认采用 snake-case。你可以通过指定 `column_name` 属性覆盖列名。

```rust
pub enum Column {
    Id,      // maps to "id" in SQL
    Name,    // maps to "name" in SQL
    #[sea_orm(column_name = "created_at")]
    CreatedAt // maps to "created_at" in SQL
}
```

要指定每列的数据类型，可使用 [`ColumnType`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/entity/enum.ColumnType.html) 枚举。

### 附加属性

- 默认值
- 唯一
- 索引
- 可空

```rust
ColumnType::String(StringLen::None).def().default_value("Sam").unique().indexed().nullable()
```

### Select 和 Save 时的列类型转换

如果你需要以某种类型查询列，但以另一种类型保存到数据库，可以覆盖 `select_as` 和 `save_as` 方法进行类型转换。典型用例是将 `citext`（不区分大小写的文本）类型的列在 Rust 中作为 `String` 查询，保存到数据库时作为 `citext`。应按如下方式覆盖 `ColumnTrait` 的方法：

```rust
use sea_orm::sea_query::{Expr, SimpleExpr, Alias}

impl ColumnTrait for Column {
    // Snipped...

    /// Cast column expression used in select statement.
    fn select_as(&self, expr: Expr) -> SimpleExpr {
        match self {
            Column::CaseInsensitiveText => expr.cast_as("text"),
            _ => self.select_enum_as(expr),
        }
    }

    /// Cast value of a column into the correct type for database storage.
    fn save_as(&self, val: Expr) -> SimpleExpr {
        match self {
            Column::CaseInsensitiveText => val.cast_as("citext"),
            _ => self.save_enum_as(val),
        }
    }
}
```

## 主键

表示此表主键的枚举。复合主键由具有多个变体的枚举表示。

`ValueType` 定义 [`InsertResult`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/struct.InsertResult.html) 中 last_insert_id 的类型。

`auto_increment` 定义主键是否具有自动生成的值。

```rust
#[derive(Copy, Clone, Debug, EnumIter, DerivePrimaryKey)]
pub enum PrimaryKey {
    #[sea_orm(column_name = "id")] // Override the default column name
    Id,  // maps to "id" in SQL
}

impl PrimaryKeyTrait for PrimaryKey {
    type ValueType = i32;

    fn auto_increment() -> bool {
        true
    }
}
```

复合主键示例

```rust
pub enum PrimaryKey {
    CakeId,
    FruitId,
}

impl PrimaryKeyTrait for PrimaryKey {
    type ValueType = (i32, i32);

    fn auto_increment() -> bool {
        false
    }
}
```

## 模型

用于存储查询结果的 Rust 结构体。

```rust
#[derive(Clone, Debug, PartialEq, Eq, DeriveModel, DeriveActiveModel)]
pub struct Model {
    pub id: i32,
    pub name: String,
}
```

### 可空属性

若表列可为空，请用 `Option` 包装。

```rust {3}
pub struct Model {
    pub id: i32,
    pub name: Option<String>,
}
```

## ActiveModel

`ActiveModel` 拥有其对应 `Model` 的所有属性，但所有属性都包装在 [`ActiveValue`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/entity/enum.ActiveValue.html) 中。

```rust
#[derive(Clone, Debug, PartialEq)]
pub struct ActiveModel {
    pub id: ActiveValue<i32>,
    pub name: ActiveValue<Option<String>>,
}
```

## 关联

指定与其他实体的关系。

```rust
#[derive(Copy, Clone, Debug, EnumIter)]
pub enum Relation {
    Fruit,
}

impl RelationTrait for Relation {
    fn def(&self) -> RelationDef {
        match self {
            Self::Fruit => Entity::has_many(super::fruit::Entity).into(),
        }
    }
}
```

## 关联实体

定义特征约束以帮助你一起查询关联实体，在多对多关系中尤其有用。

```rust
impl Related<super::fruit::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Fruit.def()
    }
}

impl Related<super::filling::Entity> for Entity {
    fn to() -> RelationDef {
        super::cake_filling::Relation::Filling.def()
    }

    fn via() -> Option<RelationDef> {
        Some(super::cake_filling::Relation::Cake.def().rev())
    }
}
```
