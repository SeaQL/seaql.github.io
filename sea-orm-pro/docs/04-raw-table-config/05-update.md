# Update

![](../../static/img/raw-table-config-table-update.png#light)
![](../../static/img/raw-table-config-table-update-dark.png#dark)

## Enable Update

Enable update on this database table, this is disabled by default.

## Hidden Columns

Hide columns from the update form but it's still visible on the view table.

## Readonly Columns

Readonly fields on the update form.

## Full Spec

```toml
[update]
# Enable update for this table
enable = true
# Columns that are hidden on the update form
hidden_columns = [
    "created_date"
]
# Columns that are readonly on the update form
readonly_columns = [
    "product_id"
]
```

