# Custom Method

In continuation to previous chapter, let's add some custom instance methods onto the types:

```rust
#[CustomFields]
impl Rectangle {
    pub async fn area(&self) -> async_graphql::Result<f64> {
        Ok(self.size.width * self.size.height)
    }
}

#[CustomFields]
impl Circle {
    pub async fn area(&self) -> async_graphql::Result<f64> {
        Ok(std::f64::consts::PI * self.radius * self.radius)
    }
}

#[CustomFields]
impl Triangle {
    pub async fn area(&self) -> async_graphql::Result<f64> {
        let a = self.p1.distance_to(&self.p2);
        let b = self.p2.distance_to(&self.p3);
        let c = self.p3.distance_to(&self.p1);
        let s = (a + b + c) / 2.0;
        Ok((s * (s - a) * (s - b) * (s - c)).sqrt())
    }
}
```

Note that we have to register these types with methods as complex types:

```rust
seaography::register_complex_custom_outputs!(
    builder,
    [types::Rectangle, types::Circle, types::Triangle]
);
```

The GraphQL schema would look like:

```graphql
type Rectangle {
  origin: Point!
  size: Size!
  area: Float! # ⬅ scalar
}

type Circle {
  center: Point!
  radius: Float!
  area: Float! # ⬅ scalar
}

type Triangle {
  p1: Point!
  p2: Point!
  p3: Point!
  area: Float! # ⬅ scalar
}
```

Try a query:

```graphql
{
  echo_shape(
    shape: {
      Circle: {
        center: { x: 3, y: 12 },
        radius: 8
      }
    }
  ) {
    __typename
    ... on Circle {
      center { x y }
      radius
      area # ⬅ addition
    }
  }
}
```

Returns:

```json
{
  "echo_shape": {
    "__typename": "Circle",
    "center": {
      "x": 3.0,
      "y": 12.0
    },
    "radius": 8.0,
    "area": 201.06 // ⬅ computed dynamically!
  }
}
```

Note that the methods are async functions, so you can do database queries inside the function (by requiring a `ctx`).
You can even return a SeaORM Model or Custom Output.