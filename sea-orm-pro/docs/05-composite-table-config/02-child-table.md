# Child Table

```toml
[[children]]

# name of the SeaORM relation
relation = "customer"


# Table config of the child table
[children.table]

# Column specific config
columns = [
    { title = "ID", field = "customer_id", width = 80 },
    { field = "title", width = 100 },
    { field = "first_name", width = 120 },
    { field = "middle_name", width = 120 },
    { field = "last_name", width = 120 },
]

# Show all columns including column not mention in the `columns` config
all_columns = false

# Number of rows per page
page_size = 20

# Display density, options: large, middle, small
table_size = "middle"

# Rename table title
name = "Customers"


# View config of the child table
[children.view]

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


# Create config of the child table
[children.create]

# Is create allowed for this table?
enable = true

# List of columns that are hidden on the create form
hidden_columns = [
    "modified_date",
]


# Update config of the child table
[children.update]

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


# Delete config of the child table
[children.delete]

# Is delete allowed for this table?
enable = true
```
