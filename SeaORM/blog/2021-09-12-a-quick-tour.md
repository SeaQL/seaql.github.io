---
slug: 2021-09-12-a-quick-tour
title: This month in SeaQL
author: Chris Tsang
author_title: SeaQL Team
author_url: https://github.com/tyt2y3
author_image_url: https://avatars.githubusercontent.com/u/1782664?v=4
tags: [news]
---

SeaORM `0.2.2` has just been released! We are pleased to introduce SeaORM to the Rust community today. It's our pleasure to have received feedback and contributions from awesome people to SeaQuery and SeaORM.

Rust is a wonderful language that can be used to build anything. One of the FAQs is "Are We Web Yet?", and if Rocket (or your favourite web framework) is Rust's Rail, then SeaORM is precisely Rust's ActiveRecord.

SeaORM is an async ORM built from the ground up, designed to play well with the async ecosystem, whether it's actix, async-std or tokio.

Let's have a quick tour of SeaORM.

Here is how you would define an Entity `Cake` that has a to-many relation with `Fruit`:

```rust

```

[more on Entity format]()

Here is how you'd query the first 10 cakes

```rust

```

If you want to find related fruits of a cake, you'd

```rust

```

Or if you want to find related fruits of all cakes in one query

```rust

```

[more on select query]()

You can also use SeaORM to write database-generic schema

```rust

```

[more schema statements]()

If you're feeling sub-query, here's how you'd do it

```rust

```

[more on SeaQuery]()

Finally, to write unit tests, you can use our mock interface

```rust

```

[more on testing]()

SeaORM is a community driven project. We welcome you to participate, contribute and together build for Rust's future.