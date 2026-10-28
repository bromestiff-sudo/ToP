import json, sys
sys.path.insert(0, '.')
from mem import HOOK, SPOT, AGAIN, LATER, IDLE, COL, UI
F = '../build/tower-of-poop.html'; s = open(F).read()
IT, ES = {}, {}
def add(l):
    IT[l[1]] = l[2]; ES[l[1]] = l[3]; return [l[0], l[1]]
J = lambda x: json.dumps(x, ensure_ascii=False)
MEM = {'hook': {n: add(v) for n, v in HOOK.items()}, 'spot': {n: add(v) for n, v in SPOT.items()}, 'again': add(AGAIN), 'later': add(LATER), 'idle': [add(v) for v in IDLE]}
MCOL = {k: {c: [add(l) for l in L] for c, L in v.items()} for k, v in COL.items()}
for u in UI: IT[u[0]] = u[1]; ES[u[0]] = u[2]
for l in [v for v in list(HOOK.values()) + list(SPOT.values()) + [AGAIN, LATER] + IDLE]:
    assert max(len(x) for x in l[1:]) <= 190, l[1][:40]
def rep(a, b, cnt=1):
    global s
    n = s.count(a); assert n == cnt, (a[:70], n); s = s.replace(a, b)
rep('const ESV=', 'Object.assign(IT,' + J(IT) + ');Object.assign(ES,' + J(ES) + ');\nconst ESV=')
eng = open('engine2.js').read()
rep('function playScene(', 'const MEM=' + J(MEM) + ';\nconst MEMCOL=' + J(MCOL) + ';\n' + eng + 'function playScene(')
# the campfire pad, Spongey and the Colonel by the fire
rep("  {id:'mess',label:'MESS HALL',x:294,y:18,w:32,h:22,lx:310,ly:44,hot:'#ffcf7a'}];", "  {id:'mess',label:'MESS HALL',x:294,y:18,w:32,h:22,lx:310,ly:44,hot:'#ffcf7a'},\n  {id:'fire',label:'CAMPFIRE',x:184,y:112,w:34,h:24,lx:202,ly:140,hot:'#ffb040'}];")
rep("if(pd.id!=='gate'){ctx.globalAlpha=on?.55:.28;", "if(pd.id!=='gate'&&pd.id!=='fire'){ctx.globalAlpha=on?.55:.28;")
rep("  drawHubGrowth(t);\n", "  drawHubGrowth(t);drawFireFolk();\n")
rep("if(p.id==='mess'){enterMess();return;}", "if(p.id==='mess'){enterMess();return;}if(p.id==='fire'){fireTalk();return;}")
rep("setTimeout(()=>{try{actCheck();}catch(e){}},2400);}", "setTimeout(()=>{try{actCheck();}catch(e){}try{memNotice();}catch(e){}},2400);}")
# the sepia of a memory
rep("  // dialogue box\n", "  if(sc.flash){ctx.save();ctx.globalCompositeOperation='color';ctx.fillStyle='rgba(120,80,36,.92)';ctx.fillRect(0,0,W,H);ctx.restore();}\n  // dialogue box\n")
# the optional room in the tower
rep("    if(cand.length&&level<=6&&Math.random()<.8){const r=cand.find(x=>deg(x)===1)||cand[0];r.kind='merchant';",
    "    if(cand.length&&imzRoomWanted(level)){const r=cand.find(x=>deg(x)===1)||cand[0];r.kind='imzroom';r.state='cleared';cand.splice(cand.indexOf(r),1);}\n    if(cand.length&&level<=6&&Math.random()<.8){const r=cand.find(x=>deg(x)===1)||cand[0];r.kind='merchant';")
rep("conveyor:'#9aa8c8',eggrain:'#fff0a0',turret:'#ff9a4a'}[r.kind]", "conveyor:'#9aa8c8',eggrain:'#fff0a0',turret:'#ff9a4a',imzroom:'#e8c890'}[r.kind]")
rep("BADK=['merchant','deal','slots','shrine','fountain','secret','abyss','tunnel']", "BADK=['merchant','deal','slots','shrine','fountain','secret','abyss','tunnel','imzroom']")
rep("function exploreSetup(m,sr){", "function exploreSetup(m,sr){try{for(const r of m.rooms)if(r.kind==='imzroom')G.picks.push({x:r.cx,y:r.cy,t:'imzspot',n:G.floor,life:1e9});}catch(e){}")
rep("if(k.t==='cage'){drawCage(k);continue;}", "if(k.t==='imzspot'){drawImzSpot(k);continue;}if(k.t==='cage'){drawCage(k);continue;}")
rep("k.t!=='recharge'){const d=Math.hypot", "k.t!=='recharge'&&k.t!=='imzspot'){const d=Math.hypot")
rep("    if(Math.hypot(P.x-k.x,P.y-k.y)<11){\n", "    if(Math.hypot(P.x-k.x,P.y-k.y)<(k.t==='imzspot'?18:11)){if(k.t==='imzspot'){if(!k.used){k.used=1;imzSpotTouch(k);}continue;}\n")
# the debt of a sheet given to Spongey
rep("function applyMeta(){if(!G||G.rush||G.surv||G.train)return;const M=G.mods;", "function applyMeta(){if(!G||G.rush||G.surv||G.train)return;const M=G.mods;if(SV.sheetDebt){SV.sheetDebt=0;saveSV();setTimeout(()=>{if(G&&!G.hub){G.hpMax=Math.max(1,G.hpMax-1);G.hp=Math.min(G.hp,G.hpMax);}},0);}")
# the tower games cabinet in the Mess Hall
rep("concat([{id:'exit',label:'BACK TO THE BASTION',x:160,y:220,w:32,h:36,lx:176,ly:208,hot:'#fff0a0'}]);", "concat([{id:'exit',label:'BACK TO THE BASTION',x:160,y:220,w:32,h:36,lx:176,ly:208,hot:'#fff0a0'},{id:'tgames',label:'',x:298,y:200,w:28,h:22,lx:312,ly:166,hot:'#c8a0ff'}]);")
rep("function messPad(p){const it=LG==='it';if(p.id==='arcade'){arcadePad(p);return;}", "function messPad(p){const it=LG==='it';if(p.id==='arcade'){arcadePad(p);return;}if(p.id==='tgames'){towerGames();return;}")
rep("function drawMess(){const p=hubPad(),t=G.time,it=LG==='it';", "function drawMess(){const p=hubPad(),t=G.time,it=LG==='it';drawTowerCab(p&&p.id==='tgames',t);")
open(F, 'w').write(s); print('v154 ok', len(IT))
