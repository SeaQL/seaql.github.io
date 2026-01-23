# Overview

#### 1. Application wide

Notifications are not personalized, any user with `select` permission of `sea_orm_notification` table can view them.

Design: Application level notification center.

#### 2. Action based

When a database row is created or updated, a notification is triggered and sent via the predefined webhook.

Design: Stay informed with the latest updates.

#### 3. Unicast / Multicast

Notification can be channelled to one or many webhooks. Customize your notification trigger on when and what to sent.

Design: Broadcast notifications to group(s) of users.

#### 4. Background worker

A background worker monitors pending notifications and delivers them promptly.

Design: Notifications are deliver in the background asynchronously.
