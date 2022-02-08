# Schema Management

If you already have a database with tables and data, you can skip this section.

If you are starting from a fresh database, it's actually better to version control your database schema with a migration tool.

We are still developing SeaORM's schema management utility, so for now you can use SQLx's [`sqlx-cli`](https://crates.io/crates/sqlx-cli).

```shell
$ cargo install sqlx-cli
```

Set `DATABASE_URL` in your environment, or create a `.env` file in your project root. Specify your database connection.

```env title=".env"
DATABASE_URL=sql://username:password@localhost/database
```

Create a new `.sql` file.

```shell
$ sqlx migrate add <name>
```

Run migrations.

```shell
$ sqlx migrate run
```