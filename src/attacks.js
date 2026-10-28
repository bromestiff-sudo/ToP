// ---------- new patterns: every boss and every hen gets two more ways to hurt you ----------
Object.assign(ATK,{
 spiralarms:(b,dt,P,ang,rage,sm)=>{b.t+=dt;b.e-=dt;while(b.e<=0){const n=rage?4:3;for(let i=0;i<n;i++)eShot(b.x,b.y,b.a+i*TAU/n,82*sm,'feather');b.a+=.21;b.e+=.1;}if(b.t>2.6)bRest(b,1.1);},
 shotgunwall:(b,dt,P,ang,rage,sm)=>{b.e-=dt;if(b.e<=0){const n=11,gap=ri(2,n-3);for(let i=0;i<n;i++)if(i!==gap&&i!==gap+1)eShot(b.x,b.y,ang+(i-(n-1)/2)*.14,95*sm,'big');SFX.eshot();G.shake=.1;b.k++;b.e=.7;if(b.k>=(rage?4:3))bRest(b,1.2);}},
 rainfall:(b,dt,P,ang,rage,sm,R)=>{b.t+=dt;b.e-=dt;if(b.e<=0){const w=R.x1-R.x0,x=R.x0+12+((b.k*37)%(w-24));rainDrop(x,clamp(P.y+rnd(-30,30),R.y0+10,R.y1-10));if(b.k%4===0)rainDrop(P.x,P.y);b.k++;b.e=rage?.09:.13;}if(b.t>2.4)bRest(b,1.1);},
 homingorbs:(b,dt,P,ang,rage,sm)=>{b.e-=dt;if(b.e<=0){for(let i=0;i<3;i++){const q=eShot(b.x,b.y,ang+(i-1)*.9,48*sm,'home');q.homeT=2.2;q.r=4;}SFX.eshot();b.k++;b.e=1;if(b.k>=(rage?3:2))bRest(b,1.3);}},
 crossbeam:(b,dt,P,ang,rage,sm)=>{b.t+=dt;if(b.t<.45){b.shk=1;return;}b.shk=0;b.e-=dt;while(b.e<=0){const o=(b.k%2)*Math.PI/4;for(let i=0;i<4;i++)eShot(b.x,b.y,o+i*Math.PI/2,130*sm,'drop2');b.e+=.06;}if(b.t>1.25){b.t=.45;b.k++;if(b.k>=(rage?4:3))bRest(b,1.2);}},
 bloomburst:(b,dt,P,ang,rage,sm)=>{b.e-=dt;if(b.e<=0){const o=b.k*.31;ring(b.x,b.y,10,52*sm,o,'big');ring(b.x,b.y,10,84*sm,o+TAU/20);addRing(b.x,b.y,30,'#ff9ad0',.3);b.k++;b.e=.75;if(b.k>=(rage?4:3))bRest(b,1.2);}},
 pinwheel:(b,dt,P,ang,rage,sm)=>{b.t+=dt;b.e-=dt;const dir=b.k%2?-1:1;while(b.e<=0){for(let i=0;i<6;i++)eShot(b.x,b.y,b.a+i*TAU/6,72*sm,'feather');b.a+=.12*dir;b.e+=.13;}if(b.t>1.1){b.t=0;b.k++;if(b.k>=(rage?3:2))bRest(b,1.1);}},
 snake:(b,dt,P,ang,rage,sm)=>{b.t+=dt;if(b.k===0){b.k=1;b.a0=ang;}b.a0+=clamp(angDiff(ang,b.a0),-.8*dt,.8*dt);b.e-=dt;while(b.e<=0){eShot(b.x,b.y,b.a0+Math.sin(b.t*7)*.45,110*sm,'blob');b.e+=.055;}if(b.t>(rage?2.6:2))bRest(b,1.1);},
 trap:(b,dt,P,ang,rage,sm,R)=>{b.e-=dt;if(b.e<=0){convergeRing(P.x,P.y,rage?18:15,105,52*sm,'big',.62);b.k++;b.e=1.15;if(b.k>=(rage?3:2))bRest(b,1.2);}},
 leapslam:(b,dt,P,ang,rage,sm,R)=>{if(bLeap(b,dt,P,R,.85,()=>{ring(b.x,b.y,rage?18:14,70*sm,rnd(0,1),'big');ring(b.x,b.y,8,110*sm,rnd(0,1));G.shake=.35;SFX.boom();addPuddle(b.x,b.y+6,14);})){b.cnt=(b.cnt||0)+1;if(b.cnt>=(rage?3:2)){b.cnt=0;bRest(b,1.2);}else b.k=0;}},
 mirrorshots:(b,dt,P,ang,rage,sm,R)=>{b.e-=dt;if(b.e<=0){const mx=R.x0+R.x1-b.x,my=R.y0+R.y1-b.y;aimed(b.x,b.y,3,.2,100*sm);aimed(mx,my,3,.2,100*sm,'feather');addRing(mx,my,14,'#c8e8ff',.3);b.k++;b.e=.6;if(b.k>=(rage?5:4))bRest(b,1.1);}},
 eggbarrage:(b,dt,P,ang,rage,sm)=>{b.e-=dt;if(b.e<=0){const a=b.a+b.k*.9;throwEgg(b.x,b.y-6,P.x+Math.cos(a)*36,P.y+Math.sin(a)*30,4);b.k++;b.e=.22;if(b.k>=(rage?8:6))bRest(b,1.2);}},
 zigzag:(b,dt,P,ang,rage,sm)=>{b.t+=dt;if(b.t<.35){b.shk=1;return;}b.shk=0;const seg=Math.floor((b.t-.35)/.3);if(seg!==b.seg){b.seg=seg;b.dir=ang+(seg%2?.8:-.8);eShot(b.x,b.y,b.dir+Math.PI/2,60*sm,'feather');eShot(b.x,b.y,b.dir-Math.PI/2,60*sm,'feather');}mvB(b,b.dir,175,dt);b.e-=dt;if(b.e<=0){delayShot(b.x,b.y,.7,75*sm);b.e=.12;}if(b.t>2.15||(bossWall(b)&&b.t>1)){b.seg=undefined;bRest(b,1.2);}}});
