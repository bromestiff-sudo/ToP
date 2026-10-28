const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:844,height:390}});const errs=[];p.on('pageerror',e=>errs.push(e.message));const got=[];
const html=require('fs').readFileSync(require('path').resolve(__dirname,'../build/tw.html'),'utf8');
await p.route('http://tower.test/**',async r=>{const u=r.request().url();if(u.endsWith('/api/stats')){got.push(JSON.parse(r.request().postData()));return r.fulfill({body:'ok'});}if(u==='http://tower.test/')return r.fulfill({body:html,contentType:'text/html'});return r.fulfill({status:404,body:''});});
await p.goto('http://tower.test/');await p.waitForTimeout(1500);
await p.evaluate(()=>{const T=__T;T.S.mode='title';T.SV.metKeeper=true;T.SV.tutDone=true;T.newGame();T.newGame();});await p.waitForTimeout(1500);
await p.evaluate(()=>{const T=__T;T.SV.run=null;T.SV.introV=6;T.startRun(2);T.S.mode='play';});await p.waitForTimeout(800);
await p.evaluate(()=>{__T.G.statB.push('SPIN CHICKEN');__T.gameOver();setTimeout(()=>{null.x},10);setTimeout(()=>{null.x},20);});await p.waitForTimeout(1500);
console.log(JSON.stringify(got));console.log(errs);await b.close();})();
