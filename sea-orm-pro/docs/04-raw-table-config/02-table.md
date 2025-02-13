# Table

## Table Layout

![](../../static/img/raw-table-config-table-layout.png#light)
![](../../static/img/raw-table-config-table-layout-dark.png#dark)

By default, name of the TOML file in title case will be displayed as the title, can be override.

```toml title=pro_admin/raw_tables/product.toml
[table]
title = "Products"
```

![](../../static/img/raw-table-config-table-density.png#light)
![](../../static/img/raw-table-config-table-density-dark.png#dark)

Display density of the table rows and number of rows on each page.

```toml title=pro_admin/raw_tables/product.toml
[table]
# Available options: "large" / "middle" / "small"
table_size = "middle"
page_size = 30
```

Sort table by any column in "asc" or "desc" order.

```toml title=pro_admin/raw_tables/product.toml
[table]
order_by = { field = "product_id", order = "desc" }
```

## Table Columns

![](../../static/img/raw-table-config-table-column.png#light)
![](../../static/img/raw-table-config-table-column-dark.png#dark)

By default, the `all_columns` is turned on, meaning all columns will be shown, you can override this in the config.

The sequence of item in which the `columns` array is the same as the table displayed in the admin panel.

The `title` is optional, if it's not set it will use the title case of the `field` as the title.

Set `input_type` to render column data in custom renderer.

Field of the one-to-one relation can be displayed via providing the name of the SeaORM `relation` and the `field` of the related table.

```toml title=pro_admin/raw_tables/product.toml
[table]
columns = [
    { title = "ID", field = "product_id", width = 80 },
    { title = "Thumbnail", field = "thumb_nail_photo", input_type = "image", width = 120 },
    { title = "Product Category", field = "name", relation = "product_category", ellipsis = false, width = 180 },
    # ...
]
hidden_columns = [
    "size",
    "weight",
]
all_columns = false
```

## Full Spec

```toml title=pro_admin/raw_tables/product.toml
[table]
# Title on the table header
title = "Products"
# Display density of the table view
# Available options: "large" / "middle" / "small"
table_size = "middle"
# Number of rows on each page
page_size = 30
# Default table sorter
order_by = {
    # Order by which column
    field = "product_id",
    # Order by direction: "asc" / "desc"
    order = "desc",
}
# Display following columns in sequence from left to right in the table view
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
# Hide columns in the table view
hidden_columns = [
    "size",
    "weight",
]
# Display all columns that are not included in `columns`, this is on by default
all_columns = false
```
