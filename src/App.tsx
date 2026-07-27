import { For, Match, Switch, createEffect, createMemo, createSignal, onCleanup, onMount } from "solid-js";
import {
  allSeoRoutes,
  canonicalUrlForPath,
  normalizePath,
  privacyPolicyForPath,
  seoForPath,
  seoPageForPath,
  seoPages,
  siteOrigin,
  type SeoPage,
  type SeoRoute,
} from "./seoContent";

type Theme = "light" | "dark";
type IconName =
  | "arrow"
  | "book"
  | "check"
  | "coffee"
  | "focus"
  | "github"
  | "menu"
  | "moon"
  | "play"
  | "shield"
  | "sun"
  | "timer"
  | "x";

const playStoreUrl = "https://play.google.com/store/apps/details?id=com.kairo.reader";
const githubUrl = "https://github.com/Steadyx/Kairo";
const coffeeUrl = "https://buymeacoffee.com/kairoapp";
const supportEmail = "kairoapp@proton.me";
const appRoutePaths = new Set(allSeoRoutes.map((route) => route.path));

const formats = [
  ["EPUB", "Ebook"],
  ["MOBI", "Ebook"],
  ["PRC", "Ebook"],
  ["AZW", "Ebook"],
  ["FB2", "Ebook"],
  ["PDF", "Document"],
  ["DOCX", "Document"],
  ["TXT", "Text"],
  ["Markdown", "Text"],
  ["HTML", "Text"],
] as const;

const profiles = ["Balanced", "Chill", "Narrative", "Focus", "Flow", "Sprint", "Study"];

const faqItems = [
  {
    question: "What is Kairo?",
    answer:
      "Kairo is a free Android reading app for your own DRM-free ebooks and documents. It combines a normal reader with adaptive RSVP and Bionic Reading modes, while keeping books, progress and preferences on your device.",
  },
  {
    question: "Which file formats does Kairo support?",
    answer:
      "Kairo 1.1 supports EPUB, MOBI, PRC, AZW, FB2 and FB2.ZIP ebooks; DOCX and text-based PDF documents; and TXT, Markdown, HTML and HTM text files.",
  },
  {
    question: "What is the difference between RSVP and Bionic Reading?",
    answer:
      "RSVP keeps your eyes at one focal point while words or short phrases change. Bionic Reading shows larger timed chunks and emphasises word beginnings, giving you more surrounding context. Kairo lets you choose either from the same reading position.",
  },
  {
    question: "Does Kairo upload my books or track my reading?",
    answer:
      "No. Imported content, bookmarks, progress and reader preferences stay in app-private storage. Kairo has no accounts, ads or analytics SDKs. Internet access is used for Google Play's in-app update flow, not to send your reading data to a Kairo server.",
  },
  {
    question: "Can Kairo read scanned PDFs or protected ebooks?",
    answer:
      "Not currently. PDFs need selectable text, because Kairo does not perform OCR. Vendor-locked or DRM-protected ebooks are also outside the current parser pipeline.",
  },
  {
    question: "What version of Android is required?",
    answer: "Kairo supports Android 7.0 (API 24) and newer and is available free on Google Play.",
  },
] as const;

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${siteOrigin}/#faq`,
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

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

function Header(props: {
  isHome: boolean;
  isDark: boolean;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onToggleTheme: () => void;
}) {
  const homeHref = (hash: string) => (props.isHome ? hash : `/${hash}`);

  return (
    <header class="site-header">
      <div class="nav-wrap">
        <a class="brand" href="/" aria-label="Kairo home">
          <img src="/assets/kairo-icon.png" width="36" height="36" alt="" />
          <span>Kairo</span>
          <span class="version-pill">1.1</span>
        </a>
        <nav classList={{ "nav-links": true, open: props.menuOpen }} aria-label="Primary navigation">
          <a href={homeHref("#experience")}>Experience</a>
          <a href={homeHref("#formats")}>Formats</a>
          <a href={homeHref("#privacy")}>Privacy</a>
          <a href={homeHref("#faq")}>FAQ</a>
          <a href={githubUrl} target="_blank" rel="noreferrer">
            Open source
          </a>
          <a href={coffeeUrl} target="_blank" rel="noreferrer">
            Support
          </a>
          <a class="nav-play" href={playStoreUrl} target="_blank" rel="noreferrer">
            Get Kairo
            <Icon name="arrow" />
          </a>
        </nav>
        <div class="nav-actions">
          <button class="icon-button" type="button" onClick={props.onToggleTheme} aria-label={`Use ${props.isDark ? "light" : "dark"} theme`}>
            <Icon name={props.isDark ? "sun" : "moon"} />
          </button>
          <button
            class="icon-button menu-button"
            type="button"
            onClick={props.onToggleMenu}
            aria-expanded={props.menuOpen}
            aria-label={props.menuOpen ? "Close menu" : "Open menu"}
          >
            <Icon name={props.menuOpen ? "x" : "menu"} />
          </button>
        </div>
      </div>
    </header>
  );
}

