# 异步编程

Rust 的异步编程是最近才稳定的特性，直到 Rust [`1.39`](https://github.com/rust-lang/rust/releases/tag/1.39.0) 才正式引入。异步生态发展迅速，而 SeaORM 是最早从零开始就考虑异步支持的 crate 之一。


首先需要了解的是 [`Future`](https://rust-lang.github.io/async-book/02_execution/02_future.html) trait。它是一个占位符，表示一个将来会计算并返回某个值的函数。它惰性求值，这意味着必须调用 `.await` 才会执行实际工作。`Future` 让我们能够以很少的编程成本实现并发，例如使用 [`future::join_all`](https://docs.rs/futures/latest/futures/future/fn.join_all.html) 来并行执行多个查询。

其次，在多线程异步执行器中。一个`Future` 可能会在线程之间移动，因此异步函数体中使用的变量都必须能够在线程之间传递，即实现 [`Send`](https://doc.rust-lang.org/nomicon/send-and-sync.html) trait。

第三，Rust 中有多个异步运行时。[`async-std`](https://crates.io/crates/async-std) 和 [`tokio`](https://crates.io/crates/tokio) 是其中最常用的两个。SeaORM 使用的底层驱动 [`SQLx`](https://crates.io/crates/sqlx) 同时支持这两者。

理解这些概念对于你快速上手 Rust 异步编程至关重要。