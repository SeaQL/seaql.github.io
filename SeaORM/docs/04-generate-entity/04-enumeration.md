# Enumeration

You can use Rust enums in model where the values are mapped to a database string, integer or native enum.

### String

For string enums, in addition to being able to specify the string value for each variant, you can also specify the `rename_all` attribute on the Enum if all the values should have string values based on case-transformations.

#### Manual string values

```rust
#[derive(EnumIter, DeriveActiveEnum)]
#[sea_orm(rs_type = "String", db_type = "String(StringLen::N(1))")]
pub enum Category {
    #[sea_orm(string_value = "B")]
    Big,
    #[sea_orm(string_value = "S")]
    Small,
}
```

#### Derived string values from variants

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

The above is equivalent to:

```rust
#[derive(EnumIter, DeriveActiveEnum)]
#[sea_orm(rs_type = "String", db_type = "String(StringLen::None)", rename_all = "camelCase")]
pub enum Category {
    BigTask,
    SmallWork,
}
```

<details>
    <summary>You can find a list of valid values for the `rename_all` attribute below</summary>

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

#### 1. `TYPE` statement

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
This method will provide an interface for adding the type to the database, using the type for table columns, and adding values of this type to rows when seeding data. 

1. Define an `ActiveEnum`

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

2. Create the type in the database

```rust
use sea_orm::{Schema, DbBackend};

// in a migration:
let schema = Schema::new(DbBackend::Postgres);

manager
    .create_type(
        // CREATE TYPE "tea_type" AS ENUM ('EverydayTea', 'BreakfastTea')
        schema.create_enum_from_active_enum::<TeaType>(),
    )
    .await?;
```

3. Use the type as a table column type when creating a table

```rust diff
// in a migration:

manager::create()
    .table(Tea::Table)
    .if_not_exists()
    .col(Column::new(Tea::Type).custom(TeaType::name())) // use the type for a table column 
    // ... more columns
```
> see also [Schema Creation Methods - Create Table](https://www.sea-ql.org/SeaORM/docs/migration/writing-migration/#schema-creation-methods)

4. Use the type when populating the database

```rust
// in a migration

let insert = Query::insert()
    .into_table(Tea::Table)
    .columns([Tea::TeaType])
    .values_panic([TeaType::EverydayTea.as_enum()]) // call `as_enum` to convert the variant into a SimpleExpr
    .to_owned();

manager.exec_stmt(insert).await?;
// ...
```
> see also [Seeding Data - with sea_query statement](https://www.sea-ql.org/SeaORM/docs/migration/seeding-data/#:~:text=write%20SeaQuery%20statement%20to%20seed%20the%20table)

## Implementations

You can implement [`ActiveEnum`](https://docs.rs/sea-orm/*/sea_orm/entity/trait.ActiveEnum.html) by using the [`DeriveActiveEnum`](https://docs.rs/sea-orm/*/sea_orm/derive.DeriveActiveEnum.html) macro.

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

## Using ActiveEnum on Model

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
