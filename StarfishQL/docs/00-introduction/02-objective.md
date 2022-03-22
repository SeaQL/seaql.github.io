# The Objective

StarfishQL is a framework for providing a **graph database** and a **graph query engine** that interacts with it.

Throughout this documentation, a concrete example involving the graph of crate dependency on [crates.io](https://crates.io/) is used for illustration.

At the end of the day, we're interested in performing **graph analysis**, that is to extract meaningful information out of plain graph data. To achieve that, we believe that **visualization** is a crucial aid.

StarfishQL's query engine is designed to be able to incorporate different forms of visualization by using a flexible query language. However, the development of the project has been centred around the following, as showcased in our [demo app](#).

1. Top-N Dependencies

![Top-N Dependencies showcase](/img/graph_example.png)

Traverse the graph in the normal direction starting from the N most connected nodes.

2. Dependencies & Dependents

![Dependencies and Dependents showcase](/img/tree_example.png)

Traverse the graph in both the normal and reversed directions starting from a root node.