# 多对多

A standout feature of SeaORM is its ability to model many-to-many relationships directly at the Entity level. The intermediate junction table is abstracted away, so traversing an M-N relation feels just like a simple 1-N: a single method call instead of multiple joins.

A many-to-many relation is formed by three tables, where two tables are related via a junction table. As an example, a `Cake` has many `Filling` and `Filling` are shared by many `Cake` via an intermediate entity `CakeFilling`.

## 定义关联

On the `Cake` entity, to define the relation:
1. Add a new field `filling` to the `Model`.
1. Annotate it with `has_many`, and specify the junction table with `via`.

```rust {10,11} title="entity/cake.rs"
#[sea_orm::model]
#[derive(DeriveEntityModel, ..)]
#[sea_orm(table_name = "cake")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
    #[sea_orm(has_one)]
    pub fruit: HasOne<super::fruit::Entity>,
    #[sea_orm(has_many, via = "cake_filling")] // M-N relation with junction
    pub fillings: HasMany<super::filling::Entity>,
}
```

<details>
    <summary>展开后：</summary>

SeaORM 中的 `Relation` 是一个箭头：它有 `from` 和 `to`。`cake_filling::Relation::Cake` 定义 `CakeFilling -> Cake`。调用 [`rev`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/entity/prelude/struct.RelationDef.html#method.rev) 会将其反转为 `Cake -> CakeFilling`。

将其与 `cake_filling::Relation::Filling`（定义 `CakeFilling -> Filling`）链接，得到 `Cake -> CakeFilling -> Filling`。

```rust {4,10} title="entity/cake.rs"
impl Related<super::filling::Entity> for Entity {
    // The final relation is Cake -> CakeFilling -> Filling
    fn to() -> RelationDef {
        super::cake_filling::Relation::Filling.def()
    }

    fn via() -> Option<RelationDef> {
        // The original relation is CakeFilling -> Cake,
        // after `rev` it becomes Cake -> CakeFilling
        Some(super::cake_filling::Relation::Cake.def().rev())
    }
}
```
</details>

同样，在 `Filling` Entity 上：

```rust {8,9} title="entity/cake.rs"
#[sea_orm::model]
#[derive(DeriveEntityModel, ..)]
#[sea_orm(table_name = "filling")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
    #[sea_orm(has_many, via = "cake_filling")]
    pub cakes: HasMany<super::cake::Entity>,
}
```

## 定义中间表

On the `CakeFilling` entity, its `cake_id` attribute is referencing the primary key of `Cake` entity, and its `filling_id` attribute is referencing the primary key of `Filling` entity.

To define the inverse relation:
1. Add two new fields `cake` and `filling` to the `Model`.
1. Define both relations with `belongs_to`.

```rust {9-12} title="entity/cake_filling.rs"
#[sea_orm::model]
#[derive(DeriveEntityModel, ..)]
#[sea_orm(table_name = "cake_filling")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub cake_id: i32,
    #[sea_orm(primary_key, auto_increment = false)]
    pub filling_id: i32,
    #[sea_orm(belongs_to, from = "cake_id", to = "id")]
    pub cake: Option<super::cake::Entity>,
    #[sea_orm(belongs_to, from = "filling_id", to = "id")]
    pub filling: Option<super::filling::Entity>,
}
```

<details>
    <summary>展开后：</summary>

```rust
#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::cake::Entity",
        from = "Column::CakeId",
        to = "super::cake::Column::Id"
    )]
    Cake,
    #[sea_orm(
        belongs_to = "super::filling::Entity",
        from = "Column::FillingId",
        to = "super::filling::Column::Id"
    )]
    Filling,
}
```
</details>

## 代码生成的限制

通常，`Related` trait 的实现会自动生成。但是，如果存在多个指向同一相关 Entity 的关系，则不会生成。

关系枚举成员仍会生成，因此可以在 join 中使用。

```rust
#[sea_orm::model]
#[derive(DeriveEntityModel, ..)]
#[sea_orm(table_name = "cake_with_many_fruits")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub fruit_id1: i32,
    pub fruit_id2: i32,
    #[sea_orm(belongs_to, relation_enum = "Fruit1", from = "fruit_id1", to = "id")]
    pub fruit_1: HasOne<super::fruit::Entity>,
    #[sea_orm(belongs_to, relation_enum = "Fruit2", from = "fruit_id2", to = "id")]
    pub fruit_2: HasOne<super::fruit::Entity>,
}

// expands to:

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(belongs_to = ..)]
    Fruit1,
    #[sea_orm(belongs_to = ..)]
    Fruit2,
}
```

The solution is to define relations with the `Linked` which will be described in the next chapter.
