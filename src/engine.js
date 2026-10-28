// ---------- intermezzi: between one floor and the next, scenes that unlock run after run ----------
function L3(e,i,s){const r=LG==='it'?i:LG==='es'?s:e;if(LG!=='en')TRC.set(r,r);return r;}
function TTX(s){if(LG!=='en')TRC.set(s,s);return s;}
function imzOn(){return !!(G&&!G.rush&&!G.surv&&!G.train&&!G.coop&&!G.coopGuest&&!G.daily&&!G.qm&&!G.hub);}
function imzDeaths(){return Math.max(SV.deaths||0,(SV.runs||0)-(SV.wins||0));}
function imzCond(c,n){if(!c||c==='first')return true;return c.split('|').some(alt=>alt.split('&').every(t=>{const p=t.split(':'),k=p[0],v=p[1];
  if(k==='act')return storyAct()>=+v;if(k==='free')return (SV.tags||[]).includes(v);if(k==='visit')return ((SV.imzv&&SV.imzv[n])||0)>=+v;if(k==='deaths')return imzDeaths()>=+v;
  if(k==='pages')return (SV.pages||[]).length>=+v;if(k==='maxl')return (SV.maxL||0)>=+v;if(k==='qp')return qCount()>=+v;
  if(k==='boss')return !!(SV.bk&&SV.bk[v]);if(k==='beaten')return !!SV.beaten;if(k==='tags')return fallenTagCount()>=+v;
  if(k==='choice'){const q=v.split('=');return q[1].split(',').includes((SV.imzc||{})[q[0]]);}return false;}));}
function imzRun(n,done){const D=IMZ[n];if(!D||!imzOn()){done();return;}
  SV.imzv=SV.imzv||{};SV.imzs=SV.imzs||{};SV.imzc=SV.imzc||{};SV.imzv[n]=(SV.imzv[n]||0)+1;const seen=SV.imzs[n]=SV.imzs[n]||[];
  let si=-1;for(let i=0;i<D.scenes.length;i++)if(!seen.includes(i)&&imzCond(D.scenes[i].cond,n)){si=i;break;}
  const first=SV.imzv[n]===1,title=TTX(L3('INTERMEZZO ','INTERMEZZO ','INTERMEDIO ')+n),sc=si>=0?D.scenes[si]:null,
    sub=TTX(tr(D.title)+(sc?' · '+tr(sc.name):'')),G0=G;G.imz={n,si,short:si<0};
  const act=()=>{if(G!==G0)return;playScene(D.act_intro,title,TTX(tr(D.title)),()=>imzAct(n,r=>imzReward(n,r,done)));};
  if(sc){seen.push(si);saveSV();playScene((first?D.place:D.place.slice(0,1)).concat(sc.lines),title,sub,()=>{if(sc.choice)imzChoice(sc.choice,title,sub,act);else act();});}
  else{saveSV();playScene(D.place.slice(0,1).concat(D.short),title,sub,act);}}