function HomePage() {
  return (
    <main>
      <section class="hero section-pad" aria-labelledby="hero-title">
        <div class="hero-glow" aria-hidden="true" />
        <div class="hero-grid content-wrap">
          <div class="hero-copy">
            <p class="eyebrow">
              <span class="status-dot" />
              Kairo 1.1 · Free on Android
            </p>
            <h1 id="hero-title">
              Read at the speed of <span>thought.</span>
            </h1>
            <p class="hero-lede">
              Bring your own books and documents. Read with full context, then shift into adaptive RSVP or Bionic Reading
              whenever you want more momentum.
            </p>
            <div class="hero-actions">
              <PlayButton />
              <a class="button-secondary" href="#experience">
                See how it works
                <Icon name="arrow" />
              </a>
              <a class="button-secondary hero-support" href={coffeeUrl} target="_blank" rel="noreferrer">
                <Icon name="coffee" />
                Buy me a coffee
              </a>
            </div>
            <div class="hero-proof" aria-label="Kairo highlights">
              <span>
                <Icon name="check" /> 10 format families
              </span>
              <span>
                <Icon name="shield" /> Local-first
              </span>
              <span>
                <Icon name="github" /> Open source
              </span>
            </div>
          </div>

          <div class="hero-visual" aria-label="Kairo app screenshots">
            <div class="orbit orbit-one" aria-hidden="true" />
            <div class="orbit orbit-two" aria-hidden="true" />
            <PhoneFrame class="hero-phone hero-phone-back" src="/assets/screens/library.webp" alt="Kairo library with imported books, progress and bookmarks" />
            <PhoneFrame class="hero-phone hero-phone-mid" src="/assets/screens/reader-controls.webp" alt="Kairo reader with chapter text and reading controls" />
            <PhoneFrame class="hero-phone hero-phone-front" src="/assets/screens/rsvp.webp" alt="Kairo RSVP screen with a focused word and playback controls" />
            <div class="floating-note note-formats">
              <span>Bring your own files</span>
              <strong>EPUB · PDF · DOCX + more</strong>
            </div>
            <div class="floating-note note-local">
              <Icon name="shield" />
              <span>
                <strong>Stays yours</strong>
                Local books & progress
              </span>
            </div>
          </div>
        </div>
        <div class="scroll-cue content-wrap" aria-hidden="true">
          <span>Scroll to explore</span>
          <i />
        </div>
      </section>

      <section class="intro-strip" aria-label="Kairo design principles">
        <div class="content-wrap intro-strip-grid">
          <p>Speed without chaos.</p>
          <p>Focus without clutter.</p>
          <p>Your library without the cloud.</p>
        </div>
      </section>

      <section id="experience" class="section-pad">
        <div class="content-wrap">
          <SectionHeading
            eyebrow="One continuous reading flow"
            title="Change how you read. Not where you are."
            body="Kairo keeps the library, the page and your accelerated reading modes connected. Pick the experience that fits the next passage."
          />
          <div class="mode-grid">
            <article class="mode-card mode-reader">
              <div class="mode-copy">
                <span class="mode-number">01</span>
                <p class="eyebrow">Reader</p>
                <h3>Stay with the whole page.</h3>
                <p>Scrollable chapters, inline images, table of contents, bookmarks, progress and a movable focus word.</p>
              </div>
              <PhoneFrame src="/assets/screens/reader-rsvp-dock.webp" alt="Kairo standard reader with the RSVP launch control" />
            </article>
            <article class="mode-card mode-rsvp">
              <div class="mode-copy">
                <span class="mode-number">02</span>
                <p class="eyebrow">Adaptive RSVP</p>
                <h3>Give every word one clear place.</h3>
                <p>ORP alignment and timing shaped by punctuation, length, syllables, clauses and readability.</p>
              </div>
              <PhoneFrame src="/assets/screens/rsvp.webp" alt="Kairo RSVP mode showing the word seldom at a stable focal point" />
            </article>
            <article class="mode-card mode-bionic">
              <div class="mode-copy">
                <span class="mode-number">03</span>
                <p class="eyebrow">Bionic Reading</p>
                <h3>Move in larger, focused pieces.</h3>
                <p>Timed text chunks with emphasised beginnings give you momentum while keeping more sentence context in view.</p>
              </div>
              <BionicSample />
            </article>
          </div>
        </div>
      </section>

      <section id="formats" class="formats-section section-pad">
        <div class="content-wrap">
          <div class="formats-head">
            <SectionHeading
              eyebrow="Kairo 1.1 format support"
              title="Your reading list is bigger than one file type."
              body="Choose a supported file from Android storage. Kairo detects it automatically, builds a local library entry and opens the same focused reading toolkit."
            />
            <a class="text-link" href="/supported-formats/">
              Format details and limitations <Icon name="arrow" />
            </a>
          </div>
          <div class="format-grid">
            <For each={formats}>
              {([name, type], index) => (
                <div class="format-card">
                  <span>{String(index() + 1).padStart(2, "0")}</span>
                  <strong>{name}</strong>
                  <small>{type}</small>
                </div>
              )}
            </For>
          </div>
          <p class="format-note">
            DRM-free files only. PDFs require selectable text; image-only and scanned PDFs are not supported yet.
          </p>
        </div>
      </section>

      <section class="section-pad tuning-section">
        <div class="content-wrap tuning-grid">
          <div class="tuning-copy">
            <p class="eyebrow">Power when you want it</p>
            <h2>Simple on the surface. Remarkably tuneable underneath.</h2>
            <p>
              Start with a profile, press play and read. When you want finer control, Kairo exposes the pacing, typography,
              brightness and focus settings that actually change how a session feels.
            </p>
            <div class="profile-list" aria-label="Built-in RSVP profiles">
              <For each={profiles}>{(profile) => <span>{profile}</span>}</For>
            </div>
          </div>
          <div class="tuning-visual">
            <PhoneFrame src="/assets/screens/rsvp-settings.webp?v=1.1.0" alt="Kairo RSVP settings with profile and timing controls" />
            <div class="tuning-callout callout-one">
              <span>Estimated pace</span>
              <strong>811 WPM</strong>
            </div>
            <div class="tuning-callout callout-two">
              <span>Controls</span>
              <strong>Rhythm · readability · display</strong>
            </div>
          </div>
        </div>
      </section>

      <section class="feature-bento section-pad">
        <div class="content-wrap">
          <SectionHeading
            eyebrow="Designed around attention"
            title="Everything that helps. Nothing that performs for attention."
            body="The details are quiet, but they are not shallow."
          />
          <div class="bento-grid">
            <article class="bento-card bento-focus">
              <Icon name="focus" />
              <p class="eyebrow">Focus mode</p>
              <h3>Hide the chrome. Pause the noise.</h3>
              <p>Use a full-screen reader and optionally engage Android Do Not Disturb during focused sessions.</p>
            </article>
            <article class="bento-card bento-theme">
              <p class="eyebrow">Six reader themes</p>
              <h3>Find a softer kind of contrast.</h3>
              <div class="theme-swatches" aria-label="Light, Sepia, Dark, Nord, Cyberpunk and Forest themes">
                <span class="swatch-light" />
                <span class="swatch-sepia" />
                <span class="swatch-dark" />
                <span class="swatch-nord" />
                <span class="swatch-cyber" />
                <span class="swatch-forest" />
              </div>
            </article>
            <article class="bento-card bento-bookmarks">
              <Icon name="book" />
              <p class="eyebrow">Reading state</p>
              <h3>Your place, saved locally.</h3>
              <p>Books, bookmarks, completion, progress and preferences stay connected on your device.</p>
            </article>
            <article class="bento-card bento-context">
              <div class="orp-demo" aria-hidden="true">
                <span>prev</span>
                <strong>mome<em>n</em>tum</strong>
                <span>next</span>
              </div>
              <p class="eyebrow">Context assist</p>
              <h3>More context, without leaving the focal band.</h3>
              <p>Optional previous and upcoming word cues soften the edges of single-focus RSVP.</p>
            </article>
          </div>
        </div>
      </section>

      <section class="gallery-section section-pad" aria-labelledby="gallery-title">
        <div class="content-wrap">
          <div class="gallery-heading">
            <div>
              <p class="eyebrow">Inside Kairo</p>
              <h2 id="gallery-title">A reading interface that gets out of the way.</h2>
            </div>
            <p>Near-black surfaces, restrained colour and controls that appear when they are useful.</p>
          </div>
          <div class="screen-gallery">
            <figure>
              <img src="/assets/screens/library.webp" width="1080" height="1920" alt="Kairo library showing book covers, progress and navigation tabs" loading="lazy" />
              <figcaption>Library</figcaption>
            </figure>
            <figure>
              <img src="/assets/screens/settings.webp" width="333" height="592" alt="Kairo settings home with RSVP, reader, focus and startup settings" loading="lazy" />
              <figcaption>Settings</figcaption>
            </figure>
            <figure>
              <img src="/assets/screens/reader-settings.webp" width="1080" height="1920" alt="Kairo reader settings with font, theme, brightness and scrolling options" loading="lazy" />
              <figcaption>Reader themes</figcaption>
            </figure>
            <figure>
              <img src="/assets/screens/reader-controls.webp" width="1080" height="1920" alt="Kairo book reader with bookmarks, focus mode and table of contents controls" loading="lazy" />
              <figcaption>Reader controls</figcaption>
            </figure>
          </div>
        </div>
      </section>

      <section id="privacy" class="privacy-section section-pad">
        <div class="content-wrap privacy-grid">
          <div class="privacy-mark">
            <Icon name="shield" />
          </div>
          <div>
            <p class="eyebrow">Local-first by design</p>
            <h2>Your books are not our business.</h2>
          </div>
          <div class="privacy-copy">
            <p>
              Kairo has no account system, ads or analytics SDKs. Imported files, extracted content, progress, bookmarks and
              preferences stay in app-private storage.
            </p>
            <p>
              Internet access supports Google Play's flexible update flow. It is not used to upload your library or reading
              activity to a Kairo server.
            </p>
            <a class="text-link" href="/privacy-policy/">
              Read the privacy policy <Icon name="arrow" />
            </a>
          </div>
        </div>
      </section>

      <section class="open-section section-pad">
        <div class="content-wrap open-card">
          <div>
            <p class="eyebrow">Free and open source</p>
            <h2>Built in the open. Shaped by readers.</h2>
            <p>
              Inspect the code, report an issue or help make focused reading better. Kairo is a native Kotlin and Jetpack
              Compose project on GitHub.
            </p>
          </div>
          <div class="open-actions">
            <a class="button-primary" href={githubUrl} target="_blank" rel="noreferrer">
              <Icon name="github" /> View on GitHub
            </a>
            <a class="button-secondary" href={coffeeUrl} target="_blank" rel="noreferrer">
              <Icon name="coffee" /> Support Kairo
            </a>
          </div>
        </div>
      </section>

      <section id="faq" class="faq-section section-pad">
        <div class="content-wrap faq-grid">
          <div class="faq-intro">
            <p class="eyebrow">Questions, answered</p>
            <h2>Everything you need before the first page.</h2>
            <p>
              Still wondering about a file or feature? Email{" "}
              <a href={`mailto:${supportEmail}`}>{supportEmail}</a>.
            </p>
          </div>
          <div class="faq-list">
            <For each={faqItems}>
              {(item, index) => (
                <details open={index() === 0}>
                  <summary>
                    <span>{item.question}</span>
                    <i aria-hidden="true" />
                  </summary>
                  <p>{item.answer}</p>
                </details>
              )}
            </For>
          </div>
        </div>
        <script type="application/ld+json">{JSON.stringify(faqStructuredData)}</script>
      </section>

      <CoverageSection />

      <section class="final-cta section-pad">
        <div class="content-wrap final-cta-inner">
          <img src="/assets/kairo-icon.png" width="88" height="88" alt="" />
          <p class="eyebrow">Your next chapter, in motion</p>
          <h2>Read differently.</h2>
          <p>Kairo is free on Android 7.0 and newer.</p>
          <PlayButton />
        </div>
      </section>
    </main>
  );
}

