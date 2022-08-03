# Overview

The graph query engine is a Rust backend application powered by the [rocket](https://crates.io/crates/rocket) web framework and the [SeaQL ecosystem](https://www.sea-ql.org/SeaORM/).

## Handling requests

Being a web application, StarfishQL expects input from the web in the form of HTTP requests (specifically, POST requests only).

We defined the query language in the [JSON](https://www.json.org/json-en.html) format, because:

- It is the go-to format for data transmission on the web.
- Most, if not all, web developers know it.
- Most, if not all, web frameworks support it.
- It is easy to understand (arguable, but prettify and visualization tools surely help).
- It is easy to write (even trivial if the request sender uses JavaScript).
- [`serde`](https://crates.io/crates/serde) and [`serde_json`](https://crates.io/crates/serde_json) provide nice tools for dealing with JSON data in Rust.

As such, we've designed the input layer of the engine to always take the JSON-formatted body of a POST request[^1], regardless of the operation, for consistency.

The engine listens at the following endpoints for the corresponding operation:
- `/schema` - Define/Reset the schema
- `/mutate` - Perform mutate operations
- `/query` - Perform queries

## Invoking operations

Each request received by the engine at different endpoints tells the engine *what to do*, while the body specifies *how to do it* with parameters.

In the following sub-sections, each possible operation that StarfishQL's query engine supports will be investigated in details.

[^1]: As per the [standards](https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods/GET), GET requests do not have bodies. So please don't feel too surprised to see query operations specified in POST requests.