const ATKNEW={h0:['eggbarrage','leapslam'],h1:['pinwheel','spiralarms'],h2:['mirrorshots','trap'],h3:['crossbeam','shotgunwall'],h4:['rainfall','snake'],h5:['bloomburst','zigzag'],h6:['spiralarms','bloomburst'],
 scarecrow:['snake','trap'],tractor:['shotgunwall','leapslam'],pumpkin:['bloomburst','rainfall'],fox:['zigzag','leapslam'],lantern:['homingorbs','mirrorshots'],basket:['eggbarrage','trap'],mill:['pinwheel','spiralarms'],
 general:['crossbeam','rainfall'],hayknight:['shotgunwall','zigzag'],flyqueen:['homingorbs','snake'],vault:['crossbeam','bloomburst'],incubator:['eggbarrage','homingorbs'],butler:['mirrorshots','crossbeam'],
 eel:['snake','rainfall'],frogking:['leapslam','bloomburst'],bride:['mirrorshots','spiralarms'],chandelier:['rainfall','pinwheel'],piggy:['shotgunwall','homingorbs'],jester:['zigzag','trap'],knight:['crossbeam','leapslam'],mirror:['mirrorshots','pinwheel'],
 fb:['snake','bloomburst']};
const ATKINJ=new Set(Object.values(ATKNEW).flat());
// when a boss leaves its rest to attack, sometimes it uses one of its new moves instead
function atkInject(b,dt){const key=b.fb?'fb':bKey(b),L=ATKNEW[key];if(!L)return;const ph=b.phase||1;
  if(b.prev==='rest'&&b.state!=='rest'&&b.state!=='dying'&&b.state!=='intro'){
    const hen=key[0]==='h',p=b.fb?(ph>=2?.4:0):hen?.35:(ph>=3?.6:ph>=2?.45:.2);
    if(Math.random()<p){const s=L[(b.inj2=(b.inj2||0)+1)%L.length];b.state=s;b.last=s;b.t=0;b.k=0;b.e=0;b.a=rnd(0,TAU);b.sv=0;b.dbl=false;b.injd=1;}}
  // the hens only know their own moves: drive the new ones by hand
  if(key[0]==='h'&&b.injd&&ATKINJ.has(b.state)){const P=G.P,ang=Math.atan2(P.y-b.y,P.x-b.x),rage=b.hp<b.maxhp*.5,sm=G.sm*(b.smMul||1)*(b.tier>0?.87:1);G.bossFiring=b.tier>0;ATK[b.state](b,dt,P,ang,rage,sm,b.R);G.bossFiring=false;}
  if(b.state==='rest')b.injd=0;}
