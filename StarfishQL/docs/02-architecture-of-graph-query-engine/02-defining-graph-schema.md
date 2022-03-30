# Defining Graph Schema

The schema defines the formats of the entities and the relations to be processed by StarfishQL.

## Body format

```typescript
// Body of a POST request to be sent to `/schema`
{
    reset: boolean, // Default: false
    define: { // Optional
        entities: [
            {
                name: string,
                attributes: [
                    {
                        name: string,
                        datatype: "Int" | "String",
                    }
                ]
            }
        ],
        relations: [
            {
                name: string,
                from_entity: string,
                to_entity: string,
                directed: boolean
            }
        ]
    }
}
```

Note that all root level fields (`reset` and `define`) are optional; a request with an empty body `{}` is a no-op.

## Defining the schema

The following request body defines:

- An entity with the name `crate` and attribute `version` that is a *String* in the database[^1]
- A *directed* relation with the name `depends` that is defined from `crate` to `crate`[^2]

```json
{
    "define": {
        "entities": [
            {
                "name": "crate",
                "attributes": [
                    {"name": "version", "datatype": "String"}
                ]
            }
        ],
        "relations": [
            {
                "name": "depends",
                "from_entity": "crate",
                "to_entity": "crate",
                "directed": true
            }
        ]
    }
}
```

## Appending to the schema

If you send another request with the following body, another entity named `author` will be defined.

```json
{
    "define": {
        "entities": [
            {
                "name": "author",
                "attributes": []
            }
        ]
    }
}
```

## Resetting the schema

If you want to start over, specify `reset: true` to reset the schema.

```json
{
    "reset": true
}
```

If you want to reset the schema and re-define it in the same request, simply supply both `reset: true` and `define: {...}`.

```json
{
    "reset": true,
    "define": {
        "entities": [
            {
                "name": "crate",
                "attributes": [
                    {"name": "version", "datatype": "String"}
                ]
            }
        ],
        "relations": [
            {
                "name": "depends",
                "from_entity": "crate",
                "to_entity": "crate",
                "directed": true
            }
        ]
    }
}
```

[^1]: A unique column called `name` is implicitly inserted, but an attribute called `name` is still accepted. More on this in [Data Storage](02-architecture-of-graph-query-engine/03-data-storage.md#storage-of-entities).

[^2]: For simplicity, all relations defined in the schema are many-to-many. Therefore, a separate table is created for each relation.
