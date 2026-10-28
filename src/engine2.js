// ---------- the campfire: what happened up there is remembered down here ----------
function memNext(n){const D=IMZ[n];if(!D)return -1;const seen=(SV.imzs&&SV.imzs[n])||[],pend=(SV.memPend||[]).filter(p=>p[0]===n).map(p=>p[1]);
  for(let i=0;i<D.scenes.length;i++)if(!seen.includes(i)&&!pend.includes(i)&&imzCond(D.scenes[i].cond,n))return i;return -1;}
function imzRoomWanted(level){try{if(!imzOn()||level<1||level>6)return false;return memNext(level)>=0||Math.random()<.3;}catch(e){return false;}}
function imzSpotTouch(k){const n=k.n,si=memNext(n),L=[];SV.imzv=SV.imzv||{};SV.imzv[n]=(SV.imzv[n]||0)+1;
  if(si>=0){SV.memPend=SV.memPend||[];SV.memPend.push([n,si]);L.push(MEM.spot[n],MEM.later);}else L.push(MEM.again);
  saveSV();const x=k.x,y=k.y;playScene(L,TTX(tr(IMZ[n].title)),'',()=>{S.mode='play';setState();imzSpotReward(n,x,y);
    if(si>=0)banner(L3('A NEW MEMORY','UN NUOVO RICORDO','UN RECUERDO NUEVO'),L3('Spongey will tell it by the fire','Spugno lo racconterà al fuoco','Esponjito lo contará junto al fuego'),2.4,'#ffb040');});}
function imzSpotReward(n,x,y){const p=(t,dx,v)=>G.picks.push({x:x+dx,y:y+20,t,v:v||1,keep:1,life:999});
  if(n===1)p(G.hp<G.hpMax?'coffee':'soapbomb',0);
  else if(n===2){imzMap();banner(L3('HALF THE MAP','METÀ DELLA MAPPA','MEDIO MAPA'),L3('Someone dictated the way. It leads to a wall first.','Qualcuno ti ha dettato la strada. Porta prima davanti a un muro.','Alguien te ha dictado el camino. Primero lleva a un muro.'),2.4,'#ffe14a');}
  else if(n===3){p('corn',-8,2);p('corn',8,2);}
  else if(n===4)p(G.hp<G.hpMax?'coffee':'soapbomb',0);
  else if(n===5){p('corn',-10,2);p('corn',0,2);p('corn',10,2);}
  else{p('soapbomb',-8);p('key',8);}}
function drawImzSpot(k){const x=Math.round(k.x),y=Math.round(k.y),t=G.time,n=k.n;ctx.save();if(k.used)ctx.globalAlpha=.55;shadowAt(x,y+6,26);
  if(n===1){ell(ctx,x,y+2,9,5,'#4a4e46');ell(ctx,x,y,8,3,'#2a2a24');for(let i=0;i<5;i++){const h=3+Math.abs(Math.sin(t*8+i*1.7))*5;rect(ctx,x-4+i*2,y-h,2,h,i%2?'#ff8a2a':'#ffb030');}
    for(let i=0;i<4;i++){ell(ctx,x-22+i*6,y+12-(i%2)*3,2,1.2,'#2a1a10');ell(ctx,x+12+i*6,y+12-(i%2)*3,2,1.2,'#2a1a10');}}
  else if(n===2){rect(ctx,x-10,y-2,20,10,'#6a4628');rect(ctx,x-10,y-2,20,1,'#9a6a3c');rect(ctx,x-8,y-12,16,10,'#3a4a3a');rect(ctx,x-6,y-10,6,4,'#1a2a1a');ell(ctx,x+4,y-7,2,2,'#c8c4b4');rect(ctx,x+6,y-20,1,8,'#8a8a8a');
    ctx.strokeStyle='#8a1a2a';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(x-8,y-6);ctx.quadraticCurveTo(x-20,y+4,x-26,y-8);ctx.stroke();ctx.globalAlpha*=.5+.5*Math.sin(t*5);rect(ctx,x-5,y-9,4,2,'#7fe08a');}
  else if(n===3){for(let i=0;i<3;i++){const cx=x-18+i*18;rect(ctx,cx-6,y-4,12,16,'#2a2418');rect(ctx,cx-5,y-3,10,14,i===1?'#f0ece4':'#d8d0bc');ell(ctx,cx,y+3,3,5,'rgba(255,255,255,.6)');}}
  else if(n===4){rect(ctx,x-14,y-14,28,24,'#7a4a44');for(let i=0;i<4;i++){ctx.save();ctx.translate(x,y-2);ctx.rotate(-.5+i*.33);rect(ctx,-16,-2,32,4,'#f0ece4');ctx.restore();}ell(ctx,x+3,y-1,3,2,'#8a1a2a');ell(ctx,x,y-4+Math.sin(t*2)*1,5,6,'rgba(255,255,255,.25)');}
  else if(n===5){ell(ctx,x,y+2,14,8,'#5a5a5a');ell(ctx,x,y+2,11,6,'#1a1410');ell(ctx,x+Math.sin(t)*2,y+3,4,3,'#d8d0c0');rect(ctx,x-2+Math.sin(t)*2,y+2,1,1,'#000');rect(ctx,x+1+Math.sin(t)*2,y+2,1,1,'#000');}
  else{for(let i=0;i<4;i++){const cx=x-12+i*8,h=i===3?14:8;rect(ctx,cx-1,y+4-h,3,h,'#f0e8d8');ell(ctx,cx,y+1-h,1.6,3+Math.sin(t*9+i),'#ffb040');}}
  ctx.restore();}
