# Enumeration

You can use Rust enums in model where the values are mapped to a database string, integer or native enum.

### String

```rust
#[derive(EnumIter, DeriveActiveEnum)]
#[sea_orm(rs_type = "String", db_type = "String(Some(1))")]
pub enum Category {
    #[sea_orm(string_value = "B")]
    Big,
    #[sea_orm(string_value = "S")]
    Small,
}
```

### Integers

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
    .table(Posts::TableName)
    .col(
        ColumnDef::new(Posts::ColumnName)
            .enumeration(Alias::new("tea"), [Alias::new("EverydayTea"), Alias::new("BreakfastTea")]),
    )

"CREATE TABLE `table_name` (`column_name` ENUM('EverydayTea', 'BreakfastTea'))",
```

### Postgres

If you are using Postgres, the enum has to be created in a separate `Type` statement in a migration, you can create it with:

#### 1. Custom TYPE statement

[Full example](https://github.com/SeaQL/sea-orm/blob/master/sea-orm-migration/tests/common/migration/m20220118_000004_create_tea_enum.rs).

```rust
// run this in migration:

manager
    .create_type(
        // CREATE TYPE "tea" AS ENUM ('EverydayTea', 'BreakfastTea')
        Type::create()
            .as_enum(Alias::new("tea"))
            .values([Alias::new("EverydayTea"), Alias::new("BreakfastTea")])
            .to_owned(),
    )
    .await?;
```

#### 2. `create_enum_from_active_enum`

```rust
// we can do this in migration:

use sea_orm::{Schema, DbBackend};
let schema = Schema::new(DbBackend::Postgres);

manager
    .create_type(
        // CREATE TYPE "tea" AS ENUM ('EverydayTea', 'BreakfastTea')
        schema.create_enum_from_active_enum::<Tea>(),
    )
    .await?;
```

## Implementations

You can implement [`ActiveEnum`](https://docs.rs/sea-orm/*/sea_orm/entity/trait.ActiveEnum.html) by using the [`DeriveActiveEnum`](https://docs.rs/sea-orm/*/sea_orm/derive.DeriveActiveEnum.html) macro.

```rust
use sea_orm::entity::prelude::*;

#[derive(Debug, PartialEq, Eq, EnumIter, DeriveActiveEnum)]
#[sea_orm(
    rs_type = "String",
    db_type = "String(Some(1))",
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

## Using ActiveEnum on Model

```rust
use sea_orm::entity::prelude::*;

// Define the `Category` active enum
#[derive(Debug, Clone, PartialEq, Eq, EnumIter, DeriveActiveEnum)]
#[sea_orm(rs_type = "String", db_type = "String(Some(1))")]
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
