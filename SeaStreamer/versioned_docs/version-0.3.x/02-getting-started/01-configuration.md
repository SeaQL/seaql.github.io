# Configuring Features

## Cargo

First of all, please star our [GitHub repo](https://github.com/SeaQL/sea-streamer)! Your support is vital to the continued development of SeaStreamer.

Then, add `sea-streamer` to the `[dependencies]` section of your `Cargo.toml`.

```toml title="Cargo.toml"
sea-streamer = { version = "0.3", features = [ <BACKEND>, <ASYNC_RUNTIME> ] }
```

`sea-streamer` is a facade crate. If you don't enable any features, it will only export the types from `sea-streamer-types`,
which allows you to develop *pure crates* using those traits and types, without pulling in any backend crates to the dependency tree.

All crates share the same major version. So `0.1` of `sea-streamer` depends on `0.1` of `sea-streamer-socket`.

## BACKEND: `kafka`, `redis`, `file`, `stdio` & `socket`

SeaStreamer currently supports four backends, Kafka, Redis, file and Stdio.
Each has their own support crate, and they all implement the same set of abstract traits. 
It's easy to distinguish the symbols between the crates, because they all start with a prefix.

However, those abstractions are static: you have to designate the concrete `Streamer` type compile-time.
To achieve *runtime-abstraction*, you can enable the `socket` flag and use the `Sea*` types.

Here is a summary of the type names:

| Trait | Kafka | Redis | File | Stdio | Socket |
| :---: | :---: | :---: | :--: | :---: | :----: |
| Streamer | KafkaStreamer | RedisStreamer | FileStreamer | StdioStreamer | SeaStreamer |
| Producer | KafkaProducer | RedisProducer | FileProducer | StdioProducer | SeaProducer |
| Consumer | KafkaConsumer | RedisConsumer | FileConsumer | StdioConsumer | SeaConsumer |
| Message | KafkaMessage | RedisMessage | FileMessage | StdioMessage | SeaMessage |
| ConnectOptions | KafkaConnectOptions | RedisConnectOptions | FileConnectOptions | StdioConnectOptions | SeaConnectOptions |

## ASYNC_RUNTIME: `runtime-async-std` & `runtime-tokio`

SeaStreamer currently supports two async runtimes, async-std & Tokio. Enable the one you need.
There are also some runtime-generic functions, exposed via the `runtime` flag, to help you build applications supporting both runtimes.