function imzMenu(title,rows){openMenu(title,()=>rows.map(o=>({label:o[0],right:o[3]||'',col:o[4]||'#ffe14a',desc:o[1],act(){S.menu.lock=false;o[2]();}})),'play');S.menu.lock=true;}
function imzChoice(ch,title,sub,next){imzMenu(ch.title,ch.opts.map(o=>[o.label,o.desc,()=>{SV.imzc=SV.imzc||{};SV.imzc[ch.key]=o.id;imzApply(ch.key,o.id);saveSV();playScene(o.after,title,sub,next);}]));}
function imzApply(k,v){if(k==='i4'&&v==='sheet'){SV.sheetDebt=1;}}
function imzAct(n,cb){if(n===4){imzTriage(cb);return;}startMG({1:'itape',2:'itune',3:'ichalk',5:'iraft',6:'icandle'}[n]);MGS.onExit=cb;}
function imzReward(n,r,done){const sc=r?Math.max(0,r.score|0):0;
  const fin=(msg,sub)=>{S.mode='play';setState();if(msg)banner(msg,sub||'',2.6,'#ffe14a');done();};
  const heal=()=>{G.hp=Math.min(G.hpMax,G.hp+1);fin(L3('+1 SHEET','+1 FOGLIO','+1 HOJA'));};
  const soap=()=>{G.soap=(G.soap||0)+1;fin(L3('+1 SOAP BOMB','+1 BOMBA DI SAPONE','+1 BOMBA DE JABÓN'));};
  const corn=c=>L3(' corn',' mais',' maíz');
  if(n===1){if(sc)addCredits(sc);imzMenu(L3('BEFORE YOU CLIMB','PRIMA DI SALIRE','ANTES DE SUBIR'),[
    [L3('RECOVER A SHEET','RECUPERA UN FOGLIO','RECUPERA UNA HOJA'),L3('Close one of your own tears: +1 sheet now.','Chiudi uno dei tuoi strappi: +1 foglio subito.','Cierra uno de tus desgarros: +1 hoja ahora.'),heal],
    [L3('SOAP BOMB','BOMBA DI SAPONE','BOMBA DE JABÓN'),L3('One more soap bomb for the next floor.','Una bomba di sapone in più per il prossimo piano.','Una bomba de jabón más para el próximo piso.'),soap]]);}
  else if(n===2){imzMap();if(sc)addCredits(sc*2);fin(L3('HALF THE MAP','METÀ DELLA MAPPA','MEDIO MAPA'),L3('Someone dictated the way. It leads to a wall first.','Qualcuno ti ha dettato la strada. Porta prima davanti a un muro.','Alguien te ha dictado el camino. Primero lleva a un muro.'));}
  else if(n===3){if(sc)addCredits(Math.floor(sc/3));const rows=[
    [L3('A DIARY PAGE','UNA PAGINA DEL DIARIO','UNA PÁGINA DEL DIARIO'),L3('A page missing from the Archive. Read it there.','Una pagina che manca nell\'Archivio. La leggerai lì.','Una página que falta en el Archivo. La leerás allí.'),()=>{const id=imzPage();if(id)fin(L3('DIARY PAGE FOUND','PAGINA DEL DIARIO TROVATA','PÁGINA DEL DIARIO ENCONTRADA'),L3('Read it in the Archive','Leggila nell\'Archivio','Léela en el Archivo'));else{addCredits(8);fin('+8'+corn());}}],
    [L3('CORN','MAIS','MAÍZ'),L3('Corn from the packs of the Forty. +8.','Mais dagli zaini dei Quaranta. +8.','Maíz de las mochilas de los Cuarenta. +8.'),()=>{addCredits(8);fin('+8'+corn());}]];
    if(G.imz&&G.imz.short)rows.push([L3('POLISH YOUR WEAPON','LUCIDA L\'ARMA','PULE TU ARMA'),L3('Deep Clean: +20% damage for this whole floor, but one max sheet less until the end of it.','Pulizia Profonda: +20% di danno per tutto il piano, ma un foglio massimo in meno fino alla fine del piano.','Limpieza Profunda: +20% de daño en todo el piso, pero una hoja máxima menos hasta que acabe.'),()=>{G.fustoF=G.floor;G.hpMax=Math.max(1,G.hpMax-1);G.hp=Math.min(G.hp,G.hpMax);fin(L3('THE NINE COTS CREAK','LE NOVE BRANDE SCRICCHIOLANO','LOS NUEVE CATRES CRUJEN'),L3('+20% damage on this floor','+20% di danno su questo piano','+20% de daño en este piso'));},'','#ff9a8a']);
    imzMenu(L3('WHAT YOU TAKE WITH YOU','COSA PORTI VIA','LO QUE TE LLEVAS'),rows);}
  else if(n===4){imzMenu(L3('A BANDAGE','UNA BENDA','UNA VENDA'),[
    [L3('USE IT NOW','USALA SUBITO','ÚSALA YA'),L3('+1 sheet now.','+1 foglio subito.','+1 hoja ahora.'),heal],
    [L3('KEEP IT','TIENILA','GUÁRDALA'),L3('The first time you drop to one sheet, it closes the tear by itself.','La prima volta che scendi a un foglio, chiude lo strappo da sola.','La primera vez que te quedes con una hoja, cierra el desgarro sola.'),()=>{G.bandage=1;fin(L3('BANDAGE KEPT','BENDA TENUTA','VENDA GUARDADA'));}]]);}
  else if(n===5){const c=sc*2;if(c)addCredits(c);fin(L3('BOTTLES: ','BOTTIGLIE: ','BOTELLAS: ')+sc,'+'+c+corn());}
  else if(n===6){imzMenu(L3('A BLESSING FOR FLOOR 7','UNA BENEDIZIONE PER IL PIANO 7','UNA BENDICIÓN PARA EL PISO 7'),[
    [L3('SOAP BOMB','BOMBA DI SAPONE','BOMBA DE JABÓN'),L3('One more soap bomb.','Una bomba di sapone in più.','Una bomba de jabón más.'),soap],
    [L3('A KEY','UNA CHIAVE','UNA LLAVE'),L3('One more key.','Una chiave in più.','Una llave más.'),()=>{G.keys=(G.keys||0)+1;fin(L3('+1 KEY','+1 CHIAVE','+1 LLAVE'));}],
    [L3('THE WEAK POINT','IL PUNTO DEBOLE','EL PUNTO DÉBIL'),L3('Snow shows you where it is soft. +15% damage to the boss of floor 7.','Candido ti mostra dove è morbido. +15% di danno al boss del piano 7.','Nieve te enseña dónde es blando. +15% de daño al jefe del piso 7.'),()=>{G.weakpt=1;fin(L3('THE WEAK POINT','IL PUNTO DEBOLE','EL PUNTO DÉBIL'),L3('+15% damage to the last boss','+15% di danno all\'ultimo boss','+15% de daño al último jefe'));}]]);}
  else fin();}
