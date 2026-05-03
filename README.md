# Kairo Reader Landing Page

Minimal Solid + Tailwind landing page for Kairo, the RSVP-first Android reader.

## Local Development

```bash
npm install
npm run up
```

Open `http://localhost:5173`. This runs Vite directly, so edits hot reload in the browser.

Stop the dev server:

```bash
npm run stop
```

## Production Build

```bash
npm run build
npm run serve
```

The build is prerendered into `dist/index.html` so the landing-page copy, headings, and structured data are present without waiting for client-side JavaScript.

## Colima + containerd + nerdctl

The container path is for a production-style static preview. It builds the site and serves `dist/` with Caddy, so it does not hot reload when you edit source files. Use `npm run up` while actively working on the page.

Start Colima with containerd:

```bash
colima start --runtime containerd
```

Build and run the static container:

```bash
npm run container:up
```

Open `http://localhost:8082`.

Stop the static container:

```bash
npm run container:stop
```

Check what is running:

```bash
npm run status
```

The scripts use the native Apple Silicon Colima binary from `/opt/homebrew/bin` when it is available, so they avoid the Rosetta Lima issue.

If you prefer direct compose:

```bash
colima nerdctl -- compose -f compose.local.yaml up --build
```

## Production Deploy

Pushing to `main` runs `.github/workflows/deploy.yml`. The workflow checks and builds the Solid app, uploads the source over SSH, and runs `.cicd/deploy.sh` on the VPS.

Required GitHub repository secrets:

```text
VPS_HOST=your.vps.ip.or.hostname
VPS_PORT=22
VPS_USER=root
VPS_SSH_KEY=private SSH key for the VPS user
VPS_APP_DIR=/opt/kairoreader.com
SITE_DOMAIN=kairoreader.com,www.kairoreader.com
ACME_EMAIL=you@example.com
```

Run the VPS bootstrap once before the first deployment if containerd, buildkit, and nerdctl are not installed:

```bash
sudo sh .cicd/bootstrap-vps.sh
```

DNS must point the domain at the VPS, and inbound TCP `80` and `443` must be open. Caddy will request and renew HTTPS certificates automatically once the domain resolves to the server.
