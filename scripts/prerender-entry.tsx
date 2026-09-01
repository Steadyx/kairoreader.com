import { generateHydrationScript, renderToString } from "solid-js/web";
import App from "../src/App";
import { allSeoRoutes, seoForPath } from "../src/content/seo";

export function renderApp(path = "/") {
  return renderToString(() => <App initialPath={path} />);
}

export function renderHydrationScript() {
  return generateHydrationScript();
}

export function renderRoutes() {
  return allSeoRoutes.map((route) => seoForPath(route.path));
}