function IntentPage(props: { page: SeoPage }) {
  const articleData = () => ({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: props.page.heading,
    description: props.page.description,
    url: `${siteOrigin}${props.page.path}`,
    mainEntityOfPage: `${siteOrigin}${props.page.path}`,
    author: { "@type": "Organization", name: "Kairo" },
    publisher: { "@type": "Organization", name: "Kairo", logo: { "@type": "ImageObject", url: `${siteOrigin}/assets/kairo-icon.png` } },
  });

  return (
    <main class="editorial-page">
      <article class="section-pad">
        <div class="article-wrap">
          <a class="back-link" href="/">
            <Icon name="arrow" /> Back to Kairo
          </a>
          <p class="eyebrow">{props.page.eyebrow}</p>
          <h1>{props.page.heading}</h1>
          <p class="article-summary">{props.page.summary}</p>
          <div class="article-actions">
            <PlayButton />
            <a class="button-secondary" href="/#experience">
              Explore the app <Icon name="arrow" />
            </a>
          </div>
          <ul class="highlight-grid" aria-label="Highlights">
            <For each={props.page.highlights}>{(highlight) => <li><Icon name="check" /> {highlight}</li>}</For>
          </ul>
          <div class="article-sections">
            <For each={props.page.sections}>
              {(section, index) => (
                <section>
                  <span>{String(index() + 1).padStart(2, "0")}</span>
                  <div>
                    <h2>{section.title}</h2>
                    <p>{section.body}</p>
                  </div>
                </section>
              )}
            </For>
          </div>
          <aside class="related-card">
            <p class="eyebrow">Keep exploring</p>
            <div>
              <For each={props.page.related}>
                {(path) => {
                  const page = () => seoPages.find((candidate) => candidate.path === path);
                  return (
                    <a href={path}>
                      {page()?.navLabel ?? "Kairo guide"}
                      <Icon name="arrow" />
                    </a>
                  );
                }}
              </For>
            </div>
          </aside>
        </div>
        <script type="application/ld+json">{JSON.stringify(articleData())}</script>
      </article>
    </main>
  );
}

