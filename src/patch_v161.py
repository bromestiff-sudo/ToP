F='../build/tower-of-poop.html';s=open(F).read()
def rep(a,b,cnt=1):
    global s
    n=s.count(a);assert n==cnt,(a[:70],n);s=s.replace(a,b)
# co-op: never trust numbers from the other side
rep("if(m.t==='in'){if(Q.tpT","if(m.t==='in'){const fin=Number.isFinite;if(!fin(m.x)||!fin(m.y)||Math.abs(m.x)>1e5||Math.abs(m.y)>1e5)return;m.vx=fin(m.vx)?clamp(m.vx,-500,500):0;m.vy=fin(m.vy)?clamp(m.vy,-500,500):0;m.ax=fin(m.ax)?m.ax:0;m.ay=fin(m.ay)?m.ay:0;if(m.ts!=null&&!fin(m.ts))m.ts=null;if(Q.tpT")
rep("else if(m.t==='soap'){if(!Q.down&&Q._so>0){","else if(m.t==='soap'){if(!Number.isFinite(m.tx)||!Number.isFinite(m.ty))return;if(!Q.down&&Q._so>0){")
rep("if(m.t==='corn'){SV.credits+=m.v;saveSV();return;}","if(m.t==='corn'){const v=Math.floor(Number(m.v));if(!(v>=0&&v<=500))return;SV.credits=(Number(SV.credits)||0)+v;saveSV();return;}")
rep("if(m.t==='tp'){G.P.x=m.x;G.P.y=m.y;","if(m.t==='tp'){if(!Number.isFinite(m.x)||!Number.isFinite(m.y))return;G.P.x=m.x;G.P.y=m.y;")
# daily board: ignore impossible scores, and never send one
rep("const docs=q.docs.map(d=>({id:d.id,...d.data()}));","const docs=q.docs.map(d=>({id:d.id,...d.data()})).filter(d=>typeof d.score==='number'&&Number.isFinite(d.score)&&d.score>=0&&d.score<=DAILY_MAX);")
rep("await h.db.doc('daily/'+h.id).set({key:G.daily,score:sc,","if(!(sc>=0&&sc<=DAILY_MAX))return;await h.db.doc('daily/'+h.id).set({key:G.daily,score:sc,")
rep("async function dailyFetch(){","const DAILY_MAX=3e6;\nasync function dailyFetch(){")
# the darkness reuses one canvas instead of making a new one every frame
rep("const [c,g]=mk(W,H);g.fillStyle='rgba(4,2,8,'+dk+')';","if(!window.__DK||__DK[0].width!==W||__DK[0].height!==H)window.__DK=mk(W,H);const [c,g]=__DK;g.globalCompositeOperation='source-over';g.clearRect(0,0,W,H);g.fillStyle='rgba(4,2,8,'+dk+')';")
# players' errors reach the stats page (anonymous: message and line only)
rep("function reportErr(err){console.error(err);","function reportErr(err){console.error(err);try{statErr(err);}catch(e){}")
rep("const STATV=160;","const STATV=161;\nconst ERRSENT=new Set();\nfunction statErr(err){if(ERRSENT.size>=8||!statOnWorker())return;const msg=String(err&&err.message||err||'?').slice(0,90),st=String(err&&err.stack||'').split('\\n').find(l=>/:\\d+:\\d+/.test(l))||'',at=(st.match(/:(\\d+:\\d+)\\)?\\s*$/)||[])[1]||'';const key=msg+at;if(ERRSENT.has(key))return;ERRSENT.add(key);statPost({t:'err',msg,at});}\naddEventListener('error',e=>{try{statErr(e.error||e.message);}catch(_){}});\naddEventListener('unhandledrejection',e=>{try{statErr(e.reason);}catch(_){}});")
open(F,'w').write(s);print('v161 ok')
