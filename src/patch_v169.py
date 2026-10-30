# v169: the new opening song (Suno) plays on the title screen instead of the synthesized tune.
F = '../build/tower-of-poop.html'; s = open(F).read()
def rep(a, b, cnt=1):
    global s
    n = s.count(a); assert n == cnt, (a[:70], n); s = s.replace(a, b)
rep("function playScene(", open('opening.js').read() + "\nfunction playScene(")
# the synthesized title tune steps aside while the opening plays
rep("function songFor(){const m=S.mode;", "function songFor(){const m=S.mode;if(openWant())return null;")
rep("try{musicTick();draw();}", "try{musicTick();try{openTick();}catch(e){}draw();}")
rep("const STATV=168;", "const STATV=169;")
open(F, 'w').write(s)
