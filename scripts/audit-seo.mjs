import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";

const siteOrigin = "https://kairoreader.com";
const distDir = resolve(process.cwd(), "dist");
const titleLength = { min: 45, max: 65 };
const descriptionLength = { min: 70, max: 155 };

const errors = [];

if (!existsSync(distDir)) {
  fail(`Missing dist directory: ${distDir}`);
} else {
  const htmlFiles = findIndexHtml(distDir);
  const pageUrls = new Set();

  for (const file of htmlFiles) {
    const routePath = routePathFor(file);
    const pageUrl = `${siteOrigin}${routePath}`;
    const html = readFileSync(file, "utf8");
    const label = relative(process.cwd(), file);
    const title = extractTitle(html);
    const description = extractMeta(html, "name", "description");
    const canonical = extractLink(html, "canonical");
    const ogTitle = extractMeta(html, "property", "og:title");
    const ogDescription = extractMeta(html, "property", "og:description");
    const ogUrl = extractMeta(html, "property", "og:url");
    const twitterTitle = extractMeta(html, "name", "twitter:title");
    const twitterDescription = extractMeta(html, "name", "twitter:description");

    pageUrls.add(pageUrl);

    checkText(label, "title", title, titleLength);
    checkText(label, "description", description, descriptionLength);
    checkEqual(label, "canonical", canonical, pageUrl);
    checkEqual(label, "og:title", ogTitle, title);
    checkEqual(label, "og:description", ogDescription, description);
    checkEqual(label, "og:url", ogUrl, pageUrl);
    checkEqual(label, "twitter:title", twitterTitle, title);
    checkEqual(label, "twitter:description", twitterDescription, description);
  }

  checkSitemap(pageUrls);
}

if (errors.length > 0) {
  console.error(`SEO audit failed with ${errors.length} issue${errors.length === 1 ? "" : "s"}:`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("SEO audit passed: titles, descriptions, canonicals, social metadata, and sitemap URLs align.");

function findIndexHtml(directory) {
  const files = [];

  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    const stats = statSync(path);

    if (stats.isDirectory()) {
      files.push(...findIndexHtml(path));
    } else if (entry === "index.html") {
      files.push(path);
    }
  }

  return files.sort();
}

function routePathFor(file) {
  const relativePath = relative(distDir, file).split(sep).join("/");

  if (relativePath === "index.html") return "/";
  return `/${relativePath.replace(/\/index\.html$/, "/")}`;
}

function extractTitle(html) {
  return decodeEntities(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1]?.trim() ?? "");
}

function extractMeta(html, attributeName, attributeValue) {
  const tags = html.match(/<meta\b[^>]*>/gi) ?? [];
  const tag = tags.find((candidate) => getAttribute(candidate, attributeName) === attributeValue);

  return tag ? decodeEntities(getAttribute(tag, "content")) : "";
}

function extractLink(html, rel) {
  const tags = html.match(/<link\b[^>]*>/gi) ?? [];
  const tag = tags.find((candidate) => getAttribute(candidate, "rel") === rel);

  return tag ? decodeEntities(getAttribute(tag, "href")) : "";
}

function getAttribute(tag, name) {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)')`, "i"));
  return match?.[2] ?? match?.[3] ?? "";
}

function decodeEntities(text) {
  return text
    .replaceAll("&quot;", "\"")
    .replaceAll("&#39;", "'")
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&amp;", "&");
}

function checkText(label, field, value, range) {
  if (!value) {
    fail(`${label}: missing ${field}`);
    return;
  }

  if (value.length < range.min || value.length > range.max) {
    fail(`${label}: ${field} length ${value.length} is outside ${range.min}-${range.max}`);
  }
}

function checkEqual(label, field, actual, expected) {
  if (actual !== expected) {
    fail(`${label}: ${field} is "${actual || "(missing)"}"; expected "${expected}"`);
  }
}

function checkSitemap(pageUrls) {
  const sitemapPath = join(distDir, "sitemap.xml");

  if (!existsSync(sitemapPath)) {
    fail("dist/sitemap.xml is missing");
    return;
  }

  const sitemap = readFileSync(sitemapPath, "utf8");
  const sitemapUrls = new Set([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => decodeEntities(match[1].trim())));

  for (const pageUrl of pageUrls) {
    if (!sitemapUrls.has(pageUrl)) fail(`sitemap.xml is missing ${pageUrl}`);
  }

  for (const sitemapUrl of sitemapUrls) {
    if (!pageUrls.has(sitemapUrl)) fail(`sitemap.xml lists ${sitemapUrl}, but no matching built page exists`);
  }
}

function fail(message) {
  errors.push(message);
}
