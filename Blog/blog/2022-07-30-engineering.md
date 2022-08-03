---
slug: 2022-07-30-engineering
title: Engineering at SeaQL.org
author: Chris Tsang
author_title: SeaQL Team
author_url: https://github.com/tyt2y3
author_image_url: https://avatars.githubusercontent.com/u/1782664?v=4
tags: [news]
---

It's hard to pin down the exact date, but I think SeaQL.org was setup in July 2020, a little over a year ago. Over the course of the year, SeaORM went from 0.1 to 0.9 and the number of users kept growing. I would like to outline our engineering process in this blog post, and perhaps it can serve as a reference or guidance to prospective contributors and the future maintainer of this project.

In the open source world, the Benevolent Dictator for Life (BDL) model underpins a number of successful open source projects. That's not me! As a maintainer, I believe in an open, bottom-up, iterative and progressive approach. Let me explain each of these words and what they mean to me.

### Open

Open as in source availability, but also engineering. We always welcome new contributors! We'd openly discuss ideas and designs. I would often explain why a decision was made in the first place for various things. The project is structured not as a monorepo, but several interdependent repos. This reduces the friction for new contributors, because they can have a smaller field of vision to focus on solving one particular problem at hand.

### Bottom-up

We rely on users to file feature requests, bug reports and of course pull requests to drive the project forward. The great thing is, for every feature / bug fix, there is a use case for it and a confirmation from a real user that it works and is reasonable. As a maintainer, I could not have first hand experience for all features and so could not understand some of the pain points.

### Iterative

Open source software is imperfect, impermanent and incomplete. While I do have a grand vision in mind, we do not try rushing it all the way in one charge, nor keeping a project secret until it is 'complete'. Good old 'release early, release often' - we would release an initial working version of a tool, gather user feedback and improve upon it, often reimplementing a few things and break a few others - which brings us to the next point.

### Progressive

Favour progression. Always look forward and leave legacy behind. It does not mean that we would arbitrary break things, but when a decision is made, we'd always imagine how the software *should be* without historic context. We'd provide migrate paths and encourage users to move forward with us. After all, Rust is a young and evolving language! You may or may not know that `async` was just stabilized in 2020.

Enough said for the philosophy, let's now talk about the actual engineering process.

### 1. Idea & Design

We first have some vague idea on what problem we want to tackle. As we put in more details to the use case, we can define the problem and brainstorm solutions. Then we look for workable ways to implement that in Rust.

### 2. Implementation

An initial proof of concept is appreciated. We iterate on the implementation to reduce the impact and improve the maintainability.

### 3. Testing

We rely on automated tests. Every feature should come with corresponding tests, and a release is good if and only if all tests are green. Which means for features not covered by our test suite, it is an uncertainty to when we would break them. So if certain undocumented feature is important to you, we encourage you to add that to our test suite.

### 4. Documentation

Coding is not complete without documentation. Rust doc tests kill two birds with one stone and so is greatly appreciated. For SeaORM we have separate documentation repository and tutorial repository. It takes a lot of effort to maintain those to be up to date, and right now it's mostly done by our core contributors.

### 5. Release

We run on a release train model, although the frequency varies. The ethos is to have small number breaking changes often. At one point, SeaQuery has a new release every week. SeaORM runs on monthly, although it more or less relaxes to bimonthly now. At any time, we maintain two branches, the latest release and master. PRs are always merged into master, and if it is non-breaking (and worthy) I would backport it to the release branch and make a minor release. At the end, I want to maintain momentum and move forward together with the community. Users can have a rough expectation on when merges will be released. And there are just **lots** of change we cannot avoid a breaking release as of the current state of the Rust ecosystem. Users are advised to upgrade regularly, and we ship along many small improvements to encourage that.

## Conclusion

Open source software is a collaborative effort and thank you all who participated! Also a big thanks to SeaQL's core contributors who made wonders. If you have not already, I invite you to star all our repositories. If you want to support us materially, a small donation would make a big difference. SeaQL the organization is still in its infancy, and your support is vital to SeaQL's longevity and the prospect of the Rust community.