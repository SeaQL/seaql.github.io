# New Type

You can define a New Type (`T`) and use it as model field. The following traits have to be implemented.

1. Implement `From<T>` for [`sea_query::Value`](https://docs.rs/sea-query/*/sea_query/value/enum.Value.html)
2. Implement [`sea_orm::TryGetable`](https://docs.rs/sea-orm/*/sea_orm/trait.TryGetable.html) for `T`
3. Implement [`sea_query::ValueType`](https://docs.rs/sea-query/*/sea_query/value/trait.ValueType.html) for `T`
4. Implement [`sea_query::Nullable`](https://docs.rs/sea-query/*/sea_query/value/trait.Nullable.html) for `T`

## Wrapper Type

You can create new types wrapping any type supported by SeaORM.

```rust
use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "custom_value_type")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub number: Integer,
}

#[derive(Clone, Debug, PartialEq, Eq, DeriveValueType)]
pub struct Integer(i32);
```

<details>
    <summary>Which `Integer` expands to:</summary>

```rust
#[automatically_derived]
impl std::convert::From<Integer> for sea_orm::Value {
    fn from(source: Integer) -> Self {
        source.0.into()
    }
}

#[automatically_derived]
impl sea_orm::TryGetable for Integer {
    fn try_get_by<I: sea_orm::ColIdx>(res: &sea_orm::QueryResult, idx: I)
        -> std::result::Result<Self, sea_orm::TryGetError> {
        <i32 as sea_orm::TryGetable>::try_get_by(res, idx).map(|v| Integer(v))
    }
}

#[automatically_derived]
impl sea_orm::sea_query::ValueType for Integer {
    fn try_from(v: sea_orm::Value) -> std::result::Result<Self, sea_orm::sea_query::ValueTypeErr> {
        <i32 as sea_orm::sea_query::ValueType>::try_from(v).map(|v| Integer(v))
    }

    fn type_name() -> std::string::String {
        stringify!(Integer).to_owned()
    }

    fn array_type() -> sea_orm::sea_query::ArrayType {
        sea_orm::sea_query::ArrayType::Int
    }

    fn column_type() -> sea_orm::sea_query::ColumnType {
        sea_orm::sea_query::ColumnType::Integer
    }
}

#[automatically_derived]
impl sea_orm::sea_query::Nullable for Integer {
    fn null() -> sea_orm::Value {
        <i32 as sea_orm::sea_query::Nullable>::null()
    }
}
```
</details>

### Using wrapped types as primary keys

:::tip Since `2.0.0`
:::

```rust
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "custom_value_type")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: Integer,
}
```

Only for `i8` / `i16` / `i32` / `i64` / `u8` / `u16` / `u32` / `u64`.

## Wrapping `Vec<T>` (Postgres only)

```rust
use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "custom_vec_type")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub str_vec: StringVec,
}

#[derive(Clone, Debug, PartialEq, Eq, DeriveValueType)]
pub struct StringVec(pub Vec<String>);
```

<details>
    <summary>Which `StringVec` expands to:</summary>

```rust
#[automatically_derived]
impl std::convert::From<StringVec> for Value {
    fn from(source: StringVec) -> Self {
        source.0.into()
    }
}

#[automatically_derived]
impl sea_orm::TryGetable for StringVec {
    fn try_get_by<I: sea_orm::ColIdx>(res: &QueryResult, idx: I) -> Result<Self, sea_orm::TryGetError> {
        <Vec<String> as sea_orm::TryGetable>::try_get_by(res, idx).map(|v| StringVec(v))
    }
}

#[automatically_derived]
impl sea_orm::sea_query::ValueType for StringVec {
    fn try_from(v: Value) -> Result<Self, sea_orm::sea_query::ValueTypeErr> {
        <Vec<String> as sea_orm::sea_query::ValueType>::try_from(v).map(|v| StringVec(v))
    }

    fn type_name() -> String {
        stringify!(StringVec).to_owned()
    }

    fn array_type() -> sea_orm::sea_query::ArrayType {
        sea_orm::sea_query::ArrayType::String
    }

    fn column_type() -> sea_orm::sea_query::ColumnType {
        sea_orm::sea_query::ColumnType::String(StringLen::None)
    }
}

#[automatically_derived]
impl sea_orm::sea_query::Nullable for Integer {
    fn null() -> sea_orm::Value {
        <Vec<String> as sea_orm::sea_query::Nullable>::null()
    }
}
```
</details>

## Wrapping `Vec<T>` (backend generic)

You can also define a backend-generic `Vec<T>` field by serialize / deserialize the object to / from JSON:

```rust
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "json_vec_type")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub json_vec: ObjectVec,
}

#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize, FromJsonQueryResult)]
pub struct ObjectVec(pub Vec<MyObject>);

#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct MyObject {
    ..
}
```

<details>
    <summary>Which `ObjectVec` expands to:</summary>

```rust
impl sea_orm::TryGetableFromJson for ObjectVec {}

impl std::convert::From<ObjectVec> for sea_orm::Value {
    fn from(source: ObjectVec) -> Self {
        sea_orm::Value::Json(serde_json::to_value(&source).ok().map(|s| std::boxed::Box::new(s)))
    }
}

impl sea_orm::sea_query::ValueType for ObjectVec {
    fn try_from(v: sea_orm::Value) -> Result<Self, sea_orm::sea_query::ValueTypeErr> {
        match v {
            sea_orm::Value::Json(Some(json)) => Ok(
                serde_json::from_value(*json).map_err(|_| sea_orm::sea_query::ValueTypeErr)?,
            ),
            _ => Err(sea_orm::sea_query::ValueTypeErr),
        }
    }

    fn type_name() -> String {
        stringify!(ObjectVec).to_owned()
    }

    fn array_type() -> sea_orm::sea_query::ArrayType {
        sea_orm::sea_query::ArrayType::Json
    }

    fn column_type() -> sea_orm::sea_query::ColumnType {
        sea_orm::sea_query::ColumnType::Json
    }
}

impl sea_orm::sea_query::Nullable for ObjectVec {
    fn null() -> sea_orm::Value {
        sea_orm::Value::Json(None)
    }
}
```
</details>

## Enum String

Since `1.1.8`, `DeriveValueType` also supports `enum` types. It offers a simpler alternative to `DeriveActiveEnum` for client-side enums backed by string database types.

```rust
#[derive(DeriveValueType)]
#[sea_orm(value_type = "String")]
pub enum Tag {
    Hard,
    Soft,
}

// `from_str` defaults to `std::str::FromStr::from_str`
impl std::str::FromStr for Tag {
    type Err = sea_orm::sea_query::ValueTypeErr;
    fn from_str(s: &str) -> Result<Self, Self::Err> { .. }
}

// `to_str` defaults to `std::string::ToString::to_string`.
impl std::fmt::Display for Tag {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result { .. }
}
```

<details>
    <summary>Which `Tag` expands to:</summary>

```rust
#[automatically_derived]
impl std::convert::From<Tag> for sea_orm::Value {
    fn from(source: Tag) -> Self {
        std::string::ToString::to_string(&source).into()
    }
}

#[automatically_derived]
impl sea_orm::TryGetable for Tag {
    fn try_get_by<I: sea_orm::ColIdx>(res: &sea_orm::QueryResult, idx: I)
        -> std::result::Result<Self, sea_orm::TryGetError> {
        let string = String::try_get_by(res, idx)?;
        std::str::FromStr::from_str(&string).map_err(|err| sea_orm::TryGetError::DbErr(sea_orm::DbErr::Type(format!("{err:?}"))))
    }
}

#[automatically_derived]
impl sea_orm::sea_query::ValueType for Tag {
    fn try_from(v: sea_orm::Value) -> std::result::Result<Self, sea_orm::sea_query::ValueTypeErr> {
        let string = <String as sea_orm::sea_query::ValueType>::try_from(v)?;
        std::str::FromStr::from_str(&string).map_err(|_| sea_orm::sea_query::ValueTypeErr)
    }

    fn type_name() -> std::string::String {
        stringify!(Tag).to_owned()
    }

    fn array_type() -> sea_orm::sea_query::ArrayType {
        sea_orm::sea_query::ArrayType::String
    }

    fn column_type() -> sea_orm::sea_query::ColumnType {
        sea_orm::sea_query::ColumnType::String(sea_orm::sea_query::StringLen::None)
    }
}

#[automatically_derived]
impl sea_orm::sea_query::Nullable for Tag {
    fn null() -> sea_orm::Value {
        sea_orm::Value::String(None)
    }
}
```
</details>

You can override `from_str` and `to_str` with custom functions, which is especially useful if you're using [`strum::Display`](https://docs.rs/strum/latest/strum/derive.Display.html) and [`strum::EnumString`](https://docs.rs/strum/latest/strum/derive.EnumString.html), or manually implemented methods:

```rust
#[derive(DeriveValueType)]
#[sea_orm(value_type = "String", from_str = "Tag::from_str", to_str = "Tag::to_str")]
pub enum Tag {
    Color,
    Grey,
}

impl Tag {
    fn from_str(s: &str) -> Result<Self, ValueTypeErr> { .. }

    fn to_str(&self) -> &'static str { .. }
}
```