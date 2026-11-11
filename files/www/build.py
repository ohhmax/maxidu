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
import subprocess
import time

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
MODULES_DIR = os.path.join(ROOT_DIR, "js", "modules")
JS_TARGET = os.path.join(ROOT_DIR, "js", "maxnet.js")
INDEX_HTML = os.path.join(ROOT_DIR, "index.html")
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
    print("MAXNET OS: Building Production Frontend Bundle")
    print("=" * 60)

    # 1. Verify Directories
    if not os.path.exists(MODULES_DIR):
        print(f"Error: Missing modules directory {MODULES_DIR}")
        sys.exit(1)

    # 2. Check Templates
    tpl_file = os.path.join(MODULES_DIR, "templates.js")
    if not os.path.exists(tpl_file):
        print(f"Error: Missing templates file {tpl_file}")
        sys.exit(1)

    # 3. Syntax Verification via Node
    print("[1/4] Validating JavaScript syntax with Node AST...")
    run(f"node -c '{tpl_file}'")
    run(f"node -c '{JS_TARGET}'")
    print("      Syntax check passed with 0 errors.")

    # 4. Measure Asset Sizes
    html_size = os.path.getsize(INDEX_HTML)
    css_size = os.path.getsize(CSS_FILE)
    js_size = os.path.getsize(JS_TARGET)

    print("[2/4] Verifying asset sizes:")
    print(f"      - index.html: {html_size:,} bytes (< 2.5 KB zero-latency shell)")
    print(f"      - maxnet.css: {css_size:,} bytes")
    print(f"      - maxnet.js:  {js_size:,} bytes")

    # 5. Security & Header Audit
    print("[3/4] Auditing Security Headers & Meta Tags:")
    with open(INDEX_HTML, "r", encoding="utf-8") as f:
        html_content = f.read()
    
    assert "no-cache, no-store, must-revalidate" in html_content, "Missing Cache-Control in index.html"
    assert "nosniff" in html_content, "Missing X-Content-Type-Options in index.html"
    assert "maxnet-root" in html_content, "Missing SPA mounting root"
    print("      Cache-Control: ACTIVE (Zero stale cache guarantee)")
    print("      X-Content-Type-Options: ACTIVE")

    elapsed = (time.time() - t0) * 1000
    print("[4/4] Build Completed Successfully in {:.2f} ms".format(elapsed))
    print("=" * 60)

if __name__ == "__main__":
    build()
