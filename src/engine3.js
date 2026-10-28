// ---------- progression: the Workshop bench, pay for the climb, the Colonel's orders ----------
const T3=a=>L3(a[0],a[1],a[2]);
const UPG=[
 {id:'hp',n:['THICKER ROLL','ROTOLO PIÙ SPESSO','ROLLO MÁS GRUESO'],d:['+1 max sheet in every run.','+1 foglio massimo in ogni partita.','+1 hoja máxima en cada partida.'],c:[[18,0],[45,4],[90,10]]},
 {id:'dmg',n:['SHARPER SPRAY','SPRUZZO PIÙ AFFILATO','ROCIADOR MÁS AFILADO'],d:['+6% damage with every gun.','+6% di danno con ogni arma.','+6% de daño con todas las armas.'],c:[[20,0],[35,3],[55,5],[80,8],[110,12]]},
 {id:'soap',n:['PANTRY','DISPENSA','DESPENSA'],d:['+1 soap bomb at the start of every run.','+1 bomba di sapone all\'inizio di ogni partita.','+1 bomba de jabón al empezar cada partida.'],c:[[12,0],[30,2],[60,5]]},
 {id:'dash',n:['LIGHTER SOLES','SUOLE PIÙ LEGGERE','SUELAS MÁS LIGERAS'],d:['The dash recharges 8% faster.','Lo scatto si ricarica l\'8% più in fretta.','El impulso se recarga un 8% más rápido.'],c:[[20,0],[40,3],[70,6]]},
 {id:'heal',n:['STRONG COFFEE','CAFFÈ FORTE','CAFÉ FUERTE'],d:['Spare sheets drop more often.','I fogli di scorta cadono più spesso.','Las hojas de repuesto caen más a menudo.'],c:[[15,0],[35,3],[65,6]]},
 {id:'corn',n:['CORN SACK','SACCO DEL MAIS','SACO DE MAÍZ'],d:['+15% corn in runs.','+15% di mais nelle partite.','+15% de maíz en las partidas.'],c:[[25,0],[50,3],[90,6]]},
 {id:'ammo',n:['ARMORY','ARMERIA','ARMERÍA'],d:['Every gun carries 15% more ammo.','Ogni arma porta il 15% di munizioni in più.','Cada arma lleva un 15% más de munición.'],c:[[22,0],[50,4]]},
 {id:'map',n:['WATCHTOWER','TORRETTA DI GUARDIA','ATALAYA'],d:['The boss room is on your map from the start of every floor.','La stanza del boss è sulla mappa fin dall\'inizio di ogni piano.','La sala del jefe está en tu mapa desde el inicio de cada piso.'],c:[[26,2]]},
 {id:'revive',n:['CHAPEL','CAPPELLA','CAPILLA'],d:['Once per run for each level, survive a fatal hit with one sheet.','Una volta per partita per ogni livello, sopravvivi a un colpo fatale con un foglio.','Una vez por partida y por nivel, sobrevive a un golpe mortal con una hoja.'],c:[[40,3],[90,8],[160,15]]},
 {id:'kit',n:['FIELD KIT','KIT DA CAMPO','KIT DE CAMPAÑA'],d:['Start every run with one of your bought guns, at random.','Inizi ogni partita con una delle armi comprate, a caso.','Empiezas cada partida con una de tus armas compradas, al azar.'],c:[[60,6]]}];
function upL(id){if(!SV.up){SV.up={};const m={pantry:'soap',infirmary:'hp',armory:'ammo',tower:'map',forge:'dmg',chapel:'revive'};for(const b of SV.built||[])if(m[b])SV.up[m[b]]=1;}return SV.up[id]||0;}
function upgApply(M){const L=upL;G.soap+=L('soap');if(L('hp')){G.hpMax+=L('hp');G.hp+=L('hp');}
  if(L('ammo')){M.ammoMul=(M.ammoMul||1)*(1+.15*L('ammo'));for(const w of WEAPONS)if(w.ammo||w.cap)G.ammo[w.id]=ammoMax(w);}
  G.dmgMul*=1+.06*L('dmg');G.chapel=L('revive');G.dashCd*=1-.08*L('dash');G.cornUp=L('corn');G.healUp=L('heal');
  if(L('kit')){const pool=(SV.weapons||[]).filter(id=>id!=='spray'&&!(SV.wpnOff||[]).includes(id));if(pool.length){const id=pool[ri(0,pool.length-1)],w=WEAPONS.find(x=>x.id===id);if(w&&!G.owned.includes(id)){G.owned.push(id);if(w.ammo||w.cap)G.ammo[id]=ammoMax(w);}}}}
