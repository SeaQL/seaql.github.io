# 嵌套 ActiveModel

在 SeaORM 2.0 中，我们引入了 [Smart Entity Loader](https://www.sea-ql.org/blog/2025-10-20-sea-orm-2.0/)，使查询多路径关系到嵌套模型变得简单高效。这解决了读取端的问题。

有了 nested ActiveModel，你现在可以做相反的事：在一次操作中将嵌套对象回写数据库。SeaORM 遍历树、检测变更、构建 insert 和 update 语句，并以正确的顺序执行它们以遵守外键依赖。

你可以在此页面的 [快速入门示例](https://github.com/SeaQL/sea-orm/blob/master/examples/quickstart/src/main.rs)中找到本文描述的所有技术。

## 概要

以下操作以原子方式将新的 user + profile + post + tag + post_tag 集合保存到数据库：

```rust
let user = user::ActiveModel::builder()
    .set_name("Bob")
    .set_email("bob@sea-ql.org")
    .set_profile(profile::ActiveModel::builder().set_picture("image.jpg"))
    .add_post(
        post::ActiveModel::builder()
            .set_title("Nice weather")
            .add_tag(tag::ActiveModel::builder().set_tag("sunny")),
    )
    .save(db)
    .await?;
```

### 展开

此 builder 模式构建以下对象树：

```rust
user::ActiveModelEx {
    name: Set("Bob".into()),
    email: Set("bob@sea-ql.org".into()),
    profile: HasOneModel::Set(profile::ActiveModelEx {
        picture: Set("image.jpg".into()),
        ..Default::default()
    }),
    posts: HasManyModel::Append(post::ActiveModelEx {
        title: Set("Nice weather".into()),
        tags: HasManyModel::Append(tag::ActiveModel {
            tag: Set("sunny".into()),
            ..Default::default()
        }),
        ..Default::default()
    }),
    ..Default::default()
}
.save(db)
.await?
```

.. 等于手动执行以下操作：

```rust
let txn = db.begin().await?;

// insert a user
let user = user::ActiveModelEx {
    name: Set("Bob".into()),
    email: Set("bob@sea-ql.org".into()),
    ..Default::default()
}.insert(&txn).await?;

// profile belongs_to user (1-1)
let profile = profile::ActiveModelEx {
    user_id: Set(user.id),
    picture: Set("image.jpg".into()),
    ..Default::default()
}.insert(&txn).await?;

// post belongs_to user (1-N)
let post = post::ActiveModelEx {
    user_id: Set(user.id),
    title: Set("Nice weather".into()),
    ..Default::default()
}.insert(&txn).await?;

// insert a tag
let tag = tag::ActiveModel {
    tag: Set("sunny".into()),
    ..Default::default()
}
.insert(&txn)
.await?;

// associate tag to post
post_tag::ActiveModel {
    post_id: Set(post.id),
    tag_id: Set(tag.id),
}
.insert(&txn)
.await?;

txn.commit().await?;
```

## 关系依赖

问题的核心在于弄清 Entity 之间的外键关系并以正确的顺序执行查询。SeaORM 支持以下关系：

### 拥有一 / 属于

User 1-1 Profile

```rust title="user.rs"
#[sea_orm::model]
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "user")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    #[sea_orm(has_one)]
    pub profile: HasOne<super::profile::Entity>,
    ..
}
```

`user_id` 上有 `unique` 键，使此关系为一对一。

```rust title="profile.rs"
#[sea_orm::model]
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "profile")]
pub struct Model {
    #[sea_orm(unique)]
    pub user_id: i32,
    #[sea_orm(belongs_to, from = "user_id", to = "id")]
    pub user: HasOne<super::user::Entity>,
    ..
}
```

由于 `profile` 属于 `user`，必须先 insert user 才能获得其 `id`。

在 SeaORM 中，无论模型如何嵌套，都会以正确的顺序执行。

```rust
// also okay:
profile::ActiveModel::builder()
    .set_user(
        user::ActiveModel::builder()
            .set_name("Alice")
            .set_email("alice@rust-lang.org"),
    )
    .set_picture("image.jpg")
    .save(db)
    .await?;
```

### 拥有多

User 1-N Post

```rust
#[sea_orm::model]
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "post")]
pub struct Model {
    pub user_id: i32,
    #[sea_orm(belongs_to, from = "user_id", to = "id")]
    pub author: HasOne<super::user::Entity>,
    ..
}
```

这与 1-1 非常相似，嵌套模型是向量而不是 option。

有两种可能的操作：`Replace` 和 `Append`。默认操作是 append，它是非破坏性的。

假设 Bob 写了一篇新博客文章，没有理由需要查询 Bob 写的所有文章；我们可以简单地执行以下操作：

```rust
// query user, but no posts
let bob = user::Entity::load().filter_by_email("bob@sea-ql.org").one(db).await?.unwrap();

let mut bob.into_active_model();
bob.posts.push(post::ActiveModel::builder().set_title("Another weekend"));
bob.save(db).await?; // INSERT INTO post ..
```

但是，有时我们确实希望空向量表示“删除全部”，或者我们希望指定*精确*的子集。然后我们可以使用 `Replace`。

```rust
bob.posts.replace_all([]); // delete all
bob.posts.replace_all([post_1]); // retain only this post
```

这将导致以下操作，其中除 post 1 之外的文章将被删除：

```sql
SELECT FROM post WHERE user_id = bob.id
DELETE FROM post WHERE id = 2
```

### 多对多

Post M-N Tag

多对多关系在建模复杂 schema 时至关重要。SeaORM 的一个独特之处在于它将多对多关系建模为一等构造，因此你无需考虑 junction table。

```rust title="post.rs"
#[sea_orm::model]
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "post")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub title: String,
    #[sea_orm(has_many, via = "post_tag")] // ⬅ specify junction table
    pub tags: HasMany<super::tag::Entity>,
    ..
}
```

```rust title="post_tag.rs"
#[sea_orm::model]
#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq)]
#[sea_orm(table_name = "post_tag")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)] // ⬅ composite key
    pub post_id: i32,
    #[sea_orm(primary_key, auto_increment = false)] // ⬅ composite key
    pub tag_id: i32,
    #[sea_orm(belongs_to, from = "post_id", to = "id")] // ⬅ belongs to both
    pub post: Option<super::post::Entity>,
    #[sea_orm(belongs_to, from = "tag_id", to = "id")] // ⬅ belongs to both
    pub tag: Option<super::tag::Entity>,
}
```

```rust title="tag.rs"
#[sea_orm::model]
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "tag")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    #[sea_orm(unique)]
    pub tag: String,
}
```

M-N 关系不仅仅是 1-N + 1-1，它实际上脱离了该概念。让我们看以下示例，insert 一篇带 2 个 tag 的新 post：

```rust
// Insert one tag for later use
let sunny = tag::ActiveModel::builder().set_tag("sunny").save(db).await?;

// Insert a new post with 2 tags
let post = post::ActiveModel::builder()
    .set_title("A sunny day")
    .set_user(bob)
    .add_tag(sunny) // an existing tag
    .add_tag(tag::ActiveModel::builder().set_tag("outdoor")) // a new tag
    .save(db) // new tag will be created and associcated to the new post
    .await?;
```

这将导致以下操作：

```sql
INSERT INTO post (user_id, title) VALUES (bob.id, 'A sunny day') RETURNING id
INSERT INTO tag (tag) VALUES ('outdoor') RETURNING id
INSERT INTO post_tag (post_id, tag_id) VALUES (post.id, sunny.id) (post.id, outdoor.id)
```

它们的关系不再是“belongs to”，它们只是相互关联。
从 post 中移除 tag 不会删除 tag，只会删除 junction table 中的关联。

```rust
post.tags.replace_all([outdoor]); // let's say we remove the tag sunny
```

结果是：

```sql
DELETE FROM post_tag WHERE (post_id, tag_id) IN ((post.id, sunny.id))
```

再举一个例子以便理解：在 Film M-N Actor 关系中，删除一部电影不会删除其演员，因为他们仍可能出现在其他电影中。

#### 注意

SeaORM 也支持在 junction table 上使用代理主键，但推荐使用复合主键。

```rust title="film_actor.rs"
#[sea_orm::model]
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "film_actor")]
pub struct Model {
    #[sea_orm(primary_key)] // ⬅ normal primary key
    pub id: i32,
    #[sea_orm(unique_key = "film_actor")] // ⬅ unique key
    pub film_id: i32,
    #[sea_orm(unique_key = "film_actor")] // ⬅ unique key
    pub actor_id: i32,
    #[sea_orm(belongs_to, from = "film_id", to = "id")]
    pub film: HasOne<super::film::Entity>,
    #[sea_orm(belongs_to, from = "actor_id", to = "id")]
    pub actor: HasOne<super::actor::Entity>,
}
```

## 变更检测

让我们回到基础，在 SeaORM 中每个模型都由 ActiveModel 支持：

```rust title="post.rs"
pub struct ModelEx {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub user_id: i32,
    pub title: String,
    pub author: HasOne<super::user::Entity>,
    pub tags: HasMany<super::tag::Entity>,
}

// generated by macro:
pub struct ActiveModelEx {
    #[sea_orm(primary_key)]
    pub id: ActiveValue<i32>,
    pub user_id: ActiveValue<i32>,
    pub title: ActiveValue<String>,
    pub author: HasOneModel<super::user::Entity>,
    pub tags: HasManyModel<super::tag::Entity>,
}
```

每个 `ActiveValue` 都是三态的。

```rust
pub enum ActiveValue<V>
{
    Set(V),
    Unchanged(V),
    NotSet,
}
```

这允许 SeaORM 跟踪变更。当你首次从数据库查询新的模型时，默认状态是 `Unchanged`。当你在代码中进行某些更改时，状态将变为 `Set`。因此当你运行 `save` 时，*只有更改的列*会被更新。

```rust
let post = post::Entity::find_by_id(22).one(db).await?.unwrap(); // Model
let mut post = post.into_active_model(); // ActiveModel
post.title = Set("The weather changed!");
post.save(db).await?; // UPDATE post SET title = '..' WHERE id = 22
```

这有两个优点：避免过度更新，减少通过网络发送的数据量。更重要的是，多个 API 端点可以安全地更新不同的列集，而不会有竞态条件的风险，也无需依赖 transaction 或锁定机制。

这一概念扩展到 nested ActiveModel，允许 SeaORM 遍历嵌套对象树并确定哪些子树已更改需要更新。

例如：

```rust
let mut bob: user::ActiveModel = ..;

// update post title
bob.posts[0].title = Set("Lorem ipsum dolor sit amet".into());
// update post comment
bob.posts[0].comments[0].comment = Set("nice post! I learnt a lot".into());
// add a new comment too
bob.posts[1].comments.push(
    comment::ActiveModel::builder().set_comment("interesting!")
);
bob.save(db).await?;
```

结果是：

```sql
BEGIN TRANSACTION

UPDATE post SET title = '..' WHERE id = post.id
UPDATE comment SET comment = '..' WHERE id = comment.id
INSERT INTO comment (post_id, comment) VALUES (post.id. '..')

COMMIT
```

内容很多，但一旦你建立了对 SeaORM 概念和机制的清晰心智模型，你会发现自己的效率大大提高！

## 级联删除

如果关系使用 `ON DELETE CASCADE` 定义，则不存在此问题。但是，SeaORM 也可以在客户端执行 cascade delete。它应用上述相同的规则，但方向相反。

例如，Post 属于 User。必须先删除所有 post 才能删除 user；否则，SQL 操作将失败。

```rust
let user_4 = user::Entity::find_by_id(4).one(db).await?.unwrap();

user_4.cascade_delete(db).await?; // equivalent to below
user_4.into_ex().delete(db).await?;
```

```sql
-- query the profile belonging to user
SELECT FROM profile INNER JOIN user ON user.id = profile.user_id WHERE user.id = 4 LIMIT 1
-- delete the profile, if exist
DELETE FROM profile WHERE profile.id = 2
-- query the posts belonging to user
SELECT FROM post INNER JOIN user ON user.id = post.user_id WHERE user.id = 4
-- query the comments belonging to post
SELECT FROM comment INNER JOIN post ON post.id = comment.post_id WHERE post.id = 7
-- delete the comments, if exist
DELETE FROM comment WHERE comment.id = 5
-- query the post's tags
SELECT FROM post_tag INNER JOIN post ON post_tag.post_id = post.id WHERE post.id = 7
-- delete the post-tag associations
DELETE FROM post_tag WHERE (post_id, tag_id) IN ((7, 2), (7, 3), (7, 4))
-- post has no dependents, safe to delete now
DELETE FROM post WHERE post.id = 7
-- user has no dependents, safe to delete now
DELETE FROM user WHERE user.id = 4
```

### 弱属于

还有一种尚未提及的 Belongs To 关系的特殊情况：弱 1-N 关联，其中 Entity 可能有所有者，但不是严格必需的。

举例来说，Post 1-N Attachment。但用户可以在起草 post 之前上传 attachment，因此某些 attachment 可能没有关联的 post。

```rust title="attachment.rs"
#[sea_orm::model]
#[derive(Clone, Debug, PartialEq, Eq, DeriveEntityModel)]
#[sea_orm(table_name = "attachment")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub post_id: Option<i32>, // this is nullable
    pub file: String,
    #[sea_orm(belongs_to, from = "post_id", to = "id")]
    pub post: HasOne<super::post::Entity>,
}
```

```rust
// this post has attachment_2
let post_1 = post::Entity::find_by_id(1).one(db).await?.unwrap();
post_1.cascade_delete(db).await?;

// post_id of attachment will be set to null, instead of deleting the attachment
let attachment_2 = attachment::Entity::find_by_id(2).one(db).await?.unwrap();
assert!(attachment_2.post_id.is_none());
```

## 幂等性

一般规则是幂等性：第二次保存 ActiveModel 应该是空操作。
除非你使用 `replace` 或 `delete`，否则不会执行 delete。

```rust
let post = post.save(db).await?;
let post = post.save(db).await?; // no-op, as all fields are unchanged
```

你提供的 ActiveModel 是数据期望最终状态的快照，SeaORM 应确保最终达到该状态。这可能很复杂，如有 bug 请报告。

### 提示

跟踪何时使用 `insert` 或 `update` 可能很困难，除非预期操作是“从头创建新记录”。默认使用 `save`，让 SeaORM 决定何时执行 `insert` 或 `update`。

（如果你已经觉得这些概念很熟悉，难怪它被称为 ActiveModel。）

## 向后兼容性

本文介绍的 2.0 所有功能与 1.0 完全向后兼容，因为只添加了新类型和方法：`ActiveModelEx`、`HasOneModel`、`HasManyModel` 和一些方法。`ActiveModel` 的行为与之前完全相同。

但是，由于宏需要关系的属性来生成实现，这些功能仅对 `#[sea_orm::model]` 可用，对 `#[sea_orm::compact_model]` 不可用。
