# Table

## Title

* Use title case of the TOML file name as the title by default, can be override

## Table Display

* Display density
* Items per page

## Table Columns

* Show all columns by default, can be disabled
* Set column title
* Set column width
* Set column content ellipsis
* Set column input type for custom rendering
* Join one-to-one relation
* Column display sequence

## Full Spec

```toml
[table]

# Column specific config
columns = [
    {
        # Display title
        title = "ID",

        # Name of the SQL column
        field = "product_id",

        # Column width
        width = 80
    },
    {
        title = "Thumbnail",

        field = "thumb_nail_photo",
        
        # Data type
        input_type = "image",
        
        width = 120
    },
    {
        title = "Product Category",

        field = "name",
        
        # Name of the SeaORM relation
        relation = "product_category",

        # Clip long text
        ellipsis = false,

        width = 180
    },
]

# Show all columns including column not mention in the `columns` config
all_columns = false

# Number of rows per page
page_size = 20

# Display density, options: large, middle, small
table_size = "middle"

# Rename table title
name = "Products"
```