function PrivacyPage() {
  const dataRows = [
    {
      title: "Imported books and documents",
      body:
        "Files you choose, extracted text, covers, images and metadata are processed locally and stored in Kairo's app-private storage. They are not uploaded to a Kairo server.",
    },
    {
      title: "Reading state and preferences",
      body:
        "Bookmarks, completion, reading position, themes, typography, focus options and timed-reading settings are stored locally so the app can resume your experience.",
    },
    {
      title: "Google Play update checks",
      body:
        "Kairo uses Google Play's in-app update service to check for, download and complete eligible app updates. This is handled by Google Play under your Google and device settings.",
    },
    {
      title: "Notification policy access",
      body:
        "If you enable Focus Mode notification pausing and grant Android's access, Kairo can temporarily use Do Not Disturb. It does not read notification content.",
    },
    {
      title: "Support email",
      body:
        `If you email ${supportEmail}, your address and message are used only to respond and retained as needed for support, legal or abuse-prevention purposes.`,
    },
  ];

  return (
    <main class="editorial-page privacy-page">
      <article class="section-pad">
        <div class="article-wrap">
          <a class="back-link" href="/">
            <Icon name="arrow" /> Back to Kairo
          </a>
          <p class="eyebrow">Privacy policy · Updated 27 July 2026</p>
          <h1>Private reading should be the default.</h1>
          <p class="article-summary">
            Kairo does not operate an account or reading-data service. Your imported content, progress, bookmarks and preferences
            stay on your device.
          </p>
          <div class="privacy-summary">
            <article>
              <Icon name="shield" />
              <h2>No Kairo cloud</h2>
              <p>Your library and reading activity are not sent to a developer-operated server.</p>
            </article>
            <article>
              <Icon name="focus" />
              <h2>No ads or analytics</h2>
              <p>The current app includes no advertising, analytics or social tracking SDKs.</p>
            </article>
            <article>
              <Icon name="book" />
              <h2>Local control</h2>
              <p>Delete books in Kairo, clear app storage or uninstall the app to remove local data.</p>
            </article>
          </div>
          <section class="policy-section">
            <p class="eyebrow">What the app handles</p>
            <div class="policy-rows">
              <For each={dataRows}>
                {(row, index) => (
                  <article>
                    <span>{String(index() + 1).padStart(2, "0")}</span>
                    <div>
                      <h2>{row.title}</h2>
                      <p>{row.body}</p>
                    </div>
                  </article>
                )}
              </For>
            </div>
          </section>
          <section class="policy-prose">
            <h2>Collection, use and sharing</h2>
            <p>
              Kairo does not collect imported content, reading history, progress, bookmarks, preferences, advertising identifiers
              or analytics on developer-controlled servers. It does not sell personal data. The app's internet permission supports
              the Google Play in-app update flow; it is not used to transmit your library or reading activity to Kairo.
            </p>
            <p>
              Android system services may handle data under your device and Google account settings. These include Google Play app
              delivery and updates, and optional Android backup. The Kairo developer does not receive or access your device backups.
            </p>
          </section>
          <section class="policy-prose">
            <h2>Storage, security and deletion</h2>
            <p>
              Local content, the Room database and app preferences use Android app-private storage. Android's sandbox limits access
              by other apps under normal device security rules. Data remains until you remove the relevant book, clear Kairo's app
              storage or uninstall Kairo.
            </p>
            <p>
              If Android backup is enabled, Kairo's database and preferences may be included in a Google-managed backup and restored
              to another device. Manage or remove those copies through your Android and Google backup settings.
            </p>
          </section>
          <section class="policy-prose">
            <h2>Accounts, children and policy changes</h2>
            <p>
              Kairo has no account, sign-in, subscription, payment or external account deletion flow. It is not directed to children
              and does not knowingly collect children's personal information. If you believe a child has sent information through a
              support message, contact us so it can be deleted.
            </p>
            <p>
              This policy may change when Kairo's behaviour, third-party services or legal requirements change. The effective date at
              the top will be updated whenever the policy changes materially.
            </p>
          </section>
          <aside class="contact-card">
            <div>
              <p class="eyebrow">Questions or requests</p>
              <h2>Talk to a human.</h2>
              <p>For privacy, deletion or support questions, email the Kairo project.</p>
            </div>
            <a class="button-primary" href={`mailto:${supportEmail}`}>{supportEmail}</a>
          </aside>
        </div>
      </article>
    </main>
  );
}

