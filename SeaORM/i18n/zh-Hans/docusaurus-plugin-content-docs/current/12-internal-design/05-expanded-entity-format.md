# 展开的实体格式

这是紧凑格式之前的实体格式，现在紧凑格式是默认格式，所有新功能都是在紧凑格式之上添加的。

展开格式被认为是旧格式。但如果你好奇 `DeriveEntityModel` 会扩展成什么，请继续阅读。

可以使用带有 `--expanded-format` 选项的 `sea-orm-cli` 生成展开的实体格式。

让我们来看看展开的 [Cake](https://github.com/SeaQL/sea-orm/blob/master/src/tests_cfg/cake_expanded.rs) 实体的各个部分。

## 实体

通过实现 [`EntityTrait`](https://docs.rs/sea-orm/*/sea_orm/entity/trait.EntityTrait.html)，你可以对给定的表执行 CRUD 操作。

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

一个表示此表中所有列的枚举。

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

所有列名都假定为蛇形命名法（snake-case）。你可以通过指定 `column_name` 属性来覆盖列名。

```rust
pub enum Column {
    Id,      // 映射到 SQL 中的 "id"
    Name,    // 映射到 SQL 中的 "name"
    #[sea_orm(column_name = "create_at")]
    CreateAt // 映射到 SQL 中的 "create_at"
}
```

要指定每个列的数据类型，可以使用 [`ColumnType`](https://docs.rs/sea-orm/*/sea_orm/entity/enum.ColumnType.html) 枚举。

### 附加属性

- 默认值
- 唯一
- 索引
- 可为空

```rust
ColumnType::String(StringLen::None).def().default_value("Sam").unique().indexed().nullable()
```

### 在选择和保存时转换列类型

如果你需要将列选择为一种类型，但将其作为另一种类型保存到数据库中，你可以覆盖 `select_as` 和 `save_as` 方法来执行转换。一个典型的用例是将 `citext`（不区分大小写的文本）类型的列在 Rust 中选择为 `String`，并将其作为 `citext` 保存到数据库中。应该像下面这样覆盖 `ColumnTrait` 的方法：

```rust
use sea_orm::sea_query::{Expr, SimpleExpr, Alias}

impl ColumnTrait for Column {
    // ... 省略 ...

    /// 在 select 语句中使用的列表达式转换。
    fn select_as(&self, expr: Expr) -> SimpleExpr {
        match self {
            Column::CaseInsensitiveText => expr.cast_as("text"),
            _ => self.select_enum_as(expr),
        }
    }

    /// 将列的值转换为正确的类型以进行数据库存储。
    fn save_as(&self, val: Expr) -> SimpleExpr {
        match self {
            Column::CaseInsensitiveText => val.cast_as("citext"),
            _ => self.save_enum_as(val),
        }
    }
}
```

## 主键

一个表示此表主键的枚举。复合键由具有多个变体的枚举表示。

`ValueType` 定义了 [`InsertResult`](https://docs.rs/sea-orm/*/sea_orm/struct.InsertResult.html) 中 last_insert_id 的类型。

`auto_increment` 定义了主键是否具有自动生成的值。

```rust
#[derive(Copy, Clone, Debug, EnumIter, DerivePrimaryKey)]
pub enum PrimaryKey {
    #[sea_orm(column_name = "id")] // 覆盖默认列名
    Id,  // 映射到 SQL 中的 "id"
}

impl PrimaryKeyTrait for PrimaryKey {
    type ValueType = i32;

    fn auto_increment() -> bool {
        true
    }
}
```

复合键示例

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

### 可为空属性

如果表列可为空，请用 `Option` 包装它。

```rust {3}
pub struct Model {
    pub id: i32,
    pub name: Option<String>,
}
```

## 活动模型

`ActiveModel` 具有其相应 `Model` 的所有属性，但所有属性都包装在 [`ActiveValue`](https://docs.rs/sea-orm/*/sea_orm/entity/enum.ActiveValue.html) 中。

```rust
#[derive(Clone, Debug, PartialEq)]
pub struct ActiveModel {
    pub id: ActiveValue<i32>,
    pub name: ActiveValue<Option<String>>,
}
```

## 关系

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

## 关联

定义 trait 约束以帮助你一起查询相关实体，这在多对多关系中特别有用。

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