const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:844,height:390},deviceScaleFactor:2,hasTouch:true,isMobile:true});const errs=[];p.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await p.goto('file://'+require('path').resolve(__dirname,'../build/tw.html'));await p.waitForTimeout(800);
await p.evaluate(()=>{localStorage.clear();localStorage.setItem('top_lang','it');});await p.reload();await p.waitForTimeout(1500);
await p.evaluate(()=>{const T=__T;T.S.mode='title';T.SV.metKeeper=true;T.SV.tutDone=true;T.SV.chars=['two','bristle','duck','wipe','chick'];T.newGame();T.newGame();});await p.waitForTimeout(2500);
await p.evaluate(()=>{const G=__T.G;G.P.x=48;G.P.y=150;G.camSnap=true;});await p.waitForTimeout(400);await p.evaluate(()=>__T.openPad());await p.waitForTimeout(300);await p.screenshot({path:__dirname+'/out/chr_locker.png'});
await p.evaluate(()=>{const M=__T.S.menu;M.sel=3;});await p.waitForTimeout(200);await p.screenshot({path:__dirname+'/out/chr_locker2.png'});
for(const id of ['two','bristle','duck','wipe','chick']){const r=await p.evaluate(id=>{const T=__T;T.S.menu&&(T.S.menu.lock=false);T.SV.char=id;T.SV.run=null;T.SV.introV=6;T.startRun(1);T.S.mode='play';const G=T.G;
  const out=[id,G.wpn.id,G.hpMax,G.char.name];if(id==='two'){G.ply=1;const h=G.hp;G.P.inv=0;G.P.dash=0;G.P.dinv=0;T.hurtPlayer();out.push('hp '+h+'->'+G.hp);}return out;},id);console.log(JSON.stringify(r));}
await p.evaluate(()=>{const T=__T;T.SV.char='wipe';T.SV.run=null;T.startRun(1);T.S.mode='play';const G=T.G;const r=G.m.rooms.find(r=>!r.start&&!r.boss&&r.cells.length===1&&!r.kind)||G.m.rooms[1];G.P.x=r.cx;G.P.y=r.cy+30;G.camSnap=true;G.hp=99;});
await p.waitForTimeout(2500);await p.screenshot({path:__dirname+'/out/chr_wipe.png'});
// migration
await p.evaluate(()=>{localStorage.setItem(Object.keys(localStorage).find(k=>k.includes('save'))||'x','');});
console.log(errs);await b.close();})();
