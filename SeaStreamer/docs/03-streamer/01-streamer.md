# Streamer

The [`Streamer`](https://docs.rs/sea-streamer/*/sea_streamer/trait.Streamer.html) trait defines the common interface of streaming clients.

## `ConnectOptions`

### `timeout`

Set the default network timeout for all connections.

## `connect`

Establish a connection to the streaming server. The `Streamer` implementation does not have to maintain an open connection to the server.

## `disconnect`

Disconnect from the streaming server. The intention is to flush remaining messages and exit gracefully. You have to `await` this operation until it completes. Once you called this method, all producers and consumers created will be unusable.

## `create_producer`

Create a producer that streams to the specified stream.

## `create_generic_producer`

Create a producer that can stream to any stream.

## `create_consumer`

Create a consumer subscribing to the specified streams.
