# Setting Up Migration

Version control you database schema with migrations written in SeaQuery or in raw SQL.

## Migration Table

```rust
#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "seaql_migrations")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub version: String,
    pub applied_at: i64,
}
```

## Creating Migration Directory



## Workspace Structure


