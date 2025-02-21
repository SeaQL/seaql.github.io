---
slug: 2025-02-22-introducing-sea-orm-pro
title: Introducing SeaORM Pro
author: SeaQL Team
author_title: Chris Tsang
author_url: https://github.com/SeaQL
author_image_url: https://www.sea-ql.org/blog/img/SeaQL.png
image: https://www.sea-ql.org/sea-orm-pro/img/01_banner.png
tags: [news]
---

<img src="https://www.sea-ql.org/sea-orm-pro/img/01_banner.png#light" />
<img src="https://www.sea-ql.org/sea-orm-pro/img/01_banner_dark.png#dark" />

We are thrilled to introduce the newest member of the SeaQL ecosystem: [SeaORM Pro](https://www.sea-ql.org/sea-orm-pro/). SeaORM Pro is an admin panel solution allowing you to quickly and easily launch an admin panel for your application - frontend development skills not required (but certainly nice to have).

## Preface

An admin panel is essential for operating backend applications. But it often is an after-thought, or no dedicated resources (aka developer time) is put into developing them.

Frontend engineers are usually focused on developing consumer-facing applications, which often led to insufficient effort being directed towards GUI of internal-facing applications.

SeaORM Pro is designed to bridge this gap, providing a solution that is both quick to implement and reliable for long-term use.

There are several engineering problems we are trying to solve:

1. The tediousness of manually writing query handlers to select, sort, filter and paginate data. While this can be abstracted away for individual tables, custom code is often needed for queries involving joins.
    + Solution: Seaography removes the need to write GraphQL resolvers manually, all you need to provide is a set of SeaORM entities (which can be generated with `sea-orm-cli`)!

2. The difficulty in customizing frontend by writing frontend code. Certainly a barrier for us backend engineers to mess with React SPA code!
    + Solution: SeaORM Pro allows customizing the frontend by writing TOML config, a language Rust developers already know (because of Cargo).

3. The difficulty in keeping the admin panel in sync with the application's schema after adding new tables and columns.
    + Solution: develop your application using SeaORM. You can share the same set of entities between your app and the admin panel, so any schema changes are automatically reflected in the GraphQL schema and the admin panel. You only have to touch the config to customize things

4. The long term viability in managing growth in complexity. Low-code solutions will eventually hit a functionality ceiling, requiring a rewrite to implement new features.
    + Solution: built using open-source and well-understood technologies, SeaORM Pro offer a pathway to develop a fully-fledged admin application

## Architecture

<img src="https://www.sea-ql.org/sea-orm-pro/img/SeaORM%20Pro%20Architecture.png" className="dark-mode" />

The tech stack is **RRLS** (pronounced release!): React, Rust, Loco, SeaQL. These four technologies form a full-stack solution for building data-centric applications.

+ Frontend: Ant Design React
+ Backend: Loco.rs
+ Data access: Seaography + SeaORM
+ Database: MySQL / PostgreSQL / SQLite / SQL Server*
+ Language: Rust

## Features

SeaORM Pro can be used alongside with your existing Rust backend. It does not interfere with your active application in any way. In fact, you can easily create a SeaORM Pro admin panel to your operating SeaORM applications that you have already built.

+ [Getting Started with Loco](https://www.sea-ql.org/sea-orm-pro/docs/install-and-config/getting-started-loco/)
+ [Getting Started with Axum](https://www.sea-ql.org/sea-orm-pro/docs/install-and-config/getting-started-axum/)

### Customizable UI

Customize the UI easily with a simple, elegant TOML syntax. You have full control over the style and the layout of admin panel:

+ [Theme Config](https://www.sea-ql.org/sea-orm-pro/docs/site-config/theme/): customize site' title, logo, banner and menu item settings
+ [Dashboard Config](https://www.sea-ql.org/sea-orm-pro/docs/site-config/dashboard/): customize dashboard' info cards and charts settings
+ [Raw Table Config](https://www.sea-ql.org/sea-orm-pro/docs/raw-table-config/overview/): customize raw table' view, filter, create, update and delete settings
+ [Composite Config](https://www.sea-ql.org/sea-orm-pro/docs/composite-table-config/overview/): customize parent-child table' view, filter, create, update and delete settings

### Dashboard

A glance into the metrics. SeaORM Pro visualize your business statistics with charts. For example, numbers of newly acquired customer on each month and sales per week visualize in line chart. The dashboard UI is configurable via TOML syntax, chart data is fetch via by predefined query in the Rust backend.

<img src="https://www.sea-ql.org/sea-orm-pro/img/01_banner.png#light" />
<img src="https://www.sea-ql.org/sea-orm-pro/img/01_banner_dark.png#dark" />

### Table View

The core of SeaORM Pro is its ability to create, read, update, and delete data in the database. There are two kinds of table view in SeaORM Pro, raw table and composite table:

#### Raw Table

Without configuration, each raw table corresponds to a table in the database, by default it will display all columns for all tables. You can configure the displayed columns and other settings via TOML.

<img src="https://www.sea-ql.org/sea-orm-pro/img/raw-table-config-table-column.png#light" />
<img src="https://www.sea-ql.org/sea-orm-pro/img/raw-table-config-table-column-dark.png#dark" />

#### Composite Table

This is where SeaORM Pro shine. Afterall, SQL is relational! You can construct table views with data joining from multiple related tables. The underlying GraphQL query can be deeply nested.

Data from parent-child relations (e.g. SalesOrder -> SalesOrderItem) are represented as collapsible nested tables. You can configure the settings via TOML.

<img src="https://www.sea-ql.org/sea-orm-pro/img/composite-table-config-child-table.png#light" />
<img src="https://www.sea-ql.org/sea-orm-pro/img/composite-table-config-child-table-dark.png#dark" />

### Create, Update and Delete

Data is not editable by default. You can configure create, update and delete forms via TOML. You can also configure which columns are editable. Non-editable columns will be shown as read-only.

<img src="https://www.sea-ql.org/sea-orm-pro/img/raw-table-config-table-create.png#light" />
<img src="https://www.sea-ql.org/sea-orm-pro/img/raw-table-config-table-create-dark.png#dark" />

<img src="https://www.sea-ql.org/sea-orm-pro/img/raw-table-config-table-update.png#light" />
<img src="https://www.sea-ql.org/sea-orm-pro/img/raw-table-config-table-update-dark.png#dark" />

<img src="https://www.sea-ql.org/sea-orm-pro/img/raw-table-config-table-delete.png#light" />
<img src="https://www.sea-ql.org/sea-orm-pro/img/raw-table-config-table-delete-dark.png#dark" />

### GraphQL

SeaORM Pro ships data via GraphQL endpoint backed by Seaography.

<img src="https://www.sea-ql.org/sea-orm-pro/img/06_graphql_api.png" />

### Dark Mode

Customize the UI theme easily with light / dark mode support.

<img src="https://www.sea-ql.org/sea-orm-pro/img/07_dark_mode.png" />

## Launch Admin Panel in minutes

Use SeaORM Pro with any Rust web framework, simply follow the 3 easy steps to setup an admin panel for existing SeaORM projects.

Or even better, build your next application with our fullstack webapp template!

[Try the Demo](https://sea-orm-pro-demo.sea-ql.org/admin/)!
