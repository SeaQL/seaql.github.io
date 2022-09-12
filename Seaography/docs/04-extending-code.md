# Extending generated code

When we are done generating the code we can then modify the Rust code based on our needs.

## Introduction

In order to extend the existing code first you need to be comfortable with the libraries the generated code depends on.

* [async_graphql](https://github.com/async-graphql/async-graphql)
* [sea_orm](https://github.com/SeaQL/sea-orm)
* [poem](https://github.com/poem-web/poem)

Studying the generated code structure provides valuable information on where to find important features, for more info [here](/docs/generated-project-structure).

When you are comfortable enough with all the terms, you can jump into the folders and add new features or logic based on your objectives.

## Major features

Bellow there are some important features you might need:

### Field guards

With field guards you can protect specific queries or fields accessors from being accessed using custom guard function.

You can read more here https://async-graphql.github.io/async-graphql/en/field_guard.html


### Query complexity and depth

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

#### Query depth limit

On .env change the line from this:

```
# DEPTH_LIMIT=
```

to this:


```
DEPTH_LIMIT=2 # depth limit number
```

#### Query depth limit

On .env change the line from this:

```
# COMPLEXITY_LIMIT=
```

to this:


```
COMPLEXITY_LIMIT=32 # complexity limit number
```

#### More documentation

https://async-graphql.github.io/async-graphql/en/depth_and_complexity.html