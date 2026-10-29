F='../build/tower-of-poop.html';s=open(F).read()
def rep(a,b,cnt=1):
    global s
    n=s.count(a);assert n==cnt,(a[:70],n);s=s.replace(a,b)
# FRENZY at the Bastion gate too, right after the story runs
rep("    runs.push({label:'ONLINE CO-OP',",
    "    runs.push({label:TTX(L3('FRENZY','FRENESIA','FRENESÍ')),right:TTX(L3('3 MIN','3 MIN','3 MIN')),col:'#ff8a7a',desc:TTX(L3('Three minutes in the arena: a random gun, enemies that never come in the same order, a twist every 30 seconds.','Tre minuti nell\\'arena: un\\'arma a caso, nemici mai nello stesso ordine, un imprevisto ogni 30 secondi.','Tres minutos en la arena: un arma al azar, enemigos nunca en el mismo orden, un imprevisto cada 30 segundos.')+(SV.best&&SV.best.frenzy?L3(' Best: ',' Record: ',' Récord: ')+SV.best.frenzy:'')),act(){startFrenzy();}});\n    runs.push({label:'ONLINE CO-OP',")
# on phones in landscape the Sound / Fullscreen / Share buttons sit at the bottom left of the title,
# right where the modes column is: on the title they move to the top right corner (empty sky)
rep(".touch.land[data-state=\"title\"] .bar{top:auto;bottom:calc(8px + env(safe-area-inset-bottom,0px))}",
    ".touch.land[data-state=\"title\"] .bar{top:calc(8px + env(safe-area-inset-top,0px));bottom:auto;left:auto;right:max(10px,env(safe-area-inset-right,0px))}")
rep("const STATV=165;","const STATV=166;")
open(F,'w').write(s);print('v166 ok')
