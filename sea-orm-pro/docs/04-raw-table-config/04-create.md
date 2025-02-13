# Create

![](../../static/img/raw-table-config-table-create.png#light)
![](../../static/img/raw-table-config-table-create-dark.png#dark)

## Enable Create

Enable create operation on this database table, this is disabled by default.

## Hidden Columns

Hide columns from the create form but it's still visible on the view table.

## Full Spec

```toml
[create]
# Enable create for this table
enable = true
# Columns that are hidden on the create form
hidden_columns = [
    "created_date"
]
```
