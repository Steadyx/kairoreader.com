import { For, Show, createEffect, createMemo, createSignal, onCleanup, onMount } from "solid-js";
import { seoPageForPath, seoPages, siteOrigin, type SeoPage } from "./seoContent";

type Theme = "light" | "dark";

const features = [
  {
    eyebrow: "Import",
    title: "Bring your own books",
    body: "Kairo imports DRM-free EPUB and MOBI files from Android storage, extracts metadata and covers, then keeps the library local.",
    metric: "EPUB + MOBI",
  },
  {
    eyebrow: "Reader",
    title: "Scroll when you want context",
    body: "A quiet long-form reader gives chapter navigation, page-aware progress, bookmarks, images, and a clean handoff into RSVP.",
    metric: "Resume state",
  },
  {
    eyebrow: "RSVP",
    title: "Accelerate without visual noise",
    body: "Words stay anchored around the optimal recognition point, with adaptive timing for length, syllables, punctuation, clauses, and long words.",
    metric: "ORP guided",
  },
  {
    eyebrow: "Control",
    title: "Profiles for different kinds of reading",
    body: "Balanced, Chill, Narrative, Focus, Flow, Sprint, and Study profiles make speed reading feel tuned rather than forced.",
    metric: "7 profiles",
  },
  {
    eyebrow: "Focus",
    title: "Low-distraction by design",
    body: "Focus mode, brightness controls, typography, low-glare themes, and persistent preferences keep the session calm.",
    metric: "Local prefs",
  },
];

const technicalDetails = [
  "Kotlin 2.1 Android app",
  "Jetpack Compose UI",
  "Room + DataStore persistence",
  "EPUB spine and MOBI parsing",
  "Language-aware tokenization",
  "CJK and RTL foundations",
  "ORP guide controls",
  "Page and paragraph pause shaping",
];

const profiles = [
  ["Balanced", "Natural cadence with clear punctuation breathing"],
  ["Chill", "Slow, spacious pacing for relaxed reading"],
  ["Narrative", "Expressive flow for fiction and inner voice"],
  ["Focus", "Sharper rhythm without dropping punctuation cues"],
  ["Flow", "Continuous mid-fast movement with smooth transitions"],
  ["Sprint", "Very fast, with readable pause structure"],
  ["Study", "Deliberate timing for dense material"],
];

const keywords = [
  "RSVP reading app",
  "RSVP reading",
  "Android RSVP reader",
  "speed reading",
  "speed reading app",
  "calm reader",
  "calm speed reading",
  "focus reading",
  "Android ebook reader",
  "ORP highlighting",
  "EPUB speed reading",
  "EPUB reader",
  "MOBI reader",
];

const faqItems = [
  {
    question: "What is RSVP reading?",
    answer:
      "RSVP reading shows one word or short text unit at a fixed point, reducing eye movement. Kairo uses RSVP as its main reading mode and shapes timing around punctuation, word length, and sentence flow so speed reading feels calmer.",
  },
  {
    question: "Is Kairo a speed reading app or an ebook reader?",
    answer:
      "Kairo is both. It combines a quiet Android ebook reader with an RSVP speed reading mode, so you can import a book, read with normal context, and launch focused word-by-word reading from the same position.",
  },
  {
    question: "Can Kairo import EPUB and MOBI books?",
    answer:
      "Yes. Kairo imports DRM-free EPUB and MOBI files from Android storage, extracts chapters, metadata, and covers where available, and keeps reading progress on the device.",
  },
  {
    question: "Does Kairo use ORP highlighting?",
    answer:
      "Yes. Kairo anchors words around the optimal recognition point and can show ORP guidance so your eyes have a consistent focus point during RSVP reading.",
  },
  {
    question: "How does Kairo keep speed reading calm?",
    answer:
      "Kairo uses adaptive pacing, low-glare themes, focus mode, bookmarks, persistent reader settings, and RSVP profiles for different reading rhythms. The goal is controlled reading momentum rather than frantic word flashing.",
  },
  {
    question: "Is Kairo available on Google Play?",
    answer:
      "Kairo is coming soon to Google Play. The Android project is available on GitHub while the release is prepared.",
  },
] as const;

const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://kairoreader.com/#faq",
  url: "https://kairoreader.com/#faq",
  name: "Kairo RSVP Reader FAQs",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