function memBubble(x,y,ch,col){const t=G.time,b=reduced?0:Math.round(Math.sin(t*3)*1.5);rect(ctx,x-7,y-9+b,14,9,'#000');rect(ctx,x-6,y-8+b,12,7,col||'#f4f1ea');rect(ctx,x-1,y-1+b,2,2,col||'#f4f1ea');
  NOTR=true;txt(ch,x,y-8+b,'#1a0e08','center',7,null);NOTR=false;}
function drawFireFolk(){const fx=182,fy=124,t=G.time,im=SPR.sponge;if(!im)return;const sx=fx+20,sy=fy+8;shadowAt(sx,sy+1,12);ctx.drawImage(im,Math.round(sx-im.width/2),Math.round(sy-im.height));
  if((SV.memPend||[]).length)memBubble(sx,sy-im.height-4,'...');
  if((SV.colPend||[]).length&&SPR.plunger){const c=SPR.plunger,cx=fx-22,cy=fy+8;shadowAt(cx,cy+1,12);ctx.drawImage(c,Math.round(cx-c.width/2),Math.round(cy-c.height));if(!(SV.memPend||[]).length)memBubble(cx,cy-c.height-4,'!','#ffe14a');}}
function fireTalk(){const back=()=>{S.mode='hub';setState();},T0=TTX(L3('THE CAMPFIRE','IL FUOCO DEL BALUARDO','LA HOGUERA DEL BALUARTE'));
  if((SV.memPend||[]).length){const q=SV.memPend.shift();saveSV();memPlay(q[0],q[1]);return;}
  if((SV.colPend||[]).length){const key=SV.colPend.shift();saveSV();const C=MEMCOL[key],ck={'2:2':'i2','5:2':'i5'}[key],v=C?(C['*']||C[(SV.imzc||{})[ck]]):null;if(v){playScene(v,T0,'',back);return;}}
  playScene([MEM.idle[ri(0,MEM.idle.length-1)]],T0,'',back);}
function memPlay(n,si){const D=IMZ[n],sc=D&&D.scenes[si],back=()=>{S.mode='hub';setState();};if(!sc){back();return;}
  SV.imzs=SV.imzs||{};const seen=SV.imzs[n]=SV.imzs[n]||[],first=!seen.length;if(!seen.includes(si))seen.push(si);saveSV();
  const title=TTX(L3('MEMORY · ','RICORDO · ','RECUERDO · ')+tr(D.title)),sub=TTX(tr(sc.name));
  const after=()=>{const key=n+':'+si;if(MEMCOL[key]){SV.colPend=SV.colPend||[];if(!SV.colPend.includes(key))SV.colPend.push(key);saveSV();}
    if(n===4&&si===0){imzTriage(()=>back());return;}back();};
  playScene([MEM.hook[n]],TTX(L3('THE CAMPFIRE','IL FUOCO DEL BALUARDO','LA HOGUERA DEL BALUARTE')),'',()=>{playScene((first?D.place:D.place.slice(0,1)).concat(sc.lines),title,sub,()=>{if(sc.choice)imzChoice(sc.choice,title,sub,after);else after();});S.scene.flash=true;});}
function memNotice(){if(S.mode!=='hub'||!(SV.memPend||[]).length)return;banner(L3('A NEW MEMORY','UN NUOVO RICORDO','UN RECUERDO NUEVO'),L3('Spongey is waiting by the fire','Spugno ti aspetta al fuoco','Esponjito te espera junto al fuego'),2.6,'#ffb040');}
function towerGames(){const L=[[1,'itape'],[2,'itune'],[3,'ichalk'],[5,'iraft'],[6,'icandle']];
  openMenu(L3('TOWER GAMES','GIOCHI DELLA TORRE','JUEGOS DE LA TORRE'),()=>L.map(([n,g])=>{const ok=((SV.imzs||{})[n]||[]).length>0,M=MG[g],R=mgRec(g);
    return {label:ok?M.name():'???',right:ok&&R.best?M.fmt(R.best):'',col:ok?'#e8dcc0':'#5a4a3a',desc:ok?L3('A memory of the climb, played again. Medals: ','Un ricordo della salita, da rigiocare. Medaglie: ','Un recuerdo de la subida, para volver a jugarlo. Medallas: ')+M.medals.map(M.fmt).join(' / '):L3('Remember this place by the fire first.','Prima ricorda questo posto al fuoco.','Primero recuerda este sitio junto al fuego.'),
      act(){if(!ok){SFX.tink();return;}closeMenu();startMG(g);}};}),'hub');}
function drawTowerCab(on,t){const x=312,y=176;rect(ctx,x-12,y-2,24,30,'#1a0e08');rect(ctx,x-11,y-1,22,28,'#2a1a2a');rect(ctx,x-11,y-1,22,5,'#c8a0ff');
  rect(ctx,x-8,y+6,16,11,'#0a0608');ctx.globalAlpha=.5+.3*Math.sin(t*3);rect(ctx,x-7,y+7,14,9,'#5a3a7a');ctx.globalAlpha=1;ell(ctx,x,y+11,2,3,'#ffb040');
  rect(ctx,x-9,y+19,18,3,'#2a1a10');if(on){ctx.globalAlpha=.25;ell(ctx,x,y+36,14,8,'#c8a0ff');ctx.globalAlpha=1;txt(L3('TOWER GAMES','GIOCHI DELLA TORRE','JUEGOS DE LA TORRE'),clamp(x,G.cam.x+70,G.cam.x+VW-70),150,'#c8a0ff','center',7,'#000');}}
