"use strict";(self.webpackChunksea_orm=self.webpackChunksea_orm||[]).push([[12638],{48859:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>m});var r=n(76687);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=r.createContext({}),d=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},p=function(e){var t=d(e.components);return r.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},s=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,l=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),s=d(n),m=o,v=s["".concat(l,".").concat(m)]||s[m]||u[m]||a;return n?r.createElement(v,i(i({ref:t},p),{},{components:n})):r.createElement(v,i({ref:t},p))}));function m(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,i=new Array(a);i[0]=s;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"==typeof e?e:o,i[1]=c;for(var d=2;d<a;d++)i[d]=n[d];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}s.displayName="MDXCreateElement"},22087:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>u,frontMatter:()=>a,metadata:()=>c,toc:()=>d});var r=n(31308),o=(n(76687),n(48859));const a={},i="Custom Active Model",c={unversionedId:"advanced-query/custom-active-model",id:"version-0.10.x/advanced-query/custom-active-model",title:"Custom Active Model",description:"Creating your own struct with partial fields of a model, which implements IntoActiveModel that can be converted into an ActiveModel with the method intoactivemodel. For example, it can be used as a form submission in a REST API.",source:"@site/versioned_docs/version-0.10.x/08-advanced-query/08-custom-active-model.md",sourceDirName:"08-advanced-query",slug:"/advanced-query/custom-active-model",permalink:"/preview/pr-118/SeaORM/docs/0.10.x/advanced-query/custom-active-model",draft:!1,editUrl:"https://github.com/SeaQL/seaql.github.io/edit/master/SeaORM/versioned_docs/version-0.10.x/08-advanced-query/08-custom-active-model.md",tags:[],version:"0.10.x",lastUpdatedBy:"Billy Chan",lastUpdatedAt:1712040915,formattedLastUpdatedAt:"Apr 2, 2024",sidebarPosition:8,frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Streaming",permalink:"/preview/pr-118/SeaORM/docs/0.10.x/advanced-query/streaming"},next:{title:"Error Handling",permalink:"/preview/pr-118/SeaORM/docs/0.10.x/advanced-query/error-handling"}},l={},d=[],p={toc:d};function u(e){let{components:t,...n}=e;return(0,o.kt)("wrapper",(0,r.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"custom-active-model"},"Custom Active Model"),(0,o.kt)("p",null,"Creating your own struct with partial fields of a model, which implements ",(0,o.kt)("inlineCode",{parentName:"p"},"IntoActiveModel")," that can be converted into an ",(0,o.kt)("inlineCode",{parentName:"p"},"ActiveModel")," with the method ",(0,o.kt)("inlineCode",{parentName:"p"},"into_active_model"),". For example, it can be used as a form submission in a REST API."),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"IntoActiveValue")," trait allows converting ",(0,o.kt)("inlineCode",{parentName:"p"},"Option<T>")," into ",(0,o.kt)("inlineCode",{parentName:"p"},"ActiveValue<T>")," with the method ",(0,o.kt)("inlineCode",{parentName:"p"},"into_active_value"),"."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-rust"},'// Define regular model as usual\n#[derive(Clone, Debug, PartialEq, DeriveEntityModel)]\n#[sea_orm(table_name = "fruit")]\npub struct Model {\n    #[sea_orm(primary_key)]\n    pub id: i32,\n    pub name: String,\n    pub cake_id: Option<i32>,\n}\n')),(0,o.kt)("p",null,"Create a new struct with some fields omitted."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-rust"},'use sea_orm::ActiveValue::NotSet;\n\n#[derive(DeriveIntoActiveModel)]\npub struct NewFruit {\n    // id is omitted\n    pub name: String,\n    // it is required as opposed to optional in Model\n    pub cake_id: i32,\n}\n\nassert_eq!(\n    NewFruit {\n        name: "Apple".to_owned(),\n        cake_id: 1,\n    }\n    .into_active_model(),\n    fruit::ActiveModel {\n        id: NotSet,\n        name: Set("Apple".to_owned()),\n        cake_id: Set(Some(1)),\n    }\n);\n')),(0,o.kt)("p",null,(0,o.kt)("inlineCode",{parentName:"p"},"Option<Option<T>>")," allows for ",(0,o.kt)("inlineCode",{parentName:"p"},"Some(None)")," to update the column to be NULL."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-rust"},"use sea_orm::ActiveValue::NotSet;\n\n#[derive(DeriveIntoActiveModel)]\npub struct UpdateFruit {\n    pub cake_id: Option<Option<i32>>,\n}\n\nassert_eq!(\n    UpdateFruit {\n        cake_id: Some(Some(1)),\n    }\n    .into_active_model(),\n    fruit::ActiveModel {\n        id: NotSet,\n        name: NotSet,\n        cake_id: Set(Some(1)),\n    }\n);\n\nassert_eq!(\n    UpdateFruit {\n        cake_id: Some(None),\n    }\n    .into_active_model(),\n    fruit::ActiveModel {\n        id: NotSet,\n        name: NotSet,\n        cake_id: Set(None),\n    }\n);\n\nassert_eq!(\n    UpdateFruit {\n        cake_id: None,\n    }\n    .into_active_model(),\n    fruit::ActiveModel {\n        id: NotSet,\n        name: NotSet,\n        cake_id: NotSet,\n    }\n);\n")))}u.isMDXComponent=!0}}]);