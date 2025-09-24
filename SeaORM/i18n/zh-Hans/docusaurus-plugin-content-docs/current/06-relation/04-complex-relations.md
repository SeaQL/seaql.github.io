# 复杂关系

## 链接

`Related` trait 是我们在实体关系图上绘制的箭头（1-1、1-N、M-N）的表示。[`Linked`](https://docs.rs/sea-orm/*/sea_orm/entity/trait.Linked.html) 由关系链组成，在以下情况下很有用：

1. 一对实体之间存在多个连接路径，导致无法实现 `Related`
2. 在关系查询中跨多个实体进行连接

实现 `Linked` trait 是完全可选的，因为 SeaORM 中还有其他进行关系查询的方法，这将在后面的章节中解释。
实现 `Linked` 后，可以使用多个 `find_*_linked` 辅助方法，并且可以在一个地方定义关系。

### 定义链接

以 [此](https://github.com/SeaQL/sea-orm/blob/1.1.x/src/tests_cfg/entity_linked.rs) 为例，我们通过中间 `cake_filling` 表连接蛋糕和馅料。

```rust title="entity/links.rs"
pub struct CakeToFilling;

impl Linked for CakeToFilling {
    type FromEntity = cake::Entity;

    type ToEntity = filling::Entity;

    fn link(&self) -> Vec<RelationDef> {
        vec![
            cake_filling::Relation::Cake.def().rev(),
            cake_filling::Relation::Filling.def(),
        ]
    }
}
```

或者，`RelationDef` 可以在运行时定义，以下内容与上述内容等效：

```rust
pub struct CakeToFilling;

impl Linked for CakeToFilling {
    type FromEntity = cake::Entity;

    type ToEntity = filling::Entity;

    fn link(&self) -> Vec<RelationDef> {
        vec![
            cake_filling::Relation::Cake.def().rev(),
            cake_filling::Entity::belongs_to(filling::Entity)
                .from(cake_filling::Column::FillingId)
                .to(filling::Column::Id)
                .into(),
        ]
    }
}
```

### 延迟加载

使用 [`find_linked`](https://docs.rs/sea-orm/*/sea_orm/entity/prelude/trait.ModelTrait.html#method.find_linked) 方法查找可以填充到蛋糕中的馅料。

```rust
let cake_model = cake::Model {
    id: 12,
    name: "".to_owned(),
};

assert_eq!(
    cake_model
        .find_linked(cake::CakeToFilling)
        .build(DbBackend::MySql)
        .to_string(),
    [
        "SELECT `filling`.`id`, `filling`.`name`, `filling`.`vendor_id`",
        "FROM `filling`",
        "INNER JOIN `cake_filling` AS `r0` ON `r0`.`filling_id` = `filling`.`id`",
        "INNER JOIN `cake` AS `r1` ON `r1`.`id` = `r0`.`cake_id`",
        "WHERE `r1`.`id` = 12",
    ]
    .join(" ")
);
```

### 急切加载

[`find_also_linked`](https://docs.rs/sea-orm/*/sea_orm/entity/prelude/struct.Select.html#method.find_also_linked) 是 `find_also_related` 的对偶；[`find_with_linked`](https://docs.rs/sea-orm/*/sea_orm/entity/prelude/struct.Select.html#method.find_with_linked) 是 `find_with_related` 的对偶；：

```rust
assert_eq!(
    cake::Entity::find()
        .find_also_linked(links::CakeToFilling)
        .build(DbBackend::MySql)
        .to_string(),
    [
        r#"SELECT `cake`.`id` AS `A_id`, `cake`.`name` AS `A_name`,"#,
        r#"`r1`.`id` AS `B_id`, `r1`.`name` AS `B_name`, `r1`.`vendor_id` AS `B_vendor_id`"#,
        r#"FROM `cake`"#,
        r#"LEFT JOIN `cake_filling` AS `r0` ON `cake`.`id` = `r0`.`cake_id`"#,
        r#"LEFT JOIN `filling` AS `r1` ON `r0`.`filling_id` = `r1`.`id`"#,
    ]
    .join(" ")
);
```

## 自引用关系

`Link` trait 也可以定义自引用关系。

以下示例定义了一个引用自身的实体。

```rust
use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "self_join")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub uuid: Uuid,
    pub uuid_ref: Option<Uuid>,
    pub time: Option<Time>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(belongs_to = "Entity", from = "Column::UuidRef", to = "Column::Uuid")]
    SelfReferencing,
}

pub struct SelfReferencingLink;

impl Linked for SelfReferencingLink {
    type FromEntity = Entity;

    type ToEntity = Entity;

    fn link(&self) -> Vec<RelationDef> {
        vec![Relation::SelfReferencing.def()]
    }
}
```

## 菱形关系

有时一对实体之间存在多个关系。这里我们举一个最简单的例子，`Cake` 可以有多个 `Fruit`。

```rust
#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "cake")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
    pub topping: i32,
    pub filling: i32,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::fruit::Entity",
        from = "Column::Topping",
        to = "super::fruit::Column::Id"
    )]
    Topping,
    #[sea_orm(
        belongs_to = "super::fruit::Entity",
        from = "Column::Filling",
        to = "super::fruit::Column::Id"
    )]
    Filling,
}
```

我们如何定义 `Fruit` 实体？
默认情况下，`has_many` 调用 `Related` trait 来定义关系。
因此，在没有 `Related` 实现的情况下无法定义关系。

这里我们必须使用 `via` 属性手动指定关系变体。

```rust
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "fruit")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_many = "super::cake::Entity", via = "Relation::Topping")]
    CakeTopping,
    #[sea_orm(has_many = "super::cake::Entity", via = "Relation::Filling")]
    CakeFilling,
}