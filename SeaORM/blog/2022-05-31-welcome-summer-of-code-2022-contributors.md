---
slug: welcome-summer-of-code-2022-contributors
title: Welcome Summer of Code 2022 Contributors
author: SeaQL Team
author_title: Chris Tsang
author_url: https://github.com/SeaQL
author_image_url: https://www.sea-ql.org/SeaORM/img/SeaQL.png
tags: [news]
---

We are thrilled to announce that we will mentor four contributors this summer! Two Google Summer of Code ([GSoC](https://summerofcode.withgoogle.com/)) contributors and two SeaQL Summer of Code ([SSoC](https://github.com/SeaQL/summer-of-code)) contributors.

## Projects of Google Summer of Code 2022

This is our first year to be part of GSoC. We have received two slots this year from Google. We will be mentoring following GSoC projects:

### Query Linter for SeaORM

<div class="row">
    <div class="col col--12 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo" href="https://github.com/kirawi">
                <img src="https://avatars.githubusercontent.com/u/67773714?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Shafkath Shuhan
                </div>
            </div>
        </div>
    </div>
</div>

Hello, my name is Shafkath Shuhan and I'm a senior high school student from NYC. I've always had an interest in computer science, and Rust has been a game changer for its amazing packaging system, compile-time guarantees, and most importantly its helpful community.

I'll be working on a feature-gated runtime linter to validate the correctness of code dependent upon SeaORM. My initial design is described in a [discussion](https://github.com/SeaQL/summer-of-code/discussions/13) with extensibility in mind.

### Support TiDB in the SeaQL Ecosystem

<div class="row">
    <div class="col col--12 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo" href="https://github.com/itwaiX">
                <img src="https://avatars.githubusercontent.com/u/44227947?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Yuang Xu
                </div>
            </div>
        </div>
    </div>
</div>

My name is Yuang Xu, I live in Shanghai, China, I'm a senior student at Shandong University, China, majoring in Computer and Science Technology. During my university years, I participated in open-source projects many times, and once participated in the Tencent open-source Kona JDK project.

I like to explore new knowledge, such as the database. I'm fortunate to participate in the development of the SeaQL project. Recently in China, some of my friends and I also organized a small open-source community exchange platform, hoping that more people can join the open-source family. I like to make friends. If you can work together to do something interesting, remember to call me！

I'll be working on the support of TiDB in the SeaQL ecosystem. The overall concept of the project is divided in half as TiDB and MySQL are mostly compatible. The first half, focus on integrating with the compatible features. The second half, supporting unique features available to TiDB including cluster monitoring and interfaces that is essential for production environment.

## Projects of SeaQL Summer of Code 2022

There are many more vibrant contributors we want to mentor but we only received two slots from Google. That is why we, SeaQL foundation, utilizes our own fund and offers two more slots under SSoC internship program.

### A GraphQL Framework on Top of SeaORM

<div class="row">
    <div class="col col--12 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo" href="https://github.com/karatakis">
                <img src="https://avatars.githubusercontent.com/u/7329022?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Panagiotis Karatakis
                </div>
            </div>
        </div>
    </div>
</div>

I'm Panagiotis, I live in Athens Greece and currently I pursue my second bachelors on economic sciences. My first bachelors was on computer science and I've a great passion on studying and implementing enterprise software solutions. I know Rust the last year and I used it almost daily for a small startup project that me and my friends build for a startup competition. The reasons we chose Rust was:

1. Protect you from forgetting edge cases
2. Express business logic without errors
3. Open (months) old code and refactor it without fear
4. Low memory footprint

I'll be working on creating a CLI tool that will explore a database schema and then generate a ready to build `async-graphql` API. The tool will allow quick integration with the SeaQL and Rust ecosystems as well as GraphQL. To be more specific, for database exploring I'll use `sea-schema` and `sea-orm-codegen` for entity generation, my job is to glue those together with `async-graphql` library. You can read more [here](https://github.com/SeaQL/summer-of-code/discussions/12), but the initial design is outdated.

### SQL Interpreter for Mock Testing

<div class="row">
    <div class="col col--12 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo" href="https://github.com/Samyak2">
                <img src="https://avatars.githubusercontent.com/u/34161949?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Samyak Sarnayak
                </div>
            </div>
        </div>
    </div>
</div>

I'm Samyak Sarnayak, a final year Computer Science student from Bangalore, India. I started learning Rust around 6-7 months ago and it feels like I have found the perfect language for me :D. It does not have a runtime, has a great type system, really good compiler errors, good tooling, some functional programming patterns and metaprogramming. You can find more about me on my GitHub profile.

I'll be working on a new SQL interpreter for mock testing. This will be built specifically for testing and so the emphasis will be on correctness - it can be slow but the operations must always be correct. I'm hoping to build a working version of this and integrate it into the existing tests of SeaORM. Here is the [discussion](https://github.com/SeaQL/summer-of-code/discussions/11) for this project.

## Mentors

<div class="row">
    <div class="col col--12 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo" href="https://github.com/tyt2y3">
                <img src="https://avatars.githubusercontent.com/u/1782664?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Chris Tsang
                </div>
            </div>
        </div>
    </div>
</div>

<br/>

<div class="row">
    <div class="col col--12 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo" href="https://github.com/billy1624">
                <img src="https://avatars.githubusercontent.com/u/30400950?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Billy Chan
                </div>
            </div>
        </div>
    </div>
</div>

Hey, this is Billy from Hong Kong. I've been using open-source libraries ever since I started coding but it's until 2020, I dedicated myself to be Rust open-source developer.

I was also a full-stack developer specialized in formulating requirement specifications for user interfaces and database structures, implementing and testing both frontend and backend from ground up, finally releasing the MVP for production and maintaining it for years to come.

I enjoy working with Rustaceans across the globe, building a better and sustainable ecosystem for Rust community. If you like what we do, consider starring, commenting, sharing and contributing, it would be much appreciated.

<br/>

<div class="row">
    <div class="col col--12 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo" href="https://github.com/shpun817">
                <img src="https://avatars.githubusercontent.com/u/47468266?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Sanford Pun
                </div>
            </div>
        </div>
    </div>
</div>

## Community

Contributors and members in the community are encourage to know each other and help new contributors to get up to speed during the community bonding period from May 20 to June 12, before starting to code on June 13.

If you are interested in the projects please subscribe to [SeaQL/summer-of-code](https://github.com/SeaQL/summer-of-code) repository on GitHub and join us on [Discord server](https://discord.com/invite/uCPdDXzbdv).
