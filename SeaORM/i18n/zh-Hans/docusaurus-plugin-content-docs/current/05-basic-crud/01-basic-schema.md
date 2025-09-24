# 基本 Schema

我们将使用这个[基本 schema](https://github.com/SeaQL/sea-orm/tree/master/src/tests_cfg) 进行演示：

+ `cake` 一对多 `fruit`
+ `cake` 多对多 `filling`
+ `cake_filling` 是 `cake` 和 `filling` 之间的连接表

![基本 Schema](https://raw.githubusercontent.com/SeaQL/sea-orm/master/src/tests_cfg/basic_schema.svg)