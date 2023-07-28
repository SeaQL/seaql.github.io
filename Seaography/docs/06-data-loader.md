# DataLoader

TODO

<!--
Seaography uses [async_graphql::dataloader](https://docs.rs/async-graphql/latest/async_graphql/dataloader/index.html) in querying nested objects to tackle the N+1 problem.
-->

Consider the following GraphQL query:

```graphql
{
  film(
    pagination: { page: { limit: 3, page: 0 } }
    filters: { releaseYear: { eq: 2006 } }
    orderBy: { title: ASC }
  ) {
    nodes {
      title
      description
      releaseYear
      actor {
        nodes {
          firstName
          lastName
        }
      }
    }
  }
}
```

Behind the scene, the following SQL were queried:

```sql
SELECT
  `film`.`film_id`,
  `film`.`title`,
  `film`.`description`,
  `film`.`release_year`,
  `film`.`language_id`,
  `film`.`original_language_id`,
  `film`.`rental_duration`,
  `film`.`rental_rate`,
  `film`.`length`,
  `film`.`replacement_cost`,
  `film`.`rating`,
  `film`.`special_features`,
  `film`.`last_update`
FROM
  `film`
WHERE
  `film`.`release_year` = ?
ORDER BY
  `film`.`title` ASC
LIMIT
  ? OFFSET ?

SELECT
  `actor`.`actor_id`,
  `actor`.`first_name`,
  `actor`.`last_name`,
  `actor`.`last_update`
FROM
  `actor`
  INNER JOIN `film_actor` ON `film_actor`.`actor_id` = `actor`.`actor_id`
  INNER JOIN `film` ON `film`.`film_id` = `film_actor`.`film_id`
WHERE
  `film`.`film_id` = ?
  AND (TRUE)
```
