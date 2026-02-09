# Worker

## Notification Queue and Worker

Notification will be stored in the `sea_orm_notification` table and with a column named `sent` to indicate the notification has been sent or not. A background task will send all pending notification in sequence from old to new, the source code is available at [sea-orm-notify/src/lib.rs](https://github.com/SeaQL/sea-orm-pro-plus/blob/main/sea-orm-notify/src/lib.rs).

The background task should be spawned during the initialization of the Loco app in [app.rs](https://github.com/SeaQL/sea-orm-pro-plus/blob/main/src/app.rs#L47):

```rust
pub struct App;
#[async_trait]
impl Hooks for App {
    // ...

    async fn initializers(ctx: &AppContext) -> Result<Vec<Box<dyn Initializer>>> {
        let initializers: Vec<Box<dyn Initializer>> =
            vec![Box::new(initializers::graphql::GraphQLInitializer)];

        sea_orm_notify::run_background_task(ctx.db.clone());

        Ok(initializers)
    }

    // ...
}
```

## Notification Status

The ✅ checkmark indicates that the notification was sent successfully.

You can click the `⟳` (Resend) button to resend the notification immediately.

![](../../static/img/webhook_trigger_0010.png)
