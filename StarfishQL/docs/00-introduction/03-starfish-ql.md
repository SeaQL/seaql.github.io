# StarfishQL Concepts

Before diving into the details, it's important to grasp the following fundamental concepts in a high-level sense:

## Entity

*e.g. Crate*

Data to be stored and processed that is meaningful in itself.

Within the database, entities can be homogeneous (as in the crates.io example, all are simply "crates") or heterogeneous (say we distinguish between "library crates" and "application crates" and represent them as different entities). 

## Node

*e.g. serde, rand, sea-orm*

An instance of an Entity.

## Relation

*e.g. Depends*

Relation between entities. It can be directed or undirected (equivalent on both directions).[^1]

## Edge

*e.g. sea-orm -depends-on-> serde*

An instance of a relation. A connection between two nodes.

## Graph

A data structure containing a set of nodes N and a set of edges E, where E must only use the nodes in N.

## Attribute

*e.g. version*

Quantities (numeric, scaler values) and qualities (categorical, enum labels) attached onto each node or edge.[^2]

## Query

A description of the data we want to extract from the database.

The query result can be a graph, a vector (of nodes) or a scaler value. 

## Constraint

*e.g. Traverse up to 3 levels deep, Only include nodes with at least 3 edges*

When performing a query, the requirements of graph traversal or criteria on the topology. 

## Criteria

*e.g. version = "0.0.1"*

When performing a query, the filters applied to the nodes and edges (usually on attributes).

[^1]: So far, development has been centred around directed graphs. Hence, some functionalities have not been thoroughly tested for undirected graphs.

[^2]: Only node attributes are supported for the time being.
