# Dashboard

## Info Card

![](../../static/img/site-config-dashboard-info.png#light)
![](../../static/img/site-config-dashboard-info-dark.png#dark)

Setting the title of the info card.

```toml title=pro_admin/dashboard.toml
# Title of info card section
title = "SeaORM Pro"
# Subtitle of info card section
subtitle = "Build professional admin panels with SeaORM Pro."
```

You can add multiple info cards.

```toml title=pro_admin/dashboard.toml
# 1st info card
[[info.card]]
# Title of info card
title = "What is SeaORM Pro?"
# Description of info card
description = "SeaORM Pro is full-stack framework allowing you to quickly and easily launch an admin panel for your application."
# Learn more link of info card
link = "https://www.sea-ql.org/sea-orm-pro/"


# 2nd info card
[[info.card]]
# ...

# 3rd info card
[[info.card]]
# ...
```

## Chart

![](../../static/img/site-config-dashboard-chart.png#light)
![](../../static/img/site-config-dashboard-chart-dark.png#dark)

There are some common configuration for both line chart and pie chart. Including the gutter size between chart, title of chart and the column span of each chart.

```toml title=pro_admin/dashboard.toml
# Chart grid
[[row]]
# Row gutter
gutter = 16


# 1st chart
[[row.col]]
# Span half row
span = 12
# Title of the chart
title = "New Customers Per Month"

[row.col.chart]
# An unique key for fetching chart data
chart = "new_customer_by_month"
# Kind of chart
kind = "line"
# ...


# 2nd chart
[[row.col]]
# Span half row
span = 12
# Title of the chart
title = "Sales Value of Week"

[row.col.chart]
# An unique key for fetching chart data
chart = "sales_value_by_day"
# Kind of chart
kind = "line"
# ...


# 3rd chart
[[row.col]]
# Span entire row
span = 24
# Title of the chart
title = "Products of each Product Category"

[row.col.chart]
# An unique key for fetching chart data
chart = "product_by_product_category"
# Kind of chart
kind = "pie"
# ...
```

#### Fetching Chart Data

A unique key, `chart`, is defined for each chart to fetch chart data from the backend API. The aggregation query can be found in the admin controller:

```rust title=src/controllers/admin.rs
pub async fn dashboard(
    _auth: auth::JWT,
    State(ctx): State<AppContext>,
    Json(body): Json<DashboardBody>,
) -> Result<Response> {
    let db = &ctx.db;
    let data = match body.graph.as_str() {
        "new_customer_by_month" => {
            customer::Entity::find()
                .select_only()
                .column_as(cast_as_year_month(db, customer::Column::CreatedDate), DatumColumn::Key)
                .column_as(Expr::expr(Func::cast_as(Func::count(Expr::col(Asterisk)), int_keyword(db))), DatumColumn::Val)
                .filter(customer::Column::CreatedDate.gte(body.from.unwrap()))
                .filter(customer::Column::CreatedDate.lte(body.to.unwrap()))
                .group_by(Expr::col(DatumColumn::Key))
                .into_model::<Datum>()
                .all(db)
                .await?
        },
        "sales_value_by_day" => {
            sales_order_detail::Entity::find()
                .select_only()
                .column_as(cast_as_day(db, (sales_order_header::Entity, sales_order_header::Column::OrderDate)), DatumColumn::Key)
                .column_as(Expr::expr(Func::cast_as(Func::sum(Expr::col(sales_order_detail::Column::UnitPrice).mul(Expr::col(sales_order_detail::Column::OrderQty))), int_keyword(db))), DatumColumn::Val)
                .left_join(sales_order_header::Entity)
                .filter(Expr::col((sales_order_header::Entity, sales_order_header::Column::OrderDate)).gte(body.from.unwrap()))
                .filter(Expr::col((sales_order_header::Entity, sales_order_header::Column::OrderDate)).lte(body.to.unwrap()))
                .group_by(Expr::col(DatumColumn::Key))
                .into_model::<Datum>()
                .all(db)
                .await?
        },
        "product_by_product_category" => {
            product_category::Entity::find()
                .select_only()
                .column_as(Expr::expr(Expr::col((product_category::Entity, product_category::Column::Name))), DatumColumn::Key)
                .column_as(Expr::expr(Func::cast_as(Func::count(Expr::col(Asterisk)), int_keyword(db))), DatumColumn::Val)
                .left_join(product::Entity)
                .group_by(Expr::col(DatumColumn::Key))
                .order_by_desc(Expr::col(DatumColumn::Val))
                .into_model::<Datum>()
                .all(db)
                .await?
        },
        _ => not_found()?,
    };
    format::json(data)
}
```

### Line Chart

![](../../static/img/site-config-dashboard-chart-line.png#light)
![](../../static/img/site-config-dashboard-chart-line-dark.png#dark)

#### Datetime Picker

* Available `timescale` options: "time" / "day" / "month" / "year" / "decade".
* The default value of the datetime picker can be set to any exact value via `from_date` and `to_date`
* Or, setting the default value dynamically based on current date: `default_date_range` can starts with "next" or "last" then follow a integer number and ends with any of "day" / "week" / "month" / "quarter" / "year"
    > e.g. `default_date_range` = "last 1 day", "last 7 days", "next 1 month", "next 3 years"
    

```toml title=pro_admin/dashboard.toml
# 2nd chart
[[row.col]]
# Span half row
span = 12
# Title of the chart
title = "Sales Value of Week"

[row.col.chart]
# An unique key for fetching chart data
chart = "sales_value_by_day"
# Kind of chart
kind = "line"
# Time scale of datetime picker
timescale = "day"
# Default start of datetime
from_date = "2024-12-22"
# Default end of datetime
to_date = "2024-12-28"
# Default dynamic date range based on current date
default_date_range = "last 7 days"
# Title of X axis
x_axis_title = "Date"
# Title of Y axis
y_axis_title = "Sales"
```

### Pie Chart

![](../../static/img/site-config-dashboard-chart-pie.png#light)
![](../../static/img/site-config-dashboard-chart-pie-dark.png#dark)

```toml title=pro_admin/dashboard.toml
# 3rd chart
[[row.col]]
# Span entire row
span = 24
# Title of the chart
title = "Products of each Product Category"

[row.col.chart]
# An unique key for fetching chart data
chart = "product_by_product_category"
# Kind of chart
kind = "pie"
# Title of X axis
x_axis_title = "Product Category"
# Title of Y axis
y_axis_title = "No. of Products"
```

## Full Spec

```toml title=pro_admin/dashboard.toml
# Title of info card section
title = "SeaORM Pro"
# Subtitle of info card section
subtitle = "Build professional admin panels with SeaORM Pro."


# 1st info card
[[info.card]]
# Title of info card
title = "What is SeaORM Pro?"
# Description of info card
description = "SeaORM Pro is full-stack framework allowing you to quickly and easily launch an admin panel for your application."
# Learn more link of info card
link = "https://www.sea-ql.org/sea-orm-pro/"


# 2nd info card
[[info.card]]
# Title of info card
title = "Download the Demo"
# Description of info card
description = "The source code of this demo is hosted on SeaQL/sea-orm-pro."
# Learn more link of info card
link = "https://github.com/SeaQL/sea-orm-pro"


# 3rd info card
[[info.card]]
# Title of info card
title = "Learn More"
# Description of info card
description = "Learn how to customize the admin panel to make it your own!"
# Learn more link of info card
link = "https://www.sea-ql.org/sea-orm-pro/docs/site-config/overview/"


# Chart grid
[[row]]
# Row gutter
gutter = 16


# 1st chart
[[row.col]]
# Span half row
span = 12
# Title of the chart
title = "New Customers Per Month"

[row.col.chart]
# An unique key for fetching chart data
chart = "new_customer_by_month"
# Kind of chart
kind = "line"
# Time scale of datetime picker
timescale = "month"
# Default start of datetime
from_date = "2024-01"
# Default end of datetime
to_date = "2024-12"
# Title of X axis
x_axis_title = "Month"
# Title of Y axis
y_axis_title = "No. of Customers"


# 2nd chart
[[row.col]]
# Span half row
span = 12
# Title of the chart
title = "Sales Value of Week"

[row.col.chart]
# An unique key for fetching chart data
chart = "sales_value_by_day"
# Kind of chart
kind = "line"
# Time scale of datetime picker
timescale = "day"
# Default dynamic date range based on current date
default_date_range = "last 7 days"
# Title of X axis
x_axis_title = "Date"
# Title of Y axis
y_axis_title = "Sales"


# 3rd chart
[[row.col]]
# Span entire row
span = 24
# Title of the chart
title = "Products of each Product Category"

[row.col.chart]
# An unique key for fetching chart data
chart = "product_by_product_category"
# Kind of chart
kind = "pie"
# Title of X axis
x_axis_title = "Product Category"
# Title of Y axis
y_axis_title = "No. of Products"
```
