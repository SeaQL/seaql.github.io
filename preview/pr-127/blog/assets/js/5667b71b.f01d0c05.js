"use strict";(self.webpackChunksea_ql_blog=self.webpackChunksea_ql_blog||[]).push([[7541],{9680:(e,t,a)=>{a.d(t,{Zo:()=>m,kt:()=>c});var n=a(6687);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function i(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function l(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?i(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):i(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function o(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},i=Object.keys(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)a=i[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var s=n.createContext({}),p=function(e){var t=n.useContext(s),a=t;return e&&(a="function"==typeof e?e(t):l(l({},t),e)),a},m=function(e){var t=p(e.components);return n.createElement(s.Provider,{value:t},e.children)},h={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,i=e.originalType,s=e.parentName,m=o(e,["components","mdxType","originalType","parentName"]),u=p(a),c=r,k=u["".concat(s,".").concat(c)]||u[c]||h[c]||i;return a?n.createElement(k,l(l({ref:t},m),{},{components:a})):n.createElement(k,l({ref:t},m))}));function c(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var i=a.length,l=new Array(i);l[0]=u;var o={};for(var s in t)hasOwnProperty.call(t,s)&&(o[s]=t[s]);o.originalType=e,o.mdxType="string"==typeof e?e:r,l[1]=o;for(var p=2;p<i;p++)l[p]=a[p];return n.createElement.apply(null,l)}return n.createElement.apply(null,a)}u.displayName="MDXCreateElement"},511:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>s,contentTitle:()=>l,default:()=>h,frontMatter:()=>i,metadata:()=>o,toc:()=>p});var n=a(1308),r=(a(6687),a(9680));const i={slug:"2022-11-10-whats-new-in-0.10.x",title:"What's new in SeaORM 0.10.x",author:"SeaQL Team",author_title:"Chris Tsang",author_url:"https://github.com/SeaQL",author_image_url:"https://www.sea-ql.org/SeaORM/img/SeaQL.png",tags:["news"]},l=void 0,o={permalink:"/preview/pr-127/blog/2022-11-10-whats-new-in-0.10.x",editUrl:"https://github.com/SeaQL/seaql.github.io/edit/master/Blog/blog/2022-11-10-whats-new-in-0.10.x.md",source:"@site/blog/2022-11-10-whats-new-in-0.10.x.md",title:"What's new in SeaORM 0.10.x",description:"\ud83c\udf89 We are pleased to release SeaORM 0.10.0!",date:"2022-11-10T00:00:00.000Z",formattedDate:"November 10, 2022",tags:[{label:"news",permalink:"/preview/pr-127/blog/tags/news"}],readingTime:6.68,hasTruncateMarker:!1,authors:[{name:"SeaQL Team",title:"Chris Tsang",url:"https://github.com/SeaQL",imageURL:"https://www.sea-ql.org/SeaORM/img/SeaQL.png"}],frontMatter:{slug:"2022-11-10-whats-new-in-0.10.x",title:"What's new in SeaORM 0.10.x",author:"SeaQL Team",author_title:"Chris Tsang",author_url:"https://github.com/SeaQL",author_image_url:"https://www.sea-ql.org/SeaORM/img/SeaQL.png",tags:["news"]},prevItem:{title:"What's new in Seaography 0.3.0",permalink:"/preview/pr-127/blog/2022-12-02-whats-new-in-seaography-0.3.0"},nextItem:{title:"Toggle Stacked Download Graph in crates.io",permalink:"/preview/pr-127/blog/2022-11-09-toggle-stacked-download-graph-in-crates-io"}},s={authorsImageUrls:[void 0]},p=[{value:"Rust 1.65",id:"rust-165",level:2},{value:"Support Array Data Types in Postgres",id:"support-array-data-types-in-postgres",level:2},{value:"Better Error Types",id:"better-error-types",level:2},{value:"Run Migration on Any Postgres Schema",id:"run-migration-on-any-postgres-schema",level:2},{value:"Breaking Changes",id:"breaking-changes",level:2},{value:"SeaORM Enhancements",id:"seaorm-enhancements",level:2},{value:"CLI Enhancements",id:"cli-enhancements",level:2},{value:"Integration Examples",id:"integration-examples",level:2},{value:"Sponsor",id:"sponsor",level:2},{value:"Community",id:"community",level:2}],m={toc:p};function h(e){let{components:t,...a}=e;return(0,r.kt)("wrapper",(0,n.Z)({},m,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"\ud83c\udf89 We are pleased to release SeaORM ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/SeaQL/sea-orm/releases/tag/0.10.0"},(0,r.kt)("inlineCode",{parentName:"a"},"0.10.0")),"!"),(0,r.kt)("h2",{id:"rust-165"},"Rust 1.65"),(0,r.kt)("p",null,"The long-anticipated Rust ",(0,r.kt)("a",{parentName:"p",href:"https://blog.rust-lang.org/2022/11/03/Rust-1.65.0.html"},"1.65")," has been released! Generic associated types (GATs) must be the hottest newly-stabilized feature."),(0,r.kt)("p",null,"How is GAT useful to SeaORM? Let's take a look at the following:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-rust"},"trait StreamTrait<'a>: Send + Sync {\n    type Stream: Stream<Item = Result<QueryResult, DbErr>> + Send;\n\n    fn stream(\n        &'a self,\n        stmt: Statement,\n    ) -> Pin<Box<dyn Future<Output = Result<Self::Stream, DbErr>> + 'a + Send>>;\n}\n")),(0,r.kt)("p",null,"You can see that the ",(0,r.kt)("inlineCode",{parentName:"p"},"Future")," has a lifetime ",(0,r.kt)("inlineCode",{parentName:"p"},"'a"),", but as a side effect the lifetime is tied to ",(0,r.kt)("inlineCode",{parentName:"p"},"StreamTrait"),"."),(0,r.kt)("p",null,"With GAT, the lifetime can be elided:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-rust"},"trait StreamTrait: Send + Sync {\n    type Stream<'a>: Stream<Item = Result<QueryResult, DbErr>> + Send\n    where\n        Self: 'a;\n\n    fn stream<'a>(\n        &'a self,\n        stmt: Statement,\n    ) -> Pin<Box<dyn Future<Output = Result<Self::Stream<'a>, DbErr>> + 'a + Send>>;\n}\n")),(0,r.kt)("p",null,"What benefit does it bring in practice? Consider you have a function that accepts a generic ",(0,r.kt)("inlineCode",{parentName:"p"},"ConnectionTrait")," and calls ",(0,r.kt)("inlineCode",{parentName:"p"},"stream()"),": "),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-rust"},"async fn processor<'a, C>(conn: &'a C) -> Result<...>\nwhere C: ConnectionTrait + StreamTrait<'a> {...}\n")),(0,r.kt)("p",null,"The fact that the lifetime of the connection is tied to the stream can create confusion to the compiler, most likely when you are making transactions:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-rust"},"async fn do_transaction<C>(conn: &C) -> Result<...>\nwhere C: ConnectionTrait + TransactionTrait\n{\n    let txn = conn.begin().await?;\n    processor(&txn).await?;\n    txn.commit().await?;\n}\n")),(0,r.kt)("p",null,"But now, with the lifetime of the stream elided, it's much easier to work on streams inside transactions because the two lifetimes are now distinct and the stream's lifetime is implicit:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-rust"},"async fn processor<C>(conn: &C) -> Result<...>\nwhere C: ConnectionTrait + StreamTrait {...}\n")),(0,r.kt)("p",null,"Big thanks to ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/nappa85"},"@nappa85")," for the ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/SeaQL/sea-orm/pull/1161"},"contribution"),"."),(0,r.kt)("hr",null),(0,r.kt)("p",null,"Below are some feature highlights \ud83c\udf1f:"),(0,r.kt)("h2",{id:"support-array-data-types-in-postgres"},"Support Array Data Types in Postgres"),(0,r.kt)("p",null,"[",(0,r.kt)("a",{parentName:"p",href:"https://github.com/SeaQL/sea-orm/pull/1132"},"#1132"),"] Support model field of type ",(0,r.kt)("inlineCode",{parentName:"p"},"Vec<T>"),". (by ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/hf29h8sh321"},"@hf29h8sh321"),", ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/ikrivosheev"},"@ikrivosheev"),", ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/tyt2y3"},"@tyt2y3"),", ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/billy1624"},"@billy1624"),")"),(0,r.kt)("p",null,"You can define a vector of types that are already supported by SeaORM in the model."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-rust"},'#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]\n#[sea_orm(table_name = "collection")]\npub struct Model {\n    #[sea_orm(primary_key)]\n    pub id: i32,\n    pub integers: Vec<i32>,\n    pub integers_opt: Option<Vec<i32>>,\n    pub floats: Vec<f32>,\n    pub doubles: Vec<f64>,\n    pub strings: Vec<String>,\n}\n')),(0,r.kt)("p",null,"Keep in mind that you need to enable the ",(0,r.kt)("inlineCode",{parentName:"p"},"postgres-array")," feature and this is a Postgres only feature."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-toml"},'sea-orm = { version = "0.10", features = ["postgres-array", ...] }\n')),(0,r.kt)("h2",{id:"better-error-types"},"Better Error Types"),(0,r.kt)("p",null,"[",(0,r.kt)("a",{parentName:"p",href:"https://github.com/SeaQL/sea-orm/pull/750"},"#750"),", ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/SeaQL/sea-orm/pull/1002"},"#1002"),"] Error types with parsable database specific error. (by ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/mohs8421"},"@mohs8421"),", ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/tyt2y3"},"@tyt2y3"),")"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-rust"},'let mud_cake = cake::ActiveModel {\n    id: Set(1),\n    name: Set("Moldy Cake".to_owned()),\n    price: Set(dec!(10.25)),\n    gluten_free: Set(false),\n    serial: Set(Uuid::new_v4()),\n    bakery_id: Set(None),\n};\n\n// Insert a new cake with its primary key (`id` column) set to 1.\nlet cake = mud_cake.save(db).await.expect("could not insert cake");\n\n// Insert the same row again and it failed\n// because primary key of each row should be unique.\nlet error: DbErr = cake\n    .into_active_model()\n    .insert(db)\n    .await\n    .expect_err("inserting should fail due to duplicate primary key");\n\nmatch error {\n    DbErr::Exec(RuntimeErr::SqlxError(error)) => match error {\n        Error::Database(e) => {\n            // We check the error code thrown by the database (MySQL in this case),\n            // `23000` means `ER_DUP_KEY`: we have a duplicate key in the table.\n            assert_eq!(e.code().unwrap(), "23000");\n        }\n        _ => panic!("Unexpected sqlx-error kind"),\n    },\n    _ => panic!("Unexpected Error kind"),\n}\n')),(0,r.kt)("h2",{id:"run-migration-on-any-postgres-schema"},"Run Migration on Any Postgres Schema"),(0,r.kt)("p",null,"[",(0,r.kt)("a",{parentName:"p",href:"https://github.com/SeaQL/sea-orm/pull/1056"},"#1056"),"] By default migration will be run on the ",(0,r.kt)("inlineCode",{parentName:"p"},"public")," schema, you can now override it when running migration on the CLI or programmatically. (by ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/MattGson"},"@MattGson"),", ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/nahuakang"},"@nahuakang"),", ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/billy1624"},"@billy1624"),")"),(0,r.kt)("p",null,"For CLI, you can specify the target schema with ",(0,r.kt)("inlineCode",{parentName:"p"},"-s")," / ",(0,r.kt)("inlineCode",{parentName:"p"},"--database_schema")," option:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"via sea-orm-cli: ",(0,r.kt)("inlineCode",{parentName:"li"},"sea-orm-cli migrate -u postgres://root:root@localhost/database -s my_schema")),(0,r.kt)("li",{parentName:"ul"},"via SeaORM migrator: ",(0,r.kt)("inlineCode",{parentName:"li"},"cargo run -- -u postgres://root:root@localhost/database -s my_schema"))),(0,r.kt)("p",null,"You can also run the migration on the target schema programmatically:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-rust"},'let connect_options = ConnectOptions::new("postgres://root:root@localhost/database".into())\n    .set_schema_search_path("my_schema".into()) // Override the default schema\n    .to_owned();\n\nlet db = Database::connect(connect_options).await?\n\nmigration::Migrator::up(&db, None).await?;\n')),(0,r.kt)("h2",{id:"breaking-changes"},"Breaking Changes"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"[",(0,r.kt)("a",{parentName:"p",href:"https://github.com/SeaQL/sea-orm/pull/789"},"#789"),"] Replaced ",(0,r.kt)("inlineCode",{parentName:"p"},"usize")," with ",(0,r.kt)("inlineCode",{parentName:"p"},"u64")," in ",(0,r.kt)("inlineCode",{parentName:"p"},"PaginatorTrait")," (by ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/liberwang1013"},"@liberwang1013"),")")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},"[",(0,r.kt)("a",{parentName:"p",href:"https://github.com/SeaQL/sea-orm/pull/1002"},"#1002"),"] Type signature of ",(0,r.kt)("inlineCode",{parentName:"p"},"DbErr")," changed as a result of the PR (by ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/mohs8421"},"@mohs8421"),", ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/tyt2y3"},"@tyt2y3"),")")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("inlineCode",{parentName:"p"},"ColumnType::Enum")," structure changed:"))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-rust"},"enum ColumnType {\n    // then\n    Enum(String, Vec<String>)\n\n    // now\n    Enum {\n        /// Name of enum\n        name: DynIden,\n        /// Variants of enum\n        variants: Vec<DynIden>,\n    }\n    ...\n}\n")),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"A new method ",(0,r.kt)("inlineCode",{parentName:"li"},"array_type")," was added to ",(0,r.kt)("inlineCode",{parentName:"li"},"ValueType"),":")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-rust"},"impl sea_orm::sea_query::ValueType for MyType {\n    fn array_type() -> sea_orm::sea_query::ArrayType {\n        sea_orm::sea_query::ArrayType::TypeName\n    }\n    ...\n}\n")),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("inlineCode",{parentName:"li"},"ActiveEnum::name()")," changed return type to ",(0,r.kt)("inlineCode",{parentName:"li"},"DynIden"),":")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-rust"},'#[derive(Debug, Iden)]\n#[iden = "category"]\npub struct CategoryEnum;\n\nimpl ActiveEnum for Category {\n    // then\n    fn name() -> String {\n        "category".to_owned()\n    }\n\n    // now\n    fn name() -> DynIden {\n        SeaRc::new(CategoryEnum)\n    }\n    ...\n}\n')),(0,r.kt)("h2",{id:"seaorm-enhancements"},"SeaORM Enhancements"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"[",(0,r.kt)("a",{parentName:"li",href:"https://github.com/SeaQL/sea-orm/pull/995"},"#995"),"] Support ",(0,r.kt)("inlineCode",{parentName:"li"},"time")," crate for SQLite (by ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/billy1624"},"@billy1624"),")"),(0,r.kt)("li",{parentName:"ul"},"[",(0,r.kt)("a",{parentName:"li",href:"https://github.com/SeaQL/sea-orm/pull/902"},"#902"),"] Support ",(0,r.kt)("inlineCode",{parentName:"li"},"distinct")," & ",(0,r.kt)("inlineCode",{parentName:"li"},"distinct_on")," expression (by ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/edg"},"@edg"),"-l, ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/kyoto7250"},"@kyoto7250"),")"),(0,r.kt)("li",{parentName:"ul"},"[",(0,r.kt)("a",{parentName:"li",href:"https://github.com/SeaQL/sea-orm/pull/973"},"#973"),"] ",(0,r.kt)("inlineCode",{parentName:"li"},"fn column()")," also handle enum type (by ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/tyt2y3"},"@tyt2y3"),", ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/billy1624"},"@billy1624"),")"),(0,r.kt)("li",{parentName:"ul"},"[",(0,r.kt)("a",{parentName:"li",href:"https://github.com/SeaQL/sea-orm/pull/897"},"#897"),"] Added ",(0,r.kt)("inlineCode",{parentName:"li"},"acquire_timeout")," on ",(0,r.kt)("inlineCode",{parentName:"li"},"ConnectOptions")," (by ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/001wwang"},"@001wwang"),", ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/billy1624"},"@billy1624"),")"),(0,r.kt)("li",{parentName:"ul"},"[",(0,r.kt)("a",{parentName:"li",href:"https://github.com/SeaQL/sea-orm/pull/1020"},"#1020"),"] Better compile error for entity without primary key (by ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/Sytten"},"@Sytten"),", ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/billy1624"},"@billy1624"),")"),(0,r.kt)("li",{parentName:"ul"},"[",(0,r.kt)("a",{parentName:"li",href:"https://github.com/SeaQL/sea-orm/pull/833"},"#833"),"] Added blanket implementations of ",(0,r.kt)("inlineCode",{parentName:"li"},"IntoActiveValue")," for ",(0,r.kt)("inlineCode",{parentName:"li"},"Option")," values (by ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/wdcocq"},"@wdcocq"),")"),(0,r.kt)("li",{parentName:"ul"},"[",(0,r.kt)("a",{parentName:"li",href:"https://github.com/SeaQL/sea-orm/pull/1112"},"#1112"),"] Added ",(0,r.kt)("inlineCode",{parentName:"li"},"into_model")," & ",(0,r.kt)("inlineCode",{parentName:"li"},"into_json")," to ",(0,r.kt)("inlineCode",{parentName:"li"},"Cursor")," (by ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/jukanntenn"},"@jukanntenn"),", ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/billy1624"},"@billy1624"),")"),(0,r.kt)("li",{parentName:"ul"},"[",(0,r.kt)("a",{parentName:"li",href:"https://github.com/SeaQL/sea-orm/pull/1056"},"#1056"),"] Added ",(0,r.kt)("inlineCode",{parentName:"li"},"set_schema_search_path")," method to ",(0,r.kt)("inlineCode",{parentName:"li"},"ConnectOptions")," for setting schema search path of PostgreSQL connection (by ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/MattGson"},"@MattGson"),", ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/billy1624"},"@billy1624"),")"),(0,r.kt)("li",{parentName:"ul"},"[",(0,r.kt)("a",{parentName:"li",href:"https://github.com/SeaQL/sea-orm/pull/1042"},"#1042"),"] Serialize ",(0,r.kt)("inlineCode",{parentName:"li"},"time")," types as ",(0,r.kt)("inlineCode",{parentName:"li"},"serde_json::Value")," (by ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/jimmycuadra"},"@jimmycuadra"),", ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/billy1624"},"@billy1624"),")"),(0,r.kt)("li",{parentName:"ul"},"[",(0,r.kt)("a",{parentName:"li",href:"https://github.com/SeaQL/sea-orm/pull/986"},"#986"),"] Implements ",(0,r.kt)("inlineCode",{parentName:"li"},"fmt::Display")," for ",(0,r.kt)("inlineCode",{parentName:"li"},"ActiveEnum")," (by ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/jesseduffield"},"@jesseduffield"),", ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/billy264"},"@billy264"),")"),(0,r.kt)("li",{parentName:"ul"},"[",(0,r.kt)("a",{parentName:"li",href:"https://github.com/SeaQL/sea-orm/pull/990"},"#990"),"] Implements ",(0,r.kt)("inlineCode",{parentName:"li"},"TryFrom<ActiveModel>")," for ",(0,r.kt)("inlineCode",{parentName:"li"},"Model")," (by ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/MattGson"},"@MattGson"),", ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/greenhandatsjtu"},"@greenhandatsjtu"),")")),(0,r.kt)("h2",{id:"cli-enhancements"},"CLI Enhancements"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"[",(0,r.kt)("a",{parentName:"li",href:"https://github.com/SeaQL/sea-orm/pull/1052"},"#1052"),"] Escape module name defined with Rust keywords (by ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/andy128k"},"@andy128k"),")"),(0,r.kt)("li",{parentName:"ul"},"[",(0,r.kt)("a",{parentName:"li",href:"https://github.com/SeaQL/sea-orm/pull/879"},"#879"),", ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/SeaQL/sea-orm/pull/1155"},"#1155"),"] Check to make sure migration name doesn't contain hyphen ",(0,r.kt)("inlineCode",{parentName:"li"},"-")," in it (by ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/AngelOnFira"},"@AngelOnFira"),")"),(0,r.kt)("li",{parentName:"ul"},"[",(0,r.kt)("a",{parentName:"li",href:"https://github.com/SeaQL/sea-orm/pull/953"},"#953"),"] Generate entity files as a library or module (by ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/viktorbahr"},"@viktorbahr"),", ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/HigherOrderLogic"},"@HigherOrderLogic"),")"),(0,r.kt)("li",{parentName:"ul"},"[",(0,r.kt)("a",{parentName:"li",href:"https://github.com/SeaQL/sea-orm/pull/947"},"#947"),"] Generate a new migration template with name prefix of unix timestamp (by ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/Animeshz"},"@Animeshz"),")"),(0,r.kt)("li",{parentName:"ul"},"[",(0,r.kt)("a",{parentName:"li",href:"https://github.com/SeaQL/sea-orm/pull/933"},"#933"),"] Generate migration in modules (by ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/remlse"},"@remlse"),")"),(0,r.kt)("li",{parentName:"ul"},"[",(0,r.kt)("a",{parentName:"li",href:"https://github.com/SeaQL/sea-orm/pull/1019"},"#1019"),"] Generate ",(0,r.kt)("inlineCode",{parentName:"li"},"DeriveRelation")," on empty ",(0,r.kt)("inlineCode",{parentName:"li"},"Relation")," enum (by ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/alper"},"@alper"),", ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/billy1624"},"@billy1624"),")"),(0,r.kt)("li",{parentName:"ul"},"[",(0,r.kt)("a",{parentName:"li",href:"https://github.com/SeaQL/sea-orm/pull/988"},"#988"),"] Generate entity derive ",(0,r.kt)("inlineCode",{parentName:"li"},"Eq")," if possible (by ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/billy1624"},"@billy1624"),", ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/w93163red"},"@w93163red"),")"),(0,r.kt)("li",{parentName:"ul"},"[",(0,r.kt)("a",{parentName:"li",href:"https://github.com/SeaQL/sea-orm/pull/1056"},"#1056"),"] Run migration on any PostgreSQL schema (by ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/MattGson"},"@MattGson"),", ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/billy1624"},"@billy1624"),")"),(0,r.kt)("li",{parentName:"ul"},"[",(0,r.kt)("a",{parentName:"li",href:"https://github.com/SeaQL/sea-orm/pull/864"},"#864"),", ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/SeaQL/sea-orm/pull/991"},"#991"),"] ",(0,r.kt)("inlineCode",{parentName:"li"},"migrate fresh")," command will drop all PostgreSQL types (by ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/MaderNoob"},"@MaderNoob"),", ",(0,r.kt)("a",{parentName:"li",href:"https://github.com/karpa4o4"},"@karpa4o4"),")")),(0,r.kt)("p",null,"Please check ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/SeaQL/sea-orm/blob/master/CHANGELOG.md#0101---2022-10-27"},"here")," for the complete changelog."),(0,r.kt)("h2",{id:"integration-examples"},"Integration Examples"),(0,r.kt)("p",null,"SeaORM plays well with the other crates in the async ecosystem. We maintain an array of example projects for building REST, GraphQL and gRPC services. More examples ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/SeaQL/sea-orm/issues/269"},"wanted"),"!"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/SeaQL/sea-orm/tree/master/examples/actix_example"},"Actix v4 Example")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/SeaQL/sea-orm/tree/master/examples/axum_example"},"Axum Example")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/SeaQL/sea-orm/tree/master/examples/graphql_example"},"GraphQL Example")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/SeaQL/sea-orm/tree/master/examples/jsonrpsee_example"},"jsonrpsee Example")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/SeaQL/sea-orm/tree/master/examples/poem_example"},"Poem Example")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/SeaQL/sea-orm/tree/master/examples/rocket_example"},"Rocket Example")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/SeaQL/sea-orm/tree/master/examples/salvo_example"},"Salvo Example")),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("a",{parentName:"li",href:"https://github.com/SeaQL/sea-orm/tree/master/examples/tonic_example"},"Tonic Example"))),(0,r.kt)("h2",{id:"sponsor"},"Sponsor"),(0,r.kt)("p",null,"Our ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/sponsors/SeaQL"},"GitHub Sponsor")," profile is up! If you feel generous, a small donation will be greatly appreciated."),(0,r.kt)("p",null,"A big shout out to our sponsors \ud83d\ude07:"),(0,r.kt)("div",{class:"row"},(0,r.kt)("div",{class:"col col--6 margin-bottom--md"},(0,r.kt)("div",{class:"avatar"},(0,r.kt)("a",{class:"avatar__photo-link avatar__photo avatar__photo--sm",href:"https://github.com/Sytten"},(0,r.kt)("img",{src:"https://avatars.githubusercontent.com/u/2366731?v=4"})),(0,r.kt)("div",{class:"avatar__intro"},(0,r.kt)("div",{class:"avatar__name"},"\xc9mile Fugulin")))),(0,r.kt)("div",{class:"col col--6 margin-bottom--md"},(0,r.kt)("div",{class:"avatar"},(0,r.kt)("a",{class:"avatar__photo-link avatar__photo avatar__photo--sm",href:"https://github.com/deansheather"},(0,r.kt)("img",{src:"https://avatars.githubusercontent.com/u/11241812?v=4"})),(0,r.kt)("div",{class:"avatar__intro"},(0,r.kt)("div",{class:"avatar__name"},"Dean Sheather")))),(0,r.kt)("div",{class:"col col--6 margin-bottom--md"},(0,r.kt)("div",{class:"avatar"},(0,r.kt)("a",{class:"avatar__photo-link avatar__photo avatar__photo--sm",href:"https://github.com/shanesveller"},(0,r.kt)("img",{src:"https://avatars.githubusercontent.com/u/831?v=4"})),(0,r.kt)("div",{class:"avatar__intro"},(0,r.kt)("div",{class:"avatar__name"},"Shane Sveller")))),(0,r.kt)("div",{class:"col col--6 margin-bottom--md"},(0,r.kt)("div",{class:"avatar"},(0,r.kt)("a",{class:"avatar__photo-link avatar__photo avatar__photo--sm",href:"https://github.com/sakti"},(0,r.kt)("img",{src:"https://avatars.githubusercontent.com/u/196178?v=4"})),(0,r.kt)("div",{class:"avatar__intro"},(0,r.kt)("div",{class:"avatar__name"},"Sakti Dwi Cahyono")))),(0,r.kt)("div",{class:"col col--6 margin-bottom--md"},(0,r.kt)("div",{class:"avatar"},(0,r.kt)("a",{class:"avatar__photo-link avatar__photo avatar__photo--sm",href:"https://github.com/hgiesel"},(0,r.kt)("img",{src:"https://avatars.githubusercontent.com/u/7188844?v=4"})),(0,r.kt)("div",{class:"avatar__intro"},(0,r.kt)("div",{class:"avatar__name"},"Henrik Giesel")))),(0,r.kt)("div",{class:"col col--6 margin-bottom--md"},(0,r.kt)("div",{class:"avatar"},(0,r.kt)("a",{class:"avatar__photo-link avatar__photo avatar__photo--sm",href:"https://github.com/trueb2"},(0,r.kt)("img",{src:"https://avatars.githubusercontent.com/u/8592049?v=4"})),(0,r.kt)("div",{class:"avatar__intro"},(0,r.kt)("div",{class:"avatar__name"},"Jacob Trueb")))),(0,r.kt)("div",{class:"col col--6 margin-bottom--md"},(0,r.kt)("div",{class:"avatar"},(0,r.kt)("a",{class:"avatar__photo-link avatar__photo avatar__photo--sm",href:"https://github.com/marcusbuffett"},(0,r.kt)("img",{src:"https://avatars.githubusercontent.com/u/1834328?v=4"})),(0,r.kt)("div",{class:"avatar__intro"},(0,r.kt)("div",{class:"avatar__name"},"Marcus Buffett")))),(0,r.kt)("div",{class:"col col--6 margin-bottom--md"},(0,r.kt)("div",{class:"avatar"},(0,r.kt)("a",{class:"avatar__photo-link avatar__photo avatar__photo--sm"},(0,r.kt)("img",{style:{width:"100%"},src:"data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="})),(0,r.kt)("div",{class:"avatar__intro"},(0,r.kt)("div",{class:"avatar__name"},"Unnamed Sponsor")))),(0,r.kt)("div",{class:"col col--6 margin-bottom--md"},(0,r.kt)("div",{class:"avatar"},(0,r.kt)("a",{class:"avatar__photo-link avatar__photo avatar__photo--sm"},(0,r.kt)("img",{style:{width:"100%"},src:"data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw=="})),(0,r.kt)("div",{class:"avatar__intro"},(0,r.kt)("div",{class:"avatar__name"},"Unnamed Sponsor"))))),(0,r.kt)("h2",{id:"community"},"Community"),(0,r.kt)("p",null,"SeaQL is a community driven project. We welcome you to participate, contribute and together build for Rust's future."),(0,r.kt)("p",null,"Here is the roadmap for SeaORM ",(0,r.kt)("a",{parentName:"p",href:"https://github.com/SeaQL/sea-orm/milestone/11"},(0,r.kt)("inlineCode",{parentName:"a"},"0.11.x")),"."))}h.isMDXComponent=!0}}]);