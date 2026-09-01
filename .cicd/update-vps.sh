#!/usr/bin/env sh
set -eu

fail() {
  printf 'update-vps: %s\n' "$*" >&2
  exit 1
}

if [ "$(id -u)" -ne 0 ]; then
  fail "run this as root or with passwordless sudo"
fi

if [ -r /etc/os-release ]; then
  . /etc/os-release
else
  fail "cannot detect Linux distribution"
fi

case "${ID:-}" in
  debian|ubuntu) ;;
  *) fail "automatic package maintenance supports Debian and Ubuntu only, not ${ID:-unknown}" ;;
esac

export DEBIAN_FRONTEND=noninteractive
export NEEDRESTART_MODE=a

printf 'Refreshing APT package metadata on %s\n' "$(hostname)"
apt-get update

upgrade_list="$(apt-get -s --with-new-pkgs upgrade 2>/dev/null | awk '/^Inst / { print $2 }')"
upgrade_count="$(printf '%s\n' "$upgrade_list" | awk 'NF { count++ } END { print count + 0 }')"

if [ "$upgrade_count" -eq 0 ]; then
  printf 'VPS packages are already up to date.\n'
else
  printf 'Applying %s safe package update(s):\n' "$upgrade_count"
  printf '%s\n' "$upgrade_list" | sed '/^$/d; s/^/  - /'
  apt-get -y -o Dpkg::Options::=--force-confold --with-new-pkgs upgrade
  apt-get check
fi

remaining="$(apt-get -s --with-new-pkgs upgrade 2>/dev/null | awk '/^Inst / { print $2 }')"
if [ -n "$remaining" ]; then
  printf '::warning::Some VPS packages remain held back and need manual review: %s\n' "$(printf '%s' "$remaining" | tr '\n' ' ')"
fi

if [ -f /var/run/reboot-required ]; then
  printf '::warning::VPS package updates require a reboot; reboot was not automated to avoid unplanned downtime.\n'
  if [ -r /var/run/reboot-required.pkgs ]; then
    sed 's/^/  - /' /var/run/reboot-required.pkgs
  fi
fi
