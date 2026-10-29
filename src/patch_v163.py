F='../build/tower-of-poop.html';s=open(F).read()
def rep(a,b,cnt=1):
    global s
    n=s.count(a);assert n==cnt,(a[:70],n);s=s.replace(a,b)
fr=open('frenzy.js').read()
rep('function playScene(',fr+'function playScene(')
# the arena runs the frenzy instead of the waves
rep("if(G.surv)survTick(dt);","if(G.surv){if(G.frenzy)frenzyTick(dt);else survTick(dt);}")
rep("G.surv?'WAVE '+G.wave:(G.rush?","G.surv?(G.frenzy?frenzyHud():'WAVE '+G.wave):(G.rush?")
# end of run: corn and best score, and the right words on the last screen
rep("if(G.surv){G.survRec=","if(G.frenzy)frenzyEnd();else if(G.surv){G.survRec=")
rep("txt('FLUSHED!',144,64,'#ff4a5a','center',16);txt(G.char.name+' is out of sheets',144,86,'#c8b090','center');",
    "if(G.frenzy&&G.frenzy.win){txt(L3('TIME!','TEMPO!','¡TIEMPO!'),144,64,'#ffe14a','center',16);txt(L3('You survived the frenzy','Sei sopravvissuto alla frenesia','Sobreviviste al frenesí'),144,86,'#c8b090','center');}else{txt('FLUSHED!',144,64,'#ff4a5a','center',16);txt(G.char.name+' is out of sheets',144,86,'#c8b090','center');}")
rep("txt(G.surv?'Survived to  WAVE '+G.wave+(G.survRec?'  NEW BEST!':''):",
    "txt(G.frenzy?TTX((G.frenzy.win?L3('SURVIVED 3:00','SOPRAVVISSUTO 3:00','SOBREVIVISTE 3:00'):L3('Lasted ','Resistito ','Aguantaste ')+fmtTime(G.frenzy.el))+(G.frRec?L3('  NEW BEST!','  NUOVO RECORD!','  ¡NUEVO RÉCORD!'):'')):G.surv?'Survived to  WAVE '+G.wave+(G.survRec?'  NEW BEST!':''):")
rep("const where=G.surv?","const where=G.frenzy?TTX(L3('Frenzy · ','Frenesia · ','Frenesí · ')+fmtTime(G.frenzy.el)):G.surv?")
rep("txt(isTouch?(it?'TOCCA PER TORNARE AL BALUARDO':T_('TAP TO RETURN TO THE LAST BASTION')):(it?'INVIO PER TORNARE AL BALUARDO':T_('ENTER TO RETURN TO THE LAST BASTION')),cx,H-14,",
    "txt(G&&G.frenzy?TTX(isTouch?L3('TAP TO PLAY AGAIN','TOCCA PER RIGIOCARE','TOCA PARA JUGAR OTRA VEZ'):L3('ENTER TO PLAY AGAIN','INVIO PER RIGIOCARE','INTRO PARA JUGAR OTRA VEZ')):isTouch?(it?'TOCCA PER TORNARE AL BALUARDO':T_('TAP TO RETURN TO THE LAST BASTION')):(it?'INVIO PER TORNARE AL BALUARDO':T_('ENTER TO RETURN TO THE LAST BASTION')),cx,H-14,")
# play again straight into a new frenzy
rep("function newGame(){if(S.mode==='over'&&performance.now()-(S.overT0||0)<1500)return;","function newGame(){if(S.mode==='over'&&performance.now()-(S.overT0||0)<1500)return;if(S.mode==='over'&&G&&G.frenzy){startFrenzy();return;}")
# the button on the title screen, every time the game starts
rep("txt(sub,cx,y0+17,'#ecd078','center',8,'#1a0a10');}catch(e){}","txt(sub,cx,y0+17,'#ecd078','center',8,'#1a0a10');}catch(e){}\n  try{frenzyTitleButton(Math.round(W*.3),Math.round(H*.06)+56*1+60);}catch(e){}")
rep("if(S.mode==='hub'&&hubPad()){openPad();return;}\n  if(['map','scene','bossintro'].includes(S.mode)){advanceStory();return;}","if(S.mode==='hub'&&hubPad()){openPad();return;}\n  if(S.mode==='title'&&frenzyHit(e)){startFrenzy();return;}\n  if(['map','scene','bossintro'].includes(S.mode)){advanceStory();return;}")
rep("if(S.mode==='title'||S.mode==='over'||S.mode==='splash'||S.mode==='cine'||S.mode==='boot'){if(e.code==='Enter'","if(S.mode==='title'&&e.code==='KeyF'){startFrenzy();return;}\n  if(S.mode==='title'||S.mode==='over'||S.mode==='splash'||S.mode==='cine'||S.mode==='boot'){if(e.code==='Enter'")
rep("function statMode(){return G.daily?'daily':","function statMode(){return G.frenzy?'frenzy':G.daily?'daily':")
rep("const STATV=162;","const STATV=163;")
open(F,'w').write(s);print('v163 ok')
s=open(F).read()
def rep2(a,b,cnt=1):
    global s
    n=s.count(a);assert n==cnt,(a[:70],n);s=s.replace(a,b)
# a won frenzy gets its own headline instead of the tombstone
rep2("const L=[[it?'QUI SI È SROTOLATO':T_('HERE UNROLLED'),12,'#2a1a10'],[tr(G.char.name),10,'#5a2a14'],['',6],\n    [it?'ELIMINATO DA':T_('TAKEN OUT BY'),8,'#7a6a5a'],[by,11,'#a8202a'],",
 "const FW=G.frenzy&&G.frenzy.win;const L=[[FW?L3('STILL STANDING','ANCORA IN PIEDI','SIGUE EN PIE'):it?'QUI SI È SROTOLATO':T_('HERE UNROLLED'),12,FW?'#2a6a14':'#2a1a10'],[tr(G.char.name),10,'#5a2a14'],['',6],\n    [FW?L3('SURVIVED','SOPRAVVISSUTO A','SOBREVIVIÓ A'):it?'ELIMINATO DA':T_('TAKEN OUT BY'),8,'#7a6a5a'],[FW?L3('THE FRENZY','LA FRENESIA','EL FRENESÍ'):by,11,FW?'#2a6a14':'#a8202a'],")
open(F,'w').write(s);print('v163 over screen ok')
