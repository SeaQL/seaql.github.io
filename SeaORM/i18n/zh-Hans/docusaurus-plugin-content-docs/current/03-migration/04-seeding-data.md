# 填充数据

你可以从 `SchemaManager` 中检索 `DbConn` 并根据需要执行数据操作，例如填充数据。

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

你还可以执行任何 SeaQuery 语句。

```rust
use sea_orm_migration::sea_orm::{entity::*, query::*};

// ...

#[async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        let stmt = Query::insert()
            .into_table(Cake::Table)
            .columns([Cake::Name])
            .values_panic(["Tiramisu".into()])
            .to_owned();

        manager.execute(stmt).await?;

        Ok(())
    }
}

#[derive(DeriveIden)]
pub enum Cake {
    Table,
    Id,
    Name,
}
```

## 事务性填充数据

启动一个事务并在迁移的 up 和 down 中执行 SQL。

```rust
use sea_orm_migration::sea_orm::{entity::*, query::*};

// ...

#[async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // 获取连接并启动事务
        let db = manager.get_connection();
        let txn = db.begin().await?;

        cake::ActiveModel {
            name: Set("Cheesecake".to_owned()),
            ..Default::default()
        }
        .insert(&txn)
        .await?;

        // 提交
        txn.commit().await?;

        Ok(())
    }
}