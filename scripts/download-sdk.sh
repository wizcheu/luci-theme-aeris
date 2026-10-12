#!/usr/bin/env bash
# Download a pinned official SDK with bounded network waits and visible progress.
set -euo pipefail

sdk_file='openwrt-sdk-25.12.5-x86-64_gcc-14.3.0_musl.Linux-x86_64.tar.zst'
sdk_sha256='0c8df0151a1e88feb7c03d694d61f6a18d51872815b7c811d76e2b77504d5e9c'
cache_dir="${1:?Usage: download-sdk.sh CACHE_DIR SDK_DIR}"
sdk_dir="${2:?Usage: download-sdk.sh CACHE_DIR SDK_DIR}"
archive="$cache_dir/$sdk_file"
mkdir -p "$cache_dir"

verify_archive() {
  [ -f "$archive" ] && printf '%s  %s\n' "$sdk_sha256" "$archive" | sha256sum --check --status
}

if verify_archive; then
  echo 'Using cached OpenWrt 25.12.5 SDK; SHA256 matches.'
else
  downloaded=0
  for host in https://downloads.openwrt.org https://mirror-03.infra.openwrt.org; do
    echo "Downloading $sdk_file from $host"
    if curl --fail --location --proto '=https' --proto-redir '=https' \
      --connect-timeout 15 --max-time 180 --speed-time 30 --speed-limit 16384 \
      --retry 2 --retry-delay 3 --retry-max-time 240 \
      "$host/releases/25.12.5/targets/x86/64/$sdk_file" --output "$archive.part"; then
      printf '%s  %s\n' "$sdk_sha256" "$archive.part" | sha256sum --check
      mv "$archive.part" "$archive"
      downloaded=1
      break
    fi
    echo "Download failed or timed out at $host; trying the next official mirror." >&2
  done
  [ "$downloaded" = 1 ] || { echo 'Unable to download the pinned SDK.' >&2; exit 1; }
fi

[ ! -e "$sdk_dir" ] || { echo "SDK destination already exists: $sdk_dir" >&2; exit 1; }
mkdir -p "$sdk_dir"
echo "Extracting verified SDK into $sdk_dir"
tar --zstd -xf "$archive" --strip-components=1 --no-same-owner -C "$sdk_dir"
test -x "$sdk_dir/scripts/feeds"
echo 'SDK ready.'
