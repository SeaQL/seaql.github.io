# 复杂关联

## 链接关联

`Related` 特征是我们在实体关系图中绘制的箭头（1-1、1-N、M-N）的表示。一个 [`Linked`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/entity/trait.Linked.html) 由一系列关系组成，在以下情况下很有用：

1. 一对 Entity 之间存在多条 join 路径，无法实现 `Related`
1. 在关系查询中跨多个 Entity 进行 join

实现 `Linked` 特征是完全可选的，因为 SeaORM 中还有其他方式进行关系查询，这将在后续章节中说明。
实现 `Linked` 后，可以使用多个 `find_*_linked` 辅助方法，并且可以在一个地方定义关系。

### 定义链接

以[此](https://github.com/SeaQL/sea-orm/blob/master/src/tests_cfg/entity_linked.rs)为例，我们通过中间的 `cake_filling` 表连接 cake 和 filling。

```rust title="entity/links.rs"
pub struct CakeToFilling;

impl Linked for CakeToFilling {
    type FromEntity = cake::Entity;
    type ToEntity = filling::Entity;

    fn link(&self) -> Vec<RelationDef> {
        vec![
            cake_filling::Relation::Cake.def().rev(), // cake -> cake_filling
            cake_filling::Relation::Filling.def(),    // cake_filling -> filling
        ]
    }
}
```

### 延迟加载

使用 [`find_linked`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/entity/prelude/trait.ModelTrait.html#method.find_linked) 方法查找可以填入蛋糕的配料。

```rust
let cake_model = cake::Model {
    id: 12,
    name: "Chocolate".into(),
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

### 预先加载

[`find_also_linked`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/entity/prelude/struct.Select.html#method.find_also_linked) 是 `find_also_related` 的对应方法；[`find_with_linked`](https://docs.rs/sea-orm/2.0.0-rc.25/sea_orm/entity/prelude/struct.Select.html#method.find_with_linked) 是 `find_with_related` 的对应方法：

```rust
assert_eq!(
    cake::Entity::find()
        .find_also_linked(links::CakeToFilling)
        .build(DbBackend::MySql)
        .to_string(),
    [
        "SELECT `cake`.`id` AS `A_id`, `cake`.`name` AS `A_name`,",
        "`r1`.`id` AS `B_id`, `r1`.`name` AS `B_name`, `r1`.`vendor_id` AS `B_vendor_id`",
        "FROM `cake`",
        "LEFT JOIN `cake_filling` AS `r0` ON `cake`.`id` = `r0`.`cake_id`",
        "LEFT JOIN `filling` AS `r1` ON `r0`.`filling_id` = `r1`.`id`",
    ]
    .join(" ")
);
```

## 自引用关联

### 属于

```rust title="staff.rs"
use sea_orm::entity::prelude::*;

#[sea_orm::model]
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "staff")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
    pub reports_to_id: Option<i32>,
    #[sea_orm(
        self_ref,
        relation_enum = "ReportsTo",
        relation_reverse = "Manages",
        from = "reports_to_id",
        to = "id"
    )]
    pub reports_to: HasOne<Entity>,
    #[sea_orm(self_ref, relation_enum = "Manages", relation_reverse = "ReportsTo")]
    pub manages: HasMany<Entity>,
}

impl ActiveModelBehavior for ActiveModel {}
```

(or using `compact_model` shim)

```rust title="staff.rs"
use sea_orm::entity::prelude::*;

#[sea_orm::compact_model]
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "staff")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
    pub reports_to_id: Option<i32>,
    #[sea_orm(self_ref, relation_enum = "ReportsTo")]
    pub reports_to: HasOne<Entity>,
    #[sea_orm(self_ref, relation_enum = "Manages")]
    pub manages: HasMany<Entity>,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(belongs_to = "Entity", from = "Column::ReportsToId", to = "Column::Id")]
    ReportsTo,
    #[sea_orm(has_many = "Entity", via_rel = "Relation::ReportsTo")]
    Manages,
}

impl ActiveModelBehavior for ActiveModel {}
```

#### 实体批量加载器

```rust
let staff = staff_compact::Entity::load()
    .with(staff_compact::Relation::ReportsTo)
    .with(staff_compact::Relation::Manages)
    .all(db)
    .await?;

assert_eq!(staff[0].name, "Alan");
assert_eq!(staff[0].reports_to, None);
assert_eq!(staff[0].manages[0].name, "Ben");
assert_eq!(staff[0].manages[1].name, "Alice");

assert_eq!(staff[1].name, "Ben");
assert_eq!(staff[1].reports_to.as_ref().unwrap().name, "Alan");
assert!(staff[1].manages.is_empty());

assert_eq!(staff[2].name, "Alice");
assert_eq!(staff[1].reports_to.as_ref().unwrap().name, "Alan");
assert!(staff[2].manages.is_empty());

assert_eq!(staff[3].name, "Elle");
assert_eq!(staff[3].reports_to, None);
assert!(staff[3].manages.is_empty());
```

#### 模型加载器

```rust
let staff = staff::Entity::find()
    .order_by_asc(staff::Column::Id)
    .all(db)
    .await?;

let reports_to = staff
    .load_self(staff::Entity, staff::Relation::ReportsTo, db)
    .await?;

