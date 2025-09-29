---
slug: 2025-09-30-sea-orm-rbac
title: Role Based Access Control in SeaORM
author: SeaQL Team
author_title: Chris Tsang
author_url: https://github.com/SeaQL
author_image_url: https://www.sea-ql.org/blog/img/SeaQL.png
image: https://www.sea-ql.org/blog/img/SeaORM%202.0%20Banner.png
tags: [news]
---

<img alt="SeaORM 2.0 Banner" src="/blog/img/SeaORM%202.0%20Banner.png"/>

SeaORM 2.0 introduces Role-Based Access Control (RBAC), bringing first-class authorization into your data layer. No more bolting on ad-hoc permission checks or scattering business rules across services - SeaORM lets you define roles and permission rules and enforce access policies directly inside the database connection. It's a powerful tool for building multi‑faceted applications that demand authorization.

## Overview of SeaORM RBAC

Here is a high level overview of the design and the requirements that shaped them:

1. Table‑level access control

Different user groups can only read or modify certain tables, e.g. customers can only read invoices, but not modify them.

Design: RBAC engine is table‑scoped so permissions can be expressed directly in terms of CRUD on tables.

2. Simplicity of user assignment

Each user should have a clear, unambiguous role to avoid confusion.

Design: one user = one role. This prevents complexity of multiple roles per user.

3. Role hierarchy and inheritance

We want to create roles that inherit from multiple roles like A = B + C where A will have the union of permissions from B and C.

We want to avoid duplicating permission sets across roles. For example, a 'Manager' should automatically get all 'Employee' permissions, plus extras.

Design: Hierarchical roles with multiple inheritance.

4. Granular, composable permissions

We need to allow fine‑grained control like 'read customers but not update them'. We want permission grant to be easy to reason about.

Design: Role can be assigned set of permissions (CRUD) on resources (tables). Permissions are additive, once granted, cannot be taken away (but can be overridden on a per user basis).

5. Extensibility

We want to extend beyond tables (e.g. application specific actions, or even non‑DB resources).

Design: Engine is generic - resource + permission abstraction can be applied to more than just CRUD operations on SQL tables.

6. Wildcard for convenience

Sometimes we need to grant superusers full access without enumerating every resource/permission.

Design: Opt‑in `*` wildcard for 'all permissions' or 'all resources.'

7. Per‑user overrides

Occasionally, a single user needs an exception (e.g. a contractor who can only read one table, or a manager who should be denied one sensitive table).

Design: User‑level overrides to grant/deny permissions.

## Why reinventing the wheel?

Our first thought is to look into the possibility of integrating an existing open-source RBAC engine, but we developed our own in the end, because we want to integrate it tightly with SeaORM.

1. Rules and permissions live in the same database as your app

By storing roles and permissions in the same database as your application data, you keep everything in one place. There's no separate DSL, no external policy files, and no risk of your access rules drifting out of sync with your schema. So you can query and update RBAC rules in migrations, just like other tables. Having a single source of truth simplifies development and deployment.

2. The hard part isn't expressing rules, it's enforcing them

Most policy engines are great at describing rules in abstract terms, but the real challenge is: how do you actually enforce those rules against SQL queries? With an external library, we still need to analyze raw SQL statements ourselves and match that up with the rule definitions. By embedding RBAC directly into SeaORM, we can analyze all queries and enforce those rules.

3. Lightweight and performant

Because the RBAC engine is part of SeaORM itself, it's lightweight and integrated - no extra runtime or external dependency. The runtime cost is also minimal, and most importantly, you don't pay for what you don't use. This feature can be turned off completely.

## Concepts

Let's take a look at the [RBAC schema](https://github.com/SeaQL/sea-orm/tree/master/src/rbac/entity) and go through the entities.

<img src="/blog/img/sea-orm-rbac-schema.png" />

### Entities

#### User

The user table is defined by your application. SeaORM doesn't manage that. However we currently require it to have an integer key.

#### Role

Each role comes with a set of privileges. For example, 'admin', 'sales manager' and 'customer service'.

#### Permissions

The actions we can perform on resources. There are 4 basic permissions, `select`, `insert`, `update` and `delete`. You can define more for your application.

#### Resources

The resources being accessed. In our case they are database tables.

### Relations

#### User `<->` Role

As mentioned in the design above, User has a 1-1 relationship with role, meaning each user can only be assigned at most 1 role.

#### Role Hierarchy

Role has a self-referencing relation, and they form a DAG (Directed Acyclic Graph). Most commonly they form a hierarchy tree that somewhat resembles an organization chart.

A simple tree example:

```rust
admin <- manager <- sales
                 <- warehouse
```

If we add the following to the graph, such that each role can have multiple super roles, then it becomes a DAG.

