import json, re, sys, math
sys.path.insert(0, '.')
from story import INTRO, HUB, SCENES, ENDING, ACT2
from imz1 import I1
from imz2 import I2
from imz3 import I3
from imz4 import I4
from imz5 import I5
from imz6 import I6
from endx import ENDX

LIMIT = int(sys.argv[1]) if len(sys.argv) > 1 else 175
F = '../build/tower-of-poop.html'
s = open(F).read()
IT, ES = {}, {}
warn = []

def add(en, it, es):
    if en in IT and IT[en] != it: warn.append(('IT conflict', en[:60]))
    if en in ES and ES[en] != es: warn.append(('ES conflict', en[:60]))
    IT[en] = it; ES[en] = es

SENT = re.compile(r'(?<=[.!?…"»])\s+')
def parts(text, k):
    sents = [x for x in SENT.split(text) if x]
    if len(sents) >= k:
        tot = sum(len(x) for x in sents); out = []; cur = ''; acc = 0
        for i, x in enumerate(sents):
            left = len(sents) - i
            need = k - len(out) - (1 if cur else 0)
            if cur and (acc + len(x) / 2 > tot * (len(out) + 1) / k) and len(out) < k - 1:
                out.append(cur); cur = x
            elif cur and left <= need:
                out.append(cur); cur = x
            else:
                cur = (cur + ' ' + x) if cur else x
            acc += len(x)
        out.append(cur)
        if len(out) == k: return out
    # fallback: split at spaces
    words = text.split(' '); out = []; per = len(text) / k; cur = ''
    for w in words:
        if cur and len(cur) + 1 + len(w) > per and len(out) < k - 1:
            out.append(cur); cur = w
        else:
            cur = (cur + ' ' + w) if cur else w
    out.append(cur)
    return out

def split(line):
    spk, en, it, es = line
    m = max(len(en), len(it), len(es))
    if m <= LIMIT: return [line]
    for k in range(2, 6):
        a, b, c = parts(en, k), parts(it, k), parts(es, k)
        if len(a) == len(b) == len(c) == k and max(len(x) for x in a + b + c) <= LIMIT:
            return [[spk, a[i], b[i], c[i]] for i in range(k)]
    warn.append(('cannot split', en[:60])); return [line]

def lines(L):
    out = []
    for l in L:
        for p in split(l):
            add(p[1], p[2], p[3]); out.append([p[0], p[1]])
    return out

def tri(t):
    add(t[0], t[1], t[2]); return t[0]

intro = lines(INTRO)
scen = {k: lines(v) for k, v in SCENES.items()}
ending = lines(ENDING)
act2 = lines(ACT2)
add(*HUB)

IMZ = {}
for n, D in [(1, I1), (2, I2), (3, I3), (4, I4), (5, I5), (6, I6)]:
    o = {'title': tri(D['title']), 'place': lines(D['place']), 'short': lines(D['short']), 'act_intro': lines(D['act_intro']), 'scenes': []}
    for sc in D['scenes']:
        x = {'cond': sc['cond'], 'name': tri(sc['name']), 'lines': lines(sc['lines'])}
        if 'choice' in sc:
            ch = sc['choice']
            x['choice'] = {'key': ch['key'], 'title': tri(ch['title']), 'opts': [{'id': op['id'], 'label': tri(op['label']), 'desc': tri(op['desc']), 'after': lines(op['after'])} for op in ch['opts']]}
        o['scenes'].append(x)
    if 'burn' in D: o['burn'] = lines(D['burn'])
    if 'charts' in D:
        o['charts'] = [{'id': c['id'], 'name': tri(c['name']), 'short': tri(c['short']), 'story': tri(c['story'])} for c in D['charts']]
        for c in D['charts']:
            if max(len(x) for x in c['story']) > 235: warn.append(('long chart', c['id']))
    IMZ[n] = o

END = {}
for k, v in ENDX.items():
    if k == 'candles':
        e, i, sp = v[0][1], v[0][2], v[0][3]
        END['candles'] = []
        for n in range(1, 13):
            a, b, c = e.replace('{n}', str(n)), i.replace('{n}', str(n)), sp.replace('{n}', str(n))
            add(a, b, c); END['candles'].append(a)
    else:
        END[k] = lines(v)

