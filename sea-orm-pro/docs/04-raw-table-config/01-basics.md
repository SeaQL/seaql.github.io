# The Basics

## File Folder

All TOML config of raw tables should be placed in the `pro_admin/raw_tables` folder.

## File Name Convention

The TOML config file should be named the same as the corresponding name of the database table. Such as `address.toml` and `customer_address.toml`.

## Overall Structure of TOML File

The TOML config file of raw table is not compulsory. All database tables and all its columns will be shown on the admin dashboard by default. However, if you wish to customize the display of raw table, a TOML config file is required.

The TOML config consists of 5 sections, each section will be explained separately in the following.

```toml
[table]
# ...

[view]
# ...

[create]
# ...

[update]
# ...

[delete]
# ...
```