```rust
admin <- sourcing <- warehouse
```

Each role has their own set of permissions. On runtime, the engine will walk the role hierarchy and take the union of all permissions of the sub-graph.

#### Role `<->` Permission `<->` Resource

Each role can have many such entries, and permission is set for each resource individually. For example: `manager - update - order`.

#### User override

The schema is a mirror of above: User `<->` Permission `<->` Resource, with an extra `grant` field, `false` means deny.

## Usage

There are two stages: rules definiton when the RBAC rules are defined, and runtime authorization when these rules are enforced.

### Rules Definition

You can actually update the rules using the provided [SeaORM entities](https://github.com/SeaQL/sea-orm/tree/master/src/rbac/entity), but we provide a set of utilities to make mutating RBAC rules easier.

These methods are idempotent and can be used in migrations.

#### Create RBAC tables

```rust
sea_orm::rbac::schema::create_tables(db, Default::default()).await?;
```

#### Add resources & permissions

```rust
let mut context = RbacContext::load(db).await?;

let tables = [
    baker::Entity.table_name(),
    bakery::Entity.table_name(),
    cake::Entity.table_name(),
    cakes_bakers::Entity.table_name(),
    customer::Entity.table_name(),
    lineitem::Entity.table_name(),
    order::Entity.table_name(),
    "*", // WILDCARD
];

context.add_tables(db, &tables).await?;
context.add_crud_permissions(db).await?;
```

#### Define roles

First we create the roles.

```rust
context.add_roles(db, &["admin", "manager", "public"]).await?;
```

Then we can define the role hierarchy.

```rust
admin <- manager <- public
```

```rust
context
    .add_role_hierarchy(
        db,
        &[
            RbacAddRoleHierarchy {
                super_role: "admin",
                role: "manager",
            },
            RbacAddRoleHierarchy {
                super_role: "manager",
                role: "public",
            },
        ],
    )
    .await?;
```

#### Add role permissions

The permission and resource sets will be multiplied, i.e. Cartesian product taken.

```rust
// public can select everything, here wildcard is used
context.add_role_permissions(db, "public", &["select"], &["*"]).await?;
```

```rust
// manager can create / update cake and baker
context
    .add_role_permissions(
        db,
        "manager",
        &["insert", "update"],
        &["cake", "baker", "cakes_bakers"],
    )
    .await?;
```

```rust
// admin can CRUD everything
context
    .add_role_permissions(db, "admin", &["insert", "update", "delete"], &["*"])
    .await?;
```

#### Assign user role

```rust
context
    .assign_user_role(db, &[
        // (user_id, role)
        (1, "admin"),
        (2, "manager"),
        (3, "public"),
    ])
    .await?;
```

### Runtime Authorization

With these rules defined, we can now use them in our application.

#### Initialize RBAC engine

By default, it expects the RBAC tables are in the same database schema as the current connection. They can also be fetched from another database connection.

```rust
let db: &DbConn;

db.load_rbac().await?;
```

The RBAC rules are cached in memory and shared among all database connections via `RwLock`, so they can be reloaded anytime.

#### Authenticate user

This can be done by a web framework, where the user identity is extracted from a JWT token from HTTP requests. Here we assign them manually.

```rust
use sea_orm::rbac::RbacUserId;
let admin = RbacUserId(1);
let manager = RbacUserId(2);
let public = RbacUserId(3);
```

#### Create restricted connection

This is the key step. Once a `RestrictedConnection` is created, it is bounded to the user for the lifetime of the object. It is cheap to create and destroy them, as they are just `Arc` inside.

The `RestrictedConnection` implements the standard `DatabaseConnection` API, so it can be used in place of a normal `DbConn`.

All queries made through SeaORM, including through Entity (`ActiveModel`) or lower level APIs (`Insert`) are audited. Only queries with matching permissions will be executed. DDL (i.e. `ALTER`) and raw SQL are not supported for now, so they will be rejected.

```rust
let db: RestrictedConnection = db.restricted_for(admin)?;
```

By writing functions only accepting `RestrictedConnection`, you can safeguard all operations within the scope of the function, as there is no way from a type system sense for it to degrade into normal `DatabaseConnection`. (In Rust we normally don't do singleton / global scope, so any operation having global side effects is very obvious.)

```rust
// admin can create bakery
operation(db.restricted_for(admin)?).await?;

fn operation(db: RestrictedConnection) -> Result<(), DbErr> {
    let seaside_bakery = bakery::ActiveModel {
        name: Set("SeaSide Bakery".to_owned()),
        profit_margin: Set(10.2),
        ..Default::default()
    };

    let res = Bakery::insert(seaside_bakery).exec(&db).await?;
    let bakery: Option<bakery::Model> = 
        Bakery::find_by_id(res.last_insert_id).one(&db).await?;

    assert_eq!(bakery.unwrap().name, "SeaSide Bakery");
    Ok(())
}
```

```rust
// manager can't create bakery
operation(db.restricted_for(manager)?).await?;

fn operation(db: RestrictedConnection) -> Result<(), DbErr> {
    assert!(matches!(
        Bakery::insert(bakery::ActiveModel::default())
            .exec(db)
            .await,
        Err(DbErr::AccessDenied { .. })
    ));
    Ok(())
}
```

```rust
// manager can create cake & baker
operation(db.restricted_for(manager)?).await?;

fn operation(db: RestrictedConnection) -> Result<(), DbErr> {
    cake::Entity::insert(cake::ActiveModel {
        name: Set("Cheesecake".to_owned()),
        price: Set(2.into()),
        bakery_id: Set(Some(1)),
        gluten_free: Set(false),
        ..Default::default()
    })
    .exec(&db)
    .await?;

    // transaction is supported: using async closure
    db.transaction::<_, _, DbErr>(|txn| {
        Box::pin(async move {
            cake::Entity::insert(cake::ActiveModel {
                name: Set("Chocolate".to_owned()),
                price: Set(3.into()),
                bakery_id: Set(Some(1)),
                gluten_free: Set(true),
                ..Default::default()
            })
            .exec(txn)
            .await?;

            Ok(())
        })
    })
    .await?;

    // transaction using the begin / commit API
    let txn: RestrictedTransaction = db.begin().await?;

    baker::Entity::insert(baker::ActiveModel {
        name: Set("Master Baker".to_owned()),
        contact_details: Set(Default::default()),
        bakery_id: Set(Some(1)),
        ..Default::default()
    })
    .exec(&txn)
    .await?;

    txn.commit().await?;
    Ok(())
}
```

That's it! I hope the information above can get you started.

## Conclusion

RBAC is a new feature in SeaORM 2.0. We'd love for you to try it out and help shape the final release by [sharing your feedback](https://github.com/SeaQL/sea-orm/discussions/2548).

The RBAC engine is a first class construct in SeaORM, implemented underneath the application layer but above the database layer.

We believe this is the most robust approach: if it's implemented on the web framework level, it's easy to forget permission checks or some code paths can accidentally escape. Plus it will work for your application, whether you're building REST, gRPC, or GraphQL servers.

In SeaORM, analysis is done on SeaQuery AST, so it's almost free - we already have the AST in memory. Thanks to SeaQuery's feature-rich API, you can construct any complex query, including CTEs!

Compared to using the database engine's native access control capabilities, SeaORM is much easier to setup, reason about, and develop with. Plus it is database generic, so you can use it with SQLite.

Everything, including the code and rules is defined in one place, so you have a single source of truth. We believe Rust and SeaQL ecosystem is the best way to build performant, scalable and robust applications!

We'll dive into GraphQL with Seaography in the next post, so keep an eye out for the next update!

## SQL Server Support

[SQL Server for SeaORM](https://www.sea-ql.org/SeaORM-X/) offers the same SeaORM API for MSSQL. We ported all test cases and examples, complemented by MSSQL specific documentation. If you are building enterprise software, you can [request commercial access](https://forms.office.com/r/1MuRPJmYBR). It is currently based on SeaORM 1.0, but we will offer free upgrade to existing users when SeaORM 2.0 is finalized, including RBAC support.

## 🖥️ SeaORM Pro: Professional Admin Panel

<img src="/blog/img/sea-orm-pro-light.png#light" />
<img src="/blog/img/sea-orm-pro-dark.png#dark" />

[SeaORM Pro](https://www.sea-ql.org/sea-orm-pro/) is an admin panel solution allowing you to quickly and easily launch an admin panel for your application - frontend development skills not required, but certainly nice to have!

Features:

+ Full CRUD
+ Built on React + GraphQL
+ Built-in GraphQL resolver
+ Customize the UI with TOML config
+ Custom GraphQL endpoints *(new in 2.0)*
+ Role Based Access Control *(new in 2.0)*

SeaORM Pro will be updated to support the latest features in SeaORM 2.0, RBAC support is now available for preview in [SeaORM Pro Plus](https://github.com/sponsors/SeaQL/sponsorships?tier_id=249708).

<img src="/blog/img/sea-orm-pro-rbac-editor-light.png#light" />
<img src="/blog/img/sea-orm-pro-rbac-editor-dark.png#dark" />

RBAC-related features in SeaORM Pro Plus:

+ Permission editor GUI
+ Role hierarchy visualization
+ User role assignment
+ Add/remove user overrides

## Sponsors

If you feel generous, a small donation will be greatly appreciated, and goes a long way towards sustaining the organization.

### Gold Sponsor

<a href="https://qdx.co/">
    <img src="https://www.sea-ql.org/static/sponsors/QDX.svg" width="128" />
</a>

[QDX](https://qdx.co/) pioneers quantum dynamics–powered drug discovery, leveraging AI and supercomputing to accelerate molecular modeling.
We're grateful to QDX for sponsoring the development of SeaORM, the SQL toolkit that powers their data intensive applications.

### GitHub Sponsors

A big shout out to our [GitHub sponsors](https://github.com/sponsors/SeaQL) 😇:

<div class="row">
    <div class="col col--12 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--lg" href="https://github.com/subscribepro">
                <img src="https://avatars.githubusercontent.com/u/8466133?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">Subscribe Pro</div>
            </div>
        </div>
    </div>
</div>
<br/>
<div class="row">
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--md" href="https://github.com/ryanswrt">
                <img src="https://avatars.githubusercontent.com/u/87781?u=10a9d256e741f905f3dd2cf641de8b325720732e&v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">Ryan Swart</div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--md" href="https://github.com/OteroRafael">
                <img src="https://avatars.githubusercontent.com/u/175388115?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">OteroRafael</div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--md" href="https://github.com/higumachan">
                <img src="https://avatars.githubusercontent.com/u/1011298?u=de4c2f0d0929c2c6dc433981912f794d0e50f2cd&v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">Yuta Hinokuma</div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--md" href="https://github.com/wh7f">
                <img src="https://avatars.githubusercontent.com/u/59872041?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">wh7f</div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--md" href="https://github.com/marcson909">
                <img src="https://avatars.githubusercontent.com/u/16665353?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">MS</div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--md" href="https://github.com/numeusxyz">
                <img src="https://avatars.githubusercontent.com/u/82152211?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">Numeus</div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--md" href="https://github.com/data-intuitive">
                <img src="https://avatars.githubusercontent.com/u/15045722?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">Data Intuitive</div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--md" href="https://github.com/caido-community">
                <img src="https://avatars.githubusercontent.com/u/168573261?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">Caido Community</div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--md" href="https://github.com/marcusbuffett">
                <img src="https://avatars.githubusercontent.com/u/1834328?u=fd066d99cf4a6333bfb3927d1c756af4bb8baf7e&v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">Marcus Buffett</div>
            </div>
        </div>
    </div>
</div>
<br/>
<div class="row">
    <div class="col col--4 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/yuly3">
                <img src="https://avatars.githubusercontent.com/u/25814001?u=4b57756e7d8060e48262a9edba687927fe7934a6&v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">MasakiMiyazaki</div>
            </div>
        </div>
    </div>
    <div class="col col--4 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/kallydev">
                <img src="https://avatars.githubusercontent.com/u/36319157?u=5be882aa4dbe7eea97b1a80a6473857369146df6&v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">KallyDev</div>
            </div>
        </div>
    </div>
    <div class="col col--4 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/manfredcml">
                <img src="https://avatars.githubusercontent.com/u/27536502?u=b71636bdabbc698458b32e2ac05c5771ad41097e&v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">Manfred Lee</div>
            </div>
        </div>
    </div>
    <div class="col col--4 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/tugascript">
                <img src="https://avatars.githubusercontent.com/u/64930104?u=ad9f63e8e221dbe71bf23de59e3611c99cda1181&v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">Afonso Barracha</div>
            </div>
        </div>
    </div>
    <div class="col col--4 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/deansheather">
                <img src="https://avatars.githubusercontent.com/u/11241812?u=260538c7d8b8c3c5350dba175ebb8294358441e0&v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">Dean Sheather</div>
            </div>
        </div>
    </div>
</div>

## Rustacean Sticker Pack 🦀

The Rustacean Sticker Pack is the perfect way to express your passion for Rust.
Our stickers are made with a premium water-resistant vinyl with a unique matte finish.
Stick them on your laptop, notebook, or any gadget to show off your love for Rust!

Moreover, all proceeds contributes directly to the ongoing development of SeaQL projects.

Sticker Pack Contents:
- Logo of SeaQL projects: SeaQL, SeaORM, SeaQuery, Seaography, FireDBG
- Mascot of SeaQL: Terres the Hermit Crab
- Mascot of Rust: Ferris the Crab
- The Rustacean word

[Support SeaQL and get a Sticker Pack!](https://www.sea-ql.org/sticker-pack/)

<a href="https://www.sea-ql.org/sticker-pack/"><img style={{borderRadius: "25px"}} alt="Rustacean Sticker Pack by SeaQL" src="https://www.sea-ql.org/static/sticker-pack-1s.jpg" /></a>
