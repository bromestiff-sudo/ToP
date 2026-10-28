// ---------- every boss has a rule of its own, and three phases ----------
function addsAlive(t){return G.enemies.filter(e=>!e.dead&&(!t||e.type===t)).length;}
function bKey(b){return b.art||('h'+b.idx);}
function shieldDraw(b,col,a){ctx.save();ctx.globalAlpha=(a||.35)+.12*Math.sin(G.time*8);ctx.strokeStyle=col;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(b.x,b.y-b.r*.4,b.r*1.5,b.r*1.25,0,0,TAU);ctx.stroke();ctx.restore();}
function stunDraw(b){for(let i=0;i<3;i++){const a=G.time*5+i*TAU/3;rect(ctx,b.x+Math.cos(a)*10-1,b.y-b.r*2-6+Math.sin(a)*3,3,3,'#ffe14a');}}
const BTIP={
 scarecrow:['Kill the crows: while they fly, the straw man feels nothing.','Uccidi i corvi: finché volano, lo spaventapasseri non sente niente.','Mata a los cuervos: mientras vuelan, el espantapájaros no siente nada.'],
 tractor:['Old Rusty is armour-plated. Dodge his charge: after it he is stunned and soft.','Il Vecchio Ruggine è corazzato. Schiva la carica: dopo è stordito e vulnerabile.','El Viejo Oxidado está blindado. Esquiva su embestida: después queda aturdido y vulnerable.'],
 pumpkin:['The Root Pumpkin regrows. Soap bombs stop it for a while.','La Zucca delle Radici ricresce. Le bombe di sapone la fermano per un po\'.','La Calabaza de Raíces se regenera. Las bombas de jabón la frenan un rato.'],
 fox:['The Starved Fox heals every time it bites you. Don\'t let it touch you.','La Volpe Affamata si cura ogni volta che ti morde. Non farti toccare.','El Zorro Hambriento se cura cada vez que te muerde. Que no te toque.'],
 lantern:['It\'s dark. You only see what the Lantern lights.','È buio. Vedi solo quello che la Lanterna illumina.','Está oscuro. Solo ves lo que alumbra el Farol.'],
 basket:['The Biting Basket only opens between bites. Hit it while the lid is up.','Il Cesto che Morde si apre solo tra un morso e l\'altro. Colpiscilo col coperchio alzato.','La Cesta que Muerde solo se abre entre mordiscos. Golpéala con la tapa levantada.'],
 mill:['The sails sweep the room. Slip between them.','Le pale spazzano la stanza. Infilati tra una e l\'altra.','Las aspas barren la sala. Cuélate entre ellas.'],
 general:['Single-Ply cleans everything. Stay off the bleach.','Monovelo pulisce tutto. Stai lontano dalla candeggina.','Hoja Simple lo limpia todo. Aléjate de la lejía.'],
 hayknight:['Sir Pitchfork blocks everything in front of his shield. Go around him.','Sir Forcone para tutto quello che arriva davanti allo scudo. Giragli intorno.','Sir Horca para todo lo que llega por delante de su escudo. Rodéalo.'],
 flyqueen:['While her flies swarm around her, she is shielded. Swat the flies first.','Finché le mosche le ronzano intorno è protetta. Schiaccia prima le mosche.','Mientras sus moscas zumban a su alrededor, está protegida. Aplasta antes las moscas.'],
 vault:['Solid steel. Shoot only when the vault opens.','Acciaio pieno. Spara solo quando il caveau si apre.','Acero macizo. Dispara solo cuando se abre la cámara.'],
 incubator:['Every chick alive feeds the Incubator. Kill them fast.','Ogni pulcino vivo nutre l\'Incubatrice. Uccidili in fretta.','Cada pollito vivo alimenta a la Incubadora. Mátalos rápido.'],
 butler:['The Butler sidesteps your shots while he waits. Hit him while he serves.','Il Maggiordomo schiva i colpi mentre aspetta. Colpiscilo mentre serve.','El Mayordomo esquiva tus disparos mientras espera. Golpéalo mientras sirve.'],
 eel:['The Eel surfaces from a different pipe each time. Watch the bubbles.','L\'Anguilla spunta ogni volta da un tubo diverso. Guarda le bolle.','La Anguila sale cada vez por una tubería distinta. Mira las burbujas.'],
 frogking:['The Frog King floods his hall. Water slows you: keep to the dry middle.','Il Re Rana allaga la sala. L\'acqua ti rallenta: resta all\'asciutto, al centro.','El Rey Rana inunda su sala. El agua te frena: quédate en el centro seco.'],
 bride:['When the Bride lowers her veil, your shots come back at you. Wait.','Quando la Sposa abbassa il velo, i tuoi colpi tornano indietro. Aspetta.','Cuando la Novia baja el velo, tus disparos vuelven contra ti. Espera.'],
 chandelier:['Untouchable up high. Make it dive, then hit it on the ground.','Intoccabile lassù. Fallo scendere in picchiata, poi colpiscilo a terra.','Intocable allí arriba. Haz que se lance, y golpéalo en el suelo.'],
 piggy:['Every coin left on the floor goes back to the Treasurer and heals him. Grab them first.','Ogni moneta lasciata a terra torna al Tesoriere e lo cura. Prendile prima tu.','Cada moneda que queda en el suelo vuelve al Tesorero y lo cura. Cógelas tú antes.'],
 h0:['Mama protects her chicks: while one is alive she is furious. Kill the chicks.','Mamma protegge i pulcini: finché ce n\'è uno vivo è furiosa. Uccidi i pulcini.','Mamá protege a sus pollitos: mientras quede uno vivo está furiosa. Mata a los pollitos.'],
 h1:['The wind blows where the weathercock points. Lean against it.','Il vento soffia dove punta la banderuola. Resisti.','El viento sopla hacia donde apunta la veleta. Resiste.'],
 h2:['The Shadow Hen is only real when she attacks.','La Gallina Ombra è vera solo quando attacca.','La Gallina Sombra solo es real cuando ataca.'],
 h3:['Follow the Colonel\'s orders, or his artillery will find you.','Esegui gli ordini del Colonnello, o la sua artiglieria ti trova.','Cumple las órdenes del Coronel, o su artillería te encontrará.'],
 h4:['She swims in the sewage and comes up under your feet. Keep moving.','Nuota nei liquami e risale sotto i tuoi piedi. Non fermarti.','Nada en las aguas negras y sale bajo tus pies. No te pares.'],
 h5:['Gold plates cover her. Every phase breaks some of them.','La coprono placche d\'oro. Ogni fase ne rompe qualcuna.','La cubren placas de oro. Cada fase rompe algunas.']};
