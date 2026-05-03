import { readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";

const distIndex = resolve(process.cwd(), "dist/index.html");
const prerenderEntry = resolve(process.cwd(), ".prerender/prerender-entry.mjs");
const { renderApp, renderHydrationScript } = await import(pathToFileURL(prerenderEntry).href);

const html = readFileSync(distIndex, "utf8");
const appHtml = renderApp();
const hydrationScript = renderHydrationScript();

writeFileSync(
  distIndex,
  html
    .replace("    <script type=\"module\"", `    ${hydrationScript}\n    <script type="module"`)
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`),
);
