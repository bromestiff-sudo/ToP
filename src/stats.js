// ---------- anonymous play stats: no names, no ids, nothing that leads back to a person ----------
const STATV=159;
function statMode(){return G.daily?'daily':G.rush?'rush':G.surv?'surv':G.qm?'qm':G.coop?'coop':'normal';}
function statOnWorker(){try{return /^https?:$/.test(location.protocol)&&!/claude\.ai|claudeusercontent/.test(location.host);}catch(e){return false;}}
function statPost(o){o.v=STATV;o.act=storyAct();o.lang=LG;o.touch=!!isTouch;
  if(statOnWorker()){try{fetch('/api/stats',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(o),keepalive:true}).catch(()=>{});}catch(e){}return;}
  if(o.t!=='end')return;(async()=>{try{const h=await dbh();if(!h)return;const rid=Date.now().toString(36)+Math.random().toString(36).slice(2,8);await h.db.doc('stats/'+rid).set(Object.assign({ts:Date.now()},o));}catch(e){}})();}
function statStart(){if(!G||G.train||G.hub||G.coopGuest)return;G.statT0=Date.now();G.statB=[];statPost({t:'start',mode:statMode(),char:G.char&&G.char.id});}
function statEnd(win){if(!G||G.train||G.hub||G.coopGuest||G.statSent||!G.statT0)return;G.statSent=1;const b=G.boss;
  const cause=win?'':(b&&b.state!=='dying'?String(b.name||'boss'):'room');
  statPost({t:'end',mode:statMode(),char:G.char&&G.char.id,floor:G.floor,win:!!win,cause,bosses:(G.statB||[]).slice(0,20),secs:Math.round((Date.now()-G.statT0)/1000),score:G.score|0,runs:(SV.deaths||0)});}
