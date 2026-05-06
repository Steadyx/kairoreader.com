export const siteOrigin = "https://kairoreader.com";

export type SeoPage = {
  path: string;
  navLabel: string;
  eyebrow: string;
  title: string;
  description: string;
  heading: string;
  summary: string;
  keywords: readonly string[];
  sections: readonly {
    title: string;
    body: string;
  }[];
  highlights: readonly string[];
  related: readonly string[];
};

export const homeSeo = {
  path: "/",
  title: "Kairo | RSVP Reading App for Android",
  description:
    "Kairo is an RSVP reading app for Android with calm speed reading, EPUB and MOBI import, ORP highlighting, adaptive pacing, bookmarks, and low-distraction focus reading.",
  keywords:
    "RSVP reading app, Android RSVP reader, speed reading app, calm reader, focus reading, EPUB speed reading, MOBI reader, ORP highlighting",
};

export const seoPages: readonly SeoPage[] = [
  {
    path: "/rsvp-reading-app/",
    navLabel: "RSVP reading app",
    eyebrow: "RSVP reading app",
    title: "RSVP Reading App for Android | Kairo",
    description:
      "Kairo is an RSVP reading app for Android that turns EPUB and MOBI books into calm word-by-word speed reading sessions with ORP highlighting and adaptive pacing.",
    heading: "RSVP reading app for Android books.",
    summary:
      "Kairo is built around Rapid Serial Visual Presentation, so RSVP reading is not a hidden bonus mode. It is the main reading flow for people who want focused speed reading from their own ebooks.",
    keywords: ["RSVP reading app", "RSVP reader", "speed reading app", "Android reading app", "word-by-word reader"],
    sections: [
      {
        title: "What an RSVP reading app should do",
        body:
          "A useful RSVP reading app keeps words anchored in one place, reduces eye movement, and gives the reader enough control to stay comfortable. Kairo adds punctuation-aware timing, sentence flow, long-word holds, and reading profiles so the pace feels deliberate rather than frantic.",
      },
      {
        title: "Built for books, not only pasted text",
        body:
          "Many RSVP tools are simple text boxes. Kairo is also an Android ebook reader, so you can import DRM-free EPUB and MOBI files, keep bookmarks, resume progress, and move between normal reading and RSVP reading without losing your place.",
      },
      {
        title: "Calm speed reading on Android",
        body:
          "Kairo is designed for readers who want speed without visual stress. Low-glare themes, focus mode, ORP guidance, and adaptive pacing help keep reading steady when you are working through fiction, study material, or long-form documents.",
      },
    ],
    highlights: ["RSVP-first reading mode", "EPUB and MOBI import", "ORP highlighting", "Adaptive speed profiles"],
    related: ["/android-rsvp-reader/", "/calm-speed-reading-app/", "/orp-highlighting/"],
  },
  {
    path: "/android-rsvp-reader/",
    navLabel: "Android RSVP reader",
    eyebrow: "Android reader",
    title: "Android RSVP Reader for EPUB and MOBI Books | Kairo",
    description:
      "Use Kairo as an Android RSVP reader for DRM-free EPUB and MOBI books with local reading progress, bookmarks, focus mode, and calm speed reading profiles.",
    heading: "An Android RSVP reader for your own books.",
    summary:
      "Kairo combines an Android ebook reader with an RSVP reader, giving you a normal reading surface and a focused word-by-word mode in one local-first app.",
    keywords: ["Android RSVP reader", "Android ebook reader", "RSVP Android", "EPUB reader Android", "MOBI reader Android"],
    sections: [
      {
        title: "Read normally, then switch into RSVP",
        body:
          "Kairo keeps the transition short: import a book, browse chapters, read in a quiet scrollable view, then launch RSVP from the same reading position. The app is designed for switching modes without rebuilding your session from scratch.",
      },
      {
        title: "Local-first reading state",
        body:
          "Progress, bookmarks, preferences, and imported book data stay on the device. That matters for readers who want an Android reading app that feels private, predictable, and usable offline.",
      },
      {
        title: "Android-native reading controls",
        body:
          "Kairo uses native Android surfaces and tuning for focus reading, brightness, typography, pacing, and RSVP controls. The result is closer to a dedicated reader than a generic web widget wrapped in an app.",
      },
    ],
    highlights: ["Native Android app", "Reader plus RSVP mode", "Local progress and bookmarks", "Offline-friendly library"],
    related: ["/rsvp-reading-app/", "/mobi-epub-reader-android/", "/epub-speed-reading-app/"],
  },
  {
    path: "/epub-speed-reading-app/",
    navLabel: "EPUB speed reading",
    eyebrow: "EPUB speed reading",
    title: "EPUB Speed Reading App for Android | Kairo",
    description:
      "Kairo is an EPUB speed reading app for Android that imports DRM-free books and turns chapters into calm RSVP reading sessions with adaptive pacing.",
    heading: "Speed read EPUB books with RSVP pacing.",
    summary:
      "Kairo gives EPUB readers a focused speed reading path without giving up normal chapter navigation, progress, bookmarks, and reading context.",
    keywords: ["EPUB speed reading app", "EPUB RSVP reader", "EPUB reader Android", "speed read EPUB", "ebook speed reading"],
    sections: [
      {
        title: "EPUB import with reading context",
        body:
          "Kairo parses EPUB books into chapters, preserves useful reading structure, and keeps the library local. You can use the standard reader for context and move into RSVP mode when you want focused momentum.",
      },
      {
        title: "Adaptive timing for real prose",
        body:
          "Books are not flat streams of words. Kairo shapes RSVP timing around punctuation, phrase rhythm, longer words, page breaks, and paragraph breathing so EPUB speed reading stays readable.",
      },
      {
        title: "For study, fiction, and long-form reading",
        body:
          "The built-in profiles let you choose a slower study rhythm, a more natural narrative cadence, or a faster sprint mode. That makes EPUB speed reading useful for different material rather than one fixed pace.",
      },
    ],
    highlights: ["EPUB import", "Chapter-aware reading", "Paragraph and page-break pauses", "Study and sprint profiles"],
    related: ["/rsvp-reading-app/", "/android-rsvp-reader/", "/calm-speed-reading-app/"],
  },
  {
    path: "/orp-highlighting/",
    navLabel: "ORP highlighting",
    eyebrow: "ORP highlighting",
    title: "ORP Highlighting for RSVP Reading | Kairo",
    description:
      "Kairo uses ORP highlighting and guide controls to keep RSVP reading visually anchored around the optimal recognition point for calmer speed reading.",
    heading: "ORP highlighting for steadier RSVP reading.",
    summary:
      "Optimal Recognition Point guidance helps keep your eyes anchored while words change. Kairo uses that idea as part of a calmer RSVP reading system.",
    keywords: ["ORP highlighting", "optimal recognition point", "RSVP reading", "speed reading focus point", "word recognition"],
    sections: [
      {
        title: "Why ORP matters",
        body:
          "In RSVP reading, words appear in one focal area. ORP highlighting marks the point in a word that is usually fastest to recognize, reducing the amount of visual adjustment between words.",
      },
      {
        title: "Guidance without clutter",
        body:
          "Kairo keeps ORP guidance visible when it helps and pairs it with a low-distraction reading surface. The goal is to support recognition without turning the reading screen into a control panel.",
      },
      {
        title: "Paired with adaptive pacing",
        body:
          "ORP highlighting is only one part of readability. Kairo also adjusts timing for word length, punctuation, complexity, and pauses so the highlighted point has a rhythm that feels natural.",
      },
    ],
    highlights: ["Optimal recognition point", "Visual anchoring", "Focused word display", "Low-distraction guide controls"],
    related: ["/rsvp-reading-app/", "/calm-speed-reading-app/", "/epub-speed-reading-app/"],
  },
  {
    path: "/calm-speed-reading-app/",
    navLabel: "Calm speed reading",
    eyebrow: "Calm speed reading",
    title: "Calm Speed Reading App for Focused Reading | Kairo",
    description:
      "Kairo is a calm speed reading app for Android, built for focused RSVP reading with low-glare themes, adaptive pacing, ORP guidance, and reader profiles.",
    heading: "A calm speed reading app for focused sessions.",
    summary:
      "Kairo is designed for readers who want to move faster without making the screen feel rushed, noisy, or visually exhausting.",
    keywords: ["calm speed reading app", "focus reading app", "speed reading Android", "low distraction reader", "RSVP speed reading"],
    sections: [
      {
        title: "Speed without visual pressure",
        body:
          "Kairo uses a sparse reading surface, low-glare palettes, and predictable controls so speed reading feels measured. The app is built for concentration rather than novelty.",
      },
      {
        title: "Profiles for different reading moods",
        body:
          "Balanced, Chill, Narrative, Focus, Flow, Sprint, and Study profiles change the timing shape without forcing every reader into raw settings. You can choose a rhythm that fits the material.",
      },
      {
        title: "Useful for attention and reading flow",
        body:
          "A calm RSVP reading flow can help reduce scanning, backtracking, and visual wandering. Kairo supports that with anchored words, clear progress, bookmarks, and persistent preferences.",
      },
    ],
    highlights: ["Low-glare themes", "Focus mode", "Reader profiles", "Predictable controls"],
    related: ["/rsvp-reading-app/", "/orp-highlighting/", "/android-rsvp-reader/"],
  },
  {
    path: "/mobi-epub-reader-android/",
    navLabel: "MOBI and EPUB",
    eyebrow: "Book formats",
    title: "MOBI and EPUB Reader for Android with RSVP | Kairo",
    description:
      "Kairo is a MOBI and EPUB reader for Android with RSVP speed reading, local progress, bookmarks, ORP highlighting, and adaptive pacing.",
    heading: "A MOBI and EPUB reader with RSVP mode.",
    summary:
      "Kairo is for readers with their own DRM-free ebook files who want one Android app for normal reading and focused RSVP speed reading.",
    keywords: ["MOBI EPUB reader Android", "MOBI reader Android", "EPUB reader Android", "ebook reader with RSVP", "DRM-free ebook reader"],
    sections: [
      {
        title: "Bring DRM-free books into one library",
        body:
          "Kairo imports DRM-free EPUB and MOBI files from Android storage, extracts metadata and covers where available, and keeps your reading state local.",
      },
      {
        title: "Use the reading mode that fits",
        body:
          "Some passages need context and scrolling. Others are easier to move through with RSVP. Kairo keeps both modes close so a book can move between careful reading and faster focused sessions.",
      },
      {
        title: "Format support with speed reading intent",
        body:
          "Kairo is not trying to be every document tool at once. It focuses on ebook import, clean chapter reading, bookmarks, progress, and RSVP pacing for readers who want a simpler Android workflow.",
      },
    ],
    highlights: ["DRM-free EPUB", "DRM-free MOBI", "Bookmarks and progress", "RSVP mode for imported books"],
    related: ["/android-rsvp-reader/", "/epub-speed-reading-app/", "/rsvp-reading-app/"],
  },
];

export const allSeoRoutes = [homeSeo, ...seoPages] as const;

export function normalizePath(path: string) {
  const cleanPath = (path.split(/[?#]/)[0] || "/").trim();
  const withLeadingSlash = cleanPath.startsWith("/") ? cleanPath : `/${cleanPath}`;

  if (withLeadingSlash === "/") return "/";
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
}

export function seoPageForPath(path: string) {
  const normalized = normalizePath(path);
  return seoPages.find((page) => page.path === normalized);
}

export function seoForPath(path: string) {
  return seoPageForPath(path) ?? homeSeo;
}
