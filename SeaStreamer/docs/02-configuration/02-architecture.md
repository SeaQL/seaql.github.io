# SeaStreamer Architecture

The architecture of [`sea-streamer`](https://docs.rs/sea-streamer) is constructed by a number of sub-crates:

+ [`sea-streamer-types`](https://docs.rs/sea-streamer-types)
+ [`sea-streamer-socket`](https://docs.rs/sea-streamer-socket)
    + [`sea-streamer-kafka`](https://docs.rs/sea-streamer-kafka)
    + [`sea-streamer-stdio`](https://docs.rs/sea-streamer-stdio)
+ [`sea-streamer-runtime`](https://docs.rs/sea-streamer-runtime)

### `sea-streamer-types`: Traits & Types

This crate defines all the traits and types for the SeaStreamer API, but does not provide any implementation.

### `sea-streamer-socket`: Backend-agnostic Socket API

Akin to how SeaORM allows you to build applications for different databases, SeaStreamer allows you to build
stream processors for different streaming servers.

While the `sea-streamer-types` crate provides a nice trait-based abstraction, this crates provides a concrete-type API,
so that your program can stream from/to any SeaStreamer backend selected by the user *on runtime*.

This allows you to do neat things, like generating data locally and then stream them to Kafka. Or in the other
way, sink data from Kafka to work on them locally. All _without recompiling_ the stream processor.

### `sea-streamer-kafka`: Kafka / Redpanda Backend

This is the Kafka / Redpanda backend implementation for SeaStreamer.
This crate provides a comprehensive type system that makes working with Kafka easier and safer.

This crate depends on [`rdkafka`](https://docs.rs/rdkafka),
which in turn depends on [librdkafka-sys](https://docs.rs/librdkafka-sys), which itself is a wrapper of
[librdkafka](https://docs.confluent.io/platform/current/clients/librdkafka/html/index.html).

### `sea-streamer-stdio`: Standard I/O Backend

This is the `stdio` backend implementation for SeaStreamer. It is designed to be connected together with unix pipes,
enabling great flexibility when developing stream processors or processing data locally.

You can connect processes together with pipes: `processor_a | processor_b`.

### `sea-streamer-runtime`: Async runtime abstraction

This crate provides a small set of functions aligning the type signatures between `async-std` and `tokio`,
so that you can build applications generic to both runtimes.
