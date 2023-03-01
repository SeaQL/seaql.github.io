# Intra Process

Here is how you might organize a mid-to-large scale stream processing project. You have a number of crates implementing different processors, each depends on `sea-streamer` in a workspace. Now, you want to construct a downstream crate where you connect several processors together for testing.

You can write tests without any external dependency by setting Stdio's [loopback](https://docs.rs/sea-streamer/*/sea_streamer_stdio/struct.StdioConnectOptions.html#method.set_loopback) option, where messages produced will be feed back to consumers in the same process.

Here is an illustration of the behaviour, you can check out the [full example](https://github.com/SeaQL/sea-streamer/blob/main/sea-streamer-stdio/tests/loopback.rs):

```rust
let stream = StreamKey::new("hello")?;
let mut options = StdioConnectOptions::default();
options.set_loopback(true);
let streamer = StdioStreamer::connect(StreamerUri::zero(), options).await?;
let producer = streamer
    .create_producer(stream.clone(), Default::default())
    .await?;
let mut consumer = streamer
    .create_consumer(&[stream.clone()], Default::default())
    .await?;

for i in 0..5 {
    let mess = format!("{}", i);
    producer.send(mess)?;
}

let seq = collect(&mut consumer, 5).await;
assert_eq!(seq, [0, 1, 2, 3, 4]);
```