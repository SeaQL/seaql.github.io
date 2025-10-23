# Role Based Access Control

Role Based Access Control (RBAC) is a new feature in SeaORM 2.0. It allows you to define rules to restrict access to Entities, and limit who can mutation which Entities.

To get started, it's recommended to first read the post [Role Based Access Control in SeaORM 2.0](https://www.sea-ql.org/blog/2025-09-30-sea-orm-rbac/).

If you enable the `rbac` feature in Seaography, then all queries and mutations in the resolver will be made through `RestrictedConnection`, and thus subject to SeaORM's access control.

```toml title="Cargo.toml"
[dependencies.seaography]
version = "~2.0.0-rc" # seaography version
features = ["rbac"]
```

After connecting to the database, you should initialize RBAC for the connection before creating the schema:

```rust
let db = Database::connect(db_url).await?;
db.load_rbac().await?;
let schema = query_root::schema(db, ..)?;
```

## RBAC Editor

If you need a GUI editor to manage RBAC rules that tightly integrates with Seaography, then checkout [SeaORM Pro Plus](https://www.sea-ql.org/sea-orm-pro/docs/introduction/sea-orm-pro-plus/).

RBAC-related features in SeaORM Pro Plus:

+ Permission editor GUI
+ Role hierarchy visualization
+ User role assignment
+ Add/remove user overrides

![](https://www.sea-ql.org/blog/img/sea-orm-pro-rbac-editor-light.png#light)

<!-- ![](https://www.sea-ql.org/blog/img/sea-orm-pro-rbac-editor-dark.png#dark) -->

SeaORM Pro Plus is a full-stack application showcasing how RBAC is implemented in a code base, integrating SeaORM ⮕ Seaography ⮕ Frontend.