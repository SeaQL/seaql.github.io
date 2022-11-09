---
slug: 2022-11-09-toggle-stacked-download-graph-in-crates-io
title: Toggle Stacked Download Graph in crates.io
author: SeaQL Team
author_title: Billy Chan
author_url: https://github.com/SeaQL
author_image_url: https://www.sea-ql.org/SeaORM/img/SeaQL.png
tags: [news]
---

## Motivation

The download graph in [crates.io](https://crates.io/) used to be a stacked graph. With download count of older versions stack on top of newer versions. You might misinterpret the numbers. Consider this, at the first glance, it seems that version 0.9.2 has 1,500+ downloads on Nov 7. But in fact, it has only 237 downloads that day because the graph is showing the cumulative downloads.

![crates.io Stacked Download Graph](https://user-images.githubusercontent.com/30400950/200738670-4266e178-7952-4e05-bff0-c2445ba345bf.png)

This makes it hard to compare the download trend of different versions over time. Why this is important? You may ask. It's important to observe the adoption rate of newer version upon release. This paints a general picture if existing users are upgrading to newer version or not.

## Solution

The idea is simple but effective: having a dropdown to toggle between stacked and unstacked download graph. With this, one can switch between both display mode, comparing the download trend of different version and observing the most download version in the past 90 days are straightforward and intuitive.

![crates.io Unstacked Download Graph](https://user-images.githubusercontent.com/30400950/200741006-6a5e1922-de38-456b-b33d-dfc4ce2f8a93.png)

GitHub
- Issues: [Convert download chart from stacked chart to regular chart #3876](https://github.com/rust-lang/crates.io/issues/3876)
- PR: [Toggle stacked download graph #5010](https://github.com/rust-lang/crates.io/pull/5010)

## Conclusion

This is a great tool for us to gauge the adoption rate of our new releases and we highly encourage user upgrading to newer release that contains feature updates and bug fixes.