function upgMenu(){const ttl=()=>TTX(L3('WORKSHOP','CANTIERE','TALLER')+' · '+L3('SCRAP ','ROTTAMI ','CHATARRA ')+(SV.scrap||0));
  openMenu(ttl(),()=>UPG.map(u=>{const lv=upL(u.id),mx=u.c.length,nx=u.c[lv],ok=nx&&SV.credits>=nx[0]&&(SV.scrap||0)>=nx[1];
    return {label:T3(u.n),right:TTX(L3('LV ','LV ','NV ')+lv+'/'+mx),col:lv>=mx?'#7fd8ff':ok?'#f4f4f0':'#8a7a6a',
      desc:TTX(T3(u.d)+' '+(nx?L3('Next level: ','Prossimo livello: ','Siguiente nivel: ')+nx[0]+L3(' corn',' mais',' maíz')+(nx[1]?' + '+nx[1]+L3(' scrap',' rottami',' chatarra'):''):L3('Maxed out.','Al massimo.','Al máximo.'))),
      act(){if(!nx){SFX.tink();return;}if(!ok){SFX.hurt();refreshMenu(L3('Not enough corn or scrap. Scrap comes from bosses, secret rooms and exploring.','Non hai abbastanza mais o rottami. I rottami arrivano dai boss, dalle stanze segrete e dall\'esplorazione.','No tienes bastante maíz o chatarra. La chatarra sale de los jefes, las salas secretas y la exploración.'));return;}
        SV.credits-=nx[0];SV.scrap=(SV.scrap||0)-nx[1];SV.up[u.id]=lv+1;saveSV();SFX.win();G.shake=.15;S.menu.title=ttl();refreshMenu(TTX(T3(u.n)+' · '+L3('LV ','LV ','NV ')+(lv+1)+'. '+L3('Active from your next run.','Vale dalla prossima partita.','Activo desde tu próxima partida.')));}};}),'hub');}
function runBonusNotice(){const b=SV.runBonus;if(!b||S.mode!=='hub')return false;SV.runBonus=null;saveSV();
  banner(L3('PAY FOR THE CLIMB','LA PAGA DELLA SALITA','LA PAGA DE LA SUBIDA'),TTX('+'+b[0]+L3(' corn · you reached floor ',' mais · sei arrivato al piano ',' maíz · llegaste al piso ')+b[1]),2.6,'#ffe14a');return true;}
// the Colonel's orders: three at a time, renewed at the Bastion
function ordRoll(){const types=['reach','bossclean','kills','streak','boss','clean100'];if(fallenTagCount()<12)types.push('free');const t=types[ri(0,types.length-1)],mx=Math.max(1,Math.min(7,SV.maxL||1)),o={type:t,a:0,rw:{c:0,s:0},done:false};
  if(t==='reach'){o.a=Math.min(7,Math.max(2,mx+ri(0,1)));o.rw.c=6+o.a*3;}
  else if(t==='bossclean'){o.a=ri(1,Math.min(6,mx));o.rw.c=8+o.a*3;o.rw.s=o.a>3?2:1;}
  else if(t==='boss'){o.a=ri(1,mx);o.rw.c=5+o.a*2;o.rw.s=o.a>=4?2:1;}
  else if(t==='kills'){o.a=[60,100,150][ri(0,2)];o.rw.c=Math.round(o.a/8);}
  else if(t==='streak'){o.a=[4,6,8][ri(0,2)];o.rw.c=o.a*2;}
  else if(t==='free'){o.rw.c=15;o.rw.s=1;}else o.rw.c=12;
  return o;}
