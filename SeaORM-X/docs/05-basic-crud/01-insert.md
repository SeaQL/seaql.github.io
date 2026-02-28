# Insert

## `OUTPUT` Clause

SeaORM X maps SeaORM's `RETURNING` semantics to MSSQL's `OUTPUT` syntax:

- **INSERT** → `OUTPUT INSERTED.*`
- **DELETE** → `OUTPUT DELETED.*`

Constraint violations (`UniqueConstraintViolation`, `ForeignKeyConstraintViolation`) are caught and returned as typed `DbErr` variants, not raw driver errors.

## Automatic `IDENTITY_INSERT`

When inserting a model with an explicit primary-key value on an auto-increment column, SeaORM X automatically wraps the statement in `SET IDENTITY_INSERT ON/OFF`:

```rust
let seaside_bakery = bakery::ActiveModel {
    name: Set("SeaSide Bakery".to_owned()),
    profit_margin: Set(10.4),
    ..Default::default() // id not set: normal insert
};
Bakery::insert(seaside_bakery).exec(db).await?;

let double = bakery::ActiveModel {
    id: Set(1), // explicit PK: triggers IDENTITY_INSERT automatically
    name: Set("SeaSide Bakery".to_owned()),
    profit_margin: Set(10.4),
    ..Default::default()
};
let res = Bakery::insert_many([double])
    .on_conflict_do_nothing()
    .exec(db)
    .await;
assert!(matches!(res, Ok(TryInsertResult::Conflicted)));
```

```sql
-- Normal insert: no IDENTITY_INSERT
INSERT INTO [bakery] ([name], [profit_margin])
  OUTPUT [INSERTED].[id] VALUES ('SeaSide Bakery', 10.4)

-- Explicit PK insert: wrapped automatically
SET IDENTITY_INSERT [bakery] ON;
INSERT INTO [bakery] ([id], [name], [profit_margin])
  OUTPUT [INSERTED].[id] VALUES (1, 'SeaSide Bakery', 10.4);
SET IDENTITY_INSERT [bakery] OFF
```
