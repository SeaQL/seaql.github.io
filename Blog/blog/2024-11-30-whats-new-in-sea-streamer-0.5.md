---
slug: 2024-11-30-whats-new-in-sea-streamer-0.5
title: What's new in SeaStreamer 0.5
author: Chris Tsang
author_title: SeaQL Team
author_url: https://github.com/tyt2y3
author_image_url: https://avatars.githubusercontent.com/u/1782664?v=4
image: https://www.sea-ql.org/SeaStreamer/img/SeaStreamer%20banner.png
tags: [news]
---

<a href="https://www.sea-ql.org/SeaStreamer/"><img src="https://www.sea-ql.org/SeaStreamer/img/SeaStreamer%20banner.png" /></a>

🎉 We are pleased to release SeaStreamer [`0.5.x`](https://github.com/SeaQL/sea-streamer/releases/tag/0.5.2)!

Here is the summary of new features and enhancements:

## `sea-streamer-types`

* Added `From<Url>` and `FromIterator<Url>` for `StreamerUri` [#28](https://github.com/SeaQL/sea-streamer/pull/28)
* Impl `Default` for `Payload`
* Impl serde `Serialize` & `Deserialize` for `StreamKey` (enabled by the feature flag `serde`), so this is now possible:
```rust
#[derive(Serialize, Deserialize)]
struct MyStruct {
    stream_key: StreamKey,
}
```

## `sea-streamer-socket`

* The Socket library can now be compiled without the `stdio` backend [#35](https://github.com/SeaQL/sea-streamer/pull/35)

## `sea-streamer-redis`

* Support nanosecond timestamp in Redis (under feature flag `nanosecond-timestamp`).
    Redis's default Stream ID resolution is millisecond, and it can be changed to nanosecond with [`RedisConnectOptions::set_timestamp_format`](https://docs.rs/sea-streamer-redis/latest/sea_streamer_redis/struct.RedisConnectOptions.html#method.set_timestamp_format):
    ```rust
    let mut options = RedisConnectOptions::default();
    options.set_timestamp_format(TimestampFormat::UnixTimestampNanos);
    ```
* Added [`RedisConnectOptions::set_message_field`](https://docs.rs/sea-streamer-redis/latest/sea_streamer_redis/struct.RedisConnectOptions.html#method.set_message_field) to set custom message field (the default used to be `msg`):
    ```rust
    let mut options = RedisConnectOptions::default();
    options.set_message_field("event");
    ```
* Added [`RedisProducer::send_with_ts`](https://docs.rs/sea-streamer-redis/latest/sea_streamer_redis/struct.RedisProducer.html#method.send_with_ts) to specify custom timestamp:
    ```rust
    producer.send_with_ts(&stream_key, timestamp, message)?;
    ```
* Added [`RedisProducer::flush_immut`](https://docs.rs/sea-streamer-redis/latest/sea_streamer_redis/struct.RedisProducer.html#method.flush_immut). This method is same as [`RedisProducer::flush`](https://docs.rs/sea-streamer-redis/latest/sea_streamer_redis/struct.RedisProducer.html#method.flush) but without `&mut self`
* Added [`RedisProducer::trim`](https://docs.rs/sea-streamer-redis/latest/sea_streamer_redis/struct.RedisProducer.html#method.trim) to perform `XTRIM MAXLEN`:
    ```rust
    producer.trim(&stream_key, maxlen).await?;
    ```
* Fixed `capacity overflow` error in some cases

## `sea-streamer-file`

* Added a special `SEA_STREAMER_WILDCARD` stream key to subscribe to all streams in a file:
    ```rust
    let consumer: SeaConsumer = streamer
        .create_consumer(&[StreamKey::new(SEA_STREAMER_WILDCARD)?], options)
        .await?;
    ```

## `sea-streamer-fuse`

We've shipped the first component library for stream processing! It currently only has one class, [`StreamJoin`](https://docs.rs/sea-streamer-fuse/latest/sea_streamer_fuse/struct.StreamJoin.html).

It is designed to be used in stream replay. In live streaming, if you have multiple streams from different sources and you want to multiplex them together, you can use the awesome [`futures_concurrency`](https://docs.rs/futures-concurrency) crate's [`Merge`](https://docs.rs/futures-concurrency/latest/futures_concurrency/stream/trait.Merge.html), and it just works!

```rust
use futures_concurrency::{stream::Merge, vec::Merge as Merged};

let consumers: Vec<SeaConsumer> = vec![stream_a, stream_b];
let streams: Vec<SeaMessageStream<'a>> = consumers.iter_mut().map(|ss| ss.stream()).collect();
let merged: Merged<SeaMessageStream<'a>> = streams.merge();
```

`stream_a` and `stream_b` can be heterogeneous, meaning they can be Kafka, Redis or even File.

How about in replay? In replay, different streams can flow at different pace, and thus if we try to naively merge them, the messages would come out-of-order.

To solve this problem, you can use [`StreamJoin::muxed`](https://docs.rs/sea-streamer-fuse/latest/sea_streamer_fuse/struct.StreamJoin.html#method.muxed):

```rust
type LiveStream<'a> = Merged<SeaMessageStream<'a>>;
let joined: StreamJoin<LiveStream<'a>, SeaMessage<'a>, StreamErr<BackendErr>> = StreamJoin::muxed(merged);
```

[`StreamJoin::align`](https://docs.rs/sea-streamer-fuse/latest/sea_streamer_fuse/struct.StreamJoin.html#method.align) must be called manually to specify which streams should be aligned. Otherwise, messages will be out of order until the first message of each key arrives. Imagine a severely delayed stream sending its first message one day later; it would invalidate everything that came before it. However, the issue lies with the delayed stream itself, not the others.

In the example below, messages from the fast stream will be buffered, until a message from the slow stream arrives.

```
fast | (1) (2) (3) (4) (5)
slow |         (2)         (6)
```

Messages `1`, `2` from fast will be buffered, until `2` from the slow stream arrives. Likewise, messages `3`, `4`, `5` will be buffered until 6 arrives.

The `StreamJoin` component is generic, and can actually be used outside of SeaStreamer, the only requirement is that the thing we want to align implements [`sea_streamer::Message`](https://docs.rs/sea-streamer-types/latest/sea_streamer_types/trait.Message.html):

```rust
impl Message for MyMessage {
    fn stream_key(&self) -> StreamKey { /* implement this */ }

    fn timestamp(&self) -> Timestamp { /* implement this */ }

    fn shard_id(&self) -> ShardId { /* doesn't matter */ }

    fn sequence(&self) -> SeqNo { /* doesn't matter */ }

    fn message(&self) -> Payload { /* doesn't matter */ }
}
```

## Anecdote

Over the past year, we've been using SeaStreamer heavily in production and it served us well!

SeaStreamer File is really handy, because it supports live streaming and also duals as an archive, in which it can be rotated and uploaded to the data lake every day. It has replaced our use of Redis in some same-host mpmc streaming scenario.

Redis Streams is also super nice (fast and reliable) and especially easy with SeaStreamer. IMO it's been underrated, it became our default choice for cross-host streaming.

By the way, SeaStreamer File is used as the tracing file format in [FireDBG](https://firedbg.sea-ql.org/).

## Community

SeaQL.org is an independent open-source organization run by passionate ️developers. If you like our projects, please star ⭐ and share our repositories. If you feel generous, a small donation via [GitHub Sponsor](https://github.com/sponsors/SeaQL) will be greatly appreciated, and goes a long way towards sustaining the organization 🚢.

## Rustacean Sticker Pack 🦀

The Rustacean Sticker Pack is the perfect way to express your passion for Rust.
Our stickers are made with a premium water-resistant vinyl with a unique matte finish.
Stick them on your laptop, notebook, or any gadget to show off your love for Rust!

Moreover, all proceeds contributes directly to the ongoing development of SeaQL projects.

Sticker Pack Contents:
- Logo of SeaQL projects: SeaQL, SeaORM, SeaQuery, Seaography, FireDBG
- Mascot of SeaQL: Terres the Hermit Crab
- Mascot of Rust: Ferris the Crab
- The Rustacean word

[Support SeaQL and get a Sticker Pack!](https://www.sea-ql.org/sticker-pack/)

<a href="https://www.sea-ql.org/sticker-pack/"><img style={{borderRadius: "25px"}} alt="Rustacean Sticker Pack by SeaQL" src="https://www.sea-ql.org/static/sticker-pack-1s.jpg" /></a>
