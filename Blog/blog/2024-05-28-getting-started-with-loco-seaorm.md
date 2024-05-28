---
slug: 2024-05-28-getting-started-with-loco-seaorm
title: Getting Started with Loco & SeaORM
author: Billy Chan
author_title: SeaQL Team
author_url: https://github.com/billy1624
author_image_url: https://avatars.githubusercontent.com/u/30400950?v=4
tags: [news]
---

In this tutorial, we would create an REST notepad backend starting from scratch and adding a new REST endpoint to handle file uploads.

The full source code can be found [here](https://github.com/SeaQL/sea-orm/tree/master/examples/loco_starter). The documentation of the REST API is available [here](https://documenter.getpostman.com/view/34752358/2sA3QmEF5q).

## What is Loco?

Loco is a Rails inspired web framework for Rust. It includes almost every Rails feature with best-effort Rust ergonomics:

- Controllers and routing via [axum](https://github.com/tokio-rs/axum)
- Models, migration, and ActiveRecord via [SeaORM](https://www.sea-ql.org/SeaORM/)
- Views via [serde](https://serde.rs/json.html)
- Seamless, Background jobs via [sidekiq-rs](https://github.com/film42/sidekiq-rs), multi modal: in process, out of process, async via Tokio
- [...and more](https://loco.rs/blog/hello-world/)

## REST API Starter Template

Install `loco-cli`:

```sh
cargo install loco-cli
```

The `loco-cli` provides three starter templates:

- SaaS Starter
- Rest API Starter
- Lightweight Service Starter

For this tutorial, we want the "Rest API Starter" template:

```sh
$ loco new

✔  You are inside a git repository. Do you wish to continue? · Yes
✔  App name? · loco_starter
✔  What would you like to build? · Rest API (with DB and user auth)

🚂 Loco app generated successfully in:
/sea-orm/examples/loco_starter
```

Next, we need to setup our PostgreSQL database.

```sh
docker run -d -p 5432:5432 -e POSTGRES_USER=loco -e POSTGRES_DB=loco_starter_development -e POSTGRES_PASSWORD="loco" postgres:15.3-alpine
```

If you want to use MySQL or SQLite as the database. Please update the `database.uri` configuration in `loco_starter/config/development.yaml`. And enable the corresponding database backend feature flag of SeaORM in `loco_starter/Cargo.toml`.

Now, start our REST application:

```sh
$ cargo loco start

    Finished `dev` profile [unoptimized + debuginfo] target(s) in 1m 42s
     Running `target/debug/loco_starter-cli start`
2024-05-20T06:56:42.724350Z  INFO app: loco_rs::config: loading environment from selected_path="config/development.yaml" environment=development
2024-05-20T06:56:42.740338Z  WARN app: loco_rs::boot: pretty backtraces are enabled (this is great for development but has a runtime cost for production. disable with `logger.pretty_backtrace` in your config yaml) environment=development
2024-05-20T06:56:42.833747Z  INFO app: loco_rs::db: auto migrating environment=development
2024-05-20T06:56:42.845983Z  INFO app: sea_orm_migration::migrator: Applying all pending migrations environment=development
2024-05-20T06:56:42.850231Z  INFO app: sea_orm_migration::migrator: Applying migration 'm20220101_000001_users' environment=development
2024-05-20T06:56:42.864095Z  INFO app: sea_orm_migration::migrator: Migration 'm20220101_000001_users' has been applied environment=development
2024-05-20T06:56:42.865799Z  INFO app: sea_orm_migration::migrator: Applying migration 'm20231103_114510_notes' environment=development
2024-05-20T06:56:42.873653Z  INFO app: sea_orm_migration::migrator: Migration 'm20231103_114510_notes' has been applied environment=development
2024-05-20T06:56:42.875645Z  INFO app: loco_rs::boot: initializers loaded initializers="" environment=development
2024-05-20T06:56:42.906072Z  INFO app: loco_rs::controller::app_routes: [GET] /api/_ping environment=development
2024-05-20T06:56:42.906176Z  INFO app: loco_rs::controller::app_routes: [GET] /api/_health environment=development
2024-05-20T06:56:42.906264Z  INFO app: loco_rs::controller::app_routes: [GET] /api/notes environment=development
2024-05-20T06:56:42.906335Z  INFO app: loco_rs::controller::app_routes: [POST] /api/notes environment=development
2024-05-20T06:56:42.906414Z  INFO app: loco_rs::controller::app_routes: [GET] /api/notes/:id environment=development
2024-05-20T06:56:42.906501Z  INFO app: loco_rs::controller::app_routes: [DELETE] /api/notes/:id environment=development
2024-05-20T06:56:42.906558Z  INFO app: loco_rs::controller::app_routes: [POST] /api/notes/:id environment=development
2024-05-20T06:56:42.906609Z  INFO app: loco_rs::controller::app_routes: [POST] /api/auth/register environment=development
2024-05-20T06:56:42.906680Z  INFO app: loco_rs::controller::app_routes: [POST] /api/auth/verify environment=development
2024-05-20T06:56:42.906753Z  INFO app: loco_rs::controller::app_routes: [POST] /api/auth/login environment=development
2024-05-20T06:56:42.906838Z  INFO app: loco_rs::controller::app_routes: [POST] /api/auth/forgot environment=development
2024-05-20T06:56:42.906931Z  INFO app: loco_rs::controller::app_routes: [POST] /api/auth/reset environment=development
2024-05-20T06:56:42.907012Z  INFO app: loco_rs::controller::app_routes: [GET] /api/user/current environment=development
2024-05-20T06:56:42.907309Z  INFO app: loco_rs::controller::app_routes: [Middleware] Adding limit payload data="5mb" environment=development
2024-05-20T06:56:42.907440Z  INFO app: loco_rs::controller::app_routes: [Middleware] Adding log trace id environment=development
2024-05-20T06:56:42.907714Z  INFO app: loco_rs::controller::app_routes: [Middleware] Adding cors environment=development
2024-05-20T06:56:42.907788Z  INFO app: loco_rs::controller::app_routes: [Middleware] Adding etag layer environment=development

                      ▄     ▀
                                 ▀  ▄
                  ▄       ▀     ▄  ▄ ▄▀
                                    ▄ ▀▄▄
                        ▄     ▀    ▀  ▀▄▀█▄
                                          ▀█▄
▄▄▄▄▄▄▄  ▄▄▄▄▄▄▄▄▄   ▄▄▄▄▄▄▄▄▄▄▄ ▄▄▄▄▄▄▄▄▄ ▀▀█
 ██████  █████   ███ █████   ███ █████   ███ ▀█
 ██████  █████   ███ █████   ▀▀▀ █████   ███ ▄█▄
 ██████  █████   ███ █████       █████   ███ ████▄
 ██████  █████   ███ █████   ▄▄▄ █████   ███ █████
 ██████  █████   ███  ████   ███ █████   ███ ████▀
   ▀▀▀██▄ ▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀  ▀▀▀▀▀▀▀▀▀▀ ██▀
       ▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀
                https://loco.rs

environment: development
   database: automigrate
     logger: debug
compilation: debug
      modes: server

listening on [::]:3000
```

From the log messages printed above, we saw:

- Database migrations have been applied
- All available REST API

To check if the application listen for requests:

```sh
$ curl --location 'http://localhost:3000/api/_ping'

{"ok":true}
```

## User Management

The starter template comes with a basic user management module.

### Registration

It is a common practice to send a verification email to the provided email. However, that would requires a SMTP server and this is not the focus of this blo post. So, I will skip the email verification:

```diff title="loco_starter/src/controllers/auth.rs"
#[debug_handler]
async fn register(
    State(ctx): State<AppContext>,
    Json(params): Json<RegisterParams>,
) -> Result<Response> {
    let res = users::Model::create_with_password(&ctx.db, &params).await;

    let user = match res {
        Ok(user) => user,
        Err(err) => {
            tracing::info!(
                message = err.to_string(),
                user_email = &params.email,
                "could not register user",
            );
            return format::json(());
        }
    };

+   // Skip email verification, all new registrations are considered verified
+   let _user = user
+       .into_active_model()
+       .verified(&ctx.db)
+       .await?;

+   // Skip sending verification email as we don't have a mail server
+   /*
    let user = user
        .into_active_model()
        .set_email_verification_sent(&ctx.db)
        .await?;

    AuthMailer::send_welcome(&ctx, &user).await?;
+   */

    format::json(())
}
```

Compile and run the application, then register a new user account:

```sh
$ curl --location 'http://localhost:3000/api/auth/register' \
--data-raw '{
    "name": "Billy",
    "email": "cwchan.billy@gmail.com",
    "password": "password"
}'

null
```

### Login

You should see there is a new row of `user` in the database.

Next, we login the user account with the corresponding email and password:

```sh
$ curl --location 'http://localhost:3000/api/auth/login' \
--data-raw '{
    "email": "cwchan.billy@gmail.com",
    "password": "password"
}'

{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJwaWQiOiIxMWQwMWFmMy02ZmUyLTQ0ZjMtODlmMC1jMDJjZWMzOTc0MWQiLCJleHAiOjE3MTY3OTU3NjR9.i1OElxy33rkorkxk6QpTG1Kg4_Q8O0jqBJ2i82nltkcQYZsLmSSnrxtdtlfdvV0ccJ3hQA3JoY9L13cjz2uSCw",
  "pid": "11d01af3-6fe2-44f3-89f0-c02cec39741d",
  "name": "Billy",
  "is_verified": true
}
```

### Authentication

The JWT token above will be used in user authentication. You must set the `Authorization` header to access any REST endpoint that requires user login.

For example, fetching the user info of the current user:

```sh
$ curl --location 'http://localhost:3000/api/user/current' \
--header 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJwaWQiOiIxMWQwMWFmMy02ZmUyLTQ0ZjMtODlmMC1jMDJjZWMzOTc0MWQiLCJleHAiOjE3MTY3OTU3NjR9.i1OElxy33rkorkxk6QpTG1Kg4_Q8O0jqBJ2i82nltkcQYZsLmSSnrxtdtlfdvV0ccJ3hQA3JoY9L13cjz2uSCw'

{
    "pid":"11d01af3-6fe2-44f3-89f0-c02cec39741d",
    "name":"Billy",
    "email":"cwchan.billy@gmail.com"
}
```

## Handling REST Requests

The starter application comes with a notes controller for the `notes` table.

### Create Notes

```sh
$ curl --location 'http://localhost:3000/api/notes' \
--header 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJwaWQiOiIxMWQwMWFmMy02ZmUyLTQ0ZjMtODlmMC1jMDJjZWMzOTc0MWQiLCJleHAiOjE3MTY3OTU3NjR9.i1OElxy33rkorkxk6QpTG1Kg4_Q8O0jqBJ2i82nltkcQYZsLmSSnrxtdtlfdvV0ccJ3hQA3JoY9L13cjz2uSCw' \
--data '{
    "title": "Getting Started with Loco & SeaORM",
    "content": "In this tutorial, we would create an REST notepad backend starting from scratch and adding a new REST endpoint to handle file uploads."
}'

{
  "created_at": "2024-05-20T08:43:45.408449",
  "updated_at": "2024-05-20T08:43:45.408449",
  "id": 1,
  "title": "Getting Started with Loco & SeaORM",
  "content": "In this tutorial, we would create an REST notepad backend starting from scratch and adding a new REST endpoint to handle file uploads."
}
```

### List Notes

```sh
$ curl --location 'http://localhost:3000/api/notes' \
--header 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJwaWQiOiIxMWQwMWFmMy02ZmUyLTQ0ZjMtODlmMC1jMDJjZWMzOTc0MWQiLCJleHAiOjE3MTY3OTU3NjR9.i1OElxy33rkorkxk6QpTG1Kg4_Q8O0jqBJ2i82nltkcQYZsLmSSnrxtdtlfdvV0ccJ3hQA3JoY9L13cjz2uSCw'

[
  {
    "created_at": "2024-05-20T08:43:45.408449",
    "updated_at": "2024-05-20T08:43:45.408449",
    "id": 1,
    "title": "Getting Started with Loco & SeaORM",
    "content": "In this tutorial, we would create an REST notepad backend starting from scratch and adding a new REST endpoint to handle file uploads."
  },
  {
    "created_at": "2024-05-20T08:45:38.973130",
    "updated_at": "2024-05-20T08:45:38.973130",
    "id": 2,
    "title": "Introducing SeaORM X",
    "content": "SeaORM X is built on top of SeaORM with support for SQL Server"
  }
]
```

### Get Notes

```sh
$ curl --location 'http://localhost:3000/api/notes/2' \
--header 'Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJwaWQiOiIxMWQwMWFmMy02ZmUyLTQ0ZjMtODlmMC1jMDJjZWMzOTc0MWQiLCJleHAiOjE3MTY3OTU3NjR9.i1OElxy33rkorkxk6QpTG1Kg4_Q8O0jqBJ2i82nltkcQYZsLmSSnrxtdtlfdvV0ccJ3hQA3JoY9L13cjz2uSCw'

{
  "created_at": "2024-05-20T08:45:38.973130",
  "updated_at": "2024-05-20T08:45:38.973130",
  "id": 2,
  "title": "Introducing SeaORM X",
  "content": "SeaORM X is built on top of SeaORM with support for SQL Server"
}
```

## Handling File Uploads

Next, we will add a file upload feature where user can upload files that is related to the notes.

### File Table Migration

Create a migration file for the new `files` table. Each row of `files` reference a specific `notes` in the database.

```rust title="loco_starter/migration/src/m20240520_173001_files.rs"
use sea_orm_migration::{prelude::*, schema::*};

use super::m20231103_114510_notes::Notes;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                table_auto(Files::Table)
                    .col(pk_auto(Files::Id))
                    .col(integer(Files::NotesId))
                    .col(string(Files::FilePath))
                    .foreign_key(
                        ForeignKey::create()
                            .name("FK_files_notes_id")
                            .from(Files::Table, Files::NotesId)
                            .to(Notes::Table, Notes::Id),
                    )
                    .to_owned(),
            )
            .await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Files::Table).to_owned())
            .await
    }
}

#[derive(DeriveIden)]
pub enum Files {
    Table,
    Id,
    NotesId,
    FilePath,
}
```

Then, we need to enable the new migration.

```diff title="loco_starter/migration/src/lib.rs"
#![allow(elided_lifetimes_in_paths)]
#![allow(clippy::wildcard_imports)]
pub use sea_orm_migration::prelude::*;

mod m20220101_000001_users;
mod m20231103_114510_notes;
+ mod m20240520_173001_files;

pub struct Migrator;

#[async_trait::async_trait]
impl MigratorTrait for Migrator {
    fn migrations() -> Vec<Box<dyn MigrationTrait>> {
        vec![
            Box::new(m20220101_000001_users::Migration),
            Box::new(m20231103_114510_notes::Migration),
+           Box::new(m20240520_173001_files::Migration),
        ]
    }
}

```

Compile and start the application, it should run our new migration on startup.

```sh
$ cargo loco start

...
2024-05-20T09:39:59.607525Z  INFO app: loco_rs::db: auto migrating environment=development
2024-05-20T09:39:59.611997Z  INFO app: sea_orm_migration::migrator: Applying all pending migrations environment=development
2024-05-20T09:39:59.621699Z  INFO app: sea_orm_migration::migrator: Applying migration 'm20240520_173001_files' environment=development
2024-05-20T09:39:59.643886Z  INFO app: sea_orm_migration::migrator: Migration 'm20240520_173001_files' has been applied environment=development
...
```

### File Model Definition

Define `files` entity model.

```rust title="loco_starter/src/models/_entities/files.rs"
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize)]
#[sea_orm(table_name = "files")]
pub struct Model {
    pub created_at: DateTime,
    pub updated_at: DateTime,
    #[sea_orm(primary_key)]
    pub id: i32,
    pub notes_id: i32,
    pub file_path: String,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::notes::Entity",
        from = "Column::NotesId",
        to = "super::notes::Column::Id"
    )]
    Notes,
}

impl Related<super::notes::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Notes.def()
    }
}
```

Implement the `ActiveModelBehavior` in the parent module.

```rust title="loco_starter/src/models/files.rs"
use sea_orm::entity::prelude::*;

use super::_entities::files::ActiveModel;

impl ActiveModelBehavior for ActiveModel {
    // extend activemodel below (keep comment for generators)
}
```

### File Controller

Controller is where we handle the file uploading, listing and viewing.

#### Upload File

The following upload handler allows multiple files to be uploaded in a single POST request.

```rust title="loco_starter/src/controllers/files.rs"
#[debug_handler]
pub async fn upload(
    auth: auth::JWT,
    Path(notes_id): Path<i32>,
    State(ctx): State<AppContext>,
    mut multipart: Multipart,
) -> Result<Response> {
    // Collect all uploaded files
    let mut files = Vec::new();

    // Iterate all files in the POST body
    while let Some(field) = multipart.next_field().await.map_err(|err| {
        tracing::error!(error = ?err,"could not readd multipart");
        Error::BadRequest("could not readd multipart".into())
    })? {
        // Get the file name
        let file_name = match field.file_name() {
            Some(file_name) => file_name.to_string(),
            _ => return Err(Error::BadRequest("file name not found".into())),
        };

        // Get the file content as bytes
        let content = field.bytes().await.map_err(|err| {
            tracing::error!(error = ?err,"could not readd bytes");
            Error::BadRequest("could not readd bytes".into())
        })?;

        // Create a folder to store the uploaded file
        let now = chrono::offset::Local::now()
            .format("%Y%m%d_%H%M%S")
            .to_string();
        let uuid = uuid::Uuid::new_v4().to_string();
        let folder = format!("{now}_{uuid}");
        let upload_folder = PathBuf::from(upload_dir).join(&folder);
        fs::create_dir_all(&upload_folder)?;

        // Write the file into the newly created folder
        let path = upload_folder.join(file_name);
        let mut f = fs::OpenOptions::new()
            .create_new(true)
            .write(true)
            .open(&path)?;
        f.write_all(&content)?;
        f.flush()?;

        // Record the file upload in database
        let file = files::ActiveModel {
            notes_id: ActiveValue::Set(notes_id),
            file_path: ActiveValue::Set(
                path.strip_prefix(upload_dir)
                    .unwrap()
                    .to_str()
                    .unwrap()
                    .to_string(),
            ),
            ..Default::default()
        }
        .insert(&ctx.db)
        .await?;

        files.push(file);
    }

    format::json(files)
}
```

#### List File

List all `files` that are related to a specific `notes_id`.

```rust title="loco_starter/src/controllers/files.rs"
#[debug_handler]
pub async fn list(
    auth: auth::JWT,
    Path(notes_id): Path<i32>,
    State(ctx): State<AppContext>,
) -> Result<Response> {
    // Fetch all files uploaded for a specific notes
    let files = files::Entity::find()
        .filter(files::Column::NotesId.eq(notes_id))
        .order_by_asc(files::Column::Id)
        .all(&ctx.db)
        .await?;

    format::json(files)
}
```

#### View File

View a specific `files`.

```rust title="loco_starter/src/controllers/files.rs"
#[debug_handler]
pub async fn view(
    auth: auth::JWT,
    Path(files_id): Path<i32>,
    State(ctx): State<AppContext>,
) -> Result<Response> {
    // Fetch the file info from database
    let file = files::Entity::find_by_id(files_id)
        .one(&ctx.db)
        .await?
        .expect("File not found");

    // Stream the file
    let file = tokio::fs::File::open(format!("{upload_dir}/{}", file.file_path)).await?;
    let stream = ReaderStream::new(file);
    let body = Body::from_stream(stream);

    Ok(format::render().response().body(body)?)
}
```

#### File Controller Routes

Add our newly defined files handler to the application routes.

```rust title="loco_starter/src/controllers/files.rs"
pub fn routes() -> Routes {
    // Bind the routes
    Routes::new()
        .prefix("files")
        .add("/upload/:notes_id", post(upload))
        .add("/list/:notes_id", get(list))
        .add("/view/:files_id", get(view))
}
```

```diff title="loco_starter/src/app.rs"
pub struct App;

#[async_trait]
impl Hooks for App {
    // ...

    fn routes(_ctx: &AppContext) -> AppRoutes {
        AppRoutes::with_default_routes()
            .prefix("/api")
            .add_route(controllers::notes::routes())
            .add_route(controllers::auth::routes())
            .add_route(controllers::user::routes())
+           .add_route(controllers::files::routes())
    }

    // ...
}
```

#### Extra Rust Dependencies

Remember to enable `multipart` in `axum` and add `tokio-util` dependency.

```diff title="loco_starter/Cargo.toml"
- axum = "0.7.1"
+ axum = { version = "0.7.1", features = ["multipart"] }

+ tokio-util = "0.7.11"
```

## SQL Server Support

The [SQL Server for SeaORM](https://www.sea-ql.org/SeaORM-X/) will first be offered as a closed beta to our partners. If you are interested, please join our [waiting list](https://forms.office.com/r/1MuRPJmYBR).

Migrating from `sea-orm` to `sea-orm-x` is straightforward with two simple steps. First, update the existing `sea-orm` dependency to `sea-orm-x` and enable the `sqlz-mssql` feature. Note that you might need to patch SeaORM dependency for the upstream dependencies.

```toml title="Cargo.toml"
sea-orm = { path = "<SEA_ORM_X_ROOT>/sea-orm-x", features = ["runtime-async-std-rustls", "sqlz-mssql"] }
sea-orm-migration = { path = "<SEA_ORM_X_ROOT>/sea-orm-x/sea-orm-migration" }

# Patch SeaORM dependency for the upstream dependencies
[patch.crates-io]
sea-orm = { path = "<SEA_ORM_X_ROOT>/sea-orm-x" }
sea-orm-migration = { path = "<SEA_ORM_X_ROOT>/sea-orm-x/sea-orm-migration" }
```

Then, remember to update the connection string for you MSSQL database connection.

```sh
# If the schema is `dbo`, simply write:
mssql://username:password@host/database

# Or, specify the schema name by providing an extra `currentSchema` query param.
mssql://username:password@host/database?currentSchema=my_schema

# You can trust peer certificate by providing an extra trustCertificate query param.
mssql://username:password@host/database?trustCertificate=true
```
