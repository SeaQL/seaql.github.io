# Running the example

The project codebase comes with an example database, you can use to run the example project.

In this article we will follow the instructions on how to setup the example project, and we can perform some useful queries.

## Requirements

1. rustup: https://rustup.rs/
2. mysql / postgres database (optional)

### Install from Cargo

```shell
cargo install seaography-cli
```

### Install from source

1. Clone project
    ```shell
    git clone git@github.com:SeaQL/seaography.git
    ```

2. Build project
    ```shell
    cd ./seaography/cli
    cargo install --path .
    ```

### MySQL

1. Locate project
    ```shell
    cd ./examples/mysql
    ```

2. Create database
    ```shell
    mysql -uroot -p -h 127.0.0.1 mysql -e 'CREATE DATABASE `sakila`'
    ```

3. Import schema
    ```shell
    mysql -uroot -p -h 127.0.0.1 sakila < sakila-schema.sql
    ```

4. Import data
    ```shell
    mysql -uroot -p -h 127.0.0.1 sakila < sakila-data.sql
    ```

### Postgres

1. Locate project
    ```shell
    cd ./examples/postgres
    ```

2. Create database
    ```shell
    psql -q postgres://postgres:postgres@localhost/postgres -c 'CREATE DATABASE "sakila"'
    ```

3. Import schema
    ```shell
    psql -q postgres://postgres:postgres@localhost/sakila < sakila-schema.sql
    ```

4. Import data
    ```shell
    psql -q postgres://postgres:postgres@localhost/sakila < sakila-data.sql
    ```

### SQLite

1. Locate project
    ```shell
    cd ./examples/sqlite
    ```

## Extending and configuring code

You are free to modify the code and change things to fit your needs. For more info [How to extend generated code](/docs/extending-code).

## Running server

```shell
cargo run
```

http://127.0.0.1:8000/

## Regenerating code

Here are the instructions on how we can generate the examples from scratch.

1. Set working directory to Seaography folder
    ```shell
    $ cd ./seaography
    ```

2. Build project
    ```shell
    cargo build
    ```

3. Clean generated code
    ```shell
    rm -rf ./examples/{mysql|sqlite|postgres}/src
    ```

4. Generate code
    ```shell
    cd ./examples/{mysql|sqlite|postgres}
    seaography-cli <database_url> seaography-example .
    ```

    \* Example database urls "sqlite://sakila.db", "mysql://username:password@127.0.0.1/sakila"

## Query examples

#### Fetch films and their actors

```graphql
{
  film(pagination: { pages: { limit: 2, page: 0 } }, orderBy: { title: ASC }) {
    nodes {
      title
      description
      releaseYear
      filmActor {
        actor {
          firstName
          lastName
        }
      }
    }
  }
}

```

Response
```json
{
  "data": {
    "film": {
      "nodes": [
        {
          "title": "ACADEMY DINOSAUR",
          "description": "An Epic Drama of a Feminist And a Mad Scientist who must Battle a Teacher in The Canadian Rockies",
          "releaseYear": "2006",
          "filmActor": [
            {
              "actor": {
                "firstName": "PENELOPE",
                "lastName": "GUINESS"
              }
            },
            {
              "actor": {
                "firstName": "CHRISTIAN",
                "lastName": "GABLE"
              }
            },
            {
              "actor": {
                "firstName": "LUCILLE",
                "lastName": "TRACY"
              }
            },
            {
              "actor": {
                "firstName": "SANDRA",
                "lastName": "PECK"
              }
            },
            {
              "actor": {
                "firstName": "JOHNNY",
                "lastName": "CAGE"
              }
            },
            {
              "actor": {
                "firstName": "MENA",
                "lastName": "TEMPLE"
              }
            },
            {
              "actor": {
                "firstName": "WARREN",
                "lastName": "NOLTE"
              }
            },
            {
              "actor": {
                "firstName": "OPRAH",
                "lastName": "KILMER"
              }
            },
            {
              "actor": {
                "firstName": "ROCK",
                "lastName": "DUKAKIS"
              }
            },
            {
              "actor": {
                "firstName": "MARY",
                "lastName": "KEITEL"
              }
            }
          ]
        },
        {
          "title": "ACE GOLDFINGER",
          "description": "A Astounding Epistle of a Database Administrator And a Explorer who must Find a Car in Ancient China",
          "releaseYear": "2006",
          "filmActor": [
            {
              "actor": {
                "firstName": "BOB",
                "lastName": "FAWCETT"
              }
            },
            {
              "actor": {
                "firstName": "MINNIE",
                "lastName": "ZELLWEGER"
              }
            },
            {
              "actor": {
                "firstName": "SEAN",
                "lastName": "GUINESS"
              }
            },
            {
              "actor": {
                "firstName": "CHRIS",
                "lastName": "DEPP"
              }
            }
          ]
        }
      ]
    }
  }
}
```

#### Fetch store and its employee

```graphql
{
  store(filters: { storeId: { eq: 1 } }) {
    nodes {
      storeId
      address {
        address
        address2
      }
      staff {
        firstName
        lastName
      }
    }
  }
}
```

Response

```json
{
  "data": {
    "store": {
      "nodes": [
        {
          "storeId": 1,
          "address": {
            "address": "47 MySakila Drive",
            "address2": null
          },
          "staff": {
            "firstName": "Mike",
            "lastName": "Hillyer"
          }
        }
      ]
    }
  }
}
```

### Fetch inactive customers with pagination

```graphql
{
  customer(
    filters: { active: { eq: 0 } }
    pagination: { pages: { page: 2, limit: 3 } }
  ) {
    nodes {
      customerId
      lastName
      email
    }
    pages
    current
  }
}
```

Response

```json
{
  "data": {
    "customer": {
      "nodes": [
        {
          "customerId": 315,
          "lastName": "GOODEN",
          "email": "KENNETH.GOODEN@sakilacustomer.org"
        },
        {
          "customerId": 368,
          "lastName": "ARCE",
          "email": "HARRY.ARCE@sakilacustomer.org"
        },
        {
          "customerId": 406,
          "lastName": "RUNYON",
          "email": "NATHAN.RUNYON@sakilacustomer.org"
        }
      ],
      "pages": 5,
      "current": 2
    }
  }
}
```

### The query above using cursor pagination

```graphql
{
  customer(
    filters: { active: { eq: 0 } }
    pagination: { cursor: { limit: 3, cursor: "Int[3]:271" } }
  ) {
    nodes {
      customerId
      lastName
      email
    }
    pageInfo {
      hasPreviousPage
      hasNextPage
      endCursor
    }
  }
}
```

Response

```json
{
  "data": {
    "customer": {
      "nodes": [
        {
          "customerId": 315,
          "lastName": "GOODEN",
          "email": "KENNETH.GOODEN@sakilacustomer.org"
        },
        {
          "customerId": 368,
          "lastName": "ARCE",
          "email": "HARRY.ARCE@sakilacustomer.org"
        },
        {
          "customerId": 406,
          "lastName": "RUNYON",
          "email": "NATHAN.RUNYON@sakilacustomer.org"
        }
      ],
      "pageInfo": {
        "hasPreviousPage": true,
        "hasNextPage": true,
        "endCursor": "Int[3]:406"
      }
    }
  }
}
```