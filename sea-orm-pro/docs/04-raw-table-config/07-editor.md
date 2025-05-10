# Editor

![](../../static/img/raw-table-config-table-editor.png#light)
![](../../static/img/raw-table-config-table-editor-dark.png#dark)

## Enable Editor

Enable editor on this database table, this is disabled by default.

## Full Spec

```toml
[editor]
# Enable editor for this table
enable = true
# Title field to be shown
title_field = "address_line1"
# Display following columns in sequence from left to right in the table view
fields = [
    {
        # Display title
        title = "ID",

        # Name of the SQL column
        field = "address_id",

        # Column span
        span = 8
    },
    { field = "rowguid", span = 8 },
    { field = "created_date", span = 8 },
    {
        field = "address_line1",
        
        span = 12,
        
        # Data type
        input_type = "textarea",
        
        # Number of default rows for the textarea
        rows = 4
    },
    { field = "address_line2", span = 12, input_type = "textarea", rows = 4 },
    { field = "city", span = 6 },
    { field = "state_province", span = 6 },
    { field = "country_region", span = 6 },
    { field = "postal_code", span = 6 },
]
```
