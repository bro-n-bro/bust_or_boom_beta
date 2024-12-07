(function(){var e={46551:function(e,n,t){"use strict";var r=t(45130),o=t(30657),c=t(56768);function i(e,n){const t=(0,c.g2)("router-view");return(0,c.uX)(),(0,c.Wv)(t)}var a=t(71241);const s={},u=(0,a.A)(s,[["render",i]]);var l=u,f=(t(98992),t(37550),t(81387)),d=t(55129);const h=[{path:"/",name:"ConnectPage",component:()=>t.e(899).then(t.bind(t,58814)),meta:{accessDenied:["connected"]}},{path:"/main",name:"MainPage",component:()=>t.e(533).then(t.bind(t,80172)),meta:{accessDenied:["not_connected"]}}],p=(0,f.aE)({history:(0,f.LA)("/"),routes:h});p.beforeResolve(((e,n,t)=>{let r=(0,d.o)();e.matched.some((e=>{let n=e.meta.accessDenied;if(n.length){if(n.includes("connected")&&r.isConnected)return t({name:"MainPage"}),!1;if(n.includes("not_connected")&&!r.isConnected)return t({name:"ConnectPage"}),!1;t()}}))}));var m=p,y=t(65838);const g=(0,r.Ef)(l),b=(0,o.Ey)();g.use(b),g.use(m),g.component(y.A.name,y.A),g.mount("#app")},55129:function(e,n,t){"use strict";t.d(n,{o:function(){return i}});t(98992),t(72577);var r=t(30657),o=t(96129);const c=new JetPack,i=(0,r.nY)("global",{state:()=>({isConnected:!1,isRegistered:!1,user:null,balance:null,roundInfo:null,priceInfo:null,websocket:null,client:null,chainID:"pion-1",exponent:6,symbol:"BOOM"}),actions:{async connectWallet(){try{await c.connectWallet(this.chainID).then((async()=>(this.isConnected=!0,this.client=await o.A7.connect("https://rpc.pion-1.bronbro.io"),!0)))}catch(error){return console.log(error),!1}},getUserAddress(){return c.getAddress()},async checkUserAccount(){try{this.user=await this.client.queryContractSmart("neutron1edsy5v3lty0j6xd5sg8nzcmnkuwjgu2887xrhyg7s8wxnww39kfqy3cu3k",{user_by_address:{address:c.getAddress()}}),await Promise.all([this.getPriceInfo(),this.getRoundInfo(),this.loadBalances()]),this.connectWebsocket(),this.isRegistered=!0}catch(error){this.isRegistered=!1}},async createUserAccount({username:e,display_name:n}){return await c.sendTx([{typeUrl:"/cosmwasm.wasm.v1.MsgExecuteContract",value:{sender:c.getAddress(),contract:"neutron1edsy5v3lty0j6xd5sg8nzcmnkuwjgu2887xrhyg7s8wxnww39kfqy3cu3k",msg:(new TextEncoder).encode(JSON.stringify({modify_user:{user:{display_name:n,username:e}}}))}}]).then((async e=>"error"===e.type?(console.log(error),!1):"tx"===e.type?(await this.checkUserAccount(),!0):void 0)).catch((e=>(console.log(e),!1)))},async loadBalances(){await c.loadBalances().then((()=>{this.balance=c.getBalances().find((e=>"factory/neutron1heydp9f3977kq7c4fecrkra9etdqlu9al954cs/uboom"===e.denom))}))},async connectWebsocket(){this.websocket&&(this.websocket.onopen=null,this.websocket.onmessage=null,this.websocket.close()),this.websocket=new WebSocket("wss://rpc.pion-1.bronbro.io:443/websocket"),this.websocket.onopen=()=>{this.websocket.send(JSON.stringify({jsonrpc:"2.0",method:"subscribe",id:"1",params:{query:"tm.event='NewBlock'"}}))},this.websocket.onmessage=async e=>{this.ChainBlockInfo=JSON.parse(e.data),this.getPriceInfo(),this.getRoundInfo()}},async getPriceInfo(){try{await fetch("https://lcd.pion-1.bronbro.io/slinky/oracle/v1/get_price?currency_pair.Base=ATOM&currency_pair.Quote=USD").then((e=>e.json())).then((e=>this.priceInfo=e))}catch(error){console.error(error)}},async getRoundInfo(){try{return this.roundInfo=await this.client.queryContractSmart("neutron1jktw2g347yte6rqn3m0qg0ll6t28ru22ayyp9xydc7aj3l9jm3rqcry2xc",{status:{}}),!0}catch(error){return!1}},async faucet(){try{await fetch("https://pion.tap.bronbro.io/claim_rewards/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({telegram_id:c.getTgUserID(),address:c.getAddress()})}).then((e=>e.json())).then((e=>console.log(e)))}catch(error){console.error(error)}}}})},78982:function(){},47790:function(){},73776:function(){},21638:function(){},92668:function(){},77965:function(){},66089:function(){},79368:function(){},77667:function(){},76447:function(){},64688:function(){},51069:function(){},15340:function(){},79838:function(){}},n={};function t(r){var o=n[r];if(void 0!==o)return o.exports;var c=n[r]={id:r,loaded:!1,exports:{}};return e[r].call(c.exports,c,c.exports,t),c.loaded=!0,c.exports}t.m=e,function(){var e=[];t.O=function(n,r,o,c){if(!r){var i=1/0;for(l=0;l<e.length;l++){r=e[l][0],o=e[l][1],c=e[l][2];for(var a=!0,s=0;s<r.length;s++)(!1&c||i>=c)&&Object.keys(t.O).every((function(e){return t.O[e](r[s])}))?r.splice(s--,1):(a=!1,c<i&&(i=c));if(a){e.splice(l--,1);var u=o();void 0!==u&&(n=u)}}return n}c=c||0;for(var l=e.length;l>0&&e[l-1][2]>c;l--)e[l]=e[l-1];e[l]=[r,o,c]}}(),function(){t.n=function(e){var n=e&&e.__esModule?function(){return e["default"]}:function(){return e};return t.d(n,{a:n}),n}}(),function(){t.d=function(e,n){for(var r in n)t.o(n,r)&&!t.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:n[r]})}}(),function(){t.f={},t.e=function(e){return Promise.all(Object.keys(t.f).reduce((function(n,r){return t.f[r](e,n),n}),[]))}}(),function(){t.u=function(e){return"js/"+e+"."+{533:"f01aa6ef",899:"8f12bb2e"}[e]+".js"}}(),function(){t.miniCssF=function(e){return"css/"+e+"."+{533:"c521a24d",899:"7f8f39dc"}[e]+".css"}}(),function(){t.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){t.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)}}(),function(){var e={},n="hakaton_spain:";t.l=function(r,o,c,i){if(e[r])e[r].push(o);else{var a,s;if(void 0!==c)for(var u=document.getElementsByTagName("script"),l=0;l<u.length;l++){var f=u[l];if(f.getAttribute("src")==r||f.getAttribute("data-webpack")==n+c){a=f;break}}a||(s=!0,a=document.createElement("script"),a.charset="utf-8",a.timeout=120,t.nc&&a.setAttribute("nonce",t.nc),a.setAttribute("data-webpack",n+c),a.src=r),e[r]=[o];var d=function(n,t){a.onerror=a.onload=null,clearTimeout(h);var o=e[r];if(delete e[r],a.parentNode&&a.parentNode.removeChild(a),o&&o.forEach((function(e){return e(t)})),n)return n(t)},h=setTimeout(d.bind(null,void 0,{type:"timeout",target:a}),12e4);a.onerror=d.bind(null,a.onerror),a.onload=d.bind(null,a.onload),s&&document.head.appendChild(a)}}}(),function(){t.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}}(),function(){t.nmd=function(e){return e.paths=[],e.children||(e.children=[]),e}}(),function(){t.p="/"}(),function(){if("undefined"!==typeof document){var e=function(e,n,r,o,c){var i=document.createElement("link");i.rel="stylesheet",i.type="text/css",t.nc&&(i.nonce=t.nc);var a=function(t){if(i.onerror=i.onload=null,"load"===t.type)o();else{var r=t&&t.type,a=t&&t.target&&t.target.href||n,s=new Error("Loading CSS chunk "+e+" failed.\n("+r+": "+a+")");s.name="ChunkLoadError",s.code="CSS_CHUNK_LOAD_FAILED",s.type=r,s.request=a,i.parentNode&&i.parentNode.removeChild(i),c(s)}};return i.onerror=i.onload=a,i.href=n,r?r.parentNode.insertBefore(i,r.nextSibling):document.head.appendChild(i),i},n=function(e,n){for(var t=document.getElementsByTagName("link"),r=0;r<t.length;r++){var o=t[r],c=o.getAttribute("data-href")||o.getAttribute("href");if("stylesheet"===o.rel&&(c===e||c===n))return o}var i=document.getElementsByTagName("style");for(r=0;r<i.length;r++){o=i[r],c=o.getAttribute("data-href");if(c===e||c===n)return o}},r=function(r){return new Promise((function(o,c){var i=t.miniCssF(r),a=t.p+i;if(n(i,a))return o();e(r,a,null,o,c)}))},o={524:0};t.f.miniCss=function(e,n){var t={533:1,899:1};o[e]?n.push(o[e]):0!==o[e]&&t[e]&&n.push(o[e]=r(e).then((function(){o[e]=0}),(function(n){throw delete o[e],n})))}}}(),function(){var e={524:0};t.f.j=function(n,r){var o=t.o(e,n)?e[n]:void 0;if(0!==o)if(o)r.push(o[2]);else{var c=new Promise((function(t,r){o=e[n]=[t,r]}));r.push(o[2]=c);var i=t.p+t.u(n),a=new Error,s=function(r){if(t.o(e,n)&&(o=e[n],0!==o&&(e[n]=void 0),o)){var c=r&&("load"===r.type?"missing":r.type),i=r&&r.target&&r.target.src;a.message="Loading chunk "+n+" failed.\n("+c+": "+i+")",a.name="ChunkLoadError",a.type=c,a.request=i,o[1](a)}};t.l(i,s,"chunk-"+n,n)}},t.O.j=function(n){return 0===e[n]};var n=function(n,r){var o,c,i=r[0],a=r[1],s=r[2],u=0;if(i.some((function(n){return 0!==e[n]}))){for(o in a)t.o(a,o)&&(t.m[o]=a[o]);if(s)var l=s(t)}for(n&&n(r);u<i.length;u++)c=i[u],t.o(e,c)&&e[c]&&e[c][0](),e[c]=0;return t.O(l)},r=self["webpackChunkhakaton_spain"]=self["webpackChunkhakaton_spain"]||[];r.forEach(n.bind(null,0)),r.push=n.bind(null,r.push.bind(r))}();var r=t.O(void 0,[504],(function(){return t(46551)}));r=t.O(r)})();
//# sourceMappingURL=app.d87646e8.js.map