# Async Programming in Rust

Async programming in Rust is a recent development, only having been stabilized in Rust [`1.39`](https://github.com/rust-lang/rust/releases/tag/1.39.0). The async ecosystem is rapidly evolving, and SeaStreamer is an async-only library.

The first concept to learn is the [`Future`](https://rust-lang.github.io/async-book/02_execution/02_future.html) trait. `Future` allows us to achieve concurrency with little programming effort, e.g. [`future::join_all`](https://docs.rs/futures/latest/futures/future/fn.join_all.html) to execute multiple tasks in parallel.

The second concept to learn is the [`Stream`](https://docs.rs/futures-core/latest/futures_core/stream/trait.Stream.html) trait. It's like [`Iterator`](https://doc.rust-lang.org/std/iter/trait.Iterator.html), but async. It is very powerful, and allows us to manipulate streams ergonomically by composing `Map`, `Filter` and `Fold`.

Third, there are multiple async runtimes in Rust. [`async-std`](https://crates.io/crates/async-std) and [`tokio`](https://crates.io/crates/tokio) are the two most widely used in production, and SeaStreamer supports both of them. These async runtimes are multi-threaded, meaning that a Future may be moved between threads, but it can only happen at `.await` points. There is true parallelism - so race condition and contention can and do happen.

Understanding these concepts is essential to get your hands on real-time async programming in Rust.