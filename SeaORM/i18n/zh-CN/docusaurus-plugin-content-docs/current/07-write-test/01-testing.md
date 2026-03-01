# 编写测试

测试是 Rust 编程不可或缺的一部分，[`cargo test`](https://doc.rust-lang.org/cargo/commands/cargo-test.html) 直接内置在工具链中。

你需要编写两种测试：单元测试和集成测试。

SeaORM 的设计便于测试：核心 API 是一个门面，在编译时不需要数据库后端。这意味着你可以将 Entity 和模型作为普通的 Rust 类型引入，并在单元测试中使用它们。你甚至可以在高级测试中针对 mock 数据库运行查询，而无需启动数据库后端。

## 逻辑测试

举一个小例子，假设我们有一个 Entity：

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

你可以为此 Entity 周围的逻辑编写单元测试：

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

这可以在纯 crate 中完成，无需 `tokio` 或 `sqlx` 依赖。
这些 Entity 将与你在数据库交互中使用的完全相同。
