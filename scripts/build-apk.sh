#!/usr/bin/env bash
# Build only Aeris in the official SDK; never installs anything on a router.
set -euo pipefail

source_dir="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
sdk_dir="${1:?Usage: build-apk.sh SDK_DIR ARTIFACTS_DIR}"
artifacts_dir="${2:?Usage: build-apk.sh SDK_DIR ARTIFACTS_DIR}"
mkdir -p "$artifacts_dir"
artifacts_dir="$(cd -- "$artifacts_dir" && pwd)"
cd -- "$sdk_dir"

aeris_collect_logs() {
  status=$?
  [ ! -d logs ] || cp -a logs "$artifacts_dir/"
  exit "$status"
}
trap aeris_collect_logs EXIT

# Preserve SDK-pinned revisions while using the official GitHub feed mirrors.
mkdir -p aeris-feed
ln -s "$source_dir" aeris-feed/luci-theme-aeris
python3 - "$PWD/aeris-feed" <<'PY'
from pathlib import Path
import sys
lines=[]
for line in Path('feeds.conf.default').read_text().splitlines():
    parts=line.split()
    if len(parts)<3 or parts[0].startswith('#'):
        continue
    for prefix in ['https://git.openwrt.org/feed/', 'https://git.openwrt.org/project/', 'https://git.openwrt.org/openwrt/']:
        line=line.replace(prefix, 'https://github.com/openwrt/')
    lines.append(line)
lines.append('src-link aeris '+sys.argv[1])
Path('feeds.conf').write_text('\n'.join(lines)+'\n')
PY

echo 'Updating SDK-pinned package feeds.'
./scripts/feeds update -a
grep -q '^Package: luci-theme-aeris$' feeds/aeris.index || { echo 'Aeris is missing from the SDK package index.' >&2; exit 1; }
./scripts/feeds install -p aeris -f luci-theme-aeris
test -f package/feeds/aeris/luci-theme-aeris/Makefile
cat >> .config <<'CONFIG'
CONFIG_ALL=n
CONFIG_ALL_KMODS=n
CONFIG_ALL_NONSHARED=n
CONFIG_PACKAGE_luci-theme-aeris=m
# CONFIG_SIGNED_PACKAGES is not set
CONFIG
make defconfig

echo 'Building luci-theme-aeris.'
make -j"$(nproc)" package/luci-theme-aeris/compile BUILD_LOG=1 V=s
package_path="$(find bin/packages -type f -name 'luci-theme-aeris-*.apk' -print -quit)"
test -n "$package_path"
cp "$package_path" "$artifacts_dir/"
printf 'APK ready: %s\n' "$artifacts_dir/$(basename "$package_path")"
