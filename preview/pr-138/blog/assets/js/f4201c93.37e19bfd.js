"use strict";(self.webpackChunksea_ql_blog=self.webpackChunksea_ql_blog||[]).push([[6756],{9680:(e,t,a)=>{a.d(t,{Zo:()=>u,kt:()=>h});var n=a(6687);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function p(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},l=Object.keys(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(n=0;n<l.length;n++)a=l[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var o=n.createContext({}),s=function(e){var t=n.useContext(o),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},u=function(e){var t=s(e.components);return n.createElement(o.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,l=e.originalType,o=e.parentName,u=p(e,["components","mdxType","originalType","parentName"]),d=s(a),h=r,c=d["".concat(o,".").concat(h)]||d[h]||m[h]||l;return a?n.createElement(c,i(i({ref:t},u),{},{components:a})):n.createElement(c,i({ref:t},u))}));function h(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var l=a.length,i=new Array(l);i[0]=d;var p={};for(var o in t)hasOwnProperty.call(t,o)&&(p[o]=t[o]);p.originalType=e,p.mdxType="string"==typeof e?e:r,i[1]=p;for(var s=2;s<l;s++)i[s]=a[s];return n.createElement.apply(null,i)}return n.createElement.apply(null,a)}d.displayName="MDXCreateElement"},7787:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>o,contentTitle:()=>i,default:()=>m,frontMatter:()=>l,metadata:()=>p,toc:()=>s});var n=a(1308),r=(a(6687),a(9680));const l={slug:"2024-12-03-whats-new-in-seaquery-0.32.x",title:"What's new in SeaQuery 0.32.x",author:"SeaQL Team",author_url:"https://github.com/SeaQL",author_image_url:"https://www.sea-ql.org/blog/img/SeaQL.png",tags:["news"]},i=void 0,p={permalink:"/preview/pr-138/blog/2024-12-03-whats-new-in-seaquery-0.32.x",editUrl:"https://github.com/SeaQL/seaql.github.io/edit/master/Blog/blog/2024-12-03-whats-new-in-seaquery-0.32.x.md",source:"@site/blog/2024-12-03-whats-new-in-seaquery-0.32.x.md",title:"What's new in SeaQuery 0.32.x",description:"\ud83c\udf89 We are pleased to release SeaQuery 0.32.0 / 0.32.1! Here are some feature highlights \ud83c\udf1f:",date:"2024-12-03T00:00:00.000Z",formattedDate:"December 3, 2024",tags:[{label:"news",permalink:"/preview/pr-138/blog/tags/news"}],readingTime:5.24,hasTruncateMarker:!1,authors:[{name:"SeaQL Team",url:"https://github.com/SeaQL",imageURL:"https://www.sea-ql.org/blog/img/SeaQL.png"}],frontMatter:{slug:"2024-12-03-whats-new-in-seaquery-0.32.x",title:"What's new in SeaQuery 0.32.x",author:"SeaQL Team",author_url:"https://github.com/SeaQL",author_image_url:"https://www.sea-ql.org/blog/img/SeaQL.png",tags:["news"]},prevItem:{title:"SeaQL Community Survey 2024 Results",permalink:"/preview/pr-138/blog/2025-01-02-community-survey-2024"},nextItem:{title:"What's new in SeaStreamer 0.5",permalink:"/preview/pr-138/blog/2024-11-30-whats-new-in-sea-streamer-0.5"}},o={authorsImageUrls:[void 0]},s=[{value:"New Features",id:"new-features",level:2},{value:"Unify <code>Expr</code> and <code>SimpleExpr</code> Methods with <code>ExprTrait</code> #791",id:"unify-expr-and-simpleexpr-methods-with-exprtrait-791",level:3},{value:"Support of Postgres Vector #774",id:"support-of-postgres-vector-774",level:3},{value:"Support Partial Index #478",id:"support-partial-index-478",level:3},{value:"Get Null Value",id:"get-null-value",level:3},{value:"Bitwise AND/OR Operators #841",id:"bitwise-andor-operators-841",level:3},{value:"Enhancements",id:"enhancements",level:2},{value:"<code>sea-query-derive</code>",id:"sea-query-derive",level:3},{value:"<code>sea-query-attr</code>",id:"sea-query-attr",level:3},{value:"Upgrades",id:"upgrades",level:2},{value:"Integration Examples",id:"integration-examples",level:2},{value:"Community",id:"community",level:2},{value:"Rustacean Sticker Pack \ud83e\udd80",id:"rustacean-sticker-pack-",level:2}],u={toc:s};function m(e){let{components:t,...a}=e;return(0,r.kt)("wrapper",(0,n.Z)({},u,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"\ud83c\udf89 We are pleased to release SeaQuery ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/SeaQL/sea-query/releases/tag/0.32.0"},(0,r.kt)("inlineCode",{parentName:"a"},"0.32.0"))," / ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/SeaQL/sea-query/releases/tag/0.32.1"},(0,r.kt)("inlineCode",{parentName:"a"},"0.32.1")),"! Here are some feature highlights \ud83c\udf1f:"),(0,r.kt)("h2",{id:"new-features"},"New Features"),(0,r.kt)("h3",{id:"unify-expr-and-simpleexpr-methods-with-exprtrait-791"},"Unify ",(0,r.kt)("inlineCode",{parentName:"h3"},"Expr")," and ",(0,r.kt)("inlineCode",{parentName:"h3"},"SimpleExpr")," Methods with ",(0,r.kt)("inlineCode",{parentName:"h3"},"ExprTrait")," ",(0,r.kt)("a",{parentName:"h3",href:"https://github.com/SeaQL/sea-query/pull/791"},"#791")),(0,r.kt)("p",null,'Previously, "operator" methods (e.g. ',(0,r.kt)("inlineCode",{parentName:"p"},"add"),", ",(0,r.kt)("inlineCode",{parentName:"p"},"eq"),") are duplicated across ",(0,r.kt)("inlineCode",{parentName:"p"},"Expr")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"SimpleExpr"),", but the list of methods is slightly different for each. And since ",(0,r.kt)("inlineCode",{parentName:"p"},"Expr")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"SimpleExpr")," are distinct types, it makes writing generic code difficult."),(0,r.kt)("p",null,"The ",(0,r.kt)("a",{parentName:"p",href:"https://docs.rs/sea-query/0.32.1/sea_query/expr/trait.ExprTrait.html"},(0,r.kt)("inlineCode",{parentName:"a"},"ExprTrait"))," looks like this:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-rust"},"pub trait ExprTrait: Sized {\n    // Required methods\n    fn as_enum<N>(self, type_name: N) -> SimpleExpr\n        where N: IntoIden;\n    fn binary<O, R>(self, op: O, right: R) -> SimpleExpr\n        where O: Into<BinOper>,\n    R: Into<SimpleExpr>;\n    fn cast_as<N>(self, type_name: N) -> SimpleExpr\n        where N: IntoIden;\n    fn unary(self, o: UnOper) -> SimpleExpr;\n\n    // Provided methods\n    fn add<R>(self, right: R) -> SimpleExpr where R: Into<SimpleExpr> { ... }\n    fn and<R>(self, right: R) -> SimpleExpr where R: Into<SimpleExpr> { ... }\n    fn between<A, B>(self, a: A, b: B) -> SimpleExpr\n        where A: Into<SimpleExpr>,\n              B: Into<SimpleExpr> { ... }\n    fn div<R>(self, right: R) -> SimpleExpr where R: Into<SimpleExpr> { ... }\n    fn eq<R>(self, right: R) -> SimpleExpr where R: Into<SimpleExpr> { ... }\n    fn equals<C>(self, col: C) -> SimpleExpr where C: IntoColumnRef { ... }\n\n    // omitting the where clause below to make it more concise ..\n\n    fn gt<R>(self, right: R) -> SimpleExpr;\n    fn gte<R>(self, right: R) -> SimpleExpr;\n    fn in_subquery(self, sel: SelectStatement) -> SimpleExpr;\n    fn in_tuples<V, I>(self, v: I) -> SimpleExpr;\n    fn is<R>(self, right: R) -> SimpleExpr;\n    fn is_in<V, I>(self, v: I) -> SimpleExpr;\n    fn is_not<R>(self, right: R) -> SimpleExpr;\n    fn is_not_in<V, I>(self, v: I) -> SimpleExpr;\n    fn is_not_null(self) -> SimpleExpr;\n    fn is_null(self) -> SimpleExpr;\n    fn left_shift<R>(self, right: R) -> SimpleExpr;\n    fn like<L>(self, like: L) -> SimpleExpr;\n    fn lt<R>(self, right: R) -> SimpleExpr;\n    fn lte<R>(self, right: R) -> SimpleExpr;\n    fn modulo<R>(self, right: R) -> SimpleExpr;\n    fn mul<R>(self, right: R) -> SimpleExpr;\n    fn ne<R>(self, right: R) -> SimpleExpr;\n    fn not(self) -> SimpleExpr;\n    fn not_between<A, B>(self, a: A, b: B) -> SimpleExpr;\n    fn not_equals<C>(self, col: C) -> SimpleExpr;\n    fn not_in_subquery(self, sel: SelectStatement) -> SimpleExpr;\n    fn not_like<L>(self, like: L) -> SimpleExpr;\n    fn or<R>(self, right: R) -> SimpleExpr;\n    fn right_shift<R>(self, right: R) -> SimpleExpr;\n    fn sub<R>(self, right: R) -> SimpleExpr;\n    fn bit_and<R>(self, right: R) -> SimpleExpr;\n    fn bit_or<R>(self, right: R) -> SimpleExpr;\n}\n")),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Added ",(0,r.kt)("inlineCode",{parentName:"li"},"ExprTrait")," to unify ",(0,r.kt)("inlineCode",{parentName:"li"},"Expr")," and ",(0,r.kt)("inlineCode",{parentName:"li"},"SimpleExpr")," methods"),(0,r.kt)("li",{parentName:"ul"},"Added ",(0,r.kt)("inlineCode",{parentName:"li"},"impl<T> ExprTrait for T where T: Into<SimpleExpr>")," to maintain backwards compatibility for all ",(0,r.kt)("inlineCode",{parentName:"li"},"Into<SimpleExpr>")," types, such as ",(0,r.kt)("inlineCode",{parentName:"li"},"Value")," and ",(0,r.kt)("inlineCode",{parentName:"li"},"FunctionCall")),(0,r.kt)("li",{parentName:"ul"},"Added ",(0,r.kt)("inlineCode",{parentName:"li"},"trait PgExpr: ExprTrait"),": database specific expression for Postgres and ",(0,r.kt)("inlineCode",{parentName:"li"},"impl PgExpr")," for ",(0,r.kt)("inlineCode",{parentName:"li"},"FunctionCall"),", ",(0,r.kt)("inlineCode",{parentName:"li"},"ColumnRef"),", ",(0,r.kt)("inlineCode",{parentName:"li"},"Keyword"),", ",(0,r.kt)("inlineCode",{parentName:"li"},"LikeExpr"),", ",(0,r.kt)("inlineCode",{parentName:"li"},"Value")),(0,r.kt)("li",{parentName:"ul"},"Added ",(0,r.kt)("inlineCode",{parentName:"li"},"trait SqliteExpr: ExprTrait"),": database specific expression for SQLite and ",(0,r.kt)("inlineCode",{parentName:"li"},"impl SqliteExpr")," for ",(0,r.kt)("inlineCode",{parentName:"li"},"FunctionCall"),", ",(0,r.kt)("inlineCode",{parentName:"li"},"ColumnRef"),", ",(0,r.kt)("inlineCode",{parentName:"li"},"Keyword"),", ",(0,r.kt)("inlineCode",{parentName:"li"},"LikeExpr"),", ",(0,r.kt)("inlineCode",{parentName:"li"},"Value"))),(0,r.kt)("h3",{id:"support-of-postgres-vector-774"},"Support of Postgres Vector ",(0,r.kt)("a",{parentName:"h3",href:"https://github.com/SeaQL/sea-query/pull/774"},"#774")),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Construct Postgres query with vector extension"),(0,r.kt)("li",{parentName:"ul"},"Added ",(0,r.kt)("inlineCode",{parentName:"li"},"postgres-vector")," feature flag"),(0,r.kt)("li",{parentName:"ul"},"Added ",(0,r.kt)("a",{parentName:"li",href:"https://docs.rs/sea-query/0.32.1/sea_query/value/enum.Value.html#variant.Vector"},(0,r.kt)("inlineCode",{parentName:"a"},"Value::Vector")),", ",(0,r.kt)("a",{parentName:"li",href:"https://docs.rs/sea-query/0.32.1/sea_query/table/enum.ColumnType.html#variant.Vector"},(0,r.kt)("inlineCode",{parentName:"a"},"ColumnType::Vector")),", ",(0,r.kt)("a",{parentName:"li",href:"https://docs.rs/sea-query/0.32.1/sea_query/table/struct.ColumnDef.html#method.vector"},(0,r.kt)("inlineCode",{parentName:"a"},"ColumnDef::vector()")),", ",(0,r.kt)("inlineCode",{parentName:"li"},"PgBinOper::EuclideanDistance"),", ",(0,r.kt)("inlineCode",{parentName:"li"},"PgBinOper::NegativeInnerProduct")," and ",(0,r.kt)("inlineCode",{parentName:"li"},"PgBinOper::CosineDistance"))),(0,r.kt)("p",null,"Example:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-rust"},'assert_eq!(\n    Query::select()\n        .columns([Char::Character])\n        .from(Char::Table)\n        .and_where(\n            Expr::col(Char::Character).eq(Expr::val(pgvector::Vector::from(vec![1.0, 2.0])))\n        )\n        .to_string(PostgresQueryBuilder),\n    r#"SELECT "character" FROM "character" WHERE "character" = \'[1,2]\'"#\n);\n')),(0,r.kt)("h3",{id:"support-partial-index-478"},"Support Partial Index ",(0,r.kt)("a",{parentName:"h3",href:"https://github.com/SeaQL/sea-query/pull/478"},"#478")),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Support partial index ",(0,r.kt)("inlineCode",{parentName:"li"},"CREATE INDEX .. WHERE .."))),(0,r.kt)("p",null,"Example (Postgres):"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-rust"},'assert_eq!(\n    Index::create()\n        .unique()\n        .nulls_not_distinct()\n        .name("partial-index-glyph-image-not-null")\n        .table(Glyph::Table)\n        .col(Glyph::Image)\n        .and_where(Expr::col(Glyph::Image).is_not_null())\n        .to_string(PostgresQueryBuilder),\n    r#"CREATE UNIQUE INDEX "partial-index-glyph-image-not-null" ON "glyph" ("image") NULLS NOT DISTINCT WHERE "image" IS NOT NULL"#\n);\n')),(0,r.kt)("p",null,"Example (Sqlite):"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-rust"},'assert_eq!(\n    Index::create()\n        .if_not_exists()\n        .unique()\n        .name("partial-index-glyph-image-not-null")\n        .table(Glyph::Table)\n        .col(Glyph::Image)\n        .and_where(Expr::col(Glyph::Image).is_not_null())\n        .to_string(SqliteQueryBuilder),\n    r#"CREATE UNIQUE INDEX IF NOT EXISTS "partial-index-glyph-image-not-null" ON "glyph" ("image") WHERE "image" IS NOT NULL"#\n);\n')),(0,r.kt)("h3",{id:"get-null-value"},"Get Null Value"),(0,r.kt)("p",null,"This one may seem a little bummer, but it is type system problem. In order to support the Postgres protocol, SeaQuery's ",(0,r.kt)("inlineCode",{parentName:"p"},"Value")," enum does not have a ",(0,r.kt)("inlineCode",{parentName:"p"},"Null")," variant. This new ",(0,r.kt)("a",{parentName:"p",href:"https://docs.rs/sea-query/0.32.1/sea_query/value/enum.Value.html#method.as_null"},(0,r.kt)("inlineCode",{parentName:"a"},"Value::as_null"))," method allows you to:"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"construct a typed null value"),(0,r.kt)("li",{parentName:"ol"},"nullify a value"),(0,r.kt)("li",{parentName:"ol"},"define generic functions (",(0,r.kt)("inlineCode",{parentName:"li"},"impl Into<Value>"),")")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-rust"},"let v = Value::Int(Some(2));\nlet n = v.as_null();\n\nassert_eq!(n, Value::Int(None));\n\n// one liner:\nassert_eq!(Into::<Value>::into(2.2).as_null(), Value::Double(None));\n")),(0,r.kt)("h3",{id:"bitwise-andor-operators-841"},"Bitwise AND/OR Operators ",(0,r.kt)("a",{parentName:"h3",href:"https://github.com/SeaQL/sea-query/pull/841"},"#841")),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Added bitwise and/or operators (",(0,r.kt)("a",{parentName:"li",href:"https://docs.rs/sea-query/0.32.1/sea_query/expr/trait.ExprTrait.html#method.bit_and"},(0,r.kt)("inlineCode",{parentName:"a"},"bit_and")),", ",(0,r.kt)("a",{parentName:"li",href:"https://docs.rs/sea-query/0.32.1/sea_query/expr/trait.ExprTrait.html#method.bit_or"},(0,r.kt)("inlineCode",{parentName:"a"},"bit_or")),")")),(0,r.kt)("p",null,"Examples:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-rust"},'let query = Query::select()\n    .expr(1.bit_and(2).eq(3))\n    .to_owned();\n\nassert_eq!(\n    query.to_string(PostgresQueryBuilder),\n    r#"SELECT (1 & 2) = 3"#\n);\n')),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-rust"},'let query = Query::select()\n    .expr(1.bit_or(2).eq(3))\n    .to_owned();\n\nassert_eq!(\n    query.to_string(PostgresQueryBuilder),\n    r#"SELECT (1 | 2) = 3"#\n);\n')),(0,r.kt)("h2",{id:"enhancements"},"Enhancements"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/SeaQL/sea-query/pull/817"},"#817")," Replaced ",(0,r.kt)("inlineCode",{parentName:"li"},"Educe")," with manual implementations",(0,r.kt)("ul",{parentName:"li"},(0,r.kt)("li",{parentName:"ul"},"This is an effort to cut down compilation time"))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/SeaQL/sea-query/pull/844"},"#844")," Added ",(0,r.kt)("inlineCode",{parentName:"li"},"GREATEST")," & ",(0,r.kt)("inlineCode",{parentName:"li"},"LEAST")," function"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/SeaQL/sea-query/pull/836"},"#836")," Added ",(0,r.kt)("inlineCode",{parentName:"li"},"ValueType::enum_type_name()")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/SeaQL/sea-query/pull/835"},"#835"),' Removed "one common table" restriction on recursive CTE')),(0,r.kt)("h3",{id:"sea-query-derive"},(0,r.kt)("inlineCode",{parentName:"h3"},"sea-query-derive")),(0,r.kt)("p",null,"We've finally done it! Removing the last bit of ",(0,r.kt)("inlineCode",{parentName:"p"},"syn")," v1 from our dependency tree:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"sea-query % cargo tree |grep 'syn '\n\u2502   \u2514\u2500\u2500 syn v2.0.39\n    \u2502   \u2502   \u2514\u2500\u2500 syn v2.0.39 (*)\n    \u2502       \u2514\u2500\u2500 syn v2.0.39 (*)\n    \u251c\u2500\u2500 syn v2.0.39 (*)\n            \u2514\u2500\u2500 syn v2.0.39 (*)\n\u2502   \u2502   \u2514\u2500\u2500 syn v2.0.39 (*)\n")),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Merged ",(0,r.kt)("inlineCode",{parentName:"li"},"#[enum_def]")," into ",(0,r.kt)("inlineCode",{parentName:"li"},"sea-query-derive")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/SeaQL/sea-query/pull/769"},"#769")," ",(0,r.kt)("inlineCode",{parentName:"li"},"#[enum_def]")," now impl additional ",(0,r.kt)("inlineCode",{parentName:"li"},"IdenStatic")," and ",(0,r.kt)("inlineCode",{parentName:"li"},"AsRef<str>"))),(0,r.kt)("h3",{id:"sea-query-attr"},(0,r.kt)("inlineCode",{parentName:"h3"},"sea-query-attr")),(0,r.kt)("p",null,"We've merged this crate into ",(0,r.kt)("inlineCode",{parentName:"p"},"sea-query-derive"),", and they will be maintained together from now on."),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Updated ",(0,r.kt)("inlineCode",{parentName:"li"},"syn"),", ",(0,r.kt)("inlineCode",{parentName:"li"},"heck")," and ",(0,r.kt)("inlineCode",{parentName:"li"},"darling")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"sea-query-attr")," is now deprecated")),(0,r.kt)("h2",{id:"upgrades"},"Upgrades"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/SeaQL/sea-query/pull/798"},"#798")," Upgraded ",(0,r.kt)("inlineCode",{parentName:"li"},"sqlx")," to ",(0,r.kt)("inlineCode",{parentName:"li"},"0.8")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/SeaQL/sea-query/pull/798"},"#798")," Upgraded ",(0,r.kt)("inlineCode",{parentName:"li"},"bigdecimal")," to ",(0,r.kt)("inlineCode",{parentName:"li"},"0.4")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/SeaQL/sea-query/pull/802"},"#802")," Upgraded ",(0,r.kt)("inlineCode",{parentName:"li"},"rusqlite")," to ",(0,r.kt)("inlineCode",{parentName:"li"},"0.32"))),(0,r.kt)("h2",{id:"integration-examples"},"Integration Examples"),(0,r.kt)("p",null,"SeaQuery plays well with the other crates in the rust ecosystem. "),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/SeaQL/sea-query/tree/master/examples/postgres"},"Postgres Example")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/SeaQL/sea-query/tree/master/examples/rusqlite"},"Rusqlite Example")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/SeaQL/sea-query/tree/master/examples/sqlx_mysql"},"SQLx MySql Example")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/SeaQL/sea-query/tree/master/examples/sqlx_postgres"},"SQLx Postgres Example")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/SeaQL/sea-query/tree/master/examples/sqlx_sqlite"},"SQLx Sqlite Example"))),(0,r.kt)("h2",{id:"community"},"Community"),(0,r.kt)("p",null,"SeaQL.org is an independent open-source organization run by passionate \ufe0fdevelopers. If you like our projects, please star \u2b50 and share our repositories. If you feel generous, a small donation via ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/sponsors/SeaQL"},"GitHub Sponsor")," will be greatly appreciated, and goes a long way towards sustaining the organization \ud83d\udea2."),(0,r.kt)("p",null,"SeaQuery is a community driven project. We welcome you to participate, contribute and together build for Rust's future \ud83e\udd80."),(0,r.kt)("h2",{id:"rustacean-sticker-pack-"},"Rustacean Sticker Pack \ud83e\udd80"),(0,r.kt)("p",null,"The Rustacean Sticker Pack is the perfect way to express your passion for Rust.\nOur stickers are made with a premium water-resistant vinyl with a unique matte finish.\nStick them on your laptop, notebook, or any gadget to show off your love for Rust!"),(0,r.kt)("p",null,"Moreover, all proceeds contributes directly to the ongoing development of SeaQL projects."),(0,r.kt)("p",null,"Sticker Pack Contents:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"Logo of SeaQL projects: SeaQL, SeaORM, SeaQuery, Seaography, FireDBG"),(0,r.kt)("li",{parentName:"ul"},"Mascot of SeaQL: Terres the Hermit Crab"),(0,r.kt)("li",{parentName:"ul"},"Mascot of Rust: Ferris the Crab"),(0,r.kt)("li",{parentName:"ul"},"The Rustacean word")),(0,r.kt)("p",null,(0,r.kt)("a",{parentName:"p",href:"https://www.sea-ql.org/sticker-pack/"},"Support SeaQL and get a Sticker Pack!")),(0,r.kt)("a",{href:"https://www.sea-ql.org/sticker-pack/"},(0,r.kt)("img",{style:{borderRadius:"25px"},alt:"Rustacean Sticker Pack by SeaQL",src:"https://www.sea-ql.org/static/sticker-pack-1s.jpg"})))}m.isMDXComponent=!0}}]);