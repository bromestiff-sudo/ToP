// ---------- the squad: every playable roll has a gun of its own and one thing only it can do ----------
const CHARW={two:'spray',bristle:'scatter',duck:'bouncer',wipe:'washer',chick:'foam'};
function charStart(){if(!G||!G.char)return;const id=CHARW[G.char.id];if(id&&id!=='spray'){const w=WEAPONS.find(x=>x.id===id);if(w){if(!G.owned.includes(id))G.owned.push(id);if(w.ammo||w.cap)G.ammo[id]=ammoMax(w);G.wpn=w;}}}
function charDash(){const c=G&&G.char&&G.char.id,P=G.P;if(c==='duck'){clearShots(P.x,P.y-3,38);addRing(P.x,P.y-3,38,'#ffd23f',.3);SFX.squeak();}else if(c==='chick'){G.peck=3;popText(P.x,P.y-24,L3('PECK!','BECCATA!','¡PICOTAZO!'),'#ffe66a');}}
function charRoom(){if(G&&G.char&&G.char.id==='two'&&!G.train)G.ply=1;}
function charTick(dt){if(!G||G.hub||!G.char)return;const P=G.P;
  if(G.char.id==='wipe'){const mv=Math.hypot(P.x-(G.lpx||P.x),P.y-(G.lpy||P.y));G.lpx=P.x;G.lpy=P.y;G.still=mv<.2?(G.still||0)+dt:0;
    if(G.still>.7){for(const e of G.enemies)if(!e.dead&&Math.hypot(e.x-P.x,e.y-P.y)<92)e.slowT=Math.max(e.slowT||0,.25);if(Math.random()<dt*5)G.parts.push({x:P.x+rnd(-30,30),y:P.y-10+rnd(-20,10),vx:0,vy:-12,life:.8,col:'#bfeeff',size:1});}}}
function charDrawFx(){if(!G||G.hub||!G.char)return;const P=G.P;
  if(G.char.id==='two'&&G.ply){ctx.globalAlpha=.25+.1*Math.sin(G.time*5);ctx.strokeStyle='#f4f1ea';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(P.x,P.y-6,9,11,0,0,TAU);ctx.stroke();ctx.globalAlpha=1;}
  if(G.char.id==='wipe'&&G.still>.7){ctx.globalAlpha=.12;ctx.strokeStyle='#bfeeff';ctx.beginPath();ctx.arc(P.x,P.y,92,0,TAU);ctx.stroke();ctx.globalAlpha=1;}}
function charArt(id,fr){const [c,g]=mk(18,22),O='#120806',b=fr?1:0,R=(x,y,w,h,col)=>{g.fillStyle=col;g.fillRect(x,y,w,h);};
  if(id==='wipe'){// a folded wet wipe with a tired bugle
    R(3,4+b,12,16,O);R(4,5+b,10,14,'#e8f0f4');R(4,5+b,10,2,'#ffffff');R(4,12+b,10,1,'#b8c8d4');R(4,16+b,10,1,'#b8c8d4');R(5,1+b,8,4,O);R(6,2+b,6,3,'#3a4a2a');
    R(6,8+b,2,2,O);R(10,8+b,2,2,O);R(7,11+b,4,1,'#7a8a9a');R(13,10+b,5,2,'#e8c040');R(16,9+b,2,4,'#e8c040');R(5,19,2,3,O);R(11,19,2,3,O);if(fr)R(9,20,1,2,'#bfeeff');}
  else{// a scrub brush, wooden back and stiff bristles
    R(2,6+b,14,10,O);R(3,7+b,12,8,'#8a5a30');R(3,7+b,12,2,'#b07a44');R(3,12+b,12,1,'#9aa4ae');for(let k=0;k<6;k++)R(3+k*2,1+b+(k%2),1,5,'#e8dcb0');
    R(5,9+b,2,2,O);R(11,9+b,2,2,O);R(5,8+b,3,1,O);R(10,8+b,3,1,O);for(let k=0;k<7;k++)R(3+k*2,16+b,1,4,'#e8dcb0');R(4,20,2,2,O);R(12,20,2,2,O);}
  return c;}
