# Create Enum

You can generate SQL statement to create database tables with enum columns via the [`Schema`](https://docs.rs/sea-orm/0.5/sea_orm/schema/struct.Schema.html) helper struct.

## String & Integer Enum

This is just an ordinary string / integer column in database table that maps to Rust enum, you can simply use the [`Schema::create_table_from_entity`](https://docs.rs/sea-orm/0.5/sea_orm/schema/struct.Schema.html#method.create_table_from_entity) method to construct a table create statement just like in the previous section.

Defining the `Entity` and enums.

```rust
pub mod active_enum {
    use sea_orm::entity::prelude::*;
    
    #[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
    #[sea_orm(schema_name = "public", table_name = "active_enum")]
    pub struct Model {
        #[sea_orm(primary_key)]
        pub id: i32,
        pub category: Option<Category>,
        pub color: Option<Color>,
    }
    
    #[derive(Debug, Clone, PartialEq, EnumIter, DeriveActiveEnum)]
    #[sea_orm(rs_type = "String", db_type = "String(Some(1))")]
    pub enum Category {
        #[sea_orm(string_value = "B")]
        Big,
        #[sea_orm(string_value = "S")]
        Small,
    }
    
    #[derive(Debug, Clone, PartialEq, EnumIter, DeriveActiveEnum)]
    #[sea_orm(rs_type = "i32", db_type = "Integer")]
    pub enum Color {
        #[sea_orm(num_value = 0)]
        Black,
        #[sea_orm(num_value = 1)]
        White,
    }
    
    #[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
    pub enum Relation {}
    
    impl ActiveModelBehavior for ActiveModel {}
}
```

Generating [`TableCreateStatement`](https://docs.rs/sea-query/*/sea_query/table/struct.TableCreateStatement.html) from `Entity`.

```rust
use sea_orm::{sea_query, Schema};

let builder = db.get_database_backend();
let schema = Schema::new(builder);

assert_eq!(
    builder.build(&schema.create_table_from_entity(active_enum::Entity)),
    builder.build(
        &sea_query::Table::create()
            .table(active_enum::Entity.table_ref())
            .col(
                sea_query::ColumnDef::new(active_enum::Column::Id)
                    .integer()
                    .not_null()
                    .auto_increment()
                    .primary_key(),
            )
            .col(sea_query::ColumnDef::new(active_enum::Column::Category).string_len(1))
            .col(sea_query::ColumnDef::new(active_enum::Column::Color).integer())
            .to_owned()
    )
);
```

## Native Database Enum

The enum support are different across databases. We will explain the creation of native database enum for each databases one by one.

Defining the `Entity` and enums.

```rust
pub mod active_enum {
    use sea_orm::entity::prelude::*;
    
    #[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
    #[sea_orm(schema_name = "public", table_name = "active_enum")]
    pub struct Model {
        #[sea_orm(primary_key)]
        pub id: i32,
        pub tea: Option<Tea>,
    }
    
    #[derive(Debug, Clone, PartialEq, EnumIter, DeriveActiveEnum)]
    #[sea_orm(rs_type = "String", db_type = "Enum", enum_name = "tea")]
    pub enum Tea {
        #[sea_orm(string_value = "EverydayTea")]
        EverydayTea,
        #[sea_orm(string_value = "BreakfastTea")]
        BreakfastTea,
    }
    
    #[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
    pub enum Relation {}
    
    impl ActiveModelBehavior for ActiveModel {}
}
```

### PostgreSQL

Enum in PostgreSQL is defined as a custom type, it can be created from an `Entity` with the [`Schema::create_enum_from_entity`](https://docs.rs/sea-orm/0.5/sea_orm/schema/struct.Schema.html#method.create_enum_from_entity) method.

You can also create it directly from `ActiveEnum` with the [`Schema::create_enum_from_active_enum`](https://docs.rs/sea-orm/0.5/sea_orm/schema/struct.Schema.html#method.create_enum_from_active_enum) method.

```rust
use sea_orm::{Schema, Statement};

let db_postgres = DbBackend::Postgres;
let schema = Schema::new(db_postgres);

assert_eq!(
    schema
        .create_enum_from_entity(active_enum::Entity)
        .iter()
        .map(|stmt| db_postgres.build(stmt))
        .collect::<Vec<_>>(),
    vec![Statement::from_string(
        db_postgres,
        r#"CREATE TYPE "tea" AS ENUM ('EverydayTea', 'BreakfastTea')"#.to_owned()
    ),]
);

assert_eq!(
    db_postgres.build(&schema.create_enum_from_active_enum::<Tea>()),
    Statement::from_string(
        db_postgres,
        r#"CREATE TYPE "tea" AS ENUM ('EverydayTea', 'BreakfastTea')"#.to_owned()
    )
);

assert_eq!(
    db_postgres.build(&schema.create_table_from_entity(active_enum::Entity)),
    Statement::from_string(
        db_postgres,
        vec![
            r#"CREATE TABLE "public"."active_enum" ("#,
            r#""id" serial NOT NULL PRIMARY KEY,"#,
            r#""tea" tea"#,
            r#")"#,
        ]
        .join(" ")
    ),
);
```

### MySQL

In MySQL, enum is defined on table creation so you only need the [`Schema::create_table_from_entity`](https://docs.rs/sea-orm/0.5/sea_orm/schema/struct.Schema.html#method.create_table_from_entity) method.

```rust
use sea_orm::{Schema, Statement};

let db_mysql = DbBackend::MySql;
let schema = Schema::new(db_mysql);

assert_eq!(
    db_mysql.build(&schema.create_table_from_entity(active_enum::Entity)),
    Statement::from_string(
        db_mysql,
        vec![
            "CREATE TABLE `active_enum` (",
            "`id` int NOT NULL AUTO_INCREMENT PRIMARY KEY,",
            "`tea` ENUM('EverydayTea', 'BreakfastTea')",
            ")",
        ]
        .join(" ")
    ),
);
```

### SQLite

Enum is not supported in SQLite so it will be stored as `TEXT` type.

```rust
use sea_orm::{Schema, Statement};

let db_sqlite = DbBackend::Sqlite;
let schema = Schema::new(db_sqlite);

assert_eq!(
    db_sqlite.build(&schema.create_table_from_entity(active_enum::Entity)),
    Statement::from_string(
        db_sqlite,
        vec![
            "CREATE TABLE `active_enum` (",
            "`id` integer NOT NULL PRIMARY KEY AUTOINCREMENT,",
            "`tea` text",
            ")",
        ]
        .join(" ")
    ),
);
```
