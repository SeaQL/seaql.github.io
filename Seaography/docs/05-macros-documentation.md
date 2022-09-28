# Macros documentation

## `Filter` derive

The `Filter` derive macro is attached on Sea ORM Models to generate structures and functions that are used by the QueryRoot to provide query functionality on Entities.

### Attributes

```rust
#[sea_orm(table_name = "film")]
```

* table_name: used to supply the macro with the entity name that will be used for the structure names

### Input

```rust
#[derive(
    Clone,
    Debug,
    PartialEq,
    DeriveModel,
    DeriveActiveModel,
    async_graphql::SimpleObject, // Required by Async GraphQL
    seaography::macros::Filter, // The macro
)]
#[sea_orm(table_name = "film")]
#[graphql(complex)] // Used by Relations derive
#[graphql(name = "Film")] // Required by Async GraphQL
pub struct Model {
    pub film_id: u16,
    pub title: String,
    pub rating: Option<Rating>,
    pub last_update: DateTimeUtc,
}
```

### Output

Used to describe complex SQL filters

```rust
#[derive(Debug, async_graphql::InputObject)]
#[graphql(name = "FilmFilter")]
pub struct Filter {
    pub or: Option<Vec<Box<Filter>>>,
    pub and: Option<Vec<Box<Filter>>>,
    pub film_id: Option<seaography::TypeFilter<u16>>,
    pub title: Option<seaography::TypeFilter<String>>,
    // See Enumeration derive
    pub rating: Option<crate::entities::sea_orm_active_enums::RatingEnumFilter>,
    pub last_update: Option<seaography::TypeFilter<DateTimeUtc>>,
}
```

Used to receive a `Filter` struct and convect it into sea_orm::Condition that is applied on sea_orm query statement

```rust
pub fn filter_recursive(root_filter: Option<Filter>) -> sea_orm::Condition {
    ...
}
```

Used to describe order by

```rust
#[derive(Debug, async_graphql::InputObject)]
#[graphql(name = "FilmOrderBy")]
pub struct OrderBy {
    pub film_id: Option<seaography::OrderByEnum>,
    pub title: Option<seaography::OrderByEnum>,
    pub rating: Option<seaography::OrderByEnum>,
    pub last_update: Option<seaography::OrderByEnum>,
}
```

Used to receive a query statement and OrderBy struct and update the statement with desired ordering.

```rust
pub fn order_by(stmt: sea_orm::Select<Entity>, order_by_struct: Option<OrderBy>) -> sea_orm::Select<Entity> {
    ...
}
```

TODO: WIP Cursor pagination structures and functions

## `RelationsCompact` derive

The `RelationsCompact` derive macro is attached on Sea ORM Relation enum to generate structures and functions that are used by the Entity to query related Entities. This derive is applied on Entities in compact form.

### Input

```rust
#[derive(
    Copy,
    Clone,
    Debug,
    EnumIter,
    DeriveRelation,
    seaography::macros::RelationsCompact,
)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::employees::Entity",
        from = "Column::SupportRepId",
        to = "super::employees::Column::EmployeeId",
        on_update = "NoAction",
        on_delete = "NoAction"
    )]
    Employees,
    #[sea_orm(has_many = "super::invoices::Entity")]
    Invoices,
}
```

### Output

The following are implemented for Entity Model:
```rust
// Requires graphql complex flag enabled on Model
#[async_graphql::ComplexObject]
impl Model {
    pub fn employees<'a>(
        &self,
        ctx: &async_graphql::Context<'a>,
    ) -> Option<#return_type>
    {
      ...
    }

    pub fn invoices<'a>(
        &self,
        ctx: &async_graphql::Context<'a>,
    ) -> Option<#return_type>
    {
      // Uses context.dataloader.load::<InvoicesFK>(...) to dispatch query
      ...
    }
}
```

For every enum variant the following things are generated:


