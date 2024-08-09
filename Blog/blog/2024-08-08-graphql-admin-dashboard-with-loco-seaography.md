---
slug: 2024-08-08-graphql-admin-dashboard-with-loco-seaography
title: GraphQL based Admin Dashboard with Loco and Seaography
author: Billy Chan
author_title: SeaQL Team
author_url: https://github.com/billy1624
author_image_url: https://avatars.githubusercontent.com/u/30400950?v=4
image: https://www.sea-ql.org/blog/img/Loco%20x%20SeaORM.png
tags: [news]
---

<img src="/blog/img/Loco%20x%20SeaORM.png" />

In this tutorial, we would develop a GraphQL based admin dashboard with [Seaography](https://github.com/SeaQL/seaography) and Loco.

Read our first and second tutorial of the series, [Getting Started with Loco & SeaORM](https://www.sea-ql.org/blog/2024-05-28-getting-started-with-loco-seaorm/), [Adding GraphQL Support to Loco with Seaography](https://www.sea-ql.org/blog/2024-07-01-graphql-support-with-loco-seaography/), if you haven't.

The full source code can be found [here](https://github.com/SeaQL/sea-orm/tree/master/examples/react_admin).

## What is Seaography

Seaography is a GraphQL framework for building GraphQL resolvers using SeaORM entities. It ships with a CLI tool that can generate ready-to-compile Rust GraphQL servers from existing MySQL, Postgres and SQLite databases.

## Setup React-Admin Frontend Boilerplate

We use [`React-Admin`](https://marmelab.com/react-admin/) as the frontend framework. It provides a convenient boilerplate to start with:

```sh
$ npm init react-admin frontend

Select the data provider you want to use, and validate with Enter:
❯ None
  I'll configure the data provider myself.

Select the auth provider you want to use, and validate with Enter:
❯ Hard coded local username/password

Enter the name of a resource you want to add, and validate with Enter (leave empty to finish):
❯ (Leave empty and press Enter)

How do you want to install the dependencies?
❯ Using npm
```

Run the boilerplate then visit [http://localhost:5173/](http://localhost:5173/), you should see the welcome page:

```sh
$ cd frontend

$ npm install

$ npm run dev

> dev
> vite

  VITE v4.5.3  ready in 440 ms

  ➜  Local:   http://localhost:5173/
```

![](<https://www.sea-ql.org/blog/img/Loco x Seaography Dashboard Demo Welcome.png>)

Now, we want to display the `React-Admin` data table template with mock data. First, we need to add `ra-data-json-server` dependency, it provides a ready-to-go mock data loader:

```sh
$ npm install ra-data-json-server
```

To prepare the mock data loader, we create a new file:

```ts title="frontend/src/dataProvider.ts"
import jsonServerProvider from 'ra-data-json-server';

export const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com');
```

Then, we change the UI file:

```diff title="frontend/src/index.tsx"
+ import { Admin, Resource, ListGuesser, ShowGuesser } from 'react-admin';
+ import { dataProvider } from './dataProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
-   <React.StrictMode>
-       <App />
-   </React.StrictMode>
+   <Admin dataProvider={dataProvider}>
+       <Resource name="users" list={ListGuesser} show={ShowGuesser} />
+   </Admin>
);
```

Run the boilerplate now you should see the user listing page:

```sh
$ npm run dev
```

![](<https://www.sea-ql.org/blog/img/Loco x Seaography Dashboard Demo List.png>)

Click on each row to view its detail page.

![](<https://www.sea-ql.org/blog/img/Loco x Seaography Dashboard Demo View.png>)

## Add NPM dependency

Next, we start to integrate our Loco and Seaography backend with React-Admin frontend. We use `axios` for sending POST request to our GraphQL backend:

```sh
$ npm install axios
```

## GraphQL Data Provider

Then, we can start implementing the GraphQL data provider by replacing the content of `dataProvider.ts`:

```diff title="frontend/src/dataProvider.ts"
- import jsonServerProvider from 'ra-data-json-server';
- 
- export const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com');
```

Integrating with our GraphQL endpoint at [http://localhost:3000/api/graphql](http://localhost:3000/api/graphql). We implemented two handler below, one fetch data for the post listing and the other to fetch data for a single post:

```ts title="frontend/src/dataProvider.ts"
import { DataProvider } from "react-admin";
import axios from 'axios';

const apiUrl = 'http://localhost:3000/api/graphql';

export const dataProvider: DataProvider = {
    // Fetch data for post listing
    getList: (resource, params) => {
        // Paginator status
        const { page, perPage } = params.pagination;
        // Sorter status
        const { field, order } = params.sort;

        // POST request to GraphQL endpoint
        return axios.post(apiUrl, {
            query: `
            query {
              notes (
                orderBy: { ${field}: ${order} },
                pagination: { page: { limit: ${perPage}, page: ${page - 1} }}
              ) {
                nodes {
                  id
                  title
                  content
                }
                paginationInfo {
                  pages
                  current
                  offset
                  total
                }
              }
            }
            `
        })
            .then((response) => {
                // Unwrap the response
                const { nodes, paginationInfo } = response.data.data.notes;
                // Return the data array and total number of pages
                return {
                    data: nodes,
                    total: paginationInfo.total,
                };
            });
    },

    // Fetch data for a single post
    getOne: (resource, params) => {
        // POST request to GraphQL endpoint
        return axios.post(apiUrl, {
            query: `
            query {
              notes(filters: {id: {eq: ${params.id}}}) {
                nodes {
                  id
                  title
                  content
                }
              }
            }
            `
        })
            .then((response) => {
                // Unwrap the response
                const { nodes } = response.data.data.notes;
                // Return the one and only data
                return {
                    data: nodes[0],
                };
            });
    },

    getMany: (resource, params) => { },

    getManyReference: (resource, params) => { },

    update: (resource, params) => { },

    updateMany: (resource, params) => { },

    create: (resource, params) => { },

    delete: (resource, params) => { },

    deleteMany: (resource, params) => { },
};
```

## Customize React-Admin Frontend

Replace the React-Admin template frontend with our own custom UI to list all notes from the database.

```diff title="frontend/src/index.tsx"
- ReactDOM.createRoot(document.getElementById('root')!).render(
-    <Admin dataProvider={dataProvider}>
-        <Resource name="users" list={ListGuesser} show={ShowGuesser} />
-    </Admin>
- );
```

Implement the list and details page with specific columns:

```tsx title="frontend/src/index.tsx"
import ReactDOM from 'react-dom/client';
import { Admin, Resource, List, Datagrid, TextField, Show, SimpleShowLayout } from 'react-admin';
import { dataProvider } from './dataProvider';

const PostList = () => (
    <List>
        <Datagrid bulkActionButtons={false}>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="content" />
        </Datagrid>
    </List>
);

const PostShow = () => (
    <Show>
        <SimpleShowLayout>
            <TextField source="id" />
            <TextField source="title" />
            <TextField source="content" />
        </SimpleShowLayout>
    </Show>
);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <Admin dataProvider={dataProvider}>
        <Resource name="posts" list={PostList} show={PostShow} />
    </Admin>
);
```

## Auth Free GraphQL Endpoint

Disabled user authentication on GraphQL POST handler endpoint for convenient:

```diff title="backend/src/controllers/graphql.rs"
async fn graphql_handler(
-   _auth: auth::JWT,
    State(ctx): State<AppContext>,
    req: Request<Body>,
) -> Result<Response> {
    const DEPTH: usize = 1_000;
    const COMPLEXITY: usize = 1_000;
    // Construct the the GraphQL query root
    let schema = query_root::schema(ctx.db.clone(), DEPTH, COMPLEXITY).unwrap();
    // GraphQL handler
    let mut graphql_handler = async_graphql_axum::GraphQL::new(schema);
    // Execute GraphQL request and fetch the results
    let res = graphql_handler.call(req).await.unwrap();

    Ok(res)
}
```

## Put It into Action!

Run the React-Admin frontend:

```sh
$ cd frontend
$ npm run dev
```

Run the Loco backend:

```sh
$ cd backend
$ cargo run start
```

Visit [http://localhost:5173/](http://localhost:5173/), you should see the post listing page:

![](<https://www.sea-ql.org/blog/img/Loco x Seaography Dashboard List.png>)

We are fetching data from the GraphQL backend:

![](<https://www.sea-ql.org/blog/img/Loco x Seaography Dashboard List API.png>)

Click on column header to sort by the column in ascending or descending order:

![](<https://www.sea-ql.org/blog/img/Loco x Seaography Dashboard List Sorted.png>)

Click on each row to view its detail page:

![](<https://www.sea-ql.org/blog/img/Loco x Seaography Dashboard View.png>)

## Conclusion

Adding GraphQL support to Loco application is easy with the help of Seaography. It is an ergonomic library that perfectly integrate with any frontend framework. This tutorial only cover the basic integration of LOco and Seaography including only the querying of data via the GraphQL endpoint. GraphQL mutations are not demonstrated and we leave it for you to code it out!

## SQL Server Support

[SQL Server for SeaORM](https://www.sea-ql.org/SeaORM-X/) is now available as a closed beta. If you are interested`, please signup [here](https://forms.office.com/r/1MuRPJmYBR).

Migrating from `sea-orm` to `sea-orm-x` is straightforward with two simple steps. First, update the existing `sea-orm` dependency to `sea-orm-x` and enable the `sqlz-mssql` feature. Note that you might need to patch SeaORM dependency for the upstream dependencies.

```toml title="Cargo.toml"
sea-orm = { path = "<SEA_ORM_X_ROOT>/sea-orm-x", features = ["runtime-async-std-rustls", "sqlz-mssql"] }
sea-orm-migration = { path = "<SEA_ORM_X_ROOT>/sea-orm-x/sea-orm-migration" }

# Patch SeaORM dependency for the upstream dependencies
[patch.crates-io]
sea-orm = { path = "<SEA_ORM_X_ROOT>/sea-orm-x" }
sea-orm-migration = { path = "<SEA_ORM_X_ROOT>/sea-orm-x/sea-orm-migration" }
```

Second, update the connection string to connect to the MSSQL database.

```sh
# If the schema is `dbo`, simply write:
mssql://username:password@host/database

# Or, specify the schema name by providing an extra `currentSchema` query param.
mssql://username:password@host/database?currentSchema=my_schema

# You can trust peer certificate by providing an extra trustCertificate query param.
mssql://username:password@host/database?trustCertificate=true
```

SeaORM X has full Loco support and integrate seamlessly with many web frameworks:

+ Actix
+ Axum
+ Async GraphQL
+ jsonrpsee
+ Loco
+ Poem
+ Salvo
+ Tonic

Happy Coding!