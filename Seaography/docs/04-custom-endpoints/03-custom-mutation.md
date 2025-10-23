# Custom Mutation

## Simple operations

```rust
#[CustomFields]
impl Operations {
    async fn hello(_ctx: &Context<'_>, name: String) -> async_graphql::Result<String> {
        Ok(format!("Hello, {}!", name))
    }

    async fn sum(_ctx: &Context<'_>, x: i32, y: i32) -> async_graphql::Result<i32> {
        Ok(x + y)
    }

    async fn verify(ctx: &Context<'_>, token: String) -> async_graphql::Result<profile::Model> {
        let db = ctx.data::<DatabaseConnection>()?;
        let session = ctx.data::<Session>()?;
        verify_user_token(session.user_id, &token)?;
        // verification succeeds, return user profile
        Ok(profile::Entity::find_by_user_id(session.user_id)
            .one(db)
            .await?
            .ok_or_else(|| DbErr::RecordNotFound("Profile not found".into()))?)
    }
}
```

## Handling Uploads

Refer to `async-graphql` [documentation](https://docs.rs/async-graphql/latest/async_graphql/types/struct.Upload.html) for more info.

```rust
use async_graphql::Upload;

#[CustomFields]
impl Operations {
    async fn upload(ctx: &Context<'_>, upload: Upload) -> async_graphql::Result<String> {
        Ok(format!(
            "uploaded: filename={}",
            upload.value(ctx).unwrap().filename
        ))
    }
}
```

## Custom Mutation with Custom Input

Say we want to create a transactional endpoint for staff members in store to handle customer rentals.

First we can design the data structures for the input form:

```rust
use sea_orm::entity::prelude::{DateTimeUtc};
use seaography::{async_graphql, CustomFields, CustomInputType};

#[derive(Clone, CustomInputType)]
pub struct RentalRequest {
    pub customer: String,
    pub film: String,
    pub coupon: Option<Coupon>, // ⬅ nested objects are supported
    pub timestamp: DateTimeUtc,
}

#[derive(Clone, CustomInputType)]
pub struct Coupon {
    pub code: String,
    pub points: Option<Decimal>,
}
```

Then we can define the mutation endpoint:

```rust
#[CustomFields]
impl Operations {
    async fn rental_request(
        ctx: &Context<'_>,
        rental_request: RentalRequest,
        //              ⬆ our custom input struct
    ) -> async_graphql::Result<rental::Model> {
        //                     ⬆ a normal SeaORM Model
        let db = ctx.data::<DatabaseConnection>()?;
        let session = ctx.data::<Session>()?;
        let txn = db.begin().await?;
        //  ⬆ create a transaction to make operation atomic

        let customer = Customer::find_by_name(rental_request.customer, &txn).await?;
        let film = Film::find_by_name(rental_request.film, &txn).await?;
        //  ⬆ helper methods to find the corresponding customer and film

        //  ⬇ find if there is inventory in current store
        let inventory = Inventory::find()
            .filter(inventory::Column::FilmId.eq(film.id))
            .filter(inventory::Column::StoreId.eq(session.store_id))
            .one(&txn)
            .unwrap_or(Error::NoInventory)?;
        //  ⬆ return error if no inventory

        let rental = rental::ActiveModel {
            rental_date: Set(rental_request.timestamp),
            inventory_id: Set(inventory.id),
            customer_id: Set(customer.id),
            staff_id: Set(session.staff_id), // ⬅ current staff
            last_update: Set(Utc::now()),
            ..Default::default()
        }.insert(&txn).await?;

        inventory.delete(&txn).await?;
        //       ⬆ now remove it from inventory
        txn.commit().await?;
        // ⬇ return the newly created rental record
        Ok(rental)
    }
}
```
