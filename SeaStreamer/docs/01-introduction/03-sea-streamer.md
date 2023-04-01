# SeaStreamer Concepts

## Streamer

The streaming server. It is identified by an URI where all producers and consumers can connect to.

### Cluster

The streaming server is assumed to be a cluster: it can scale horizontally across multiple nodes.

## Stream

A stream consists of a series of messages sharing the same key (known as `topic` in Kafka). Each message has a timestamp, sequence number (known as `offset` in Kafka), shard id (known as `partition number` in Kafka), and payload. A message is uniquely identified by the (stream key, shard id, sequence number) tuple.

### Stream URL

In SeaStreamer streams are resources, and can be accessed through a URL comprising (protocol, host, stream). An example stream URL is `kafka://streamer.sea-ql.org:12345/my_stream`.

## Consumer

A stream consumer subscribes to one or more streams and receive messages from one or more nodes in the cluster.

A consumer can rewind a stream to any point (addressed by timestamp or sequence number) and continue streaming.

### Consumer Mode

There are three consuming modes:

1. Real-time: we only care about the latest messages and would be okay to miss old data
2. Resumable: when the consumer resubscribes, it will resume from the last consumed message
3. Load-balanced: like Resumable, but with multiple consumers sharing the same set of streams

## Producer

A stream producer send messages to a streaming server, where the server would store the messages within the cluster, and deliver them to clients.

A producer can send a message with any stream key, but in SeaStreamer we recommend you to anchor each producer to a particular stream key.

## Processor

A stream processor is a consumer and producer at the same time. It consumes messages, transforms them and produces another stream.

SeaStreamer aims to make it easy and flexible to develop and operate stream processors.

## Stream Semantics

Advanced concepts, like sharding, load-balancing and transactions are backend-specific and you should read the relevant documentation of the streaming backend.
