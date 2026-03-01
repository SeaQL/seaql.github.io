# 关联查询

## 按关联 Entity 查询

你可以通过对相关 Entity 应用过滤条件来查询 Entity。

例如，要查找 SeaSide Bakery 的所有蛋糕，可以这样做：

```rust
cake -> bakery
```

```rust
let cake: Vec<cake::Model> = cake::Entity::find()
    .has_related(bakery::Entity, bakery::Column::Name.eq("SeaSide Bakery"))
    .order_by_asc(cake::Column::Name)
    .all(db)
    .await?;
```

它在底层使用 `WHERE EXISTS` SQL 子句。

```rust
assert_eq!(
    cake::Entity::find()
        .has_related(bakery::Entity, bakery::Column::Name.eq("SeaSide Bakery"))
        .build(DbBackend::Sqlite)
        .to_string(),
    [
        r#"SELECT "cake"."id", "cake"."name", "cake"."price", "cake"."bakery_id", "cake"."gluten_free", "cake"."serial""#,
        r#"FROM "cake""#,
        r#"WHERE EXISTS(SELECT 1 FROM "bakery""#,
        r#"WHERE "bakery"."name" = 'SeaSide Bakery'"#,
        r#"AND "cake"."bakery_id" = "bakery"."id")"#,
    ]
    .join(" ")
);
```

对于多对多关系也同样适用。例如，你可以查找面包师 Alice 制作的所有蛋糕：

```rust
cake -> cake_baker -> baker
```

```rust
let cake: Vec<cake::Model> = cake::Entity::find()
    .has_related(baker::Entity, baker::Column::Name.eq("Alice"))
    .order_by_asc(cake::Column::Name)
    .all(db)
    .await?;
```
