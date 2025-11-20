---
slug: 2025-11-21-whats-new-in-seaormpro-2.0
title: "What's new in SeaORM Pro 2.0"
author: SeaQL Team
author_title: Chris Tsang
author_url: https://github.com/SeaQL
author_image_url: https://www.sea-ql.org/blog/img/SeaQL.png
image: https://www.sea-ql.org/blog/img/SeaORM%202.0%20Banner.png
tags: [news]
---

<img alt="SeaORM Pro 2.0 Banner" src="/blog/img/SeaORM%202.0%20Banner.png"/>

<!-- SeaORM Pro 2.0 Banner? -->

[SeaORM Pro](https://github.com/SeaQL/sea-orm-pro) is an admin panel solution allowing you to quickly and easily launch an admin panel for your application - frontend development skills not required (but certainly nice to have).

An admin panel is essential for operating backend applications. But it often is an after-thought, or no dedicated resources is put into developing them.

SeaORM Pro is designed to bridge this gap, providing a solution that is both quick to implement and reliable for long-term use.

## Table View

There are two kinds of table view in SeaORM Pro, raw table and composite table:

### Raw Table

Each raw table corresponds to a table in the database, by default it will display all columns for all tables. You can configure the displayed columns and [other settings via TOML](https://www.sea-ql.org/sea-orm-pro/docs/raw-table-config/overview/).

![](../static/img/2025-11-18-whats-new-in-seaormpro-2.0/raw-table-config-table-column.png#light)
![](../static/img/2025-11-18-whats-new-in-seaormpro-2.0/raw-table-config-table-column-dark.png#dark)

```toml title="pro_admin/raw_tables/product.toml"
[table]
title = "Products"
table_size = "middle"
page_size = 30
order_by = { field = "product_id", order = "desc" }
columns = [
    { title = "ID", field = "product_id", width = 80 },
    { title = "Thumbnail", field = "thumb_nail_photo", input_type = "image", width = 120 },
    { title = "Product Category", field = "name", relation = "product_category", ellipsis = false, width = 180 },
]
hidden_columns = [ "size", "weight" ]
all_columns = false
```

### Composite Table

This is where SeaORM Pro shine. You can construct table views with data joining from multiple related tables. The underlying GraphQL query can be deeply nested.

Data from parent-child relations (e.g. Order -> OrderItem) are represented as collapsible nested tables. You can [configure the settings via TOML](https://www.sea-ql.org/sea-orm-pro/docs/composite-table-config/overview/).

![](../static/img/2025-11-18-whats-new-in-seaormpro-2.0/composite-table-config-child-table.png#light)
![](../static/img/2025-11-18-whats-new-in-seaormpro-2.0/composite-table-config-child-table-dark.png#dark)

```toml title="pro_admin/composite_tables/sales_order.toml"
[parent]
name = "sales_order_header"

[parent.table]
columns = [
    { title = "ID", field = "sales_order_id", width = 80 },
    { field = "order_date" },
    { field = "purchase_order_number" },
    { field = "account_number" },
    { field = "ship_method" },
    { field = "sub_total" },
    { field = "tax_amt" },
    { field = "freight" },
]
all_columns = false


[[children]]
relation = "customer"

[children.table]
columns = [
    { title = "ID", field = "customer_id", width = 80 },
    { field = "title", width = 100 },
    { field = "first_name", width = 120 },
    { field = "middle_name", width = 120 },
    { field = "last_name", width = 120 },
]
hidden_columns = [ "name_style", "suffix", "email_address", "phone", "rowguid", "created_date" ]


[[children]]
relation = "address1"

[children.table]
title = "Shipping Address"
columns = [
    { title = "ID", field = "address_id", width = 80 },
]
hidden_columns = [ "rowguid", "created_date" ]


[[children]]
relation = "address2"

[children.table]
title = "Billing Address"
columns = [
    { title = "ID", field = "address_id", width = 80 },
]
hidden_columns = [ "rowguid", "created_date" ]


[[children]]
relation = "sales_order_detail"

[children.table]
columns = [
    { title = "Thumbnail", field = "thumb_nail_photo", relation = "product", input_type = "image", width = 120 },
    { field = "name", relation = "product", width = 300 },
    { field = "product_number", relation = "product" },
    { field = "color", relation = "product" },
    { field = "size", relation = "product" },
    { field = "weight", relation = "product" },
    { field = "order_qty" },
    { field = "unit_price" },
    { field = "unit_price_discount" },
]
hidden_columns = [ "sales_order_id", "sales_order_detail_id", "product_id", "rowguid", "created_date" ]
```

## Editor

Data is not editable by default. You can configure create, update and delete forms via TOML. You can also configure which columns are editable. Non-editable columns will be shown as read-only.

### Pop-up Editor

By default, the pop-up editor will be used to create and update database table.

#### Create

Enable [create](https://www.sea-ql.org/sea-orm-pro/docs/raw-table-config/create/) on this database table, this is disabled by default. Columns can be hidden from the create form but it's still visible on the view table.

![](../static/img/2025-11-18-whats-new-in-seaormpro-2.0/raw-table-config-table-create.png#light)
![](../static/img/2025-11-18-whats-new-in-seaormpro-2.0/raw-table-config-table-create-dark.png#dark)

```toml title="pro_admin/raw_tables/product.toml"
[create]
# Enable create for this table
enable = true
# Columns that are hidden on the create form
hidden_columns = [ "created_date" ]
```

#### Update

Enable [update](https://www.sea-ql.org/sea-orm-pro/docs/raw-table-config/update/) on this database table, this is disabled by default. Columns can be hidden from the update form but it's still visible on the view table. Fields can also be readonly on the update form.

![](../static/img/2025-11-18-whats-new-in-seaormpro-2.0/raw-table-config-table-update.png#light)
![](../static/img/2025-11-18-whats-new-in-seaormpro-2.0/raw-table-config-table-update-dark.png#dark)

```toml title="pro_admin/raw_tables/product.toml"
[update]
# Enable update for this table
enable = true
# Columns that are hidden on the update form
hidden_columns = [ "created_date" ]
# Columns that are readonly on the update form
readonly_columns = [ "product_id" ]
```

#### Delete

Enable [delete](https://www.sea-ql.org/sea-orm-pro/docs/raw-table-config/delete/) on this database table, this is disabled by default.

![](../static/img/2025-11-18-whats-new-in-seaormpro-2.0/raw-table-config-table-delete.png#light)
![](../static/img/2025-11-18-whats-new-in-seaormpro-2.0/raw-table-config-table-delete-dark.png#dark)

```toml title="pro_admin/raw_tables/product.toml"
[delete]
# Enable delete for this table
enable = true
```

### Model Editor

Enable the use of [model editor](https://www.sea-ql.org/sea-orm-pro/docs/raw-table-config/editor/) on this database table, this is disabled by default. The configuration of each fields are specified here in sequence, displaying across table view, create and update editor.

![](../static/img/2025-11-18-whats-new-in-seaormpro-2.0/raw-table-config-table-editor.png#light)
![](../static/img/2025-11-18-whats-new-in-seaormpro-2.0/raw-table-config-table-editor-dark.png#dark)

```toml
[editor]
# Enable model editor for this table
enable = true
# Title field to be shown
title_field = "address_line1"
# Display following columns in sequence
fields = [
    { title = "ID", field = "address_id", span = 8 },
    { field = "rowguid", span = 8 },
    { field = "created_date", span = 8 },
    { field = "address_line1", span = 12, input_type = "textarea", rows = 4 },
    { field = "address_line2", span = 12, input_type = "textarea", rows = 4 },
    { field = "city", span = 6 },
    { field = "state_province", span = 6 },
    { field = "country_region", span = 6 },
    { field = "postal_code", span = 6 },
]
```

## Role-Based Access Control

SeaORM Pro has been updated to support the latest features in SeaORM 2.0. Role-Based Access Control (RBAC) is fully integrated into SeaORM Pro Plus. It offers a GUI editor to edit RBAC permissions and assign user roles. Without the corresponding select permission, users will not be able to see relevant tables in the GUI. Similarly, edit buttons will be hidden if user does not have update permission.

### Opt-in RBAC

Upon upgrading to SeaORM 2.0, you can opt-in RBAC by enabling the `rbac` feature flag in the Rust backend:

```toml title="Cargo.toml"
seaography = { version = "2.0", features = ["rbac"] }
```

And enabling RBAC in the SeaORM Pro admin panel:

```toml title="pro_admin/config.toml"
[site.rbac]
# Is RBAC enabled?
enable = true
```

### Role Permissions

#### View Role Hierarchy Diagram

Role has a self-referencing relation, and they form a DAG (Directed Acyclic Graph). Most commonly they form a hierarchy tree that somewhat resembles an organization chart.

A simple tree example:

```
admin <- manager <- public
                 <- ...etc.
```

![](../static/img/2025-11-18-whats-new-in-seaormpro-2.0/rbac-role-permissions-hierarchy-diagram.png#light)
![](../static/img/2025-11-18-whats-new-in-seaormpro-2.0/rbac-role-permissions-hierarchy-diagram-dark.png#dark)

#### Update Role Permission

Each role has their own set of permissions. On runtime, the engine will walk the role hierarchy and take the union of all permissions of the sub-graph.

The actions we can perform on resources. There are 4 basic `permissions`, `select`, `insert`, `update` and `delete`. You can define more for your application.

![](../static/img/2025-11-18-whats-new-in-seaormpro-2.0/rbac-role-permissions-admin.png#light)
![](../static/img/2025-11-18-whats-new-in-seaormpro-2.0/rbac-role-permissions-admin-dark.png#dark)

### Role Hierarchy

Each role has their own set of permissions. On runtime, the engine will walk the role hierarchy and take the union of all permissions of the sub-graph.

![](../static/img/2025-11-18-whats-new-in-seaormpro-2.0/rbac-role-hierarchy.png#light)
![](../static/img/2025-11-18-whats-new-in-seaormpro-2.0/rbac-role-hierarchy-dark.png#dark)

![](../static/img/2025-11-18-whats-new-in-seaormpro-2.0/rbac-role-hierarchy-add.jpg#light)
![](../static/img/2025-11-18-whats-new-in-seaormpro-2.0/rbac-role-hierarchy-add-dark.jpg#dark)

### User Role

User has a 1-1 relationship with role, meaning each user can only be assigned at most 1 role.

![](../static/img/2025-11-18-whats-new-in-seaormpro-2.0/rbac-user-role.png#light)
![](../static/img/2025-11-18-whats-new-in-seaormpro-2.0/rbac-user-role-dark.png#dark)

![](../static/img/2025-11-18-whats-new-in-seaormpro-2.0/rbac-user-role-add.jpg#light)
![](../static/img/2025-11-18-whats-new-in-seaormpro-2.0/rbac-user-role-add-dark.jpg#dark)

### User Override

The schema is a mirror of above: User `<->` Permission `<->` Resource, with an extra `grant` field, `false` means deny.

![](../static/img/2025-11-18-whats-new-in-seaormpro-2.0/rbac-user-override.png#light)
![](../static/img/2025-11-18-whats-new-in-seaormpro-2.0/rbac-user-override-dark.png#dark)

![](../static/img/2025-11-18-whats-new-in-seaormpro-2.0/rbac-user-override-add.jpg#light)
![](../static/img/2025-11-18-whats-new-in-seaormpro-2.0/rbac-user-override-add-dark.jpg#dark)

## What's Next?

There's really a lot we want to build, to make SeaORM Pro suit the needs of every project. Please consider being a sponsor and take part in shaping its future!

Here's what we have in mind:

 * **Single Sign On**: To be able to sign-in with Google Workspace or Microsoft Business email.
 * **Audit Log**: And so, we'd want to keep a record of users' action and being able to audit them.
 * **Advanced Dashboard**: We want to make it super easy to design graphs and charts for the Admin Dashboard.
 * **Tasks**: To be able to visualize and control scheduled tasks, and kick start once off tasks in ad-hoc way.
 * **Data Export**: Export data to various formats, including CSV, Excel, and DataFrame!

## 🌟 Sponsors

#### Gold Sponsor

<a href="https://qdx.co/">
    <img src="https://www.sea-ql.org/static/sponsors/QDX.svg" width="128" />
</a>

[QDX](https://qdx.co/) pioneers quantum dynamics-powered drug discovery, leveraging AI and supercomputing to accelerate molecular modeling.
We're grateful to QDX for sponsoring the development of SeaORM, the SQL toolkit that powers their data intensive applications.

#### GitHub Sponsors

If you feel generous, a small donation will be greatly appreciated, and goes a long way towards sustaining the organization.

A big shout out to our [GitHub sponsors](https://github.com/sponsors/SeaQL):

<div class="row">
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--md" href="https://github.com/sanctusgee">
                <img src="https://avatars.githubusercontent.com/u/2237695?u=c46344d34b510cb2aea10d4ee2c349277802e408&v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">Godwin Effiong</div>
            </div>
        </div>
    </div>
    <div class="col col--6 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--md" href="https://github.com/AdamIsrael">
                <img src="https://avatars.githubusercontent.com/u/125008?u=9ac4ba64c19545e5e631c7528747f6da721b64f4&v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">Adam Israel</div>
            </div>
        </div>
    </div>
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

## 🦀 Rustacean Sticker Pack

The Rustacean Sticker Pack is the perfect way to express your passion for Rust.
Our stickers are made with a premium water-resistant vinyl with a unique matte finish.

Sticker Pack Contents:
- Logo of SeaQL projects: SeaQL, SeaORM, SeaQuery, Seaography
- Mascots: Ferris the Crab x 3, Terres the Hermit Crab
- The Rustacean wordmark

[Support SeaQL and get a Sticker Pack!](https://www.sea-ql.org/sticker-pack/)

<a href="https://www.sea-ql.org/sticker-pack/"><img style={{borderRadius: "25px"}} alt="Rustacean Sticker Pack by SeaQL" src="https://www.sea-ql.org/static/sticker-pack-1s.jpg" /></a>
