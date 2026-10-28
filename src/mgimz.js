 // ----- intermezzo 1: tape Spongey's tears shut -----
 itape:{name:()=>L3('PATCH UP SPONGEY','RATTOPPA SPUGNO','REMIENDA A ESPONJITO'),desc:()=>'',medals:[6,10,14],fmt:v=>v+L3(' closed',' chiusi',' cerrados'),
  spots:[[-.22,-.28],[.2,-.22],[0,-.05],[-.28,.08],[.27,.12],[-.1,.28],[.14,.32]],
  init(){return {tl:22,tears:this.spots.map(()=>({w:0,life:0,perm:false,fx:0})),sp:.6,cur:0,open:0};},
  hud(){return Math.ceil(MGS.tl)+'s   '+MGS.score;},
  box(){const s=SPR.sponge,h=H*.62,k=h/s.height,w=s.width*k;return {x:W/2-w/2,y:H*.2,w,h,k};},
  pos(i){const b=this.box(),q=this.spots[i];return [b.x+b.w*(.5+q[0]),b.y+b.h*(.5+q[1])];},
  close(i){const g=MGS,t=g.tears[i];if(t&&t.w>0&&!t.perm){t.w=0;t.fx=.5;g.score++;SFX.pick();return true;}tone(160,.05,'square',.02);return false;},
  update(dt){const g=MGS;g.tl-=dt;if(g.tl<=0){mgFinish();return;}g.sp-=dt;
    if(g.sp<=0){const free=g.tears.map((t,i)=>t.w||t.perm?-1:i).filter(i=>i>=0);if(free.length){const i=free[ri(0,free.length-1)],L=Math.max(1.3,2.6-(22-g.tl)*.05);g.tears[i].w=L;g.tears[i].life=L;}g.sp=Math.max(.45,1-(22-g.tl)*.025)*rnd(.7,1.3);}
    for(const t of g.tears){if(t.fx>0)t.fx-=dt;if(t.w>0){t.w-=dt;if(t.w<=0){t.w=0;t.perm=true;g.open++;SFX.hurt();}}}},
  down(x,y){let best=-1,bd=1e9;for(let i=0;i<this.spots.length;i++){const [px,py]=this.pos(i),d=Math.hypot(px-x,py-y);if(d<bd&&MGS.tears[i].w>0){bd=d;best=i;}}if(best>=0&&bd<H*.14)this.close(best);},
  key(c,dn){if(!dn)return;if(c==='Space'||c==='Enter'){const g=MGS;let o=-1,ol=1e9;g.tears.forEach((t,i)=>{if(t.w>0&&t.w<ol){ol=t.w;o=i;}});if(o>=0)this.close(o);}},
  draw(){const g=MGS,t=g.t,b=this.box();rect(ctx,0,0,W,H,'#140c08');
    const fl=.6+.4*Math.sin(t*9)*Math.sin(t*5.3);const gr=ctx.createRadialGradient(W*.12,H*.85,4,W*.12,H*.85,H*.7);gr.addColorStop(0,'rgba(255,140,60,'+(.35*fl).toFixed(2)+')');gr.addColorStop(1,'rgba(0,0,0,0)');ctx.fillStyle=gr;ctx.fillRect(0,0,W,H);
    ell(ctx,W*.12,H*.9,22,8,'#3a4030');ell(ctx,W*.12,H*.86,10+fl*4,14+fl*6,'#ff8a2a');ell(ctx,W*.12,H*.84,5,9,'#ffe14a');
    for(let k=0;k<13;k++){const x=W*.62+k*W*.028,y=H*.92-(k%2)*3;rect(ctx,x,y,7,3,'#2a1a10');}
    ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(SPR.sponge,b.x,b.y,b.w,b.h);ctx.restore();
    g.tears.forEach((tr0,i)=>{const [x,y]=this.pos(i),r=H*.035;
      if(tr0.perm){ell(ctx,x,y,r*1.1,r*.45,'#1a0606');rect(ctx,x-r,y,r*2,1,'#5a0a14');}
      else if(tr0.w>0){const u=tr0.w/tr0.life;ell(ctx,x,y,r*(1.4-u*.6),r*(.6-u*.25),'#2a0408');ell(ctx,x,y,r*(1.1-u*.5),r*(.35-u*.15),'#c8202a');
        ctx.strokeStyle='#ff3a4a';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,y);for(let k=1;k<6;k++)ctx.lineTo(x+Math.sin(t*12+k+i)*3*k*.4,y-k*3*(u+.3));ctx.stroke();
        ctx.strokeStyle=u>.35?'#ffe14a':'#ff4a4a';ctx.lineWidth=2;ctx.beginPath();ctx.arc(x,y,r*1.6,-Math.PI/2,-Math.PI/2+TAU*u);ctx.stroke();}
      if(tr0.fx>0){ctx.globalAlpha=Math.min(1,tr0.fx*2);for(let k=-1;k<=1;k++)rect(ctx,x-r*1.2,y+k*3-1,r*2.4,2,'#e8e0c8');ctx.globalAlpha=1;}});
    mgTip(isTouch?L3('Tap the tears before they stay open','Tocca gli strappi prima che restino aperti','Toca los desgarros antes de que se queden abiertos'):L3('Click the tears · Space closes the oldest','Clic sugli strappi · Spazio chiude il più vecchio','Clic en los desgarros · Espacio cierra el más viejo'));},
  extra(cx,y){if(MGS.open)txt(L3('"It\'s nothing, Sarge."','"Non è niente, Sergente."','"No es nada, Sargento."'),cx,y,'#ff9a8a','center',8,null);}},
 // ----- intermezzo 2: tune the dead radio -----
 itune:{name:()=>L3('THE RADIO POST','LA POSTAZIONE RADIO','EL PUESTO DE RADIO'),desc:()=>'',medals:[1,2,3],fmt:v=>v+'/3',
  frags:[['"...Bastion here. Do not stop on the landings..."','"...qui Baluardo. Non fermatevi sui pianerottoli..."','"...aquí Baluarte. No os paréis en los rellanos..."'],
   ['"...Private Softly, serial four-one-one... four-one-one... one..."','"...soldato Soffice, matricola quattro-uno-uno... quattro-uno-uno... uno..."','"...soldado Suavecito, número cuatro-uno-uno... cuatro-uno-uno... uno..."'],
   ['"...it is warm in here. Come. There is room..."','"...qui dentro è caldo. Venite. C\'è posto..."','"...aquí dentro hace calor. Venid. Hay sitio..."']],
  init(){const tg=[ri(12,30),ri(42,58),ri(70,88)].sort(()=>Math.random()-.5);return {tl:40,f:50,tg,ti:0,lock:0,chew:[ri(8,92),ri(8,92)],still:0,msg:'',msgT:0,kl:0,kr:0,drag:null,lastF:50};},
  hud(){return Math.ceil(MGS.tl)+'s   '+MGS.score+'/3';},
  sx(f){return W*.1+W*.8*f/100;},
  update(dt){const g=MGS;g.tl-=dt;if(g.tl<=0||g.ti>=3){mgFinish();return;}g.f=clamp(g.f+(g.kr-g.kl)*38*dt,0,100);
    const T=g.tg[g.ti];if(Math.abs(g.f-T)<4){g.lock+=dt;if(g.lock>=1.6){g.score++;g.msg=L3(...this.frags[g.ti]);g.msgT=3;g.ti++;g.lock=0;SFX.win();}}else g.lock=Math.max(0,g.lock-dt*1.5);
    const mv=Math.abs(g.f-g.lastF);g.lastF=g.f;const nc=g.chew.some(c=>Math.abs(g.f-c)<5);if(nc){g.still=mv<.05?g.still+dt:0;if(Math.random()<dt*6&&g.still<1)noise(.05,.03,700);}else g.still=0;if(g.msgT>0)g.msgT-=dt;},
  down(x,y){MGS.drag=x;},move(x,y,pt,btn){const g=MGS;if(g.drag!=null&&(btn||pt==='touch')){g.f=clamp(g.f+(x-g.drag)/(W*.8)*100,0,100);g.drag=x;}},up(){MGS.drag=null;},
  key(c,dn){const g=MGS;if(c==='ArrowLeft'||c==='KeyA')g.kl=dn?1:0;if(c==='ArrowRight'||c==='KeyD')g.kr=dn?1:0;},
  draw(){const g=MGS,t=g.t;rect(ctx,0,0,W,H,'#120c0a');rect(ctx,W*.06,H*.16,W*.88,H*.56,'#3a3024');rect(ctx,W*.08,H*.2,W*.84,H*.24,'#1a1610');
    for(let k=0;k<=20;k++){const x=this.sx(k*5);rect(ctx,x,H*.36,1,k%2?4:8,'#8a7a5a');}
    if(g.ti<3){const T=g.tg[g.ti];rect(ctx,this.sx(T-4),H*.24,this.sx(T+4)-this.sx(T-4),H*.12,'rgba(80,220,120,.35)');}
    const x=this.sx(g.f);rect(ctx,x-1,H*.21,3,H*.22,'#ff3a3a');
    const near=g.ti<3?Math.max(0,1-Math.abs(g.f-g.tg[g.ti])/30):0;for(let k=0;k<70*(1-near*.8);k++)rect(ctx,W*.1+Math.random()*W*.8,H*.48+Math.random()*H*.16,1,1,'rgba(220,220,200,.5)');
    if(g.lock>0){rect(ctx,W*.3,H*.66,W*.4*Math.min(1,g.lock/1.6),4,'#7fe08a');}
    const ch=g.chew.some(c=>Math.abs(g.f-c)<5);if(ch)txt(g.still>1?L3('...the chewing stops.','...la masticazione si ferma.','...deja de masticar.'):L3('...chew... chew...','...mastica... mastica...','...mastica... mastica...'),W/2,H*.5,g.still>1?'#ff4a5a':'#c8a0a0','center',9,'#000');
    if(g.msgT>0)drawDesc(g.msg,W*.1,H*.76,W*.8,9,2,'#ecd078',13);
    ell(ctx,W*.85,H*.6,H*.06,H*.06,'#5a4a34');rect(ctx,W*.85+Math.cos(g.f/100*TAU)*H*.04,H*.6+Math.sin(g.f/100*TAU)*H*.04,3,3,'#ecd078');
    mgTip(isTouch?L3('Drag to turn the dial · stay in the green','Trascina per girare · resta nel verde','Arrastra para girar · quédate en el verde'):L3('Left / right to turn · stay in the green','Sinistra / destra per girare · resta nel verde','Izquierda / derecha para girar · quédate en el verde'));}},
 // ----- intermezzo 3: follow the chalk arrows -----
 ichalk:{name:()=>L3('THE CHALK MARKS','I SEGNI DI GESSO','LAS MARCAS DE TIZA'),desc:()=>'',medals:[6,12,18],fmt:v=>v+L3(' marks',' segni',' marcas'),
  init(){return {round:0,lens:[3,4,5,6],seq:[],phase:'wait',pt:.8,si:0,inp:0,flash:-1,flashT:0,bad:0,cur:4,dirs:[]};},
  hud(){return L3('ROUND ','GIRO ','RONDA ')+Math.min(4,MGS.round+1)+'/4   '+MGS.score;},
  cell(i){const c=i%3,r=Math.floor(i/3),w=W*.2,h=H*.2;return {x:W*.17+c*(w+W*.04),y:H*.14+r*(h+H*.04),w,h};},
  next(){const g=MGS;if(g.round>=4){mgFinish();return;}const n=g.lens[g.round];g.seq=[];g.dirs=[];for(let k=0;k<n;k++){let c;do c=ri(0,8);while(k&&c===g.seq[k-1]);g.seq.push(c);g.dirs.push(ri(0,3));}g.phase='show';g.si=0;g.pt=.7;g.inp=0;},
  tap(i){const g=MGS;if(g.phase!=='input')return;g.flash=i;g.flashT=.25;if(i===g.seq[g.inp]){g.inp++;tone(500+g.inp*80,.08,'triangle',.04);if(g.inp>=g.seq.length){g.score+=g.seq.length;g.round++;g.phase='wait';g.pt=.9;SFX.pick();}}
    else{g.bad=.6;SFX.hurt();g.round++;g.phase='wait';g.pt=1;}},
  update(dt){const g=MGS;if(g.flashT>0)g.flashT-=dt;if(g.bad>0)g.bad-=dt;
    if(g.phase==='wait'){g.pt-=dt;if(g.pt<=0)this.next();}
    else if(g.phase==='show'){g.pt-=dt;if(g.pt<=0){g.si++;g.pt=.75;if(g.si>=g.seq.length){g.phase='input';}}}},
  down(x,y){for(let i=0;i<9;i++){const c=this.cell(i);if(x>c.x&&x<c.x+c.w&&y>c.y&&y<c.y+c.h){MGS.cur=i;this.tap(i);return;}}},
  key(c,dn){if(!dn)return;const g=MGS;if(/^Digit[1-9]$/.test(c)){this.tap(+c.slice(5)-1);return;}if(c==='ArrowLeft'||c==='KeyA')g.cur=(g.cur+8)%9;if(c==='ArrowRight'||c==='KeyD')g.cur=(g.cur+1)%9;if(c==='ArrowUp'||c==='KeyW')g.cur=(g.cur+6)%9;if(c==='ArrowDown'||c==='KeyS')g.cur=(g.cur+3)%9;if(c==='Space'||c==='Enter')this.tap(g.cur);},
  mark(x,y,s,dir,hand,a){ctx.save();ctx.globalAlpha=a;ctx.translate(x,y);ctx.rotate(hand?Math.PI/2:dir*Math.PI/2);ctx.strokeStyle='#f0ece0';ctx.lineWidth=3;ctx.lineCap='round';ctx.beginPath();
    if(hand){ctx.moveTo(-s*.4,0);ctx.lineTo(s*.25,0);for(let k=-2;k<=2;k++){ctx.moveTo(s*.25,k*s*.12);ctx.lineTo(s*.55,k*s*.16);}}else{ctx.moveTo(-s*.5,0);ctx.lineTo(s*.5,0);ctx.lineTo(s*.25,-s*.25);ctx.moveTo(s*.5,0);ctx.lineTo(s*.25,s*.25);}ctx.stroke();ctx.restore();},
  draw(){const g=MGS,t=g.t;rect(ctx,0,0,W,H,g.bad>0?'#2a0a0a':'#1a1612');
    for(let i=0;i<9;i++){const c=this.cell(i);rect(ctx,c.x,c.y,c.w,c.h,'#3a342a');rect(ctx,c.x,c.y,c.w,2,'#4a4236');
      const lit=(g.phase==='show'&&g.seq[g.si]===i&&g.pt>.2)||(g.flash===i&&g.flashT>0);
      if(lit){const k=g.phase==='show'?g.si:g.inp,hand=g.round===3&&k>=g.seq.length-2;this.mark(c.x+c.w/2,c.y+c.h/2,Math.min(c.w,c.h)*.7,g.dirs[k]||0,hand,1);}
      else{this.mark(c.x+c.w/2,c.y+c.h/2,Math.min(c.w,c.h)*.6,(i+Math.floor(t/3))%4,false,.035);}
      if(!isTouch&&g.cur===i){ctx.strokeStyle='#ffe14a';ctx.lineWidth=1.5;ctx.strokeRect(c.x-2,c.y-2,c.w+4,c.h+4);}}
    txt(g.phase==='show'?L3('WATCH','GUARDA','MIRA'):g.phase==='input'?L3('YOUR TURN','TOCCA A TE','TE TOCA'):'',W/2,H*.88,'#ecd078','center',9,'#000');
    mgTip(isTouch?L3('Watch the arrows, then tap them in order','Guarda le frecce, poi toccale in ordine','Mira las flechas y luego tócalas en orden'):L3('Watch, then repeat: click, 1-9 or arrows + Space','Guarda, poi ripeti: clic, 1-9 o frecce + Spazio','Mira y repite: clic, 1-9 o flechas + Espacio'));}},
 // ----- intermezzo 5: the raft on the rising cistern -----
 iraft:{name:()=>L3('THE RISING CISTERN','LA CISTERNA CHE SALE','LA CISTERNA QUE SUBE'),desc:()=>'',medals:[5,10,15],fmt:v=>v+L3(' bottles',' bottiglie',' botellas'),
  init(){return {tl:32,x:.5,objs:[],sp:.4,hp:3,kl:0,kr:0,tx:null,hand:0,inv:0,scroll:0};},
  hud(){return Math.ceil(MGS.tl)+'s   '+MGS.score+'   '+'♥'.repeat(Math.max(0,MGS.hp));},
  update(dt){const g=MGS;g.tl-=dt;if(g.tl<=0||g.hp<=0){mgFinish();return;}g.scroll+=dt;if(g.inv>0)g.inv-=dt;
    if(g.tx!=null)g.x+=clamp(g.tx-g.x,-1.2*dt,1.2*dt);g.x=clamp(g.x+(g.kr-g.kl)*.9*dt,.08,.92);
    g.sp-=dt;if(g.sp<=0){const r=Math.random();g.objs.push({x:rnd(.08,.92),y:-.05,k:r<.38?'bottle':r<.75?'deb':'whirl',a:rnd(0,TAU)});g.sp=Math.max(.32,.75-(32-g.tl)*.012)*rnd(.7,1.2);}
    const v=.32+(32-g.tl)*.006;for(const o of g.objs){o.y+=v*dt;if(o.k==='whirl'&&Math.abs(o.y-.82)<.12){g.x+=(o.x-g.x)*.6*dt;}
      if(!o.hit&&Math.abs(o.y-.8)<.06&&Math.abs(o.x-g.x)<.09){o.hit=true;if(o.k==='bottle'){g.score++;SFX.pick();}else if(g.inv<=0){g.hp--;g.inv=1;SFX.hurt();}}}
    g.objs=g.objs.filter(o=>o.y<1.1&&!(o.hit&&o.k==='bottle'));if(Math.random()<dt*.25)g.hand=1.2;if(g.hand>0)g.hand-=dt;},
  down(x){MGS.tx=x/W;},move(x,y,pt,btn){if(btn||pt==='touch')MGS.tx=x/W;},up(){MGS.tx=null;},
  key(c,dn){const g=MGS;if(c==='ArrowLeft'||c==='KeyA')g.kl=dn?1:0;if(c==='ArrowRight'||c==='KeyD')g.kr=dn?1:0;},
  draw(){const g=MGS,t=g.t;rect(ctx,0,0,W,H,'#1a100c');
    for(let k=0;k<14;k++){const y=((k/14+g.scroll*.12)%1)*H;rect(ctx,0,y,W,H/14+1,k%2?'#2a1a14':'#24160f');}
    for(let k=0;k<5;k++){const fx=((k*.23+.1)%1)*W,fy=((k*.37+g.scroll*.05)%1)*H;ctx.globalAlpha=.12;ell(ctx,fx,fy,14,18,'#e8e0d0');rect(ctx,fx-6,fy-4,3,2,'#000');rect(ctx,fx+3,fy-4,3,2,'#000');rect(ctx,fx-3,fy+6,6,1,'#000');ctx.globalAlpha=1;}
    for(const o of g.objs){const x=o.x*W,y=o.y*H;if(o.k==='bottle'){rect(ctx,x-3,y-7,6,12,'#4a8a4a');rect(ctx,x-1,y-10,2,3,'#c8a060');rect(ctx,x-2,y-5,1,6,'#9ae09a');}
      else if(o.k==='deb'){rect(ctx,x-8,y-4,16,8,'#5a4a3a');rect(ctx,x-8,y+2,6,4,'#3a2a1a');}
      else{ctx.strokeStyle='rgba(200,180,140,.5)';ctx.lineWidth=1.5;for(let k=0;k<3;k++){ctx.beginPath();ctx.arc(x,y,6+k*5,t*3+k,t*3+k+4);ctx.stroke();}}}
    const rx=g.x*W,ry=H*.82,K=Math.max(1.6,H/220);if(!(g.inv>0&&Math.floor(t*10)%2)){rect(ctx,rx-24*K,ry-5*K,48*K,10*K,'#8a6a3a');rect(ctx,rx-24*K,ry-5*K,48*K,2*K,'#a8884a');ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(SPR.jan[0],rx-17*K,ry-24*K,15*K,19*K);ctx.drawImage(SPR.sponge,rx+2*K,ry-21*K,14*K,17*K);ctx.restore();}
    if(g.hand>0){const hx=rx+(g.hand>.6?-28:28)*K;ell(ctx,hx,ry+4,5,7,'#f0ece4');for(let k=0;k<4;k++)rect(ctx,hx-4+k*2.5,ry-6,1.5,6,'#f0ece4');}
    mgTip(isTouch?L3('Drag to steer · catch the bottles','Trascina per guidare · prendi le bottiglie','Arrastra para guiar · coge las botellas'):L3('Left / right to steer · catch the bottles','Sinistra / destra per guidare · prendi le bottiglie','Izquierda / derecha para guiar · coge las botellas'));}},
 // ----- intermezzo 6: light the candles of the brothers you found -----
 icandle:{name:()=>L3("SNOW'S CHAPEL",'LA CAPPELLA DI CANDIDO','LA CAPILLA DE NIEVE'),desc:()=>'',medals:[1,6,12],fmt:v=>v+'/12',
  init(){const met=(SV.tags||[]).concat(SV.fbMet||[]);return {tl:45,c:FBDEF.slice(0,12).map(d=>({met:met.includes(d.fb),lit:false,out:0})),cur:0,msg:'',who:'',msgT:0};},
  hud(){return Math.ceil(MGS.tl)+'s   '+MGS.score+'/12';},
  pos(i){const a=Math.PI*(1.05+i/11*.9);return [W/2+Math.cos(a)*W*.36,H*.62+Math.sin(a)*H*.42];},
  light(i){const g=MGS,c=g.c[i];if(!c||c.lit)return;if(c.met){c.lit=true;g.score++;const d=FBDEF[i];g.who=tr(d.name).split(',')[0];g.msg=LG==='it'?d.line[1]:tr(d.line[0]);g.msgT=3.5;SFX.pick();
      if(g.c.every(x=>x.lit||!x.met)){g.tl=Math.min(g.tl,2.5);}}else{c.out=1;g.who='';g.msg=L3('The wick bends towards the match and blows it out.','Lo stoppino si piega verso il fiammifero e lo spegne.','La mecha se inclina hacia la cerilla y la apaga.');g.msgT=2.5;noise(.3,.05,900);}},
  update(dt){const g=MGS;g.tl-=dt;if(g.tl<=0){mgFinish();return;}if(g.msgT>0)g.msgT-=dt;for(const c of g.c)if(c.out>0)c.out-=dt;},
  down(x,y){if(y>H*.84&&x>W*.8){mgFinish();return;}for(let i=0;i<12;i++){const [cx,cy]=this.pos(i);if(Math.hypot(x-cx,y-cy)<H*.08){MGS.cur=i;this.light(i);return;}}},
  key(c,dn){if(!dn)return;const g=MGS;if(c==='ArrowLeft'||c==='KeyA')g.cur=(g.cur+11)%12;if(c==='ArrowRight'||c==='KeyD')g.cur=(g.cur+1)%12;if(c==='Space'||c==='Enter')this.light(g.cur);if(c==='Backspace'||c==='KeyQ')mgFinish();},
  onFinish(){SV.candles=Math.max(SV.candles||0,MGS.score);},
  draw(){const g=MGS,t=g.t;const gr=ctx.createRadialGradient(W/2,H*.5,10,W/2,H*.5,Math.max(W,H)*.7);gr.addColorStop(0,'#5a4418');gr.addColorStop(1,'#140c04');ctx.fillStyle=gr;ctx.fillRect(0,0,W,H);
    ctx.globalAlpha=.1+.04*Math.sin(t*.7);ell(ctx,W/2,H*.45,W*.28,H*.34,'#000');ctx.globalAlpha=1;
    const v=(SV.imzv&&SV.imzv[6])||1,h13=Math.max(6,30-v*3);rect(ctx,W/2-3,H*.62-h13,6,h13,'#f0e8d8');ell(ctx,W/2,H*.62-h13-5,3,6+Math.sin(t*9),'#ffb040');
    for(let i=0;i<12;i++){const [x,y]=this.pos(i),c=g.c[i];rect(ctx,x-6,y+6,12,4,'#8a8a90');rect(ctx,x-3,y-10,6,16,c.met?'#f0e8d8':'#8a8070');
      if(c.lit){const f=1+Math.sin(t*11+i)*.15;ell(ctx,x,y-15,3*f,6*f,'#ffb040');ell(ctx,x,y-14,1.5,3,'#fff0a0');ctx.globalAlpha=.15;ell(ctx,x,y-12,16,16,'#ffd070');ctx.globalAlpha=1;}
      else if(c.out>0){ctx.globalAlpha=c.out;ell(ctx,x+4,y-16-(1-c.out)*10,3,3,'#8a8a8a');ctx.globalAlpha=1;}
      if(!isTouch&&g.cur===i){ctx.strokeStyle='#ffe14a';ctx.lineWidth=1;ctx.strokeRect(x-9,y-24,18,36);}}
    if(g.msgT>0){if(g.who)txt(g.who,W/2,H*.08,'#ecd078','center',9,'#000');drawDesc('«'+g.msg+'»',W*.15,H*.13,W*.7,9,2,'#f4f0e0',13);}
    rect(ctx,W*.82,H*.86,W*.14,H*.09,'#3a2614');rect(ctx,W*.82,H*.86,W*.14,1,'#ecd078');txt(L3('DONE','FINITO','HECHO'),W*.89,H*.885,'#f4f4f0','center',9,null);
    mgTip(isTouch?L3('Tap the candles of the brothers you found','Tocca le candele dei fratelli che hai trovato','Toca las velas de los hermanos que has encontrado'):L3('Left / right and Space to light · Q when done','Sinistra / destra e Spazio per accendere · Q per finire','Izquierda / derecha y Espacio para encender · Q para terminar'));}},
