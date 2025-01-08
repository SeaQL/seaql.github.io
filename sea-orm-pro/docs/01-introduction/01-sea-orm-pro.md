# What is SeaORM Pro

SeaORM Pro is an admin panel solution ...

## Architecture

The tech stack is **RRLS** (pronounced release!): React, Rust, Loco, SeaQL. These four technologies form a full-stack solution for building data-centric applications.

+ Frontend: Ant Design React
+ Backend: Loco.rs
+ Data access: Seaography + SeaORM
+ Database: MySQL / PostgreSQL / SQLite / SQL Server*
+ Language: Rust

## Features

### Table View

There are two kinds of table view in SeaORM Pro, raw table and composite table:

#### Raw Table

Each raw table corresponds to a table in the database, by default it will display all columns for all tables. You can configure the displayed columns and other settings via TOML.

#### Composite Table

This is where SeaORM Pro shine. Afterall, SQL is relational! You can construct table views with data joining from multiple related tables. The underlying GraphQL query can be deeply nested.

Data from parent-child relations (e.g. Order -> OrderItem) are represented as collapsible nested tables. You can configure the settings via TOML.

### Editable Form

...

## Upcoming Features