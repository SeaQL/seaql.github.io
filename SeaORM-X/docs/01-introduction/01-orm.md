# What is SeaORM X

SeaORM X stands for SeaORM eXtended, and is built on top of SeaORM 2.0 with first-class Microsoft SQL Server support. The architecture of SeaORM X remains the same: every improvement in the open-source release ships to MSSQL users too.

The MSSQL backend is powered by **SQLz**, a purpose-built SQL Server driver with connection pooling, nested transactions via savepoints, and multiple async runtime support. SQLz is a parallel implementation of SQLx's pool architecture applied to SQL Server.

- **SeaQuery X** extends SeaQuery, adding MSSQL query building, types, and syntax (including automatic schema rewriting).
- **SeaSchema X** extends SeaSchema, adding MSSQL schema discovery, serialization, and reconstruction.
- **SeaORM X** integrates SeaQuery X and SeaSchema X, offering complete MSSQL support with the full test suite and examples ported.

All libraries are supersets of their open-source versions, so you can interop MySQL, PostgreSQL, SQLite, and MSSQL in the same codebase.

Because SeaORM X tracks the open-source release, all SeaORM 2.0 features are available to MSSQL users: the new entity format, Entity Loader, Nested ActiveModel, strongly-typed COLUMN constant, `raw_sql!` macro, `DerivePartialModel` with nested selects, and more.

SeaORM X is a commercial offering distributed under a commercial license. We offer an Evaluation License and a Production License with support tiers. To evaluate it or discuss access for your team, [request access here](https://forms.office.com/r/1MuRPJmYBR).