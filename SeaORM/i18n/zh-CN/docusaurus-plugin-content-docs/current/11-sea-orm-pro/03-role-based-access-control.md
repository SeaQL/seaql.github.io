# 基于角色的访问控制

SeaORM 2.0 引入了基于角色的访问控制（RBAC），将一流的授权能力带入你的数据层。不再需要临时拼凑权限检查或将业务规则分散到各个服务中——SeaORM 让你在数据库连接内部直接定义角色和权限规则并执行访问策略。它是构建需要授权的多面应用的强大工具。

## SeaORM RBAC 概述

以下是设计及其背后需求的高层概述：

1. 表级访问控制

不同用户组只能读取或修改某些表，例如客户只能读取发票，但不能修改它们。

设计：RBAC 引擎以表为作用域，因此权限可以直接用表的 CRUD 来表达。

2. 用户分配的简单性

每个用户应具有清晰、明确的角色，以避免混淆。

设计：一个用户 = 一个角色。这避免了每个用户多个角色的复杂性。

3. 角色层次和继承

我们希望创建从多个角色继承的角色，如 A = B + C，其中 A 将拥有 B 和 C 权限的并集。

我们希望避免在角色之间重复权限集。例如，「Manager」应自动获得所有「Employee」权限，外加额外权限。

设计：支持多重继承的层次化角色。

4. 细粒度、可组合的权限

我们需要允许细粒度控制，如「读取客户但不能更新他们」。我们希望权限授予易于理解。

设计：角色可以分配对资源（表）的权限集（CRUD）。权限是累加的，一旦授予就无法撤销（但可以按用户进行覆盖）。

5. 可扩展性

我们希望扩展到表之外（例如应用特定的操作，甚至非数据库资源）。

设计：引擎是泛型的——资源 + 权限抽象可以应用于不仅仅是 SQL 表上的 CRUD 操作。

6. 通配符的便利性

有时我们需要授予超级用户完全访问权限，而无需枚举每个资源/权限。

设计：可选的 `*` 通配符表示「所有权限」或「所有资源」。

7. 每用户覆盖

偶尔，单个用户需要例外（例如只能读取一个表的承包商，或应被拒绝访问一个敏感表的管理员）。

设计：用户级覆盖以授予/拒绝权限。

## 为什么要重新发明轮子？

我们首先考虑的是集成现有开源 RBAC 引擎的可能性，但最终我们开发了自己的方案，因为我们希望将其与 SeaORM 紧密集成。

1. 规则和权限与你的应用数据存储在同一数据库中

通过将角色和权限存储在与应用数据相同的数据库中，你将一切集中在一处。没有单独的 DSL，没有外部策略文件，也没有访问规则与 schema 不同步的风险。因此你可以像其他表一样在迁移中查询和更新 RBAC 规则。单一数据源简化了开发和部署。

2. 难点不是表达规则，而是执行它们

大多数策略引擎擅长用抽象术语描述规则，但真正的挑战是：如何实际针对 SQL 查询执行这些规则？使用外部库，我们仍然需要自己分析原始 SQL 语句并将其与规则定义匹配。通过将 RBAC 直接嵌入 SeaORM，我们可以分析所有查询并执行这些规则。

3. 轻量且高性能

由于 RBAC 引擎是 SeaORM 的一部分，它轻量且集成——没有额外的运行时或外部依赖。运行时成本也很小，最重要的是，你不用为不使用的功能付费。此功能可以完全关闭。

## 概念