function imzPage(){SV.pages=SV.pages||[];for(let f=1;f<=7;f++)for(let k=0;k<3;k++){const id=pageId(f,k);if(!SV.pages.includes(id)){SV.pages.push(id);saveSV();return id;}}return null;}
function imzMap(){const m=G.m;if(!m||!m.rooms)return;const s0=m.startRoom?m.startRoom.id:0,rd=new Array(m.rooms.length).fill(-1);rd[s0]=0;const q=[s0];
  while(q.length){const r=q.shift();for(const d of m.doors){const o=d.a===r?d.b:d.b===r?d.a:-1;if(o>=0&&rd[o]<0){rd[o]=rd[r]+1;q.push(o);}}}
  const ord=m.rooms.filter(r=>rd[r.id]>=0&&!r.boss).sort((a,b)=>rd[a.id]-rd[b.id]);for(let i=0;i<Math.ceil(ord.length/2);i++)ord[i].known=true;}
function imzTriage(cb){const D=IMZ[4],sel=[];
  const build=()=>D.charts.map(c=>({label:TTX((sel.includes(c.id)?'[X] ':'[ ] ')+tr(c.name)),right:'',col:sel.includes(c.id)?'#7fd8ff':'#e8dcc0',desc:c.short,
    act(){const i=sel.indexOf(c.id);if(i>=0)sel.splice(i,1);else if(sel.length<3)sel.push(c.id);else{refreshMenu(L3('Only three bandages.','Solo tre bende.','Solo tres vendas.'));return;}SFX.tink();refreshMenu();}}))
    .concat(sel.length===3?[{label:L3('BANDAGE THESE THREE','BENDA QUESTI TRE','VENDA A ESTOS TRES'),right:'',col:'#ffe14a',desc:L3('The other two will burn.','Le altre due bruceranno.','Las otras dos arderán.'),
      act(){S.menu.lock=false;SV.triage=SV.triage||[];for(const id of sel)if(!SV.triage.includes(id))SV.triage.push(id);saveSV();
        const L=sel.map(id=>['nar',D.charts.find(c=>c.id===id).story]).concat(D.burn);playScene(L,TTX(L3('INTERMEZZO 4','INTERMEZZO 4','INTERMEDIO 4')),TTX(tr(D.title)),()=>cb({score:3}));}}]:[]);
  openMenu(L3('TRIAGE · 3 BANDAGES','TRIAGE · 3 BENDE','TRIAJE · 3 VENDAS'),build,'play');S.menu.lock=true;}
