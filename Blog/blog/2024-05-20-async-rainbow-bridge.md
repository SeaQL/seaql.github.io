---
slug: 2024-05-20-async-rainbow-bridge
title: The rainbow bridge between sync and async Rust
author: Chris Tsang
author_title: SeaQL Team
author_url: https://github.com/tyt2y3
author_image_url: https://avatars.githubusercontent.com/u/1782664?v=4
image: https://www.sea-ql.org/blog/img/async-rainbow-bridge.png
tags: [news]
---

This story stems from the saying "What Color is Your Function?" as a criticism to the async implementation of common programming languages. Well, Rust also falls into the category of "colored functions". So in this blog post, let's see how we can design systems to effectively combine sync and async code.

Rainbow bridge is a reference to the bridge in Thor that teleports you between different realms - a perfect analogy!

## Background

Sync code can be blocking IO, or expensive computation. Async code is usually network IO where you'd wait for results.

In both cases, we want to maximize concurrency, such that the program can make full use of the CPU instead of sitting there idle. A common approach is message passing, where we package tasks and send them to different workers for execution.

## Sync -> Sync

Let's start with the classic example, pure sync code. There exists [std::sync::mpsc](https://doc.rust-lang.org/std/sync/mpsc/index.html) in the standard library, so let's take a look.

```rust
use std::sync::mpsc::channel;

// create an unbounded channel
let (sender, receiver) = channel();

// never blocks
sender.send("Hello".to_string()).unwrap();

let handle = std::thread::spawn(move|| {
    // wait until there is a message
    let message = receiver.recv().unwrap();
    println!("{message}");
});

handle.join().unwrap();
println!("Bye");
```

