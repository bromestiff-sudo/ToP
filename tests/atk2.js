const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:844,height:390},deviceScaleFactor:1.5});const errs=[];p.on('pageerror',e=>errs.push(e.message+' '+(e.stack||'').split('\n')[1]));
await p.goto('file://'+require('path').resolve(__dirname,'../build/tw.html'));await p.waitForTimeout(800);await p.evaluate(()=>{localStorage.clear();localStorage.setItem('top_lang','it')});await p.reload();await p.waitForTimeout(1500);
await p.evaluate(()=>{const T=__T;T.S.mode='title';T.SV.metKeeper=true;T.SV.tutDone=true;T.newGame();T.newGame();});await p.waitForTimeout(1500);
const list=process.argv[2].split(',').map(Number);
for(const bi of list){
 await p.evaluate(bi=>{const T=__T;const f=Math.min(7,T.BOSSDEFS[bi].tier+1);T.SV.run=null;T.SV.introV=6;T.startRun(f);T.S.mode='play';const G=T.G;G.hp=G.hpMax=999;G.bossPick=bi;const r=G.m.rooms.find(r=>r.boss);G.active=r;r.state='active';G.P.x=r.cx;G.P.y=r.cy+50;G.camSnap=true;T.startBossIntro();},bi);
 for(let w=0;w<20&&!(await p.evaluate(()=>!!__T.G.boss));w++)await p.waitForTimeout(400);await p.waitForTimeout(600);
 const res=await p.evaluate(()=>{const B=__T.G.boss;return B?[B.name,B.art||('h'+B.idx)]:null;});if(!res){console.log(bi,'no boss',await p.evaluate(()=>[__T.S.mode,__T.G.floor,!!__T.G.active,__T.G.queenNext,__T.S.scene&&__T.S.scene.lines&&__T.S.scene.lines.length]));continue;}
 const ms=await p.evaluate(k=>{try{return __T.ATKNEW[k];}catch(e){return null;}},res[1]);
 const out=[];for(const m of ms||[]){await p.evaluate(m=>{const B=__T.G.boss;if(!B)return;B.state=m;B.injd=1;B.t=0;B.k=0;B.e=0;B.a=0;B.cnt=0;B.phase=2;},m);let sawRest=false;
  for(let i=0;i<10;i++){await p.waitForTimeout(400);const st=await p.evaluate(()=>{const G=__T.G;G.hp=999;return G.boss&&G.boss.state;});if(st==='rest'){sawRest=true;break;}}
  out.push(m+(sawRest?':ok':':stuck'));if(m===ms[0])await p.screenshot({path:__dirname+`/out/atk_${bi}.png`});}
 console.log(bi,res[0],out.join(' '));}
console.log(errs.slice(0,10));await b.close();})();