function App(props: { initialPath?: string } = {}) {
  const [theme, setTheme] = createSignal<Theme>("dark");
  const [activeFeature, setActiveFeature] = createSignal(0);
  const routePath = props.initialPath ?? (typeof window === "undefined" ? "/" : window.location.pathname);
  const intentPage = seoPageForPath(routePath);

  onMount(() => {
    let storedTheme: Theme | null = null;

    try {
      storedTheme = window.localStorage.getItem("kairo-theme") as Theme | null;
    } catch {
      storedTheme = null;
    }

    const preferredDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = storedTheme === "light" || storedTheme === "dark" ? storedTheme : preferredDark ? "dark" : "light";
    setTheme(initialTheme);

    const handleScroll = () => {
      const featureSection = document.getElementById("features");
      if (!featureSection) return;

      const rect = featureSection.getBoundingClientRect();
      const progress = Math.min(0.999, Math.max(0, -rect.top / Math.max(1, rect.height - window.innerHeight)));
      setActiveFeature(Math.floor(progress * features.length));
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    onCleanup(() => window.removeEventListener("scroll", handleScroll));
  });

  const isDark = createMemo(() => theme() === "dark");

  createEffect(() => {
    if (typeof document === "undefined") return;

    const nextTheme = theme();
    const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.classList.toggle("dark", nextTheme === "dark");

    if (themeColor) {
      themeColor.content = nextTheme === "dark" ? "#10120f" : "#f7f3eb";
    }
  });

  const toggleTheme = () => {
    const nextTheme = isDark() ? "light" : "dark";
    setTheme(nextTheme);

    try {
      window.localStorage.setItem("kairo-theme", nextTheme);
    } catch {
      // The visual theme should still switch if storage is unavailable.
    }
  };

  if (intentPage) {
    return (
      <div class="min-h-screen bg-paper text-ink antialiased transition-colors duration-500 dark:bg-ink dark:text-paper">
        <Header isDark={isDark()} isHome={false} onToggleTheme={toggleTheme} />
        <IntentPage page={intentPage} />
        <Footer isHome={false} />
      </div>
    );
  }

  return (
    <div class="min-h-screen bg-paper text-ink antialiased transition-colors duration-500 dark:bg-ink dark:text-paper">
      <Header isDark={isDark()} isHome={true} onToggleTheme={toggleTheme} />
      <main>
        <section class="relative isolate overflow-hidden px-5 pt-24 sm:px-8 lg:px-10" aria-labelledby="hero-title">
          <div class="absolute inset-0 -z-20 bg-paper dark:bg-ink" />

          <div class="mx-auto grid min-h-[calc(100svh-4.5rem)] max-w-6xl items-center gap-12 pb-14 pt-10 lg:grid-cols-[0.95fr_0.85fr] lg:pb-20">
            <div class="max-w-2xl">
              <a
                href="#features"
                class="group mb-7 inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/55 px-3 py-2 text-sm font-medium text-ink shadow-sm backdrop-blur transition hover:border-ember/35 hover:text-ember dark:border-white/10 dark:bg-white/5 dark:text-paper dark:hover:border-ember/60"
              >
                <Icon name="sparkles" size={16} />
                RSVP reading app for Android
                <Icon name="arrowRight" size={15} class="transition group-hover:translate-x-0.5" />
              </a>

              <h1 id="hero-title" class="max-w-4xl text-balance text-6xl font-semibold leading-[0.92] tracking-normal text-ink sm:text-7xl lg:text-[6.5rem] dark:text-paper">
                Kairo
              </h1>
              <p class="mt-7 max-w-2xl text-pretty text-xl leading-8 text-ink/72 dark:text-paper/72">
                A calm RSVP reading app for Android, built for speed reading without chaos. Import DRM-free EPUB or MOBI books, read normally, then shift into focused word-by-word momentum.
              </p>

              <HeroActions />

              <dl class="mt-12 grid max-w-2xl grid-cols-3 gap-4 border-y border-ink/10 py-5 dark:border-white/10">
                <Stat label="Formats" value="EPUB / MOBI" />
                <Stat label="Modes" value="Reader + RSVP" />
                <Stat label="Pacing" value="Adaptive" />
              </dl>
            </div>

            <div class="relative mx-auto flex min-h-[520px] w-full max-w-[500px] items-center justify-center lg:min-h-[640px] lg:justify-self-end">
              <figure class="hero-screenshot-frame relative z-10 w-[min(78vw,318px)]">
                <img
                  src="/assets/kairo-rsvp-preview.jpg"
                  alt="Kairo RSVP reader screen showing the focused word, surrounding reading context, playback controls, position, and speed."
                  class="hero-screenshot-image"
                />
              </figure>
            </div>
          </div>
        </section>

        <section id="features" class="relative px-5 py-24 sm:px-8 lg:px-10">
          <div class="mx-auto max-w-7xl">
            <div class="mb-12 max-w-3xl">
              <p class="text-sm font-semibold uppercase tracking-[0.18em] text-ember">Reader workflow</p>
              <h2 class="mt-4 text-balance text-4xl font-semibold tracking-normal sm:text-5xl">
                From library to high-speed focus, the path stays short.
              </h2>
            </div>

            <div class="grid gap-10 lg:grid-cols-[0.92fr_1.08fr]">
              <div class="lg:sticky lg:top-28 lg:h-[calc(100svh-8rem)]">
                <FeatureVisual feature={features[activeFeature()] ?? features[0]} index={activeFeature()} />
              </div>

              <div class="space-y-5 lg:space-y-8">
                <For each={features}>
                  {(feature, index) => (
                    <article class="feature-panel min-h-[52svh] rounded-lg border border-ink/10 bg-white/58 p-6 shadow-soft backdrop-blur transition dark:border-white/10 dark:bg-white/[0.045] dark:shadow-darksoft sm:p-8">
                      <div class="mb-8 flex items-center justify-between gap-4">
                        <span class="text-sm font-semibold uppercase tracking-[0.18em] text-ember">{feature.eyebrow}</span>
                        <span class="rounded-full border border-ink/10 px-3 py-1 text-xs font-semibold text-ink/56 dark:border-white/10 dark:text-paper/54">
                          0{index() + 1}
                        </span>
                      </div>
                      <h3 class="max-w-xl text-3xl font-semibold tracking-normal">{feature.title}</h3>
                      <p class="mt-5 max-w-2xl text-lg leading-8 text-ink/68 dark:text-paper/68">{feature.body}</p>
                      <div class="mt-10 inline-flex items-center gap-3 rounded-full border border-ink/10 px-4 py-2 text-sm font-semibold text-moss dark:border-white/10 dark:text-veil">
                        <Icon name="check" size={16} />
                        {feature.metric}
                      </div>
                    </article>
                  )}
                </For>
              </div>
            </div>
          </div>
        </section>

        <section id="about" class="border-y border-ink/10 bg-veil/55 px-5 py-24 transition-colors dark:border-white/10 dark:bg-white/[0.035] sm:px-8 lg:px-10">
          <div class="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.18em] text-ember">About the project</p>
              <h2 class="mt-4 text-balance text-4xl font-semibold tracking-normal sm:text-5xl">
                Speed without the agitated feeling.
              </h2>
            </div>
            <div class="space-y-7 text-lg leading-8 text-ink/72 dark:text-paper/70">
              <p>
                Most reading apps treat RSVP as a side feature. Kairo starts with the RSVP reading loop and builds outward: import a book, read in a quiet scrollable reader, then launch speed reading from the exact place you are already focused.
              </p>
              <p>
                The engine shapes timing around punctuation, sentence flow, long words, phrase rhythm, page breaks, and readability floors. The result is a focused reader for people who want forward motion without turning reading into visual stress.
              </p>
            </div>
          </div>
        </section>

        <section id="technical" class="px-5 py-24 sm:px-8 lg:px-10">
          <div class="mx-auto max-w-7xl">
            <div class="grid gap-12 lg:grid-cols-[1fr_1fr]">
              <div>
                <p class="text-sm font-semibold uppercase tracking-[0.18em] text-ember">Under the hood</p>
                <h2 class="mt-4 text-balance text-4xl font-semibold tracking-normal sm:text-5xl">
                  Native Android, local-first reading state, tuned RSVP pacing.
                </h2>
                <p class="mt-6 max-w-2xl text-lg leading-8 text-ink/68 dark:text-paper/68">
                  Kairo is built as a native Kotlin app with Compose surfaces, local persistence, parser work for real-world ebooks, and language-aware tokenization foundations for Latin, CJK, and RTL text flows.
                </p>
              </div>

              <div class="grid gap-3 sm:grid-cols-2">
                <For each={technicalDetails}>
                  {(detail) => (
                    <div class="rounded-lg border border-ink/10 bg-white/56 p-4 text-sm font-semibold text-ink/76 dark:border-white/10 dark:bg-white/[0.04] dark:text-paper/74">
                      {detail}
                    </div>
                  )}
                </For>
              </div>
            </div>

            <div class="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <TechMetric icon="gauge" label="Speed bands" value="300 to 1,800+ WPM controls" />
              <TechMetric icon="timer" label="Pause shaping" value="Paragraph and page-break breathing" />
              <TechMetric icon="brain" label="Readability" value="Length, syllable, rarity, and complexity timing" />
              <TechMetric icon="book" label="Reader state" value="Progress, bookmarks, preferences" />
            </div>
          </div>
        </section>

        <section class="px-5 pb-24 sm:px-8 lg:px-10" aria-labelledby="profiles-title">
          <div class="mx-auto max-w-7xl rounded-lg border border-ink/10 bg-white/58 p-6 dark:border-white/10 dark:bg-white/[0.045] sm:p-8 lg:p-10">
            <div class="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p class="text-sm font-semibold uppercase tracking-[0.18em] text-ember">RSVP profiles</p>
                <h2 id="profiles-title" class="mt-4 text-3xl font-semibold tracking-normal sm:text-4xl">
                  Choose the rhythm for the material.
                </h2>
              </div>
              <p class="max-w-xl text-base leading-7 text-ink/64 dark:text-paper/62">
                Profiles tune cadence, punctuation, difficulty holds, and ramping without requiring every reader to start from raw sliders.
              </p>
            </div>
            <div class="grid gap-3 md:grid-cols-2 lg:grid-cols-7">
              <For each={profiles}>
                {([name, description]) => (
                  <div class="rounded-lg border border-ink/10 p-4 dark:border-white/10">
                    <h3 class="text-base font-semibold">{name}</h3>
                    <p class="mt-3 text-sm leading-6 text-ink/62 dark:text-paper/60">{description}</p>
                  </div>
                )}
              </For>
            </div>
          </div>
        </section>

        <section class="px-5 pb-28 sm:px-8 lg:px-10" aria-labelledby="seo-title">
          <div class="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.18em] text-ember">Calm speed reading</p>
              <h2 id="seo-title" class="mt-4 text-balance text-4xl font-semibold tracking-normal sm:text-5xl">
                For readers searching for an RSVP reading app.
              </h2>
            </div>
            <div>
              <p class="text-lg leading-8 text-ink/70 dark:text-paper/68">
                Kairo is for RSVP reading app searches, Android RSVP reader workflows, speed reading practice, calm reader sessions, EPUB speed reading, MOBI ebook import, and focus reading where the experience stays sparse, readable, and under the reader's control.
              </p>
              <div class="mt-8 flex flex-wrap gap-2">
                <For each={keywords}>
                  {(keyword) => (
                    <span class="rounded-full border border-ink/10 px-3 py-1.5 text-sm font-semibold text-ink/58 dark:border-white/10 dark:text-paper/56">
                      {keyword}
                    </span>
                  )}
                </For>
              </div>
            </div>
          </div>
        </section>

        <CoverageSection />

        <section id="faq" class="border-t border-ink/10 bg-veil/42 px-5 py-24 transition-colors dark:border-white/10 dark:bg-white/[0.03] sm:px-8 lg:px-10" aria-labelledby="faq-title">
          <div class="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.72fr_1.28fr]">
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.18em] text-ember">FAQ</p>
              <h2 id="faq-title" class="mt-4 text-balance text-4xl font-semibold tracking-normal sm:text-5xl">
                Common questions about RSVP reading with Kairo.
              </h2>
              <p class="mt-6 max-w-xl text-lg leading-8 text-ink/68 dark:text-paper/66">
                Short answers for readers comparing RSVP reading, calm speed reading apps, Android ebook readers, EPUB import, MOBI import, and ORP highlighting.
              </p>
            </div>

            <div class="grid gap-4">
              <For each={faqItems}>
                {(item) => (
                  <article class="rounded-lg border border-ink/10 bg-white/60 p-5 shadow-sm transition dark:border-white/10 dark:bg-white/[0.045] sm:p-6">
                    <h3 class="text-xl font-semibold tracking-normal text-ink dark:text-paper">{item.question}</h3>
                    <p class="mt-4 text-base leading-7 text-ink/68 dark:text-paper/66">{item.answer}</p>
                  </article>
                )}
              </For>
            </div>
          </div>

          <script type="application/ld+json">{JSON.stringify(faqStructuredData)}</script>
        </section>
      </main>

      <Footer isHome={true} />
    </div>
  );
}

