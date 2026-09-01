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

## Automated dependency and VPS maintenance

GitHub Actions validates every pull request with Node 24 and npm 12. Dependabot checks npm packages, container base images, and GitHub Actions each Monday. Minor and patch updates merge only after the validation workflow passes; major updates stay open for review.

The production deploy always refreshes its Node and Caddy base images before rebuilding. A separate weekly VPS maintenance workflow applies safe Debian/Ubuntu package upgrades, then rebuilds and health-checks the site. It does not remove packages or reboot the server automatically; held packages and required reboots are reported as workflow warnings for manual review.