让我们看一下 [RBAC schema](https://github.com/SeaQL/sea-orm/tree/master/src/rbac/entity) 并浏览实体。

<img src="/blog/img/sea-orm-rbac-schema.png" />

### 实体

#### User

用户表由你的应用定义。SeaORM 不管理它。然而我们目前要求它使用整数主键。

#### Role

每个角色都带有一组权限。例如「admin」、「sales manager」和「customer service」。

#### Permissions

我们可以对资源执行的操作。有 4 个基本权限：`select`、`insert`、`update` 和 `delete`。你可以为应用定义更多。

#### Resources

被访问的资源。在我们的情况下它们是数据库表。

### 关系

#### User `<->` Role

如上所述，User 与 Role 具有 1-1 关系，意味着每个用户最多只能分配 1 个角色。

#### Role Hierarchy

Role 具有自引用关系，它们形成 DAG（有向无环图）。最常见的是它们形成一个某种程度上类似于组织架构图的层次树。

一个简单的树示例：

```rust
admin <- manager <- sales
                 <- warehouse
```

如果我们在图中添加以下内容，使每个角色可以有多个超角色，则它变成 DAG。

```rust
admin <- sourcing <- warehouse
```

每个角色都有自己的权限集。在运行时，引擎将遍历角色层次结构并取子图所有权限的并集。

#### Role `<->` Permission `<->` Resource

每个角色可以有许多这样的条目，每个资源单独设置权限。例如：`manager - update - order`。

#### User override

schema 是上述的镜像：User `<->` Permission `<->` Resource，带有一个额外的 `grant` 字段，`false` 表示拒绝。

## 用法

有两个阶段：规则定义（定义 RBAC 规则时）和运行时授权（执行这些规则时）。

### 规则定义

你实际上可以使用提供的 [SeaORM 实体](https://github.com/SeaQL/sea-orm/tree/master/src/rbac/entity) 更新规则，但我们提供了一组实用程序使修改 RBAC 规则更容易。

这些方法是幂等的，可以在迁移中使用。

#### 创建 RBAC 表

```rust
sea_orm::rbac::schema::create_tables(db, Default::default()).await?;
```

#### 添加资源和权限

```rust
let mut context = RbacContext::load(db).await?;

let tables = [
    baker::Entity.table_name(),
    bakery::Entity.table_name(),
    cake::Entity.table_name(),
    cakes_bakers::Entity.table_name(),
    customer::Entity.table_name(),
    lineitem::Entity.table_name(),
    order::Entity.table_name(),
    "*", // WILDCARD
];

context.add_tables(db, &tables).await?;
context.add_crud_permissions(db).await?;
```

#### 定义角色

首先我们创建角色。

```rust
context.add_roles(db, &["admin", "manager", "public"]).await?;
```

然后我们可以定义角色层次结构。

```rust
admin <- manager <- public
```

```rust
context
    .add_role_hierarchy(
        db,
        &[
            RbacAddRoleHierarchy {
                super_role: "admin",
                role: "manager",
            },
            RbacAddRoleHierarchy {
                super_role: "manager",
                role: "public",
            },
        ],
    )
    .await?;
```

#### 添加角色权限

权限和资源集将相乘，即取笛卡尔积。

```rust
// public can select everything, here wildcard is used
context.add_role_permissions(db, "public", &["select"], &["*"]).await?;
```

```rust
// manager can create / update cake and baker
context
    .add_role_permissions(
        db,
        "manager",
        &["insert", "update"],
        &["cake", "baker", "cakes_bakers"],
    )
    .await?;
```

```rust
// admin can CRUD everything
context
    .add_role_permissions(db, "admin", &["insert", "update", "delete"], &["*"])
    .await?;
```

#### 分配用户角色

```rust
context
    .assign_user_role(db, &[
        // (user_id, role)
        (1, "admin"),
        (2, "manager"),
        (3, "public"),
    ])
    .await?;
```

### 运行时授权

定义好这些规则后，我们可以在应用中使用它们。

#### 初始化 RBAC 引擎

默认情况下，它期望 RBAC 表与当前连接在同一数据库架构中。它们也可以从另一个数据库连接获取。

```rust
let db: &DbConn;

db.load_rbac().await?;
```

RBAC 规则缓存在内存中，并通过 `RwLock` 在所有数据库连接之间共享，因此可以随时重新加载。

#### 认证用户

这可以由 Web 框架完成，其中用户身份从 HTTP 请求的 JWT token 中提取。这里我们手动分配它们。

```rust
use sea_orm::rbac::RbacUserId;
let admin = RbacUserId(1);
let manager = RbacUserId(2);
let public = RbacUserId(3);
```

#### 创建受限连接

这是关键步骤。一旦创建了 `RestrictedConnection`，它在对象的生命周期内绑定到用户。创建和销毁它们的成本很低，因为它们内部只是 `Arc`。

`RestrictedConnection` 实现了标准的 `DatabaseConnection` API，因此可以替代普通的 `DbConn` 使用。

通过 SeaORM 进行的所有查询，包括通过 Entity（`ActiveModel`）或低级 API（`Insert`）进行的查询，都会被审计。只有具有匹配权限的查询才会执行。DDL（即 `ALTER`）和原始 SQL 目前不支持，因此会被拒绝。

```rust
let db: RestrictedConnection = db.restricted_for(admin)?;
```

通过编写仅接受 `RestrictedConnection` 的函数，你可以在函数范围内保护所有操作，因为从类型系统角度无法将其降级为普通的 `DatabaseConnection`。（在 Rust 中我们通常不使用单例/全局作用域，因此任何具有全局副作用的操作都非常明显。）

```rust
// admin can create bakery
operation(db.restricted_for(admin)?).await?;

fn operation(db: RestrictedConnection) -> Result<(), DbErr> {
    let seaside_bakery = bakery::ActiveModel {
        name: Set("SeaSide Bakery".to_owned()),
        profit_margin: Set(10.2),
        ..Default::default()
    };

    let res = Bakery::insert(seaside_bakery).exec(&db).await?;
    let bakery: Option<bakery::Model> = 
        Bakery::find_by_id(res.last_insert_id).one(&db).await?;

    assert_eq!(bakery.unwrap().name, "SeaSide Bakery");
    Ok(())
}
```

```rust
// manager can't create bakery
operation(db.restricted_for(manager)?).await?;

fn operation(db: RestrictedConnection) -> Result<(), DbErr> {
    assert!(matches!(
        Bakery::insert(bakery::ActiveModel::default())
            .exec(db)
            .await,
        Err(DbErr::AccessDenied { .. })
    ));
    Ok(())
}
```

```rust
// manager can create cake & baker
operation(db.restricted_for(manager)?).await?;

fn operation(db: RestrictedConnection) -> Result<(), DbErr> {
    cake::Entity::insert(cake::ActiveModel {
        name: Set("Cheesecake".to_owned()),
        price: Set(2.into()),
        bakery_id: Set(Some(1)),
        gluten_free: Set(false),
        ..Default::default()
    })
    .exec(&db)
    .await?;

    // transaction is supported: using async closure
    db.transaction::<_, _, DbErr>(|txn| {
        Box::pin(async move {
            cake::Entity::insert(cake::ActiveModel {
                name: Set("Chocolate".to_owned()),
                price: Set(3.into()),
                bakery_id: Set(Some(1)),
                gluten_free: Set(true),
                ..Default::default()
            })
            .exec(txn)
            .await?;

            Ok(())
        })
    })
    .await?;

    // transaction using the begin / commit API
    let txn: RestrictedTransaction = db.begin().await?;

    baker::Entity::insert(baker::ActiveModel {
        name: Set("Master Baker".to_owned()),
        contact_details: Set(Default::default()),
        bakery_id: Set(Some(1)),
        ..Default::default()
    })
    .exec(&txn)
    .await?;

    txn.commit().await?;
    Ok(())
}
```

就是这样！希望以上信息能帮助你入门。

## 结论

RBAC 是 SeaORM 2.0 中的新功能。我们希望你尝试它并通过[分享你的反馈](https://github.com/SeaQL/sea-orm/discussions/2548)帮助塑造最终版本。

RBAC 引擎是 SeaORM 中的一等公民，在应用层之下但在数据库层之上实现。

我们相信这是最稳健的方法：如果在 Web 框架层面实现，很容易忘记权限检查或某些代码路径可能意外逃脱。此外，无论你构建 REST、gRPC 还是 GraphQL 服务器，它都能为你的应用工作。

在 SeaORM 中，分析是在 SeaQuery AST 上完成的，所以几乎是免费的——我们已经在内存中有 AST。得益于 SeaQuery 功能丰富的 API，你可以构建任何复杂的查询，包括 CTE！

与使用数据库引擎的原生访问控制能力相比，SeaORM 更容易设置、理解和开发。此外它是数据库无关的，因此你可以将其与 SQLite 一起使用。

一切，包括代码和规则，都在一个地方定义，因此你拥有单一数据源。我们相信 Rust 和 SeaQL 生态系统是构建高性能、可扩展和稳健应用的最佳方式！
