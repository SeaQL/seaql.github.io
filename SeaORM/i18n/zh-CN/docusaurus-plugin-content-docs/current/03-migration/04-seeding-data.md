# 填充数据

你可以从 `SchemaManager` 获取 `DbConn`，并按需执行数据操作，例如填充数据。

```rust
use sea_orm_migration::sea_orm::{entity::*, query::*};

// ...

#[async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        let db = manager.get_connection();

        cake::ActiveModel {
            name: Set("Cheesecake".to_owned()),
            ..Default::default()
        }
        .insert(db)
        .await?;

        Ok(())
    }
}
```

你也可以执行任意 SeaQuery 语句。

```rust
use sea_orm_migration::sea_orm::{entity::*, query::*};

// ...

#[async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        let stmt = Query::insert()
            .into_table("cake")
            .columns(["name"])
            .values_panic(["Tiramisu".into()])
            .to_owned();

        manager.execute(&stmt).await?;

        Ok(())
    }
}
```

## 在事务中填充数据

在迁移的 up 和 down 中开启事务并执行 SQL。

```rust
use sea_orm_migration::sea_orm::{entity::*, query::*};

// ...

#[async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // Get the connection and start a transaction
        let db = manager.get_connection();
        let txn = db.begin().await?;

        cake::ActiveModel {
            name: Set("Cheesecake".to_owned()),
            ..Default::default()
        }
        .insert(&txn)
        .await?;

        // Commit it
        txn.commit().await?;

        Ok(())
    }
}
```
