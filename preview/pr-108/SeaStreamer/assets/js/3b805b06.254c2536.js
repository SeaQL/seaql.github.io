"use strict";(self.webpackChunksea_orm=self.webpackChunksea_orm||[]).push([[46],{3905:(e,r,t)=>{t.d(r,{Zo:()=>c,kt:()=>f});var a=t(7294);function n(e,r,t){return r in e?Object.defineProperty(e,r,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[r]=t,e}function s(e,r){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);r&&(a=a.filter((function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable}))),t.push.apply(t,a)}return t}function o(e){for(var r=1;r<arguments.length;r++){var t=null!=arguments[r]?arguments[r]:{};r%2?s(Object(t),!0).forEach((function(r){n(e,r,t[r])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):s(Object(t)).forEach((function(r){Object.defineProperty(e,r,Object.getOwnPropertyDescriptor(t,r))}))}return e}function i(e,r){if(null==e)return{};var t,a,n=function(e,r){if(null==e)return{};var t,a,n={},s=Object.keys(e);for(a=0;a<s.length;a++)t=s[a],r.indexOf(t)>=0||(n[t]=e[t]);return n}(e,r);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(a=0;a<s.length;a++)t=s[a],r.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(n[t]=e[t])}return n}var l=a.createContext({}),m=function(e){var r=a.useContext(l),t=r;return e&&(t="function"==typeof e?e(r):o(o({},r),e)),t},c=function(e){var r=m(e.components);return a.createElement(l.Provider,{value:r},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var r=e.children;return a.createElement(a.Fragment,{},r)}},p=a.forwardRef((function(e,r){var t=e.components,n=e.mdxType,s=e.originalType,l=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),u=m(t),p=n,f=u["".concat(l,".").concat(p)]||u[p]||d[p]||s;return t?a.createElement(f,o(o({ref:r},c),{},{components:t})):a.createElement(f,o({ref:r},c))}));function f(e,r){var t=arguments,n=r&&r.mdxType;if("string"==typeof e||n){var s=t.length,o=new Array(s);o[0]=p;var i={};for(var l in r)hasOwnProperty.call(r,l)&&(i[l]=r[l]);i.originalType=e,i[u]="string"==typeof e?e:n,o[1]=i;for(var m=2;m<s;m++)o[m]=t[m];return a.createElement.apply(null,o)}return a.createElement.apply(null,t)}p.displayName="MDXCreateElement"},9087:(e,r,t)=>{t.r(r),t.d(r,{assets:()=>l,contentTitle:()=>o,default:()=>d,frontMatter:()=>s,metadata:()=>i,toc:()=>m});var a=t(7462),n=(t(7294),t(3905));const s={},o="SeaStreamer Concepts",i={unversionedId:"introduction/sea-streamer",id:"version-0.3.x/introduction/sea-streamer",title:"SeaStreamer Concepts",description:"Streamer",source:"@site/versioned_docs/version-0.3.x/01-introduction/03-sea-streamer.md",sourceDirName:"01-introduction",slug:"/introduction/sea-streamer",permalink:"/preview/pr-108/SeaStreamer/docs/introduction/sea-streamer",draft:!1,editUrl:"https://github.com/SeaQL/seaql.github.io/edit/master/SeaStreamer/versioned_docs/version-0.3.x/01-introduction/03-sea-streamer.md",tags:[],version:"0.3.x",lastUpdatedBy:"Billy Chan",lastUpdatedAt:1694602220,formattedLastUpdatedAt:"Sep 13, 2023",sidebarPosition:3,frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Async Programming in Rust",permalink:"/preview/pr-108/SeaStreamer/docs/introduction/async-programming"},next:{title:"Configuring Features",permalink:"/preview/pr-108/SeaStreamer/docs/getting-started/configuration"}},l={},m=[{value:"Streamer",id:"streamer",level:2},{value:"Cluster",id:"cluster",level:3},{value:"Stream",id:"stream",level:2},{value:"Stream URL",id:"stream-url",level:3},{value:"Consumer",id:"consumer",level:2},{value:"Consumer Mode",id:"consumer-mode",level:3},{value:"Producer",id:"producer",level:2},{value:"Processor",id:"processor",level:2},{value:"Stream Semantics",id:"stream-semantics",level:2}],c={toc:m},u="wrapper";function d(e){let{components:r,...t}=e;return(0,n.kt)(u,(0,a.Z)({},c,t,{components:r,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"seastreamer-concepts"},"SeaStreamer Concepts"),(0,n.kt)("h2",{id:"streamer"},"Streamer"),(0,n.kt)("p",null,"The streaming server. It is identified by an URI where all producers and consumers can connect to."),(0,n.kt)("h3",{id:"cluster"},"Cluster"),(0,n.kt)("p",null,"The streaming server is assumed to be a cluster: it can scale horizontally across multiple nodes."),(0,n.kt)("h2",{id:"stream"},"Stream"),(0,n.kt)("p",null,"A stream consists of a series of messages sharing the same key (known as ",(0,n.kt)("inlineCode",{parentName:"p"},"topic")," in Kafka). Each message has a timestamp, sequence number (known as ",(0,n.kt)("inlineCode",{parentName:"p"},"offset")," in Kafka), shard id (known as ",(0,n.kt)("inlineCode",{parentName:"p"},"partition number")," in Kafka), and payload. A message is uniquely identified by the (stream key, shard id, sequence number) tuple."),(0,n.kt)("h3",{id:"stream-url"},"Stream URL"),(0,n.kt)("p",null,"In SeaStreamer streams are resources, and can be accessed through a URL comprising (protocol, host, stream). An example stream URL is ",(0,n.kt)("inlineCode",{parentName:"p"},"kafka://streamer.sea-ql.org:12345/my_stream"),"."),(0,n.kt)("h2",{id:"consumer"},"Consumer"),(0,n.kt)("p",null,"A stream consumer subscribes to one or more streams and receive messages from one or more nodes in the cluster."),(0,n.kt)("p",null,"A consumer can rewind a stream to any point (addressed by timestamp or sequence number) and continue streaming."),(0,n.kt)("h3",{id:"consumer-mode"},"Consumer Mode"),(0,n.kt)("p",null,"There are three consuming modes:"),(0,n.kt)("ol",null,(0,n.kt)("li",{parentName:"ol"},"Real-time: we only care about the latest messages and would be okay to miss old data"),(0,n.kt)("li",{parentName:"ol"},"Resumable: when the consumer resubscribes, it will resume from the last consumed message"),(0,n.kt)("li",{parentName:"ol"},"Load-balanced: like Resumable, but with multiple consumers sharing the same set of streams")),(0,n.kt)("h2",{id:"producer"},"Producer"),(0,n.kt)("p",null,"A stream producer send messages to a streaming server, where the server would store the messages within the cluster, and deliver them to clients."),(0,n.kt)("p",null,"A producer can send a message with any stream key, but in SeaStreamer we recommend you to anchor each producer to a particular stream key."),(0,n.kt)("h2",{id:"processor"},"Processor"),(0,n.kt)("p",null,"A stream processor is a consumer and producer at the same time. It consumes messages, transforms them and produces another stream."),(0,n.kt)("p",null,"SeaStreamer aims to make it easy and flexible to develop and operate stream processors."),(0,n.kt)("h2",{id:"stream-semantics"},"Stream Semantics"),(0,n.kt)("p",null,"Advanced concepts, like sharding, load-balancing and transactions are backend-specific and you should read the relevant documentation of the streaming backend."))}d.isMDXComponent=!0}}]);