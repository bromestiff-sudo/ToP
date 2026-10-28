F='../build/tower-of-poop.html';s=open(F).read()
def rep(a,b,cnt=1):
    global s
    n=s.count(a);assert n==cnt,(a[:70],n);s=s.replace(a,b)
# the game's public address moved to the new Cloudflare account
rep("const GAME_URL='https://tower-of-poop.pages.dev/';","const GAME_URL='https://tower-of-poop.bromestiff.workers.dev/';")
rep("const STATV=161;","const STATV=162;")
open(F,'w').write(s);print('v162 ok')