const BRULE={
 scarecrow:{start(b){bSummon(b,'crow',2);b.guard=G.time+8;},phase(b,ph){bSummon(b,'crow',1+ph);b.guard=G.time+9;},dmg(b,d){return b.guard>G.time&&addsAlive('crow')>0?0:d;},draw(b){if(b.guard>G.time&&addsAlive('crow')>0)shieldDraw(b,'#c8b090');}},
 tractor:{tick(b){if(b.prev==='stampede'&&b.state==='rest'){b.stun=G.time+1.7;popText(b.x,b.y-30,L3('STUNNED','STORDITO','ATURDIDO'),'#ffe14a');}},phase(b,ph){b.smMul=1+.12*ph;},dmg(b,d){return b.stun>G.time?d*2:d*.45;},draw(b){if(b.stun>G.time)stunDraw(b);}},
 pumpkin:{tick(b,dt){const s=G.lastSoap;if(s&&G.time-s.t<.2&&Math.hypot(s.x-b.x,s.y-b.y)<60)b.noRegrow=G.time+6;if(!(b.noRegrow>G.time)&&b.hp>0){b.hp=Math.min(b.maxhp,b.hp+b.maxhp*.012*dt);if(Math.random()<dt*4)parts(b.x+rnd(-8,8),b.y-4,'#7ae07a',1,20);}},phase(b,ph){bPick(b,['roots']);}},
 fox:{phase(b,ph){bSummon(b,'rat',ph);b.smMul=1+.1*ph;}},
 lantern:{dark:true,phase(b,ph){b.flick=ph===3;}},
 basket:{dmg(b,d){return b.state==='rest'?d*1.6:d*.35;},draw(b){if(b.state==='rest'){ctx.globalAlpha=.3+.2*Math.sin(G.time*10);ell(ctx,b.x,b.y-b.r,b.r*.8,b.r*.4,'#ffe14a');ctx.globalAlpha=1;}}},
 mill:{tick(b,dt){const P=G.P,n=1+(b.phase||1),L=58;b.millA=(b.millA||0)+dt*(1+.35*(b.phase||1));for(let i=0;i<n;i++){const a=b.millA+i*TAU/n,ex=Math.cos(a),ey=Math.sin(a),px=P.x-b.x,py=P.y-b.y,t=px*ex+py*ey;if(t>8&&t<L&&Math.abs(px*ey-py*ex)<5)hurtPlayer();}},
   draw(b){const n=1+(b.phase||1),L=58;ctx.save();ctx.lineWidth=5;ctx.strokeStyle='#5a3a20';for(let i=0;i<n;i++){const a=b.millA+i*TAU/n;ctx.beginPath();ctx.moveTo(b.x+Math.cos(a)*8,b.y+Math.sin(a)*8);ctx.lineTo(b.x+Math.cos(a)*L,b.y+Math.sin(a)*L);ctx.stroke();}ctx.lineWidth=2;ctx.strokeStyle='#c8a070';for(let i=0;i<n;i++){const a=b.millA+i*TAU/n;ctx.beginPath();ctx.moveTo(b.x+Math.cos(a)*12,b.y+Math.sin(a)*12);ctx.lineTo(b.x+Math.cos(a)*L,b.y+Math.sin(a)*L);ctx.stroke();}ctx.restore();}},
 general:{phase(b,ph){if(ph===2)bPick(b,['deepclean']);else{b.smMul=1.2;bSummon(b,'ghost',2);}}},
 hayknight:{tick(b,dt){const pa=Math.atan2(G.P.y-b.y,G.P.x-b.x);if(b.fa===undefined)b.fa=pa;b.fa+=clamp(angDiff(pa,b.fa),-1.3*dt,1.3*dt);},dmg(b,d){const pa=Math.atan2(G.P.y-b.y,G.P.x-b.x);if(Math.abs(angDiff(pa,b.fa||0))<1){if(Math.random()<.2)SFX.tink();return d*.2;}return d*1.3;},
   draw(b){ctx.save();ctx.strokeStyle='#c8c4b4';ctx.lineWidth=4;ctx.beginPath();ctx.arc(b.x,b.y-b.r*.4,b.r*1.4,(b.fa||0)-.9,(b.fa||0)+.9);ctx.stroke();ctx.strokeStyle='#8a1a2a';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(b.x,b.y-b.r*.4,b.r*1.4,(b.fa||0)-.9,(b.fa||0)+.9);ctx.stroke();ctx.restore();}},
 flyqueen:{tick(b,dt){b.ft=(b.ft||0)-dt;if(b.ft<=0){b.ft=6;if(addsAlive('fly')<3)bSummon(b,'fly',2);}},phase(b,ph){bSummon(b,'fly',3);},dmg(b,d){return addsAlive('fly')>=2?d*.3:d;},draw(b){if(addsAlive('fly')>=2)shieldDraw(b,'#8ad040');}},
 vault:{tick(b,dt){b.vt=(b.vt||0)+dt;const was=b.open;b.open=(b.vt%(6.5-(b.phase||1)*.6))>4;if(b.open&&!was){ring(b.x,b.y,10,70*G.sm,rnd(0,1),'big');SFX.door();}},dmg(b,d){if(!b.open){if(Math.random()<.2)SFX.tink();return 0;}return d*1.4;},
   draw(b){if(b.open){ctx.globalAlpha=.35+.2*Math.sin(G.time*12);ell(ctx,b.x,b.y-b.r*.5,b.r*.9,b.r*.7,'#ffd23f');ctx.globalAlpha=1;}else shieldDraw(b,'#9aa4ae',.45);}},
 incubator:{tick(b,dt){b.it=(b.it||4)-dt;if(b.it<=0){b.it=7;bSummon(b,'chick',2);}const n=addsAlive('chick');if(n&&b.hp>0){b.hp=Math.min(b.maxhp,b.hp+b.maxhp*.012*n*dt);if(Math.random()<dt*6)parts(b.x+rnd(-8,8),b.y-6,'#ffe66a',1,20);}}},
 butler:{dmg(b,d){if(b.state==='rest'&&!(b.dodge>G.time)&&Math.random()<.45){b.dodge=G.time+.5;const a=rnd(0,TAU);b.x+=Math.cos(a)*18;b.y+=Math.sin(a)*12;bossClamp(b);popText(b.x,b.y-28,L3('DODGED','SCHIVATO','ESQUIVADO'),'#c8c4b4');parts(b.x,b.y,'#f4f1ea',6,40);return 0;}return d;}},
 eel:{tick(b,dt){const R=b.R,pp=[[R.x0+34,R.y0+34],[R.x1-34,R.y0+34],[R.x0+34,R.y1-34],[R.x1-34,R.y1-34]];b.pipes=pp;b.et=(b.et===undefined?0:b.et)+dt;const out=3.4-(b.phase||1)*.3,cyc=out+1.5;
   if(b.et>cyc){b.et=0;let k;do k=ri(0,3);while(k===b.pk);b.pk=k;}const k=b.pk||0;if(b.et<out){b.x=pp[k][0];b.y=pp[k][1];b.vis=1;}else{b.vis=0;if(Math.random()<dt*8){const n=(k+1+ri(0,2))%4;parts(pp[n][0],pp[n][1],'#bfeeff',1,25);}}},
   draw(b){for(const p of b.pipes||[]){ell(ctx,p[0],p[1]+4,12,6,'#1a1410');ell(ctx,p[0],p[1]+3,9,4,'#3a4a3a');}}},
 frogking:{phase(b,ph){const R=b.R,ins=ph===2?22:46;for(let x=R.x0;x<=R.x1;x+=26){G.puddles.push({x,y:R.y0+ins,r:14,life:60});G.puddles.push({x,y:R.y1-ins,r:14,life:60});}for(let y=R.y0;y<=R.y1;y+=26){G.puddles.push({x:R.x0+ins,y,r:14,life:60});G.puddles.push({x:R.x1-ins,y,r:14,life:60});}if(G.puddles.length>90)G.puddles.splice(0,G.puddles.length-90);}},
 bride:{tick(b,dt){b.vl=(b.vl||0)+dt;b.veil=(b.vl%5)>3.3;},dmg(b,d){if(b.veil){if(!(b.rf>G.time)){b.rf=G.time+.12;eShot(b.x,b.y-6,Math.atan2(G.P.y-b.y,G.P.x-b.x),115*G.sm,'big');}return 0;}return d;},draw(b){if(b.veil){ctx.globalAlpha=.45;ell(ctx,b.x,b.y-b.r*.6,b.r*1.2,b.r*1.3,'#f4f1ea');ctx.globalAlpha=1;}}},
 chandelier:{tick(b){if(b.prev==='dive'&&b.state==='rest'){b.gr=G.time+2.6;G.shake=.3;popText(b.x,b.y-30,L3('ON THE GROUND','A TERRA','EN EL SUELO'),'#ffe14a');}},dmg(b,d){return b.gr>G.time?d*1.6:d*.15;},
   draw(b){if(b.gr>G.time)stunDraw(b);else{ctx.strokeStyle='rgba(200,196,180,.7)';ctx.lineWidth=1;for(const dx of [-8,0,8]){ctx.beginPath();ctx.moveTo(b.x+dx,b.y-b.r*2);ctx.lineTo(b.x+dx*3,b.R.y0);ctx.stroke();}}}},
 piggy:{tick(b,dt){b.ct=(b.ct||3)-dt;if(b.ct<=0){b.ct=5;for(let i=0;i<3;i++)G.picks.push({x:b.x+rnd(-50,50),y:b.y+rnd(10,50),t:'corn',v:1,keep:1,bc:1,born:G.time,life:999});}
   for(const k of G.picks)if(k.bc&&k.life>0&&G.time-k.born>5){k.life=0;b.hp=Math.min(b.maxhp,b.hp+b.maxhp*.035);parts(k.x,k.y,'#ffd23f',6,60);popText(b.x,b.y-26,'+','#ffd23f');}}},
 h0:{tick(b,dt){b.ct=(b.ct||4)-dt;if(b.ct<=0){b.ct=8;bSummon(b,'chick',2);}b.smMul=addsAlive('chick')?1.3:1;},draw(b){if(addsAlive('chick')){ctx.globalAlpha=.3;ell(ctx,b.x,b.y-b.r,b.r*1.3,b.r*1.1,'#ff4a3a');ctx.globalAlpha=1;}}},
 h1:{tick(b,dt){b.wa=(b.wa||0)+dt*.5;G.wind={a:b.wa,s:30+8*(b.phase||1),t:.3};if(Math.random()<dt*20)G.parts.push({x:G.P.x+rnd(-80,80),y:G.P.y+rnd(-60,60),vx:Math.cos(b.wa)*90,vy:Math.sin(b.wa)*60,life:.5,col:'rgba(220,220,210,.6)',size:1});}},
 h2:{tick(b,dt){const tv=b.state==='rest'?.12:1;b.vis=b.vis+(tv-b.vis)*Math.min(1,dt*6);},dark:true},
 h3:{tick(b,dt){const R=b.R;b.ot=(b.ot===undefined?3:b.ot)-dt;if(b.ot<=0&&!b.ord){b.ord={side:Math.random()<.5?-1:1,t:0};SFX.siren&&SFX.siren(0);}
   if(b.ord){b.ord.t+=dt;const mid=(R.x0+R.x1)/2;if(b.ord.t>1.6&&b.ord.t<4){if(Math.random()<dt*14){const x=b.ord.side<0?rnd(R.x0+8,mid):rnd(mid,R.x1-8);rainDrop(x,rnd(R.y0+8,R.y1-8));}}if(b.ord.t>4.2){b.ord=null;b.ot=8-(b.phase||1);}}},
   draw(b){if(!b.ord)return;const R=b.R,mid=(R.x0+R.x1)/2,x0=b.ord.side<0?R.x0:mid;ctx.globalAlpha=b.ord.t<1.6?.12+.1*Math.sin(G.time*16):.22;rect(ctx,x0,R.y0,(R.x1-R.x0)/2,R.y1-R.y0,'#ff2a2a');ctx.globalAlpha=1;
     if(b.ord.t<1.8)txt(b.ord.side<0?L3('ALL RIGHT!','TUTTI A DESTRA!','¡TODOS A LA DERECHA!'):L3('ALL LEFT!','TUTTI A SINISTRA!','¡TODOS A LA IZQUIERDA!'),(R.x0+R.x1)/2,R.y0+20,'#ffe14a','center',11,'#000');}},
 h4:{tick(b,dt){b.st2=(b.st2===undefined?5:b.st2)-dt;if(b.st2<=0&&!b.dive){b.dive=G.time+2.2;b.vis=.1;}if(b.dive){b.vis=.1;if(Math.random()<dt*10)parts(G.P.x+rnd(-10,10),G.P.y+6,'#6a8a3a',1,20);if(G.time>b.dive){b.dive=0;b.st2=7-(b.phase||1);b.x=G.P.x;b.y=G.P.y;bossClamp(b);b.vis=1;ring(b.x,b.y,14,80*G.sm,0,'big');G.shake=.3;}}}},
 h5:{phase(b,ph){for(let i=0;i<20;i++)parts(b.x+rnd(-12,12),b.y-rnd(0,20),'#ffd23f',1,90);},dmg(b,d){return d*[.4,.7,1][(b.phase||1)-1];},draw(b){const n=3-(b.phase||1);for(let i=0;i<n*2;i++){rect(ctx,b.x-8+(i%3)*6,b.y-b.r*1.4+Math.floor(i/3)*7,5,5,'#ffd23f');rect(ctx,b.x-8+(i%3)*6,b.y-b.r*1.4+Math.floor(i/3)*7,5,1,'#fff0a0');}}},
 h6:{phase(b,ph){if(ph===2)bSummon(b,'ghost',2);else b.smMul=1.15;}}};
