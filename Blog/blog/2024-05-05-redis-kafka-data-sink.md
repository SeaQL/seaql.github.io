---
slug: 2024-05-05-redis-kafka-data-sink
title: Building a Redis / Kafka Data Sink
author: Chris Tsang
author_title: SeaQL Team
author_url: https://github.com/tyt2y3
author_image_url: https://avatars.githubusercontent.com/u/1782664?v=4
image: https://www.sea-ql.org/SeaStreamer/img/SeaStreamer%20banner.png
tags: [news]
---

<a href="https://www.sea-ql.org/SeaStreamer/"><img src="https://www.sea-ql.org/SeaStreamer/img/SeaStreamer%20banner.png" /></a>

This tutorial shows you how to use Rust to build a system that:

1. Subscribe to a real-time websocket data feed
2. Stream the data to Kafka / Redis
3. Save the data into a SQL database

Here, we'll employ a micro-services architecture, and split the functionality into two apps:

```
┌─────────────────────┐      ─────────────────      ┌───────────────┐
│ Websocket Data Feed │ --->   Redis / Kafka   ---> │ SQL Data Sink │
└─────────────────────┘      ─────────────────      └───────────────┘
```

In stream processing, we often use the terms "source" / "sink", but a data sink is simply a stream consumer that persists the data into a store.

