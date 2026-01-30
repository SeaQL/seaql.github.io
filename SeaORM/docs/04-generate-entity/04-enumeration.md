# ActiveEnum

You can use Rust enums in models where the values are mapped to a database string, integer or native enum.

## String

For string enums, in addition to being able to specify the string value for each variant, you can also specify the `rename_all` attribute on the Enum if all the values should have string values based on case-transformations.

```rust
#[derive(EnumIter, DeriveActiveEnum)]
#[sea_orm(rs_type = "String", db_type = "String(StringLen::None)", rename_all = "camelCase")]
pub enum Category {
    BigTask,
    SmallWork,
}
```

The above is equivalent to:

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

Which specify the string values manually with `string_value`.

<details>
    <summary>You can find a list of valid values for the `rename_all` attribute here:</summary>

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

### Simple enum strings

`DeriveValueType` added support for enums. It offers a simpler alternative to `DeriveActiveEnum` for client-side enums backed by string database types.
You have to provide custom `from_str` and `to_str` implementations.

```rust
#[derive(DeriveValueType)]
#[sea_orm(value_type = "String")]
pub enum Category {
    BigTask,
    SmallWork,
}
```

Read the next chapter for more details.

## Integers

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
Alternatively, you could write:
```rust
#[derive(EnumIter, DeriveActiveEnum)]
#[sea_orm(rs_type = "i32", db_type = "Integer")]
pub enum Color {
    Black = 0,
    White = 1,
}
```

## Native Database Enum

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

MySQL enum is just part of the column definition, and cannot be reused for different tables.

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
    .col(Column::new("column_name").custom("tea"))
```

If you are using Postgres, the enum has to be created in a separate `Type` statement *before defining the table*, there are two ways:

#### 1. `CREATE TYPE` statement

[Full example](https://github.com/SeaQL/sea-orm/blob/master/sea-orm-migration/tests/common/migration/m20220118_000004_create_tea_enum.rs).

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

1. Define an `ActiveEnum`

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

2. Generate `CREATE TYPE` statement

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

See also [Schema Creation Methods](https://www.sea-ql.org/SeaORM/docs/migration/writing-migration/#schema-creation-methods).

### SQLite

Enums will be mapped to strings on SQLite.

## `ActiveEnum` trait

The [`DeriveActiveEnum`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/derive.DeriveActiveEnum.html) macro implements the [`ActiveEnum`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/entity/trait.ActiveEnum.html) trait under the hood.

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
  <summary>For illustration purpose, this is roughly what the macro implements:</summary>
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

## Using ActiveEnum in Model

```rust
use sea_orm::entity::prelude::*;

// Define the `Category` active enum
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
    // Represents a db column using `Category` active enum
    pub category: Category,
    pub category_opt: Option<Category>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {}

impl ActiveModelBehavior for ActiveModel {}
```
