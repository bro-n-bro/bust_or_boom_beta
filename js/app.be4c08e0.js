(function(){var e={47079:function(e,t,n){"use strict";var r=n(45130),o=n(30657),c=n(56768),s=n(90144),a=n.p+"img/register_success_img.b8e7b747.png";const i={class:"modal"},u={class:"modal_content"},l={class:"data"};var d={__name:"RegisterSuccessModal",setup(e){const t=(0,c.WQ)("emitter");return(e,n)=>((0,c.uX)(),(0,c.CE)("section",i,[(0,c.Lk)("div",u,[(0,c.Lk)("div",l,[(0,c.Lk)("button",{class:"close_btn",onClick:n[0]||(n[0]=(0,r.D$)((e=>(0,s.R1)(t).emit("close_register_success_modal")),["prevent"]))},n[2]||(n[2]=[(0,c.Lk)("svg",{xmlns:"http://www.w3.org/2000/svg",width:"24",height:"24",viewBox:"0 0 24 24",fill:"none"},[(0,c.Lk)("path",{d:"M18.296 7.115C18.6853 6.72564 18.6853 6.09436 18.296 5.705C17.9066 5.31564 17.2753 5.31564 16.886 5.705L12.001 10.59L7.11598 5.705C6.72662 5.31564 6.09534 5.31564 5.70598 5.705C5.31662 6.09436 5.31662 6.72564 5.70598 7.115L10.591 12L5.70598 16.885C5.31662 17.2744 5.31662 17.9056 5.70598 18.295C6.09534 18.6844 6.72662 18.6844 7.11598 18.295L12.001 13.41L16.886 18.295C17.2753 18.6844 17.9066 18.6844 18.296 18.295C18.6853 17.9056 18.6853 17.2744 18.296 16.885L13.411 12L18.296 7.115Z",fill:"white"})],-1)])),n[3]||(n[3]=(0,c.Lk)("div",{class:"title"},"Congratulations!",-1)),n[4]||(n[4]=(0,c.Lk)("div",{class:"desc"},[(0,c.eW)("Now you are Bust or Boom player!"),(0,c.Lk)("br"),(0,c.eW)(" Enjoy you bets!")],-1)),n[5]||(n[5]=(0,c.Lk)("img",{src:a,alt:"",class:"img"},null,-1)),(0,c.Lk)("button",{class:"apply_btn",onClick:n[1]||(n[1]=(0,r.D$)((e=>(0,s.R1)(t).emit("close_register_success_modal")),["prevent"]))},"Enjoy")])])]))}};const f=d;var h=f;const m={class:"main"};var y={__name:"App",setup(e){const t=(0,c.WQ)("emitter"),n=(0,s.KR)(!1);return t.on("show_register_success_modal",(()=>{n.value=!0})),t.on("close_register_success_modal",(()=>{n.value=!1})),(e,o)=>{const a=(0,c.g2)("router-view");return(0,c.uX)(),(0,c.CE)(c.FK,null,[(0,c.Lk)("div",m,[(0,c.bF)(a)]),n.value?((0,c.uX)(),(0,c.Wv)(h,{key:0})):(0,c.Q3)("",!0),n.value?((0,c.uX)(),(0,c.CE)("div",{key:1,class:"modal_overlay",onClick:o[0]||(o[0]=(0,r.D$)((e=>(0,s.R1)(t).emit("close_register_success_modal")),["prevent"]))})):(0,c.Q3)("",!0)],64)}}};const p=y;var g=p,b=(n(98992),n(37550),n(81387)),w=n(55129);const v=[{path:"/",name:"ConnectPage",component:()=>n.e(290).then(n.bind(n,42095)),meta:{accessDenied:["connected"]}},{path:"/register",name:"RegisterPage",component:()=>n.e(875).then(n.bind(n,51209)),meta:{accessDenied:["not_connected"]}},{path:"/main",name:"MainPage",component:()=>n.e(291).then(n.bind(n,41395)),meta:{accessDenied:["not_connected"]}},{path:"/my_bets",name:"MyBetsPage",component:()=>n.e(46).then(n.bind(n,36031)),meta:{accessDenied:["not_connected"]}},{path:"/leaderboard",name:"LeaderboardPage",component:()=>n.e(705).then(n.bind(n,24106)),meta:{accessDenied:["not_connected"]}}],k=(0,b.aE)({history:(0,b.LA)("/"),routes:v});k.beforeResolve(((e,t,n)=>{let r=(0,w.o)();e.matched.some((e=>{let t=e.meta.accessDenied;if(t.length){if(t.includes("connected")&&r.isConnected)return n({name:"MainPage"}),!1;if(t.includes("not_connected")&&!r.isConnected)return n({name:"ConnectPage"}),!1;n()}}))}));var _=k,C=n(50595),x=n(65838);const j=(0,C.A)(),S=(0,r.Ef)(g),q=(0,o.Ey)();S.use(q),S.use(_),S.provide("emitter",j),S.component(x.A.name,x.A),S.mount("#app")},55129:function(e,t,n){"use strict";n.d(t,{o:function(){return a}});n(44114),n(98992),n(54520),n(72577);var r=n(30657),o=n(51510),c=n(96129);const s=new JetPack,a=(0,r.nY)("global",{state:()=>({isConnected:!1,isRegistered:null,user:null,balance:null,roundInfo:null,priceInfo:null,websocket:null,client:null,bets:(0,o.Mjh)("bets",[]),chainID:"pion-1",exponent:6,symbol:"BOOM"}),actions:{async connectWallet(){try{await s.connectWallet(this.chainID).then((async()=>{this.client=await c.A7.connect("https://rpc.pion-1.bronbro.io"),this.isConnected=!0}))}catch(error){alert(error)}},getUserAddress(){return s.getAddress()},async checkUserAccount(){try{this.user=await this.client.queryContractSmart("neutron1edsy5v3lty0j6xd5sg8nzcmnkuwjgu2887xrhyg7s8wxnww39kfqy3cu3k",{user_by_address:{address:s.getAddress()}}),await Promise.all([this.getPriceInfo(),this.getRoundInfo(),this.loadBalances()]),this.connectWebsocket(),this.isRegistered=!0}catch(error){this.isRegistered=!1}},async createUserAccount({username:e,display_name:t}){return await s.sendTx([{typeUrl:"/cosmwasm.wasm.v1.MsgExecuteContract",value:{sender:s.getAddress(),contract:"neutron1edsy5v3lty0j6xd5sg8nzcmnkuwjgu2887xrhyg7s8wxnww39kfqy3cu3k",msg:(new TextEncoder).encode(JSON.stringify({modify_user:{user:{display_name:t,username:e}}}))}}]).then((async e=>"error"===e.type?(console.log(error),!1):"tx"===e.type?(await this.checkUserAccount(),!0):void 0)).catch((e=>(console.log(e),!1)))},async loadBalances(){await s.loadBalances().then((()=>{this.balance=s.getBalances().find((e=>"factory/neutron1heydp9f3977kq7c4fecrkra9etdqlu9al954cs/uboom"===e.denom))}))},async connectWebsocket(){this.websocket&&(this.websocket.onopen=null,this.websocket.onmessage=null,this.websocket.close()),this.websocket=new WebSocket("wss://rpc.pion-1.bronbro.io:443/websocket"),this.websocket.onopen=()=>{this.websocket.send(JSON.stringify({jsonrpc:"2.0",method:"subscribe",id:"1",params:{query:"tm.event='NewBlock'"}}))},this.websocket.onmessage=async e=>{this.ChainBlockInfo=JSON.parse(e.data),await Promise.all([this.getPriceInfo(),this.getRoundInfo()])}},async getPriceInfo(){try{await fetch("https://lcd.pion-1.bronbro.io/slinky/oracle/v1/get_price?currency_pair.Base=ATOM&currency_pair.Quote=USD").then((e=>e.json())).then((e=>this.priceInfo=e))}catch(error){console.error(error)}},async getRoundInfo(){try{return this.roundInfo=await this.client.queryContractSmart("neutron1jktw2g347yte6rqn3m0qg0ll6t28ru22ayyp9xydc7aj3l9jm3rqcry2xc",{status:{}}),!0}catch(error){return!1}},async faucet(){try{await fetch("https://pion.tap.bronbro.io/claim_rewards/",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({telegram_id:s.getTgUserID(),address:s.getAddress()})})}catch(error){console.error(error)}},async createBet({amount:e,prize:t,priceLength:n,round_id:r,type:o}){let c={};"bear"===o&&(c={bet_bear:{amount:String(e*Math.pow(10,this.exponent)),round_id:String(r)}}),"bull"===o&&(c={bet_bull:{amount:String(e*Math.pow(10,this.exponent)),round_id:String(r)}}),await s.sendTx([{typeUrl:"/cosmwasm.wasm.v1.MsgExecuteContract",value:{sender:s.getAddress(),contract:"neutron1jktw2g347yte6rqn3m0qg0ll6t28ru22ayyp9xydc7aj3l9jm3rqcry2xc",msg:(new TextEncoder).encode(JSON.stringify(c)),funds:[{denom:"factory/neutron1heydp9f3977kq7c4fecrkra9etdqlu9al954cs/uboom",amount:String(e*Math.pow(10,this.exponent))}]}}]).then((c=>{"error"===c.type&&console.log(error),"tx"===c.type&&(this.bets.push({bet_id:Date.now(),type:o,amount:e,priceLength:n,prize:t,round_id:r,roundInfo:this.roundInfo,finished_round:null}),this.bets.sort(((e,t)=>t.bet_id-e.bet_id)),this.loadBalances())})).catch((e=>{console.log(e)}))},deleteBet(e){this.bets=this.bets.filter((t=>t.bet_id!==e))},async getFinishedRound(e){try{return await this.client.queryContractSmart("neutron1jktw2g347yte6rqn3m0qg0ll6t28ru22ayyp9xydc7aj3l9jm3rqcry2xc",{finished_round:{round_id:String(e)}})}catch(error){return!1}},async myRewards(){try{return await this.client.queryContractSmart("neutron1jktw2g347yte6rqn3m0qg0ll6t28ru22ayyp9xydc7aj3l9jm3rqcry2xc",{my_pending_reward_rounds:{player:s.getAddress()}})}catch(error){return!1}},async claimRewards(){await s.sendTx([{typeUrl:"/cosmwasm.wasm.v1.MsgExecuteContract",value:{sender:s.getAddress(),contract:"neutron1jktw2g347yte6rqn3m0qg0ll6t28ru22ayyp9xydc7aj3l9jm3rqcry2xc",msg:(new TextEncoder).encode(JSON.stringify({collect_winnings:{}}))}}]).then((e=>{"error"===e.type&&console.log(error),"tx"===e.type&&console.log(e)})).catch((e=>{console.log(e)}))},async getLeaderbpard(){try{return await this.client.queryContractSmart("neutron1edsy5v3lty0j6xd5sg8nzcmnkuwjgu2887xrhyg7s8wxnww39kfqy3cu3k",{users:{}})}catch(error){return!1}}}})},78982:function(){},47790:function(){},73776:function(){},21638:function(){},92668:function(){},77965:function(){},66089:function(){},79368:function(){},77667:function(){},76447:function(){},64688:function(){},51069:function(){},15340:function(){},79838:function(){}},t={};function n(r){var o=t[r];if(void 0!==o)return o.exports;var c=t[r]={id:r,loaded:!1,exports:{}};return e[r].call(c.exports,c,c.exports,n),c.loaded=!0,c.exports}n.m=e,function(){var e=[];n.O=function(t,r,o,c){if(!r){var s=1/0;for(l=0;l<e.length;l++){r=e[l][0],o=e[l][1],c=e[l][2];for(var a=!0,i=0;i<r.length;i++)(!1&c||s>=c)&&Object.keys(n.O).every((function(e){return n.O[e](r[i])}))?r.splice(i--,1):(a=!1,c<s&&(s=c));if(a){e.splice(l--,1);var u=o();void 0!==u&&(t=u)}}return t}c=c||0;for(var l=e.length;l>0&&e[l-1][2]>c;l--)e[l]=e[l-1];e[l]=[r,o,c]}}(),function(){n.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return n.d(t,{a:t}),t}}(),function(){n.d=function(e,t){for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}}(),function(){n.f={},n.e=function(e){return Promise.all(Object.keys(n.f).reduce((function(t,r){return n.f[r](e,t),t}),[]))}}(),function(){n.u=function(e){return"js/"+e+"."+{46:"5a8b224a",290:"713f095d",291:"07652db1",705:"bc67dbf5",875:"57ef1b4b"}[e]+".js"}}(),function(){n.miniCssF=function(e){return"css/"+e+"."+{46:"76f34ec4",290:"fd70b964",291:"3ded0ed5",705:"e30fbb2f",875:"6a146aa2"}[e]+".css"}}(),function(){n.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){var e={},t="hakaton_spain:";n.l=function(r,o,c,s){if(e[r])e[r].push(o);else{var a,i;if(void 0!==c)for(var u=document.getElementsByTagName("script"),l=0;l<u.length;l++){var d=u[l];if(d.getAttribute("src")==r||d.getAttribute("data-webpack")==t+c){a=d;break}}a||(i=!0,a=document.createElement("script"),a.charset="utf-8",a.timeout=120,n.nc&&a.setAttribute("nonce",n.nc),a.setAttribute("data-webpack",t+c),a.src=r),e[r]=[o];var f=function(t,n){a.onerror=a.onload=null,clearTimeout(h);var o=e[r];if(delete e[r],a.parentNode&&a.parentNode.removeChild(a),o&&o.forEach((function(e){return e(n)})),t)return t(n)},h=setTimeout(f.bind(null,void 0,{type:"timeout",target:a}),12e4);a.onerror=f.bind(null,a.onerror),a.onload=f.bind(null,a.onload),i&&document.head.appendChild(a)}}}(),function(){n.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}}(),function(){n.nmd=function(e){return e.paths=[],e.children||(e.children=[]),e}}(),function(){n.p="/"}(),function(){if("undefined"!==typeof document){var e=function(e,t,r,o,c){var s=document.createElement("link");s.rel="stylesheet",s.type="text/css",n.nc&&(s.nonce=n.nc);var a=function(n){if(s.onerror=s.onload=null,"load"===n.type)o();else{var r=n&&n.type,a=n&&n.target&&n.target.href||t,i=new Error("Loading CSS chunk "+e+" failed.\n("+r+": "+a+")");i.name="ChunkLoadError",i.code="CSS_CHUNK_LOAD_FAILED",i.type=r,i.request=a,s.parentNode&&s.parentNode.removeChild(s),c(i)}};return s.onerror=s.onload=a,s.href=t,r?r.parentNode.insertBefore(s,r.nextSibling):document.head.appendChild(s),s},t=function(e,t){for(var n=document.getElementsByTagName("link"),r=0;r<n.length;r++){var o=n[r],c=o.getAttribute("data-href")||o.getAttribute("href");if("stylesheet"===o.rel&&(c===e||c===t))return o}var s=document.getElementsByTagName("style");for(r=0;r<s.length;r++){o=s[r],c=o.getAttribute("data-href");if(c===e||c===t)return o}},r=function(r){return new Promise((function(o,c){var s=n.miniCssF(r),a=n.p+s;if(t(s,a))return o();e(r,a,null,o,c)}))},o={524:0};n.f.miniCss=function(e,t){var n={46:1,290:1,291:1,705:1,875:1};o[e]?t.push(o[e]):0!==o[e]&&n[e]&&t.push(o[e]=r(e).then((function(){o[e]=0}),(function(t){throw delete o[e],t})))}}}(),function(){var e={524:0};n.f.j=function(t,r){var o=n.o(e,t)?e[t]:void 0;if(0!==o)if(o)r.push(o[2]);else{var c=new Promise((function(n,r){o=e[t]=[n,r]}));r.push(o[2]=c);var s=n.p+n.u(t),a=new Error,i=function(r){if(n.o(e,t)&&(o=e[t],0!==o&&(e[t]=void 0),o)){var c=r&&("load"===r.type?"missing":r.type),s=r&&r.target&&r.target.src;a.message="Loading chunk "+t+" failed.\n("+c+": "+s+")",a.name="ChunkLoadError",a.type=c,a.request=s,o[1](a)}};n.l(s,i,"chunk-"+t,t)}},n.O.j=function(t){return 0===e[t]};var t=function(t,r){var o,c,s=r[0],a=r[1],i=r[2],u=0;if(s.some((function(t){return 0!==e[t]}))){for(o in a)n.o(a,o)&&(n.m[o]=a[o]);if(i)var l=i(n)}for(t&&t(r);u<s.length;u++)c=s[u],n.o(e,c)&&e[c]&&e[c][0](),e[c]=0;return n.O(l)},r=self["webpackChunkhakaton_spain"]=self["webpackChunkhakaton_spain"]||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))}();var r=n.O(void 0,[504],(function(){return n(47079)}));r=n.O(r)})();
//# sourceMappingURL=app.be4c08e0.js.map