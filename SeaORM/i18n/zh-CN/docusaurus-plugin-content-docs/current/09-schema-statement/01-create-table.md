# 创建表

:::tip Rustacean 贴纸包 🦀
[我们的贴纸](https://www.sea-ql.org/sticker-pack/cn/)采用优质防水乙烯基制成，具有独特的哑光效果。
将它们贴在笔记本电脑、笔记本或任何小工具上，展示你对 Rust 的热爱！
:::

要在数据库中创建表，你可以使用 [`Schema::create_table_from_entity`](https://docs.rs/sea-orm/2.0.0/sea_orm/schema/struct.Schema.html#method.create_table_from_entity) 从 `Entity` 派生，而不是手动编写 [`TableCreateStatement`](https://docs.rs/sea-query/*/sea_query/table/struct.TableCreateStatement.html)。此方法将帮助你创建包括 `Entity` 中定义的所有列和外键约束的数据库表。

下面我们使用 [`CakeFillingPrice`](https://github.com/SeaQL/sea-orm/blob/master/src/tests_cfg/cake_filling_price.rs) entity 演示其生成的 SQL 语句。你可以使用 [`TableCreateStatement`](https://docs.rs/sea-query/*/sea_query/table/struct.TableCreateStatement.html) 构建相同的语句。

注意，自 `0.7.0` 版本起，[`Schema::create_table_from_entity`](https://docs.rs/sea-orm/2.0.0/sea_orm/schema/struct.Schema.html#method.create_table_from_entity) 不再创建 index。如果需要在数据库中创建 index，请查看[此处](09-schema-statement/03-create-index.md)了解详情。

```rust
use sea_orm::{sea_query::*, tests_cfg::*, EntityName, Schema};

let builder = db.get_database_backend();
let schema = Schema::new(builder);

assert_eq!(
    builder.build(&schema.create_table_from_entity(CakeFillingPrice)),
    builder.build(
        &Table::create()
            .table(CakeFillingPrice.table_ref())
            .col(integer(cake_filling_price::Column::CakeId))
            .col(integer(cake_filling_price::Column::FillingId))
            .col(decimal(cake_filling_price::Column::Price))
            .primary_key(
                Index::create()
                    .name("pk-cake_filling_price")
                    .col(cake_filling_price::Column::CakeId)
                    .col(cake_filling_price::Column::FillingId)
                    .primary(),
            )
            .foreign_key(
                ForeignKeyCreateStatement::new()
                    .name("fk-cake_filling_price-cake_id-filling_id")
                    .from_tbl(CakeFillingPrice)
                    .from_col(cake_filling_price::Column::CakeId)
                    .from_col(cake_filling_price::Column::FillingId)
                    .to_tbl(CakeFilling)
                    .to_col(cake_filling::Column::CakeId)
                    .to_col(cake_filling::Column::FillingId),
            )
            .to_owned()
    )
);
```

为了进一步说明，我们将在下面以字符串形式展示 SQL 语句。

- PostgreSQL
    ```rust
    use sea_orm::{tests_cfg::*, DbBackend, Schema, Statement};

    let db_postgres = DbBackend::Postgres;
    let schema = Schema::new(db_postgres);

    assert_eq!(
        db_postgres.build(&schema.create_table_from_entity(CakeFillingPrice)),
        Statement::from_string(
            db_postgres,
            [
                r#"CREATE TABLE "public"."cake_filling_price" ("#,
                r#""cake_id" integer NOT NULL,"#,
                r#""filling_id" integer NOT NULL,"#,
                r#""price" decimal NOT NULL,"#,
                r#"CONSTRAINT "pk-cake_filling_price" PRIMARY KEY ("cake_id", "filling_id"),"#,
                r#"CONSTRAINT "fk-cake_filling_price-cake_id-filling_id" FOREIGN KEY ("cake_id", "filling_id") REFERENCES "cake_filling" ("cake_id", "filling_id")"#,
                r#")"#,
            ]
            .join(" ")
        )
    );
    ```

- MySQL
    ```rust
    use sea_orm::{tests_cfg::*, DbBackend, Schema, Statement};

    let db_mysql = DbBackend::MySql;
    let schema = Schema::new(db_mysql);

    assert_eq!(
        db_mysql.build(&schema.create_table_from_entity(CakeFillingPrice)),
        Statement::from_string(
            db_mysql,
            [
                "CREATE TABLE `cake_filling_price` (",
                "`cake_id` int NOT NULL,",
                "`filling_id` int NOT NULL,",
                "`price` decimal NOT NULL,",
                "PRIMARY KEY `pk-cake_filling_price` (`cake_id`, `filling_id`),",
                "CONSTRAINT `fk-cake_filling_price-cake_id-filling_id` FOREIGN KEY (`cake_id`, `filling_id`) REFERENCES `cake_filling` (`cake_id`, `filling_id`)",
                ")",
            ]
            .join(" ")
        )
    );
    ```

- SQLite
    ```rust
    use sea_orm::{tests_cfg::*, DbBackend, Schema, Statement};

    let db_sqlite = DbBackend::Sqlite;
    let schema = Schema::new(db_sqlite);

    assert_eq!(
        db_sqlite.build(&schema.create_table_from_entity(CakeFillingPrice)),
        Statement::from_string(
            db_sqlite,
            [
                "CREATE TABLE `cake_filling_price` (",
                "`cake_id` integer NOT NULL,",
                "`filling_id` integer NOT NULL,",
                "`price` real NOT NULL,",
                "CONSTRAINT `pk-cake_filling_price`PRIMARY KEY (`cake_id`, `filling_id`),",
                "FOREIGN KEY (`cake_id`, `filling_id`) REFERENCES `cake_filling` (`cake_id`, `filling_id`)",
                ")",
            ]
            .join(" ")
        )
    );
    ```
