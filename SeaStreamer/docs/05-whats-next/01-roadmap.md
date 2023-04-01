# The Roadmap

Thank you for reading the documentation up to this chapter. Excuse me for asking you again, if you find this project interesting and/or useful, please star our [GitHub repo](https://github.com/SeaQL/sea-streamer)! Your support is vital to the continued development of SeaStreamer.

Here are a few major components we plan to develop up next:

## `sea-streamer-file`: File Backend

This is very similar to `sea-streamer-stdio`, but the difference is `sea-streamer-stdio` works in real-time, while `sea-streamer-file` works in real-time and replay. That means, `sea-streamer-file` has the ability to seek through a `.ss` (sea-stream) file and seek/rewind to a particular timestamp/offset.

In addition, `stdio` can only work with UTF-8 text data, while `file` is able to work with binary data.

We might be able to commit consumer states into a local SQLite database, enabling transactional behavior.

## `sea-streamer-redis`: Redis Cluster

Redis support has been released in `sea-streamer` `0.2`! Basic stream sharding is implemented, but sharding without clustering is not very useful. 

In the future, we'd like to support Redis Cluster, right now it's pretty much a work-in-progress. It's quite a difficult task, because clients have to take responsibility when working with a cluster.
In Redis, shards and nodes is a dynamic M-N mapping - shards can be moved among nodes *at any time*.
It makes testing much more difficult.

In Redis, consumers in the same group share the same shard, i.e. shared shard. In the future, we'd like to support 'owned shard' semantics, where each consumer will attempt to claim ownership of a shard, and other consumers in the group will not step in. This mimicks Kafka’s consumer group behaviour.

Let us know if you'd like to help!

## Your proposal

We welcome you to join our [Discussions](https://github.com/SeaQL/sea-streamer/discussions) if you have thoughts and experience!
