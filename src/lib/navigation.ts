import { allSeoRoutes, normalizePath } from "../content/seo";

const appRoutePaths = new Set(allSeoRoutes.map((route) => route.path));

export function appPathFor(pathname: string) {
  const normalized = normalizePath(pathname);
  return appRoutePaths.has(normalized) ? normalized : undefined;
}

export function scrollToRouteTarget(hash: string) {
  window.requestAnimationFrame(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      return;
    }

    const rawId = hash.slice(1);
    let id = rawId;
    try {
      id = decodeURIComponent(rawId);
    } catch {
      id = rawId;
    }
    document.getElementById(id)?.scrollIntoView({ block: "start", behavior: "auto" });
  });
}
