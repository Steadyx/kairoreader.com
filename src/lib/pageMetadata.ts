import type { SeoRoute } from "../content/seo";

export function syncPageMetadata(route: SeoRoute, canonicalUrl: string) {
  document.title = route.title;
  setMeta("name", "description", route.description);
  setMeta("name", "keywords", typeof route.keywords === "string" ? route.keywords : route.keywords.join(", "));
  setMeta("property", "og:title", route.title);
  setMeta("property", "og:description", route.description);
  setMeta("property", "og:url", canonicalUrl);
  setMeta("name", "twitter:title", route.title);
  setMeta("name", "twitter:description", route.description);
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute("href", canonicalUrl);
}

function setMeta(attribute: "name" | "property", value: string, content: string) {
  document.querySelector<HTMLMetaElement>(`meta[${attribute}="${value}"]`)?.setAttribute("content", content);
}
