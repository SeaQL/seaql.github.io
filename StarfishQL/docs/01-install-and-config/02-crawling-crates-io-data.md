# Crawling crates.io Data

Once the database and query engine are up and running, the next step is to prepare the data to fill the database up with.

## Running the crawler for the first time

```sh
# starfish-ql/freeport/backend
npm install
npm start
```

The node application **pulls** the [index repo](https://github.com/rust-lang/crates.io-index) of crates.io and update the database by using the local cloned repo, so that the whole crawling process has minimal impact on crates.io's service.

## Updating the database

```sh
# starfish-ql/freeport/backend
npm start
```

The same npm script (`start`) is used for updating the database for convenience. This is made possible by storing some crawling metadata.

## Starting from scratch

In some cases, you may want to wipe out the whole database and start from scratch.

```sh
# starfish-ql/freeport/backend
npm restart
```
