// Draws the 1200x630 link-preview image from the game sprites: ./build.sh, then node tools/og_image.js -> build/og.png (save as worker/www/og.jpg)
const {chromium}=require('playwright');(async()=>{const b=await chromium.launch({executablePath:'/opt/pw-browsers/chromium'});
const p=await b.newPage({viewport:{width:1300,height:700}});
await p.goto('file://'+require('path').resolve(__dirname,'../build/tw.html'));await p.waitForTimeout(2500);
const font=require('fs').readFileSync(require('path').resolve(__dirname,'../worker/www/fonts')+'/silkscreen-latin-700-normal.woff2').toString('base64');
const font4=require('fs').readFileSync(require('path').resolve(__dirname,'../worker/www/fonts')+'/silkscreen-latin-400-normal.woff2').toString('base64');
const data=await p.evaluate(async([font,font4])=>{
 const ff=new FontFace('SilkB','url(data:font/woff2;base64,'+font+')');await ff.load();document.fonts.add(ff);
 const f4=new FontFace('Silk','url(data:font/woff2;base64,'+font4+')');await f4.load();document.fonts.add(f4);
 const S=__T.SPR,W=1200,H=630,c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');g.imageSmoothingEnabled=false;
 let seed=7;const R=()=>(seed=(seed*16807)%2147483647)/2147483647;
 // sky
 let gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'#0c0612');gr.addColorStop(.45,'#2a0a1e');gr.addColorStop(.75,'#6a1020');gr.addColorStop(1,'#1a0408');g.fillStyle=gr;g.fillRect(0,0,W,H);
 // stars
 for(let i=0;i<140;i++){g.fillStyle='rgba(255,240,220,'+(0.2+R()*0.6)+')';const s=R()<.15?3:2;g.fillRect(Math.floor(R()*W),Math.floor(R()*H*.5),s,s);}
 // blood moon (pixel steps)
 const mx=860,my=300,mr=190;for(let r=mr+60;r>mr;r-=6){g.fillStyle='rgba(200,30,40,'+(0.05)+')';g.beginPath();g.arc(mx,my,r,0,7);g.fill();}
 for(let y=-mr;y<mr;y+=6){const w=Math.floor(Math.sqrt(mr*mr-y*y)/6)*6;const t=(y+mr)/(2*mr);g.fillStyle=t<.5?'#e8443a':t<.75?'#c92a2e':'#9a1624';g.fillRect(mx-w,my+y,w*2,6);}
 // crater spots
 g.fillStyle='rgba(120,10,20,.45)';[[-60,-80,30],[50,-20,22],[-20,60,40],[90,90,18]].forEach(([x,y,r])=>{g.beginPath();g.arc(mx+x,my+y,r,0,7);g.fill();});
 // far hills
 const hills=(base,amp,col,step)=>{g.fillStyle=col;for(let x=0;x<W;x+=step){const h=base-Math.abs(Math.sin(x*0.004+amp)*60)-Math.sin(x*0.013)*18;g.fillRect(x,h,step,H-h);}};
 hills(470,1.3,'#3a0c1c',6);hills(520,2.2,'#240814',6);
 // the tower: stacked tiers of filth, lit windows
 const tx=860;let ty=600;const tiers=7;for(let i=0;i<tiers;i++){const w=210-i*20,h=62-i*2;const x=tx-w/2;ty-=h;
   g.fillStyle='#120609';g.fillRect(x-4,ty,w+8,h);g.fillStyle='#2c1410';g.fillRect(x,ty+4,w,h-4);g.fillStyle='#3e1e14';g.fillRect(x,ty+4,w,6);
   for(let k=0;k<w/14;k++){if(R()<.25)continue;g.fillStyle='#4a2418';g.fillRect(x+k*14+(i%2)*6,ty+16+((k*7)%3)*8,8,6);}
   for(let k=0;k<3;k++){const wx=x+20+R()*(w-40),wy=ty+20+R()*(h-36);g.fillStyle='#ffd23f';g.fillRect(Math.round(wx/4)*4,Math.round(wy/4)*4,8,10);g.fillStyle='rgba(255,210,63,.18)';g.fillRect(Math.round(wx/4)*4-6,Math.round(wy/4)*4-6,20,22);}
   // drips
   for(let k=0;k<4;k++){const dx=x+R()*w;g.fillStyle='#3a1a10';g.fillRect(Math.round(dx/4)*4,ty+h,6,8+R()*18);}
 }
 // the queen on top, glowing
 const q=S.boss[6][0],qs=4,qw=q.width*qs,qh=q.height*qs,qx=tx-qw/2,qy=ty-qh+18;
 g.save();g.shadowColor='#ff2a2a';g.shadowBlur=40;g.drawImage(q,qx,qy,qw,qh);g.restore();g.drawImage(q,qx,qy,qw,qh);
 // flying hens
 [[1080,150,2,2],[590,300,2.2,0],[1110,360,1.8,3]].forEach(([x,y,s,i])=>{const h=S.boss[i][0];g.globalAlpha=.9;g.drawImage(h,x,y,h.width*s,h.height*s);g.globalAlpha=1;});
 // ground
 g.fillStyle='#0a0306';g.fillRect(0,560,W,70);for(let x=0;x<W;x+=8){g.fillRect(x,552-(Math.sin(x*.05)*4+R()*6),8,12);}
 // feather / egg barrage from the queen towards the hero
 for(let i=0;i<80;i++){const a=Math.PI*0.75+(R()-.5)*1.0,d=120+R()*520,x=tx+Math.cos(a)*d,y=qy+60-Math.sin(a)*-d*0.6;if(x<330&&y>300)continue;
   g.fillStyle=R()<.5?'#ff4a5a':'#fff0a0';g.fillRect(Math.round(x),Math.round(y),6,6);g.fillStyle='rgba(255,74,90,.25)';g.fillRect(Math.round(x)-3,Math.round(y)-3,12,12);}
 // poops crawling in the foreground right
 const pk=Object.keys(S.poop);[['big',980,470,5],['spitter',1090,500,4.5],['roller',880,505,4],['gas',760,500,4]].forEach(([k,x,y,s])=>{let im=S.poop[k];im=Array.isArray(im)?im[0]:im;if(!im||!im.width)return;
   g.save();g.shadowColor='rgba(0,0,0,.8)';g.shadowBlur=10;g.drawImage(im,x,y,im.width*s,im.height*s);g.restore();});
 // hero, huge, foreground left, with muzzle flash
 const j=S.jan[0],js=11,jw=j.width*js,jh=j.height*js,jx=150,jy=630-jh-6;
 g.fillStyle='rgba(0,0,0,.5)';g.beginPath();g.ellipse(jx+jw/2,624,jw*.45,14,0,0,7);g.fill();
 g.save();g.shadowColor='rgba(255,220,180,.35)';g.shadowBlur=30;g.drawImage(j,jx,jy,jw,jh);g.restore();
 // toilet-paper shots flying right
 for(let i=0;i<9;i++){const x=jx+jw+10+i*58,y=jy+jh*.5-i*16+(i%2)*10;g.fillStyle='#f4f1ea';g.fillRect(x,y,22,10);g.fillStyle='#c8c4b4';g.fillRect(x,y+8,22,2);g.fillStyle='rgba(244,241,234,.25)';g.fillRect(x-18,y+2,18,6);}
 // vignette
 const vg=g.createRadialGradient(W/2,H/2,H*.35,W/2,H/2,H*.95);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,.7)');g.fillStyle=vg;g.fillRect(0,0,W,H);
 // title block
 const T=(s,x,y,size,fill,outline,ow,font)=>{g.font=size+'px '+(font||'SilkB');g.lineJoin='miter';g.textBaseline='top';g.lineWidth=ow;g.strokeStyle=outline;g.strokeText(s,x,y);g.fillStyle=fill;g.fillText(s,x,y);};
 g.fillStyle='rgba(0,0,0,.55)';g.font='92px SilkB';
 T('TOWER',48,30+8,92,'#000','#000',18);T('TOWER',44,30,92,'#f6f4ee','#2a0610',14);
 T('OF POOP',48,128+8,92,'#000','#000',18);
 const tg=g.createLinearGradient(0,128,0,220);tg.addColorStop(0,'#ffe680');tg.addColorStop(1,'#d89a2a');T('OF POOP',44,128,92,tg,'#3a1a08',14);
 for(let i=0;i<9;i++){const x=70+i*52+((i*37)%20),l=10+((i*53)%34);g.fillStyle='#5a2a10';g.fillRect(x,214,10,l);g.fillRect(x+2,214+l,6,6);g.fillStyle='#8a4a1c';g.fillRect(x+2,214,3,l-4);}
 // tagline ribbon
 g.fillStyle='#a01f2f';g.fillRect(44,238,520,46);g.fillStyle='#d8343e';g.fillRect(44,238,520,6);g.fillStyle='#5a0a14';g.fillRect(44,278,520,6);
 T('IT LOOKS CUTE. IT ISN\'T.',62,246,30,'#fff4e8','#3a0610',5);
 // badge bottom right
 g.fillStyle='rgba(10,4,8,.85)';g.fillRect(W-470,H-70,440,46);g.strokeStyle='#ffd23f';g.lineWidth=3;g.strokeRect(W-470,H-70,440,46);
 T('PLAY FREE  ▸  BROWSER & MOBILE',W-452,H-58,18,'#ffd23f','#000',3,'SilkB');
 return c.toDataURL('image/png');},[font,font4]);
require('fs').writeFileSync(require('path').resolve(__dirname,'../build/og.png'),Buffer.from(data.split(',')[1],'base64'));await b.close();})();
