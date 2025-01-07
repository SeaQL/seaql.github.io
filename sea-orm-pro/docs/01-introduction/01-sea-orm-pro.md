# What is SeaORM Pro

SeaORM Pro is an admin panel that provides full CRUD interface for your SeaORM entities, includes a GraphQL interface to handles CRUD request.

The source code of the frontend and backend are fully customizable and accessible. The tech stack includes a sleek Ant Design React frontend admin panel, Loco.rs Rust backend server, SeaORM object relational mapper to interact with your relational database and Seaography to extends entity that defines in SeaORM to serve as a GraphQL interface.

There are two kinds of table view in SeaORM Pro, raw table view and composite table view.

For raw table view, each raw table corresponds to a table in the relational database, by default it will display all columns with pagination. You can configure the displayed columns and other settings in a TOML file.

For composite table view, this is where SeaORM Pro shine, data from parent-child tables are represented in collapsible table view. The configuration of each composite table view is specified in the TOML file.

SeaORM Pro is now in closed-beta, and will be based on SeaORM 1.0, so the API surface will be stable and supported long term. We offer an Evaluation License and a Production License with two support tiers.
