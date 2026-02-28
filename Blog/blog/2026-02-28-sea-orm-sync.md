---
slug: 2026-02-28-sea-orm-sync
title: "Tutorial: let's make a resumable Pi Spigot with SQLite"
author: SeaQL Team
author_title: Chris Tsang
author_url: https://github.com/SeaQL
author_image_url: https://www.sea-ql.org/blog/img/SeaQL.png
image: https://www.sea-ql.org/blog/img/SeaORM%202.0%20Banner.png
tags: [news]
---

<img alt="SeaORM 2.0 Banner" src="/blog/img/SeaORM%202.0%20Banner.png"/>

## The Problem: Durability

Long-running programs crash. When they do, you start over from zero. The fix is checkpointing: periodically save state to a database so the program can resume where it left off. In this tutorial we wire up checkpointing with SeaORM Sync and rusqlite. No async runtime, no handwritten SQL.

## The Workload: Pi Spigot

We need a computation that takes a long time and produces results incrementally. Here we use the Rabinowitz–Wagon pi spigot algorithm[^1] as demonstration.

The algorithm computes decimal digits of pi one at a time, using only integer arithmetic. Each iteration mutates the internal state, and may or may not produce a digit. So "I completed iteration N, therefore I have N digits" is not true.

This makes it a good test case for checkpointing. You can't just save the digit count and recompute from there: you need the full internal state.

## The State Machine Pattern

Any computation that can be modeled as a state machine can be made resumable. The recipe:

```rust
new()        → initialize fresh state
step()       → advance one iteration, mutating &mut self
finalize()   → flush any buffered output
to_state()   → serialize self into a database row
from_state() → deserialize a database row back into self
```

`step()` is the core loop body. Call it repeatedly to drive the computation forward. `to_state()` and `from_state()` handle persistence: save the internal state and resume from it later.

The checkpoint frequency is a param you control. Checkpoint every step and you lose almost no work on crash, but pay the IO cost every iteration. Checkpoint every 1000 steps and crashes cost you up to 1000 steps of rework, but the overhead is negligible.

## Integrating with SeaORM + rusqlite

Now let's wire this pattern into a real database. SeaORM 2.0 ships a sync API (crate [`sea-orm-sync`](https://docs.rs/sea-orm-sync)) backed by [rusqlite](https://docs.rs/rusqlite). The API surface is compatible with `sea-orm`, just without any `async`.

### Step 1: Define the State Entity

Map every mutable field of the computation to a column:

```rust title="state.rs"
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[sea_orm::model]
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "state")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub digits: u32,
    pub boxes: JsonVec,
    pub i: u32,
    pub nines: u32,
    pub predigit: u8,
    pub have_predigit: bool,
    pub count: u32,
    pub result: String,
}

#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize, FromJsonQueryResult)]
pub struct JsonVec(pub Vec<u32>);

impl ActiveModelBehavior for ActiveModel {}
```

`digits` is the primary key: it identifies which computation this checkpoint belongs to (i.e. "compute 10000 digits of pi"). `boxes` holds the algorithm's working array as a JSON column via `FromJsonQueryResult`, since SQLite has no native array type. The rest are scalars: iteration counter, buffered-nine count, the held predigit, and the digits emitted so far.

### Step 2: Serialize and Deserialize

The computation struct itself has no dependency on SeaORM: it uses plain `Vec<u32>`, `u32`, `String`. Two glue functions convert between this struct and the entity model. This keeps the core algorithm pure and testable; the entire persistence layer can be gated behind a feature flag so that the library can work without `sea-orm`.

The conversion functions:

```rust
fn from_state(s: state::Model) -> Self {
    Self {
        digits: s.digits,
        boxes: s.boxes.0,
        nines: s.nines,
        predigit: s.predigit,
        have_predigit: s.have_predigit,
        count: s.count,
        result: s.result,
        start_i: s.i,
    }
}

fn to_state(&self, i: u32) -> state::Model {
    state::Model {
        digits: self.digits,
        boxes: state::JsonVec(self.boxes.clone()),
        i,
        nines: self.nines,
        predigit: self.predigit,
        have_predigit: self.have_predigit,
        count: self.count,
        result: self.result.clone(),
    }
}
```

### Step 3: Checkpoint in a Transaction

Inside the main loop, periodically save state. The delete-then-insert is wrapped in a transaction so the checkpoint is atomic: either the full state is written or nothing changes.

```rust
fn persist_state(&self, db: &DatabaseConnection, i: u32) -> Result<(), DbErr> {
    let txn = db.begin()?;
    state::Entity::delete_by_id(self.digits).exec(&txn)?;
    self.to_state(i + 1).into_active_model().insert(&txn)?;
    txn.commit()?;
    Ok(())
}
```

Note the `i + 1`: we save the *next* iteration index, not the current one. The state has already been mutated by `step()`, so when the program resumes it should continue from the next iteration, not re-execute the one it just completed.

If the process dies at any point before `commit()`, SQLite rolls back the transaction automatically. The previous checkpoint remains intact. This is more resilient than writing to a plain JSON file, where a crash mid-write can leave you with a truncated or corrupted file and no valid checkpoint at all.

### Step 4: Resume on Startup

On startup, check for an existing checkpoint. `get_schema_builder().sync()` creates the table from the entity definition if it doesn't already exist, so there is no need to write `CREATE TABLE` SQL:

```rust
pub fn resume(db: &DatabaseConnection, digits: u32) -> Result<Self, DbErr> {
    db.get_schema_builder()
        .register(state::Entity)
        .sync(db)?;

    match state::Entity::find_by_id(digits).one(db)? {
        Some(s) => Ok(Self::from_state(s)),
        None => Ok(Self::new(digits)),
    }
}
```

First run: creates the table, starts fresh. Subsequent runs: finds the checkpoint row, reconstructs the computation mid-flight. The calling code doesn't need to distinguish between the two cases.

### Putting It Together

The main loop looks like this:

```rust
// initialize states in self

for i in self.start_i..=self.digits {
    self.step();

    if self.count > 0 && self.count % checkpoint_interval == 0 {
        self.persist_state(db, i)?;
    }
}

self.finalize();
```

The full example including tests is in the [SeaORM repository](https://github.com/SeaQL/sea-orm/tree/master/sea-orm-sync/examples/pi_spigot).

## Conclusion

SeaORM Sync with rusqlite is a lightweight combination: a single-file database, no server, no async runtime. You define your state as an entity, and SeaORM handles the SQL. No hand-written queries, no migration files. You stay focused on the core program logic.

The patterns here are reusable. State machine + serialization round-trip + transactional checkpoint: apply them to batch jobs, simulations, data pipelines, or any long-running process that shouldn't have to start over after a crash.

## 🦀 Rustacean Sticker Pack

The Rustacean Sticker Pack is the perfect way to express your passion for Rust.
Our stickers are made with a premium water-resistant vinyl with a unique matte finish.

Sticker Pack Contents:
- Logo of SeaQL projects: SeaQL, SeaORM, SeaQuery, Seaography
- Mascots: Ferris the Crab x 3, Terres the Hermit Crab
- The Rustacean wordmark

[Support SeaQL and get a Sticker Pack!](https://www.sea-ql.org/sticker-pack/)

<a href="https://www.sea-ql.org/sticker-pack/"><img style={{borderRadius: "25px"}} alt="Rustacean Sticker Pack by SeaQL" src="https://www.sea-ql.org/static/sticker-pack-1s.jpg" /></a>

[^1]: The spigot algorithm is not the fastest way to compute pi. It can take hours to produce 1 million digits.