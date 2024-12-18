# View

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
