---
slug: 2023-01-01-call-for-contributors-n-reviewers.md
title: Call for Contributors and Reviewers 📢
author: SeaQL Team
author_title: Chris Tsang
author_url: https://github.com/tyt2y3
author_image_url: https://avatars.githubusercontent.com/u/1782664?v=4
tags: [news]
---

We are calling for contributors and reviewers for SeaQL projects 📢!

The SeaQL userbase has been steadily growing in the past year, and it’s a pleasure for us to have helped individuals and start-ups to build their projects in Rust. However, the volume of questions, issues and pull requests is nearly saturating our core members’ capacity.

But again, thank you everyone for participating in the community!

If your project depends on SeaQL and you want to help us, here are some suggestions (if you have not already, star [all our repositories](https://github.com/orgs/SeaQL/repositories?q=&type=all&language=&sort=stargazers) and follow us on [Twitter](https://twitter.com/sea_ql)):
1.	Financial Contribution. You can [sponsor us on GitHub](https://github.com/sponsors/SeaQL) and those will be used to cover our expenses. As a courtesy, we listen to our sponsors for their needs and use cases, and we also communicate our organizational development from time-to-time.
2.	Code Contribution. Opening a PR with us is always appreciated! To get started, you can go through our issue trackers and pick one to handle. If you are thinking of developing a substantial feature, start with drafting a ["Proposal & Implementation Plan" (PIP)](https://github.com/SeaQL/sea-orm/issues?q=is%3Aissue+%5BPIP%5D).
3.	Knowledge Contribution. There are various formats of knowledge sharing: [tutorial](https://github.com/SeaQL/sea-orm-tutorial), [cookbook](https://github.com/SeaQL/sea-orm-cookbook), [QnA](https://github.com/SeaQL/sea-orm/discussions/categories/q-a) and Discord. You can open PRs to our [documentation](https://github.com/SeaQL/seaql.github.io) repositories or publish on your own. We will be happy to list it in our learning resources section. Keep an eye on our GitHub Discussions and Discord and help others where you can!
4.	Code Review. This is an important process of our engineering. Right now, only 3 of our core members serve as reviewers. Non-core members can also become reviewers and I invite you to become one!

Now, I’d like to outline our review policy: for maturing projects, each PR merged has to be approved by at least two reviewers and one of them must be a core member; self-review allowed. Here are some examples:

+ A core member opened a PR, another core member approved ✅ 
+ A core member opened a PR, a reviewer approved ✅
+ A reviewer opened a PR, a core member approved ✅
+ A reviewer opened a PR, another reviewer approved ⛔
+ A contributor opened a PR, 2 core members approved ✅
+ A contributor opened a PR, a core member and a reviewer approved ✅
+ A contributor opened a PR, 2 reviewers approved ⛔

In a nutshell, at least two pairs of trusted eyes should have gone through each PR.

### What are the criteria when reviewing a PR?

The following questions should all be answered yes.

1.	Implementation, documentation and tests
    1.	Is the implementation easy to follow (have meaningful variable and function names)?
    2.	Is there sufficient document to the API?
    3.	Are there adequate tests covering various cases?
2.	API design
    1.	Is the API self-documenting so users can understand its use easily?
    2.	Is the API style consistent with our existing API?
    3.	Does the API made reasonable use of the type system to enforce constraints?
    4.	Are the failure paths and error messages clear?
    5.  Are all breaking changes justified and documented?
3.	Functionality
    1.	Does the feature make sense in computer science terms?
    2.	Does the feature actually work with all our supported backends?
    3.	Are all caveats discussed and eliminated / documented?
4.	Architecture
    1.	Does it fit with the existing architecture of our codebase?
    2.	Is it not going to create technical debt / maintenance burden?
    3.	Does it not break abstraction?

1, 2 & 3 are fairly objective and factual, however the answers to 4 probably require some discussion and debate. If a consensus cannot be made, [@tyt2y3](https://github.com/tyt2y3) will make the final verdict.

### Who are the current reviewers?

As of today, SeaQL has 3 core members who are also reviewers:

<div class="row">
    <div class="col col--12 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/tyt2y3">
                <img src="https://avatars.githubusercontent.com/u/1782664?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Chris Tsang
                </div>
                Founder. Maintains all projects.
            </div>
        </div>
    </div>
    <div class="col col--12 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/billy1624">
                <img src="https://avatars.githubusercontent.com/u/30400950?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Billy Chan
                </div>
              Founding member. Co-maintainer of SeaORM and Seaography.
            </div>
        </div>
    </div>
    <div class="col col--12 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/ikrivosheev">
                <img src="https://avatars.githubusercontent.com/u/6786239?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Ivan Krivosheev
                </div>
                Joined in 2022. Co-maintainer of SeaQuery.
            </div>
        </div>
    </div>
</div>

### How to become a reviewer?

We are going to invite a few contributors we worked closely with, but you can also volunteer – the requirement is: you have made substantial code contribution to our projects, and has shown familiarity with our [engineering practices](https://www.sea-ql.org/blog/2022-07-30-engineering/).

Over time, when you have made significant contribution to our organization, you can also become a core member.

### Let’s build for Rust's future together 🦀
