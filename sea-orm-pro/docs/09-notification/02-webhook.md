# Webhook

## Schema

A webhook has the following fields:

```rust
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "sea_orm_webhook")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: WebhookId, // uniquely identify the webhook
    pub platform: WebhookPlatform, // can be Slack / MsTeams
    pub url: String, // webhook URL
}
```

## Config Webhook in Admin Panel

Login to the admin dashboard. If you have read & update permission of the `sea_orm_webhook` table, you should able to see the "Webhook Settings" page appear on the left:

![](webhook_update_0010.png)

You can perform quick update of webhook URL here.

![](webhook_update_0020.png)

Double check the webhook URL is correct.

![](webhook_update_0030.png)

## Config Webhook programatically

You can also create new webhooks using database migration, such as [m20260101_000001_webhook.rs](https://github.com/SeaQL/sea-orm-pro-plus/blob/main/migration/src/m20260101_000001_webhook.rs):

```rust
use sea_orm::{ActiveModelTrait, EntityName, NotSet, Set};
use sea_orm_migration::prelude::*;
use sea_orm_notify::entity::{notification, webhook::{self, WebhookPlatform}};
use sea_orm_rbac::context::RbacContext;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        let db = manager.get_connection();
        sea_orm_notify::create_tables(db).await?;

        webhook::ActiveModel {
            id: NotSet,
            platform: Set(WebhookPlatform::MsTeams),
            url: Set("https://teams.microsoft.com/12345678".to_owned()),
        }
        .insert(db)
        .await?;

        webhook::ActiveModel {
            id: NotSet,
            platform: Set(WebhookPlatform::Slack),
            url: Set("https://hooks.slack.com/12345678".to_owned()),
        }
        .insert(db)
        .await?;

        // ...
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // ...
    }
}
```

## Setup Webhook for Slack

1. Visit https://api.slack.com/apps?new_app=1, click "From scratch".

![](../../static/img/webhook_setup_slack_0010.png)

2. Enter App Name and select the Workspace you wish to deploy on.

![](../../static/img/webhook_setup_slack_0020.png)

3. App created. You should see the "Incoming Webhooks" option on the left navigation click on it.

![](../../static/img/webhook_setup_slack_0030.png)

4. Turn on the "Incoming Webhooks". The web page should refresh automatically.

![](../../static/img/webhook_setup_slack_0040.png)

5. Click on the "Add New Webhook".

![](../../static/img/webhook_setup_slack_0050.png)

6. Select a channel that the app will post to, then select "Authorize".

![](../../static/img/webhook_setup_slack_0060.png)

7. Then you should see the webhook URL like

```md
https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX
```

## Setup Webhook for Microsoft Teams

1. Visit https://make.powerautomate.com/flows to create a new "Automated cloud flow".

![](../../static/img/webhook_setup_teams_0010.png)

2. Enter the name of the webhook then press "Skip".

![](../../static/img/webhook_setup_teams_0020.png)

3. Click to add a trigger.

![](../../static/img/webhook_setup_teams_0030.png)

4. The search and select the trigger: "When a Teams webhook request is received".

![](../../static/img/webhook_setup_teams_0040.png)

5. Allow "Anyone" to trigger the webhook.

![](../../static/img/webhook_setup_teams_0041.png)

6. When a webhook request is received, we would first perform the "Apply to each" action.

![](../../static/img/webhook_setup_teams_0050.png)

7. We would take the input from the webhook request and loop through it. Click the "Flash Icon".

![](../../static/img/webhook_setup_teams_0060.png)

8. Then, select the "Attachments" attribute.

![](../../static/img/webhook_setup_teams_0070.png)

9. Inside each iteration we will post a message to specific Teams chat / channel. Search and select the "Post a message in a chat or channel" action.

![](../../static/img/webhook_setup_teams_0080.png)

10. Select post in "Group chat".

![](../../static/img/webhook_setup_teams_0090.png)

11. For the conversation ID, you can find it on Microsoft Teams. Select a chat / channel then "Copy link", it will copy the link to to pasteboard, paste it to a text editor to view the link. 

```md
# For example the like might look like:
https://teams.cloud.microsoft/l/chat/19:meeting_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX@thread.v2/conversations

# This part of the link is the conversation ID:
19:meeting_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX@thread.v2
```

![](../../static/img/webhook_setup_teams_0100.png)

12. Copy and paste the conversation ID as a custom value.

![](../../static/img/webhook_setup_teams_0110.png)

13. For the message body, click the "Fx Icon" to add an expression.

![](../../static/img/webhook_setup_teams_0120.png)

14. Select "Dynamic content" then click on "Attachment Item".

![](../../static/img/webhook_setup_teams_0130.png)

15. Type directly in the textarea and make as "`items('Apply_to_each')['content']['type']`" then press add.

![](../../static/img/webhook_setup_teams_0131.png)

16. Save the "Automated cloud flow".

![](../../static/img/webhook_setup_teams_0140.png)

17. After saving, we can now copy the webhook URL for integration.

```md
# The wehbook URL should look like:
https://defaultXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.XX.environment.api.powerplatform.com:443/powerautomate/automations/direct/workflows/XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/triggers/manual/paths/invoke?api-version=1&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=XXXXXXXXXXXXX-XXXXXXXXXXXXXXXXXXXXXXXXXXXXX
```

![](../../static/img/webhook_setup_teams_0141.png)

18. You can view the execution log and status here.

![](../../static/img/webhook_setup_teams_0150.png)

![](../../static/img/webhook_setup_teams_0160.png)
