# The Objective

StarfishQL is a framework for providing a **graph database** and a **graph query engine** that interacts with it.

Throughout this documentation, a concrete example (*Freeport*) involving the graph of crate dependency on [crates.io](https://crates.io/) is used for illustration. With this example, you can see StarfishQL in action.

At the end of the day, we're interested in performing **graph analysis**, that is to extract meaningful information out of plain graph data. To achieve that, we believe that **visualization** is a crucial aid.

StarfishQL's query engine is designed to be able to incorporate different forms of visualization by using a flexible query language. However, the development of the project has been centred around the following, as showcased in our [demo app](https://starfish-ql.sea-ql.org/).

## Top-N Dependencies

Bright image[^1].

Traverse the graph in the normal direction starting from the N most connected nodes.

## Dependencies & Dependents

Bright image[^2].

Traverse the graph in both the normal and reversed directions starting from a root node.

[^1]: ![Top-N Dependencies showcase](/img/graph_example.png)

[^2]: ![Dependencies and Dependents showcase](/img/tree_example.png)
