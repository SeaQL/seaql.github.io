# Nginx

You can serve the admin panel through Nginx.

First build the frontend artifact.

```sh
cd sea-orm-pro

# Install dependency
npm install

# Run frontend in development mode
# Visit admin at `http://localhost:8085/`
npm run dev

# Build frontend artifact
npm run build

# Copy frontend artifact to backend and serve statically
...
```

Then start the backend server.

```sh
cd sea-orm-pro

cargo run start
```

Finally proxy request to the backend server with Nginx.

```
server {
    root /var/www/sea-orm-pro/;

    server_name sea-orm-pro.sea-ql.org;

    location / {
        proxy_pass  http://127.0.0.1:8086;
    }

    listen 80;
}
```