Object.assign(BTIP,{
 jester:['The Jester never stands still. When he vanishes, look for the puff of smoke.','Il Giullare non sta mai fermo. Quando sparisce, cerca lo sbuffo di fumo.','El Bufón nunca se está quieto. Cuando desaparece, busca la nube de humo.'],
 knight:['The Throne Knight charges blind. After a charge his armour is stuck: hit him then.','Il Cavaliere del Trono carica alla cieca. Dopo la carica l\'armatura si incastra: colpiscilo allora.','El Caballero del Trono embiste a ciegas. Tras la embestida su armadura se atasca: golpéalo entonces.'],
 mirror:['The Mirror turns the room around. When the glass flashes, left is right.','Lo Specchio rigira la stanza. Quando il vetro lampeggia, la sinistra è la destra.','El Espejo da la vuelta a la sala. Cuando el cristal destella, la izquierda es la derecha.']});
Object.assign(BRULE,{
 jester:{tick(b,dt){b.jt=(b.jt===undefined?4:b.jt)-dt;if(b.jt<=0&&b.state==='rest'){b.jt=6.5-(b.phase||1);for(let i=0;i<14;i++)parts(b.x+rnd(-10,10),b.y-rnd(0,18),'#c8a0ff',1,60);const R=b.R;b.x=rnd(R.x0+40,R.x1-40);b.y=rnd(R.y0+40,R.y1-50);bossClamp(b);for(let i=0;i<14;i++)parts(b.x+rnd(-10,10),b.y-rnd(0,18),'#c8a0ff',1,60);SFX.squeak&&SFX.squeak();aimed(b.x,b.y,5,.25,90*G.sm,'feather');}},
   phase(b,ph){bSummon(b,'ghost',ph);b.jt=.5;}},
 knight:{tick(b){if(b.prev==='tdash'&&b.state==='rest'){b.stun=G.time+1.6;G.shake=.25;popText(b.x,b.y-30,L3('STUCK','INCASTRATO','ATASCADO'),'#ffe14a');}if(b.stun>G.time)b.t=Math.max(b.t,.2);},phase(b,ph){b.smMul=1+.1*ph;},
   dmg(b,d){return b.stun>G.time?d*2:d*.5;},draw(b){if(b.stun>G.time)stunDraw(b);}},
 mirror:{tick(b,dt){b.mt=(b.mt===undefined?5:b.mt)-dt;if(b.mt<=0){b.mt=9-(b.phase||1);b.mw=G.time+.9;SFX.tink();}
   if(b.mw&&G.time>b.mw){b.mw=0;G.mirrorCtl=G.time+3;G.shake=.2;popText(G.P.x,G.P.y-26,L3('MIRRORED!','SPECCHIATO!','¡REFLEJADO!'),'#c8e8ff');}},
   phase(b,ph){b.mt=1;},draw(b){if(b.mw){ctx.globalAlpha=.25+.25*Math.sin(G.time*30);ell(ctx,b.x,b.y-b.r*.6,b.r*1.3,b.r*1.4,'#ffffff');ctx.globalAlpha=1;}
   if(G.mirrorCtl>G.time){const R=b.R;ctx.globalAlpha=.18+.08*Math.sin(G.time*8);ctx.strokeStyle='#c8e8ff';ctx.lineWidth=3;ctx.strokeRect(R.x0+2,R.y0+2,R.x1-R.x0-4,R.y1-R.y0-4);ctx.globalAlpha=1;}}}});
