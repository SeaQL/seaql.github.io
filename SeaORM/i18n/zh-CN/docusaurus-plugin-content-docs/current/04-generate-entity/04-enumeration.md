# ActiveEnum

你可以在模型中使用 Rust 枚举，其值映射到数据库字符串、整数或原生枚举。

## 字符串

对于字符串枚举，除了能够为每个成员指定字符串值外，你还可以在枚举上指定 `rename_all` 属性，以便所有值都基于大小写转换具有字符串值。

```rust
#[derive(EnumIter, DeriveActiveEnum)]
#[sea_orm(rs_type = "String", db_type = "String(StringLen::None)", rename_all = "camelCase")]
pub enum Category {
    BigTask,
    SmallWork,
}
```

上述等价于：

```rust
#[derive(EnumIter, DeriveActiveEnum)]
#[sea_orm(rs_type = "String", db_type = "String(StringLen::None)")]
pub enum Category {
    #[sea_orm(string_value = "bigTask")]
    BigTask,
    #[sea_orm(string_value = "smallBreak")]
    SmallWork,
}
```

后者使用 `string_value` 手动指定字符串值。

<details>
    <summary>你可以在此处找到 `rename_all` 属性的有效值列表：</summary>

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

### 简单枚举字符串

`DeriveValueType` 为枚举添加了支持。它为由字符串数据库类型支持的客户端枚举提供了比 `DeriveActiveEnum` 更简单的替代方案。
你需要提供自定义的 `from_str` 和 `to_str` 实现。

```rust
#[derive(DeriveValueType)]
#[sea_orm(value_type = "String")]
pub enum Category {
    BigTask,
    SmallWork,
}
```

更多详情请参阅下一章。

## 整数

```rust
#[derive(EnumIter, DeriveActiveEnum)]
#[sea_orm(rs_type = "i32", db_type = "Integer")]
pub enum Color {
    #[sea_orm(num_value = 0)]
    Black,
    #[sea_orm(num_value = 1)]
    White,
}
```
或者，你也可以这样写：
```rust
#[derive(EnumIter, DeriveActiveEnum)]
#[sea_orm(rs_type = "i32", db_type = "Integer")]
pub enum Color {
    Black = 0,
    White = 1,
}
```

## 原生数据库枚举

```rust
#[derive(EnumIter, DeriveActiveEnum)]
#[sea_orm(rs_type = "String", db_type = "Enum", enum_name = "tea")]
pub enum Tea {
    #[sea_orm(string_value = "EverydayTea")]
    EverydayTea,
    #[sea_orm(string_value = "BreakfastTea")]
    BreakfastTea,
}
```

### MySQL

MySQL 的枚举只是列定义的一部分，不能为不同的表复用。

```rust
Table::create()
    .table("table_name")
    .col(ColumnDef::new("column_name")
            .enumeration("tea", ["EverydayTea", "BreakfastTea"]))

"CREATE TABLE `table_name` (`column_name` ENUM('EverydayTea', 'BreakfastTea'))",
```

### Postgres

```rust
Table::create()
    .table("table_name")
    .col(ColumnDef::new("column_name").custom("tea"))
```

如果你使用 Postgres，枚举必须在*定义表之前*在单独的 `Type` 语句中创建，有两种方式：

#### 1. `CREATE TYPE` 语句

[完整示例](https://github.com/SeaQL/sea-orm/blob/master/sea-orm-migration/tests/common/migration/m20220118_000004_create_tea_enum.rs)。

```rust
manager
    .create_type(
        // CREATE TYPE "tea" AS ENUM ('EverydayTea', 'BreakfastTea')
        Type::create()
            .as_enum("tea")
            .values(["EverydayTea", "BreakfastTea"])
            .to_owned(),
    )
    .await?;
```

#### 2. `create_enum_from_active_enum`

1. 定义 `ActiveEnum`

```rust
#[derive(EnumIter, DeriveActiveEnum)]
#[sea_orm(rs_type = "String", db_type = "Enum", enum_name = "tea")]
pub enum Tea {
    #[sea_orm(string_value = "EverydayTea")]
    EverydayTea,
    #[sea_orm(string_value = "BreakfastTea")]
    BreakfastTea,
}
```

2. 生成 `CREATE TYPE` 语句

```rust
use sea_orm::{Schema, DbBackend};

let schema = Schema::new(DbBackend::Postgres);

manager
    .create_type(
        // CREATE TYPE "tea" AS ENUM ('EverydayTea', 'BreakfastTea')
        schema.create_enum_from_active_enum::<Tea>().expect("Postgres only"),
    )
    .await?;
```

另请参阅 [Schema Creation Methods](https://www.sea-ql.org/SeaORM/docs/migration/writing-migration/#schema-creation-methods)。

### SQLite

在 SQLite 上，枚举将映射为字符串。

## `ActiveEnum` 特征

[`DeriveActiveEnum`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/derive.DeriveActiveEnum.html) 宏在底层实现了 [`ActiveEnum`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/entity/trait.ActiveEnum.html) 特征。

```rust
use sea_orm::entity::prelude::*;

#[derive(Debug, PartialEq, Eq, EnumIter, DeriveActiveEnum)]
#[sea_orm(
    rs_type = "String",
    db_type = "String(StringLen::N(1))",
    enum_name = "category"
)]
pub enum Category {
    #[sea_orm(string_value = "B")]
    Big,
    #[sea_orm(string_value = "S")]
    Small,
}
```

<details>
  <summary>为便于说明，以下是宏大致实现的内容：</summary>
  <div>

```rust
use sea_orm::entity::prelude::*;

#[derive(Debug, PartialEq, Eq, EnumIter)]
pub enum Category {
    Big,
    Small,
}

// Implementing manually
impl ActiveEnum for Category {
    // The macro attribute `rs_type` is being pasted here
    type Value = String;

    // By default, the name of Rust enum in camel case if `enum_name` was not provided explicitly
    fn name() -> String {
        "category".to_owned()
    }

    // Map Rust enum variants to corresponding `num_value` or `string_value`
    fn to_value(&self) -> Self::Value {
        match self {
            Self::Big => "B",
            Self::Small => "S",
        }
        .to_owned()
    }

    // Map `num_value` or `string_value` to corresponding Rust enum variants
    fn try_from_value(v: &Self::Value) -> Result<Self, DbErr> {
        match v.as_ref() {
            "B" => Ok(Self::Big),
            "S" => Ok(Self::Small),
            _ => Err(DbErr::Type(format!(
                "unexpected value for Category enum: {}",
                v
            ))),
        }
    }

    // The macro attribute `db_type` is being pasted here
    fn db_type() -> ColumnDef {
        ColumnType::String(Some(1)).def()
    }
}
```
  </div>
</details>

## 在模型中使用 ActiveEnum

```rust
use sea_orm::entity::prelude::*;

#[derive(Debug, Clone, PartialEq, Eq, EnumIter, DeriveActiveEnum)]
#[sea_orm(rs_type = "String", db_type = "String(StringLen::N(1))")]
pub enum Category {
    #[sea_orm(string_value = "B")]
    Big,
    #[sea_orm(string_value = "S")]
    Small,
}

#[sea_orm::model]
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "active_enum")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub category: Category,
    pub category_opt: Option<Category>,
}

impl ActiveModelBehavior for ActiveModel {}
```

<details>
<summary>在 SeaORM 1.0 中，即使为空也需要 Relation 枚举：</summary>

```rust
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "active_enum")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub category: Category,
    pub category_opt: Option<Category>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
```
</details>