On the source side, we'd use [SeaStreamer](https://github.com/SeaQL/sea-streamer). On the sink side, we'd be using [SeaORM](https://github.com/SeaQL/sea-orm). Below are the supported technologies; for the rest of this article, we'll be using `Redis` and `SQLite` because they're easy to setup.

| SeaStreamer | SeaORM |
|-----|-----|
|Kafka, Redis | MySQL, Postgres, SQLite, SQL Server[^1] |

To get started, you can quickly start a Redis instance via Docker:

```sh
docker run -d --rm --name redis -p 6379:6379 redis
```

## 1. Websocket subscription

Let's write a websocket subscriber in Rust. Here we'd use the awesome [async-tungstenite](https://crates.io/crates/async-tungstenite) library.

We'd subscribe to the `GBP/USD` price feed from Kraken, API documentation can be found [here](https://docs.kraken.com/websockets/#message-spread). NB: they're not real FX data, but should be good enough for demo.

Step 1, create a websocket connection:

```rust
let (mut ws, _) = async_tungstenite::tokio::connect_async("wss://ws.kraken.com/").await?;
```

Step 2, send a subscription request:

```rust
ws.send(Message::Text(
    r#"{ "event": "subscribe", "pair": ["GBP/USD"], "subscription": { "name": "spread" } }"#.to_owned(),
)).await?;
```

Step 3, stream the messages:

```rust
loop {
    match ws.next().await {
        Some(Ok(Message::Text(data))) => {
            if data == r#"{"event":"heartbeat"}"# {
                continue;
            }
            println!("{data}");
        }
        Some(Err(e)) => bail!("Socket error: {e}"),
        None => bail!("Stream ended"),
        e => bail!("Unexpected message {e:?}"),
    }
}
```

## 2. Redis / Kafka Stream Producer

Step 1, create a `SeaStreamer` instance connecting to Redis / Kafka:

```rust
let streamer = SeaStreamer::connect(
        "redis://localhost", SeaConnectOptions::default()
    ).await?;
```

There are a bunch of different options for [Redis](https://docs.rs/sea-streamer-redis/latest/sea_streamer_redis/struct.RedisConnectOptions.html) & [Kafka](https://docs.rs/sea-streamer-kafka/0.5.0/sea_streamer_kafka/struct.KafkaConnectOptions.html) respectively, you can refer to SeaStreamer's [documentation](https://www.sea-ql.org/SeaStreamer/).

Step 2, create a producer:

```rust
let producer: SeaProducer = streamer
    .create_producer(
        "GBP_USD".parse()?, // Stream Key
        Default::default(), // Producer Options
    )
    .await?;
```

There aren't any specific options for Producer.

Step 3, send the messages:

```rust
let spread: SpreadMessage = serde_json::from_str(&data)?;
let message = serde_json::to_string(&spread)?;
producer.send(message)?;
```

Here, we use the awesome [`serde`](https://crates.io/crates/serde) library to do some message parsing and re-formatting.

Note that the [`producer.send`](https://docs.rs/sea-streamer/latest/sea_streamer/trait.Producer.html#method.send) call is not `async/await`, and it is crucial! This removes the stream processing bottleneck. Behind the scene, the messages will be buffered and handled on a different thread, so that your input stream can run as close to real-time as possible.

Here is the complete [`price-feed`](https://github.com/SeaQL/sea-streamer/tree/main/examples/price-feed) app which you can checkout from the SeaStreamer repository:

```log
$ cd examples/price-feed
$ cargo run

Connecting ..
Connected.
Subscribed.
{"spread":{"bid":"1.25495","ask":"1.25513","timestamp":"2024-05-05T16:31:00.961214","bid_vol":"61.50588918","ask_vol":"787.90883861"},"channel_name":"spread","pair":"GBP/USD"}
..
```

## 3. SQL Data Sink

Step 1, create a stream consumer:

```rust
let streamer = SeaStreamer::connect(streamer_uri, Default::default()).await?;

let consumer = streamer
    .create_consumer(&[stream_key], SeaConsumerOptions::default())
    .await?;
```

There are a bunch of different options for [Redis](https://docs.rs/sea-streamer-redis/latest/sea_streamer_redis/struct.RedisConsumerOptions.html) & [Kafka](https://docs.rs/sea-streamer-kafka/0.5.0/sea_streamer_kafka/struct.KafkaConsumerOptions.html) respectively, you can refer to SeaStreamer's [examples](https://github.com/SeaQL/sea-streamer/tree/main/examples/). Here we use the default, which is a real-time state-less stream consumer.

Step 2, create a database:

```rust
let mut opt = ConnectOptions::new("sqlite://my_db.sqlite?mode=rwc"));
opt.max_connections(1).sqlx_logging(false);
let db = Database::connect(opt).await?;
```

We set `max_connections` to `1`, because our data sink will not do concurrent inserts anyway.

Here is the `Entity`:

```rust
#[derive(Debug, Clone, PartialEq, Eq, DeriveEntityModel, Deserialize)]
#[sea_orm(table_name = "event")]
pub struct Model {
    #[sea_orm(primary_key)]
    #[serde(default)]
    pub id: i32,
    pub timestamp: String,
    pub bid: String,
    pub ask: String,
    pub bid_vol: String,
    pub ask_vol: String,
}
```

The table shall be named `event` and we derive `Deserialize` on the Model. There should be many SeaORM tutorials out there! Please refer to them for more explanation.

We will use the following helper method to create the database table, where the schema is derived from the Entity:

```rust
async fn create_tables(db: &DbConn) -> Result<(), DbErr> {
    let builder = db.get_database_backend();
    let schema = Schema::new(builder);

    let stmt = builder.build(
        schema.create_table_from_entity(Entity).if_not_exists(),
    );
    log::info!("{stmt}");
    db.execute(stmt).await?;

    Ok(())
}
```

This is especially handy for SQLite, where the app owns the database schema. For other databases, you'd probably use the [SeaORM migration system](https://www.sea-ql.org/SeaORM/docs/next/migration/setting-up-migration/).

Step 3, insert the data into database:

```rust
loop {
    let message = consumer.next().await?;
    let payload = message.message();
    let json = payload.as_str()?;
    let item: Item = serde_json::from_str(json)?;
    let mut spread = item.spread.into_active_model();
    spread.id = NotSet; // let the db assign primary key
    spread.save(&db).await?;
}
```

In a few lines of code, we:

1. receive the message from Redis
2. decode the message as JSON
3. convert the message into a SeaORM Model
4. insert the Model into database

Run the [`sea-orm-sink`](https://github.com/SeaQL/sea-streamer/tree/main/examples/sea-orm-sink) app in another terminal:

```log
$ RUST_LOG=info cargo run

[INFO  sea_streamer_sea_orm_sink] CREATE TABLE IF NOT EXISTS "event" ( "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT, "timestamp" varchar NOT NULL, "bid" varchar NOT NULL, "ask" varchar NOT NULL, "bid_vol" varchar NOT NULL, "ask_vol" varchar NOT NULL )
[INFO  sea_streamer_sea_orm_sink] {"spread":{"bid":"1.25495","ask":"1.25513","timestamp":"2024-05-05T16:31:00.961214","bid_vol":"61.50588918","ask_vol":"787.90883861"},"channel_name":"spread","pair":"GBP/USD"}
```

That's it! Now you can inspect the data with your favourite database GUI:

<img alt="screenshot of SQLite database" src="/blog/img/2024-05-05-redis-kafka-data-sink-sqlite.png"/>

## Conclusion

In this article, we covered:

1. Micro-services architecture in stream processing
2. Async real-time programming in Rust
3. The awesomeness of the SeaQL and Rust ecosystem[^2]

Here are a few suggestions how you can take it from here:

1. Stream the data to a "big database" like MySQL or Postgres
2. Subscribe to more streams and sink to more tables
3. Buffer the events and insert the data in batches to achieve higher throughput, further reads:
    + https://github.com/SeaQL/sea-streamer/blob/main/examples/src/bin/buffered.rs
    + https://github.com/SeaQL/FireDBG.for.Rust/blob/main/indexer/src/main.rs

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