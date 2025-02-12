# Parent Table

## Name of Parent Table

Specify the database table name of the parent table.

## Parent Table is a Raw Table

All raw table config can be applied to parent table.

## Full Spec

```toml
[parent]

# Name of the parent table
name = "sales_order_header"


# Table config of the parent table
[parent.table]

# Column specific config
columns = [
    { title = "ID", field = "sales_order_id", width = 80 },
    { field = "order_date" },
    { field = "purchase_order_number" },
    { field = "account_number" },
    { field = "ship_method" },
    { field = "sub_total" },
    { field = "tax_amt" },
    { field = "freight" },
]

# Show all columns including column not mention in the `columns` config
all_columns = false

# Number of rows per page
page_size = 20

# Display density, options: large, middle, small
table_size = "middle"

# Rename table title
name = "Sales Orders"


# View config of the parent table
[parent.view]

# List of columns that are hidden on the view table
hidden_columns = [
    "modified_date",
]

# Sorter of the view table
order_by = {
    # Sort by which column
    field = "id",

    # Sort in ASC / DESC direction
    order = "desc"
}


# Create config of the parent table
[parent.create]

# Is create allowed for this table?
enable = true

# List of columns that are hidden on the create form
hidden_columns = [
    "modified_date",
]


# Update config of the parent table
[parent.update]

# Is update allowed for this table?
enable = true

# List of columns that are hidden on the update form
hidden_columns = [
    "modified_date",
]

# List of columns that are readonly on the update form
readonly_columns = [
    "id",
]


# Delete config of the parent table
[parent.delete]

# Is delete allowed for this table?
enable = true
```
