# 目录

## 简介

1. 简介

    1.1. [SeaORM 简介](01-introduction/01-sea-orm.md)

    1.2. [SeaORM 2.0 新特性](01-introduction/02-whats-new.md)

## 基础

2. 安装与配置

    2.1 [数据库与异步执行环境](02-install-and-config/01-database-and-async-runtime.md)

    2.2 [数据库连接](02-install-and-config/02-connection.md)

    2.3 [调试日志](02-install-and-config/03-debug-log.md)

3. 迁移

    3.1 [设置迁移](03-migration/01-setting-up-migration.md)

    3.2 [编写迁移](03-migration/02-writing-migration.md)

    3.3 [运行迁移](03-migration/03-running-migration.md)

    3.4 [填充数据](03-migration/04-seeding-data.md)

4. 生成实体

    4.1 [使用 `sea-orm-cli`](04-generate-entity/01-sea-orm-cli.md)

    4.2 [Entity 格式](04-generate-entity/02-entity-format.md)

    4.3 [列类型](04-generate-entity/03-column-types.md)

    4.4 [枚举](04-generate-entity/04-enumeration.md)

    4.5 [新类型](04-generate-entity/05-newtype.md)

    4.6 [Entity 优先工作流程](04-generate-entity/06-entity-first.md)

5. 基本 CRUD

    5.1 [基本 Schema](05-basic-crud/01-basic-schema.md)

    5.2 [查询](05-basic-crud/02-select.md)

    5.3 [ActiveModel](05-basic-crud/03-active-model.md)

    5.4 [插入](05-basic-crud/04-insert.md)

    5.5 [更新](05-basic-crud/05-update.md)

    5.6 [保存](05-basic-crud/06-save.md)

    5.7 [删除](05-basic-crud/07-delete.md)

    5.8 [JSON](05-basic-crud/08-json.md)

    5.9 [原始 SQL](05-basic-crud/09-raw-sql.md)

    5.10 [自定义 ActiveModel](05-basic-crud/10-custom-active-model.md)

## 进阶主题

6. 关联关系

    6.1 [一对一](06-relation/01-one-to-one.md)

    6.2 [一对多](06-relation/02-one-to-many.md)

    6.3 [多对多](06-relation/03-many-to-many.md)

    6.4 [复杂关联](06-relation/04-complex-relations.md)

    6.5 [模型加载器](06-relation/06-model-loader.md)

    6.6 [实体批量加载器](06-relation/07-entity-loader.md)

    6.7 [烘焙店 Schema](06-relation/08-bakery-schema.md)

    6.8 [嵌套查询](06-relation/09-nested-selects.md)

    6.9 [多表查询](06-relation/10-multi-selects.md)

    6.10 [关联查询](06-relation/11-relational-query.md)

7. 编写测试

    7.1 [编写测试](07-write-test/01-testing.md)

    7.2 [模拟接口](07-write-test/02-mock.md)

    7.3 [使用 SQLite](07-write-test/03-sqlite.md)

8. 高级查询

    8.1 [自定义查询](08-advanced-query/01-custom-select.md)

    8.2 [条件表达式](08-advanced-query/02-conditional-expression.md)

    8.3 [聚合函数](08-advanced-query/03-aggregate-function.md)

    8.4 [自定义连接条件](08-advanced-query/04-custom-join-condition.md)

    8.5 [子查询](08-advanced-query/05-subquery.md)

    8.6 [事务](08-advanced-query/06-transaction.md)

    8.7 [串流](08-advanced-query/07-streaming.md)

    8.8 [嵌套 ActiveModel](08-advanced-query/08-nested-active-model.md)

    8.9 [错误处理](08-advanced-query/09-error-handling.md)

    8.10 [高级连接](08-advanced-query/10-advanced-joins.md)

9. 模式语句

    9.1 [创建表](09-schema-statement/01-create-table.md)

    9.2 [创建枚举](09-schema-statement/02-create-enum.md)

    9.3 [创建索引](09-schema-statement/03-create-index.md)

10. GraphQL 支持

    10.1 [🧭 Seaography](10-graph-ql/01-seaography-intro.md)

    10.2 [快速入门](10-graph-ql/02-getting-started.md)

11. 管理面板

    11.1 [🖥️ SeaORM Pro](11-sea-orm-pro/01-sea-orm-pro-intro.md)

    11.2 [快速入门](11-sea-orm-pro/02-getting-started.md)

    11.3 [基于角色的访问控制](11-sea-orm-pro/03-role-based-access-control.md)

12. 数据科学

    12.1 [Arrow 与 Parquet](12-data-science/01-arrow-parquet.md)

    12.2 [ClickHouse](12-data-science/02-clickhouse.md)

13. 内部设计

    13.1 [特征与类型](13-internal-design/01-trait-and-type.md)

    13.2 [派生宏](13-internal-design/02-derive-macro.md)

    13.3 [架构](13-internal-design/03-architecture.md)

    13.4 [与 Diesel 对比](13-internal-design/04-diesel.md)

    13.5 [展开的 Entity 格式](13-internal-design/05-expanded-entity-format.md)

14. 未来

    14.1 [SeaORM 的未来？](14-whats-next/01-whats-next.md)
