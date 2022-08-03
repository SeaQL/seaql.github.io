# Enumeration

You can use Rust enums in model where the values are mapped to a database string, integer or native enum.

- String
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

- Integer
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

- Native Database Enum
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

## Implementations

You can implement [`ActiveEnum`](https://docs.rs/sea-orm/0.6/sea_orm/entity/trait.ActiveEnum.html) manually by hand or use the derive macro [`DeriveActiveEnum`](https://docs.rs/sea-orm/0.6/sea_orm/derive.DeriveActiveEnum.html).

### Derive Implementation

See [`DeriveActiveEnum`](https://docs.rs/sea-orm/0.6/sea_orm/derive.DeriveActiveEnum.html) for the full specification of macro attributes.

```rust
use sea_orm::entity::prelude::*;

// Using the derive macro
#[derive(Debug, PartialEq, EnumIter, DeriveActiveEnum)]
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

### Manual Implementation

```rust
use sea_orm::entity::prelude::*;

// Implementing it manually
#[derive(Debug, PartialEq, EnumIter)]
pub enum Category {
    Big,
    Small,
}

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

## Using ActiveEnum on Model

```rust
use sea_orm::entity::prelude::*;

// Define the `Category` active enum
#[derive(Debug, Clone, PartialEq, EnumIter, DeriveActiveEnum)]
#[sea_orm(rs_type = "String", db_type = "String(Some(1))")]
pub enum Category {
    #[sea_orm(string_value = "B")]
    Big,
    #[sea_orm(string_value = "S")]
    Small,
}

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
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
