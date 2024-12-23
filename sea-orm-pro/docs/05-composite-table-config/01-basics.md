# The Basics

## File Folder

All TOML config of composite tables should be placed in the `pro_admin/composite_tables` folder.

## File Name Convention

The TOML config file should have a unique named. Such as `sales_order.toml` and `customer_address_book.toml`.

## Overall Structure of TOML File

The TOML config file of composite table is compulsory, you need to create them manually and specify the parent and children tables.

The TOML config consists of a parent and one or more children, each section will be explained separately in the following.

```toml
[parent]
# ...


[[children]]
# ...


[[children]]
# ...


[[children]]
# ...
```
