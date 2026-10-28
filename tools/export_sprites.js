// Exports every game sprite as PNG at native size + manifest.csv into build/sprites (for PixelLab).
// Usage: ./build.sh && node tools/export_sprites.js && python3 tools/sprite_previews.py build/sprites
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage();await p.goto('file://'+require('path').resolve(__dirname,'../build/tw.html'));await p.waitForTimeout(2500);
const out=await p.evaluate(()=>{const T=__T,S=T.SPR,R=[];const isC=v=>v&&v.width&&v.getContext;
 const slug=s=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 const add=(dir,name,frames,note)=>{frames=(Array.isArray(frames)?frames:[frames]).filter(isC);if(!frames.length)return;
   // dedupe identical frames (some sprites repeat frame 0)
   const urls=[];const seen=new Set();for(const f of frames){const u=f.toDataURL();if(seen.has(u))continue;seen.add(u);urls.push(u);}
   R.push({dir,name:slug(name),label:name,w:frames[0].width,h:frames[0].height,frames:urls,note:note||''});};
 add('characters','sgt-two-ply',S.jan,'player (Two-Ply), walk frames');if(S.janBack)add('characters','sgt-two-ply-back',S.janBack,'title screen, seen from behind');
 for(const c of T.CHARS){const id=c.id;if(id==='two')continue;let f=[];if(id==='bristle'||id==='wipe')f=[T.charArt(id,0),T.charArt(id,1)];else if(S.poop[id])f=S.poop[id].slice(0,2);add('characters',c.name||id,f,'playable: '+id);}
 T.BOSSDEFS.forEach((d,i)=>{const fr=S.boss[i];if(!fr||(i>=7&&i<=20))return;const dir=i<=6?'hens':d.fb?'fallen-brothers':d.mini?'minibosses':(d.art==='heart'||d.art==='primegg')?'final':'bosses';add(dir,String(i).padStart(2,'0')+'-'+d.name,fr,(d.art||'')+(d.sub?' — '+d.sub:''));});
 for(const k in S.poop)add('enemies',k,S.poop[k]);
 for(const k of ['sponge','plunger','toiletNPC','locker'])add('npcs',k,S[k]);
 for(const k in S.item)add('items',k,S.item[k]);for(const k in S.wicon)add('weapons',k,S.wicon[k]);for(const k in S.pick)add('pickups',k,S.pick[k]);
 for(const k in S.chest)add('props',k+'-chest',S.chest[k]);for(const k in S.act)add('props',k,S.act[k]);
 for(const k of ['ball','slime','soapball','fresh','bub','blob','bigblob','egg','soap','heart','foam','shadow'])add('fx',k,S[k]);
 for(const k in S.pud)add('fx','puddle-'+k,S.pud[k]);
 return R;});
const root=require('path').resolve(__dirname,'../build/sprites');fs.rmSync(root,{recursive:true,force:true});const man=[];
for(const s of out){const d=path.join(root,s.dir);fs.mkdirSync(d,{recursive:true});s.frames.forEach((u,i)=>{const n=s.name+(s.frames.length>1?'_f'+(i+1):'')+'.png';fs.writeFileSync(path.join(d,n),Buffer.from(u.split(',')[1],'base64'));});
 man.push([s.dir,s.name,s.label,s.w+'x'+s.h,s.frames.length,s.note]);}
fs.writeFileSync(path.join(root,'manifest.csv'),'folder,file,name,size_px,frames,note\n'+man.map(r=>r.map(x=>'"'+String(x).replace(/"/g,'""')+'"').join(',')).join('\n')+'\n');
console.log(out.length,'sprites',man.reduce((a,r)=>a+r[4],0),'frames');await b.close();})();
