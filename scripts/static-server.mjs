import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve(process.cwd(), "dist");
const port = Number(process.env.PORT ?? 8080);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=utf-8",
};

function resolveRequestPath(url) {
  const parsed = new URL(url ?? "/", `http://localhost:${port}`);
  const requested = normalize(decodeURIComponent(parsed.pathname)).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(root, requested);
  if (!filePath.startsWith(root)) return join(root, "index.html");
  if (existsSync(filePath) && statSync(filePath).isFile()) return filePath;
  if (existsSync(join(filePath, "index.html"))) return join(filePath, "index.html");
  return join(root, "index.html");
}

createServer((request, response) => {
  const filePath = resolveRequestPath(request.url);
  const extension = extname(filePath);
  response.setHeader("Content-Type", contentTypes[extension] ?? "application/octet-stream");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  response.setHeader("Cache-Control", extension === ".html" ? "no-cache" : "public, max-age=31536000, immutable");
  createReadStream(filePath).pipe(response);
}).listen(port, "0.0.0.0", () => {
  console.log(`Kairo landing page serving http://localhost:${port}`);
});