function bossRuleTick(b,dt){const R=BRULE[bKey(b)];if(b.mini||b.fb)return;
  if(!b.ruleOn){b.ruleOn=1;if(R&&R.start)R.start(b);const tip=BTIP[bKey(b)];SV.btip=SV.btip||{};if(tip&&!SV.btip[bKey(b)]){SV.btip[bKey(b)]=1;saveSV();banner(tr(b.name),T3(tip),3.4,'#ffe14a');}}
  if(R&&R.tick)R.tick(b,dt);b.prev=b.state;}
function bossRuleDmg(b,d){if(b.mini||b.fb)return d;const R=BRULE[bKey(b)];return R&&R.dmg?R.dmg(b,d):d;}
function bossPhase(b,ph){const R=BRULE[bKey(b)];if(R&&R.phase)R.phase(b,ph);}
function bossRuleDraw(b){if(b.mini||b.fb)return;const R=BRULE[bKey(b)];if(R&&R.draw)R.draw(b);}
function bossDarkDraw(cx,cy){const b=G.boss;if(!b||b.state==='dying'||b.mini||b.fb)return;const R=BRULE[bKey(b)];if(!R||!R.dark)return;
  const f=b.flick?.6+.4*Math.abs(Math.sin(G.time*9)*Math.sin(G.time*3.3)):1,dk=bKey(b)==='h2'?.55:.92;
  const [c,g]=mk(W,H);g.fillStyle='rgba(4,2,8,'+dk+')';g.fillRect(0,0,W,H);g.globalCompositeOperation='destination-out';
  const hole=(x,y,r)=>{const gr=g.createRadialGradient(x,y,r*.35,x,y,r);gr.addColorStop(0,'rgba(0,0,0,1)');gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(x-r,y-r,r*2,r*2);};
  if(bKey(b)==='lantern')hole(b.x-cx,b.y-cy-8,92*f);hole(G.P.x-cx,G.P.y-cy,38);ctx.drawImage(c,0,0);}
