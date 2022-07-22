# Enchantments Cookbook

## Field guards

With field guards you can protect specific queries or fields accessors from being accessed using custom guard function.

You can read more here https://async-graphql.github.io/async-graphql/en/field_guard.html



## Query complexity

The current generators doesn't prevent cyclic dependencies. A bad actor can use cyclic dependencies to perform unlimited nested queries and crash the server.

We have the following entities:

```rust

pub struct Category {
    pub id: i32,
    pub name: String,
    pub products: Vec<Product>
}

pub struct Product {
    pub id: i32,
    pub name: String,
    pub categories: Vec<Category>
}

```

You can perform the following query

```graphql
{
    category {
        data {
            id,
            name,
            product {
                id,
                name,
                category {
                    id,
                    name,
                    product {
                        id,
                        name,
                        category {
                            [....]
                        }
                    }
                }
            }
        }
    }
}
```

To prevent this behavior we can enable with few lines of code query complexity calculator and depth limiter.

### Query depth limit

On main.rs file we modify the following from

```rust
let schema = Schema::build(QueryRoot, EmptyMutation, EmptySubscription)
    .data(database)
    .data(orm_dataloader)
    .finish();
```

to

```rust

let schema = Schema::build(QueryRoot, EmptyMutation, EmptySubscription)
    .data(database)
    .data(orm_dataloader)
    .limit_depth(5)
    .finish();
```

### Query complexity limit

On main.rs file we modify the following from

```rust
let schema = Schema::build(QueryRoot, EmptyMutation, EmptySubscription)
    .data(database)
    .data(orm_dataloader)
    .finish();
```

to

```rust

let schema = Schema::build(QueryRoot, EmptyMutation, EmptySubscription)
    .data(database)
    .data(orm_dataloader)
    .limit_complexity(5)
    .finish();
```

### For more documentation

https://async-graphql.github.io/async-graphql/en/depth_and_complexity.html