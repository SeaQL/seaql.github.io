"use strict";(self.webpackChunksea_orm_pro=self.webpackChunksea_orm_pro||[]).push([[346],{5942:(e,t,n)=>{n.d(t,{Zo:()=>c,kt:()=>f});var r=n(6687);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var d=r.createContext({}),u=function(e){var t=r.useContext(d),n=t;return e&&(n="function"==typeof e?e(t):l(l({},t),e)),n},c=function(e){var t=u(e.components);return r.createElement(d.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},s=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,d=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),s=u(n),f=a,m=s["".concat(d,".").concat(f)]||s[f]||p[f]||o;return n?r.createElement(m,l(l({ref:t},c),{},{components:n})):r.createElement(m,l({ref:t},c))}));function f(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,l=new Array(o);l[0]=s;var i={};for(var d in t)hasOwnProperty.call(t,d)&&(i[d]=t[d]);i.originalType=e,i.mdxType="string"==typeof e?e:a,l[1]=i;for(var u=2;u<o;u++)l[u]=n[u];return r.createElement.apply(null,l)}return r.createElement.apply(null,n)}s.displayName="MDXCreateElement"},6818:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>d,contentTitle:()=>l,default:()=>p,frontMatter:()=>o,metadata:()=>i,toc:()=>u});var r=n(1308),a=(n(6687),n(5942));const o={},l="Update",i={unversionedId:"raw-table-config/update",id:"raw-table-config/update",title:"Update",description:"Enable Update",source:"@site/docs/04-raw-table-config/05-update.md",sourceDirName:"04-raw-table-config",slug:"/raw-table-config/update",permalink:"/sea-orm-pro/docs/raw-table-config/update",draft:!1,editUrl:"https://github.com/SeaQL/seaql.github.io/edit/master/sea-orm-pro/docs/04-raw-table-config/05-update.md",tags:[],version:"current",lastUpdatedBy:"Billy Chan",lastUpdatedAt:1735899171,formattedLastUpdatedAt:"Jan 3, 2025",sidebarPosition:5,frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Create",permalink:"/sea-orm-pro/docs/raw-table-config/create"},next:{title:"Delete",permalink:"/sea-orm-pro/docs/raw-table-config/delete"}},d={},u=[{value:"Enable Update",id:"enable-update",level:2},{value:"Hidden Columns",id:"hidden-columns",level:2},{value:"Readonly Columns",id:"readonly-columns",level:2},{value:"Full Spec",id:"full-spec",level:2}],c={toc:u};function p(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,r.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"update"},"Update"),(0,a.kt)("h2",{id:"enable-update"},"Enable Update"),(0,a.kt)("p",null,"Enable update on this database table, this is disabled by default."),(0,a.kt)("h2",{id:"hidden-columns"},"Hidden Columns"),(0,a.kt)("p",null,"Hide columns from the update form but it's still visible on the view table."),(0,a.kt)("h2",{id:"readonly-columns"},"Readonly Columns"),(0,a.kt)("p",null,"Readonly fields on the update form."),(0,a.kt)("h2",{id:"full-spec"},"Full Spec"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-toml"},'[update]\n\n# Is update allowed for this table?\nenable = true\n\n# List of columns that are hidden on the update form\nhidden_columns = [\n    "created_at",\n    "updated_at",\n]\n\n# List of columns that are readonly on the update form\nreadonly_columns = [\n    "id",\n]\n')))}p.isMDXComponent=!0}}]);