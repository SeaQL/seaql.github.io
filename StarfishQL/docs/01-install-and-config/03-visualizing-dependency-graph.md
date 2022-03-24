# Visualizing Dependency Graph

With a populated database and a working query engine, it's time for some visualization.

## Serve the application locally

```sh
# starfish-ql/freeport/frontend
npm install
npm start
```

The server will run at [http://localhost:8080/](http://localhost:8080/).

## Bundle the application

```sh
# starfish-ql/freeport/frontend
npm run build
```

The application will be bundled with [webpack.js](https://webpack.js.org/) into `starfish-ql/freeport/frontend/dist`.