function imzChartsMenu(){const D=IMZ[4];openMenu(L3("GAUZE'S CHARTS",'LE CARTELLE DI GARZA','LAS FICHAS DE GASA'),()=>D.charts.filter(c=>(SV.triage||[]).includes(c.id)).map(c=>({label:c.name,right:'',col:'#c8e0ff',desc:c.story,act(){SFX.tink();}})),'hub');}
function imzEnd(L){const c=SV.imzc||{},add=[];for(const k of ['i4','i2','i5','i3']){const x=IMZ_END[k+':'+c[k]];if(x)add.push(...x);}
  const n=Math.min(12,SV.candles||0);if(n>0)add.push(['nar',IMZ_END.candles[n-1]]);
  if(!add.length)return;let at=L.findIndex(l=>/^Write mine/.test(l[1]));if(at<0)at=Math.max(0,L.length-2);L.splice(at,0,...add);}
// the picture book of the prologue: pastel pages that rot as they turn
function lerpCol(a,b,t){const A=rgbOf(a),B=rgbOf(b);return '#'+A.map((v,i)=>Math.round(v+(B[i]-v)*clamp(t,0,1)).toString(16).padStart(2,'0')).join('');}
function drawBook(sc,t){const bl=sc.lines.filter(l=>l[0]==='book').length,bi=sc.lines.slice(0,sc.i+1).filter(l=>l[0]==='book').length-1,p=bl>1?clamp(bi/(bl-1),0,1):0;
  rect(ctx,0,0,W,H,'#120a06');const land=W>=H*1.15,mg=Math.round(Math.max(10,W*.03)),bh=Math.round(clamp(H*(land?.3:.28),80,124)),by=H-bh-mg;
  const pw=Math.min(W*.8,(by-mg-30)*1.7),ph=Math.min(by-mg-30,pw/1.7),px=(W-pw)/2,py=mg+22;
  rect(ctx,px-4,py-4,pw+8,ph+8,lerpCol('#c8a070','#3a2414',p));rect(ctx,px,py,pw,ph,lerpCol('#fff4e0','#a89880',p));
  const ix=px+8,iy=py+8,iw=pw-16,ih=ph-16;
  const g=ctx.createLinearGradient(0,iy,0,iy+ih);g.addColorStop(0,lerpCol('#ffd0e8','#4a2a2a',p));g.addColorStop(1,lerpCol('#c8e8ff','#6a3a20',p));ctx.fillStyle=g;ctx.fillRect(ix,iy,iw,ih);
  const sy=iy+ih*(.25+p*.5),sx=ix+iw*.78;ell(ctx,sx,sy,ih*.11,ih*.11,lerpCol('#fff07a','#c8302a',p));
  if(p>.6){ctx.fillStyle='#2a1810';const tw=iw*.14,tx=ix+iw*.18;for(let k=0;k<7;k++){const w=tw*(1-k*.08),hh=ih*.075;ctx.fillRect(tx-w/2+Math.sin(k*1.7)*3,iy+ih*.72-(k+1)*hh,w,hh+1);}
    for(let k=0;k<4;k++){const lx=tx-tw*.3+k*tw*.2,ly=iy+ih*.72-ih*.36;rect(ctx,lx,ly,2,ih*.08+Math.sin(t*2+k)*2,'#e8e0d0');}}
  rect(ctx,ix,iy+ih*.72,iw,ih*.28,lerpCol('#9ad870','#5a3a1a',p));
  for(let k=0;k<9;k++){const fx=ix+iw*(.06+k*.105),fy=iy+ih*(.8+(k%3)*.05);if(p<.5){ell(ctx,fx,fy,2.5,2.5,['#ff9cc6','#ffffff','#ffe14a'][k%3]);}else{rect(ctx,fx,fy-3,1,4,'#3a2414');}}
  const hen=qhenSpr(Math.floor(t*2)),k2=Math.max(1,Math.floor(ih*.34/hen.height)),hx=ix+iw*.5-hen.width*k2/2,hy=iy+ih*.74-hen.height*k2+(reduced?0:Math.sin(t*3)*1.5);
  ctx.save();ctx.imageSmoothingEnabled=false;if(p>.3)ctx.filter='sepia('+(p*.8).toFixed(2)+') brightness('+(1-p*.35).toFixed(2)+')';ctx.drawImage(hen,hx,hy,hen.width*k2,hen.height*k2);ctx.restore();
  if(p>.3&&p<.8)for(let k=0;k<3;k++){const cx2=ix+iw*(.3+k*.05),cy2=iy+ih*.84;ell(ctx,cx2,cy2,3,3,'#ffe66a');rect(ctx,cx2-1,cy2+4,1,2,'#7fd8ff');}
  if(p>=.99){ctx.globalAlpha=.25+.15*Math.sin(t*4);rect(ctx,ix,iy,iw,ih,'#000');ctx.globalAlpha=1;}
  ctx.strokeStyle=lerpCol('#e8a0c0','#4a1a1a',p);ctx.lineWidth=2;ctx.strokeRect(ix-2,iy-2,iw+4,ih+4);}

