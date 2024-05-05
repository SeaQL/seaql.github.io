---
slug: 2023-09-06-whats-new-in-sea-streamer-0.3
title: What's new in SeaStreamer 0.3
author: Chris Tsang
author_title: SeaQL Team
author_url: https://github.com/tyt2y3
author_image_url: https://avatars.githubusercontent.com/u/1782664?v=4
image: https://www.sea-ql.org/SeaStreamer/img/SeaStreamer%20banner.png
tags: [news]
---

<a href="https://www.sea-ql.org/SeaStreamer/"><img src="https://www.sea-ql.org/SeaStreamer/img/SeaStreamer%20banner.png" /></a>

🎉 We are pleased to release SeaStreamer [`0.3.x`](https://github.com/SeaQL/sea-streamer/releases/0.3.0)!

## File Backend

A major addition in SeaStreamer `0.3` is the file backend. It implements the same high-level MPMC API, enabling streaming to and from files. There are different use cases. For example, it can be used to dump data from Redis / Kafka and process them locally, or as an intermediate file format for storage or transport.

The SeaStreamer File format, `.ss` is pretty simple. It's very much like `.ndjson`, but binary. The file format is designed with the following goals:

1. Binary data support without encoding overheads
2. Efficiency in rewinding / seeking through a large dump
3. Streaming-friendliness - File can be truncated without losing integrity

Let me explain in details.

First of all, SeaStreamer File is a container format. It only concerns the message stream and framing, not the payload. It's designed to be paired with a binary message format like Protobuf or BSON.

### Encode-free

JSON and CSV are great plain text file formats, but they are not binary friendly. Usually, to encode binary data, one would use `base64`. It therefore imposes an expensive encoding / decoding overhead. In a binary protocol, *delimiters* are frequently used to signal message boundaries. As a consequence, byte stuffing is needed to escape the bytes.

In SeaStreamer, we want to avoid the encoding overhead entirely. The payload should be written to disk verbatim. So the file format revolves around constructing message frames and placing checksums to ensure that data is interpreted correctly.

### Efficient seek

A delimiter-based protocol has an advantage: the byte stream can be randomly sought, and we always have no trouble reading the next message.

Since SeaStreamer does not rely on delimiters, we can't easily align to message frames after a random seek. We solve this problem by placing beacons in a regular interval at fixed locations throughout the file. E.g. say the `beacon interval` is `1024`, there will be a beacon at the 1024th byte, the 2048th, and so on. Then, every time we want to seek to a random location, we'd seek to the closest N * 1024 byte and read from there.

These beacons also double as indices: they contain summaries of the individual streams. So given a particular stream key and sequence number (or timestamp) to search for, SeaStreamer can quickly locate the message *just by* reading the beacons. It doesn't matter if the stream's messages are sparse!

### Streaming-friendliness

It should always be safe to truncate files. It should be relatively easy to split a file into chunks. We should be able to tell if the data is corrupted.

SeaStreamer achieves this by computing a checksum for every message, and also the running checksum of the checksums for each stream. It's not enforced right now, but in theory we can detect if any messages are missing from a stream.

#### Summary

This file format is also easy to implement in different languages, as we just made an (experimental) [reader in Typescript](https://github.com/SeaQL/sea-streamer/tree/main/sea-streamer-file/sea-streamer-file-reader).

That's it! If you are interested, you can go and take a look at the [format description](https://docs.rs/sea-streamer-file/latest/sea_streamer_file/format/index.html).

## Redis Backend

Redis Streams are underrated! They have high throughput and concurrency, and are best suited for non-persistent stream processing near or on the same host as the application.

The obstacle is probably in library support. Redis Streams' API is rather low level, and there aren't many high-level libraries to help with programming, as opposed to Kafka, which has versatile official programming libraries.

The pitfall is, it's not easy to maximize concurrency with the raw Redis API. To start, you'd need to pipeline `XADD` commands. You'd also need to time and batch `XACK`s so that it does not block reads and computation. And of course you want to separate the reads and writes on different threads.

SeaStreamer breaks these obstacles for you and offers a Kafka-like API experience!

## Benchmark

In `0.3`, we have done some optimizations to improve the throughput of the Redis and File backend. We set our initial benchmark at 100k messages per second, which hopefully we can further improve over time.

Our [micro benchmark](https://github.com/SeaQL/sea-streamer/tree/main/benchmark) involves a simple program producing or consuming 100k messages, where each message has a payload of 256 bytes.

For Redis, it's running on the same computer in Docker. On my not-very-impressive laptop with a 10th Gen Intel Core i7, the numbers are somewhat around:

#### Producer

```
redis    0.5s
stdio    0.5s
file     0.5s
```

#### Consumer

```
redis    1.0s
stdio    1.0s
file     1.1s
```

It practically means that we are comfortably in the realm of *producing* 100k messages per second, but are just about able to *consume* 100k messages in 1 second. Suggestions to performance improvements are welcome!

## Community

SeaQL.org is an independent open-source organization run by passionate ️developers. If you like our projects, please star ⭐ and share our repositories. If you feel generous, a small donation via [GitHub Sponsor](https://github.com/sponsors/SeaQL) will be greatly appreciated, and goes a long way towards sustaining the organization 🚢.

SeaStreamer is a community driven project. We welcome you to participate, contribute and together build for Rust's future 🦀.
