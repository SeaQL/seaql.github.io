# What is SeaORM Pro

SeaORM Pro is an admin panel solution allowing you to quickly and easily launch an admin panel for your application - frontend development skills not required (but certainly nice to have).

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

<img src="/sea-orm-pro/img/SeaORM Pro Architecture.png" className="dark-mode" />

The tech stack is **RRLS** (pronounced release!): React, Rust, Loco, SeaQL. These four technologies form a full-stack solution for building data-centric applications.

+ Frontend: Ant Design React
+ Backend: Loco.rs
+ Data access: Seaography + SeaORM
+ Database: MySQL / PostgreSQL / SQLite / SQL Server*
+ Language: Rust

*SQL Server support via [SeaORM X](https://www.sea-ql.org/SeaORM-X/)

## Features

### Table View

There are two kinds of table view in SeaORM Pro, raw table and composite table:

#### Raw Table

Each raw table corresponds to a table in the database, by default it will display all columns for all tables. You can configure the displayed columns and other settings via TOML.

#### Composite Table

This is where SeaORM Pro shine. You can construct table views with data joining from multiple related tables. The underlying GraphQL query can be deeply nested.

Data from parent-child relations (e.g. Order -> OrderItem) are represented as collapsible nested tables. You can configure the settings via TOML.

### Editable Form

Data is not editable by default. You can configure create, update and delete forms via TOML. You can also configure which columns are editable. Non-editable columns will be shown as read-only.

### Role Based Access Control

:::tip Since `2.0.0`
:::

RBAC is fully integrated into SeaORM Pro Plus. It offers a GUI editor to edit RBAC permissions and assign user roles. Without the corresponding select permission, users will not be able to see relevant tables in the GUI. Similarly, edit buttons will be hidden if user does not have update permission.

## Upcoming Features

There's really a lot we want to build, to make SeaORM Pro suit the needs of every project. Please consider being a sponsor and take part in shaping its future!

Here's what we have in mind:

### Single Sign On

To be able to sign-in with Google Workspace or Microsoft Business email.

### Audit Log

And so, we'd want to keep a record of users' action and being able to audit them.

### Advanced Dashboard

We want to make it super easy to design graphs and charts for the Admin Dashboard.

### Tasks

To be able to visualize and control scheduled tasks, and kick start once off tasks in ad-hoc way.

### Data Export

Export data to various formats, including CSV, Excel, and DataFrame!
