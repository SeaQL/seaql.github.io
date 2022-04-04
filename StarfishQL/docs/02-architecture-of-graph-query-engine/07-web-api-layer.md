# Web API Layer

The current implementation of the StarfishQL query engine handle requests with the `rocket`([crates.io](https://crates.io/crates/rocket)) web framework.

The `/schema`, `/mutate`, and `/query` endpoints are exposed for the corresponding class of operations.

For all operations, the server follows the exact same workflow:

1. Parse the body of the POST request.
2. According to metadata extracted from the body, invoke the corresponding functions in the Rust structs.

As such, the web API layer is separated from the operations layer, which is in the interest of maintainability.
