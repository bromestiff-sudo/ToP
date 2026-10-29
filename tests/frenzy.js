// FRENZY: title button, random runs, phases, timer end
const {chromium}=require('playwright');const path=require('path');(async()=>{const b=await chromium.launch({executablePath:process.env.CHROMIUM||undefined});
const p=await b.newPage({viewport:{width:960,height:540},deviceScaleFactor:1.5});const errs=[];p.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await p.goto('file://'+path.resolve(__dirname,'../build/tw.html'));await p.waitForTimeout(800);await p.evaluate(()=>{localStorage.clear();localStorage.setItem('top_lang','it')});await p.reload();await p.waitForTimeout(1500);
await p.mouse.click(480,270);await p.waitForTimeout(3500);await p.screenshot({path:__dirname+'/out/frenzy_title.png'});
// click the button where the game says it is
const xy=await p.evaluate(()=>{const b=__T.S.tBtns&&__T.S.tBtns[1]&&__T.S.tBtns[1].r,cv=document.querySelector('canvas'),r=cv.getBoundingClientRect();return b?[r.left+(b[0]+b[2]/2)/cv.width*r.width,r.top+(b[1]+b[3]/2)/cv.height*r.height]:null;}).catch(()=>null);
console.log('button',!!xy);
if(xy)await p.mouse.click(xy[0],xy[1]);else await p.keyboard.press('KeyF');
await p.waitForTimeout(1500);console.log('mode',await p.evaluate(()=>[__T.S.mode,!!__T.G.frenzy,__T.G.frenzy&&__T.G.frenzy.gun]));
const casts=[];for(let k=0;k<6;k++){await p.evaluate(k=>{const G=__T.G;G.hp=G.hpMax;G.P.inv=9;G.frenzy.el=k*30+29.5;G.frenzy.t=180-G.frenzy.el;},k);await p.waitForTimeout(1500);
 casts.push(await p.evaluate(()=>{const F=__T.G.frenzy;return [F.ph,F.twist,F.cast.join('/'),__T.G.enemies.filter(e=>!e.dead).length];}));if(k===3)await p.screenshot({path:__dirname+'/out/frenzy_play.png'});}
console.log(JSON.stringify(casts));
await p.evaluate(()=>{const G=__T.G;G.frenzy.t=0.3;G.hp=G.hpMax;});await p.waitForTimeout(5500);
console.log('end',await p.evaluate(()=>[__T.S.mode,__T.G.frenzy.win,__T.SV.best.frenzy]));await p.screenshot({path:__dirname+'/out/frenzy_over.png'});
// a second run is different
await p.evaluate(()=>__T.startFrenzy());await p.waitForTimeout(1200);console.log('run2',await p.evaluate(()=>[__T.G.frenzy.gun,__T.G.frenzy.cast.join('/'),__T.G.zone]));
console.log(errs.slice(0,8));await b.close();})();
