# Data Storage

## Storage of Entities

The definition of each entity leads to the creation of a node table.

For example, defining the entity `crate` as in the last subsection creates the table which contains:

- A `name` key column which is going to store *unique* identifiers of the crates (e.g. `serde`, `rand`, `sea-orm`)
- A `attr_version` column which is going to hold the `version` attribute of the crates[^1]
  - Each attribute defined has its own column, prefixed by "attr_" to avoid confusion. An attribute called `name` is also supported, though not recommended, because it will be stored as `attr_name`.
- Some columns to store the connectivity[^2] of the crates with respect to the `depends` relation.[^3]

## Storage of Relations

Similarly, the definition of each relation leads to the creation of an edge table, as all relations are many-to-many in StarfishQL.

For example, defining the relation `depends` as in the last subsection creates the table which contains:

- A `from_node` foreign key column which is going to store `name` of crates
- A `to_node` foreign key column which is going to store `name` of crates

To exemplify, the edge "*sea-orm depends on serde*" is going to be stored as a **record with `from_node = sea-orm` and `to_node = serde`**. To store such an edge, both crates with names `sea-orm` and `serde` must exist in the first place and continue to exist.[^4]

[^1]: All attributes are *nullable*. If an attribute is not specified when the node is inserted, it becomes null.

[^2]: The connectivity is a set of metrics to describe, for any given node, how many other nodes is it related to. More on this in [Calculating Node Connectivity](02-architecture-of-graph-query-engine/05-calculating-node-connectivity.md).

[^3]: Note that even though defining new relations causes new columns to be created, any existing data in the tables involved is left untouched during this process.

[^4]: Before inserting an edge, both of the nodes at its ends must have been inserted already. When a node is deleted, all edges with either end being the deleted node are also deleted (*on delete cascade*).