function ordFill(){SV.orders=(SV.orders||[]).filter(o=>!o.done);let g=0;while(SV.orders.length<3&&g++<40){const o=ordRoll();if(!SV.orders.some(x=>x.type===o.type))SV.orders.push(o);}saveSV();}
function ordText(o){const a=o.a;return TTX({reach:L3('Reach floor '+a,'Raggiungi il piano '+a,'Llega al piso '+a),bossclean:L3('Beat the floor '+a+' boss without being hit','Batti il boss del piano '+a+' senza essere colpito','Vence al jefe del piso '+a+' sin recibir golpes'),
  boss:L3('Beat the boss of floor '+a+' or higher','Batti il boss del piano '+a+' o più in alto','Vence al jefe del piso '+a+' o superior'),kills:L3('Clean '+a+' poops in one run','Pulisci '+a+' cacche in una partita','Limpia '+a+' cacas en una partida'),
  streak:L3('Clear '+a+' rooms in a row without being hit','Pulisci '+a+' stanze di fila senza essere colpito','Limpia '+a+' salas seguidas sin recibir golpes'),free:L3('Free a fallen brother','Libera un fratello caduto','Libera a un hermano caído'),
  clean100:L3('Explore a whole floor (100%)','Esplora un piano intero (100%)','Explora un piso entero (100%)')}[o.type]);}
function ordRew(o){return TTX('+'+o.rw.c+L3(' corn',' mais',' maíz')+(o.rw.s?' +'+o.rw.s+L3(' scrap',' rottami',' chatarra'):''));}
function ordEvent(type,v){if(!SV.orders||!G||G.hub||G.daily||G.rush||G.surv||G.train||G.qm||G.coopGuest)return;
  for(const o of SV.orders){if(o.done||o.type!==type)continue;const ok=(type==='bossclean')?v===o.a:(type==='free'||type==='clean100')?true:v>=o.a;
    if(ok){o.done=true;SV.credits+=o.rw.c;SV.scrap=(SV.scrap||0)+o.rw.s;saveSV();SFX.win();banner(L3('ORDER COMPLETE','ORDINE ESEGUITO','ORDEN CUMPLIDA'),TTX(ordText(o)+' · '+ordRew(o)),2.6,'#7fd8ff');}}}
function ordMenu(){openMenu(L3("THE COLONEL'S ORDERS",'GLI ORDINI DEL COLONNELLO','LAS ÓRDENES DEL CORONEL'),()=>(SV.orders||[]).map(o=>({label:ordText(o),right:o.done?'OK':'',col:o.done?'#7fd8ff':'#e8dcc0',
  desc:TTX(ordText(o)+'. '+L3('Reward: ','Ricompensa: ','Recompensa: ')+ordRew(o)+'. '+(o.done?L3('Done: a new order arrives when you come back.','Fatto: al ritorno arriva un ordine nuovo.','Hecho: al volver llega una orden nueva.'):L3('Valid in normal runs.','Vale nelle partite normali.','Vale en las partidas normales.'))),act(){SFX.tink();}})),'hub');}
function drawOrderBoard(on,t){const x=119,y=136;rect(ctx,x-1,y+12,2,10,'#3a2414');rect(ctx,x-12,y-2,24,16,'#5a3a20');rect(ctx,x-11,y-1,22,14,'#b08858');
  (SV.orders||[]).forEach((o,i)=>{rect(ctx,x-9+i*7,y+1,6,8,o.done?'#7fd8ff':'#f4f1ea');rect(ctx,x-7+i*7,y,2,2,'#c83a3a');});
  if((SV.orders||[]).some(o=>!o.done)&&!reduced){ctx.globalAlpha=.2+.15*Math.sin(t*3);ell(ctx,x,y+6,16,11,'#7fd8ff');ctx.globalAlpha=1;}}
