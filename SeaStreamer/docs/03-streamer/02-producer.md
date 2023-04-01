# Producer

The [`Producer`](https://docs.rs/sea-streamer/*/sea_streamer/trait.Producer.html) trait defines the common interface of stream producers. `Producer` implements `Clone`, so you can use it like an `mpsc::Sender`.

Implemented by:
+ [`KafkaProducer`](https://docs.rs/sea-streamer-kafka/*/sea_streamer_kafka/struct.KafkaProducer.html)
+ [`RedisProducer`](https://docs.rs/sea-streamer-redis/*/sea_streamer_redis/struct.RedisProducer.html)
+ [`StdioProducer`](https://docs.rs/sea-streamer-stdio/latest/sea_streamer_stdio/struct.StdioProducer.html)

## `ProducerOptions`

:::info
#### Redis semantics

You can assign custom sharders to Producers. Sharding simply means splitting a stream into multiple keys, in the format of `STREAM_KEY:SHARD_ID`.
:::

## `send`

Send a message to the already anchored stream. This function is non-blocking. You don’t have to `await` the future if you are not interested in the `Receipt`.

If the producer is not anchored, this will return `StreamErr::NotAnchored` error.

### `Receipt`

If you await the future, you will get a receipt composed of (StreamKey, ShardId, SeqNo, Timestamp). This usually means that the message has been *received by* the server, but may not guarantee that the message is already *persisted*.

## `send_to`

Like `send`, but to the specified stream key.

## `flush`

Flush all pending messages.

## `end`

End this producer, only after flushing all it's pending messages.

## `anchor`

Lock this producer to a particular stream. This function can only be called once. Subsequent calls should return `StreamErr::AlreadyAnchored` error.

## `anchored`

If the producer is already anchored, return a reference to the StreamKey. If the producer is not anchored, this will return `StreamErr::NotAnchored` error.
