"use strict";(self.webpackChunksea_orm_pro=self.webpackChunksea_orm_pro||[]).push([[535],{5942:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>f});var n=r(6687);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var l=n.createContext({}),s=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},p=function(e){var t=s(e.components);return n.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,l=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),d=s(r),f=o,m=d["".concat(l,".").concat(f)]||d[f]||u[f]||a;return r?n.createElement(m,i(i({ref:t},p),{},{components:r})):n.createElement(m,i({ref:t},p))}));function f(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,i=new Array(a);i[0]=d;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"==typeof e?e:o,i[1]=c;for(var s=2;s<a;s++)i[s]=r[s];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},543:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>u,frontMatter:()=>a,metadata:()=>c,toc:()=>s});var n=r(1308),o=(r(6687),r(5942));const a={},i="View",c={unversionedId:"raw-table-config/view",id:"raw-table-config/view",title:"View",description:"",source:"@site/docs/04-raw-table-config/02-view.md",sourceDirName:"04-raw-table-config",slug:"/raw-table-config/view",permalink:"/sea-orm-pro/docs/raw-table-config/view",draft:!1,editUrl:"https://github.com/SeaQL/seaql.github.io/edit/master/sea-orm-pro/docs/04-raw-table-config/02-view.md",tags:[],version:"current",lastUpdatedBy:"Billy Chan",lastUpdatedAt:1734530380,formattedLastUpdatedAt:"Dec 18, 2024",sidebarPosition:2,frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Table",permalink:"/sea-orm-pro/docs/raw-table-config/table"},next:{title:"Create",permalink:"/sea-orm-pro/docs/raw-table-config/create"}},l={},s=[],p={toc:s};function u(e){let{components:t,...r}=e;return(0,o.kt)("wrapper",(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"view"},"View"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-toml"},'[view]\n\n# List of columns that are hidden on the view table\nhidden_columns = [\n    "name_style",\n    "suffix",\n    "email_address",\n    "phone",\n    "rowguid",\n    "modified_date",\n]\n\n# Sorter of the view table\norder_by = {\n    # Sort by which column\n    field = "customer_id",\n\n    # Sort in ASC / DESC direction\n    order = "desc"\n}\n')))}u.isMDXComponent=!0}}]);