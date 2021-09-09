---
slug: 2021-09-12-a-quick-tour
title: This month in SeaQL
author: Chris Tsang
author_title: SeaQL Team
author_url: https://github.com/tyt2y3
author_image_url: https://avatars.githubusercontent.com/u/1782664?v=4
tags: [news]
---

We are pleased to introduce SeaORM to the Rust community today. SeaORM `0.2.2` has just been released! It's our pleasure to have received feedback and contributions from awesome people to SeaQuery and SeaORM.

Rust is a wonderful language that can be used to build anything. One of the FAQs is "Are We Web Yet?", and if Rocket (or your favourite web framework) is Rust's Rail, then SeaORM is precisely Rust's ActiveRecord.

SeaORM is an async ORM built from the ground up, designed to play well with the async ecosystem.

Here is how you would define an Entity `Cake` that has a to-many relation with `Fruit`:

```rust

```

Here is how you'd query the first 10 cakes

```rust

```

If you want to find related fruits of a cake, you'd

```rust

```

Or if you want to find related fruits of all cakes in one query

```rust

```

You can also use SeaORM to write database-generic schema

```rust

```

SeaORM is a community driven project. We welcome you to participate, contribute and together build for Rust's future.