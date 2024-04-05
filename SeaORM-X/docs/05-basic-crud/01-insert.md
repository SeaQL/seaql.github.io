# Insert

## Identity Insert

Insert an active model with a specific primary key value. For MSSQL, SeaORM X will automatically enable `IDENTITY INSERT` when inserting a row with primary key value and disable the `IDENTITY INSERT` once the insert finished.

```rust
let pear = fruit::ActiveModel {
    id: Set(1),
    name: Set("Pear".to_owned()),
    cake_id: NotSet,
};

// `IDENTITY INSERT` behind the hood
let pear: fruit::Model = pear.insert(db).await?;
```
