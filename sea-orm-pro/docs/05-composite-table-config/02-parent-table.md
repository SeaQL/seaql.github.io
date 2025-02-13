# Parent Table

![](../../static/img/composite-table-config-parent-table.png#light)
![](../../static/img/composite-table-config-parent-table-dark.png#dark)

## Name of Parent Table

Specify the database table name of the parent table.

```toml title=pro_admin/composite_tables/sales_order.toml
[parent]
name = "sales_order_header"
# ...
```

## Parent Table is-a Raw Table

All raw table config can be applied to parent table.

## Full Spec

```toml title=pro_admin/composite_tables/sales_order.toml
[parent]
# Table name of the parent table
name = "sales_order_header"

[parent.table]
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
all_columns = false

[parent.create]
enable = true

[parent.update]
enable = true

[parent.delete]
enable = true
```
