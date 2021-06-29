# Async Programming

Async programming in Rust is a recent development, only had been stabilized in Rust [`1.39`](https://github.com/rust-lang/rust/releases/tag/1.39.0). The async ecosystem is rapidly evolving, and SeaORM is some of the first async crates built from the ground up with async support in mind.

The first thing, [`Future`](https://rust-lang.github.io/async-book/02_execution/02_future.html) trait. `.await` must be called to execute it.

Second, `async` in Rust is [multi-threaded programming](https://rust-lang.github.io/async-book/03_async_await/01_chapter.html) with a lot of sugar. A `Future` may move between threads, so any variables used in async bodies must be able to travel between threads, i.e. [`Send`](https://doc.rust-lang.org/nomicon/send-and-sync.html).

Third, there are multiple async runtimes in Rust. Arguably, [`async-std`](https://crates.io/crates/async-std), [`actix`](https://crates.io/crates/actix) and [`tokio`](https://crates.io/crates/tokio) are the three most widely used. SeaORM's underlying driver, [`SQLx`](https://crates.io/crates/sqlx) supports all three.

Knowing these concepts are essential to get you up and running in async Rust.