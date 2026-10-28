import json
F='../build/tower-of-poop.html';s=open(F).read()
def rep(a,b,cnt=1):
    global s
    n=s.count(a);assert n==cnt,(a[:70],n);s=s.replace(a,b)
J=lambda x:json.dumps(x,ensure_ascii=False)
rep('function playScene(',open('chars.js').read()+'function playScene(')
old=s[s.index('const CHARS=['):s.index('];',s.index('const CHARS=['))+2]
D={'two':"SECOND PLY: the first hit in every room is soaked up by your second ply. Starts with the spray bottle.",
   'bristle':"SCRUB: dashing scrubs every poop you pass through, and puddles never slow you. Starts with the scattergun.",
   'duck':"SQUEAK: every dash pops the enemy shots around you. Shots bounce one extra time. Starts with the bouncy soap gun.",
   'wipe':"LULLABY: stand still and he hums; poop around him slows down. Starts with the pressure washer.",
   'chick':"PECK: after a dash, your next three volleys deal double damage. Tiny and hard to hit. Starts with the foam blaster."}
new=("const CHARS=[\n"
 "  {id:'two',name:'SGT. TWO-PLY',hp:4,spd:80,tp:0,soap:3,desc:"+J(D['two'])+"},\n"
 "  {id:'bristle',name:'BRISTLE THE BRUSH',hp:5,spd:72,tp:5,soap:3,noSlow:true,rescue:1,desc:"+J(D['bristle'])+"},\n"
 "  {id:'duck',name:'QUACKERS',hp:3,spd:92,tp:5,soap:2,bounce:1,rescue:2,desc:"+J(D['duck'])+"},\n"
 "  {id:'wipe',name:'BUGLER WIPE',hp:3,spd:84,tp:5,soap:2,rescue:3,desc:"+J(D['wipe'])+"},\n"
 "  {id:'chick',name:'NUGGET',hp:3,spd:88,tp:0,soap:4,r:4,rescue:5,desc:"+J(D['chick'])+"}];")
s=s.replace(old,new)
IT={'BRISTLE THE BRUSH':'SETOLA LA SPAZZOLA','BUGLER WIPE':'TROMBETTIERE SALVIETTA',
 D['two']:"SECONDO VELO: il primo colpo in ogni stanza lo assorbe il tuo secondo velo. Parte con lo spruzzino.",
 D['bristle']:"STROFINATA: lo scatto strofina ogni cacca che attraversi, e le pozzanghere non ti rallentano mai. Parte con il fucile a dispersione.",
 D['duck']:"SQUITTIO: ogni scatto fa scoppiare i colpi nemici intorno a te. I colpi rimbalzano una volta in più. Parte con la pistola di sapone rimbalzante.",
 D['wipe']:"NINNANANNA: se stai fermo canticchia, e le cacche intorno a lui rallentano. Parte con l'idropulitrice.",
 D['chick']:"BECCATA: dopo uno scatto, le tue tre raffiche successive fanno danno doppio. Piccola e difficile da colpire. Parte con lo sparaschiuma."}
ES={'BRISTLE THE BRUSH':'CERDA EL CEPILLO','BUGLER WIPE':'CORNETA TOALLITA',
 D['two']:"SEGUNDA HOJA: el primer golpe de cada sala lo absorbe tu segunda hoja. Empieza con el pulverizador.",
 D['bristle']:"FROTADO: el impulso frota cada caca que atraviesas, y los charcos nunca te frenan. Empieza con la escopeta de dispersión.",
 D['duck']:"CUIC: cada impulso revienta los disparos enemigos a tu alrededor. Los disparos rebotan una vez más. Empieza con la pistola de jabón saltarín.",
 D['wipe']:"NANA: si te quedas quieto tararea, y las cacas a su alrededor se ralentizan. Empieza con la hidrolimpiadora.",
 D['chick']:"PICOTAZO: tras un impulso, tus tres ráfagas siguientes hacen daño doble. Diminuta y difícil de golpear. Empieza con el lanzaespuma."}
rep('const ESV=','Object.assign(IT,'+J(IT)+');Object.assign(ES,'+J(ES)+');\nconst ESV=')
rep("if(id==='sponge')return SPR.sponge;","if(id==='bristle'||id==='wipe'){SPR.ch=SPR.ch||{};const k=id+(fr%2);return SPR.ch[k]||(SPR.ch[k]=charArt(id,fr%2));}")
rep("if(id==='col')return SPR.plunger;","")
rep("if(!G.daily)applyMeta();","if(!G.daily)applyMeta();try{charStart();}catch(e){}")
rep("styleDash();P.ddx=dx;P.ddy=dy;SFX.dash();","styleDash();P.ddx=dx;P.ddy=dy;SFX.dash();try{charDash();}catch(e){}")
rep("if(G.mods&&G.mods.turbo)for","if((G.mods&&G.mods.turbo)||(G.char&&G.char.id==='bristle'))for")
rep("visited=true;G.active=r;if(G.P2)coopBringP2();","visited=true;G.active=r;try{charRoom();}catch(e){}if(G.P2)coopBringP2();")
rep("G.roomHit=true;","if(G.ply&&G.char&&G.char.id==='two'&&!G.train){G.ply=0;P.inv=.9;SFX.tink();addRing(P.x,P.y-4,20,'#f4f1ea',.35);popText(P.x,P.y-22,L3('SECOND PLY','SECONDO VELO','SEGUNDA HOJA'),'#f4f1ea');clearShots(P.x,P.y-3,30);return;}\n  G.roomHit=true;")
rep("updateParts(dt);organTick(dt);styleTick(dt);sheetsTick(dt);","updateParts(dt);organTick(dt);styleTick(dt);sheetsTick(dt);try{charTick(dt);}catch(e){}")
rep("    for(const an of angs)G.pb.push({wid:w.id,","    const pk=G.peck>0?(G.peck--,2):1;for(const an of angs)G.pb.push({wid:w.id,")
rep("dmg:w.dmg*G.dmgMul*(G.sparkle>0?1.3:1),kind:w.kind,","dmg:w.dmg*G.dmgMul*(G.sparkle>0?1.3:1)*pk,kind:w.kind,")
rep("function drawPlayer(){const P=G.P;","function drawPlayer(){const P=G.P;try{charDrawFx();}catch(e){}")
# old saves: Spongey and the Colonel are story characters now
rep("function loadSV(){const r=loadSV0();","function loadSV(){const r=loadSV0();try{const mp={sponge:'bristle',col:'wipe'};if(r.chars)r.chars=[...new Set(r.chars.map(c=>mp[c]||c))];if(mp[r.char])r.char=mp[r.char];if(r.run&&mp[r.run.char])r.run.char=mp[r.run.char];}catch(e){}")
rep("right:sel?'SELECTED':has?'HP '+c.hp:'LOCKED'","right:sel?'SELECTED':has?TTX(L3('SHEETS ','FOGLI ','HOJAS ')+c.hp):'LOCKED'")
open(F,'w').write(s);print('v158 ok')
