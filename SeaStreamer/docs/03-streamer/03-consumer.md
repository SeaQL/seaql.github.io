# Consumer

The [`Consumer`](https://docs.rs/sea-streamer/*/sea_streamer/trait.Consumer.html) trait defines the common interface of stream consumers.

[`KafkaConsumer`](https://docs.rs/sea-streamer-kafka/*/sea_streamer_kafka/struct.KafkaConsumer.html) has more functions for committing offsets. [`StdioConsumer`](https://docs.rs/sea-streamer-stdio/*/sea_streamer_stdio/struct.StdioConsumer.html) currently has no specific functions.

## `ConsumerOptions`

### `ConsumerMode`

There are 3 modes:

#### `RealTime`

This is the 'vanilla' stream consumer. It does not auto-commit, and thus only consumes messages from now on.

#### `Resumable`

When the process restarts, it will resume the stream from the previous committed sequence.

:::info
#### Kafka semantics

It will use a group id unique to this host: on a physical machine, it will use the mac address.
Inside a docker container, it will use the container id.
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
#### Stdio semantics

If multiple consumers share the same group, only one in the group will receive a message.
This is load-balanced in a round-robin fashion.
:::

## `next`

Poll and receive one message: it awaits until there are new messages.

## `stream`

Returns an async stream. You cannot create multiple streams from the same consumer, nor perform any operation while streaming.

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

Assign this consumer to a particular shard.

It will only take effect on the next `Consumer::seek` or `Consumer::rewind`.

:::info
#### Kafka semantics

Always succeed. This operation is additive. You can assign a consumer to multiple shards (aka partition). There is also a `KafkaConsumer::unassign` method.
:::

:::info
#### Stdio semantics

There is only shard ZERO anyway.
:::

## `rewind`

Rewind the stream to a particular sequence number.

If the consumer is not already assigned, shard ZERO will be used.

:::info
#### Kafka semantics

Note: this rewind all streams across all assigned partitions.
:::

:::caution
#### Stdio semantics

This is not implemented by the Stdio backend.
:::

## `seek`

Seek all streams to the given point in time. It will start consuming from the earliest message with a timestamp later than `to`.

If the consumer is not already assigned, shard ZERO will be used.

:::info
#### Kafka semantics

This async method is not cancel safe. You must await this future, and this Consumer will be unusable for any operations until it finishes.
:::

:::caution
#### Stdio semantics

This is not implemented by the Stdio backend.
:::
