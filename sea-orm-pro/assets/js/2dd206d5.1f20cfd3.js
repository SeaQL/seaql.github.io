"use strict";(self.webpackChunksea_orm_pro=self.webpackChunksea_orm_pro||[]).push([[324],{5942:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>f});var n=r(6687);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function l(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var c=n.createContext({}),s=function(e){var t=n.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):l(l({},t),e)),r},p=function(e){var t=s(e.components);return n.createElement(c.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,c=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),d=s(r),f=a,m=d["".concat(c,".").concat(f)]||d[f]||u[f]||o;return r?n.createElement(m,l(l({ref:t},p),{},{components:r})):n.createElement(m,l({ref:t},p))}));function f(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,l=new Array(o);l[0]=d;var i={};for(var c in t)hasOwnProperty.call(t,c)&&(i[c]=t[c]);i.originalType=e,i.mdxType="string"==typeof e?e:a,l[1]=i;for(var s=2;s<o;s++)l[s]=r[s];return n.createElement.apply(null,l)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},665:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>c,contentTitle:()=>l,default:()=>u,frontMatter:()=>o,metadata:()=>i,toc:()=>s});var n=r(1308),a=(r(6687),r(5942));const o={},l="Create",i={unversionedId:"raw-table-config/create",id:"raw-table-config/create",title:"Create",description:"Enable Create",source:"@site/docs/04-raw-table-config/04-create.md",sourceDirName:"04-raw-table-config",slug:"/raw-table-config/create",permalink:"/sea-orm-pro/docs/raw-table-config/create",draft:!1,editUrl:"https://github.com/SeaQL/seaql.github.io/edit/master/sea-orm-pro/docs/04-raw-table-config/04-create.md",tags:[],version:"current",lastUpdatedBy:"Billy Chan",lastUpdatedAt:1734946604,formattedLastUpdatedAt:"Dec 23, 2024",sidebarPosition:4,frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"View",permalink:"/sea-orm-pro/docs/raw-table-config/view"},next:{title:"Update",permalink:"/sea-orm-pro/docs/raw-table-config/update"}},c={},s=[{value:"Enable Create",id:"enable-create",level:2},{value:"Hidden Columns",id:"hidden-columns",level:2},{value:"Full Spec",id:"full-spec",level:2}],p={toc:s};function u(e){let{components:t,...r}=e;return(0,a.kt)("wrapper",(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"create"},"Create"),(0,a.kt)("h2",{id:"enable-create"},"Enable Create"),(0,a.kt)("p",null,"Enable create operation on this database table, this is disabled by default."),(0,a.kt)("h2",{id:"hidden-columns"},"Hidden Columns"),(0,a.kt)("p",null,"Hide columns from the create form but it's still visible on the view table."),(0,a.kt)("h2",{id:"full-spec"},"Full Spec"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-toml"},'[create]\n\n# Is create allowed for this table?\nenable = true\n\n# List of columns that are hidden on the create form\nhidden_columns = [\n    "created_at",\n    "updated_at",\n]\n')))}u.isMDXComponent=!0}}]);