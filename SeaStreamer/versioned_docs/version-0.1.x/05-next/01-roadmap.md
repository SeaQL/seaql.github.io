# The Roadmap

Thank you for reading the documentation up to this chapter. Excuse me for asking you again, if you find this project interesting and/or useful, please star our [GitHub repo](https://github.com/SeaQL/sea-streamer)! Your support is vital to the continued development of SeaStreamer.

Here are a few major components we plan to develop up next:

## `sea-streamer-file`: File Backend

This is very similar to `sea-streamer-stdio`, but the difference is `sea-streamer-stdio` works in real-time, while `sea-streamer-file` works in real-time and replay. That means, `sea-streamer-file` has the ability to seek through a `.ss` (sea-stream) file and seek/rewind to a particular timestamp/offset.

In addition, `stdio` can only work with UTF-8 text data, while `file` is able to work with binary data.

We might be able to commit consumer states into a local SQLite database, enabling transactional behavior.

## `sea-streamer-redis`: Redis Backend

Redis Streams is a great alternative to Kafka. It would be nice if SeaStreamer can support Redis while delivering the same API, so that your stream processor can be multi-modal!

We are aware of Redis having considerably different semantics from Kafka, but we will try to align their behavioural differences, most likely by implementing additional mechanism client-side.

## Your proposal

We welcome you to join our [Discussions](https://github.com/SeaQL/sea-streamer/discussions) if you have thoughts and experience!