Prints ([Playground](https://play.rust-lang.org/?version=stable&mode=debug&edition=2021&gist=4eecb3216b6b10477849f5648bb026f4)):

```log
Hello
Bye
```

Now, we'll make a more elaborate example: a program that spawns a number of worker threads to perform some 'expensive' computation. The main thread would dispatch the tasks to those threads and in turn collect the results via another channel.

```
┌─────────────┐    tasks    ┌─────────────────┐   result
│             ╞═════════════╡ worker thread 1 ╞═════════════╗    ┌─────────────┐ 
│ main thread │             ├─────────────────┤             ╠════╡ main thread │ 
│             ╞═════════════╡ worker thread 2 ╞═════════════╝    └─────────────┘ 
└─────────────┘             └─────────────────┘              
```

First, setup the channels.

```rust
let (result, collector) = channel(); // result
let mut senders = Vec::new();
for _ in 0..THREADS {
    let (sender, receiver) = channel(); // tasks
    senders.push(sender);
    let result = result.clone();
    std::thread::spawn(move || worker(receiver, result));
}
```

The worker thread looks like:

```rust
fn worker(receiver: Receiver<Task>, sender: Sender<Done>) {
    while let Ok(task) = receiver.recv() {
        let result = process(task);
        sender.send(result).unwrap();
    }
}
```

Then, dispatch tasks.

```rust
for c in 0..TASKS {
    let task = some_random_task();
    senders[c % THREADS].send(task).unwrap();
}
```

Finally, we can collect results.

```rust
for _ in 0..TASKS {
    let result = collector.recv().unwrap();
    println!("{result:?}");
}
```

Full source code can be found [here](https://github.com/SeaQL/FireDBG.Rust.Testbench/tree/main/multi-thread-matrix).

## Async -> Async

Next, we'll migrate to async land. Using [tokio::sync::mpsc](https://docs.rs/tokio/latest/tokio/sync/mpsc/index.html), it's very similar to the above example, except every operation is `async` and thus imposes additional restrictions to lifetimes. (The trick is, just move / clone. Don't borrow)

Strangely `tokio`'s `unbounded_channel` is the equivalent to `std`'s `channel`. Otherwise it's very similar. The `spawn` method takes in a `Future`; since the worker needs to take in the channels, we construct an async closure with `async move {}`.

```rust
let (result, mut collector) = unbounded_channel();
let mut senders = Vec::new();
for _ in 0..WORKERS {
    let (sender, mut receiver) = unbounded_channel();
    senders.push(sender);
    let result = result.clone();
    tokio::task::spawn(async move {
        while let Some(task) = receiver.recv().await {
            result.send(process(task).await).unwrap();
        }
    });
}
std::mem::drop(result); // <-- ?
```

Why do we need to drop the `result` sender? This is one of the foot gun: `tokio` would swallow panics originated within the task, and so if that happened, the program would never exit. By dropping the last copy of `result` in scope, the channel would automatically close *after* all tasks exit, which in turn would triggle up to our `collector`.

The rest is almost the same.

```rust
for (i, task) in tasks.iter().enumerate() {
    senders[i % WORKERS].send(task.clone()).unwrap();
}
std::mem::drop(senders);

for _ in 0..tasks.len() {
    let result = collector.recv().await.unwrap();
    println!("{result:?}");
}
```

Full source code can be found [here](https://github.com/SeaQL/FireDBG.Rust.Testbench/tree/main/tokio-mpsc).

### Flume mpmc

#### mpmc - multi producer, multi consumer

The previous examples have a flaw: we have to spawn multiple `mpsc` channels to send tasks, which is:

1. clumsy. we need to keep a list of `senders`
2. not the most efficient. is round-robin the best way of distributing tasks? some of the workers may remain idle

Here is the ideal setup:

```
                      tasks   ┌─────────────────┐   result
┌─────────────┐   ╔═══════════╡ worker thread 1 ╞════════════╗   ┌─────────────┐ 
│ main thread ╞═══╣           ├─────────────────┤            ╠═══╡ main thread │ 
└─────────────┘   ╚═══════════╡ worker thread 2 ╞════════════╝   └─────────────┘ 
                              └─────────────────┘              
```

Let's rewrite our example using [Flume](https://docs.rs/flume/latest/flume/). But first, note the differences between `tokio` and `flume`:

| Tokio | Flume |
|-------|-------|
| [`unbounded_channel`](https://docs.rs/tokio/latest/tokio/sync/mpsc/fn.unbounded_channel.html) | [`unbounded`](https://docs.rs/flume/latest/flume/fn.unbounded.html) |
| `send` | `send` |
| `recv` | `recv_async` |

In `tokio`, the method is exclusive: `async fn recv(&mut self)`; in `flume`, the method is `fn recv_async(&self) -> RecvFut`. The type signature already told you the distinction between `mpsc` vs `mpmc`! It is wrong to use the blocking `recv` method in async context in `flume`, but sadly the compiler would not warn you about it.

The channel setup is now slightly simpler:

```rust
let (sender, receiver) = unbounded(); // task
let (result, collector) = unbounded(); // result

for _ in 0..WORKERS {
    let receiver = receiver.clone();
    let result = result.clone();
    tokio::task::spawn(async move {
        while let Ok(task) = receiver.recv_async().await {
            result.send(process(task).await).unwrap();
        }
    });
}
```

We no longer have to dispatch tasks ourselves. All workers share the same task queue, and thus workers would fetch the next task as soon as the previous one is finished - effectively load balance among themselves!

```rust
for task in &tasks {
    sender.send(task.clone()).unwrap();
}

for _ in 0..tasks.len() {
    let result = collector.recv_async().await.unwrap();
    println!("{result:?}");
}
```

Full source code can be found [here](https://github.com/SeaQL/FireDBG.Rust.Testbench/tree/main/flume-mpmc).

## Sync -> Async

In the final example, let's consider a program that is mostly sync, but has a few async operations that we want to handle in a background thread. 

In the example below, our blocking operation is 'reading from stdin' from the main thread. And we send those lines to an async thread to handle.

```
┌─────────────┐           ┌──────────────┐
│ main thread ╞═══════════╡ async thread │
└─────────────┘           └──────────────┘
```

It follow the usual 3 steps:

1. create a flume channel
2. pass the receiver end to a worker thread
3. send tasks over the channel

```rust
fn main() -> Result<()> {
    let (sender, receiver) = unbounded(); // flume channel

    std::thread::spawn(move || {
        // this runtime is single-threaded
        let rt = tokio::runtime::Builder::new_current_thread().enable_all().build().unwrap();
        rt.block_on(handler(receiver))
    });

    loop {
        let mut line = String::new();
        // this blocks the current thread until there is a new line
        match std::io::stdin().read_line(&mut line) {
            Ok(0) => break, // this means stdin is closed
            Ok(_) => (),
            Err(e) => panic!("{e:?}"),
        }
        sender.send(line)?;
    }

    Ok(())
}
```

This is the handler:

```rust
async fn handler(receiver: Receiver<String>) -> Result<()> {
    while let Ok(line) = receiver.recv_async().await {
        process(line).await?;
    }
    Ok(())
}
```

It doesn't look much different from the `async -> async` example, the only difference is one side is sync! Full source code can be found [here](https://github.com/SeaQL/sea-streamer/blob/main/sea-streamer-file/src/bin/stdin-to-file.rs).

### Graceful shutdown

The above code has a problem: we never know whether a line has been processed. If the program has an exit mechanism from handling `sigint`, there is a possibility of exiting before all the lines has been processed.

Let's see how we can shutdown properly.

```rust
let handle = std::thread::spawn(..);

// running is an AtomicBool
while running.load(Ordering::Acquire) {
    let line = read_line_from_stdin();
    sender.send(line)?;
}

std::mem::drop(sender);
handle.join().unwrap().unwrap();
```

The shutdown sequence has 3 steps:

0. we first obtain the `JoinHandle` to the thread
1. we drop all copies of `sender`, effectively closing the channel
2. in the worker thread, `receiver.recv_async()` would result in an error, as stated in the [docs](https://docs.rs/flume/latest/flume/struct.Receiver.html#method.recv_async)
    > Asynchronously receive a value from the channel, returning an error if all senders have been dropped.
3. the worker thread finishes, joining the main thread

## Async -> Sync

The other way around is equally simple, as illustrated in [SeaStreamer's example](https://github.com/SeaQL/sea-streamer/blob/main/examples/src/bin/blocking.rs).

## Conclusion

| | sync | async |
|-|------|-------|
| to spawn worker| [`std::thread::spawn`](https://doc.rust-lang.org/std/thread/fn.spawn.html) | [`tokio::task::spawn`](https://docs.rs/tokio/latest/tokio/task/fn.spawn.html) |
| concurrency | multi-threaded | can be multi-threaded or single-threaded |
| worker is | `FnOnce` | `Future` |
| send message with | `send` | `send` |
| receive message with | `recv` | `recv_async` |
| waiting for messages | blocking | yield to runtime |

In this article we discussed:

1. Multi-threaded parallelism in sync realm
2. Concurrency in async realm - with `tokio` and `flume`
3. Bridging sync and async code with `flume`

Now you already learnt the powers of `flume`, but there is more!

In the next episode, hopefully we will get to discuss other interesting features of `flume` - bounded channels and 'rendezvous channels'. Follow our [X / Twitter](https://twitter.com/sea_ql) for updates!

## Rustacean Sticker Pack 🦀

The Rustacean Sticker Pack is the perfect way to express your passion for Rust.
Our stickers are made with a premium water-resistant vinyl with a unique matte finish.
Stick them on your laptop, notebook, or any gadget to show off your love for Rust!

Moreover, all proceeds contributes directly to the ongoing development of SeaQL projects.

Sticker Pack Contents:
- Logo of SeaQL projects: SeaQL, SeaORM, SeaQuery, Seaography, FireDBG
- Mascot of SeaQL: Terres the Hermit Crab
- Mascot of Rust: Ferris the Crab
- The Rustacean word

[Support SeaQL and get a Sticker Pack!](https://www.sea-ql.org/sticker-pack/)

<a href="https://www.sea-ql.org/sticker-pack/"><img style={{borderRadius: "25px"}} alt="Rustacean Sticker Pack by SeaQL" src="https://www.sea-ql.org/static/sticker-pack-1s.jpg" /></a>

[^1]: via [SeaORM X](https://www.sea-ql.org/SeaORM-X/)
[^2]: [Why Rust?](https://www.sea-ql.org/SeaStreamer/docs/introduction/intro-to-streams/#why-rust)