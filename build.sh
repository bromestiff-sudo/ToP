#!/usr/bin/env bash
# Builds Coop of Despair from the sources.
#   ./build.sh            -> build/tower-of-poop.html (the single-file game) + build/tw.html (test build)
#   ./build.sh 162        -> also refreshes worker/www/index.html and the app cache version (v162)
set -e
cd "$(dirname "$0")"
mkdir -p build
cp src/base/base-v150.html build/tower-of-poop.html
cd src
python3 build_imz.py 180 | tail -1
for p in $(ls patch_v15*.py patch_v16*.py patch_v17*.py 2>/dev/null | sort -V); do python3 "$p"; done
cd ..
node -e "const s=require('fs').readFileSync('build/tower-of-poop.html','utf8');let n=0;for(const x of s.match(/<script>([\s\S]*?)<\/script>/g)){try{new Function(x.slice(8,-9));}catch(e){console.log('ERR',e.message);n++}}console.log('syntax errors:',n);process.exit(n?1:0)"
python3 tools/mktw.py
if [ -n "$1" ]; then python3 tools/release.py "$1"; echo "worker/www updated to v$1"; fi
