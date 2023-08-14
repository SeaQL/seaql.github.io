# Intra Process

Here is how you might organize a mid-to-large scale stream processing project. You have a number of crates implementing different processors, each depends on `sea-streamer` in a workspace. Now, you want to construct a downstream crate where you connect several processors together for testing.

## Stdio

You can execute tests involving several processors by setting Stdio's [loopback](https://docs.rs/sea-streamer-stdio/*/sea_streamer_stdio/struct.StdioConnectOptions.html#method.set_loopback) option, where messages produced will be feed back to consumers in the same process.

It's just `cargo test` without any external dependency or side effects, so it's extremely quick to execute. Use a unique stream key for each test case. So if the tests fail, you will be able to diagnose the problem from the stdout log. You can check out the [full example](https://github.com/SeaQL/sea-streamer/blob/main/sea-streamer-stdio/tests/loopback.rs).

```rust
let stream = StreamKey::new("hello")?;
let mut options = StdioConnectOptions::default();
options.set_loopback(true);
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

## File

You can produce-to and consume-from the same file with the File backend. You'd want to use a random file name to avoid interference with other processes.

The File backend is just a thin abstraction layer over tokio / async-std's async File IO. There is no network protocol involved, so it's as raw as it can be in terms of throughput.

Check out the [full example](https://github.com/SeaQL/sea-streamer/blob/main/sea-streamer-file/tests/producer.rs).

```rust
use sea_streamer_file::FileId;
use sea_streamer_types::Timestamp;
use std::fs::OpenOptions;

pub fn temp_file(name: &str) -> Result<FileId, std::io::Error> {
    let path = format!("/tmp/{name}");
    let _file = OpenOptions::new()
        .read(true)
        .write(true) // Make sure we have write permission
        .create_new(true) // Fail if this file already exists
        .open(&path)?;

    Ok(FileId::new(path))
}
```