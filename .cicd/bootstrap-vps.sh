#!/usr/bin/env sh
set -eu

fail() {
  printf 'bootstrap-vps: %s\n' "$*" >&2
  exit 1
}

if [ "$(id -u)" -ne 0 ]; then
  fail "run this once on the VPS as root, or with sudo"
fi

if [ -r /etc/os-release ]; then
  . /etc/os-release
else
  fail "cannot detect Linux distribution"
fi

case "${ID:-}" in
  debian|ubuntu) ;;
  *)
    fail "this bootstrap currently supports Debian/Ubuntu VPS images. Install containerd, buildkit, nerdctl, git and curl manually for ${ID:-unknown}."
    ;;
esac

case "$(uname -m)" in
  x86_64|amd64) arch="amd64" ;;
  aarch64|arm64) arch="arm64" ;;
  *) fail "unsupported CPU architecture: $(uname -m)" ;;
esac

apt-get update
apt-get install -y ca-certificates curl git tar gzip sudo

if [ -z "${NERDCTL_VERSION:-}" ]; then
  NERDCTL_VERSION="$(curl -fsSL https://api.github.com/repos/containerd/nerdctl/releases/latest | sed -n 's/.*"tag_name": "v\([^"]*\)".*/\1/p' | head -n 1)"
fi

[ -n "$NERDCTL_VERSION" ] || fail "could not resolve latest nerdctl version"

tmp_dir="$(mktemp -d)"
trap 'rm -rf "$tmp_dir"' EXIT

archive="nerdctl-full-${NERDCTL_VERSION}-linux-${arch}.tar.gz"
url="https://github.com/containerd/nerdctl/releases/download/v${NERDCTL_VERSION}/${archive}"

printf 'Installing nerdctl full bundle v%s for linux-%s\n' "$NERDCTL_VERSION" "$arch"
curl -fL "$url" -o "$tmp_dir/$archive"
tar -C /usr/local -xzf "$tmp_dir/$archive"

systemctl daemon-reload
systemctl enable --now containerd
systemctl enable --now buildkit

if command -v ufw >/dev/null 2>&1 && ufw status | grep -q '^Status: active'; then
  ufw allow 80/tcp
  ufw allow 443/tcp
fi

nerdctl version
buildctl --version

cat <<'EOF'

Bootstrap complete.

Next checks:
- DNS A/AAAA records point your domain at this VPS.
- The VPS provider firewall allows inbound TCP 80 and 443.
- Your GitHub Actions VPS_USER is root, or has passwordless sudo for nerdctl.
EOF
