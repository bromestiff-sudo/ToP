F='../build/tower-of-poop.html';s=open(F).read()
def rep(a,b,cnt=1):
    global s
    n=s.count(a);assert n==cnt,(a[:70],n);s=s.replace(a,b)
# act III: the first time the OFF LIMITS door opens
rep("    playScene(L2,'OFF LIMITS','BEHIND THE DOOR',()=>qTitleStart(startQueenRun));return;}",
"    const first=!SV.act3&&!SV.qEnd;if(first){SV.act3=1;saveSV();}playScene(L2,first?TTX(L3('ACT III','ATTO III','ACTO III')):'OFF LIMITS',first?L3('THE HEART OF THE TOWER','IL CUORE DELLA TORRE','EL CORAZÓN DE LA TORRE'):'BEHIND THE DOOR',()=>qTitleStart(startQueenRun));return;}")
rep("TTX(L3('ACT ','ATTO ','ACTO ')+(A>=2?'II':'I'))","TTX(L3('ACT ','ATTO ','ACTO ')+(A>=3?'III':A>=2?'II':'I'))")
rep(":A>=2?L3(\"THE QUEEN'S DIARY\",'IL DIARIO DELLA REGINA','EL DIARIO DE LA REINA')",":A>=3?L3('THE HEART OF THE TOWER','IL CUORE DELLA TORRE','EL CORAZÓN DE LA TORRE'):A>=2?L3(\"THE QUEEN'S DIARY\",'IL DIARIO DELLA REGINA','EL DIARIO DE LA REINA')")
rep("txt(lab,cx,y0-2,PRO?'#ecd078':A>=2?'#c8a0ff':'#ff5a4a'","txt(lab,cx,y0-2,PRO?'#ecd078':A>=3?'#ffd23f':A>=2?'#c8a0ff':'#ff5a4a'")
rep("const STATV=159;","const STATV=160;")
open(F,'w').write(s);print('v160 ok')