assert_eq!(staff[0].name, "Alan");
assert_eq!(reports_to[0], None);

assert_eq!(staff[1].name, "Ben");
assert_eq!(reports_to[1].as_ref().unwrap().name, "Alan");

assert_eq!(staff[2].name, "Alice");
assert_eq!(reports_to[2].as_ref().unwrap().name, "Alan");

assert_eq!(staff[3].name, "Elle");
assert_eq!(reports_to[3], None);
```

反向也可以工作。

```rust
let manages = staff
    .load_self_many(staff::Entity, staff::Relation::Manages, db)
    .await?;

assert_eq!(staff[0].name, "Alan");
assert_eq!(manages[0].len(), 2);
assert_eq!(manages[0][0].name, "Ben");
assert_eq!(manages[0][1].name, "Alice");

assert_eq!(staff[1].name, "Ben");
assert_eq!(manages[1].len(), 0);

assert_eq!(staff[2].name, "Alice");
assert_eq!(manages[2].len(), 0);

assert_eq!(staff[3].name, "Elle");
assert_eq!(manages[3].len(), 0);
```

### 拥有多 (M-N)

```rust title="user.rs"
#[sea_orm::model]
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "user")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
    #[sea_orm(self_ref, via = "user_follower", from = "User", to = "Follower")]
    pub followers: HasMany<Entity>,
    #[sea_orm(self_ref, via = "user_follower", reverse)]
    pub following: HasMany<Entity>,
}
```

```rust title="user_follower.rs"
#[sea_orm::model]
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq)]
#[sea_orm(table_name = "user_follower")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub user_id: i32,
    #[sea_orm(primary_key)]
    pub follower_id: i32,
    #[sea_orm(belongs_to, from = "user_id", to = "id")]
    pub user: Option<super::user::Entity>,
    #[sea_orm(belongs_to, relation_enum = "Follower", from = "follower_id", to = "id")]
    pub follower: Option<super::user::Entity>,
}
```

(or with `compact_model`)

```rust
#[sea_orm::compact_model]
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "user")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
    #[sea_orm(self_ref, via = "user_follower")]
    pub followers: HasMany<Entity>,
    #[sea_orm(self_ref, via = "user_follower", reverse)]
    pub following: HasMany<Entity>,
}

impl RelatedSelfVia<super::user_follower::Entity> for Entity {
    fn to() -> RelationDef {
        super::user_follower::Relation::Follower.def()
    }
    fn via() -> RelationDef {
        super::user_follower::Relation::User.def().rev()
    }
}
```

#### 实体批量加载器

Join 路径：

```rust
user -> profile
     -> user_follower -> user -> profile
     -> user_follower (reverse) -> user -> profile
```

```rust
let users = user::Entity::load()
    .with(profile::Entity)
    .with((user_follower::Entity, profile::Entity))
    .with((user_follower::Entity::REVERSE, profile::Entity))
    .all(db)
    .await?;

assert_eq!(users[1].profile, bob.profile);
assert_eq!(users[1].followers.len(), 1);
assert_eq!(users[1].followers[0], sam);
assert_eq!(users[1].following.len(), 1);
assert_eq!(users[1].following[0], alice);
```

#### 模型加载器

```rust
let users = user::Entity::find().all(db).await?;
let followers = users.load_self_via(user_follower::Entity, db).await?;
let following = users.load_self_via_rev(user_follower::Entity, db).await?;

assert_eq!(users[1], bob);
assert_eq!(followers[1], [sam.clone()]);
assert_eq!(following[1], [alice.clone()]);
```

## 菱形关联

有时一对 Entity 之间存在多个关系。这里我们举一个最简单的例子：`Bakery` 可以有多个 `Worker`。

```rust
#[sea_orm::model]
#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]
#[sea_orm(table_name = "bakery")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
    pub manager_id: i32,
    pub cashier_id: i32,
    #[sea_orm(belongs_to, relation_enum = "Manager", from = "manager_id", to = "id")]
    pub manager: HasOne<super::worker::Entity>,
    #[sea_orm(belongs_to, relation_enum = "Cashier", from = "cashier_id", to = "id")]
    pub cashier: HasOne<super::worker::Entity>,
}
```

我们如何定义 `Worker` Entity？
默认情况下，`has_many` 会调用 `Related` 特征来定义关系。
因此，我们必须使用 `via_rel` 属性手动指定相关 Entity 的 `Relation` 变体。

```rust title="worker.rs"
#[sea_orm::model]
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "worker")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
    #[sea_orm(has_many, relation_enum = "BakeryManager", via_rel = "Manager")]
    pub manager_of: HasMany<super::bakery::Entity>,
    #[sea_orm(has_many, relation_enum = "BakeryCashier", via_rel = "Cashier")]
    pub cashier_of: HasMany<super::bakery::Entity>,
}
```

对于 compact Entity，看起来像这样：

```rust title="worker.rs"
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "worker")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_many = "super::bakery::Entity", via_rel = "Relation::Manager")]
    BakeryManager,
    #[sea_orm(has_many = "super::bakery::Entity", via_rel = "Relation::Cashier")]
    BakeryCashier,
}
```

然后可以这样使用关系：

```rust
worker::Entity::find().join(JoinType::LeftJoin, worker::Relation::BakeryManager.def());
```
