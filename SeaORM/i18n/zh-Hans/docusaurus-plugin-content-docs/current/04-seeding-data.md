# Seeding Data

You can retrieve a `DbConn` from `SchemaManager` and perform data operations as needed, for example, to seed data.

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

You can also execute any SeaQuery statement.

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

## Seeding Data Transactionally

Starts a transaction and execute SQL inside migration up and down.

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
