# Running the example

The project codebase comes with an example database, you can use to create the example project.

In this article we will follow the instructions on how to setup the example project, and we can perform some useful queries.

## Requirements

1. rustup: https://rustup.rs/

## Installation

1. Clone project

  ```shell
  git clone https://github.com/SeaQL/seaography.git
  ```

2. Install dependencies
  ```shell
  cd seaography
  cargo install
  ```

3. Build project
  ```shell
  cargo build
  ```

4. Generate example project
  ```shell
  cargo run sqlite://./chinook.db/ generated ./generated
  ```

5. Copy database
  ```shell
  cp ./chinook.db ./generated/chinook.db
  ```

6. Run project
  ```shell
  cd generated
  cargo run
  ```

7. Browse local server
  http://127.0.0.1:8000/

## Query examples

### Fetch albums where artist ID = 1 || ID = 3
```graphql
{
  albums(filters: { or: [{ artistId: { eq: 3 } }, { artistId: { eq: 1 } }] }) {
    data {
      albumId
      title
      artistId
      artistArtists {
        name
        artistId
      }
    }
  }
}
```

Response

```json
{
    "albums": {
      "data": [
        {
          "albumId": 1,
          "title": "For Those About To Rock We Salute You",
          "artistId": 1,
          "artistArtists": {
            "name": "AC/DC",
            "artistId": 1
          }
        },
        {
          "albumId": 4,
          "title": "Let There Be Rock",
          "artistId": 1,
          "artistArtists": {
            "name": "AC/DC",
            "artistId": 1
          }
        },
        {
          "albumId": 5,
          "title": "Big Ones",
          "artistId": 3,
          "artistArtists": {
            "name": "Aerosmith",
            "artistId": 3
          }
        }
      ]
    }
}
```

### First two employees
```graphql
{
  employees (pagination:{limit: 2, page: 0}) {
    data {
      employeeId
      lastName
      title
    }
  }
}
```

Response

```json
{
  "data": {
    "employees": {
      "data": [
        {
          "employeeId": 1,
          "lastName": "Adams",
          "title": "General Manager"
        },
        {
          "employeeId": 2,
          "lastName": "Edwards",
          "title": "Sales Manager"
        }
      ]
    }
  }
}
```

### Find track and artist name with songs with runtime more than 5 minutes

```graphql
{
  tracks ( filters:{ milliseconds:{gt: 343719 }}) {
    data {
      milliseconds
      name
      albumAlbums {
        artistArtists {
          name
        }
      }
    }
  }
}
```

Response

```
WIP
```