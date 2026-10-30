# v168: COOP OF DESPAIR. The title changes and the game loses its jokes: the tower is dark,
# the enemies are its spawn, only Sgt. Two-Ply keeps a dry irony. See tone_v168.py.
import re, json
from tone_v168 import TONE, TRI
F = '../build/tower-of-poop.html'; s = open(F).read()
def rep(a, b, cnt=1):
    global s
    n = s.count(a); assert n == cnt, (a[:70], n); s = s.replace(a, b)

# 1. trilingual literals (match all three in a row so each language gets its own text)
q = lambda x: "(['\"])" + re.escape(x) + r"\1"
for old, new in TRI:
    pat = re.compile(q(old[0]) + r"(\s*,\s*)" + q(old[1]).replace(r'\1', r'\3') + r"(\s*,\s*)" + q(old[2]).replace(r'\1', r'\5'))
    s, n = pat.subn(lambda m: m.group(1) + new[0] + m.group(1) + m.group(2) + m.group(3) + new[1] + m.group(3) + m.group(4) + m.group(5) + new[2] + m.group(5), s)

# 2. English literals in the code (dictionary lines untouched): match on the trimmed text, keep the spacing
M = {o.strip(): e for o, e, i, x in TONE}
lines = s.split('\n'); hit = {}
LIT = re.compile(r"'((?:[^'\\\n]|\\.)*)'|\"((?:[^\"\\\n]|\\.)*)\"|`((?:[^`\\]|\\.)*)`")
def sub(m):
    qc = "'" if m.group(1) is not None else '"' if m.group(2) is not None else '`'
    raw = m.group(1) if m.group(1) is not None else m.group(2) if m.group(2) is not None else m.group(3)
    txt = raw.replace('\\' + qc, qc); k = txt.strip()
    if k not in M or (qc == '`' and '${' in raw): return m.group(0)
    hit[k] = hit.get(k, 0) + 1
    new = txt.replace(k, M[k]).replace('\\', '\\\\').replace(qc, '\\' + qc)
    return qc + new + qc
for n, l in enumerate(lines):
    if re.match(r'^(const (IT|ES)=\{|Object\.assign\((IT|ES),)', l): continue
    lines[n] = LIT.sub(sub, l)
s = '\n'.join(lines)
miss = [k for k in M if k not in hit]
print('tone: replaced', sum(hit.values()), 'literals,', len(hit), 'texts; not found in code:', miss)

# 3. translations for the new texts
it = {e.strip(): i for o, e, i, x in TONE}; es = {e.strip(): x for o, e, i, x in TONE}
rep("const ESV=new Set(", "Object.assign(IT," + json.dumps(it, ensure_ascii=False) + ");Object.assign(ES," + json.dumps(es, ensure_ascii=False) + ");\nconst ESV=new Set(")

# 4. the name of the game
rep("<title>Tower of Poop</title>", "<title>Coop of Despair</title>")
rep('aria-label="Tower of Poop game screen"', 'aria-label="Coop of Despair game screen"')
rep("if(/^\\s*TOWER OF POOP\\s*$/i.test(s))return s;", "if(/^\\s*COOP OF DESPAIR\\s*$/i.test(s))return s;")
rep("if(r===undefined&&/TOWER OF POOP/i.test(s)){r=s.split(/(TOWER OF POOP)/i)", "if(r===undefined&&/COOP OF DESPAIR/i.test(s)){r=s.split(/(COOP OF DESPAIR)/i)")
rep("waveText('TOWER OF POOP',", "waveText('COOP OF DESPAIR',", 2)
rep("txt('TOWER OF POOP',W/2,H/2-64,", "txt('COOP OF DESPAIR',W/2,H/2-64,")
rep("ctxt(c,'TOWER OF POOP · '", "ctxt(c,'COOP OF DESPAIR · '")
rep("title:'Tower of Poop',text", "title:'Coop of Despair',text")
rep("'La mia partita a Tower of Poop, a fumetti 🧻🐔'", "'La mia partita a Coop of Despair, a fumetti'")
rep("'Tower of Poop si gioca solo in orizzontale'", "'Coop of Despair si gioca solo in orizzontale'", 2)
rep("'📲 INSTALLA TOWER OF POOP'", "'📲 INSTALLA COOP OF DESPAIR'")
# the score you share
rep("`Il Serg. Doppiovelo è arrivato al piano ${f} di Tower of Poop con ${s} punti 🧻🐔 Riesci a battere la Regina Cacca?`:`La Gallina ha fatto la cacca su ogni piano del pollaio in Tower of Poop 🧻🐔 Prendi uno spruzzino e ripulisci:`",
    "`Il Serg. Doppiovelo è arrivato al piano ${f} in Coop of Despair con ${s} punti. Nessuno è mai sceso. Ci provi tu?`:`Una torre viva, sette piani, dodici soldati mai tornati. Coop of Despair:`")
