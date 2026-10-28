F='../build/tower-of-poop.html';s=open(F).read()
def rep(a,b,cnt=1):
    global s
    n=s.count(a);assert n==cnt,(a[:70],n);s=s.replace(a,b)
at=open('attacks.js').read();st=open('stats.js').read()
rep('function playScene(',at+st+'function playScene(')
# new moves are injected from the rule tick; fallen brothers get phases and new moves too
rep("function bossRuleTick(b,dt){const R=BRULE[bKey(b)];if(b.mini||b.fb)return;","function bossRuleTick(b,dt){const R=BRULE[bKey(b)];if(b.mini&&!b.fb)return;try{atkInject(b,dt);}catch(e){}if(b.fb){b.prev=b.state;return;}")
rep("function bossPhase(b,ph){const R=BRULE[bKey(b)];","function bossPhase(b,ph){if(b.fb){b.smMul=1+.12*(ph-1);if(ph===3)bSummon(b,'ghost',1);return;}const R=BRULE[bKey(b)];")
rep("  if(!b.mini){if(b.immUntil&&G.time<b.immUntil)","  if(!b.mini||b.fb){if(b.immUntil&&G.time<b.immUntil)")
# the Queen's Mirror turns left into right
rep("  let ml=Math.hypot(mx,my);if(ml>1){mx/=ml;my/=ml;ml=1;}","  if(G.mirrorCtl>G.time)mx=-mx;\n  let ml=Math.hypot(mx,my);if(ml>1){mx/=ml;my/=ml;ml=1;}",2)
# the act on the title screen, every time the game starts
rep("  txt('STARRING  SGT. TWO-PLY',cx,Math.round(H*.06)+60,'#ffb0a0','center',8,'#2a0a14');",
"  txt('STARRING  SGT. TWO-PLY',cx,Math.round(H*.06)+60,'#ffb0a0','center',8,'#2a0a14');\n  try{const PRO=!(SV.pages||[]).length&&!SV.deaths&&!SV.beaten&&!(SV.maxL>1),A=PRO?0:storyAct(),y0=Math.round(H*.06)+80,pl=.75+.25*Math.sin(t*2.2);const lab=PRO?L3('PROLOGUE','PROLOGO','PRÓLOGO'):TTX(L3('ACT ','ATTO ','ACTO ')+(A>=2?'II':'I')),sub=PRO?L3('THE GOLDEN HEN','LA GALLINA D\\'ORO','LA GALLINA DE ORO'):A>=2?L3(\"THE QUEEN'S DIARY\",'IL DIARIO DELLA REGINA','EL DIARIO DE LA REINA'):L3(\"THE GENERAL'S DIARY\",'IL DIARIO DEL GENERALE','EL DIARIO DEL GENERAL');\n    rect(ctx,cx-66,y0-6,132,34,'rgba(16,3,8,.78)');rect(ctx,cx-66,y0-6,132,1,'#a01f2f');rect(ctx,cx-66,y0+27,132,1,'#a01f2f');ctx.globalAlpha=pl;txt(lab,cx,y0-2,PRO?'#ecd078':A>=2?'#c8a0ff':'#ff5a4a','center',16,'#2a0a14');ctx.globalAlpha=1;txt(sub,cx,y0+17,'#ecd078','center',8,'#1a0a10');}catch(e){}")
# stats hooks
rep("function bossFinish(){const b=G.boss;G.boss=null;","function bossFinish(){const b=G.boss;G.boss=null;try{if(G.statB&&b&&!b.mini)G.statB.push(String(b.name||''));}catch(e){}")
rep("function makeRecap(win){if(!G||G.hub||G.train)return null;","function makeRecap(win){if(!G||G.hub||G.train)return null;try{statEnd(win);}catch(e){}")
rep("function startRun(L,opt){","{const _sr0=startRun;startRun=function(L,opt){const r=_sr0(L,opt);try{statStart();}catch(e){}return r;};}\nfunction startRun(L,opt){")
open(F,'w').write(s);print('v159 ok')
