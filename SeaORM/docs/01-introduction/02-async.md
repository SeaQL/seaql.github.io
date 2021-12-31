# Async Programming

Async programming in Rust is a recent development, only having been stabilized in Rust [`1.39`](https://github.com/rust-lang/rust/releases/tag/1.39.0). The async ecosystem is rapidly evolving, and SeaORM is one of the first crates built from the ground up with async support in mind.

The first thing to learn is the [`Future`](https://rust-lang.github.io/async-book/02_execution/02_future.html) trait. It's a placeholder for a function that will compute and return some value in the future. It's lazy, meaning `.await` must be called for any actual work to be done. `Future` allows us to achieve concurrency with little programming effort, e.g. [`future::join_all`](https://docs.rs/futures/latest/futures/future/fn.join_all.html) to execute multiple queries in parallel.

Second, `async` in Rust is [multi-threaded programming](https://rust-lang.github.io/async-book/03_async_await/01_chapter.html) with syntactic sugar. A `Future` may move between threads, so any variables used in async bodies must be able to travel between threads, i.e. [`Send`](https://doc.rust-lang.org/nomicon/send-and-sync.html).

Third, there are multiple async runtimes in Rust. Arguably, [`actix`](https://crates.io/crates/actix), [`async-std`](https://crates.io/crates/async-std) and [`tokio`](https://crates.io/crates/tokio) are the three most widely used. SeaORM's underlying driver, [`SQLx`](https://crates.io/crates/sqlx), supports all three.

Knowing these concepts is essential to get you up and running in async Rust.