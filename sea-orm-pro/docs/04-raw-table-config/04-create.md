# Create

## Enable Create

Enable create operation on this database table, this is disabled by default.

## Hidden Columns

Hide columns from the create form but it's still visible on the view table.

## Full Spec

```toml
[create]

# Is create allowed for this table?
enable = true

# List of columns that are hidden on the create form
hidden_columns = [
    "created_at",
    "updated_at",
]
```
