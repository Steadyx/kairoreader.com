import { Match, Switch, createEffect, createMemo, createSignal, onCleanup, onMount } from "solid-js";
import { Footer } from "./components/layout/Footer";
import { Header } from "./components/layout/Header";
import { appPathFor, scrollToRouteTarget } from "./lib/navigation";
import { syncPageMetadata } from "./lib/pageMetadata";
import { HomePage } from "./pages/HomePage";
import { IntentPage } from "./pages/IntentPage";
import { PrivacyPage } from "./pages/PrivacyPage";
import { canonicalUrlForPath, normalizePath, privacyPolicyForPath, seoForPath, seoPageForPath } from "./content/seo";

type Theme = "light" | "dark";

function App(props: { initialPath?: string } = {}) {
  const initialPath = normalizePath(props.initialPath ?? (typeof window === "undefined" ? "/" : window.location.pathname));
  const [routePath, setRoutePath] = createSignal(initialPath);
  const initialTheme: Theme =
    typeof document !== "undefined" && document.documentElement.dataset.theme === "light" ? "light" : "dark";
  const [theme, setTheme] = createSignal<Theme>(initialTheme);
  const [menuOpen, setMenuOpen] = createSignal(false);
  const routeSeo = createMemo(() => seoForPath(routePath()));
  const privacyPage = createMemo(() => privacyPolicyForPath(routePath()));
  const intentPage = createMemo(() => seoPageForPath(routePath()));
  const isHome = createMemo(() => !privacyPage() && !intentPage());

  createEffect(() => {
    if (typeof document === "undefined") return;
    syncPageMetadata(routeSeo(), canonicalUrlForPath(routeSeo().path));
  });

  createEffect(() => {
    if (typeof document === "undefined") return;
    const nextTheme = theme();
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
    document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute(
      "content",
      nextTheme === "dark" ? "#071011" : "#f4f6f3",
    );
  });

  onMount(() => {
    try {
      const storedTheme = window.localStorage.getItem("kairo-theme");
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      setTheme(storedTheme === "light" || storedTheme === "dark" ? storedTheme : systemTheme);
    } catch {
      setTheme("dark");
    }

    const navigate = (url: URL) => {
      const nextPath = appPathFor(url.pathname);
      if (!nextPath) return false;

      const nextUrl = `${nextPath}${url.hash}`;
      const currentUrl = `${normalizePath(window.location.pathname)}${window.location.hash}`;
      if (nextUrl !== currentUrl) window.history.pushState({}, "", nextUrl);

      setRoutePath(nextPath);
      setMenuOpen(false);
      scrollToRouteTarget(url.hash);
      return true;
    };

    const handleClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (!(event.target instanceof Element)) return;
      const anchor = event.target.closest<HTMLAnchorElement>("a[href]");
      if (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("mailto:") || href.startsWith("tel:")) return;
      const url = new URL(anchor.href);
      if (url.origin === window.location.origin) {
        if (url.pathname === window.location.pathname && url.hash) {
          event.preventDefault();
          scrollToRouteTarget(url.hash);
          setMenuOpen(false);
          return;
        }
        if (appPathFor(url.pathname)) {
          event.preventDefault();
          navigate(url);
        }
      }
    };

    const handlePopState = () => {
      setRoutePath(appPathFor(window.location.pathname) ?? "/");
      setMenuOpen(false);
      scrollToRouteTarget(window.location.hash);
    };

    window.addEventListener("click", handleClick);
    window.addEventListener("popstate", handlePopState);
    onCleanup(() => {
      window.removeEventListener("click", handleClick);
      window.removeEventListener("popstate", handlePopState);
    });
  });

  const toggleTheme = () => {
    const next = theme() === "dark" ? "light" : "dark";
    setTheme(next);
    try {
      window.localStorage.setItem("kairo-theme", next);
    } catch {
      // Theme switching still works when storage is unavailable.
    }
  };

  return (
    <div class="site-shell">
      <Header
        isHome={isHome()}
        isDark={theme() === "dark"}
        menuOpen={menuOpen()}
        onToggleMenu={() => setMenuOpen(!menuOpen())}
        onToggleTheme={toggleTheme}
      />
      <Switch fallback={<HomePage />}>
        <Match when={privacyPage()}>
          <PrivacyPage />
        </Match>
        <Match when={intentPage()} keyed>
          {(page) => <IntentPage page={page} />}
        </Match>
      </Switch>
      <Footer isHome={isHome()} />
    </div>
  );
}

export default App;
