// title menu: layout on desktop and phone, locked/unlocked modes, story and frenzy buttons, frenzy end buttons
const {chromium,devices}=require('playwright');const path=require('path');(async()=>{const b=await chromium.launch({executablePath:process.env.CHROMIUM||undefined});
const errs=[];const url='file://'+path.resolve(__dirname,'../build/tw.html');
const open=async(ctxOpts,name)=>{const c=await b.newContext(ctxOpts);const p=await c.newPage();p.on('pageerror',e=>errs.push(name+': '+e.message));
 await p.goto(url);await p.waitForTimeout(800);await p.evaluate(()=>{localStorage.clear();localStorage.setItem('top_lang','it')});await p.reload();await p.waitForTimeout(1500);
 await p.evaluate(()=>{const T=__T;T.S.mode='title';T.S.t=0;});await p.waitForTimeout(1500);return p;};
const tapBtn=async(p,i)=>{const r=await p.evaluate(i=>{const b=__T.S.tBtns[i].r,cv=document.querySelector('canvas'),c=cv.getBoundingClientRect();return [c.left+(b[0]+b[2]/2)/cv.width*c.width,c.top+(b[1]+b[3]/2)/cv.height*c.height];},i);await p.mouse.click(r[0],r[1]);};
const d=await open({viewport:{width:960,height:540},deviceScaleFactor:1.5},'desk');await d.screenshot({path:__dirname+'/out/title_desk.png'});
const ph=await open({...devices['Pixel 7 landscape']},'phone');try{await ph.getByText(/HO CAPITO|GOT IT/).click({timeout:2000});await ph.waitForTimeout(800);}catch(e){}await ph.screenshot({path:__dirname+'/out/title_phone.png'});
await tapBtn(d,2);await d.waitForTimeout(300);console.log('locked msg',await d.evaluate(()=>__T.S.tMsg&&__T.S.tMsg.s),await d.evaluate(()=>__T.S.mode));await d.screenshot({path:__dirname+'/out/title_locked.png'});
await d.evaluate(()=>{__T.SV.modes=['surv'];});await d.waitForTimeout(300);await tapBtn(d,3);await d.waitForTimeout(800);console.log('owned surv ->',await d.evaluate(()=>[__T.S.mode,!!__T.G.surv,!!__T.G.frenzy]));
await d.evaluate(()=>{__T.S.mode='title';});await d.waitForTimeout(500);await tapBtn(d,1);await d.waitForTimeout(800);console.log('frenzy ->',await d.evaluate(()=>[__T.S.mode,!!__T.G.frenzy]));
await d.evaluate(()=>{const G=__T.G;G.frenzy.t=.2;G.hp=G.hpMax;});await d.waitForTimeout(7000);await d.screenshot({path:__dirname+'/out/title_frover.png'});
const ob=await d.evaluate(()=>__T.S.oBtns&&__T.S.oBtns.length);console.log('over buttons',ob);
if(ob){const r=await d.evaluate(()=>{const b=__T.S.oBtns[1].r,cv=document.querySelector('canvas'),c=cv.getBoundingClientRect();return [c.left+(b[0]+b[2]/2)/cv.width*c.width,c.top+(b[1]+b[3]/2)/cv.height*c.height];});await d.mouse.click(r[0],r[1]);await d.waitForTimeout(1500);console.log('bastion ->',await d.evaluate(()=>[__T.S.mode,!!(__T.G&&__T.G.hub)]));}
await d.evaluate(()=>{__T.S.mode='title';});await d.waitForTimeout(500);await tapBtn(d,0);await d.waitForTimeout(800);console.log('story ->',await d.evaluate(()=>__T.S.mode));
console.log(errs.slice(0,8));await b.close();})();