// two acts: first the General's diary, then (and only then) the Queen's
function storyAct(){if(SV.act3||SV.qEnd)return 3;const p=(SV.pages||[]).length;return (p>=21||(SV.beaten&&p>=12))?2:1;}
function actCheck(){if(S.mode!=='hub'||storyAct()<2||SV.act2)return;SV.act2=true;saveSV();playScene(ACT2,TTX(L3('ACT II','ATTO II','ACTO II')),TTX(L3("THE QUEEN'S DIARY",'IL DIARIO DELLA REGINA','EL DIARIO DE LA REINA')),()=>{S.mode='hub';setState();});}
function macLevel(){return storyAct()>=2?clamp(.45+qCount()/21*.55,0,1):0;}
const MACS={};
function macSpr(type,fr){const L=Math.round(G.macabre*4),src=SPR.poop[type];if(!L||!src)return src&&src[fr];const key=type+L;let a=MACS[key];if(!a)a=MACS[key]=src.map(c=>macabreify(c,L/4));return a[fr]||a[0];}
function macabreify(src,k){const w=src.width,h=src.height,[c,g]=mk(w,h);g.drawImage(src,0,0);let d;try{d=g.getImageData(0,0,w,h);}catch(e){return src;}const a=d.data,eye=[];
  for(let i=0;i<a.length;i+=4){if(a[i+3]<10)continue;const r=a[i],gg=a[i+1],b=a[i+2],l=.3*r+.59*gg+.11*b,mx=Math.max(r,gg,b),mn=Math.min(r,gg,b);
    if(l>205&&mx-mn<45){a[i]=r+(226-r)*k;a[i+1]=gg+(214-gg)*k;a[i+2]=b+(150-b)*k;continue;}
    if(l<50)eye.push(i/4);
    const dl=l*(1-.3*k);a[i]=(r*(1-.55*k)+dl*.55*k)*(1-.15*k)+16*k;a[i+1]=(gg*(1-.55*k)+dl*.55*k)*(1-.3*k);a[i+2]=(b*(1-.55*k)+dl*.55*k)*(1-.26*k);}
  const op=j=>j>=0&&j<w*h&&a[j*4+3]>10,wh=j=>op(j)&&a[j*4]>180&&a[j*4+1]>165&&a[j*4+2]<235;
  if(k>=.5){let s=7;const rn=()=>{s=(s*16807)%2147483647;return s/2147483647;};for(const j of eye){if(op(j-1)&&op(j+1)&&op(j-w)&&op(j+w)&&(wh(j-1)||wh(j+1)||wh(j-w)||wh(j+w))){a[j*4]=205;a[j*4+1]=18;a[j*4+2]=38;
    if(rn()<.45*k)for(let t=1;t<=1+Math.floor(k*3);t++){const q=j+t*w;if(!op(q)||wh(q))break;a[q*4]=125;a[q*4+1]=10;a[q*4+2]=24;}}}}
  g.putImageData(d,0,0);return c;}
