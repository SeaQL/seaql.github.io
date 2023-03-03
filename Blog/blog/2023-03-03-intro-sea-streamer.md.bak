---
slug: 2023-03-03-intro-sea-streamer
title: Introducing SeaStreamer 🌊
author: Chris Tsang
author_title: SeaQL Team
author_url: https://github.com/tyt2y3
author_image_url: https://avatars.githubusercontent.com/u/1782664?v=4
tags: [news]
---

<img src="https://www.sea-ql.org/SeaStreamer/img/SeaStreamer%20banner.png" />

We are pleased to introduce [SeaStreamer](https://www.sea-ql.org/SeaStreamer/) to the Rust community today. SeaStreamer is a stream processing toolkit to help you build stream processors in Rust.

At SeaQL we want to make Rust the best programming platform for data engineering. Where SeaORM is the essential tool for working with SQL, SeaStreamer aims to be your essential toolkit for working with streams.

Currently SeaStreamer provides integration for Kafka / Redpanda. Support for Redis Stream is being planned.

Let's have a quick tour of SeaStreamer.

## High level async API

+ Non-blocking async API
+ Supports both `async-std` and `tokio`
+ Streams are resources, and can be accessed through a URL
+ Options are nicely named and typed

Below is a [basic stream consumer](https://github.com/SeaQL/sea-streamer/tree/main/examples/src/bin/consumer.rs):

```rust
#[tokio::main]
async fn main() -> Result<()> {
    let stream: StreamUrl = "kafka://streamer.sea-ql.org:9092/my_stream".parse()?;
    let streamer = SeaStreamer::connect(stream.streamer(), Default::default()).await?;

    let mut options = SeaConsumerOptions::new(ConsumerMode::RealTime);
    options.set_kafka_consumer_options(|options| {
        options.set_auto_offset_reset(AutoOffsetReset::Earliest);
    });
    let consumer: SeaConsumer = streamer
        .create_consumer(stream.stream_keys(), options)
        .await?;

    loop {
        let mess: SeaMessage = consumer.next().await?;
        println!("[{}] {}", mess.timestamp(), mess.message().as_str()?);
    }
}
```

`Consumer` implements the `futures::Stream` trait:

```rust
let items = consumer
    .stream()
    .take(num)
    .map(process_message)
    .collect::<Vec<_>>()
    .await
```

## Good old unix pipe

In SeaStreamer, `stdin` & `stdout` can be used as stream source and sink.

Say you are developing some processors to transform a stream in several stages:

```shell
./processor_1 --input kafka://localhost:9092/source --output kafka://localhost:9092/stage_1 &
./processor_2 --input kafka://localhost:9092/stage_1 --output kafka://localhost:9092/stage_2 &
./processor_3 --input kafka://localhost:9092/stage_2 --output kafka://localhost:9092/output &
```

It would be great if we can simply ***pipe*** the processors together right?

With SeaStreamer, you can do the following:

```shell
./processor_1 --input kafka://localhost:9092/source --output stdio:///stream |
./processor_2 --input stdio:///stream --output stdio:///stream |
./processor_3 --input stdio:///stream --output kafka://localhost:9092/output
```

All ***without recompiling*** the stream processors! Now, you can work on your data locally with the comfort of connecting stream processors with `|`, `>` & `<` in the shell, and editing data with your favourite text editor.

## Testable

SeaStreamer encourages you to write tests at all levels:

+ You can execute tests involving several *stream processors* in the same *OS process*
+ You can execute tests involving several *OS processes* by connecting them with pipes
+ You can execute tests involving several *stream processors* with Kafka in CI

All against the same piece of code! Let SeaStreamer take away the boilerplate and mocking facility from your codebase.

Below is [an example](https://github.com/SeaQL/sea-streamer/blob/main/sea-streamer-stdio/tests/loopback.rs) of intra-process testing:

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

Read the official [documentation](https://www.sea-ql.org/SeaStreamer/docs/index/) to learn more.

## Roadmap

A few major components we plan to [develop up next](https://www.sea-ql.org/SeaStreamer/docs/next/roadmap/):

+ File Backend
+ Redis Backend

We welcome you to join our [Discussions](https://github.com/SeaQL/sea-streamer/discussions) if you have thoughts and ideas!

## People

SeaStreamer is designed by the same mind who brought you [SeaORM](https://www.sea-ql.org/SeaORM/):

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

## Sponsor

SeaQL.org is an independent open-source organization run by passionate developers. If you enjoy using our libraries, please star and share our repositories. If you feel generous, a small donation via [GitHub Sponsor](https://github.com/sponsors/SeaQL) will be greatly appreciated, and goes a long way towards sustaining the organization.

SeaStreamer is a community driven project. We welcome you to participate, contribute and together build for Rust's future.
