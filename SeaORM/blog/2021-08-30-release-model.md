---
slug: 2021-08-30-release-model
title: Release Model
author: Chris Tsang
author_title: SeaQL Team
author_url: https://github.com/tyt2y3
author_image_url: https://avatars.githubusercontent.com/u/1782664?v=4
tags: [news]
---

Today we will outline our release plan in the near future.

One of Rust's slogan is [Stability Without Stagnation](https://doc.rust-lang.org/book/appendix-07-nightly-rust.html#stability-without-stagnation), and SeaQL's take on it, is 'progression without stagnation'.

Before reaching `1.0`, we will be releasing every week, incorporating the latest changes and merged pull requests. There will be at most one incompatible release per month, so you will be expecting `0.2` in Sep 2021 and `0.9` in Apr 2022. We will decide by then whether the next release is an incremental `0.10` or a stable `1.0`.

After that, a major release will be rolled out every year. So you will probably be expecting a `2.0` in 2023.

All of these is only made possible with a solid infrastructure. While we have a [test suite](https://github.com/SeaQL/sea-orm/actions), its coverage will likely never be enough. We urge you to submit test cases to SeaORM if a particular feature is of importance to you.

We hope that a rolling release model will provide momentum to the community and propell us forward in the near future.