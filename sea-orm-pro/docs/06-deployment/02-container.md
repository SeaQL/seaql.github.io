# Container

This guide outline the process of building an image for deploying to containerized environments, e.g. Kubernetes.

Here we start from Debian 12.

```Dockerfile
FROM rust:1.81-bookworm AS build

WORKDIR /app

# Copy the source tree
COPY . ./

# Build release
RUN cargo build --release

###############################################################

FROM debian:bookworm-slim

ENV RUST_LOG=info

WORKDIR /app

COPY --from=build /app/target/release/sea-orm-pro-backend-cli /app
COPY config /app/config
COPY pro_admin /app/pro_admin
COPY assets /app/assets
COPY db.sqlite /app

CMD ["/app/sea-orm-pro-backend-cli", "start"]
```