# Architecture

> Let's dive under the Sea 🤿

<img width="100%" src="/SeaORM-X/img/SeaORM Architecture.svg" />

SeaORM X is built upon the original SeaORM, featuring the support of MSSQL. The architecture of SeaORM X remains the same. The only addition is the MSSQL backend supported by `SQLz` and `tiberius`. They are the MSSQL add-on to the SeaORM enabling the support of MSSQL.

SeaQuery X extends from the original SeaQuery, adding the support of MSSQL query building and MSSQL specific statement and syntax.

SeaSchema X rebased from the original SeaSchema, enabling the support of MSSQL schema discovery and recreating schema from table create statement.