// six hens, drawn again from scratch: one per floor
function henArt(i,fr){const [c,g]=mk(52,48),O='#120806',bob=fr?1:0;
  const E=(x,y,rx,ry,col,o)=>{if(o!==false)ell(g,x,y,rx+1,ry+1,O);ell(g,x,y,rx,ry,col);},Rr=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h);};
  if(i===0){// BIG MAMA CLUCK: a huge hen with an apron of stolen eggs, button eyes sewn on
    Rr(20,41,3,6,'#e8a030');Rr(30,41,3,6,'#e8a030');E(26,26+bob,20,16,'#e8e0d0');E(26,30+bob,17,11,'#d0c6b2',false);E(26,12+bob,10,9,'#e8e0d0');
    ell(g,22,3+bob,3,3,'#c81a2a');ell(g,27,2+bob,3,3,'#c81a2a');ell(g,31,4+bob,2,2,'#c81a2a');Rr(29,13+bob,8,4,'#e8a030');Rr(31,14+bob,6,1,O);for(let k=0;k<3;k++)Rr(30+k*2,13+bob,1,4,O);
    Rr(19,9+bob,4,4,O);Rr(20,10+bob,2,2,'#7a1a2a');Rr(25,9+bob,4,4,O);Rr(26,10+bob,2,2,'#7a1a2a');E(26,32+bob,13,9,'#c84a5a');ell(g,22,30+bob,3,2,'#7a1a2a');ell(g,30,35+bob,2,2,'#7a1a2a');
    for(let k=0;k<3;k++)E(20+k*6,35+bob,2.5,3.2,'#fbf3e2');E(6+(fr?1:0),25+bob,5,9,'#c8bea8');E(46-(fr?1:0),25+bob,5,9,'#c8bea8');}
  else if(i===1){// SPIN CHICKEN: a rusted iron weathercock on its pole
    Rr(25,24,3,23,O);Rr(26,24,1,23,'#5a3a2a');Rr(16,40,21,3,O);Rr(17,41,19,1,'#6a4a3a');const fl=fr?-1:1;Rr(6,18,40,2,O);Rr(7,18,38,1,'#a8582a');
    for(let k=0;k<3;k++)Rr(fr?44-k*2:6+k*2,15+k,3,6-k*2,'#a8582a');E(26,12+bob,12,8,'#6a4a3a');E(22,11+bob,6,5,'#a8582a',false);E(26+fl*9,5+bob,5,5,'#6a4a3a');Rr(26+fl*13,5+bob,4,2,'#d8884a');
    Rr(26+fl*9,3+bob,2,2,'#ff3a2a');Rr(26-fl*14,4+bob,4,10,'#6a4a3a');Rr(26-fl*17,2+bob,4,6,'#a8582a');for(let k=0;k<5;k++)Rr(14+k*5,9+((k*7)%5),2,2,'#d8884a');
    g.fillStyle='#e8d8b8';g.font='6px monospace';g.fillText('N',24,31);}
  else if(i===2){// SHADOW HEN: smoke in the shape of a hen, two eyes and a mouth
    for(let k=0;k<8;k++)ell(g,10+k*4,34+Math.sin(k+fr*2)*3,3,4,'#1a1424');E(26,26+bob,17,13,'#0e0a14');E(26,13+bob,9,8,'#0e0a14');ell(g,26,24+bob,12,8,'#2a1e34');
    for(let k=0;k<5;k++)ell(g,8+k*9,18+((k*5)%7)-bob,2,3,'#2a1e34');Rr(21,11+bob,3,3,'#ffffff');Rr(29,11+bob,3,3,'#ffffff');Rr(22,12+bob,1,1,'#c81a2a');Rr(30,12+bob,1,1,'#c81a2a');
    Rr(21,17+bob,11,1,'#c81a2a');Rr(23,18+bob,7,1,'#7a1a2a');}
  else if(i===3){// COLONEL CORNBREAD: corn-yellow hen in a field coat, cap and medals
    Rr(20,41,3,6,'#e8a030');Rr(30,41,3,6,'#e8a030');E(26,28+bob,15,13,'#4a5a2a');E(26,13+bob,9,8,'#e8c070');Rr(16,5+bob,20,4,O);Rr(17,5+bob,18,3,'#3a4a1a');Rr(19,2+bob,14,4,'#3a4a1a');Rr(33,8+bob,6,2,'#2a3a10');Rr(24,3+bob,4,2,'#e8c040');
    Rr(32,13+bob,7,3,'#e8a030');Rr(22,11+bob,3,3,O);Rr(28,11+bob,4,4,'#e8e8f0');Rr(29,12+bob,2,2,O);for(let k=0;k<4;k++){Rr(19+k*4,24+bob,3,4,['#e8c040','#c8202e','#e8c040','#3c6aa3'][k]);}
    for(let k=0;k<3;k++)Rr(25,30+bob+k*4,2,2,'#e8c040');E(11,28+bob,4,8,'#4a5a2a');E(41,28+bob,4,8,'#4a5a2a');Rr(38,20+bob,10,2,'#5a3a20');}
  else if(i===4){// THE SEWER HEN: half sunk in sludge, gas mask, dripping
    E(26,22+bob,14,12,'#5a6a4a');E(26,10+bob,9,8,'#5a6a4a');ell(g,22,10+bob,3,3,'#9aa4ae');ell(g,30,10+bob,3,3,'#9aa4ae');ell(g,22,10+bob,2,2,'#2a3a2a');ell(g,30,10+bob,2,2,'#2a3a2a');E(26,16+bob,4,3,'#6a6e74');Rr(25,19+bob,2,4,'#3a3e44');
    for(let k=0;k<6;k++)Rr(14+k*5,22+((k*3)%5)+bob,1,6+((k+fr)%3),'#7a9a3a');E(26,38,24,8,'#3a5a2a');for(let k=0;k<7;k++)ell(g,6+k*7,34+(k%2)*2+(fr?1:0),3,2,'#6a8a3a');ell(g,40,36,2,1,'#c8e070');}
  else{// THE PLUCKED ONE: bald, pink, gooseflesh, plated with gold
    Rr(22,40,2,7,'#e8a030');Rr(29,40,2,7,'#e8a030');E(26,30+bob,13,11,'#e8a0a0');Rr(24,12+bob,5,16,O);Rr(25,12+bob,3,16,'#e8a0a0');E(26,9+bob,7,6,'#e8a0a0');Rr(31,9+bob,6,3,'#e8a030');
    Rr(23,7+bob,2,2,'#ff1a2a');Rr(27,7+bob,2,2,'#ff1a2a');ell(g,25,3+bob,2,2,'#a8202e');for(let k=0;k<14;k++)Rr(16+((k*7)%20),23+((k*5)%14)+bob,1,1,'#c87878');
    for(let k=0;k<3;k++){Rr(18+k*6,26+bob,5,5,'#ffd23f');Rr(18+k*6,26+bob,5,1,'#fff0a0');}E(12,28+bob,3,7,'#e8a0a0');E(40,28+bob,3,7,'#e8a0a0');Rr(36,24+bob,4,3,'#ffd23f');}
  return c;}
