# Update

## Enable Update

Enable update on this database table, this is disabled by default.

## Hidden Columns

Hide columns from the update form but it's still visible on the view table.

## Readonly Columns

Readonly fields on the update form.

## Full Spec

```toml
[update]

# Is update allowed for this table?
enable = true

# List of columns that are hidden on the update form
hidden_columns = [
    "created_at",
    "updated_at",
]

# List of columns that are readonly on the update form
readonly_columns = [
    "id",
]
```

