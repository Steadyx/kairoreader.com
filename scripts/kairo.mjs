#!/usr/bin/env node
import { spawn, spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import { mkdir, open, readFile, rm, writeFile } from "node:fs/promises";
import http from "node:http";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const stateDir = join(rootDir, ".kairo");
const pidFile = join(stateDir, "dev.pid");
const logFile = join(stateDir, "dev.log");

const devPort = 5173;
const devUrl = `http://localhost:${devPort}`;
const containerName = "kairoreader-web";
const imageName = "kairoreader.com:local";
const containerPort = 8082;
const containerUrl = `http://localhost:${containerPort}`;

const command = process.argv[2] ?? "help";

switch (command) {
  case "dev":
  case "up":
    await startDev();
    break;
  case "stop":
  case "down":
  case "dev-stop":
    await stopDev();
    break;
  case "container-build":
    buildContainer();
    break;
  case "container-up":
    await startContainer();
    break;
  case "container-stop":
  case "container-down":
    stopContainer();
    break;
  case "status":
    await status();
    break;
  default:
    help();
    process.exit(command === "help" ? 0 : 1);
}

async function startDev() {
  await mkdir(stateDir, { recursive: true });

  const current = await devProcess();
  if (current.running) {
    await writeFile(pidFile, `${current.pid}\n`);
    console.log(`Kairo dev server is already running at ${devUrl}`);
    console.log(`PID: ${current.pid}`);
    console.log(`Log: ${relative(rootDir, logFile)}`);
    return;
  }

  if (!existsSync(join(rootDir, "node_modules"))) {
    console.error("node_modules is missing. Run `npm install` once, then retry `npm run up`.");
    process.exit(1);
  }

  const log = await open(logFile, "a");
  const child = spawn(process.execPath, [join(rootDir, "node_modules/vite/bin/vite.js"), "--host", "0.0.0.0", "--port", String(devPort), "--strictPort"], {
    cwd: rootDir,
    detached: true,
    env: process.env,
    stdio: ["ignore", log.fd, log.fd],
  });

  child.unref();
  await log.close();
  await writeFile(pidFile, `${child.pid}\n`);

  const ready = await waitForHttp(devUrl, 15_000);
  if (!ready) {
    console.log("Started Kairo dev server, but it did not answer before the timeout.");
    console.log(`PID: ${child.pid}`);
    console.log(`Check the log: ${relative(rootDir, logFile)}`);
    return;
  }

  console.log(`Kairo dev server running at ${devUrl}`);
  console.log("Hot reload is enabled by Vite while this dev server is running.");
  console.log(`PID: ${child.pid}`);
  console.log(`Log: ${relative(rootDir, logFile)}`);
}

async function stopDev() {
  const current = await devProcess();
  if (!current.pid) {
    console.log("No Kairo dev server PID file found.");
    return;
  }

  if (!current.running) {
    await rm(pidFile, { force: true });
    console.log("Removed stale Kairo dev PID file.");
    return;
  }

  if (!current.owned) {
    console.error(`PID ${current.pid} is running, but it does not look like the Kairo dev server.`);
    console.error(`Command: ${current.command}`);
    console.error(`Not stopping it. Remove ${relative(rootDir, pidFile)} manually if this PID file is stale.`);
    process.exit(1);
  }

  const signalled = terminateProcessGroup(current.pid);
  if (!signalled) {
    console.error(`Could not signal PID ${current.pid}. You may need to stop it manually.`);
    process.exit(1);
  }

  const stopped = await waitForProcessExit(current.pid, 8_000);
  if (!stopped) {
    process.kill(-current.pid, "SIGKILL");
    await waitForProcessExit(current.pid, 2_000);
  }

  await rm(pidFile, { force: true });
  console.log("Stopped Kairo dev server.");
}

function buildContainer() {
  ensureColima();
  runColima(["nerdctl", "--", "build", "-t", imageName, "."]);
  console.log(`Built ${imageName}`);
}

async function startContainer() {
  ensureColima();
  stopKairoContainers({ quiet: true });
  runColima(["nerdctl", "--", "build", "-t", imageName, "."]);
  runColima([
    "nerdctl",
    "--",
    "run",
    "-d",
    "--name",
    containerName,
    "-e",
    "SITE_DOMAIN=:8080",
    "-e",
    "ACME_EMAIL=local@example.invalid",
    "-p",
    `${containerPort}:8080`,
    imageName,
  ]);

  const ready = await waitForHttp(containerUrl, 15_000);
  if (!ready) {
    console.log(`Started ${containerName}, but ${containerUrl} did not answer before the timeout.`);
    return;
  }

  console.log(`Kairo static container running at ${containerUrl}`);
  console.log("This is a production-style static preview; it does not hot reload.");
}

function stopContainer() {
  const stopped = stopKairoContainers();
  if (stopped.length) {
    console.log(`Stopped and removed ${stopped.length} Kairo static container(s).`);
  } else {
    console.log("No Kairo static containers were running.");
  }
}

async function status() {
  const current = await devProcess();
  if (current.running && current.owned) {
    console.log(`Dev server: running at ${devUrl} (PID ${current.pid})`);
  } else {
    console.log("Dev server: stopped");
  }

  const lines = kairoContainers({ all: false }).map((container) => container.line);

  if (lines.length) {
    console.log(`Static container: running at ${containerUrl}`);
    for (const line of lines) console.log(`  ${line}`);
  } else {
    console.log("Static container: stopped");
  }
}

function stopKairoContainers(options = {}) {
  const containers = kairoContainers({ all: true });

  for (const container of containers) {
    runColima(["nerdctl", "--", "stop", container.id], { allowFailure: true, capture: true });
    runColima(["nerdctl", "--", "rm", container.id], { allowFailure: true, capture: true });
  }

  if (!options.quiet && containers.length) {
    for (const container of containers) console.log(`Removed ${container.line}`);
  }

  return containers;
}

function kairoContainers({ all }) {
  const args = ["nerdctl", "--", "ps"];
  if (all) args.push("-a");
  args.push("--format", "{{.ID}}\t{{.Image}}\t{{.Ports}}\t{{.Names}}");

  const ps = runColima(args, {
    allowFailure: true,
    capture: true,
  });

  return ps.stdout
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [id, image, ports, names] = line.split("\t");
      return { id, image, ports, names, line };
    })
    .filter((container) => {
      return (
        container.id &&
        (container.image === `docker.io/library/${imageName}` ||
          container.image === imageName ||
          container.names === containerName ||
          container.names?.startsWith("kairoreader.com-") ||
          container.ports?.includes(`${containerPort}->8080/tcp`))
      );
    });
}

