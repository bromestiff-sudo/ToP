F='../build/tower-of-poop.html';s=open(F).read()
def rep(a,b,cnt=1):
    global s
    n=s.count(a);assert n==cnt,(a[:70],n);s=s.replace(a,b)
rep('function playScene(',open('titlemenu.js').read()+'function playScene(')
# the whole left column of the title screen is now drawn by titleMenu()
i=s.index("const cx=Math.round(W*.3),amp=QS===4?4.5:QS===3?3:2,"); j=s.index("try{frenzyTitleButton(Math.round(W*.3),Math.round(H*.06)+56*1+60);}catch(e){}\n")+len("try{frenzyTitleButton(Math.round(W*.3),Math.round(H*.06)+56*1+60);}catch(e){}\n")
assert 0<i<j and j-i<3000
s=s[:i]+"try{titleMenu(t,QS);}catch(e){reportErr(e);}\n"+s[j:]
rep("  if(Math.floor(t*2)%2===0)txt(isTouch?'TAP TO START':'PRESS ENTER OR CLICK',Math.round(W*.7),H-26,'#ffe14a','center');\n",
    "  if(!isTouch)txt(TTX(L3('ENTER: STORY  ·  F: FRENZY','INVIO: STORIA  ·  F: FRENESIA','INTRO: HISTORIA  ·  F: FRENESÍ')),Math.round(W*.7),H-26,'#ffe14a','center',7,'#000');\n")
rep("if(S.mode==='title'&&frenzyHit(e)){startFrenzy();return;}","if(S.mode==='title'&&titleTap(e))return;\n  if(S.mode==='over'&&overTap(e))return;")
rep("if(done&&Math.floor(t*2)%2===0)txt(G&&G.frenzy?TTX(isTouch?L3('TAP TO PLAY AGAIN','TOCCA PER RIGIOCARE','TOCA PARA JUGAR OTRA VEZ'):L3('ENTER TO PLAY AGAIN','INVIO PER RIGIOCARE','INTRO PARA JUGAR OTRA VEZ')):",
    "if(done&&G&&G.frenzy)frenzyOverButtons(cx,H-36);if(done&&Math.floor(t*2)%2===0)txt(G&&G.frenzy?TTX(isTouch?'':L3('ENTER: PLAY AGAIN  ·  B: BASTION','INVIO: RIGIOCA  ·  B: BALUARDO','INTRO: OTRA VEZ  ·  B: BALUARTE')):")
rep("if(S.mode==='title'&&e.code==='KeyF'){startFrenzy();return;}","if(S.mode==='title'&&e.code==='KeyF'){startFrenzy();return;}\n  if(S.mode==='over'&&G&&G.frenzy&&(e.code==='KeyB'||e.code==='Escape')&&performance.now()-(S.overT0||0)>1500){FADE=.8;enterHub();return;}")
rep("const STATV=163;","const STATV=164;")
open(F,'w').write(s);print('v164 ok')