function CoverageSection() {
  return (
    <section id="coverage" class="border-t border-ink/10 px-5 pb-28 pt-24 dark:border-white/10 sm:px-8 lg:px-10" aria-labelledby="coverage-title">
      <div class="mx-auto max-w-7xl">
        <div class="mb-10 max-w-3xl">
          <p class="text-sm font-semibold uppercase tracking-[0.18em] text-ember">Reading guides</p>
          <h2 id="coverage-title" class="mt-4 text-balance text-4xl font-semibold tracking-normal sm:text-5xl">
            More ways to find the right RSVP reader.
          </h2>
          <p class="mt-6 text-lg leading-8 text-ink/68 dark:text-paper/66">
            Focused pages cover the searches readers actually use: RSVP reading app, Android RSVP reader, EPUB speed reading, MOBI import, ORP highlighting, and calm speed reading.
          </p>
        </div>

        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <For each={seoPages}>
            {(page) => (
              <a
                href={page.path}
                class="group rounded-lg border border-ink/10 bg-white/60 p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-ember/35 hover:shadow-soft dark:border-white/10 dark:bg-white/[0.045] dark:hover:border-ember/55 sm:p-6"
              >
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-ember">{page.eyebrow}</p>
                <h3 class="mt-4 text-2xl font-semibold tracking-normal">{page.navLabel}</h3>
                <p class="mt-4 text-sm leading-6 text-ink/64 dark:text-paper/62">{page.description}</p>
                <span class="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-moss transition group-hover:text-ember dark:text-veil">
                  Read the guide
                  <Icon name="arrowRight" size={15} class="transition group-hover:translate-x-0.5" />
                </span>
              </a>
            )}
          </For>
        </div>
      </div>
    </section>
  );
}

