# Development and Release

## Development

You can start a development server to see the code changes in live.

```sh
cd pro_admin_frontend

# Setup
npm install

# Start live development server
npm run dev
```

## Build Release

Create production build and serve it via backend server.

```sh
cd pro_admin_frontend

# Build frontend
npm run build

# Delete old frontend build
rm -rf ../assets/admin

# Copy new frontend build to backend server
cp -r dist ../assets/admin
```
