# The Roadmap

Thank you for reading the documentation up to this chapter. Excuse me for asking you again, if you find this project interesting and/or useful, please star our [GitHub repo](https://github.com/SeaQL/sea-streamer)! Your support is vital to the continued development of SeaStreamer.

Here are a few major components we plan to develop up next:

## `sea-streamer-file`: File Backend

An initial implementation is released in `0.3`. But there are still some TODOs:

1. Resumable: currently unimplemented. A potential implementation might be to commit into a local SQLite database.
2. Sharding: currently it only streams to Shard ZERO.
3. Verify: a utility program to verify and repair SeaStreamer binary file.

## `sea-streamer-redis`: Redis Cluster

Redis support has been released in `sea-streamer` `0.2`! Basic stream sharding is implemented, but sharding without clustering is not very useful. 

In the future, we'd like to support Redis Cluster, right now it's pretty much a work-in-progress. It's quite a difficult task, because clients have to take responsibility when working with a cluster.
In Redis, shards and nodes is a dynamic M-N mapping - shards can be moved among nodes *at any time*.
It makes testing much more difficult.

In Redis, consumers in the same group share the same shard, i.e. shared shard. In the future, we'd like to support 'owned shard' semantics, where each consumer will attempt to claim ownership of a shard, and other consumers in the group will not step in. This mimicks Kafka’s consumer group behaviour.

Let us know if you'd like to help!

## Your proposal

We welcome you to join our [Discussions](https://github.com/SeaQL/sea-streamer/discussions) if you have thoughts and experience!