# UI strings used by the scene system
for t in [["CHOOSE", "SCEGLI", "ELIGE"], ["GEN. SINGLE-PLY", "GEN. MONOVELO", "GRAL. HOJA SIMPLE"], ["RADIO", "RADIO", "RADIO"],
          ["PROLOGUE", "PROLOGO", "PRÓLOGO"]]:
    add(*t)

J = lambda x: json.dumps(x, ensure_ascii=False)
def rep(a, b, cnt=1):
    global s
    n = s.count(a)
    assert n == cnt, (a[:80], n)
    s = s.replace(a, b)
def rep_re(pat, b):
    global s
    m = re.search(pat, s, re.S); assert m, pat
    s = s[:m.start()] + b + s[m.end():]

rep_re(r'const INTRO=\[.*?\];\n', 'const INTRO=' + J(intro) + ';\n')
rep_re(r'const SCENE_AT=\{.*?\};\n', 'const SCENE_AT=' + J(scen) + ';\n')
rep_re(r'const ENDING=\[.*?\];\n', 'const ENDING=' + J(ending) + ';\n')
rep('const GREET=[["col","Welcome to the Last Bastion, soldier. The final camp at the foot of the Tower of Poop."]', 'const GREET=[["col",' + J(HUB[0]) + ']')
rep('const ESV=', 'Object.assign(IT,' + J(IT) + ');Object.assign(ES,' + J(ES) + ');\nconst ESV=')

