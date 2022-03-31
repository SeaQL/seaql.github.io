# Overview

The visualization is a force-directed graph ([example on Observable](https://observablehq.com/@d3/force-directed-graph)), in which the *crate* nodes are laid out and connected with *depends* edges.

The `d3-force` module ([repo](https://github.com/d3/d3-force/tree/v3.0.0)) is used to simulate the interactions between the nodes, such as collision, charge, and positional forces.

The implementation of this part is not complicated, but involves lots of experimenting and tinkering. There could be improvements in the UX of interacting with the graph visualizations, but we think the current state is fine for now.
