# Custom Union

You can create complex enums in Rust and they will be mapped to unions in GraphQL.

```rust
#[derive(Clone, CustomInputType, CustomOutputType)]
pub enum Shape {
    Rectangle(Rectangle),
    Circle(Circle),
    Triangle(Triangle),
}

#[derive(Clone, CustomInputType, CustomOutputType)]
pub struct Rectangle {
    pub origin: Point,
    pub size: Size,
}

#[derive(Clone, CustomInputType, CustomOutputType)]
pub struct Circle {
    pub center: Point,
    pub radius: f64,
}

#[derive(Clone, CustomInputType, CustomOutputType)]
pub struct Triangle {
    pub p1: Point,
    pub p2: Point,
    pub p3: Point,
}

#[derive(Clone, Copy, CustomInputType, CustomOutputType)]
pub struct Point {
    pub x: f64,
    pub y: f64,
}

#[derive(Clone, Copy, CustomInputType, CustomOutputType)]
pub struct Size {
    pub width: f64,
    pub height: f64,
}
```

The GraphQL schema will look like the following:

```graphql
union Shape = Rectangle | Circle | Triangle

type Rectangle {
  origin: Point!
  size: Size!
}

input RectangleInput {
  origin: PointInput!
  size: SizeInput!
}

type Circle {
  center: Point!
  radius: Float!
}

input CircleInput {
  center: PointInput!
  radius: Float!
}

type Triangle {
  p1: Point!
  p2: Point!
  p3: Point!
}

input TriangleInput {
  p1: PointInput!
  p2: PointInput!
  p3: PointInput!
}

type Point {
  x: Float!
  y: Float!
}

input PointInput {
  x: Float!
  y: Float!
}

type Size {
  width: Float!
  height: Float!
}

input SizeInput {
  width: Float!
  height: Float!
}
```

We can add a simple endpoint:

```rust
#[CustomFields]
impl Operations {
    async fn echo_shape(shape: Shape) -> async_graphql::Result<Shape> {
        Ok(shape)
    }
}
```

Try a query:

```graphql
{
  echo_shape(
    shape: {
      Rectangle: {
        origin: { x: 3, y: 12 },
        size: { width: 20, height: 10},
      }
    }
  ) {
    __typename
    ... on Rectangle {
      origin { x y }
      size { width height }
    }
  }
}
```

Returns:

```json
{
  "echo_shape": {
    "__typename": "Rectangle",
    "origin": {
      "x": 3.0,
      "y": 12.0
    },
    "size": {
      "height": 10.0,
      "width": 20.0
    }
  }
}
```