"use strict";(self.webpackChunksea_orm_pro=self.webpackChunksea_orm_pro||[]).push([[165],{5942:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>f});var n=r(6687);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var c=n.createContext({}),s=function(e){var t=n.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},p=function(e){var t=s(e.components);return n.createElement(c.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,c=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),d=s(r),f=o,m=d["".concat(c,".").concat(f)]||d[f]||u[f]||a;return r?n.createElement(m,i(i({ref:t},p),{},{components:r})):n.createElement(m,i({ref:t},p))}));function f(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,i=new Array(a);i[0]=d;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l.mdxType="string"==typeof e?e:o,i[1]=l;for(var s=2;s<a;s++)i[s]=r[s];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},675:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>u,frontMatter:()=>a,metadata:()=>l,toc:()=>s});var n=r(1308),o=(r(6687),r(5942));const a={},i="The Basics",l={unversionedId:"composite-table-config/basics",id:"composite-table-config/basics",title:"The Basics",description:"File Folder",source:"@site/docs/05-composite-table-config/01-basics.md",sourceDirName:"05-composite-table-config",slug:"/composite-table-config/basics",permalink:"/preview/pr-138/sea-orm-pro/docs/composite-table-config/basics",draft:!1,editUrl:"https://github.com/SeaQL/seaql.github.io/edit/master/sea-orm-pro/docs/05-composite-table-config/01-basics.md",tags:[],version:"current",lastUpdatedBy:"Billy Chan",lastUpdatedAt:1735888817,formattedLastUpdatedAt:"Jan 3, 2025",sidebarPosition:1,frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Delete",permalink:"/preview/pr-138/sea-orm-pro/docs/raw-table-config/delete"},next:{title:"Parent Table",permalink:"/preview/pr-138/sea-orm-pro/docs/composite-table-config/parent-table"}},c={},s=[{value:"File Folder",id:"file-folder",level:2},{value:"File Name Convention",id:"file-name-convention",level:2},{value:"Overall Structure of TOML File",id:"overall-structure-of-toml-file",level:2}],p={toc:s};function u(e){let{components:t,...r}=e;return(0,o.kt)("wrapper",(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"the-basics"},"The Basics"),(0,o.kt)("h2",{id:"file-folder"},"File Folder"),(0,o.kt)("p",null,"All TOML config of composite tables should be placed in the ",(0,o.kt)("inlineCode",{parentName:"p"},"pro_admin/composite_tables")," folder."),(0,o.kt)("h2",{id:"file-name-convention"},"File Name Convention"),(0,o.kt)("p",null,"The TOML config file should have a unique named. Such as ",(0,o.kt)("inlineCode",{parentName:"p"},"sales_order.toml")," and ",(0,o.kt)("inlineCode",{parentName:"p"},"customer_address_book.toml"),"."),(0,o.kt)("h2",{id:"overall-structure-of-toml-file"},"Overall Structure of TOML File"),(0,o.kt)("p",null,"The TOML config file of composite table is compulsory, you need to create them manually and specify the parent and children tables."),(0,o.kt)("p",null,"The TOML config consists of a parent and one or more children, each section will be explained separately in the following."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-toml"},"[parent]\n# ...\n\n\n[[children]]\n# ...\n\n\n[[children]]\n# ...\n\n\n[[children]]\n# ...\n")))}u.isMDXComponent=!0}}]);