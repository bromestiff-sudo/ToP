import re
F='../build/tower-of-poop.html';s=open(F).read()
def rep(a,b,cnt=1):
    global s
    n=s.count(a);assert n==cnt,(a[:70],n);s=s.replace(a,b)
# pace: back towards v151, still a bit quicker and meaner
rep('G.spd*1.2978','G.spd*1.15',3)
rep('P.ddx*270;vy=P.ddy*270','P.ddx*250;vy=P.ddy*250',2)
rep('G.df*=1.2;G.sm*=1.15;G.cad*=.8;','G.df*=1.07;G.cad*=.88;')
rep('P.inv=(SV.opts.easy?1.6:.8)*','P.inv=(SV.opts.easy?1.6:.9)*')
# the tear mechanic is gone
rep('function tearSheet(){','function tearSheet(){return;')
rep('.pbtn.tear{border-color:#a89878;color:#f4f1ea}','.pbtn.tear{border-color:#a89878;color:#f4f1ea}#tearBtn{display:none!important}')
n=len(re.findall(r'<span><kbd>T</kbd> [^<]*</span>',s));s=re.sub(r'<span><kbd>T</kbd> [^<]*</span>','',s);print('kbd removed',n)
for a,b in [('X gadget, B tear, + pause','X gadget, + pause'),('X gadget, B strappo, + pausa','X gadget, + pausa'),('X gadget, Y tear, + pause','X gadget, + pause'),('X gadget, Y strappo, + pausa','X gadget, + pausa'),
            ('R gadget, right stick click tear, + pause','R gadget, + pause'),('R gadget, clic levetta destra strappo, + pausa','R gadget, + pausa')]:rep(a,b)
# training: no more step 7
rep("  ['TEAR A SHEET',(T?'Tap TEAR':'Press T')+': the sheet blocks shots and lures poop. Walk over it to roll it back'],\n","")
rep('TRAIN_N=9','TRAIN_N=8')
i=s.index("  else if(T.step===7){if(G.sheets");j=s.index("  else if(T.step===8&&T.t>2.2)")
s=s[:i]+s[j:]
rep("  else if(T.step===8&&T.t>2.2)","  else if(T.step===7&&T.t>2.2)")
rep("  if(s===7){for(const e of G.enemies)if(!e.dead)killEnemy(e);G.eb.length=0;G.hp=Math.max(G.hp,3);dummy('spitter',176,64,999);}","  if(s===7){for(const e of G.enemies)if(!e.dead)killEnemy(e);G.eb.length=0;}")
open(F,'w').write(s);print('ok')
