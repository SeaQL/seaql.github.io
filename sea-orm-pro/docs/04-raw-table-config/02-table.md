# Table

## Title

By default, name of the TOML file in title case as the title, can be override.

```toml
[table]
name = "Products"
```

## Table Display

Display density of the table rows and number of rows on each page.

```toml
[table]
table_size = "middle"
page_size = 20
```

## Table Columns

By default, the `all_columns` is turned on, meaning all columns will be shown, you can override this in the config.

The sequence of item in which the `columns` array is the same as the table displayed in the admin panel.

The `title` is optional, if it's not set it will use the title case of the `field` as the title.

Set `input_type` to render column data in custom renderer.

Field of the one-to-one relation can be displayed via providing the name of the SeaORM `relation` and the `field` of the related table.

```toml
[table]
all_columns = false
columns = [
    { title = "ID", field = "product_id", width = 80 },
    { title = "Thumbnail", field = "thumb_nail_photo", input_type = "image", width = 120 },
    { title = "Product Category", field = "name", relation = "product_category", ellipsis = false, width = 180 },
]
```

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
