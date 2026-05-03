import { hydrate, render } from "solid-js/web";
import App from "./App";
import "./styles.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

const hasHydrationState = Boolean((globalThis as { _$HY?: unknown })._$HY);

if (root.hasChildNodes() && hasHydrationState) {
  hydrate(() => <App />, root);
} else {
  root.replaceChildren();
  render(() => <App />, root);
}
