"use strict";(self.webpackChunksea_orm=self.webpackChunksea_orm||[]).push([[35917],{48859:(e,t,r)=>{r.d(t,{Zo:()=>c,kt:()=>m});var a=r(76687);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,a,n=function(e,t){if(null==e)return{};var r,a,n={},o=Object.keys(e);for(a=0;a<o.length;a++)r=o[a],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)r=o[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var l=a.createContext({}),u=function(e){var t=a.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},c=function(e){var t=u(e.components);return a.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,o=e.originalType,l=e.parentName,c=s(e,["components","mdxType","originalType","parentName"]),d=u(r),m=n,y=d["".concat(l,".").concat(m)]||d[m]||p[m]||o;return r?a.createElement(y,i(i({ref:t},c),{},{components:r})):a.createElement(y,i({ref:t},c))}));function m(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=r.length,i=new Array(o);i[0]=d;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:n,i[1]=s;for(var u=2;u<o;u++)i[u]=r[u];return a.createElement.apply(null,i)}return a.createElement.apply(null,r)}d.displayName="MDXCreateElement"},16978:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>p,frontMatter:()=>o,metadata:()=>s,toc:()=>u});var a=r(31308),n=(r(76687),r(48859));const o={},i="Robust & Correct",s={unversionedId:"write-test/testing",id:"version-0.10.x/write-test/testing",title:"Robust & Correct",description:"Testing is an integral part of programming in Rust. You see, cargo test is built-in.",source:"@site/versioned_docs/version-0.10.x/07-write-test/01-testing.md",sourceDirName:"07-write-test",slug:"/write-test/testing",permalink:"/SeaORM/docs/0.10.x/write-test/testing",draft:!1,editUrl:"https://github.com/SeaQL/seaql.github.io/edit/master/SeaORM/versioned_docs/version-0.10.x/07-write-test/01-testing.md",tags:[],version:"0.10.x",lastUpdatedBy:"Billy Chan",lastUpdatedAt:1705892762,formattedLastUpdatedAt:"Jan 22, 2024",sidebarPosition:1,frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Bakery Schema",permalink:"/SeaORM/docs/0.10.x/relation/bakery-schema"},next:{title:"Mock Interface",permalink:"/SeaORM/docs/0.10.x/write-test/mock"}},l={},u=[{value:"Types of Errors",id:"types-of-errors",level:2},{value:"1. Type Errors",id:"1-type-errors",level:3},{value:"2. Transaction Errors",id:"2-transaction-errors",level:3},{value:"3. Behavioural Errors",id:"3-behavioural-errors",level:3},{value:"Mitigations",id:"mitigations",level:2},{value:"1. Type Errors",id:"1-type-errors-1",level:3},{value:"2. Transaction Errors",id:"2-transaction-errors-1",level:3},{value:"3. Behavioural Errors",id:"3-behavioural-errors-1",level:3}],c={toc:u};function p(e){let{components:t,...r}=e;return(0,n.kt)("wrapper",(0,a.Z)({},c,r,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"robust--correct"},"Robust & Correct"),(0,n.kt)("p",null,"Testing is an integral part of programming in Rust. You see, ",(0,n.kt)("a",{parentName:"p",href:"https://doc.rust-lang.org/cargo/commands/cargo-test.html"},(0,n.kt)("inlineCode",{parentName:"a"},"cargo test"))," is built-in."),(0,n.kt)("p",null,"If you don't use ",(0,n.kt)("inlineCode",{parentName:"p"},"unsafe")," and your code compiles, then your Rust program is ",(0,n.kt)("em",{parentName:"p"},"safe"),". However, it does not automatically become ",(0,n.kt)("em",{parentName:"p"},"robust"),". Your program can still panic unexpectedly if you are not careful on error handling."),(0,n.kt)("p",null,"Even if your program does not panic, it does not mean it is ",(0,n.kt)("em",{parentName:"p"},"correct"),". It can still misbehave and create data chaos."),(0,n.kt)("p",null,"You can improve the correctness of your program by writing adequate tests."),(0,n.kt)("h2",{id:"types-of-errors"},"Types of Errors"),(0,n.kt)("p",null,"First, let's classify different causes of errors in a data-driven application:"),(0,n.kt)("h3",{id:"1-type-errors"},"1. Type Errors"),(0,n.kt)("ol",null,(0,n.kt)("li",{parentName:"ol"},"misspelled or non-existent symbol (table or column) name"),(0,n.kt)("li",{parentName:"ol"},"using incompatible functions or operators on data (e.g. add two strings)"),(0,n.kt)("li",{parentName:"ol"},"invalid SQL query",(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},"e.g. ambiguous symbol in a ",(0,n.kt)("inlineCode",{parentName:"li"},"JOIN")," query"),(0,n.kt)("li",{parentName:"ul"},"e.g. forget to insert data on non-nullable columns"),(0,n.kt)("li",{parentName:"ul"},"e.g. forget to aggregate every column in a ",(0,n.kt)("inlineCode",{parentName:"li"},"GROUP BY")," query")))),(0,n.kt)("h3",{id:"2-transaction-errors"},"2. Transaction Errors"),(0,n.kt)("ol",null,(0,n.kt)("li",{parentName:"ol"},"failed to maintain entity relationships"),(0,n.kt)("li",{parentName:"ol"},"failed to maintain data consistency and constraints")),(0,n.kt)("h3",{id:"3-behavioural-errors"},"3. Behavioural Errors"),(0,n.kt)("ol",null,(0,n.kt)("li",{parentName:"ol"},"joining or filtering on wrong conditions"),(0,n.kt)("li",{parentName:"ol"},"incomplete or incorrect query results"),(0,n.kt)("li",{parentName:"ol"},"insert, update or delete operations with unawared side effects"),(0,n.kt)("li",{parentName:"ol"},"any other behaviour not as intended")),(0,n.kt)("blockquote",null,(0,n.kt)("p",{parentName:"blockquote"},"A note on 'unawared side effects': do not use ",(0,n.kt)("inlineCode",{parentName:"p"},"CASCADE")," unless the relation is strictly parent-child")),(0,n.kt)("h2",{id:"mitigations"},"Mitigations"),(0,n.kt)("p",null,"Now, let's see how we can mitigate these errors:"),(0,n.kt)("h3",{id:"1-type-errors-1"},"1. Type Errors"),(0,n.kt)("p",null,"Using Rust automatically saves you from misspelling symbols."),(0,n.kt)("p",null,"Using a ",(0,n.kt)("em",{parentName:"p"},"completely static")," query builder (like Diesel) can eliminate this entire class of errors. However, it requires that every parameter be defined statically and available compile-time. This is a ",(0,n.kt)("em",{parentName:"p"},"harsh")," requirement, as there is always something you could not know until your program starts (environment variables) and runs (runtime configuration change). This is especially awkward if you come from a scripting language background where the type system has always been dynamic."),(0,n.kt)("p",null,"As such, SeaORM does not attempt to check things at compile-time. We intend to (still in development) provide runtime linting on the dynamically generated queries against the mentioned problems that you can enable in unit tests but disable in production."),(0,n.kt)("h3",{id:"2-transaction-errors-1"},"2. Transaction Errors"),(0,n.kt)("p",null,"These problems cannot be eliminated. It usually indicates your code has some logic bugs. When they happen, it is already too late, and your only choice is to abort. Instead, they have to be actively prevented: check beforehand the constraints before attempting data operations."),(0,n.kt)("p",null,"You should write a bunch of unit tests that can reject bad data and prevent it from entering your database. Your unit tests should also verify that each ",(0,n.kt)("em",{parentName:"p"},"transaction")," (in your application domain, not necessarily the database transaction) is sound."),(0,n.kt)("p",null,"SeaORM helps you write these unit tests using the ",(0,n.kt)("inlineCode",{parentName:"p"},"Mock")," database interface."),(0,n.kt)("h3",{id:"3-behavioural-errors-1"},"3. Behavioural Errors"),(0,n.kt)("p",null,"This is basically testing your entire program on a domain level, requiring you to provide seed data and simulate the common user operations. Usually, you will do it in CI against a real database. However, SeaORM encourages you to scale down these tests so that the most important data-flow can be tested by Cargo's ",(0,n.kt)("a",{parentName:"p",href:"https://doc.rust-lang.org/rust-by-example/testing/integration_testing.html"},"integration tests"),"."),(0,n.kt)("p",null,"Since SeaORM is abstract over MySQL, PostgreSQL, and SQLite, you can use SQLite as a backend to test your program's behaviours. It is lightweight enough to run it frequently, locally, and on CI. The catch is, SQLite lacks some advanced features of MySQL or PostgreSQL, so depending on your use of database-specific features, not all logic can be tested inside SQLite."),(0,n.kt)("p",null,"We are looking for SQLite alternatives that can simulate the more advanced features of MySQL and PostgreSQL."))}p.isMDXComponent=!0}}]);