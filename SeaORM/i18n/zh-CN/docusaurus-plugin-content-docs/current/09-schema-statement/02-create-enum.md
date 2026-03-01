# 创建枚举

你可以通过 [`Schema`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/schema/struct.Schema.html) 辅助 struct 生成用于创建带枚举列的数据库表的 SQL 语句。

## 字符串和整数枚举

这只是映射到 Rust 枚举的普通字符串/整数列。示例 entity 定义：

```rust title="active_enum.rs"
use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(schema_name = "public", table_name = "active_enum")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub category: Option<Category>,
    pub color: Option<Color>,
}

#[derive(Debug, Clone, PartialEq, Eq, EnumIter, DeriveActiveEnum)]
#[sea_orm(rs_type = "String", db_type = "String(StringLen::N(1))")]
pub enum Category {
    #[sea_orm(string_value = "B")]
    Big,
    #[sea_orm(string_value = "S")]
    Small,
}

#[derive(Debug, Clone, PartialEq, Eq, EnumIter, DeriveActiveEnum)]
#[sea_orm(rs_type = "i32", db_type = "Integer")]
pub enum Color {
    #[sea_orm(num_value = 0)]
    Black,
    #[sea_orm(num_value = 1)]
    White,
}
```

作为说明，这些枚举只是普通的数据库列。

```rust
use sea_orm::{sea_query, Schema};

let builder = db.get_database_backend();
let schema = Schema::new(builder);

assert_eq!(
    builder.build(&schema.create_table_from_entity(active_enum::Entity)),
    builder.build(
        &sea_query::Table::create()
            .table(active_enum::Entity.table_ref())
            .col(pk_auto(active_enum::Column::Id))
            .col(string_len(active_enum::Column::Category, 1))
            .col(integer(active_enum::Column::Color))
            .to_owned()
    )
);
```

<details>
    <summary>注意，不符合 UAX#31 的字符将按如下所示进行转换。</summary>

```rust
#[derive(Clone, Debug, PartialEq, EnumIter, DeriveActiveEnum)]
#[sea_orm(rs_type = "String", db_type = "String(StringLen::None)")]
pub enum StringValue {
    #[sea_orm(string_value = "")]
    Member1,
    #[sea_orm(string_value = "$")]
    Member2,
    #[sea_orm(string_value = "$$")]
    Member3,
    #[sea_orm(string_value = "AB")]
    Member4,
    #[sea_orm(string_value = "A_B")]
    Member5,
    #[sea_orm(string_value = "A$B")]
    Member6,
    #[sea_orm(string_value = "0 123")]
    Member7,
}

// The following will be generated
pub enum StringValueVariant {
    __Empty,
    _0x24,
    _0x240x24,
    Ab,
    A0x5Fb,
    A0x24B,
    _0x300x20123,
}
```
</details>

## 原生数据库枚举

枚举支持因数据库而异。让我们逐一介绍。

考虑以下 entity：

```rust title="active_enum.rs"
use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(schema_name = "public", table_name = "active_enum")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub tea: Option<Tea>,
}

#[derive(Debug, Clone, PartialEq, Eq, EnumIter, DeriveActiveEnum)]
#[sea_orm(rs_type = "String", db_type = "Enum", enum_name = "tea")]
pub enum Tea {
    #[sea_orm(string_value = "EverydayTea")]
    EverydayTea,
    #[sea_orm(string_value = "BreakfastTea")]
    BreakfastTea,
}
```

注意 `db_type` 和额外的 `enum_name` 属性。

### PostgreSQL

PostgreSQL 中的枚举由 [`TypeCreateStatement`](https://docs.rs/sea-query/*/sea_query/extension/postgres/struct.TypeCreateStatement.html) 定义，可以使用 [`Schema::create_enum_from_entity`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/schema/struct.Schema.html#method.create_enum_from_entity) 方法从 `Entity` 创建。

你也可以使用 [`Schema::create_enum_from_active_enum`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/schema/struct.Schema.html#method.create_enum_from_active_enum) 方法从 `ActiveEnum` 创建。

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
    [Statement::from_string(
        db_postgres,
        r#"CREATE TYPE "tea" AS ENUM ('EverydayTea', 'BreakfastTea')"#
    ),]
);

assert_eq!(
    db_postgres.build(&schema.create_enum_from_active_enum::<Tea>().expect("Postgres only")),
    Statement::from_string(
        db_postgres,
        r#"CREATE TYPE "tea" AS ENUM ('EverydayTea', 'BreakfastTea')"#
    )
);

assert_eq!(
    db_postgres.build(&schema.create_table_from_entity(active_enum::Entity)),
    Statement::from_string(
        db_postgres,
        [
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

在 MySQL 中，枚举在创建表时定义，因此你只需调用一次 [`Schema::create_table_from_entity`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/schema/struct.Schema.html#method.create_table_from_entity)。

```rust
use sea_orm::{Schema, Statement};

let db_mysql = DbBackend::MySql;
let schema = Schema::new(db_mysql);

assert_eq!(
    db_mysql.build(&schema.create_table_from_entity(active_enum::Entity)),
    Statement::from_string(
        db_mysql,
        [
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

SQLite 不支持枚举，因此将存储为 `TEXT`。

```rust
use sea_orm::{Schema, Statement};

let db_sqlite = DbBackend::Sqlite;
let schema = Schema::new(db_sqlite);

assert_eq!(
    db_sqlite.build(&schema.create_enum_from_entity(active_enum::Entity)),
    Statement::from_string(
        db_sqlite,
        [
            "CREATE TABLE `active_enum` (",
            "`id` integer NOT NULL PRIMARY KEY AUTOINCREMENT,",
            "`tea` text",
            ")",
        ]
        .join(" ")
    ),
);
```
