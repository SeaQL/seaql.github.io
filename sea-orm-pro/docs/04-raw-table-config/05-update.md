# Update

## Enable Update

* Is update enabled in the admin dashboard?

## Hidden Columns

* Columns that are hidden on the update form

## Readonly Columns

* Columns that are readonly on the update form

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

