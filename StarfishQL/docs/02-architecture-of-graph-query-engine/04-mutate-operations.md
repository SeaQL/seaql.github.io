# Mutate Operations

StarfishQL supports the following mutate operations:

## Insert

### Body format

Inserting a set of nodes:

```typescript
// Body of a POST request to be sent to `/mutate`
{
    insert: {
        node: {
            of: string, // `name` of entity
            nodes: [
                {
                    name: string,
                    attributes: {
                        attr_name: attr_value, // Unspecified attributes become `null`
                        ...
                    }
                }
            ]
        }
    }
}
```

**Note that if nodes with the same names already exist, an error will be thrown and the request will fail.**

Inserting a set of edges:

```typescript
// Body of a POST request to be sent to `/mutate`
{
    insert: {
        edge: {
            of: string, // `name` of relation
            edges: [
                {
                    from_node: string, // `name` of node
                    to_node: string // `name` of node
                }
            ]
        }
    }
}
```

### Usage example

First, insert the nodes `sea-orm` and `serde`.

```json
{
    "insert": {
        "node": {
            "of": "crate",
            "nodes": [
                {
                    "name": "sea-orm",
                    "attributes": {
                        "version": "0.6.0"
                    }
                },
                {
                    "name": "serde",
                    "attributes": {
                        "version": "1.0.136"
                    }
                }
            ]
        }
    }
}
```

Then, an edge "*sea-orm depends on serde*" can be inserted.

```json
{
    "insert": {
        "edge": {
            "of": "depends",
            "edges": [
                {
                    "from_node": "sea-orm",
                    "to_node": "serde"
                }
            ]
        }
    }
}
```

### Upsert

You can perform an upsert operation (i.e. insert nonexistent nodes, update existent ones) by **setting `upsert=true` as a query parameter**.

```typescript
// Body of a POST request to be sent to `/mutate?upsert=true`
{
    insert: {
        node: {
            of: string, // `name` of entity
            nodes: [
                {
                    name: string,
                    attributes: {
                        attr_name: attr_value, // Unspecified attributes become `null`
                        ...
                    }
                }
            ]
        }
    }
}
```

## Update

### Body format

The key logic behind an update body is to select existing data with `selector` and update them according to `content`.

Updating the **attributes** of nodes:

```typescript
// Body of a POST request to be sent to `/mutate`
{
    update: {
        node: {
            selector: {
                of: string, // `name` of entity
                name: string, // `name` of node, optional
                attributes: { // Optional
                    attr_name: attr_value,
                    ...
                }
            },
            content: {
                attr_name: attr_value,
                ...
            }
        }
    }
}
```

Note that if both `name` and `attributes` are absent in `selector`, all nodes in the specified entity will be selected and updated.

Updating edges:

```typescript
// Body of a POST request to be sent to `/mutate`
{
    update: {
        edge: {
            selector: {
                of: string, // `name` of relation
                from_node: string, // `name` of node, optional
                to_node: string, // `name` of node, optional
            },
            content: {
                from_node: string, // `name` of node, optional
                to_node: string, // `name` of node, optional
            }
        }
    }
}
```

Note that although a validation check is not implemented yet, the behaviour is only well-defined in the following scenarios:

- selector: { of, from_node }, content: { from_node } <- To update the `from_node` of many edges
- selector: { of, to_node }, content: { to_node } <- To update the `to_node` of many edges
- selector: { of, from_node, to_node }, content: { * } <- To update exactly one edge

### Usage example

Select all crates with `version` equals `2.0` and update their `version` to `3.14`.

```json
{
    "update": {
        "node": {
            "selector": {
                "of": "crate",
                "attributes": {
                    "version": "2.0"
                }
            },
            "content": {
                "version": "3.14"
            }
        }
    }
}
```

Select all `depends` edges to `serde` and update them to `<from> -> rand`.

```json
{
    "update": {
        "edge": {
            "selector": {
                "of": "depends",
                "to_node": "serde"
            },
            "content": {
                "to_node": "rand"
            }
        }
    }
}
```

## Delete

### Body format

The key logic behind a delete body is similar to update, except that it only needs to select data to delete.

Deleting nodes:

```typescript
// Body of a POST request to be sent to `/mutate`
{
    delete: {
        node: {
            of: string, // `name` of entity
            name: string, // `name` of node, optional
            attributes: { // Optional
                attr_name: attr_value,
                ...
            }
        }
    }
}
```

Note that if both `name` and `attributes` are absent, all nodes in the specified entity will be selected and deleted.

Deleting edges:

```typescript
// Body of a POST request to be sent to `/mutate`
{
    delete: {
        edge: {
            of: string, // `name` of relation
            from_node: string, // `name` of node, optional
            to_node: string, // `name` of node, optional
        }
    }
}
```

### Usage examples

Delete the crate `sea-orm`.

```json
{
    "delete": {
        "node": {
            "of": "crate",
            "name": "sea-orm"
        }
    }
}
```

Delete all `depends` edges that point to `serde`

```json
{
    "delete": {
        "edge": {
            "of": "depends",
            "to_node": "serde"
        }
    }
}
```