function CoverageSection() {
  return (
    <section class="coverage-section section-pad" aria-labelledby="coverage-title">
      <div class="content-wrap">
        <div class="coverage-head">
          <div>
            <p class="eyebrow">Reading guides</p>
            <h2 id="coverage-title">Go deeper into the way Kairo reads.</h2>
          </div>
          <p>Clear, focused guides to the formats and reading modes available in Kairo 1.1.</p>
        </div>
        <div class="coverage-grid">
          <For each={seoPages}>
            {(page, index) => (
              <a href={page.path}>
                <span>{String(index() + 1).padStart(2, "0")}</span>
                <div>
                  <p class="eyebrow">{page.eyebrow}</p>
                  <h3>{page.navLabel}</h3>
                </div>
                <Icon name="arrow" />
              </a>
            )}
          </For>
        </div>
      </div>
    </section>
  );
}

function Footer(props: { isHome: boolean }) {
  return (
    <footer class="site-footer">
      <div class="content-wrap footer-grid">
        <div>
          <a class="brand" href="/">
            <img src="/assets/kairo-icon.png" width="36" height="36" alt="" />
            <span>Kairo</span>
          </a>
          <p>Focused reading for Android.</p>
        </div>
        <div class="footer-links">
          <div>
            <strong>Explore</strong>
            <a href={props.isHome ? "#experience" : "/#experience"}>Experience</a>
            <a href={props.isHome ? "#formats" : "/#formats"}>Formats</a>
            <a href={props.isHome ? "#faq" : "/#faq"}>FAQ</a>
          </div>
          <div>
            <strong>Project</strong>
            <a href={playStoreUrl} target="_blank" rel="noreferrer">Google Play</a>
            <a href={githubUrl} target="_blank" rel="noreferrer">GitHub</a>
            <a href={coffeeUrl} target="_blank" rel="noreferrer">Support Kairo</a>
          </div>
          <div>
            <strong>Legal</strong>
            <a href="/privacy-policy/">Privacy policy</a>
            <a href={`mailto:${supportEmail}`}>Contact</a>
          </div>
        </div>
      </div>
      <div class="content-wrap footer-bottom">
        <span>© 2026 Kairo</span>
        <span>Version 1.1.0 · Android 7.0+</span>
      </div>
    </footer>
  );
}

