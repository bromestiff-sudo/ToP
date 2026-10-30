// Link-preview image (1200x630) from the real title screen, with Two-Ply bigger and closer to the tower.
// Usage: ./build.sh && node tools/og_image.js 2.4 -4 0   (hero scale, hero x, hero y), then python3 tools/og_crop.py  -> build/og-raw.png, then crop with tools/og_crop.py
const fs=require('fs'),path=require('path');
const OG=path.resolve(__dirname,'../build/tw_og.html');{let s=fs.readFileSync(path.resolve(__dirname,'../build/tw.html'),'utf8');
 const a="const sc=Math.max(1,Math.round(h/150)),hx=Math.round(B.cx1*.78),hy=B.ctop-24*sc+2*sc;";
 if(!s.includes(a))throw new Error('title hero line not found');
 s=s.replace(a,"const sc=Math.max(1,Math.round(h/150))*(window.__OGS||1),hx=Math.round(window.__OGX!=null?B.cx1+window.__OGX*Math.max(1,Math.round(h/150)):B.cx1*.78),hy=B.ctop-24*sc+2*sc+(window.__OGY||0);");
 if(!s.includes('  S.tBtns = [];'))throw new Error('title menu line not found');
 s=s.replace('  S.tBtns = [];','  if(window.__OGM)return;S.tBtns = [];');
 // use the bundled Silkscreen font (the Google Fonts link is not reachable everywhere)
 const fd=path.resolve(__dirname,'../worker/www/fonts');s=s.replace('</title>','</title><style>'+fs.readdirSync(fd).filter(f=>/silkscreen.*\.woff2$/.test(f)).map(f=>"@font-face{font-family:'Silkscreen';font-weight:"+(f.includes('700')?700:400)+";src:url(data:font/woff2;base64,"+fs.readFileSync(path.join(fd,f)).toString('base64')+") format('woff2')}").join('')+'</style>');
 fs.writeFileSync(OG,s);}
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const [S,X,Y,T]=process.argv.slice(2).map(Number);
const p=await b.newPage({viewport:{width:960,height:600},deviceScaleFactor:2});
await p.goto('file://'+OG);await p.waitForTimeout(800);await p.evaluate(()=>{localStorage.clear();localStorage.setItem('top_lang','it')});await p.reload();await p.waitForTimeout(1500);
await p.evaluate(([S,X,Y,T])=>{window.__OGS=S;window.__OGX=X;window.__OGM=1;window.__OGY=Y;window.__OGT=T||1;},[S,X,Y,T]);
await p.mouse.click(480,300);await p.waitForTimeout(3500);await p.waitForTimeout(2500);
const c=await p.$('canvas');await c.screenshot({path:require('path').resolve(__dirname,'../build/og-raw.png')});await b.close();})();
