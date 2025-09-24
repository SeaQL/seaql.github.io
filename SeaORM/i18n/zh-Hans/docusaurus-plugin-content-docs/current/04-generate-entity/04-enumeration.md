# ActiveEnum

你可以在模型中使用 Rust 枚举，其中值映射到数据库字符串、整数或原生枚举。

## 字符串

对于字符串枚举，除了能够为每个变体指定字符串值之外，你还可以为枚举指定 `rename_all` 属性，如果所有值都应基于大小写转换具有字符串值。

```rust
#[derive(EnumIter, DeriveActiveEnum)]
#[sea_orm(rs_type = "String", db_type = "String(StringLen::None)", rename_all = "camelCase")]
pub enum Category {
    BigTask,
    SmallWork,
}
```

上述等同于：

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

它使用 `string_value` 手动指定字符串值。

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

`DeriveValueType` 添加了对枚举的支持。它为由字符串数据库类型支持的客户端枚举提供了 `DeriveActiveEnum` 的更简单替代方案。
你必须提供自定义的 `from_str` 和 `to_str` 实现。

```rust
#[derive(DeriveValueType)]
#[sea_orm(value_type = "String")]
pub enum Category {
    BigTask,
    SmallWork,
}
```

阅读下一章了解更多详情。

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
或者，你可以编写：
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

## MySQL

MySQL 枚举只是列定义的一部分，不能用于不同的表。

```rust
Table::create()
    .table(Posts::TableName)
    .col(ColumnDef::new(Posts::ColumnName)
            .enumeration("tea", ["EverydayTea", "BreakfastTea"]))

"CREATE TABLE `table_name` (`column_name` ENUM('EverydayTea', 'BreakfastTea'))",
```

## Postgres

如果你使用 Postgres，枚举必须在迁移中以单独的 `Type` 语句创建，你可以使用以下方式创建它：

### 1. `TYPE` 语句

[完整示例](https://github.com/SeaQL/sea-orm/blob/master/sea-orm-migration/tests/common/migration/m20220118_000004_create_tea_enum.rs)。

```rust
// 在迁移中运行：

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

### 2. `create_enum_from_active_enum`
此方法将提供一个接口，用于将类型添加到数据库、将类型用于表列以及在填充数据时将此类型的值添加到行。

1. 定义一个 `ActiveEnum`

```rust
#[derive(EnumIter, DeriveActiveEnum)]
#[sea_orm(rs_type = "String", db_type = "Enum", enum_name = "tea_type")]
pub enum TeaType {
    #[sea_orm(string_value = "EverydayTea")]
    EverydayTea,
    #[sea_orm(string_value = "BreakfastTea")]
    BreakfastTea,
}
```

2. 在数据库中创建类型

```rust
use sea_orm::{Schema, DbBackend};

// 在迁移中：
let schema = Schema::new(DbBackend::Postgres);

manager
    .create_type(
        // CREATE TYPE "tea_type" AS ENUM ('EverydayTea', 'BreakfastTea')
        schema.create_enum_from_active_enum::<TeaType>(),
    )
    .await?;
```

3. 在创建表时将类型用作表列类型

```rust diff
// 在迁移中：

manager::create()
    .table(Tea::Table)
    .if_not_exists()
    .col(Column::new(Tea::Type).custom(TeaType::name())) // 将类型用于表列
    // ... 更多列
```
> 另请参阅 [Schema 创建方法 - 创建表](https://www.sea-ql.org/SeaORM/docs/migration/writing-migration/#schema-creation-methods)

4. 在填充数据库时使用类型

```rust
// 在迁移中

let insert = Query::insert()
    .into_table(Tea::Table)
    .columns([Tea::TeaType])
    .values_panic([TeaType::EverydayTea.as_enum()]) // 调用 `as_enum` 将变体转换为 SimpleExpr
    .to_owned();

manager.execute(insert).await?;
// ...
```
> 另请参阅 [填充数据 - 使用 sea_query 语句](https://www.sea-ql.org/SeaORM/docs/migration/seeding-data/#:~:text=write%20SeaQuery%20statement%20to%20seed%20the%20table)

## Trait 实现

[`DeriveActiveEnum`](https://docs.rs/sea-orm/*/sea_orm/derive.DeriveActiveEnum.html) 宏在底层实现了 [`ActiveEnum`](https://docs.rs/sea-orm/*/sea_orm/entity/trait.ActiveEnum.html) trait。

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
  <summary>为了说明目的，这大致是宏实现的内容：</summary>
  <div>

```rust
use sea_orm::entity::prelude::*;

#[derive(Debug, PartialEq, Eq, EnumIter)]
pub enum Category {
    Big,
    Small,
}

// 手动实现
impl ActiveEnum for Category {
    // 宏属性 `rs_type` 在此处粘贴
    type Value = String;

    // 默认情况下，如果未明确提供 `enum_name`，则 Rust 枚举的名称为驼峰式
    fn name() -> String {
        "category".to_owned()
    }

    // 将 Rust 枚举变体映射到相应的 `num_value` 或 `string_value`
    fn to_value(&self) -> Self::Value {
        match self {
            Self::Big => "B",
            Self::Small => "S",
        }
        .to_owned()
    }

    // 将 `num_value` 或 `string_value` 映射到相应的 Rust 枚举变体
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

    // 宏属性 `db_type` 在此处粘贴
    fn db_type() -> ColumnDef {
        ColumnType::String(Some(1)).def()
    }
}
```
  </div>
</details>

## 在模型上使用 ActiveEnum

```rust
use sea_orm::entity::prelude::*;

// 定义 `Category` 活动枚举
#[derive(Debug, Clone, PartialEq, Eq, EnumIter, DeriveActiveEnum)]
#[sea_orm(rs_type = "String", db_type = "String(StringLen::N(1))")]
pub enum Category {
    #[sea_orm(string_value = "B")]
    Big,
    #[sea_orm(string_value = "S")]
    Small,
}

#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "active_enum")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    // 表示使用 `Category` 活动枚举的数据库列
    pub category: Category,
    pub category_opt: Option<Category>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}