function IntentPage(props: { page: SeoPage }) {
  return (
    <main>
      <article class="px-5 pb-20 pt-28 sm:px-8 lg:px-10">
        <div class="mx-auto max-w-5xl">
          <nav class="mb-9 flex flex-wrap items-center gap-2 text-sm font-semibold text-ink/52 dark:text-paper/50" aria-label="Breadcrumb">
            <a class="hover:text-ember" href="/">Kairo</a>
            <span aria-hidden="true">/</span>
            <span class="text-ink/70 dark:text-paper/68">{props.page.navLabel}</span>
          </nav>

          <p class="text-sm font-semibold uppercase tracking-[0.18em] text-ember">{props.page.eyebrow}</p>
          <h1 class="mt-5 max-w-4xl text-balance text-5xl font-semibold leading-[0.98] tracking-normal sm:text-6xl">
            {props.page.heading}
          </h1>
          <p class="mt-7 max-w-3xl text-xl leading-8 text-ink/72 dark:text-paper/70">{props.page.summary}</p>

          <div class="mt-8 flex flex-wrap gap-2">
            <For each={props.page.keywords}>
              {(keyword) => (
                <span class="rounded-full border border-ink/10 px-3 py-1.5 text-sm font-semibold text-ink/58 dark:border-white/10 dark:text-paper/56">
                  {keyword}
                </span>
              )}
            </For>
          </div>
        </div>
      </article>

      <section class="border-y border-ink/10 bg-veil/45 px-5 py-20 dark:border-white/10 dark:bg-white/[0.03] sm:px-8 lg:px-10">
        <div class="mx-auto grid max-w-7xl gap-6 lg:grid-cols-3">
          <For each={props.page.sections}>
            {(section) => (
              <section class="rounded-lg border border-ink/10 bg-white/60 p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.045]">
                <h2 class="text-2xl font-semibold tracking-normal">{section.title}</h2>
                <p class="mt-5 text-base leading-7 text-ink/68 dark:text-paper/66">{section.body}</p>
              </section>
            )}
          </For>
        </div>
      </section>

      <section class="px-5 py-20 sm:px-8 lg:px-10">
        <div class="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.82fr_1.18fr]">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.18em] text-ember">Why it fits</p>
            <h2 class="mt-4 text-balance text-4xl font-semibold tracking-normal sm:text-5xl">
              Built for focused ebook reading, not only speed.
            </h2>
          </div>
          <div class="grid gap-3 sm:grid-cols-2">
            <For each={props.page.highlights}>
              {(highlight) => (
                <div class="flex items-center gap-3 rounded-lg border border-ink/10 bg-white/58 p-4 text-sm font-semibold text-ink/72 dark:border-white/10 dark:bg-white/[0.04] dark:text-paper/70">
                  <Icon name="check" size={16} />
                  {highlight}
                </div>
              )}
            </For>
          </div>
        </div>
      </section>

      <section class="border-t border-ink/10 px-5 pb-24 pt-20 dark:border-white/10 sm:px-8 lg:px-10">
        <div class="mx-auto max-w-7xl">
          <div class="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.18em] text-ember">Related reading</p>
              <h2 class="mt-4 text-3xl font-semibold tracking-normal sm:text-4xl">Explore the rest of Kairo.</h2>
            </div>
            <a class="inline-flex items-center gap-2 text-sm font-semibold text-moss hover:text-ember dark:text-veil" href="/#features">
              See product features
              <Icon name="arrowRight" size={15} />
            </a>
          </div>

          <div class="grid gap-4 md:grid-cols-3">
            <For each={props.page.related.map((path) => seoPages.find((page) => page.path === path)).filter((page): page is SeoPage => Boolean(page))}>
              {(page) => (
                <a class="rounded-lg border border-ink/10 bg-white/58 p-5 transition hover:border-ember/40 dark:border-white/10 dark:bg-white/[0.04]" href={page.path}>
                  <p class="text-sm font-semibold text-ember">{page.eyebrow}</p>
                  <h3 class="mt-3 text-xl font-semibold">{page.navLabel}</h3>
                  <p class="mt-3 text-sm leading-6 text-ink/62 dark:text-paper/60">{page.summary}</p>
                </a>
              )}
            </For>
          </div>
        </div>
      </section>

      <script type="application/ld+json">{JSON.stringify(intentPageStructuredData(props.page))}</script>
    </main>
  );
}

