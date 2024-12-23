# View

## Hidden Columns

Hide columns from the view table but it's still visible on the detail modal.

## Table Sorter

Sort table by a column in ASC / DESC direction.

## Full Spec

```toml
[view]

# List of columns that are hidden on the view table
hidden_columns = [
    "name_style",
    "suffix",
    "email_address",
    "phone",
    "rowguid",
    "modified_date",
]

# Sorter of the view table
order_by = {
    # Sort by which column
    field = "customer_id",

    # Sort in ASC / DESC direction
    order = "desc"
}
```
