const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:844,height:390}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+require('path').resolve(__dirname,'../build/tw.html'));await p.waitForTimeout(800);await p.evaluate(()=>{localStorage.clear();localStorage.setItem('top_lang','it')});await p.reload();await p.waitForTimeout(1500);
await p.evaluate(()=>{const T=__T;T.S.mode='title';T.SV.metKeeper=true;T.SV.tutDone=true;T.newGame();T.newGame();});await p.waitForTimeout(1500);
await p.evaluate(()=>{__T.startTraining();});await p.waitForTimeout(500);
await p.evaluate(()=>{const T=__T.G.train;T.step=7;T.t=0;});
await p.waitForTimeout(3000);console.log(await p.evaluate(()=>[__T.S.mode,!!__T.G.train]));await p.keyboard.press('KeyT');console.log(errs);await b.close();})();
