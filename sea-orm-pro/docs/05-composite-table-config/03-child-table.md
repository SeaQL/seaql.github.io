# Child Table

![](../../static/img/composite-table-config-child-table.png#light)
![](../../static/img/composite-table-config-child-table-dark.png#dark)

## Name of Child Relation

All child tables have to be linked via parent's relation.
For example, the `sales_order_header` entity have relation to `address`, `customer` and `sales_order_detail`.

```rust title=src/models/sales_order_header.rs
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::address::Entity",
        from = "Column::BillToAddressId",
        to = "super::address::Column::AddressId",
        on_update = "NoAction",
        on_delete = "NoAction"
    )]
    Address2,
    #[sea_orm(
        belongs_to = "super::address::Entity",
        from = "Column::ShipToAddressId",
        to = "super::address::Column::AddressId",
        on_update = "NoAction",
        on_delete = "NoAction"
    )]
    Address1,
    #[sea_orm(
        belongs_to = "super::customer::Entity",
        from = "Column::CustomerId",
        to = "super::customer::Column::CustomerId",
        on_update = "NoAction",
        on_delete = "NoAction"
    )]
    Customer,
    #[sea_orm(has_many = "super::sales_order_detail::Entity")]
    SalesOrderDetail,
}
```

In the TOML config, we link the parent-child relations using the name of relation in snake-case:

```toml title=pro_admin/composite_tables/sales_order.toml
[[children]]
relation = "customer"
# ...

[[children]]
relation = "address1"
# ...

[[children]]
relation = "address2"
# ...

[[children]]
relation = "sales_order_detail"
# ...
```

## Child Table is-a Raw Table

All raw table config can be applied to child table.

## Full Spec

```toml title=pro_admin/composite_tables/sales_order.toml
[[children]]
# Name of SeaORM relation
relation = "customer"

[children.table]
columns = [
    { title = "ID", field = "customer_id", width = 80 },
    { field = "title", width = 100 },
    { field = "first_name", width = 120 },
    { field = "middle_name", width = 120 },
    { field = "last_name", width = 120 },
]
hidden_columns = [
    "name_style",
    "suffix",
    "email_address",
    "phone",
    "rowguid",
    "created_date",
]


[[children]]
# Name of SeaORM relation
relation = "address1"

[children.table]
title = "Shipping Address"
columns = [
    { title = "ID", field = "address_id", width = 80 },
]
hidden_columns = [
    "rowguid",
    "created_date",
]


[[children]]
# Name of SeaORM relation
relation = "address2"

[children.table]
title = "Billing Address"
columns = [
    { title = "ID", field = "address_id", width = 80 },
]
hidden_columns = [
    "rowguid",
    "created_date",
]


[[children]]
# Name of SeaORM relation
relation = "sales_order_detail"

[children.table]
columns = [
    { title = "Thumbnail", field = "thumb_nail_photo", relation = "product", input_type = "image", width = 120 },
    { field = "name", relation = "product", width = 300 },
    { field = "product_number", relation = "product" },
    { field = "color", relation = "product" },
    { field = "size", relation = "product" },
    { field = "weight", relation = "product" },
    { field = "order_qty" },
    { field = "unit_price" },
    { field = "unit_price_discount" },
]
hidden_columns = [
    "sales_order_id",
    "sales_order_detail_id",
    "product_id",
    "rowguid",
    "created_date",
]
```