function intentPageStructuredData(page: SeoPage) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${siteOrigin}${page.path}#webpage`,
    url: `${siteOrigin}${page.path}`,
    name: page.title,
    description: page.description,
    isPartOf: {
      "@id": `${siteOrigin}/#website`,
    },
    about: page.keywords.map((keyword) => ({
      "@type": "Thing",
      name: keyword,
    })),
  };
}

function Footer(props: { isHome: boolean }) {
  const sectionHref = (hash: string) => (props.isHome ? hash : `/${hash}`);

  return (
    <footer class="border-t border-ink/10 px-5 py-10 dark:border-white/10 sm:px-8 lg:px-10">
      <div class="mx-auto flex max-w-7xl flex-col justify-between gap-6 text-sm text-ink/56 dark:text-paper/52 md:flex-row md:items-center">
        <div class="flex items-center gap-3">
          <img src="/assets/kairo-icon.png" alt="" class="h-8 w-8 rounded-lg" />
          <span>Kairo RSVP Reader</span>
        </div>
        <div class="flex flex-wrap gap-4">
          <a class="hover:text-ember" href={sectionHref("#features")}>Features</a>
          <a class="hover:text-ember" href={sectionHref("#about")}>About</a>
          <a class="hover:text-ember" href={sectionHref("#technical")}>Technical</a>
          <a class="hover:text-ember" href={sectionHref("#coverage")}>Guides</a>
          <a class="hover:text-ember" href={sectionHref("#faq")}>FAQ</a>
          <a class="inline-flex items-center gap-1.5 hover:text-ember" href="https://github.com/Steadyx/Kairo" rel="noreferrer" target="_blank">
            <Icon name="github" size={15} />
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}

function Header(props: { isDark: boolean; isHome: boolean; onToggleTheme: () => void }) {
  const sectionHref = (hash: string) => (props.isHome ? hash : `/${hash}`);

  return (
    <header class="fixed inset-x-0 top-0 z-50 border-b border-ink/10 bg-paper/72 px-5 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-ink/72 sm:px-8 lg:px-10">
      <nav class="mx-auto flex max-w-7xl items-center justify-between gap-5" aria-label="Primary navigation">
        <a href="/" class="flex items-center gap-3 text-sm font-semibold">
          <img src="/assets/kairo-icon.png" alt="" class="h-8 w-8 rounded-lg" />
          <span>Kairo</span>
        </a>
        <div class="hidden items-center gap-6 text-sm font-medium text-ink/62 dark:text-paper/62 md:flex">
          <a class="hover:text-ember" href={sectionHref("#features")}>Features</a>
          <a class="hover:text-ember" href={sectionHref("#about")}>About</a>
          <a class="hover:text-ember" href={sectionHref("#technical")}>Technical</a>
          <a class="hover:text-ember" href={sectionHref("#coverage")}>Guides</a>
          <a class="hover:text-ember" href={sectionHref("#faq")}>FAQ</a>
        </div>
        <button
          type="button"
          onClick={props.onToggleTheme}
          class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-ink/10 bg-white/60 text-ink transition hover:border-ember/45 hover:text-ember dark:border-white/10 dark:bg-white/5 dark:text-paper"
          aria-label={`Switch to ${props.isDark ? "light" : "dark"} theme`}
        >
          <Show when={props.isDark} fallback={<Icon name="moon" size={18} />}>
            <Icon name="sun" size={18} />
          </Show>
        </button>
      </nav>
    </header>
  );
}

function HeroActions() {
  return (
    <div class="mt-10 max-w-2xl">
      <div class="grid gap-3 sm:grid-cols-2">
        <button
          type="button"
          disabled
          class="inline-flex min-h-[68px] w-full cursor-default items-center gap-3 rounded-lg bg-[#111] px-4 py-3 text-left text-white shadow-soft ring-1 ring-black/10 transition dark:bg-paper dark:text-ink dark:ring-white/10"
          aria-label="Kairo is coming soon on Google Play"
        >
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white text-[#111] dark:bg-ink dark:text-paper">
            <Icon name="play" size={21} fill="currentColor" strokeWidth={0} class="ml-0.5" />
          </span>
          <span class="min-w-0">
            <span class="block text-[0.65rem] font-semibold uppercase leading-none tracking-[0.14em] opacity-72">Coming soon on</span>
            <span class="mt-1 block text-lg font-semibold leading-none">Google Play</span>
          </span>
        </button>

        <a
          class="inline-flex min-h-[68px] w-full items-center gap-3 rounded-lg border border-moss/30 bg-moss px-4 py-3 text-left text-white shadow-soft ring-1 ring-black/10 transition hover:-translate-y-0.5 hover:bg-ink dark:border-white/10 dark:bg-white/10 dark:text-paper dark:hover:bg-white/[0.15]"
          href="https://github.com/Steadyx/Kairo"
          rel="noreferrer"
          target="_blank"
          aria-label="Contribute to Kairo on GitHub"
        >
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white/15 text-white ring-1 ring-white/20 dark:bg-paper dark:text-ink">
            <Icon name="github" size={20} />
          </span>
          <span class="min-w-0">
            <span class="block text-[0.65rem] font-semibold uppercase leading-none tracking-[0.14em] opacity-72">Want to contribute?</span>
            <span class="mt-1 block text-lg font-semibold leading-none">View on GitHub</span>
          </span>
        </a>
      </div>

      <div class="mt-4 flex flex-wrap items-center gap-2">
        <a
          class="inline-flex items-center gap-2 rounded-full border border-ink/12 px-4 py-2 text-sm font-semibold text-ink/70 transition hover:border-ember/50 hover:text-ember dark:border-white/12 dark:text-paper/70 dark:hover:border-ember/70"
          href="#features"
        >
          Explore features
          <Icon name="arrowRight" size={15} />
        </a>
        <a
          class="inline-flex items-center gap-2 rounded-full border border-ink/12 px-4 py-2 text-sm font-semibold text-ink/70 transition hover:border-ember/50 hover:text-ember dark:border-white/12 dark:text-paper/70 dark:hover:border-ember/70"
          href="#technical"
        >
          <Icon name="layers" size={15} />
          Technical notes
        </a>
        <span
          aria-disabled="true"
          class="inline-flex cursor-default items-center gap-2 rounded-full border border-[#191611]/10 bg-[#ffdd00] px-4 py-2 text-sm font-semibold text-[#191611] shadow-sm ring-1 ring-white/35"
        >
          <Icon name="coffee" size={15} />
          Buy me a coffee
        </span>
      </div>
    </div>
  );
}

function FeatureVisual(props: { feature: (typeof features)[number]; index: number }) {
  return (
    <div class="relative flex h-full min-h-[460px] items-center justify-center overflow-hidden rounded-lg border border-ink/10 bg-veil/60 p-5 dark:border-white/10 dark:bg-white/[0.035]">
      <div class="absolute inset-x-0 top-0 flex justify-between px-5 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-ink/42 dark:text-paper/38">
        <span>Reading path</span>
        <span>0{props.index + 1}</span>
      </div>
      <div class="feature-device w-full max-w-[420px]">
        <div class="mb-6 flex items-center justify-between">
          <div>
            <p class="text-sm font-semibold text-ember">{props.feature.eyebrow}</p>
            <p class="mt-1 text-2xl font-semibold">{props.feature.metric}</p>
          </div>
          <div class="flex h-12 w-12 items-center justify-center rounded-lg bg-ink text-paper dark:bg-paper dark:text-ink">
            <Show when={props.index === 0} fallback={<Icon name="gauge" size={20} />}>
              <Icon name="book" size={20} />
            </Show>
          </div>
        </div>
        <div class="space-y-3">
          <div class="h-3 w-5/6 rounded-full bg-ink/15 dark:bg-white/16" />
          <div class="h-3 w-2/3 rounded-full bg-ink/10 dark:bg-white/12" />
          <div class="h-3 w-4/5 rounded-full bg-ink/10 dark:bg-white/12" />
        </div>
        <div class="my-10 flex items-center justify-center gap-2">
          <span class="h-px w-24 bg-ink/15 dark:bg-white/15" />
          <span class="rounded-full bg-ember px-4 py-2 text-lg font-semibold text-white">{props.feature.eyebrow}</span>
          <span class="h-px w-24 bg-ink/15 dark:bg-white/15" />
        </div>
        <p class="font-serif text-2xl leading-9 text-ink/72 dark:text-paper/68">{props.feature.title}</p>
      </div>
    </div>
  );
}

function Stat(props: { label: string; value: string }) {
  return (
    <div>
      <dt class="text-xs font-semibold uppercase tracking-[0.16em] text-ink/42 dark:text-paper/40">{props.label}</dt>
      <dd class="mt-2 text-sm font-semibold sm:text-base">{props.value}</dd>
    </div>
  );
}

function TechMetric(props: { icon: IconName; label: string; value: string }) {
  return (
    <div class="rounded-lg border border-ink/10 bg-white/58 p-5 dark:border-white/10 dark:bg-white/[0.04]">
      <div class="mb-5 flex h-10 w-10 items-center justify-center rounded-lg bg-ink text-paper dark:bg-paper dark:text-ink">
        <Icon name={props.icon} size={20} />
      </div>
      <h3 class="font-semibold">{props.label}</h3>
      <p class="mt-3 text-sm leading-6 text-ink/62 dark:text-paper/60">{props.value}</p>
    </div>
  );
}

type IconName =
  | "arrowRight"
  | "book"
  | "brain"
  | "check"
  | "coffee"
  | "gauge"
  | "github"
  | "layers"
  | "moon"
  | "play"
  | "sparkles"
  | "sun"
  | "timer";

type IconNode =
  | { tag: "path"; d: string }
  | { tag: "circle"; cx: number; cy: number; r: number }
  | { tag: "line"; x1: number; x2: number; y1: number; y2: number };

const iconNodes: Record<IconName, readonly IconNode[]> = {
  arrowRight: [
    { tag: "path", d: "M5 12h14" },
    { tag: "path", d: "m12 5 7 7-7 7" },
  ],
  book: [
    { tag: "path", d: "M12 7v14" },
    { tag: "path", d: "M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" },
  ],
  brain: [
    { tag: "path", d: "M12 18V5" },
    { tag: "path", d: "M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4" },
    { tag: "path", d: "M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5" },
    { tag: "path", d: "M17.997 5.125a4 4 0 0 1 2.526 5.77" },
    { tag: "path", d: "M18 18a4 4 0 0 0 2-7.464" },
    { tag: "path", d: "M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517" },
    { tag: "path", d: "M6 18a4 4 0 0 1-2-7.464" },
    { tag: "path", d: "M6.003 5.125a4 4 0 0 0-2.526 5.77" },
  ],
  check: [
    { tag: "path", d: "M20 6 9 17l-5-5" },
  ],
  coffee: [
    { tag: "path", d: "M10 2v2" },
    { tag: "path", d: "M14 2v2" },
    { tag: "path", d: "M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1" },
    { tag: "path", d: "M6 2v2" },
  ],
  gauge: [
    { tag: "path", d: "m12 14 4-4" },
    { tag: "path", d: "M3.34 19a10 10 0 1 1 17.32 0" },
  ],
  github: [
    { tag: "path", d: "M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.5-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" },
    { tag: "path", d: "M9 18c-4.51 2-5-2-7-2" },
  ],
  layers: [
    { tag: "path", d: "M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z" },
    { tag: "path", d: "M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12" },
    { tag: "path", d: "M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17" },
  ],
  moon: [
    { tag: "path", d: "M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" },
  ],
  play: [
    { tag: "path", d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" },
  ],
  sparkles: [
    { tag: "path", d: "M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" },
    { tag: "path", d: "M20 2v4" },
    { tag: "path", d: "M22 4h-4" },
    { tag: "circle", cx: 4, cy: 20, r: 2 },
  ],
  sun: [
    { tag: "circle", cx: 12, cy: 12, r: 4 },
    { tag: "path", d: "M12 2v2" },
    { tag: "path", d: "M12 20v2" },
    { tag: "path", d: "m4.93 4.93 1.41 1.41" },
    { tag: "path", d: "m17.66 17.66 1.41 1.41" },
    { tag: "path", d: "M2 12h2" },
    { tag: "path", d: "M20 12h2" },
    { tag: "path", d: "m6.34 17.66-1.41 1.41" },
    { tag: "path", d: "m19.07 4.93-1.41 1.41" },
  ],
  timer: [
    { tag: "line", x1: 10, x2: 14, y1: 2, y2: 2 },
    { tag: "line", x1: 12, x2: 15, y1: 14, y2: 11 },
    { tag: "circle", cx: 12, cy: 14, r: 8 },
  ],
};

function Icon(props: { name: IconName; size?: number; class?: string; fill?: "none" | "currentColor"; strokeWidth?: number }) {
  const size = () => props.size ?? 18;
  const fill = () => props.fill ?? "none";
  const strokeWidth = () => props.strokeWidth ?? 2;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size()}
      height={size()}
      viewBox="0 0 24 24"
      fill={fill()}
      stroke="currentColor"
      stroke-width={strokeWidth()}
      stroke-linecap="round"
      stroke-linejoin="round"
      class={props.class}
      aria-hidden="true"
    >
      <For each={iconNodes[props.name]}>{(node) => <IconShape node={node} />}</For>
    </svg>
  );
}

function IconShape(props: { node: IconNode }) {
  switch (props.node.tag) {
    case "circle":
      return <circle cx={props.node.cx} cy={props.node.cy} r={props.node.r} />;
    case "line":
      return <line x1={props.node.x1} x2={props.node.x2} y1={props.node.y1} y2={props.node.y2} />;
    case "path":
      return <path d={props.node.d} />;
  }
}

export default App;
