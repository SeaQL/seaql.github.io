# View

## Hidden Columns

* Columns that are hidden on the view table

## Table Sorter

* Sort by which column in ASC / DESC direction

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
