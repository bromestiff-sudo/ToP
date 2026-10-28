// the X share link points to the address the game is served from, and is empty-safe elsewhere
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');(async()=>{const b=await chromium.launch({executablePath:process.env.CHROMIUM||undefined});
const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
const html=fs.readFileSync(path.resolve(__dirname,'../build/tw.html'),'utf8');
await p.route('https://game.example/**',r=>r.fulfill({body:html,contentType:'text/html'}));
await p.goto('https://game.example/');await p.waitForTimeout(1500);
console.log('web:',await p.evaluate(()=>{const a=[...document.querySelectorAll('a')].find(x=>/x\.com\/intent/.test(x.href));return a&&decodeURIComponent(a.href).split('&url=')[1];}));
await p.goto('file://'+path.resolve(__dirname,'../build/tw.html'));await p.waitForTimeout(1500);
console.log('file:',await p.evaluate(()=>{const a=[...document.querySelectorAll('a')].find(x=>/x\.com\/intent/.test(x.href));return a&&(a.href.includes('&url=')?'has url':'no url');}));
console.log(errs);await b.close();})();
