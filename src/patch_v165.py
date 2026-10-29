F='../build/tower-of-poop.html';s=open(F).read()
def rep(a,b,cnt=1):
    global s
    n=s.count(a);assert n==cnt,(a[:70],n);s=s.replace(a,b)
rep('function playScene(',open('titlesky.js').read()+'function playScene(')
# the backdrop depends on the act
rep("function titleBackdrop(w,h){const [c,g]=mk(w,h),hz=Math.round(h*.66);\n  const sky=['#140a1e',","function titleBackdrop(w,h,act){act=act||3;const [c,g]=mk(w,h),hz=Math.round(h*.66);\n  const sky=titleSky(act)||['#140a1e',")
rep("const tx=Math.round(w*.7),sr=Math.round(h*.17),sy=hz-Math.round(h*.06);\n  for(let y=-sr;y<=sr;y++)","const tx=Math.round(w*.7),sr=Math.round(h*.17),sy=hz-Math.round(h*.06);\n  if(!titleSun(g,act,w,h,hz,tx))for(let y=-sr;y<=sr;y++)")
rep("  // haze over the horizon\n","  titleTowerLight(g,act,h,{tx,top,hz});\n  // haze over the horizon\n")
rep("if(!TBG||TBG.w!==w||TBG.h!==h)TBG=Object.assign({w,h},titleBackdrop(w,h));","{const A=storyAct();if(!TBG||TBG.w!==w||TBG.h!==h||TBG.act!==A)TBG=Object.assign({w,h,act:A},titleBackdrop(w,h,A));}",2)
rep("function titleBack(B,t,QS,w,h){if(!QS)return;const tx=B.tx;","function titleBack(B,t,QS,w,h){if(B.act>=3&&QS!==5)titleAura(B,t,h);if(!QS)return;const tx=B.tx;")
# the Queen's words and the flash of her diary move away from the menu, to the bottom right
rep("livingText(l,Math.round(w*.3-lw/2),Math.round(h*.06)+76+j*15,10,'#c070f0',t,j*30+i*7,1.3,999);","livingText(l,Math.round(w*.7-lw/2),Math.round(h*.7)-lines.length*15+j*15,10,'#c070f0',t,j*30+i*7,1.3,999);")
rep("waveText(LG==='it'?'IL DIARIO DELLA REGINA':T_('THE QUEEN\\'S DIARY'),Math.round(w*.3),Math.round(h*.06)+60,9,","waveText(LG==='it'?'IL DIARIO DELLA REGINA':T_('THE QUEEN\\'S DIARY'),Math.round(w*.7),Math.round(h*.75),9,")
rep("const STATV=164;","const STATV=165;")
open(F,'w').write(s);print('v165 ok')
