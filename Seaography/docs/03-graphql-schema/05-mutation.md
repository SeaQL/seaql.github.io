# Mutations

## Create

### Create One

If the primary key is auto-increment, you don't have to provide the field in the input. You can get back the newly assigned id:

```graphql
mutation {
  actorCreateOne(
    data: {
      firstName: "Tom"
      lastName: "Brown"
      lastUpdate: "2030-01-01 12:24:36Z"
    }
  ) {
    actorId
    firstName
    lastName
    lastUpdate
  }
}
```

Result:

```json
{
  "actorCreateOne": {
    "actorId": 201,
    "firstName": "Tom",
    "lastName": "Brown",
    "lastUpdate": "2030-01-01 12:24:36 UTC"
  }
}
```

### Create Many

You can use `CreateBatch` endpoint to insert multiple items. The query will be executed inside a transaction:

```graphql
mutation {
  filmTextCreateBatch(
    data: [
      { filmId: 1, title: "TEST 1", description: "TEST DESC 1" }
      { filmId: 2, title: "TEST 2", description: "TEST DESC 2" }
    ]
  ) {
    filmId
    title
    description
  }
}
```

Result:

```json
{
  "filmTextCreateBatch": [
    {
      "filmId": 1,
      "title": "TEST 1",
      "description": "TEST DESC 1"
    },
    {
      "filmId": 2,
      "title": "TEST 2",
      "description": "TEST DESC 2"
    }
  ]
}
```

## Update

You write an update query using filters:

```graphql
mutation {
  filmUpdate(
    data: { title: "Best Film" }
    filter: { filmId: { eq: 1 } }
  ) {
    filmId
    title
  }
}
```

The result contains all the updated items:

```json
{
  "filmUpdate": [
    {
      "filmId": 1,
      "title": "Best Film"
    }
  ]
}
```

### Update Many

You can use the same endpoint to update many items:

```graphql
mutation {
  filmUpdate(
    data: { title: "Best Film" }
    filter: { filmId: { is_in: [1, 2] } }
  ) {
    filmId
    title
  }
}
```

## Delete

Delete is very similar to update, but without `data`:

```graphql
mutation {
  actorDelete(filter: { actorId: { is_in: [201, 202] } })
}
```

It returns a scalar number indicating the number of rows deleted:

```json
{
  "actorDelete": 2
}
```