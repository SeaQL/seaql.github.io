# Seeding Data

You can retrieve a `DbConn` from `SchemaManager` and perform data operations as needed, for example, to seed data.

```rust
use sea_orm_migration::sea_orm::{entity::*, query::*};

// ...

#[async_trait::async_trait]
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