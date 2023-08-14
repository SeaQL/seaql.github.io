# Consumer

The [`Consumer`](https://docs.rs/sea-streamer/*/sea_streamer/trait.Consumer.html) trait defines the common interface of stream consumers.

Implemented by:
+ [`KafkaConsumer`](https://docs.rs/sea-streamer-kafka/*/sea_streamer_kafka/struct.KafkaConsumer.html)
+ [`RedisConsumer`](https://docs.rs/sea-streamer-redis/*/sea_streamer_redis/struct.RedisConsumer.html)
+ [`StdioConsumer`](https://docs.rs/sea-streamer-stdio/*/sea_streamer_stdio/struct.StdioConsumer.html)
+ [`FileConsumer`](https://docs.rs/sea-streamer-file/*/sea_streamer_file/struct.FileConsumer.html)

## `ConsumerOptions`

### `ConsumerMode`

There are 3 modes:

#### `RealTime`

This is the 'vanilla' stream consumer. It does not auto-commit, and thus only consumes messages from now on.

#### `Resumable`

When the process restarts, it will resume the stream from the previous committed sequence.

:::info
#### Redis / Kafka semantics

It will use a group id unique to this host: on a physical machine, it will use the mac address.
Inside a docker container, it will use the container id.
:::

:::info
#### Redis semantics

Redis requires consumers to self-assign consumer IDs. If unset, SeaStreamer uses a combination of `host id` + `process id` + `thread id` + `timestamp`.
:::

:::caution
#### Stdio / File semantics

Currently unsupported.
:::

#### `LoadBalanced`

You should assign a consumer group manually. The load-balancing mechanism is implementation-specific.

### `ConsumerGroup`

A consumer group is a string for clients to identify themselves to the streaming server. So that when you reconnect, the states can be downloaded from the server. From the broker's point of view, it is all that matters. The client can connect from any host or network.

Multiple consumers can share the same consumer group, and remain connected to the server at the same time. Usually, the intention is to achieve load-balancing. The precise semantics is backend-specific.

:::info
#### Kafka semantics

If multiple consumers shares the same group, only one consumer in the group will receive a message, i.e. it is load-balanced.

However, the load-balancing mechanism is what makes Kafka different:

Each stream is divided into multiple shards (known as partition), and each partition will be assigned to only one consumer in a group.

Say there are 2 consumers (in the group) and 2 partitions, then each consumer will receive messages from one partition, and they are thus load-balanced.

If there are 2 consumers and 3 partitions, then one consumer will be assigned 2 partitions, and the other will be assigned only 1.

However if the stream has only 1 partition, even if there are many consumers, these messages will only be received by the assigned consumer, and other consumers will be in stand-by mode, resulting in a hot-failover setup.
:::

:::info
#### Redis semantics

Multiple consumers in the same group share the same stream. This is load-balanced in a first-ask-first-served manner. This can be considered dynamic load-balancing: faster consumers will consume more messages.

As a consequence, `ack` has to be done per message. It becomes two steps in SeaStreamer, ack and commit: `ack` is non-blocking, it will buffer acks internally and `commit` to Redis at a regular interval, or upon your request. There are multiple [auto ack / commit mechanisms](https://docs.rs/sea-streamer-redis/*/sea_streamer_redis/enum.AutoCommit.html) to choose from: `Immediate`, `Delayed`, `Rolling`, and `Disabled`.

SeaStreamer also implements automatic failover, where leftover messages for other consumers can be 'claimed' after a set period of time, assuming they are dead. This can be configured via the [auto claim](https://docs.rs/sea-streamer-redis/*/sea_streamer_redis/struct.RedisConsumerOptions.html#method.set_auto_claim_interval) options.
:::

:::info
#### Stdio / File semantics

If multiple consumers share the same group, only one in the group will receive a message.
This is load-balanced in a round-robin fashion.
:::

## `next`

Poll and receive one message: it awaits until there are new messages.
This method can be called from multiple threads.

## `stream`

Returns an async stream which implements the [Stream Trait](https://docs.rs/futures-core/*/futures_core/stream/trait.Stream.html). You cannot create multiple streams from the same consumer, nor perform any operation while streaming.

It allows you to do neat things:

```rust
let items = consumer
    .stream()
    .take(num)
    .map(process_message)
    .collect::<Vec<_>>()
    .await
```

## `assign`

Assign this consumer to a particular shard. Can be called multiple times to assign
to multiple shards. You cannot assign streams that has not been subscribed.

It will only take effect on the next `Consumer::seek` or `Consumer::rewind`.

## `unassign`

Unassign a shard. Returns `ConsumerNotAssigned` if this consumer has not been assigned to this stream or shard. 

## `rewind`

Rewind the stream to a particular sequence number.

:::info
#### Kafka semantics

If the consumer is not already assigned, shard ZERO will be used. This async method is not cancel safe. You must await this future, and this Consumer will be unusable for any operations until it finishes.
:::

:::info
#### Redis semantics

In Redis a sequence number comprises a timestamp, so rewind is nearly the same as seek, but more precise: you can rewind to a particular point within a millisecond.
:::

:::info
#### File semantics

Affects all streams.
If the consumer is subscribing to multiple streams, it will be sought by the first stream key.
It revokes the group membership of the Consumer.
:::

:::caution
#### Stdio semantics

This is not implemented by the Stdio backend.
:::

## `seek`

Seek all streams to the given point in time. It will start consuming from the earliest message with a timestamp later than `to`.


:::info
#### Kafka semantics

This will self-assign all shards. This async method is not cancel safe. You must await this future, and this Consumer will be unusable for any operations until it finishes.
:::

:::info
#### Redis semantics

Seeking a Consumer will detach it from the Consumer Group, if it has been assigned one. It effectively makes it a RealTime Consumer.
:::

:::info
#### File semantics

Affects all streams.
If the consumer is subscribing to multiple streams, it will be sought by the first stream key.
It revokes the group membership of the Consumer.
:::

:::caution
#### Stdio semantics

This is not implemented by the Stdio backend.
:::

## Auto Stream Reset

:::info
#### Kafka semantics

The `AutoOffsetReset` option allows resetting the stream to `Earliest` if a consumer group is not assigned, or the consumer group has no priori state. Defaults to `Latest`.
:::

:::info
#### Redis semantics

The `AutoStreamReset` option allows resetting the stream to `Earliest` if a consumer group is not assigned, or the consumer group has no priori state. Defaults to `Latest`.
:::

:::info
#### File semantics

The `AutoStreamReset` option allows resetting the stream to `Earliest` upon stream start. Defaults to `Latest`.
Multiple consumers streaming from the same file will share the same file handle if they are all `Latest`.
Calling seek/rewind on a consumer would detach it from the consumer group, and will open a new file handle.
:::

:::caution
#### Stdio semantics

This is not implemented by the Stdio backend.
:::