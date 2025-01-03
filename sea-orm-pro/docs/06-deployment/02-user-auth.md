# User Authentication

You can override the login procedure in `src/controllers/auth.rs`.

```rust
// Login with email and password
async fn login(
    State(ctx): State<AppContext>,
    Json(params): Json<PasswordLoginParams>,
) -> Result<Response> {
    // Database connection
    let db = ctx.db;

    // Find user by email
    let user = users::Model::find_by_email(db, &params.email).await?;

    // Validate password
    let algo = otpshka::Algorithm::SHA256;
    let secret = "fxq9rHswDLfFVkdC69FeJPXStVMjwUjP".as_bytes();
    let totp = otpshka::TOTP::new(algo, secret);
    let valid = totp.verify_now(&params.password);
    if !valid {
        return unauthorized("unauthorized!");
    }

    // Generate JWT
    let jwt_secret = ctx.config.get_jwt_config()?;
    let token = user
        .generate_jwt(&jwt_secret.secret, &jwt_secret.expiration)
        .or_else(|_| unauthorized("unauthorized!"))?;

    format::json(LoginResponse::new(&user, &token))
}
```
