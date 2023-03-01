# Producer

The [`Producer`](https://docs.rs/sea-streamer/*/sea_streamer/trait.Producer.html) trait defines the common interface of stream producers.

## `ProducerOptions`

There is nothing interesting as of now. We may add some in the future.

## `send`

Send a message to the already anchored stream. This function is non-blocking. You don’t have to `await` the future if you are not interested in the `Receipt`.

If the producer is not anchored, this will return `StreamErr::NotAnchored` error.

### `Receipt`

If you await the future, you will have a receipt composed of (StreamKey, ShardId, SeqNo, Timestamp). This usually means that the message has been *received by* the broker, but may not guarantee that the message is already *persisted*.

## `send_to`

Like `send`, but to the specified stream key.

## `anchor`

Lock this producer to a particular stream. This function can only be called once. Subsequent calls should return `StreamErr::AlreadyAnchored` error.

## `anchored`

f the producer is already anchored, return a reference to the StreamKey If the producer is not anchored, this will return `StreamErr::NotAnchored` error.
