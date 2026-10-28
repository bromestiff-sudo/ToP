const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:844,height:390},deviceScaleFactor:1.5});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+require('path').resolve(__dirname,'../build/tw.html'));await p.waitForTimeout(800);await p.evaluate(()=>{localStorage.clear();localStorage.setItem('top_lang','it')});await p.reload();await p.waitForTimeout(2500);
await p.mouse.click(420,200);await p.waitForTimeout(3500);await p.screenshot({path:__dirname+'/out/title_act1.png'});
await p.evaluate(()=>{__T.SV.deaths=1;});await p.waitForTimeout(600);await p.screenshot({path:__dirname+'/out/title_act1b.png'});await p.evaluate(()=>{__T.SV.pages=Array.from({length:21},(_,i)=>i+1);});await p.waitForTimeout(600);await p.screenshot({path:__dirname+'/out/title_act2.png'});
await p.evaluate(()=>{__T.SV.act3=1;});await p.waitForTimeout(600);await p.screenshot({path:__dirname+'/out/title_en.png'});
const s2=await b.newPage({viewport:{width:1000,height:900}});await s2.goto('file://'+__dirname+'/out/stats.html');await s2.screenshot({path:__dirname+'/out/stats.png',fullPage:true});
console.log(errs);await b.close();})();
