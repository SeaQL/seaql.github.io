# Querying Graph Data

StarfishQL allows the user to perform queries for graphs and vectors of nodes with highly customizable parameters.

To find the graph of `sea-orm` and its dependents up to the depth of 3:

```json
{
    "graph": {
        "of": "crate",
        "constraints": [
            {
                "rootNodes": [
                    "sea-orm"
                ]
            },
            {
                "edge": {
                    "of": "depends",
                    "traversal": {
                        "reverseDirection": true
                    }
                }
            },
            {
                "limit": {
                    "depth": 3
                }
            }
        ]
    }
}
```

To find the top 10 most depended upon crates, using the complex connectivity with a weight-decay factor of 0.5:

```json
{
    "vector": {
        "of": "crate",
        "constraints": [
            {
                "sortBy": {
                    "key": {
                        "connectivity": {
                            "of": "depends",
                            "type": "complex05"
                        }
                    },
                    "desc": true
                }
            },
            {
                "limit": 10
            }
        ]
    }
}
```
