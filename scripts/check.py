#!/usr/bin/env python3
"""Validate release metadata and local documentation without network access."""
import json
import os
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]
makefile = (ROOT / 'Makefile').read_text()
version = re.search(r'^PKG_VERSION:=(\S+)$', makefile, re.M).group(1)
assert json.loads((ROOT / 'package.json').read_text())['version'] == version
assert f'Aeris {version} ' in (ROOT / 'ucode/template/themes/aeris/footer.ut').read_text()
ref = os.environ.get('GITHUB_REF', '')
if ref.startswith('refs/tags/'):
    assert ref == f'refs/tags/v{version}', f'Tag {ref} does not match package version {version}'
for path in ROOT.rglob('*.json'):
    if not any(part in {'.git', 'dist', 'node_modules', 'sdk-artifacts'} for part in path.relative_to(ROOT).parts):
        json.loads(path.read_text())
for path in [ROOT / 'README.md', *sorted((ROOT / 'docs').glob('*.md'))]:
    for target in re.findall(r'\[[^\]]*\]\(([^\s)]+)', path.read_text()):
        if '://' in target or target.startswith(('#', 'mailto:')):
            continue
        relative = target.split('#')[0]
        assert (path.parent / relative).exists(), f'Broken link in {path.name}: {target}'
print(f'Release metadata v{version}, JSON and documentation links are valid.')
