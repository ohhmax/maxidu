#!/usr/bin/env python3
import os
import sys

src_compiler = os.path.join(os.path.dirname(os.path.abspath(__file__)), "src", "compiler.py")
if os.path.exists(src_compiler):
    import subprocess
    sys.exit(subprocess.run([sys.executable, src_compiler]).returncode)
