# Streamer

The [`Streamer`](https://docs.rs/sea-streamer/*/sea_streamer/trait.Streamer.html) trait defines the common interface of streaming clients.

Implemented by:
+ [`KafkaStreamer`](https://docs.rs/sea-streamer-kafka/*/sea_streamer_kafka/struct.KafkaStreamer.html)
+ [`RedisStreamer`](https://docs.rs/sea-streamer-redis/*/sea_streamer_redis/struct.RedisStreamer.html)
+ [`StdioStreamer`](https://docs.rs/sea-streamer-stdio/latest/sea_streamer_stdio/struct.StdioStreamer.html)

:::info
#### Kafka semantics

Consult https://kafka.apache.org/documentation/#intro_concepts_and_terms for a gentle introduction.
:::

:::info
#### Redis semantics

SeaStreamer Redis aims to provide a Kafka-like client experience, but there are some fundamental differences between Redis and Kafka:

+ In Redis sequence numbers are not contiguous
+ In Redis messages are dispatched to consumers among group members in a first-ask-first-served manner, which leads to the next point
+ In Redis ACK has to be done per message
:::

:::info
#### Stdio semantics

The Stdio backend spawn two dedicated threads to handle stdin and stdout respectively. The host part of the Streamer URI is always empty, i.e. in `stdio://`, the host is ` `. There is only shard `ZERO`.
:::

## `ConnectOptions`

### `timeout`

Set the default network timeout for all connections.

## `connect`

Establish a connection to the streaming server. The `Streamer` implementation does not have to maintain an open connection to the server.

## `disconnect`

Disconnect from the streaming server. The intention is to flush remaining messages and exit gracefully. You have to `await` this operation until it completes. Once you called this method, all producers and consumers created will become unusable.

## `create_producer`

Create a producer that streams to the specified stream.

## `create_generic_producer`

Create a producer that can stream to any stream.

## `create_consumer`

Create a consumer subscribing to the specified streams.
