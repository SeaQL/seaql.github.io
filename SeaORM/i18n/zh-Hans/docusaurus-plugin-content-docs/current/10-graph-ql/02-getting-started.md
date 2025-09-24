# 入门

此示例可在 [SeaORM + Seaography 示例](https://github.com/SeaQL/sea-orm/tree/master/examples/seaography_example) 中找到。

![](https://raw.githubusercontent.com/SeaQL/sea-orm/master/examples/seaography_example/Seaography%20example.png)

要开始使用，你只需要一个带有模式的实时 SQL 数据库。你可以通过编写 SeaORM 迁移在 Rust 中编写所有代码，或者使用 GUI 工具（例如 [DataGrip](https://www.jetbrains.com/datagrip/)）设计模式。

## 安装 Seaography CLI

```sh
cargo install seaography-cli@^1.1.0```

## 生成 Seaography 实体

```sh
sea-orm-cli generate entity --output-dir graphql/src/entities --seaography
```

像往常一样使用 `sea-orm-cli` 生成实体，但需要添加一个额外的 `--seaography` 标志。这些实体基本上是旧的 SeaORM 实体，但带有一个额外的 `RelatedEntity` 枚举。

```rust title="examples/seaography_example/graphql/src/entities/cake.rs"
use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq)]
#[sea_orm(table_name = "cake")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
    #[sea_orm(column_type = "Decimal(Some((16, 4)))")]
    pub price: Decimal,
    pub bakery_id: i32,
    pub gluten_free: i8,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::bakery::Entity",
        from = "Column::BakeryId",
        to = "super::bakery::Column::Id",
        on_update = "Cascade",
        on_delete = "Cascade"
    )]
    Bakery,
    #[sea_orm(has_many = "super::cake_baker::Entity")]
    CakeBaker,
}

impl Related<super::bakery::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Bakery.def()
    }
}

impl Related<super::cake_baker::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::CakeBaker.def()
    }
}

impl Related<super::baker::Entity> for Entity {
    fn to() -> RelationDef {
        super::cake_baker::Relation::Baker.def()
    }
    fn via() -> Option<RelationDef> {
        Some(super::cake_baker::Relation::Cake.def().rev())
    }
}

impl ActiveModelBehavior for ActiveModel {}

// 暴露给 Seaography 的额外模式元数据
+ #[derive(Copy, Clone, Debug, EnumIter, DeriveRelatedEntity)]
+ pub enum RelatedEntity {
+     #[sea_orm(entity = "super::bakery::Entity")]
+     Bakery,
+     #[sea_orm(entity = "super::cake_baker::Entity")]
+     CakeBaker,
+     #[sea_orm(entity = "super::baker::Entity")]
+     Baker,
+ }
```

## 生成 GraphQL 项目

生成一个全新的项目是启动 GraphQL 服务器最简单的方法。
然而，Seaography 可以轻松集成到使用任何 Web 框架构建的现有 Web 服务器中。

Seaography 开箱即用地支持 Poem、Actix 和 Axum。

运行以下命令：

```sh
seaography-cli graphql graphql/src/entities $DATABASE_URL sea-orm-seaography-example
```

完整帮助：

```sh
🧭 SeaORM 的动态 GraphQL 框架

用法：seaography-cli [OPTIONS] <DESTINATION> <ENTITIES> <DATABASE_URL> <CRATE_NAME>

参数：
  <DESTINATION>   项目目标文件夹
  <ENTITIES>      SeaORM 实体文件夹
  <DATABASE_URL>  要写入 .env 的数据库 URL
  <CRATE_NAME>    生成项目的 crate 名称

选项：
  -f, --framework <FRAMEWORK>
          要使用的 Web 框架 [默认值: poem] [可能的值: actix, poem, axum]
      --depth-limit <DEPTH_LIMIT>
          GraphQL 深度限制
      --complexity-limit <COMPLEXITY_LIMIT>
          GraphQL 复杂度限制
  -h, --help
          打印帮助信息
  -V, --version
          打印版本信息
```

## 启动服务器

```sh
cd graphql
cargo run
```

你当然可以自由修改项目以满足你的需求。
有趣的部分从 `query_root.rs` 中的 `seaography::register_entities!` 宏开始。
你可以向 GraphQL 模式添加自定义实体、查询和突变。

## 运行一些查询

```sh
访问 GraphQL Playground：http://localhost:8000
```

导航到 GraphQL Playground，然后开始运行一些查询！

### 面包店 -> 蛋糕 -> 烘焙师

```graphql
{
  bakery(pagination: { page: { limit: 10, page: 0 } }, orderBy: { name: ASC }) {
    nodes {
      name
      cake {
        nodes {
          name
          price
          baker {
            nodes {
              name
            }
          }
        }
      }
    }
  }
}
```

### 列出无麸质蛋糕并了解在哪里购买

```graphql
{
  cake(filters: { glutenFree: { eq: 1 } }) {
    nodes {
      name
      price
      glutenFree
      bakery {
        name
      }
    }
  }
}