# 新类型

你可以定义 New Type（`T`）并将其用作模型字段。需要实现以下特征。

1. 为 [`sea_query::Value`](https://docs.rs/sea-query/*/sea_query/value/enum.Value.html) 实现 `From<T>`
2. 为 `T` 实现 [`sea_orm::TryGetable`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/trait.TryGetable.html)
3. 为 `T` 实现 [`sea_query::ValueType`](https://docs.rs/sea-query/*/sea_query/value/trait.ValueType.html)
4. 为 `T` 实现 [`sea_query::Nullable`](https://docs.rs/sea-query/*/sea_query/value/trait.Nullable.html)

## 包装标量类型

你可以创建包装 SeaORM 支持的任何类型的新类型。

```rust
use sea_orm::entity::prelude::*;

#[sea_orm::model]
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "custom_value_type")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub number: Integer,
}

impl ActiveModelBehavior for ActiveModel {}

#[derive(Clone, Debug, PartialEq, Eq, DeriveValueType)]
pub struct Integer(i32);
```

<details>
    <summary>`Integer` 展开后的内容：</summary>

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

### 使用封装类型作为主键

:::tip 自 `2.0.0` 起
:::

```rust
#[sea_orm::model]
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "custom_value_type")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: Integer,
}

impl ActiveModelBehavior for ActiveModel {}
```

支持 `i8` / `i16` / `i32` / `i64` / `u8` / `u16` / `u32` / `u64` 封装类型。

## 包装 `Vec<T>`（仅 Postgres）

```rust
use sea_orm::entity::prelude::*;

#[sea_orm::model]
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "custom_vec_type")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub str_vec: StringVec,
}

impl ActiveModelBehavior for ActiveModel {}

#[derive(Clone, Debug, PartialEq, Eq, DeriveValueType)]
pub struct StringVec(pub Vec<String>);
```

<details>
    <summary>`StringVec` 展开后的内容：</summary>

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

## 包装 `Vec<T>`（后端通用）

你也可以通过将对象序列化/反序列化为/从 JSON 来包装 `Vec<T>` 字段。这是在数据库间支持数组类型的后端通用方式。

```rust
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[sea_orm::model]
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "json_vec_type")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub json_vec: ObjectVec,
}

impl ActiveModelBehavior for ActiveModel {}

#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize, FromJsonQueryResult)]
pub struct ObjectVec(pub Vec<MyObject>);

#[derive(Clone, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub struct MyObject {
    ..
}
```

<details>
    <summary>`ObjectVec` 展开后的内容：</summary>

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

## 将任意类型视为 JSON

除了包装 `Vec<T>` 之外，`FromJsonQueryResult` 宏还可用于实现 serde 的 `Serialize` 和 `Deserialize` 的任何类型，它们在与数据库交互时会被转换为/从 JSON。

```rust
use sea_orm::FromJsonQueryResult;
use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[sea_orm::model]
#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "json_struct")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub json_value: Metadata,
    pub json_value_opt: Option<Metadata>,
}

impl ActiveModelBehavior for ActiveModel {}

#[derive(Clone, Debug, PartialEq, Serialize, Deserialize, FromJsonQueryResult)]
pub struct Metadata {
    pub id: i32,
    pub name: String,
    pub price: f32,
    pub notes: Option<String>,
}
```

## 枚举字符串

自 `1.1.8` 起，`DeriveValueType` 也支持 `enum` 类型。它为由字符串数据库类型支持的客户端枚举提供了比 `DeriveActiveEnum` 更简单的替代方案。

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
    <summary>`Tag` 展开后的内容：</summary>

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
        std::str::FromStr::from_str(&string).map_err(|err| {
            sea_orm::TryGetError::DbErr(sea_orm::DbErr::TryIntoErr {
                from: "String",
                into: stringify!(#name),
                source: std::sync::Arc::new(err),
            })
        })
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

你可以使用自定义函数覆盖 `from_str` 和 `to_str`，这在你在使用 [`strum::Display`](https://docs.rs/strum/latest/strum/derive.Display.html) 和 [`strum::EnumString`](https://docs.rs/strum/latest/strum/derive.EnumString.html)，或手动实现的方法时特别有用：

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

## 类字符串结构体

自 `2.0.0` 起，`DeriveValueType` 也支持可以转换为字符串和从字符串转换的结构体类型。这与 Enum 字符串完全相同。

```rust
#[derive(Copy, Clone, Debug, PartialEq, Eq, DeriveValueType)]
#[sea_orm(value_type = "String", column_type = "Text")] // override column type
pub struct Tag3 {
    pub i: i64,
}

impl std::fmt::Display for Tag3 {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.i)
    }
}

impl std::str::FromStr for Tag3 {
    type Err = std::num::ParseIntError;

    fn from_str(s: &str) -> Result<Self, Self::Err> {
        let i: i64 = s.parse()?;
        Ok(Self { i })
    }
}
```
