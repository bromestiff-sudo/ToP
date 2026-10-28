F='../build/tower-of-poop.html';s=open(F).read()
def rep(a,b,cnt=1):
    global s
    n=s.count(a);assert n==cnt,(a[:70],n);s=s.replace(a,b)
# ammo: no more endless guns
rep("function ammoMax(w){const b=w.ammo||w.cap||0;return b?Math.round(b*(G.mods?G.mods.ammoMul:1)):0;}",
    "function ammoMax(w){const b=w.ammo||w.cap||0;return b?Math.round(b*(G.mods?Math.min(1.5,G.mods.ammoMul||1):1)):0;}\nfunction heavyW(w){return !!(w&&w.ammo&&w.ammo<=8);}")
i=s.index("if(G.mods&&G.mods.refill&&!G.hub&&G.wpn&&(G.wpn.ammo||G.wpn.cap)){");j=s.index("}}",i)+2;s=s[:i]+s[j:]
rep("  SFX.door();const bonus=40*G.floor;","  if(G.mods&&G.mods.refill&&G.wpn&&(G.wpn.ammo||G.wpn.cap)){const w=G.wpn;G.ammo[w.id]=Math.min(ammoMax(w),G.ammo[w.id]+(heavyW(w)?1:Math.ceil(ammoMax(w)*.2)));}\n  SFX.door();const bonus=40*G.floor;")
rep("desc:'The gun in your hands slowly refills its ammo.'","desc:'Every room you clean refills 20% of the gun in your hands.'")
rep("const a=Math.min(ammoMax(w),G.ammo[w.id]+Math.max(1,Math.ceil(ammoMax(w)/3)));","const a=Math.min(ammoMax(w),G.ammo[w.id]+(heavyW(w)?(G.mods&&G.mods.metal?2:1):Math.max(1,Math.ceil(ammoMax(w)/3))));")
rep("else if(k.t==='recharge'){for(const w of ownedWeapons())if(w.ammo||w.cap)G.ammo[w.id]=ammoMax(w);","else if(k.t==='recharge'){for(const w of ownedWeapons())if(w.ammo||w.cap)G.ammo[w.id]=heavyW(w)?Math.min(ammoMax(w),G.ammo[w.id]+2):ammoMax(w);")
rep("desc:'Heavy weapons carry double ammo.',fn:M=>{M.ammoMul=2;","desc:'Ammo boxes give heavy weapons two shots instead of one.',fn:M=>{M.metal=true;M.ammoMul=Math.max(M.ammoMul||1,1.5);")
rep("if(Math.random()<.15&&needAmmo())drop('ammo',14,14);","if(Math.random()<.1&&needAmmo())drop('ammo',14,14);")
rep("else if(r<.08&&needAmmo())","else if(r<.065&&needAmmo())")
rep("if(Math.random()<.07&&needAmmo())drop('recharge',30,-20);","if(Math.random()<.04&&needAmmo())drop('recharge',30,-20);")
# bosses: a damage budget per second, and two short immune phase breaks
rep("if(G.fustoF===G.floor)d*=1.2;if(G.weakpt&&G.floor===7)d*=1.15;\n  b.hp-=d;",
    "if(G.fustoF===G.floor)d*=1.2;if(G.weakpt&&G.floor===7)d*=1.15;\n  if(!b.mini){if(b.immUntil&&G.time<b.immUntil){if(Math.random()<.15){SFX.tink();popText(b.x,b.y-30,L3('IMMUNE','IMMUNE','INMUNE'),'#c8c4b4');}return true;}\n    const cap=b.maxhp/(b.fb?14:20);b.dW=Math.max(0,(b.dW||0)-(G.time-(b.dT||G.time))*cap);b.dT=G.time;if(b.dW>cap)d*=.3;b.dW+=d;\n    const ph=b.hp-d<b.maxhp*.33?3:b.hp-d<b.maxhp*.66?2:1;if(ph>(b.phase||1)&&b.hp-d>0){b.phase=ph;b.immUntil=G.time+1.8;b.hp=Math.min(b.hp,b.maxhp*(ph===2?.66:.33));b.flash=.3;G.eb.length=0;G.shake=.35;SFX.boom();addRing(b.x,b.y,60,'#ffffff',.5);popText(b.x,b.y-36,L3('PHASE ','FASE ','FASE ')+ph,'#ff4a5a');try{if(typeof bossPhase==='function')bossPhase(b,ph);}catch(e){}return true;}}\n  b.hp-=d;")
rep('const ESV=','Object.assign(IT,{"Every room you clean refills 20% of the gun in your hands.":"Ogni stanza che pulisci ricarica il 20% dell\'arma che impugni.","Ammo boxes give heavy weapons two shots instead of one.":"Le scatole di munizioni danno alle armi pesanti due colpi invece di uno."});Object.assign(ES,{"Every room you clean refills 20% of the gun in your hands.":"Cada sala que limpias recarga un 20% del arma que llevas.","Ammo boxes give heavy weapons two shots instead of one.":"Las cajas de munición dan a las armas pesadas dos disparos en vez de uno."});\nconst ESV=')
open(F,'w').write(s);print('v156 ok')
