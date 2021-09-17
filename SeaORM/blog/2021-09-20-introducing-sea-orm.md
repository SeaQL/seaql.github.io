---
slug: 2021-09-20-introducing-sea-orm
title: This month in SeaQL
author: Chris Tsang
author_title: SeaQL Team
author_url: https://github.com/tyt2y3
author_image_url: https://avatars.githubusercontent.com/u/1782664?v=4
tags: [news]
---

We are pleased to introduce SeaORM `0.2.2` to the Rust community today. It's our pleasure to have received feedback and contributions from awesome people to SeaQuery and SeaORM since `0.1.0`.

Rust is a wonderful language that can be used to build anything. One of the FAQs is "Are We Web Yet?", and if Rocket (or your favourite web framework) is Rust's Rail, then SeaORM is precisely Rust's ActiveRecord.

SeaORM is an async ORM built from the ground up, designed to play well with the async ecosystem, whether it's actix, async-std, tokio or any web framework built on top.

Let's have a quick tour of SeaORM.

## Async

Here is how you'd execute multiple queries in parallel:

```rust

```

## Dynamic

You can use SeaQuery to build complex queries without 'fighting the ORM':

```rust

```

[more on SeaQuery]()

## Testable

To write unit tests, you can use our mock interface:

```rust

```

[more on testing]()

## Service oriented

Here is an example `Rocket` handler with pagination:

```rust

```

[full Rocket example]()

We are building more examples for other web frameworks too.

## Contributors

SeaQL is a community driven project. We welcome you to participate, contribute and together build for Rust's future.

As a courtesy, here is the list of SeaQL's early contributors (in alphabetic order):
