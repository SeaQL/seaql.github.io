# Set up the Graph Query Engine

## Set up the database

Set up a MySQL[^1] database connection with Docker:

```sh
docker run \
    --name "mysql-8.0" \
    --env MYSQL_DB="mysql" \
    --env MYSQL_USER="sea" \
    --env MYSQL_PASSWORD="sea" \
    --env MYSQL_ALLOW_EMPTY_PASSWORD="yes" \
    --env MYSQL_ROOT_PASSWORD="root" \
    -d -p 3306:3306 mysql:8.0
docker stop "mysql-8.0"
```

## Run the tests

```sh
# starfish-ql/starfish/
DATABASE_URL="mysql://root:root@localhost:3306" cargo test --all
```

## Start the query engine

```sh
# starfish-ql/starfish/
cargo run --release
```

Alternatively, use the default compilation profile so that logs and SQL commands are displayed in the terminal.

```sh
# starfish-ql/starfish/
cargo run
```

[^1]: Until [SeaQuery](https://crates.io/crates/sea-query) provides more support, only MySQL databases are supported in StarfishQL.
