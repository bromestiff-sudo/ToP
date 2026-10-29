# v167: on the title screen only the buttons start a game; a stray tap does nothing
F='../build/tower-of-poop.html';s=open(F).read()
def rep(a,b,cnt=1):
    global s
    n=s.count(a);assert n==cnt,(a[:60],n);s=s.replace(a,b)
OLD="if(S.mode==='title'||S.mode==='over'||S.mode==='splash'||S.mode==='cine'||S.mode==='boot'){newGame();return;}"
rep(OLD,"if(S.mode==='title')return;if(S.mode==='over'||S.mode==='splash'||S.mode==='cine'||S.mode==='boot'){newGame();return;}",2)
rep("if(S.mode==='title'||S.mode==='over'||S.mode==='splash'||S.mode==='cine'||S.mode==='boot'){if(k!=='pause'",
    "if(S.mode==='title'){b.classList.remove('on');return;}if(S.mode==='over'||S.mode==='splash'||S.mode==='cine'||S.mode==='boot'){if(k!=='pause'")
rep("const STATV=166;","const STATV=167;")
open(F,'w').write(s)
