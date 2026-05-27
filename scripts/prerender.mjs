import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const distIndex = resolve(process.cwd(), "dist/index.html");
const prerenderEntry = resolve(process.cwd(), ".prerender/prerender-entry.mjs");
const { renderApp, renderHydrationScript, renderRoutes } = await import(pathToFileURL(prerenderEntry).href);

const html = readFileSync(distIndex, "utf8");
const hydrationScript = renderHydrationScript();
const routes = renderRoutes();

for (const route of routes) {
  const appHtml = renderApp(route.path);
  const outputPath = outputPathForRoute(route.path);
  const renderedHtml = withPageMetadata(
    html
      .replace("    <script type=\"module\"", `    ${hydrationScript}\n    <script type="module"`)
      .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`),
    route,
  );

  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, renderedHtml);
}

function outputPathForRoute(routePath) {
  if (routePath === "/") return distIndex;
  return resolve(process.cwd(), "dist", routePath.replace(/^\/|\/$/g, ""), "index.html");
}

function withPageMetadata(pageHtml, route) {
  const url = `https://kairoreader.com${route.path}`;

  return pageHtml
    .replace(/<title>.*?<\/title>/s, `<title>${escapeText(route.title)}</title>`)
    .replace(
      /<meta\s+name="description"\s+content="[^"]*"\s*\/>/s,
      `<meta\n      name="description"\n      content="${escapeAttribute(route.description)}"\n    />`,
    )
    .replace(
      /<meta\s+name="keywords"\s+content="[^"]*"\s*\/>/s,
      `<meta\n      name="keywords"\n      content="${escapeAttribute(route.keywords)}"\n    />`,
    )
    .replace(/<link\s+rel="canonical"\s+href="[^"]*"\s*\/>/s, `<link rel="canonical" href="${url}" />`)
    .replace(/<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/s, `<meta property="og:title" content="${escapeAttribute(route.title)}" />`)
    .replace(
      /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/s,
      `<meta\n      property="og:description"\n      content="${escapeAttribute(route.description)}"\n    />`,
    )
    .replace(/<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/s, `<meta property="og:url" content="${url}" />`)
    .replace(/<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/s, `<meta name="twitter:title" content="${escapeAttribute(route.title)}" />`)
    .replace(
      /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/s,
      `<meta\n      name="twitter:description"\n      content="${escapeAttribute(route.description)}"\n    />`,
    );
}

function escapeAttribute(value) {
  const text = Array.isArray(value) ? value.join(", ") : String(value);

  return text
    .replaceAll("&", "&amp;")
    .replaceAll("\"", "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeText(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}
