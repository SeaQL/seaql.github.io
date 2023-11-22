---
slug: 2023-11-22-async-runtime-generic
title: Writing Async Runtime Generic Library
author: Chris Tsang
author_title: SeaQL Team
author_url: https://github.com/tyt2y3
author_image_url: https://avatars.githubusercontent.com/u/1782664?v=4
tags: [news]
---

If you are writing an async application in Rust, at some point you'd want to separate the code into several crates. There are some benefits:

1. Better encapsulation. Having a crate boundary between sub-systems can lead to cleaner code and a more well-defined API. No more `pub(crate)`!
2. Faster compilation. By breaking down a big crate into several independent small crates, they can be compiled concurrently.

But the question is, if you are using only one async runtime anyway, what are the benefits of writing async-runtime-generic libraries?

1. Portability. You can easily switch to a different async runtime, or wasm.
2. Correctness. Testing a library against both `tokio` and `async-std` can uncover more bugs, including concurrency bugs (due to fuzzy task execution orders) and "undefined behaviour" either due to misunderstanding or async-runtime implementation details

So now you've decided to write async-runtime-generic libraries! Here I want to share 3 strategies along with examples found in the Rust ecosystem.

### Approach 1: Defining your own `AsyncRuntime` trait

Using the [`futures`](https://docs.rs/futures/latest/futures/) crate you can write very generic library code, but there is one missing piece: `time` - to `sleep` or `timeout`, you have to rely on an async runtime. If that's all you need, you can define your own `AsyncRuntime` trait and requires downstream to implement it. This is the approach used by [rdkafka](https://docs.rs/rdkafka/latest/rdkafka/):

```rust
pub trait AsyncRuntime: Send + Sync + 'static {
    type Delay: Future<Output = ()> + Send;

    /// It basically means the return value must be a `Future`
    fn sleep(duration: Duration) -> Self::Delay;
}
```

Here is how it's implemented:

```rust
impl AsyncRuntime for TokioRuntime {
    type Delay = tokio::time::Sleep;

    fn sleep(duration: Duration) -> Self::Delay {
        tokio::time::sleep(duration)
    }
}
```

Library code to use the above:

```rust
async fn operation<R: AsyncRuntime>() {
    R::sleep(Duration::from_millis(1)).await;
}
```

### Approach 2: Abstract the async runtimes internally and expose feature flags

This is the approach used by [redis-rs](https://docs.rs/redis/latest/redis/).

To work with network connections or file handle, you can use the `AsyncRead` / `AsyncWrite` traits:

```rust
#[async_trait]
pub(crate) trait AsyncRuntime: Send + Sync + 'static {
    type Connection: AsyncRead + AsyncWrite + Send + Sync + 'static;

    async fn connect(addr: SocketAddr) -> std::io::Result<Self::Connection>;
}
```

Then you'll define a module for each async runtime:

```rust
#[cfg(feature = "runtime-async-std")]
mod async_std_impl;
#[cfg(feature = "runtime-async-std")]
use async_std_impl::*;

#[cfg(feature = "runtime-tokio")]
mod tokio_impl;
#[cfg(feature = "runtime-tokio")]
use tokio_impl::*;
```

Where each module would look like:

```rust title="tokio_impl.rs"
#[async_trait]
impl AsyncRuntime for TokioRuntime {
    type Connection = tokio::net::TcpStream;

    async fn connect(addr: SocketAddr) -> std::io::Result<Self::Connection> {
        tokio::net::TcpStream::connect(addr).await
    }
}
```

Library code to use the above:

```rust
async fn operation<R: AsyncRuntime>(conn: R::Connection) {
    conn.write(b"some bytes").await;
}
```

### Approach 3: Maintain an async runtime abstraction crate

This is the approach used by [SQLx](https://docs.rs/crate/sqlx-rt) and [SeaStreamer](https://docs.rs/sea-streamer-runtime/latest/sea_streamer_runtime/).

Basically, aggregate all async runtime APIs you'd use and write a wrapper library. This may be tedious, but this also has the benefit of specifying *all interactions* with the async runtime *in one place* for *your* project, which could be handy for debugging or tracing.

For example, async `Task` handling:

```rust title="common-async-runtime/tokio_task.rs"
pub use tokio::task::{JoinHandle as TaskHandle};

pub fn spawn_task<F, T>(future: F) -> TaskHandle<T>
where
    F: Future<Output = T> + Send + 'static,
    T: Send + 'static,
{
    tokio::task::spawn(future)
}
```

`async-std`'s task API is slightly different (in `tokio` the output is `Result<T, JoinError>`), which requires some boilerplate:

```rust title="common-async-runtime/async_std_task.rs"
/// A shim to match tokio's API
pub struct TaskHandle<T>(async_std::task::JoinHandle<T>);

pub fn spawn_task<F, T>(future: F) -> TaskHandle<T>
where
    F: Future<Output = T> + Send + 'static,
    T: Send + 'static,
{
    TaskHandle(async_std::task::spawn(future))
}

#[derive(Debug)]
pub struct JoinError;

impl std::error::Error for JoinError {}

// This is basically how you wrap a `Future`
impl<T> Future for TaskHandle<T> {
    type Output = Result<T, JoinError>;

    fn poll(
        mut self: std::pin::Pin<&mut Self>,
        cx: &mut std::task::Context<'_>,
    ) -> std::task::Poll<Self::Output> {
        match self.0.poll_unpin(cx) {
            std::task::Poll::Ready(res) => std::task::Poll::Ready(Ok(res)),
            std::task::Poll::Pending => std::task::Poll::Pending,
        }
    }
}
```

In the library's `Cargo.toml`, you can simply include `common-async-runtime` as dependency. This makes your library code 'pure', because now selecting an async runtime is controlled by downstream. Similar to approach 1, this crate can be compiled *without any* async runtime, which is neat!

### Conclusion

Happy hacking! Welcome to share your experience with the [community](https://github.com/SeaQL/sea-streamer/discussions).