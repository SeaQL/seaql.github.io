# Worker

## Notification Queue and Worker

Notification will be stored in the `sea_orm_notification` table and with a column named `sent` to indicate the notification has been sent or not. A background task will send all pending notification in sequence from old to new, the sourcecode is available at [sea-orm-notify/src/lib.rs](https://github.com/SeaQL/sea-orm-pro-plus/blob/bac0398e8c91a0f7ac72343425ddc551c5ddce1f/sea-orm-notify/src/lib.rs#L143).

The background task is invoked during the initialization of the loco-rs, [app.rs](https://github.com/SeaQL/sea-orm-pro-plus/blob/bac0398e8c91a0f7ac72343425ddc551c5ddce1f/src/app.rs#L47):

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

##  Manual Resent

You can click the "Resent" button to manually resent the notification.

![](../../static/img/webhook_trigger_0010.png)
