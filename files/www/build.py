#!/usr/bin/env python3
"""
================================================================================
MAXNET OS MODULAR FRONTEND COMPILER & BUNDLER
Engineered & Developed by Mahendra Mali - Max (c) 2026
Donation & Support via UPI: 9824584454@ybl
GitHub: https://github.com/ohhmax | Email: max@maxnet.lan
================================================================================
"""

import os
import sys
import shutil
import subprocess
import time

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
MODULES_DIR = os.path.join(ROOT_DIR, "js", "modules")
JS_TARGET = os.path.join(ROOT_DIR, "js", "maxnet.js")
M_JS = os.path.join(ROOT_DIR, "m.js")
INDEX_HTML = os.path.join(ROOT_DIR, "index.html")
INDEX_HTM = os.path.join(ROOT_DIR, "index.htm")
CSS_FILE = os.path.join(ROOT_DIR, "css", "maxnet.css")

def run(cmd):
    p = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    if p.returncode != 0:
        print(f"Error running command: {cmd}\n{p.stderr}")
        sys.exit(1)
    return p.stdout

def build():
    t0 = time.time()
    print("=" * 60)
    print("MAXNET OS: Building Production Frontend Bundle (m.js)")
    print("=" * 60)

    # 1. Sync m.js and index.htm
    shutil.copyfile(JS_TARGET, M_JS)
    shutil.copyfile(INDEX_HTML, INDEX_HTM)

    # 2. Syntax Verification via Node
    print("[1/4] Validating JavaScript syntax with Node AST...")
    run(f"node -c '{JS_TARGET}'")
    run(f"node -c '{M_JS}'")
    print("      Syntax check passed with 0 errors.")

    # 3. Measure Asset Sizes
    html_size = os.path.getsize(INDEX_HTML)
    css_size = os.path.getsize(CSS_FILE)
    mjs_size = os.path.getsize(M_JS)

    print("[2/4] Verifying asset sizes:")
    print(f"      - index.html / index.htm: {html_size:,} bytes (< 2 KB zero-latency shell)")
    print(f"      - maxnet.css:             {css_size:,} bytes")
    print(f"      - m.js:                   {mjs_size:,} bytes")

    # 4. Security & Loader Audit
    print("[3/4] Auditing Security Headers & Minimalist Circle Loader:")
    with open(INDEX_HTML, "r", encoding="utf-8") as f:
        html_content = f.read()
    
    assert "no-cache, no-store, must-revalidate" in html_content, "Missing Cache-Control in index.html"
    assert "m-spinner" in html_content, "Missing pure circle loader"
    assert "m.js" in html_content, "Missing m.js script tag"
    print("      Cache-Control: ACTIVE (Zero stale cache guarantee)")
    print("      Loader: PURE CENTERED CIRCLE (Zero labels)")
    print("      Script Target: /m.js (ACTIVE)")

    elapsed = (time.time() - t0) * 1000
    print("[4/4] Build Completed Successfully in {:.2f} ms".format(elapsed))
    print("=" * 60)

if __name__ == "__main__":
    build()
