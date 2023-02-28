# Configuring Features

## Cargo

First of all, please star our [GitHub repo](https://github.com/SeaQL/sea-streamer)! Your support is vital to the continued maintenance of SeaStreamer.

Then, add `sea-streamer` to the `[dependencies]` section of your `Cargo.toml`.

```toml title="Cargo.toml"
sea-streamer = { version = "0.1", features = [ <BACKEND>, <ASYNC_RUNTIME> ] }
```

`sea-streamer` is a facade crate. If you don't enable any features, it will only export the types from `sea-streamer-types`,
which allows you to develop *pure crates* using those traits and types, without pulling in any backend crates to the dependency tree.

## BACKEND: `kafka`, `stdio` & `socket`

SeaStreamer currently supports two backends, Kafka and Stdio. 
Each has their own support crate, and they all implement the same set of abstract traits. 
It's easy to distinguish the symbols between the crates, because they all start with `Kafka*` or `Stdio*`.

However, those abstractions are static: you have to designate the `KafkaStreamer` type compile-time.
To achieve *runtime-abstraction*, you can enable the `socket` flag and use the `Sea*` types.

Here is a summary of the type names:

| Trait | Kafka | Stdio | Socket |
| :---: | :---: | :---: | :----: |
| Streamer | KafkaStreamer | StdioStreamer | SeaStreamer |
| Producer | KafkaProducer | StdioProducer | SeaProducer |
| Consumer | KafkaConsumer | StdioConsumer | SeaConsumer |
| Message | KafkaMessage | StdioMessage | SeaMessage |
| ConnectOptions | KafkaConnectOptions | StdioConnectOptions | SeaConnectOptions |

## ASYNC_RUNTIME: `runtime-async-std` & `runtime-tokio`

SeaStreamer currently supports two async runtimes, async-std & Tokio. Enable the one you need.
There are also some runtime-generic functions to help you build applications supporting both runtimes.