async function devProcess() {
  let pid = null;
  try {
    pid = Number((await readFile(pidFile, "utf8")).trim());
  } catch {
    return devProcessByPort();
  }

  if (!Number.isInteger(pid) || pid <= 0) {
    return devProcessByPort();
  }

  if (!isAlive(pid)) {
    const byPort = devProcessByPort();
    return byPort.running ? byPort : { pid, running: false, owned: false, command: "" };
  }

  let command = commandForPid(pid);
  if (!command) {
    const byPort = devProcessByPort();
    if (byPort.pid === pid) return byPort;
  }

  const owned = /\bnode\b.*\bvite\b|\bnpm\b.*\brun\b.*\bdev\b|\bvite\b/.test(command);
  return { pid, running: true, owned, command };
}

function devProcessByPort() {
  const result = spawnSync("lsof", ["-nP", `-iTCP:${devPort}`, "-sTCP:LISTEN", "-F", "pc"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  });

  if (result.status !== 0 || !result.stdout.trim()) {
    return { pid: null, running: false, owned: false, command: "" };
  }

  const pid = Number(result.stdout.match(/^p(\d+)/m)?.[1]);
  const command = result.stdout.match(/^c(.+)$/m)?.[1] ?? "";
  if (!Number.isInteger(pid) || pid <= 0) {
    return { pid: null, running: false, owned: false, command: "" };
  }

  return {
    pid,
    running: true,
    owned: /\bnode\b|\bvite\b|\bnpm\b/.test(command),
    command,
  };
}

function ensureColima() {
  runColima(["start", "--runtime", "containerd"]);
}

function runColima(args, options = {}) {
  const colima = colimaCommand();
  return run(colima.command, [...colima.args, ...args], {
    ...options,
    env: colima.env,
  });
}

function colimaCommand() {
  const nativeColima = "/opt/homebrew/bin/colima";
  if (process.platform === "darwin" && existsSync(nativeColima)) {
    return {
      command: "arch",
      args: ["-arm64", nativeColima],
      env: {
        ...process.env,
        PATH: "/opt/homebrew/bin:/opt/homebrew/sbin:/usr/bin:/bin:/usr/sbin:/sbin",
      },
    };
  }

  return {
    command: "colima",
    args: [],
    env: process.env,
  };
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: rootDir,
    env: options.env ?? process.env,
    encoding: "utf8",
    stdio: options.capture ? ["ignore", "pipe", "pipe"] : "inherit",
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0 && !options.allowFailure) {
    process.exit(result.status ?? 1);
  }

  return {
    status: result.status ?? 0,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
  };
}

function isAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function commandForPid(pid) {
  const result = spawnSync("ps", ["-p", String(pid), "-o", "command="], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  });
  return result.status === 0 ? result.stdout.trim() : "";
}

function terminateProcessGroup(pid) {
  try {
    process.kill(-pid, "SIGTERM");
    return true;
  } catch {
    try {
      process.kill(pid, "SIGTERM");
      return true;
    } catch {
      return false;
    }
  }
}

async function waitForProcessExit(pid, timeoutMs) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (!isAlive(pid)) return true;
    await delay(200);
  }
  return !isAlive(pid);
}

async function waitForHttp(url, timeoutMs) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await canReach(url)) return true;
    await delay(300);
  }
  return false;
}

function canReach(url) {
  return new Promise((resolveReach) => {
    let settled = false;
    const settle = (value) => {
      if (!settled) {
        settled = true;
        resolveReach(value);
      }
    };

    const request = http.get(url, (response) => {
      response.resume();
      settle(response.statusCode >= 200 && response.statusCode < 500);
    });

    request.on("error", () => settle(false));
    request.setTimeout(500, () => {
      request.destroy();
      settle(false);
    });
  });
}

function delay(ms) {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, ms));
}

function help() {
  console.log(`Usage:
  npm run up                Start Vite dev server with hot reload at ${devUrl}
  npm run stop              Stop the Vite dev server
  npm run status            Show dev/container status

  npm run container:up      Build and run static Caddy container at ${containerUrl}
  npm run container:stop    Stop the static Caddy container

Notes:
  Use npm run up while editing. That is the hot-reload path.
  Use npm run container:up when you want to test the production-style static build.
  Production deploys use compose.yaml on the VPS. Local compose previews can use compose.local.yaml.`);
}
