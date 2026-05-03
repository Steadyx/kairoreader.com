#!/usr/bin/env sh
set -eu

APP_DIR="${APP_DIR:-$(pwd)}"
COMPOSE_FILE="${COMPOSE_FILE:-compose.yaml}"
HEALTH_TIMEOUT_SECONDS="${HEALTH_TIMEOUT_SECONDS:-150}"

export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:${PATH:-}"

cd "$APP_DIR"

fail() {
  printf 'deploy: %s\n' "$*" >&2
  exit 1
}

need() {
  command -v "$1" >/dev/null 2>&1 || fail "missing required command: $1"
}

env_value() {
  key="$1"
  file="${2:-.env}"

  [ -f "$file" ] || return 0
  awk -v wanted="$key" '
    BEGIN { FS = "=" }
    $1 == wanted {
      sub("^[^=]*=", "")
      gsub(/^'\''|'\''$/, "")
      gsub(/^"|"$/, "")
      print
      exit
    }
  ' "$file"
}

normalize_domains() {
  printf '%s' "$1" | tr -d '[:space:]'
}

first_domain_from() {
  normalize_domains "$1" | cut -d, -f1
}

nerdctl_ready() {
  if nerdctl version >/dev/null 2>&1; then
    USE_SUDO_NERDCTL=0
    return 0
  fi

  if command -v sudo >/dev/null 2>&1 && sudo -n nerdctl version >/dev/null 2>&1; then
    USE_SUDO_NERDCTL=1
    return 0
  fi

  return 1
}

nerdctl_run() {
  if [ "${USE_SUDO_NERDCTL:-0}" = "1" ]; then
    sudo -n nerdctl "$@"
  else
    nerdctl "$@"
  fi
}

need curl
need nerdctl

[ -f "$COMPOSE_FILE" ] || fail "missing $COMPOSE_FILE"

site_domain="${SITE_DOMAIN:-$(env_value SITE_DOMAIN .env)}"
acme_email="${ACME_EMAIL:-$(env_value ACME_EMAIL .env)}"

[ -n "$site_domain" ] || fail "SITE_DOMAIN is missing. Set it in GitHub secrets or .env."
[ -n "$acme_email" ] || fail "ACME_EMAIL is missing. Set it in GitHub secrets or .env."

normalized_domains="$(normalize_domains "$site_domain")"
first_domain="$(first_domain_from "$normalized_domains")"

[ -n "$first_domain" ] || fail "SITE_DOMAIN did not contain a usable hostname."

if ! nerdctl_ready; then
  fail "nerdctl cannot talk to containerd. Run .cicd/bootstrap-vps.sh, SSH as root, or grant this deploy user passwordless sudo for nerdctl."
fi

printf 'SITE_DOMAIN=%s\nACME_EMAIL=%s\n' "$normalized_domains" "$acme_email" > .env

printf 'Deploying Kairo Reader for %s\n' "$normalized_domains"
nerdctl_run compose -f "$COMPOSE_FILE" up -d --build

health_url="${HEALTHCHECK_URL:-https://$first_domain/}"
printf 'Waiting for %s\n' "$health_url"

deadline=$(($(date +%s) + HEALTH_TIMEOUT_SECONDS))
while [ "$(date +%s)" -lt "$deadline" ]; do
  if curl -fsSIL --max-time 8 "$health_url" >/dev/null 2>&1; then
    printf 'Deployment healthy: %s\n' "$health_url"
    nerdctl_run compose -f "$COMPOSE_FILE" ps
    exit 0
  fi
  sleep 5
done

printf 'Deployment did not become healthy before timeout.\n' >&2
printf 'Recent container status:\n' >&2
nerdctl_run compose -f "$COMPOSE_FILE" ps >&2 || true
printf 'Recent Caddy logs:\n' >&2
nerdctl_run logs --tail 120 kairoreader-web >&2 || true
exit 1
