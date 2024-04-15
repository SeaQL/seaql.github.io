# What is SeaORM X

SeaORM X stands for SeaORM eXtended, and is built on top of SeaORM, add support for other database backends. The architecture of SeaORM X remains the same.

The MSSQL (aka SQL Server) backend is based on `tiberius`, and in the future, could be `SQLx Pro`. We have implemented many additional features in our driver library, including: transaction (and nested transaction), connection pooling and multiple async runtime support.

SeaQuery X extends SeaQuery, adding the support of MSSQL query building and MSSQL specific types, statements and syntax.

SeaSchema X extends SeaSchema, adding the support of MSSQL schema definition, discovery, serialization and reconstruction.

SeaORM X extends SeaORM, integrating SeaQuery X and SeaSchema X and offering complete support for MSSQL, and of course, working around the nuances of MSSQL. We aim to offer an experience as good as SeaORM by porting all test cases and examples, complemented by MSSQL specific documentation.

All libraries are supersets of their open-source versions, so it's possible to interop say MySQL and MSSQL in the same codebase.

In the future, we'd also like to include Seaography in the bundle, allowing developers to easily create admin dashboards.

SeaORM X is now in closed-beta, and will be based on SeaORM `1.0`, so the API surface will be stable and supported long term. We offer an Evaluation License and a Production License with two support tiers. If you are interested, please [contact us](https://forms.office.com/r/1MuRPJmYBR) for pricing information.