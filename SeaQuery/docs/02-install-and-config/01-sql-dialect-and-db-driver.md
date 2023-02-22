# SQL Dialect & Database Driver

```toml
# Cargo.toml
[dependencies]
sea-query = "^0"
```

SeaQuery is very lightweight, all dependencies are optional.

### Feature flags

Macro: `derive`

Async support: `thread-safe` (use `Arc` inplace of `Rc`)

SQL dialect: `backend-mysql`, `backend-postgres`, `backend-sqlite`

Type support: `with-chrono`, `with-json`, `with-rust_decimal`, `with-bigdecimal`, `with-uuid`,
`postgres-array`

Driver support: `sqlx-mysql`, `sqlx-postgres`, `sqlx-sqlite`,
`postgres`, `postgres-*`, `rusqlite`

Postgres support: `postgres`, `postgres-chrono`, `postgres-json`, `postgres-rust_decimal`,
`postgres-bigdecimal`, `postgres-uuid`, `postgres-array`, `postgres-interval`
