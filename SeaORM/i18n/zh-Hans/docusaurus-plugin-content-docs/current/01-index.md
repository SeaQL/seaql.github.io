# 索引

## 介绍

1. 介绍

    1.1. [什么是 ORM](01-introduction/01-orm.md)

    1.2. [Rust 中的异步编程](01-introduction/02-async.md)

    1.3. [SeaORM 概念](01-introduction/03-sea-orm.md)

    1.4. [教程与示例](01-introduction/04-tutorial.md)

## 基础

2. 安装与配置

    2.1 [选择数据库与异步运行时](02-install-and-config/01-database-and-async-runtime.md)

    2.2 [连接池](02-install-and-config/02-connection.md)

    2.3 [调试日志](02-install-and-config/03-debug-log.md)

3. 迁移

    3.1 [设置迁移](03-migration/01-setting-up-migration.md)

    3.2 [编写迁移](03-migration/02-writing-migration.md)

    3.3 [运行迁移](03-migration/03-running-migration.md)

    3.4 [数据填充](03-migration/04-seeding-data.md)

4. 生成实体

    4.1 [使用 `sea-orm-cli`](04-generate-entity/01-sea-orm-cli.md)

    4.2 [实体结构](04-generate-entity/02-entity-format.md)

    4.3 [列类型](04-generate-entity/03-column-types.md)

    4.4 [枚举](04-generate-entity/04-enumeration.md)

    4.5 [新类型](04-generate-entity/05-newtype.md)

5. 基本 CRUD

    5.1 [基本 Schema](05-basic-crud/01-basic-schema.md)

    5.2 [SELECT: 查找、过滤、排序、分页](05-basic-crud/02-select.md)

    5.3 [ActiveModel 与 ActiveValue](05-basic-crud/03-active-model.md)

    5.4 [INSERT: 插入单个与插入多个](05-basic-crud/04-insert.md)

    5.5 [UPDATE: 查找与保存，更新多个](05-basic-crud/05-update.md)

    5.6 [SAVE: 插入或更新](05-basic-crud/06-save.md)

    5.7 [DELETE: 删除单个与删除多个](05-basic-crud/07-delete.md)

    5.8 [JSON](05-basic-crud/08-json.md)

    5.9 [原始 SQL 查询](05-basic-crud/09-raw-sql.md)

## 高级主题

6. 关系

    6.1 [一对一](06-relation/01-one-to-one.md)

    6.2 [一对多](06-relation/02-one-to-many.md)

    6.3 [多对多](06-relation/03-many-to-many.md)

    6.4 [复杂关系](06-relation/04-complex-relations.md)

    6.5 [自定义连接条件](06-relation/06-custom-join-condition.md)

    6.6 [数据加载器](06-relation/07-data-loader.md)

    6.7 [Bakery Schema](06-relation/08-bakery-schema.md)

    6.8 [嵌套选择](06-relation/09-nested-selects.md)

7. 编写测试

    7.1 [健壮与正确](07-write-test/01-testing.md)

    7.2 [模拟接口](07-write-test/02-mock.md)

    7.3 [使用 SQLite](07-write-test/03-sqlite.md)

8. 高级查询

    8.1 [自定义选择](08-advanced-query/01-custom-select.md)

    8.2 [条件表达式](08-advanced-query/02-conditional-expression.md)

    8.3 [聚合函数](08-advanced-query/03-aggregate-function.md)

    8.4 [高级连接](08-advanced-query/04-advanced-joins.md)

    8.5 [子查询](08-advanced-query/05-subquery.md)

    8.6 [事务](08-advanced-query/06-transaction.md)

    8.7 [流式处理](08-advanced-query/07-streaming.md)

    8.8 [自定义 Active Model](08-advanced-query/08-custom-active-model.md)

    8.9 [错误处理](08-advanced-query/09-error-handling.md)

9. Schema 语句

    9.1 [创建表](09-schema-statement/01-create-table.md)

    9.2 [创建枚举](09-schema-statement/02-create-enum.md)

    9.3 [创建索引](09-schema-statement/03-create-index.md)

10. GraphQL 支持

    10.1 [🧭 Seaography](10-graph-ql/01-seaography-intro.md)

    10.2 [入门](10-graph-ql/02-getting-started.md)

11. 管理面板

    11.1 [🖥️ SeaORM Pro](11-sea-orm-pro/01-sea-orm-pro-intro.md)

    11.2 [入门](11-sea-orm-pro/02-getting-started.md)

12. 内部设计

    12.1 [特性与类型](12-internal-design/01-trait-and-type.md)

    12.2 [派生宏](12-internal-design/02-derive-macro.md)

    12.3 [与 Diesel 比较](12-internal-design/03-diesel.md)

    12.4 [架构](12-internal-design/04-architecture.md)

    12.5 [扩展实体格式](12-internal-design/05-expanded-entity-format.md)

13. 下一步

    13.1 [下一步](13-whats-next/01-whats-next.md)