# Relational Query

## Query by related Entity

You can query an Entity by applying filters on a related Entity.

For example, to find all cakes of SeaSide Bakery, you can do:

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

It's using a `WHERE EXISTS` SQL clause under the hood.

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

It works the same for many-to-many relations. For example, you can find all cakes made by Alice the baker:

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