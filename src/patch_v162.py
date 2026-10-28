F='../build/tower-of-poop.html';s=open(F).read()
def rep(a,b,cnt=1):
    global s
    n=s.count(a);assert n==cnt,(a[:70],n);s=s.replace(a,b)
# no hard-coded address: on the web the game links to wherever it is served from.
# GAME_URL is only the fallback for copies opened elsewhere (e.g. inside claude.ai); empty = no link.
rep("const GAME_URL='https://tower-of-poop.pages.dev/';","const GAME_URL='';")
rep("+'&url='+encodeURIComponent(GAME_URL);}","+(gameLink()?'&url='+encodeURIComponent(gameLink()):'');}")
rep("function shareHost(){try{if(/^https?:/.test(location.href)&&!/claude\\.ai|claudeusercontent/.test(location.host))return location.host;}catch(e){}return GAME_URL.replace(/^https?:\\/\\//,'').replace(/\\/$/,'');}",
    "function gameLink(){try{if(/^https?:/.test(location.href)&&!/claude\\.ai|claudeusercontent/.test(location.host))return location.origin+'/';}catch(e){}return GAME_URL;}\nfunction shareHost(){return gameLink().replace(/^https?:\\/\\//,'').replace(/\\/$/,'');}")
rep("const STATV=161;","const STATV=162;")
open(F,'w').write(s);print('v162 ok')
