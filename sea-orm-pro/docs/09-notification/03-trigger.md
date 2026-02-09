# Trigger

## Define `after_save` Trigger

A common place to trigger notification is right after a database row being inserted or updated. For example in [`address.rs`](https://github.com/SeaQL/sea-orm-pro-plus/blob/main/src/models/address.rs), we will trigger a notification after every successful insert or update:

```rust
#[async_trait::async_trait]
impl ActiveModelBehavior for ActiveModel {
    async fn after_save<C>(model: Model, db: &C, insert: bool) -> Result<Model, DbErr>
    where
        C: ConnectionTrait,
    {
        let action = if insert { "Inserted" } else { "Updated" };
        let message = format!("{action} Address Model ID: {}", model.address_id);
        sea_orm_notify::notify_all(db, &message).await?;
        tracing::info!("{message}");
        Ok(model)
    }
}
```

Of course these triggers can also be defined at individual API endpoints, where access to `DatabaseConnection` is provided.

## Unicast / Multicast

There are two methods to send notification, they are defined in [`sea-orm-notify/src/lib.rs`](https://github.com/SeaQL/sea-orm-pro-plus/blob/main/sea-orm-notify/src/lib.rs):

```rust
// Send the notification to all webhook
sea_orm_notify::notify_all(db, message).await?;

// Send the notification to a specific webhook only
sea_orm_notify::notify(db, WebhookId(1), message).await?;
```

## Formatting Messages

You can format the notification messages with basic markdown.

Note that Slack has their own [dialect](https://docs.slack.dev/messaging/formatting-message-text/).
On MS Teams, a subset of [HTML](https://learn.microsoft.com/en-us/microsoftteams/platform/resources/bot-v3/bots-text-formats) is supported. SeaORM Pro automatically compiles markdown to HTML when sending via Teams.