function SectionHeading(props: { eyebrow: string; title: string; body: string }) {
  return (
    <div class="section-heading">
      <p class="eyebrow">{props.eyebrow}</p>
      <h2>{props.title}</h2>
      <p>{props.body}</p>
    </div>
  );
}

function PhoneFrame(props: { src: string; alt: string; class?: string }) {
  return (
    <figure class={`phone-frame ${props.class ?? ""}`.trim()}>
      <span class="phone-speaker" aria-hidden="true" />
      <img
        src={props.src}
        width="1080"
        height="1920"
        alt={props.alt}
        loading={props.class?.includes("hero-phone") ? "eager" : "lazy"}
      />
    </figure>
  );
}

function BionicSample() {
  const words = ["Reading", "should", "feel", "intentional.", "Context", "creates", "momentum."];

  return (
    <div class="bionic-sample" aria-label="Example of Bionic Reading with emphasised word beginnings">
      <div class="bionic-progress">
        <span />
      </div>
      <p>
        <For each={words}>
          {(word) => {
            const split = Math.max(1, Math.ceil(word.length * 0.45));
            return <><strong>{word.slice(0, split)}</strong>{word.slice(split)}{" "}</>;
          }}
        </For>
      </p>
      <div class="bionic-controls" aria-hidden="true">
        <span>‹</span>
        <span><Icon name="play" /></span>
        <span>›</span>
      </div>
    </div>
  );
}

