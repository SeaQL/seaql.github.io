# Calculating Node Connectivity

In the most trivial sense, node connectivity can be approached by investigating the numbers of in-connections and out-connections at each node. Existing metrics in graph theory include the in-degree and out-degree in directed graphs, as well as the degree in undirected graphs.

However, those existing metrics only provide limited capacity for graph analysis, as they only take 1 layer of graph traversal into account, ignoring the recursive nature of graphs. Hence, we've devised the weight-decaying connectivity metrics which support more in-depth graph analysis.

If we define the weight-decay factor `f` to be a scalar in [0, 1], we can obtain the connectivity of a node by recursively sampling the degrees of its ancestor/descendant nodes, as follows:

Without loss of generality, assume that we want to find the *in-connectivity* of node `n`.

```rust
find_in_conn(n, f):
    if f is close enough to 0.0:
        return in_deg(n)

    let in_conn = in_deg(n)
    for each child c of n:
        in_conn += f * find_in_conn(c, f * f)
    return in_conn
```

*Note: This algorithm can be implemented with a stack/queue instead of using recursion for performance improvement. Also, graphs with cycles are ignored in this trivial algorithm, but it's simple to deal with in practice.*

<a id="weight-decay-factors"></a>

Different weight-decay factors lead to different interesting connectivity metrics, most noticeably:

- When it is `0` (*Simple connectivity*), the connectivity is simply the trivial degrees.
  - As the weight essentially decays to 0 immediately in this case, the *Decay Mode* is *Immediate*.
- When it is `1` (*Compound connectivity*), the connectivity takes into account **all** the ancestor/descendant nodes in the connected component of the node of interest.
  - As the weight essentially never decays in this case, the *Decay Mode* is *None*.
- When it is anything in between (*Complex connectivity*), the connectivity *decays* throughout traversal, which is a nice property for some use cases.
  - In this case, the *Decay Mode* is associated with a speed: *the smaller the factor, the faster the decay speed*.
