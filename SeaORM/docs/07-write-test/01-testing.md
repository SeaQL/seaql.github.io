# Writing Tests

Testing is an integral part of programming in Rust, with [`cargo test`](https://doc.rust-lang.org/cargo/commands/cargo-test.html) built directly into the toolchain.

There are two kinds of tests you'd write: unit tests and integration tests.

SeaORM is designed to be testable: the core API is a facade that doesn't require a database backend at compile time. That means you can bring in entities and models as plain Rust types, and use them in unit tests. You can even run queries against a mock database for advanced tests, without spinning up a database backend.

## Logic Tests

Just to give a small example, let's say we have an Entity:

```rust title="triangle.rs"
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "triangle")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub p1: Point,
    pub p2: Point,
    pub p3: Point,
}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, FromJsonQueryResult)]
pub struct Point {
    pub x: f64,
    pub y: f64,
}

// ..
```

You can write unit tests for the logic around this entity:

```rust
use triangle::{Model as Triangle, Point};

impl Triangle {
    fn area(&self) -> f64 {
        let a = self.p1.distance_to(&self.p2);
        let b = self.p2.distance_to(&self.p3);
        let c = self.p3.distance_to(&self.p1);
        let s = (a + b + c) / 2.0;
        (s * (s - a) * (s - b) * (s - c)).sqrt()
    }
}

impl Point {
    fn distance_to(&self, p: &Point) -> f64 {
        let dx = self.x - p.x;
        let dy = self.y - p.y;
        (dx * dx + dy * dy).sqrt()
    }
}

assert!(
    (Triangle {
        id: 1,
        p1: Point { x: 0., y: 0. },
        p2: Point { x: 2., y: 0. },
        p3: Point { x: 0., y: 2. },
    }
    .area() - 2.) .abs() < 0.00000001
);
```

This can be done in a pure crate without `tokio` or `sqlx` dependency.
These entities will be the exact same ones you use in database interaction.