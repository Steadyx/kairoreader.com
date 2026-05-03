import { generateHydrationScript, renderToString } from "solid-js/web";
import App from "../src/App";

export function renderApp() {
  return renderToString(() => <App />);
}

export function renderHydrationScript() {
  return generateHydrationScript();
}