rep("`Sgt. Two-Ply fought his way up to ${f<=3?'the farm':'floor '+(f-3)} of the Tower of Poop with ${s} points 🧻🐔 Can you beat the Poop Queen?`:`The Hen pooped on every level of the coop in Tower of Poop 🧻🐔 Grab a spray and clean it up:`",
    "`Sgt. Two-Ply climbed to ${f<=3?'the farm':'floor '+(f-3)} of the tower in Coop of Despair with ${s} points. Nobody has ever come down. Your turn?`:`A living tower, seven floors, twelve soldiers who never came back. Coop of Despair:`")

# 5. Italian texts written straight into the code
rep("['IMPERMEABILI','Sempre '+wn+'? Le mie cacche ora la respingono. Cambia arma o rompi lo scudo con altro!']", "['GUSCI','Sempre '+wn+'? Le mie larve ormai non lo sentono più. Cambia arma, o rompi il guscio con qualcos\\'altro.']")
rep("Tu strappalo via. Nessuna cacca resta impunita. — Monovelo", "Tu strappalo via. — Monovelo")
rep("'45 secondi. Raccogli nel pentolone mais e verdure, il chicco dorato vale 5. Le cacche rovinano la zuppa: -3.'", "'45 secondi. Raccogli nel pentolone mais e verdure, il chicco dorato vale 5. Le larve rovinano la zuppa: -3.'")
rep("'TIRO ALLA CACCA'", "'TIRO ALLE LARVE'")
rep("'45 secondi. Le cacche spuntano dai sacchi di sabbia: muoviti e spara, schiva i loro sputi.'", "'45 secondi. Le larve spuntano dai sacchi di sabbia: muoviti e spara, schiva i loro sputi.'")
rep("schiva cacche e pozzanghere. 3 fogli.", "schiva larve e pozzanghere. 3 fogli.")
rep("L3('Clean '+a+' poops in one run','Pulisci '+a+' cacche in una partita','Limpia '+a+' cacas en una partida')", "L3('Kill '+a+' spawn in one run','Uccidi '+a+' larve in una partita','Mata '+a+' engendros en una partida')")
rep("'{N} cacche ripulite. Nessuno disse grazie.'", "'{N} larve distrutte. Nessuno ha detto grazie.'")
rep("leg('#7fd8ff','WC');", "leg('#7fd8ff','PIPE');")
rep("Object.assign(IT,{\"ORDERS\"", "Object.assign(IT,{\"PIPE\":\"CONDOTTI\"});Object.assign(ES,{\"PIPE\":\"CONDUCTOS\"});Object.assign(IT,{\"ORDERS\"")
rep('<span id="rotS">Tower of Poop is played in landscape</span>', '<span id="rotS">Coop of Despair is played in landscape</span>')
rep("const STATV=167;", "const STATV=168;")
open(F, 'w').write(s)
