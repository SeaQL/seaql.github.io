---
slug: 2022-04-04-introducing-starfish-ql
title: Introducing StarfishQL
author: SeaQL Team
author_title: Chris Tsang
author_url: https://github.com/SeaQL
author_image_url: https://www.sea-ql.org/SeaORM/img/SeaQL.png
tags: [news]
---

We are pleased to introduce [StarfishQL](https://www.sea-ql.org/StarfishQL/) to the Rust community today. StarfishQL is a graph database and query engine to enable graph analysis and visualization on the web. It is an experimental project, with its primary purpose to explore the dependency network of Rust crates published on crates.io.

## Motivation

StarfishQL is a framework for providing a graph database and a graph query engine that interacts with it.

A concrete example (Freeport) involving the graph of crate dependency on [crates.io](https://crates.io/) is used for illustration. With this example, you can see StarfishQL in action.

At the end of the day, we're interested in performing graph analysis, that is to extract meaningful information out of plain graph data. To achieve that, we believe that visualization is a crucial aid.

StarfishQL's query engine is designed to be able to incorporate different forms of visualization by using a flexible query language. However, the development of the project has been centred around the following, as showcased in our [demo apps](https://starfish-ql.sea-ql.org/).

<div className="row" id="colourful-graphs">
    <div className="col col--6 margin-bottom--md">
        <div className="card item shadow--lw">
            <div className="card__header">
                <a href="https://starfish-ql.sea-ql.org/graph.html">
                    <h3>Top-N Dependencies</h3>
                </a>
            </div>
            <div className="card__body">
                <img src="https://www.sea-ql.org/StarfishQL/img/graph.png" />
                <p>Traverse the dependency graph in the normal direction starting from the N most connected nodes.</p>
            </div>
        </div>
    </div>
    <div className="col col--6 margin-bottom--md">
        <div className="card item shadow--lw">
            <div className="card__header">
                <a href="https://starfish-ql.sea-ql.org/tree.html">
                    <h3>Dependencies & Dependents</h3>
                </a>
            </div>
            <div className="card__body">
                <img src="https://www.sea-ql.org/StarfishQL/img/tree.png" />
                <p>Traverse the dependency tree in both forward and reverse directions starting from a particular node.</p>
            </div>
        </div>
    </div>
</div>

## Design

In general, a query engine takes input queries written in a specific query language (e.g. SQL statements), performs the necessary operations in the database, and then outputs the data of interest to the user application. You may also view a query engine as an abstraction layer such that the user can design queries simply in the supported query language and let the query engine do the rest.

In the case of a graph query engine, the output data is a graph ([wiki](https://en.wikipedia.org/wiki/Graph_(abstract_data_type))).

![Graph query engine overview](https://www.sea-ql.org/StarfishQL/img/graph_query_engine_overview.png)

In the case of StarfishQL, the query language is a custom language we defined in the JSON format, which enables the engine to be highly accessible and portable.

## Implementation

In the example of Freeport, StarfishQL consists of the following three components.

### Graph Query Engine

As a core component of StarfishQL, the graph query engine is a Rust backend application powered by the [Rocket](https://crates.io/crates/rocket) web framework and the [SeaQL ecosystem](https://github.com/SeaQL).

The engine listens at the following endpoints for the corresponding operation:
- `/schema` - [Define/Reset the schema](https://www.sea-ql.org/StarfishQL/docs/architecture-of-graph-query-engine/defining-graph-schema)
- `/mutate` - [Perform mutate operations](https://www.sea-ql.org/StarfishQL/docs/architecture-of-graph-query-engine/mutate-operations)
- `/query` - [Perform queries](https://www.sea-ql.org/StarfishQL/docs/architecture-of-graph-query-engine/querying-graph-data)

You could also invoke the endpoints above programmatically.

Graph data are stored in a relational database:
- [Metadata](https://www.sea-ql.org/StarfishQL/docs/architecture-of-graph-query-engine/data-storage) - Definition of each entity and relation, e.g. attributes of crates and dependency
- [Node Data](https://www.sea-ql.org/StarfishQL/docs/architecture-of-graph-query-engine/data-storage#storage-of-entities) - An instance of an entity, e.g. crate name and version number
- [Edge Data](https://www.sea-ql.org/StarfishQL/docs/architecture-of-graph-query-engine/data-storage#storage-of-relations) - An instance of a relation, e.g. one crate depends on another

### crates.io Crawler

To obtain the crate data to insert into the database, we used a [fast, non-disruptive crawler](https://www.sea-ql.org/StarfishQL/docs/architecture-of-crates-io-crawler/overview) on a local clone of the public index repo of crates.io.

### Graph Visualization

We used [`d3.js`](https://d3js.org/) to create force-directed graphs to display the results. The two [colourful graphs](#colourful-graphs) above are such products.

## Findings

Here are some interesting findings we made during the process.

<div className="row">
    <div className="col col--12 margin-bottom--md">
        <div className="card item shadow--lw">
            <div className="card__header">
                <h3>Top-10 Dependencies</h3>
            </div>
            <div className="card__body">
                <p>List of top 10 crates order by different <a href="https://www.sea-ql.org/StarfishQL/docs/architecture-of-graph-query-engine/calculating-node-connectivity/#weight-decay-factors">decay modes</a>.</p>
                <div className="row row--no-gutters">
                    <div className="col col--4 padding-left--none padding-right--none">
                        <table>
                            <thead>
                                <tr>
                                    <th colspan="2">Decay Mode: Immediate / Simple Connectivity</th>
                                </tr>
                                <tr>
                                    <th>crate</th>
                                    <th>connectivity</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><a href="https://crates.io/crates/serde" target="_blank">serde</a></td>
                                    <td>17,441</td>
                                </tr>
                                <tr>
                                    <td><a href="https://crates.io/crates/serde_json" target="_blank">serde_json</a></td>
                                    <td>10,528</td>
                                </tr>
                                <tr>
                                    <td><a href="https://crates.io/crates/log" target="_blank">log</a></td>
                                    <td>9,220</td>
                                </tr>
                                <tr>
                                    <td><a href="https://crates.io/crates/clap" target="_blank">clap</a></td>
                                    <td>6,323</td>
                                </tr>
                                <tr>
                                    <td><a href="https://crates.io/crates/thiserror" target="_blank">thiserror</a></td>
                                    <td>5,547</td>
                                </tr>
                                <tr>
                                    <td><a href="https://crates.io/crates/rand" target="_blank">rand</a></td>
                                    <td>5,340</td>
                                </tr>
                                <tr>
                                    <td><a href="https://crates.io/crates/futures" target="_blank">futures</a></td>
                                    <td>5,263</td>
                                </tr>
                                <tr>
                                    <td><a href="https://crates.io/crates/lazy_static" target="_blank">lazy_static</a></td>
                                    <td>5,211</td>
                                </tr>
                                <tr>
                                    <td><a href="https://crates.io/crates/tokio" target="_blank">tokio</a></td>
                                    <td>5,168</td>
                                </tr>
                                <tr>
                                    <td><a href="https://crates.io/crates/chrono" target="_blank">chrono</a></td>
                                    <td>4,794</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="col col--4 padding-left--none padding-right--none">
                        <table>
                            <thead>
                                <tr>
                                    <th colspan="2">Decay Mode: Medium (.5) / Complex Connectivity</th>
                                </tr>
                                <tr>
                                    <th>crate</th>
                                    <th>connectivity</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><a href="https://crates.io/crates/quote" target="_blank">quote</a></td>
                                    <td>4,126</td>
                                </tr>
                                <tr>
                                    <td><a href="https://crates.io/crates/syn" target="_blank">syn</a></td>
                                    <td>4,069</td>
                                </tr>
                                <tr>
                                    <td><a href="https://crates.io/crates/pure-rust-locales" target="_blank">pure-rust-locales</a></td>
                                    <td>4,067</td>
                                </tr>
                                <tr>
                                    <td><a href="https://crates.io/crates/reqwest" target="_blank">reqwest</a></td>
                                    <td>3,950</td>
                                </tr>
                                <tr>
                                    <td><a href="https://crates.io/crates/proc-macro2" target="_blank">proc-macro2</a></td>
                                    <td>3,743</td>
                                </tr>
                                <tr>
                                    <td><a href="https://crates.io/crates/num_threads" target="_blank">num_threads</a></td>
                                    <td>3,555</td>
                                </tr>
                                <tr>
                                    <td><a href="https://crates.io/crates/value-bag" target="_blank">value-bag</a></td>
                                    <td>3,506</td>
                                </tr>
                                <tr>
                                    <td><a href="https://crates.io/crates/futures-macro" target="_blank">futures-macro</a></td>
                                    <td>3,455</td>
                                </tr>
                                <tr>
                                    <td><a href="https://crates.io/crates/time-macros" target="_blank">time-macros</a></td>
                                    <td>3,450</td>
                                </tr>
                                <tr>
                                    <td><a href="https://crates.io/crates/thiserror-impl" target="_blank">thiserror-impl</a></td>
                                    <td>3,416</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="col col--4 padding-left--none padding-right--none">
                        <table>
                            <thead>
                                <tr>
                                    <th colspan="2">Decay Mode: None / Compound Connectivity</th>
                                </tr>
                                <tr>
                                    <th>crate</th>
                                    <th>connectivity</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><a href="https://crates.io/crates/unicode-xid" target="_blank">unicode-xid</a></td>
                                    <td>54,982</td>
                                </tr>
                                <tr>
                                    <td><a href="https://crates.io/crates/proc-macro2" target="_blank">proc-macro2</a></td>
                                    <td>54,949</td>
                                </tr>
                                <tr>
                                    <td><a href="https://crates.io/crates/quote" target="_blank">quote</a></td>
                                    <td>54,910</td>
                                </tr>
                                <tr>
                                    <td><a href="https://crates.io/crates/syn" target="_blank">syn</a></td>
                                    <td>54,744</td>
                                </tr>
                                <tr>
                                    <td><a href="https://crates.io/crates/rustc-std-workspace-core" target="_blank">rustc-std-workspace-core</a></td>
                                    <td>51,650</td>
                                </tr>
                                <tr>
                                    <td><a href="https://crates.io/crates/libc" target="_blank">libc</a></td>
                                    <td>51,645</td>
                                </tr>
                                <tr>
                                    <td><a href="https://crates.io/crates/serde_derive" target="_blank">serde_derive</a></td>
                                    <td>51,056</td>
                                </tr>
                                <tr>
                                    <td><a href="https://crates.io/crates/serde" target="_blank">serde</a></td>
                                    <td>51,054</td>
                                </tr>
                                <tr>
                                    <td><a href="https://crates.io/crates/jobserver" target="_blank">jobserver</a></td>
                                    <td>50,567</td>
                                </tr>
                                <tr>
                                    <td><a href="https://crates.io/crates/cc" target="_blank">cc</a></td>
                                    <td>50,566</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <p>
                    If we look at <i>Decay Mode: Immediate</i>, where the connectivity is simply the <b>number of immediate dependants</b>, we can see that
                    <a href="https://crates.io/crates/serde" target="_blank"><code>serde</code></a> and <a href="https://crates.io/crates/serde_json" target="_blank"><code>serde_json</code></a> are at the top. I guess that supports our decision of defining the query language in JSON.
                </p>
                <p>
                    <i>Decay Mode: None</i> tells another interesting story: when the connectivity is the <b>entire tree of dependants</b>, we are looking at the really core crates that are nested somewhere deeply inside the most crates. In other words, these are the ones that are built along with the most crates. Under this setting, the utility crates that interacts with the low-level, more fundamental aspects of Rust are ranked higher,like <a href="https://crates.io/crates/quote" target="_blank"><code>quote</code></a> with syntax trees, <a href="https://crates.io/crates/proc-macro2" target="_blank"><code>proc-macro2</code></a> with procedural macros, and <a href="https://crates.io/crates/unicode-xid" target="_blank"><code>unicode-xid</code></a> with Unicode checking.
                </p>
            </div>
        </div>
    </div>
</div>

<div className="row">
    <div className="col col--12 margin-bottom--md">
        <div className="card item shadow--lw">
            <div className="card__header">
                <h3>Number of crates without Dependencies</h3>
            </div>
            <div className="card__body">
                <p>19,369 out of 79,972 crates, or 24% of the crates, do not depend on any crates.</p>
                <p>
                    e.g.&nbsp;
                    <a href="https://crates.io/crates/a" target="_blank">a</a>,&nbsp;
                    <a href="https://crates.io/crates/a-" target="_blank">a-</a>,&nbsp;
                    <a href="https://crates.io/crates/a0" target="_blank">a0</a>,&nbsp;
                    ...,&nbsp;
                    <a href="https://crates.io/crates/zyx_test" target="_blank">zyx_test</a>,&nbsp;
                    <a href="https://crates.io/crates/zz-buffer" target="_blank">zz-buffer</a>,&nbsp;
                    <a href="https://crates.io/crates/z_table" target="_blank">z_table</a>
                </p>
                <p>In other words, about 76% of the crates are standing on the shoulders of giants! 💪</p>
                <img src="https://www.sea-ql.org/StarfishQL/img/crate_without_dependency_count.png" />
                <img src="https://www.sea-ql.org/StarfishQL/img/crate_without_dependency_percentage.png" />
            </div>
        </div>
    </div>
</div>

<div className="row">
    <div className="col col--12 margin-bottom--md">
        <div className="card item shadow--lw">
            <div className="card__header">
                <h3>Number of crates without Dependants</h3>
            </div>
            <div className="card__body">
                <p>53,910 out of 79,972 crates, or 67% of the crates, have no dependants, i.e. no other crates depend on them.</p>
                <p>
                    e.g.&nbsp;
                    <a href="https://crates.io/crates/a" target="_blank">a</a>,&nbsp;
                    <a href="https://crates.io/crates/a-" target="_blank">a-</a>,&nbsp;
                    <a href="https://crates.io/crates/a-bot" target="_blank">a-bot</a>,&nbsp;
                    ...,&nbsp;
                    <a href="https://crates.io/crates/zzp-tools" target="_blank">zzp-tools</a>,&nbsp;
                    <a href="https://crates.io/crates/zzz" target="_blank">zzz</a>,&nbsp;
                    <a href="https://crates.io/crates/z_table" target="_blank">z_table</a>
                </p>
                <p>We imagine many of those crates are binaries/executables, if only we could figure out a way to check that... 🤔</p>
            </div>
        </div>
    </div>
</div>

*As of March 30, 2022*

## Conclusion

StarfishQL allows flexible and portable definition, manipulation, retrieval, and visualization of graph data.

The graph query engine built in Rust provides a nice interface for any web applications to access data in the relational graph database with stable performance and memory safety.

Admittedly, StarfishQL is still in its infancy, so every detail in the design and implementation is subject to change. Fortunately, the good thing about this is, like all other open-source projects developed by brilliant Rust developers, you can contribute to it if you also find the concept interesting. With its addition to the [SeaQL ecosystem](https://www.sea-ql.org/SeaORM/), together we are one step closer to the vision of Rust for data engineering.

## People

StarfishQL is created by the following SeaQL team members:

<div className="container">
    <div className="row">
        <div className="col col--3 margin-bottom--md">
            <div className="avatar">
                <a className="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/tyt2y3">
                    <img src="https://avatars.githubusercontent.com/u/1782664?v=4" />
                </a>
                <div className="avatar__intro">
                    <div className="avatar__name">
                        Chris Tsang
                    </div>
                </div>
            </div>
        </div>
        <div className="col col--3 margin-bottom--md">
            <div className="avatar">
                <a className="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/billy1624">
                    <img src="https://avatars.githubusercontent.com/u/30400950?v=4" />
                </a>
                <div className="avatar__intro">
                    <div className="avatar__name">
                        Billy Chan
                    </div>
                </div>
            </div>
        </div>
        <div className="col col--3 margin-bottom--md">
            <div className="avatar">
                <a className="avatar__photo-link avatar__photo avatar__photo--sm" href="https://github.com/shpun817">
                    <img src="https://avatars.githubusercontent.com/u/47468266?v=4" />
                </a>
                <div className="avatar__intro">
                    <div className="avatar__name">
                        Sanford Pun
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

## Contributing

We are super excited to be selected as a Google Summer of Code 2022 mentor organization!

StarfishQL is one of the [GSoC project ideas](https://github.com/SeaQL/summer-of-code/blob/main/2022/README.md#2-a-graph-database-and-query-engine-codename-starfishql-for-graph-analysis-and-visualization) that opens for development proposals. Join us on GSoC 2022 by following the instructions on [GSoC Contributing Guide](https://github.com/SeaQL/summer-of-code/blob/main/2022/CONTRIBUTING.md).