eng = open('engine.js').read()
rep('function playScene(', 'const IMZ=' + J(IMZ) + ';\nconst ACT2=' + J(act2) + ';\nconst IMZ_END=' + J(END) + ';\n' + eng + 'function playScene(')
mg = open('mgimz.js').read()
rep('const MG={\n', 'const MG={\n' + mg)
rep('const CAST={\n', "const CAST={\n  nar:{name:'',col:'#8a7a6a',spr:()=>SPR.sponge,sc:5},\n  book:{name:'',col:'#e8a0c0',spr:()=>SPR.sponge,sc:5},\n  mono:{name:'GEN. SINGLE-PLY',col:'#e8e8f0',spr:()=>SPR.boss[Math.max(0,BOSSDEFS.findIndex(d=>d.art==='general'))][0],sc:1.6},\n  radio:{name:'RADIO',col:'#7fd8ff',spr:()=>voiceSpr(),sc:5},\n")
# scene drawing
rep("S.scene={lines,i:0,ch:0,title,sub,after,right:(lines.find(l=>l[0]!=='two')||['sponge'])[0]}", "S.scene={lines,i:0,ch:0,title,sub,after,right:(lines.find(l=>l[0]!=='two'&&l[0]!=='nar'&&l[0]!=='book')||['sponge'])[0]}")
rep("  if(spk!=='two')sc.right=spk;\n  drawWorld();rect(ctx,0,0,W,H,'rgba(10,6,4,.8)');", "  if(spk!=='two'&&spk!=='nar'&&spk!=='book')sc.right=spk;\n  if(spk==='book')drawBook(sc,t);else{drawWorld();rect(ctx,0,0,W,H,'rgba(10,6,4,.8)');}")
rep("  if(spk==='two'){put(rim,rx,true,false,ph*.92);put(L,lx,false,true,ph);}", "  if(spk==='book'){}else if(spk==='nar'){put(rim,rx,true,false,ph*.92);put(L,lx,false,false,ph*.92);}else if(spk==='two'){put(rim,rx,true,false,ph*.92);put(L,lx,false,true,ph);}")
rep("rect(ctx,nx,ny,nw,17,C.col);rect(ctx,nx,ny+15,nw,2,'rgba(0,0,0,.35)');NOTR=true;txt(nm,nx+8,ny+3,'#120a06','left',10,null);NOTR=false;", "if(C.name){rect(ctx,nx,ny,nw,17,C.col);rect(ctx,nx,ny+15,nw,2,'rgba(0,0,0,.35)');NOTR=true;txt(nm,nx+8,ny+3,'#120a06','left',10,null);NOTR=false;}")
rep("livingText(part,bx+pad,by+pad+4+i*lh,fs,'#f4f4f0',t,acc,shake,sc.ch-acc)", "livingText(part,bx+pad,by+pad+4+i*lh,fs,spk==='nar'||spk==='book'?'#d8c8a8':'#f4f4f0',t,acc,shake,sc.ch-acc)")
rep("spk!=='nugget'&&spk!=='col')?1:0", "spk!=='nugget'&&spk!=='col'&&spk!=='nar'&&spk!=='book'&&spk!=='mono')?1:0")
# flow
rep("function nextLevel(){if(G.qm){qmNext();return;}", "function nextLevel(){if(G.qm){qmNext();return;}if(G.fustoF&&G.fustoF===G.floor){G.hpMax+=1;G.fustoF=0;}G.imz=null;")
rep("function mgExit(){MGS=null;", "function mgExit(){const xf=MGS&&MGS.onExit,xr=MGS;if(xf){if(!xr.done){try{const M=MG[xr.id];if(M.onFinish)M.onFinish();}catch(e){}}MGS=null;xf(xr);return;}MGS=null;")
rep("function closeMenu(){", "function closeMenu(){if(S.menu&&S.menu.lock)return;")
rep("txt('CLOSE',144,255,'#f4f4f0','center',9,null);}", "txt(m.lock?'CHOOSE':'CLOSE',144,255,'#f4f4f0','center',9,null);}", 2)
rep("function planKnown(r){const m=G.m;", "function planKnown(r){const m=G.m;if(r.known)return true;")
rep("G.streak=0;G.hp--;", "G.streak=0;G.hp--;if(G.hp===1&&G.bandage&&G.hpMax>1){G.bandage=0;G.hp=2;popText(P.x,P.y-30,L3('BANDAGE!','BENDA!','¡VENDA!'),'#ffffff');}")
rep("if(M.crit&&Math.random()<M.crit)d*=3;}}\n  b.hp-=d;", "if(M.crit&&Math.random()<M.crit)d*=3;}}if(G.fustoF===G.floor)d*=1.2;if(G.weakpt&&G.floor===7)d*=1.15;\n  b.hp-=d;")
rep("  if(b.hp<=0){b.hp=0;b.state='dying';", "  if(b.hp<=0){try{SV.bk=SV.bk||{};if(b.art)SV.bk[b.art]=1;}catch(e){}b.hp=0;b.state='dying';")
rep("function hitEnemy(e,d,kx,ky){", "function hitEnemy(e,d,kx,ky){if(G.fustoF&&G.fustoF===G.floor)d*=1.2;")
rep("&&!G.qm&&G.floor>=1){const st=G.st||{shots:{}};", "&&!G.qm&&G.floor>=1){SV.deaths=(SV.deaths||0)+1;const st=G.st||{shots:{}};")
rep("act(){wallMenu();}}];", "act(){wallMenu();}}];if((SV.triage||[]).length)rows.push({label:L3(\"GAUZE'S CHARTS\",'LE CARTELLE DI GARZA','LAS FICHAS DE GASA'),right:SV.triage.length+'/5',col:'#c8e0ff',desc:L3('The soldiers you bandaged in the walled infirmary.','I soldati che hai bendato nell\\'infermeria murata.','Los soldados que vendaste en la enfermería tapiada.'),act(){imzChartsMenu();}});")
rep("function endingLines(){const n=qCount(),L=ENDING.slice();", "function endingLines(){const n=qCount(),L=ENDING.slice();try{imzEnd(L);}catch(e){}")
rep("if(n>=21)L[L.length-1]=", "if(n>=21)L[L.length-2]=")
rep("else if(n>=14)L[L.length-1]=", "else if(n>=14)L[L.length-2]=")
rep("if(L===1&&SV.introV!==5&&!G.coop){SV.introSeen=true;SV.introV=5;", "if(L===1&&SV.introV!==6&&!G.coop){SV.introSeen=true;SV.introV=6;")
rep("const fs=land?(bw>460?14:12):12,pad=16,full=wrapText(line[1],bw-pad*2,fs),lh=Math.round(fs*FONTK*1.45);","let fs=land?(bw>460?14:12):12;const pad=16;let full=wrapText(line[1],bw-pad*2,fs),lh=Math.round(fs*FONTK*1.45);while(fs>8&&full.length*lh>bh-pad-14){fs--;full=wrapText(line[1],bw-pad*2,fs);lh=Math.round(fs*FONTK*1.45);}")
open(F, 'w').write(s)
print('IT entries', len(IT), 'warnings', len(warn))
for w in warn: print(w)
