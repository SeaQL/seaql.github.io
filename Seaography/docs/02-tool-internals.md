# Tool internals

Here we will describe the internals of the CLI tool. Firstly, we will study the tools itself. The tool is separated into 3 distinct sub-crates (`types`, `discovery`, `generator`). Then, we will focus on the generator sub-crate and study the different generator modes.

## Internal crates

The project depends on 3 sub-crates with aim to separate of concern. Doing this allows easier maintenance, extension and debugging.

### `types`

The `types` sub-crate contains all required types and utilities that are shared between the other sub-crates.

* `schema_meta`: holds database metadata (type, version, url), table metadata, and enumeration metadata
* `table_meta`: holds table metadata (name, columns, relations)
* `relationship_meta`: holds tables relationship metadata (source/destination table names, source/destination columns)
* `column_meta`: holds table column metadata (name, type, nullable, is_primary)
* `enum_meta`: holds enumeration metadata (name, values)
* `column_type`: column type enumeration

### `discoverer`

The `discoverer` sub-crate contains all required functions to read any database (sqlite, mysql, pgsql) and convert it to `schema_meta`.

* `lib`: contains the main function that receives database url, check that is correct and exports `schema_meta`
* `utils`: contains all function to convert table crate statements into `schema_meta`
* `mysql`: contains a function that connects to mysql db and returns table create statements
* `sqlite`: contains a function that connects to sqlite db and returns table create statements
* `pgsql`: contains a function that connects to pgsql db and returns table create statements

### `generator`

The `generator` sub-crate contains functions to generate GraphQL compatible entities.

* `toml`: generate rust crate toml specification
* `lib`: generate for main.rs file
* `root_node`: generate GraphQL root node with queries for all entities
* `type_filter`: generate TypeFilter GraphQL type
* `orm_dataloader`: generate OrmDataloader utility type
* `enumeration`: generator for GraphQL enumerations
* `entity`: generator for GraphQL entities (field getters, relationship getters, Filter data type, dataloader load functions)

### CLI tool

The core of the tool, coordinates all sub-crates.

* `main`: the main CLI program
* `lib`: contains functions used from main and are responsible for generating ORM & GraphQL entities

## Generators

The generators are responsible for generating the Rust code. Also, it is the main point where new features are implemented. Currently the project only implements the expanded code generator. A procedural macro based generator is WIP and will depend on the expanded format generator to generate code with fewer lines of code but same functionality.


All examples are based on https://dev.mysql.com/doc/sakila/en/ database.

### Expanded mode

The expanded generator produce all Rust code. Its easier to modify, but harder to maintain and larger surface of code means more bugs.

#### Example entity

```rust
use crate::graphql::*;
pub use crate::orm::category::*;
use sea_orm::prelude::*;
#[async_graphql::Object(name = "Category")]
impl Model {
    pub async fn category_id(&self) -> &u8 {
        &self.category_id
    }
    pub async fn name(&self) -> &String {
        &self.name
    }
    pub async fn last_update(&self) -> &DateTimeUtc {
        &self.last_update
    }
    pub async fn category_film_category<'a>(
        &self,
        ctx: &async_graphql::Context<'a>,
    ) -> Vec<crate::orm::film_category::Model> {
        let data_loader = ctx
            .data::<async_graphql::dataloader::DataLoader<OrmDataloader>>()
            .unwrap();
        let key = CategoryFilmCategoryFK(self.category_id.clone());
        let data: Option<_> = data_loader.load_one(key).await.unwrap();
        data.unwrap_or(vec![])
    }
}
#[derive(async_graphql :: InputObject, Debug)]
#[graphql(name = "CategoryFilter")]
pub struct Filter {
    pub or: Option<Vec<Box<Filter>>>,
    pub and: Option<Vec<Box<Filter>>>,
    pub category_id: Option<TypeFilter<u8>>,
    pub name: Option<TypeFilter<String>>,
    pub last_update: Option<TypeFilter<DateTimeUtc>>,
}
#[derive(Clone, Eq, PartialEq, Hash, Debug)]
pub struct CategoryFilmCategoryFK(u8);
#[async_trait::async_trait]
impl async_graphql::dataloader::Loader<CategoryFilmCategoryFK> for OrmDataloader {
    type Value = Vec<crate::orm::film_category::Model>;
    type Error = std::sync::Arc<sea_orm::error::DbErr>;
    async fn load(
        &self,
        keys: &[CategoryFilmCategoryFK],
    ) -> Result<std::collections::HashMap<CategoryFilmCategoryFK, Self::Value>, Self::Error> {
        let filter = sea_orm::Condition::all().add(sea_orm::sea_query::SimpleExpr::Binary(
            Box::new(sea_orm::sea_query::SimpleExpr::Tuple(vec![
                sea_orm::sea_query::Expr::col(
                    crate::orm::film_category::Column::CategoryId.as_column_ref(),
                )
                .into_simple_expr(),
            ])),
            sea_orm::sea_query::BinOper::In,
            Box::new(sea_orm::sea_query::SimpleExpr::Tuple(
                keys.iter()
                    .map(|tuple| {
                        sea_orm::sea_query::SimpleExpr::Values(vec![tuple.0.clone().into()])
                    })
                    .collect(),
            )),
        ));
        use itertools::Itertools;
        Ok(crate::orm::film_category::Entity::find()
            .filter(filter)
            .all(&self.db)
            .await?
            .into_iter()
            .map(|model| {
                let key = CategoryFilmCategoryFK(model.category_id.clone());
                (key, model)
            })
            .into_group_map())
    }
}
```

#### Example enum

```rust
use crate::orm::sea_orm_active_enums;
use async_graphql::*;
use sea_orm::entity::prelude::*;
#[derive(Debug, Copy, Clone, Eq, PartialEq, EnumIter, DeriveActiveEnum, Enum)]
#[graphql(remote = "sea_orm_active_enums::Rating")]
#[sea_orm(rs_type = "String", db_type = "Enum", enum_name = "Rating")]
pub enum Rating {
    #[sea_orm(string_value = "G")]
    G,
    #[sea_orm(string_value = "PG")]
    Pg,
    #[sea_orm(string_value = "PG-13")]
    Pg13,
    #[sea_orm(string_value = "R")]
    R,
    #[sea_orm(string_value = "NC-17")]
    Nc17,
}
```

### Procedural macro mode
TODO: WIP

Based on https://www.sea-ql.org/SeaORM/docs/generate-entity/entity-structure
