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
                    Kirawi
                </div>
            </div>
        </div>
    </div>
</div>

Hello, my name is Shafkath Shuhan and I'm a senior high school student from NYC. I've always had an interest in computer science, and Rust has been a game changer for its amazing packaging system, compile-time guarantees, and most importantly its helpful community. My GitHub profile is https://github.com/kirawi.

I'll be working on a feature-gated runtime linter to validate the correctness of code dependent upon SeaORM, and add many tests to test this functionality. It will be implemented with extensibility in mind. My initial design is described in https://github.com/SeaQL/summer-of-code/discussions/13.

### Support TiDB in the SeaQL Ecosystem

<div class="row">
    <div class="col col--12 margin-bottom--md">
        <div class="avatar">
            <a class="avatar__photo-link avatar__photo" href="https://github.com/itwaiX">
                <img src="https://avatars.githubusercontent.com/u/44227947?v=4" />
            </a>
            <div class="avatar__intro">
                <div class="avatar__name">
                    Yuang XU
                </div>
            </div>
        </div>
    </div>
</div>

My name is Yuang Xu, I live in Shanghai, China (UTC +8), I am a senior student at Shandong University, China, majoring in Computer and Science Technology. During my university years, I participated in open source projects many times, and once participated in the Tencent open-source Kona JDK project.
I like to explore some new knowledge, such as the database. I am fortunate to participate in the development of the SeaQL project. Recently in China, some of my friends and I also organized a small open source community exchange platform, hoping that more people can join the open-source family.
I like to make friends. If you can work together to do something interesting, remember to call me！
My Github profile is https://github.com/itwaiX.

I'll be working to support TiDB in the SeaQL ecosystem. The overall concept of the project is divided into two parts because TiDB and MySQL have many compatible parts. This part is integrated with the general part. The unique parts, such as cluster monitoring and other interfaces, build a complete system for operation.
Glad to learn with you all, SO let's start this pleasant journey!

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

I am Panagiotis, I live in Athens Greece (GMT+3 DST) and currently I pursue my second bachelors on economic sciences. My first bachelors was on computer science and I have a great passion on studying and implementing enterprise software solutions . I know rust the last year and I used it almost daily for a small startup project that me and my friends build for a startup competition. The reasons we chose rust was 1) protects you from forgetting edge cases, 2) easy to express business logic without errors, 3) you can open old code (months old) and refactor it without fear, 4) the low memory footprint.

I will be working on creating a cli tool that will explore a database schema and then generate a ready to build async_graphql api. The tool will allow quick integration with the Sea and Rust ecosystems as well as GraphQL. To be more specific, for database exploring I will use sea_schema and for entity generation sea_codegen, my job is to glue those together with async_graphql library. You can read more here https://github.com/SeaQL/summer-of-code/discussions/12, but the initial design is outdated.

I wish everyone a good start 🙂

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

Hi. Thank you so much for this opportunity! I'm looking forward to building and learning with you all 😄 

I'm Samyak Sarnayak, a final year Computer Science student from Bangalore, India. I started learning Rust around 6-7 months ago and it feels like I have found the perfect language for me :D. It does not have a runtime, has a great type system, really good compiler errors, good tooling, some functional programming patterns and metaprogramming. You can find more about me on my GitHub: https://github.com/Samyak2.

I'll be working on a new SQL interpreter for mock testing. This will be built specifically for testing and so the emphasis will be on correctness - it can be slow but the operations must always be correct. I'm hoping to build a working version of this and integrate it into the existing tests of SeaORM. Here is the discussion thread for this project: https://github.com/SeaQL/summer-of-code/discussions/11 (admittedly, I haven't been able to work on it in the last few weeks as I'm wrapping up my college work).

## Mentors

<div class="row">
    <div class="col col--6 margin-bottom--md">
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
    <div class="col col--6 margin-bottom--md">
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

## Community

Contributors and members in the community are encourage to know each other and help new contributors to get up to speed during the community bonding period from May 20 to June 12, before starting to code on June 13.

If you are interested in the projects please subscribe to [SeaQL/summer-of-code](https://github.com/SeaQL/summer-of-code) repository on GitHub and join us on [Discord server](https://discord.com/invite/uCPdDXzbdv).