function PlayButton() {
  return (
    <a class="play-button" href={playStoreUrl} target="_blank" rel="noreferrer" aria-label="Get Kairo on Google Play">
      <span class="play-icon"><Icon name="play" /></span>
      <span>
        <small>Get it on</small>
        <strong>Google Play</strong>
      </span>
    </a>
  );
}

function Icon(props: { name: IconName }) {
  const paths: Record<IconName, string> = {
    arrow: "M5 12h14m-6-6 6 6-6 6",
    book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5zm0 0V6.5M8 7h8",
    check: "m5 12 4 4L19 6",
    coffee: "M5 8h12v7a4 4 0 0 1-4 4H9a4 4 0 0 1-4-4zm12 2h1a3 3 0 0 1 0 6h-1M8 3v2m4-2v2",
    focus: "M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3m0 8v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3m9-8v8m-4-4h8",
    github: "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5a5.4 5.4 0 0 0-1-3.5A5 5 0 0 0 19 2s-1 0-3 1.5a13.4 13.4 0 0 0-8 0C6 2 5 2 5 2a5 5 0 0 0 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5A4.8 4.8 0 0 0 9 18v4m0-4c-4.5 2-5-2-7-2",
    menu: "M4 7h16M4 12h16M4 17h16",
    moon: "M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z",
    play: "m7 4 13 8-13 8z",
    shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zm-3-10 2 2 4-4",
    sun: "M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6 7 7m10 10 1.4 1.4m0-12.8L17 7M7 17l-1.4 1.4M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z",
    timer: "M9 2h6m-3 4a8 8 0 1 0 8 8m-8-3v3l2 2",
    x: "M6 6l12 12M18 6 6 18",
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
      <path d={paths[props.name]} />
    </svg>
  );
}

function appPathFor(pathname: string) {
  const normalized = normalizePath(pathname);
  return appRoutePaths.has(normalized) ? normalized : undefined;
}

function scrollToRouteTarget(hash: string) {
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

function syncPageMetadata(route: SeoRoute, canonicalUrl: string) {
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

export default App;
