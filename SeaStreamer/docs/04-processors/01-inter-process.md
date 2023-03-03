# Inter Process

SeaStreamer encourages you to write small stream processors and connect them together, instead of making one giant processor with lots of options.

The unix pipe is a great invention, which makes anyone a text processing wizard by assembling programs in the shell!

What if we can also work with event streams in the same way?

With SeaStreamer, you can connect processors together with pipes:

```shell
processor_a | processor_b
```

You can also connect them asynchronously with files:

```shell
touch stream # set up an empty file
tail -f stream | processor_b # program b can be spawned anytime
processor_a >> stream # append to the file
```

You can also use `cat` to replay a file, but it runs from start to end as fast as possible then stops,
which may or may not be the desired behavior.

## Trying out

A small number of cli programs are provided by SeaStreamer for demonstration. Let's set them up first:

```shell
# The `clock` program generate messages in the form of `{ "tick": N }`
alias clock='cargo run --package sea-streamer-stdio  --features=executables --bin clock'
# The `relay` program redirect messages from `input` to `output`
alias relay='cargo run --package sea-streamer-socket --features=executables --bin relay'
```

Here is how to stream from Stdio ➡️ Kafka. We generate messages using `clock` and then pipe it to `relay`,
which then streams to Kafka:

```shell
clock -- --stream clock --interval 1s | \
relay -- --input stdio:///clock --output kafka://localhost:9092/clock
```

Here is how to *replay* the stream from Kafka ➡️ Stdio:

```shell
relay -- --input kafka://localhost:9092/clock --output stdio:///clock --offset start
```

## Stdio message format

You can write any valid UTF-8 string to stdin and each line will be considered a message. In addition, you can write some message meta in a simple format:

```log
[timestamp | stream_key | sequence | shard_id] payload
```

Note: the square brackets are literal `[` `]`.

The following are all valid:

```log
a plain, raw message
[2022-01-01T00:00:00] { "payload": "anything" }
[2022-01-01T00:00:00.123 | my_topic] "a string payload"
[2022-01-01T00:00:00 | my-topic-2 | 123] ["array", "of", "values"]
[2022-01-01T00:00:00 | my-topic-2 | 123 | 4] { "payload": "anything" }
[my_topic] a string payload
[my_topic | 123] { "payload": "anything" }
[my_topic | 123 | 4] { "payload": "anything" }
```

The following are all invalid:

```log
[Jan 1, 2022] { "payload": "anything" }
[2022-01-01T00:00:00] 12345
```

If no stream key is given, it will be assigned the name `broadcast` and sent to all consumers.
