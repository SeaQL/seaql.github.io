# Basic Schema

We will be using this [basic schema](https://github.com/SeaQL/sea-orm/tree/master/src/tests_cfg) for demonstration:

+ `cake` one-to-many `fruit`
+ `cake` many-to-many `filling`
+ `cake_filling` is the junction table between `cake` and `filling`

![Basic Schema](https://raw.githubusercontent.com/SeaQL/sea-orm/master/src/tests_cfg/basic_schema.svg)