// title sky for each act
const {chromium}=require('playwright');const path=require('path');(async()=>{const b=await chromium.launch({executablePath:process.env.CHROMIUM||undefined});
const p=await b.newPage({viewport:{width:960,height:540},deviceScaleFactor:1.5});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+path.resolve(__dirname,'../build/tw.html'));await p.waitForTimeout(800);await p.evaluate(()=>{localStorage.clear();localStorage.setItem('top_lang','it')});await p.reload();await p.waitForTimeout(1500);
await p.evaluate(()=>{__T.S.mode='title';});await p.waitForTimeout(1500);
const shot=async n=>{const c=await p.$('canvas');await c.screenshot({path:__dirname+'/out/sky_'+n+'.png'});};
await shot('act1');
await p.evaluate(()=>{__T.SV.pages=Array.from({length:21},(_,i)=>i+1);});await p.waitForTimeout(800);await shot('act2');
await p.evaluate(()=>{__T.SV.act3=1;});await p.waitForTimeout(800);await shot('act3');
await p.evaluate(()=>{__T.SV.qp=Array.from({length:14},(_,i)=>'q'+i);});await p.waitForTimeout(13000);await shot('act3_qs');
console.log(errs);await b.close();})();
