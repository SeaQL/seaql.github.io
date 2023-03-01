# The Vision

We want to make Rust the best data engineering platform, with tools that span from development to production.

Below is just part of my imagination, hopefully we will be able to realize them *some day*!

## The `sed` for streams

Since we've talked about shells a lot, it will be great if we have an equivalent to `sed` that allow us to filter, transform and combine structured messages with a scripting language.

## Inter Process Communication

Right now pipe is the only mechanism for connecting processors together, which is copy-heavy. For some high-through scenario, sharded memory could fair better.

## Inter Host Communication

Right now the only way to connect across host is to rely on a streaming server. In a containerized environment, it might make sense to allow processors to communicate privately via TCP streams.

## Your idea

We welcome you to join our [Discussions](https://github.com/SeaQL/sea-streamer/discussions) if you have ideas or insights!
