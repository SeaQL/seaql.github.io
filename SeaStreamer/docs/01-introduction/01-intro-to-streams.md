# Intro to Stream Processing

"[Turning the database inside out](https://www.confluent.io/blog/turning-the-database-inside-out-with-apache-samza/)" is an influential article in the data engineering space, leading to the founding of [Kafka](https://kafka.apache.org/). Since then, implementations like [Redpanda](https://redpanda.com/) and [Redis Streams](https://redis.io/docs/manual/data-types/streams/) emerged, spurring a real-time data processing ecosystem.

## Vs event-based programming

Similar to event-based programming, stream processing is a programming paradigm that aims to handle events in near real-time or as soon as events happen. One way to classify between the two might be frequency. Streams are continuous sequence of events with a high throughput: instead of many short-lived connections, you simply keep one connection open.

## Vs analytic processing

Say we want to compute the average of a certain attribute over a specific period of time. OLAP databases allow us to efficiently compute that over a very large table with millions of rows. To achieve the same in stream processing, we can replay the stream and feed it through a stream processor, which probably deemed to be slower. Once the processor is steadily running, the output can be updated in real-time with minimal latency.

## Why Rust?

We want to construct the best stream processing platform where Rust's unique characteristics truly shine:

### Multi-threaded async

Unlike other languages, Rust's async execution is multi-threaded. It allows you to scale up a process with as many threads as needed to fully utilize the CPU for maximum concurrency.

### Predictable latency

As a language with no garbage collection, there is no random point in time where the garbage collector kicks in and causes jitter. When you have a long pipeline, these jitters tend to propagate and amplify downstream. Rust is not automatically low-latency though - you still need to spend considerable effort in optimization. But you will have a good starting point.

### Self-contained

Unlike other languages, the recommended way of packaging Rust programs is to static-link everything into one executable - often only sized a few megabytes. And there is no installation or warm-up needed - it spins up immediately, which is a bonus for stream processing.

### Low resource usage

Like other compiled languages, Rust uses considerably less memory than a VM based language. And without the need of JIT, Rust also has less CPU overhead.

### Long-running safe

Again, without GC, Rust programs are less susceptible to "slow memory bloat over a period of days" (technically, it's not a leak). There is less risk of out-of-memory crashes, so you don't have to "restart the process every week". Albeit, you still have to be careful about heap allocations.

### Ecosystem

Finally, Rust has a great ecosystem of async programming libraries: networking libraries built on async IO, lock-free channels and other data structures to make async programming ergonomic and fun.

Without further ado, let's get started!