# DataLoader

Seaography uses [async_graphql::dataloader](https://docs.rs/async-graphql/latest/async_graphql/dataloader/index.html) in querying nested objects to tackle the N+1 problem.

Consider the following GraphQL query:

```graphql
{
  film(
    pagination: { limit: 3, page: 0 }
    filters: { releaseYear: { gte: "2006" } }
    orderBy: { title: ASC }
  ) {
    data {
      filmId
      title
      description
      releaseYear
      filmActor {
        actor {
          actorId
          firstName
          lastName
        }
      }
    }
    pages
    current
  }
}
```

Behind the scene, the following SQL were queried:

```sql
SELECT "film"."film_id",
       "film"."title",
       "film"."description",
       "film"."release_year",
       "film"."language_id",
       "film"."original_language_id",
       "film"."rental_duration",
       "film"."rental_rate",
       "film"."length",
       "film"."replacement_cost",
       "film"."rating",
       "film"."special_features",
       "film"."last_update"
FROM "film"
WHERE "film"."release_year" >= '2006'
ORDER BY "film"."title" ASC
LIMIT 3 OFFSET 0

SELECT "film_actor"."actor_id", "film_actor"."film_id", "film_actor"."last_update"
FROM "film_actor"
WHERE "film_actor"."film_id" IN (1, 3, 2)

SELECT "actor"."actor_id", "actor"."first_name", "actor"."last_name", "actor"."last_update"
FROM "actor"
WHERE "actor"."actor_id" IN (24, 162, 20, 160, 1, 188, 123, 30, 53, 40, 2, 64, 85, 198, 10, 19, 108, 90)
```

Take `film_actor` as an example, we want to fetch `film_actor` with ID `(1, 3, 2)` from the database. We give the ID to `DataLoader`, it has two purposes - it tells `DataLoader` which rows to be fetched, and, as a unique ID to determine the caller and therefore the proper receiver of the query result.

```rust
pub struct FilmActorFK(pub sea_orm::Value);

// film::Model
impl Model {
    pub async fn FilmActor<'a>(
        &self,
        ctx: &async_graphql::Context<'a>,
    ) -> Option<Vec<super::film_actor::Model>> {
        let data_loader = ctx
            .data::<async_graphql::dataloader::DataLoader<crate::OrmDataloader>>()
            .unwrap();

        let from_column: super::film::Column = // ...

        let key = FilmActorFK(self.get(from_column));

        let data: Option<_> = data_loader.load_one(key) // Batch querying with foreign keys
            .await
            .unwrap();

        data
    }
}
```

Inside the `DataLoader`, it will execute the select in batch. Then, return a hashmap with ID as the key. This allow us to associate the query result with the receiver thus return the corresponding result to the proper receiver.

```rust
#[async_trait::async_trait]
impl async_graphql::dataloader::Loader<FilmActorFK> for crate::OrmDataloader {
    type Value = Vec<super::film_actor::Model>;
    type Error = std::sync::Arc<sea_orm::error::DbErr>;

    async fn load(
        &self,
        keys: &[FilmActorFK],
    ) -> Result<std::collections::HashMap<FilmActorFK, Self::Value>, Self::Error> {
        let key_values: Vec<_> = keys
            .into_iter()
            .map(|key| key.0.to_owned())
            .collect();

        let to_column: super::film_actor::Column = // ...

        let data: std::collections::HashMap<FilmActorFK, Self::Value> = super::film_actor::Entity::find()
            .filter(to_column.is_in(key_values)) // Filter by a batch of foreign keys
            .all(&self.db)
            .await?
            .into_iter()
            .map(|model| {
                let key = FilmActorFK(model.get(to_column));
                (key, model) // Collect rows into a hashmap with foreign key as the key
            })
            .into_group_map();

        Ok(data)
    }
}
```
