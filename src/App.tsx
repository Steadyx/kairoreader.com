import { For, Show, createEffect, createMemo, createSignal, onCleanup, onMount } from "solid-js";
import ArrowRight from "lucide-solid/icons/arrow-right";
import BookOpen from "lucide-solid/icons/book-open";
import Brain from "lucide-solid/icons/brain";
import Check from "lucide-solid/icons/check";
import Coffee from "lucide-solid/icons/coffee";
import Gauge from "lucide-solid/icons/gauge";
import GitFork from "lucide-solid/icons/git-fork";
import Layers from "lucide-solid/icons/layers";
import Moon from "lucide-solid/icons/moon";
import Play from "lucide-solid/icons/play";
import Sparkles from "lucide-solid/icons/sparkles";
import Sun from "lucide-solid/icons/sun";
import Timer from "lucide-solid/icons/timer";
import type { LucideIcon } from "lucide-solid";

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
  "RSVP reading",
  "speed reading",
  "calm reader",
  "focus reading",
  "Android ebook reader",
  "ORP highlighting",
  "EPUB reader",
  "MOBI reader",
];

function App() {
  const [theme, setTheme] = createSignal<Theme>("dark");
  const [activeFeature, setActiveFeature] = createSignal(0);

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

  return (
    <div class="min-h-screen bg-paper text-ink antialiased transition-colors duration-500 dark:bg-ink dark:text-paper">
      <Header isDark={isDark()} onToggleTheme={toggleTheme} />
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
                RSVP-first reader for Android
                <Icon name="arrowRight" size={15} class="transition group-hover:translate-x-0.5" />
              </a>

              <h1 id="hero-title" class="max-w-4xl text-balance text-6xl font-semibold leading-[0.92] tracking-normal text-ink sm:text-7xl lg:text-[6.5rem] dark:text-paper">
                Kairo
              </h1>
              <p class="mt-7 max-w-2xl text-pretty text-xl leading-8 text-ink/72 dark:text-paper/72">
                A calm RSVP reader for Android, built for speed reading without chaos. Import DRM-free EPUB or MOBI books, read normally, then shift into focused word-by-word momentum.
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
              <p class="text-sm font-semibold uppercase tracking-[0.18em] text-ember">Feature scroller</p>
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
                <p class="text-sm font-semibold uppercase tracking-[0.18em] text-ember">Small technical details</p>
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
              <p class="text-sm font-semibold uppercase tracking-[0.18em] text-ember">Search intent</p>
              <h2 id="seo-title" class="mt-4 text-balance text-4xl font-semibold tracking-normal sm:text-5xl">
                For readers searching for calm speed.
              </h2>
            </div>
            <div>
              <p class="text-lg leading-8 text-ink/70 dark:text-paper/68">
                Kairo is for RSVP reading, speed reading practice, calm reader workflows, focus reading sessions, and mobile ebook reading where the experience stays sparse, readable, and under the reader's control.
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
      </main>

      <footer class="border-t border-ink/10 px-5 py-10 dark:border-white/10 sm:px-8 lg:px-10">
        <div class="mx-auto flex max-w-7xl flex-col justify-between gap-6 text-sm text-ink/56 dark:text-paper/52 md:flex-row md:items-center">
          <div class="flex items-center gap-3">
            <img src="/assets/kairo-icon.png" alt="" class="h-8 w-8 rounded-lg" />
            <span>Kairo RSVP Reader</span>
          </div>
          <div class="flex flex-wrap gap-4">
            <a class="hover:text-ember" href="#features">Features</a>
            <a class="hover:text-ember" href="#about">About</a>
            <a class="hover:text-ember" href="#technical">Technical</a>
            <a class="inline-flex items-center gap-1.5 hover:text-ember" href="https://github.com/Steadyx/Kairo" rel="noreferrer" target="_blank">
              <Icon name="github" size={15} />
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Header(props: { isDark: boolean; onToggleTheme: () => void }) {
  return (
    <header class="fixed inset-x-0 top-0 z-50 border-b border-ink/10 bg-paper/72 px-5 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-ink/72 sm:px-8 lg:px-10">
      <nav class="mx-auto flex max-w-7xl items-center justify-between gap-5" aria-label="Primary navigation">
        <a href="#" class="flex items-center gap-3 text-sm font-semibold">
          <img src="/assets/kairo-icon.png" alt="" class="h-8 w-8 rounded-lg" />
          <span>Kairo</span>
        </a>
        <div class="hidden items-center gap-6 text-sm font-medium text-ink/62 dark:text-paper/62 md:flex">
          <a class="hover:text-ember" href="#features">Features</a>
          <a class="hover:text-ember" href="#about">About</a>
          <a class="hover:text-ember" href="#technical">Technical</a>
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
      <div class="flex flex-col gap-3 sm:flex-row sm:items-stretch">
        <button
          type="button"
          disabled
          class="inline-flex min-h-[68px] w-full cursor-default items-center gap-3 rounded-lg bg-[#111] px-4 py-3 text-left text-white shadow-soft ring-1 ring-black/10 transition dark:bg-paper dark:text-ink dark:ring-white/10 sm:w-auto sm:min-w-[252px]"
          aria-label="Kairo is coming soon on Google Play"
        >
          <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-white text-[#111] dark:bg-ink dark:text-paper">
            <Play size={21} fill="currentColor" strokeWidth={0} class="ml-0.5" aria-hidden="true" />
          </span>
          <span class="min-w-0">
            <span class="block text-[0.65rem] font-semibold uppercase leading-none tracking-[0.14em] opacity-72">Coming soon on</span>
            <span class="mt-1 block text-lg font-semibold leading-none">Google Play</span>
          </span>
        </button>

        <a
          class="inline-flex min-h-[68px] w-full items-center justify-center gap-2 rounded-lg border border-ink/12 bg-white/46 px-5 py-3 text-sm font-semibold text-ink shadow-sm transition hover:border-ember/50 hover:text-ember dark:border-white/12 dark:bg-white/[0.045] dark:text-paper dark:hover:border-ember/70 sm:w-auto"
          href="#features"
        >
          Explore features
          <Icon name="arrowRight" size={16} class="transition" />
        </a>
      </div>

      <div class="mt-4 flex flex-wrap items-center gap-2">
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
        <span>Kairo loop</span>
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

const iconComponents: Record<IconName, LucideIcon> = {
  arrowRight: ArrowRight,
  book: BookOpen,
  brain: Brain,
  check: Check,
  coffee: Coffee,
  gauge: Gauge,
  github: GitFork,
  layers: Layers,
  moon: Moon,
  play: Play,
  sparkles: Sparkles,
  sun: Sun,
  timer: Timer,
};

function Icon(props: { name: IconName; size?: number; class?: string }) {
  const Component = iconComponents[props.name];

  return (
    <Component
      class={props.class}
      size={props.size ?? 18}
      strokeWidth={2}
      aria-hidden="true"
    />
  );
}

export default App;
