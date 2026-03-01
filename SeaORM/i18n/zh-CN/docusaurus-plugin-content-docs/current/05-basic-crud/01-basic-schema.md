# 基本 Schema

我们将使用此[基本 schema](https://github.com/SeaQL/sea-orm/tree/master/src/tests_cfg)进行演示：

+ `cake` 一对多 `fruit`
+ `cake` 多对多 `filling`
+ `cake_filling` 是 `cake` 和 `filling` 之间的关联表

![Basic Schema](https://raw.githubusercontent.com/SeaQL/sea-orm/master/src/tests_cfg/basic_schema.svg)