```rust
// Used for the context loader
#[derive(Clone, Debug)]
pub struct EmployeesFK(...);

// Implement load fn for Foreign key
#[async_trait::async_trait]
impl async_graphql::dataloader::Loader<EmployeesFK> for crate::OrmDataloader {
    type Value = #return_type;
    type Error = std::sync::Arc<sea_orm::error::DbErr>;

    async fn load(
        &self,
        keys: &[#EmployeesFK],
    ) -> Result<
        std::collections::HashMap<#EmployeesFK, Self::Value>,
        Self::Error
    >
    {
        ...
    }
}
```


## `relation` macro

The `relation` macro is attached on Sea ORM RelationTrait implementation to generate structures and functions that are used by the Entity to query related Entities. This derive is applied on Entities in expanded form.

### Input

```rust
#[seaography::macros::relation]
impl RelationTrait for Relation {
    fn def(&self) -> RelationDef {
        match self {
            Self::Employees => Entity::belongs_to(super::employees::Entity)
                .from(Column::SupportRepId)
                .to(super::employees::Column::EmployeeId)
                .into(),
            Self::Invoices => Entity::has_many(super::invoices::Entity).into(),
        }
    }
}
```

### Output

It produces the same result as `RelationsCompact`

## `EnumFilter` derive

The `EnumFilter` macro is attached on Sea ORM Enum to generate its GraphQL filter struct used on Entities Filters

### Input

```rust
#![doc = "SeaORM Entity. Generated by sea-orm-codegen 0.9.1"]
use sea_orm::entity::prelude::*;
#[derive(
    Debug,
    Clone,
    PartialEq,
    EnumIter,
    DeriveActiveEnum,
    Eq,
    Copy,
    async_graphql::Enum, // Required by GraphQL
    seaography::macros::EnumFilter, // The macro
)]
#[sea_orm(rs_type = "String", db_type = "Enum", enum_name = "rating")]
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

### Output

```rust
#[derive(Debug, async_graphql::InputObject)]
pub struct RatingEnumFilter {
    pub eq: Option<Rating>,
    pub ne: Option<Rating>,
    pub gt: Option<Rating>,
    pub gte: Option<Rating>,
    pub lt: Option<Rating>,
    pub lte: Option<Rating>,
    pub is_in: Option<Vec<Rating>>,
    pub is_not_in: Option<Vec<Rating>>,
    pub is_null: Option<bool>,
}
```

## `QueryRoot` macro

The `QueryRoot` derive macro is used to generate queries for every Entity that is defined through attributes. The query supports filtering, pagination and ordering.

### Attributes

It enables the query for the specified path `Entity` and it also instructs the `QueryRoot` derive where to find the required utilities structures and functions for the generated code.

```rust
#[seaography(entity = "crate::entities::artists")]
```

### Input

```rust
#[derive(Debug, seaography :: macros :: QueryRoot)]
#[seaography(entity = "crate::entities::artists")]
#[seaography(entity = "crate::entities::employees")]
pub struct QueryRoot;
```

### Output

```rust
#[derive(Debug, async_graphql::InputObject)]
pub struct PaginationInput {
    pub limit: usize,
    pub page: usize,
}

#[derive(Debug, async_graphql::SimpleObject)]
#[graphql(concrete(name = "PaginatedArtistsResult", params(crate::entities::artists::Model)))]
#[graphql(concrete(name = "PaginatedEmployeesResult", params(crate::entities::employees::Model)))]
pub struct PaginatedResult<T: async_graphql::ObjectType> {
    pub data: Vec<T>,
    pub pages: usize,
    pub current: usize,
}

#[async_graphql::Object]
impl QueryRoot {
    pub async fn artists<'a>(
      &self,
      ctx: &async_graphql::Context<'a>,
      filters: Option<crate::entities::artists::Filter>,
      pagination: Option<PaginationInput>,
      order_by: Option<crate::entities::artists::OrderBy>,
    ) -> PaginatedResult<crate::entities::artists::Model> {
      ...
    }

    pub async fn employees<'a>(
      &self,
      ctx: &async_graphql::Context<'a>,
      filters: Option<crate::entities::artists::Filter>,
      pagination: Option<PaginationInput>,
      order_by: Option<crate::entities::artists::OrderBy>,
    ) -> PaginatedResult<crate::entities::artists::Model> {
      ...
    }
}
```