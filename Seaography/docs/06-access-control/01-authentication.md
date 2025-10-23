# Authentication

No matter which web framework you are using, authentication should be well-supported. You can follow their documentation for instructions.

The relevant function is the graphql handler, in which you can add JWT handling:

#### Axum

```rust
async fn graphql_handler(State(schema): State<Schema>, req: GraphQLRequest) -> GraphQLResponse {
    let req = req.into_inner();
    schema.execute(req).await.into()
}
```

#### Poem

```rust
#[handler]
async fn graphql_handler(schema: Data<&Schema>, req: GraphQLRequest) -> GraphQLResponse {
    let req = req.0;
    schema.execute(req).await.into()
}
```

#### Actix

```rust
async fn graphql_handler(schema: web::Data<Schema>, req: GraphQLRequest) -> GraphQLResponse {
    schema.execute(req.into_inner()).await.into()
}
```

#### Loco

```rust
async fn graphql_handler(State(ctx): State<AppContext>, req: GraphQLRequest)
    -> Result<async_graphql_axum::GraphQLResponse, (axum::http::StatusCode, &'static str)> {
    let schema: Schema = ctx.shared_store.get()?;
    schema.execute(req.into_inner()).await.into()
}
```

## Resolver Context

After verifying the user's identity, you should inject it to the resolver context:

```rust
async fn graphql_handler(token: Jwt, ..) -> Result<..> {
    let user_id = verify_jwt_and_get_user_id(token);

    let mut req = req.into_inner();
    req = req.data(seaography::UserContext { user_id });

    schema.execute(req).await.into()
}
```

This session context can then be used in the resolver, including your custom queries / mutations.