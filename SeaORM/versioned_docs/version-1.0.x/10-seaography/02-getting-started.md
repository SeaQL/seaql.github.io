# Getting Started

This example can be found on [SeaORM + Seaography Example](https://github.com/SeaQL/sea-orm/tree/master/examples/seaography_example).

![](https://raw.githubusercontent.com/SeaQL/sea-orm/master/examples/seaography_example/Seaography%20example.png)

To get started, all you need is a live SQL database with schema. You can code everything in Rust by writing SeaORM migrations, or design the schema with a GUI tool (e.g. [DataGrip](https://www.jetbrains.com/datagrip/)).

## Install Seaography

```bash
cargo install seaography-cli@^1.0.0
```

## Generate Seaography Entities

```bash
sea-orm-cli generate entity --output-dir graphql/src/entities --seaography
```

Generate entities with `sea-orm-cli`, but with an additional `--seaography` flag. The entities are basically good-old SeaORM entities, but with additional `RelatedEntity` enum.

## Generate GraphQL Project

```bash
# seaography-cli <DESTINATION> <ENTITIES> <DATABASE_URL> <CRATE_NAME>
seaography-cli graphql graphql/src/entities $DATABASE_URL sea-orm-seaography-example
```

## Start the server

```bash
cd graphql
cargo run
```

You are of course free to modify the project to suit your needs. But the interesting bit starts at the `seaography::register_entity!` macro and the [seaography::Builder](https://docs.rs/seaography/1.0.0/seaography/builder/struct.Builder.html).