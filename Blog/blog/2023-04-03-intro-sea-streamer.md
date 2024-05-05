---
slug: 2023-04-03-intro-sea-streamer
title: Introducing SeaStreamer 🌊
author: Chris Tsang
author_title: SeaQL Team
author_url: https://github.com/tyt2y3
author_image_url: https://avatars.githubusercontent.com/u/1782664?v=4
image: https://www.sea-ql.org/SeaStreamer/img/SeaStreamer%20banner.png
tags: [news]
---

<a href="https://www.sea-ql.org/SeaStreamer/"><img src="https://www.sea-ql.org/SeaStreamer/img/SeaStreamer%20banner.png" /></a>

We are pleased to introduce [SeaStreamer](https://github.com/SeaQL/sea-streamer/) to the Rust community today. SeaStreamer is a stream processing toolkit to help you build stream processors in Rust.

At SeaQL we want to make Rust the best programming platform for data engineering. Where SeaORM is the essential tool for working with SQL databases, SeaStreamer aims to be your essential toolkit for working with streams.

Currently SeaStreamer provides integration with Kafka and Redis.

Let's have a quick tour of SeaStreamer.

## High level async API

+ High level async API that supports both `async-std` and `tokio`
+ Mutex-free implementation[^1]: concurrency achieved by message passing
+ A comprehensive type system that guides/restricts you with the API

[^1]: except `sea-streamer-stdio`, but only contends on consumer add/drop

Below is a [basic Kafka consumer](https://github.com/SeaQL/sea-streamer/blob/main/sea-streamer-kafka/src/bin/consumer.rs):

```rust
#[tokio::main]
async fn main() -> Result<()> {
    env_logger::init();

    let stream: StreamUrl = "kafka://streamer.sea-ql.org:9092/my_stream".parse()?;
    let streamer = KafkaStreamer::connect(stream.streamer(), Default::default()).await?;
    let mut options = KafkaConsumerOptions::new(ConsumerMode::RealTime);
    options.set_auto_offset_reset(AutoOffsetReset::Earliest);
    let consumer = streamer
        .create_consumer(stream.stream_keys(), options)
        .await?;

    loop {
        let mess = consumer.next().await?;
        println!("{}", mess.message().as_str()?);
    }
}
```

[`Consumer::stream()`](https://docs.rs/sea-streamer/latest/sea_streamer/trait.Consumer.html#tymethod.stream) returns an object that implements the [`Stream`](https://docs.rs/futures-core/latest/futures_core/stream/trait.Stream.html) trait, which allows you to do neat things:

```rust
let items = consumer
    .stream()
    .take(num)
    .map(process_message)
    .collect::<Vec<_>>()
    .await
```

## Trait-based abstract interface

All SeaStreamer backends implement a common abstract interface, offering you a familiar API. Below is a [basic Redis consumer](https://github.com/SeaQL/sea-streamer/blob/main/sea-streamer-redis/src/bin/consumer.rs), which is nearly the same as the previous example:

```rust
#[tokio::main]
async fn main() -> Result<()> {
    env_logger::init();

    let stream: StreamUrl = "redis://localhost:6379/my_stream".parse()?;
    let streamer = RedisStreamer::connect(stream.streamer(), Default::default()).await?;
    let mut options = RedisConsumerOptions::new(ConsumerMode::RealTime);
    options.set_auto_stream_reset(AutoStreamReset::Earliest);
    let consumer = streamer
        .create_consumer(stream.stream_keys(), options)
        .await?;

    loop {
        let mess = consumer.next().await?;
        println!("{}", mess.message().as_str()?);
    }
}
```

## Redis Streams Support

SeaStreamer Redis provides a Kafka-like stream semantics:

+ Non-group streaming with AutoStreamReset option
+ Consumer-group-based streaming with auto-ack and/or auto-commit
+ Load balancing among consumers with automatic failover
+ Seek/rewind to point in time

You don't have to call `XADD`, `XREAD`, `XACK`, etc... anymore!

## Enum-based generic interface

The trait-based API requires you to designate the concrete `Streamer` type for monomorphization, otherwise the code cannot compile.

Akin to how SeaORM implements runtime-polymorphism, SeaStreamer provides a enum-based generic streamer, in which the backend is selected ***on runtime***.

Here is an illustration ([full example](https://github.com/SeaQL/sea-streamer/blob/main/examples/src/bin/resumable.rs)):

```rust
// sea-streamer-socket
pub struct SeaConsumer {
    backend: SeaConsumerBackend,
}

enum SeaConsumerBackend {
    #[cfg(feature = "backend-kafka")]
    Kafka(KafkaConsumer),
    #[cfg(feature = "backend-redis")]
    Redis(RedisConsumer),
    #[cfg(feature = "backend-stdio")]
    Stdio(StdioConsumer),
}

// Your code
let uri: StreamerUri = "kafka://localhost:9092".parse()?; // or
let uri: StreamerUri = "redis://localhost:6379".parse()?; // or
let uri: StreamerUri = "stdio://".parse()?;

// SeaStreamer will be backed by Kafka, Redis or Stdio depending on the URI
let streamer = SeaStreamer::connect(uri, Default::default()).await?;

// Set backend-specific options
let mut options = SeaConsumerOptions::new(ConsumerMode::Resumable);
options.set_kafka_consumer_options(|options: &mut KafkaConsumerOptions| { .. });
options.set_redis_consumer_options(|options: &mut RedisConsumerOptions| { .. });
let mut consumer: SeaConsumer = streamer.create_consumer(stream_keys, options).await?;

// You can still retrieve the concrete type
let kafka: Option<&mut KafkaConsumer> = consumer.get_kafka();
let redis: Option<&mut RedisConsumer> = consumer.get_redis();
```

So you can "write once, stream anywhere"!

## Good old unix pipe

In SeaStreamer, `stdin` & `stdout` can be used as stream source and sink.

Say you are developing some processors to transform a stream in several stages:

```shell
./processor_1 --input kafka://localhost:9092/input --output kafka://localhost:9092/stage_1 &
./processor_2 --input kafka://localhost:9092/stage_1 --output kafka://localhost:9092/stage_2 &
./processor_3 --input kafka://localhost:9092/stage_2 --output kafka://localhost:9092/output &
```

It would be great if we can simply ***pipe*** the processors together right?

With SeaStreamer, you can do the following:

```shell
./processor_1 --input kafka://localhost:9092/input --output stdio:///stream |
./processor_2 --input stdio:///stream --output stdio:///stream |
./processor_3 --input stdio:///stream --output kafka://localhost:9092/output
```

All ***without recompiling*** the stream processors! Now, you can develop locally with the comfort of using `|`, `>`, `<` and your favourite unix program in the shell.

## Testable

SeaStreamer encourages you to write tests at all levels:

+ You can execute tests involving several *stream processors* in the same *OS process*
+ You can execute tests involving several *OS processes* by connecting them with pipes
+ You can execute tests involving several *stream processors* with Redis / Kafka

All against the same piece of code! Let SeaStreamer take away the boilerplate and mocking facility from your codebase.

Below is an example of [intra-process testing](https://github.com/SeaQL/sea-streamer/blob/main/sea-streamer-stdio/tests/loopback.rs), which can be run with `cargo test` without any dependency or side-effects:

```rust
let stream = StreamKey::new("test")?;
let mut options = StdioConnectOptions::default();
options.set_loopback(true); // messages produced will be feed back to consumers
let streamer = StdioStreamer::connect(StreamerUri::zero(), options).await?;
let producer = streamer.create_producer(stream.clone(), Default::default()).await?;
let mut consumer = streamer.create_consumer(&[stream.clone()], Default::default()).await?;

for i in 0..5 {
    let mess = format!("{}", i);
    producer.send(mess)?;
}

let seq = collect(&mut consumer, 5).await;
assert_eq!(seq, [0, 1, 2, 3, 4]);
```

## Getting started

If you are eager to get started with SeaStreamer, you can checkout our [set of examples](https://github.com/SeaQL/sea-streamer/tree/main/examples):

+ [`consumer`](https://github.com/SeaQL/sea-streamer/blob/main/examples/src/bin/consumer.rs): A basic consumer
+ [`producer`](https://github.com/SeaQL/sea-streamer/blob/main/examples/src/bin/producer.rs): A basic producer
+ [`processor`](https://github.com/SeaQL/sea-streamer/blob/main/examples/src/bin/processor.rs): A basic stream processor
+ [`resumable`](https://github.com/SeaQL/sea-streamer/blob/main/examples/src/bin/resumable.rs): A resumable stream processor that continues from where it left off
+ [`buffered`](https://github.com/SeaQL/sea-streamer/blob/main/examples/src/bin/buffered.rs): An advanced stream processor with internal buffering and batch processing
+ [`blocking`](https://github.com/SeaQL/sea-streamer/blob/main/examples/src/bin/blocking.rs): An advanced stream processor for handling blocking / CPU-bound tasks

Read the official [documentation](https://www.sea-ql.org/SeaStreamer/docs/index/) to learn more.

## Roadmap

A few major components we [plan to develop](https://www.sea-ql.org/SeaStreamer/docs/whats-next/roadmap/):

+ File Backend
+ Redis Cluster

We welcome you to join our [Discussions](https://github.com/SeaQL/sea-streamer/discussions) if you have thoughts or ideas!

## People

SeaStreamer is designed and developed by the same mind who brought you [SeaORM](https://github.com/SeaQL/sea-orm/):

<div class="container">
    <div class="row">
        <div class="col col--12 margin-bottom--md">
            <div class="avatar">
                <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/tyt2y3">
                    <img src="https://avatars.githubusercontent.com/u/1782664?v=4" />
                </a>
                <div class="avatar__intro">
                    <div class="avatar__name">
                        Chris Tsang
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

## Community

SeaQL.org is an independent open-source organization run by passionate ️developers. If you like our projects, please star ⭐ and share our repositories. If you feel generous, a small donation via [GitHub Sponsor](https://github.com/sponsors/SeaQL) will be greatly appreciated, and goes a long way towards sustaining the organization 🚢.

SeaStreamer is a community driven project. We welcome you to participate, contribute and together build for Rust's future 🦀.
