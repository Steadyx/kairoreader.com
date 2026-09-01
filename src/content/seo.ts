import { siteContent } from "./site";

export const siteOrigin = siteContent.origin;

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

export type SeoRoute = {
  path: string;
  title: string;
  description: string;
  keywords: string | readonly string[];
};

export const homeSeo: SeoRoute = {
  path: "/",
  title: "Kairo: Focused RSVP and Bionic Reader for Android",
  description:
    "Read EPUB, PDF, DOCX and more with Kairo for Android. Move between a calm reader, adaptive RSVP and Bionic Reading while your data stays local.",
  keywords: [
    "Kairo reader",
    "Android RSVP reader",
    "Bionic Reading app",
    "speed reading app",
    "EPUB reader",
    "PDF reader",
    "DOCX reader",
    "local ebook reader",
  ],
};

export const privacyPolicySeo: SeoRoute = {
  path: "/privacy-policy/",
  title: "Privacy Policy for the Kairo Android Reading App",
  description:
    "How Kairo handles imported books, reading progress, preferences, Android backup, Play updates and support messages while keeping reading data local.",
  keywords: ["Kairo privacy policy", "Android reader privacy", "local reading data", "Kairo app data"],
};

export const seoPages: readonly SeoPage[] = [
  {
    path: "/rsvp-reading-app/",
    navLabel: "RSVP reading",
    eyebrow: "Focused speed",
    title: "RSVP Reading App for Android Books and Documents | Kairo",
    description:
      "Use adaptive RSVP reading with your own EPUB, PDF, DOCX and text files. Kairo adds ORP focus, natural pauses, profiles and local progress.",
    heading: "RSVP reading that respects the shape of a sentence.",
    summary:
      "Kairo is an RSVP-first Android reader for people who want forward momentum without frantic word flashing. Start from the exact point you are reading, then let adaptive timing handle the rhythm.",
    keywords: ["RSVP reading app", "Android RSVP reader", "speed reading app", "rapid serial visual presentation"],
    sections: [
      {
        title: "More than a fixed words-per-minute counter",
        body:
          "Kairo adjusts frame timing for punctuation, word length, syllables, clauses, paragraphs and difficult words. That extra breathing room helps prose retain its cadence as the base speed rises.",
      },
      {
        title: "A stable place for your eyes",
        body:
          "Words are positioned around their optimal recognition point, with an optional highlighted pivot and alignment guides. Peripheral context cues can show nearby words without pulling focus away from the reading band.",
      },
      {
        title: "Begin inside the book, not in a paste box",
        body:
          "Import a supported ebook or document, read with full context, tap the word you want, and start RSVP from there. Progress and bookmarks stay connected to the same local book.",
      },
    ],
    highlights: ["Adaptive punctuation timing", "ORP focus and guides", "Seven built-in profiles", "Phrase replay and context cues"],
    related: ["/orp-highlighting/", "/calm-speed-reading-app/", "/android-rsvp-reader/"],
  },
  {
    path: "/android-rsvp-reader/",
    navLabel: "Android reader",
    eyebrow: "One reading flow",
    title: "Android RSVP Reader for EPUB, PDF, DOCX and More | Kairo",
    description:
      "Kairo is a native Android reader with a local library, standard reading, RSVP, Bionic Reading, bookmarks, themes and ten supported formats.",
    heading: "A native Android reader built around focus.",
    summary:
      `${siteContent.brand.name} brings your library, normal reading and timed reading into one deliberate workflow. It runs on ${siteContent.release.platform} ${siteContent.release.minimumPlatformVersion} and newer, stores reading state locally and is free to use.`,
    keywords: ["Android RSVP reader", "Android ebook reader", "focus reading app", "offline reader Android"],
    sections: [
      {
        title: "Library, reader and acceleration in one app",
        body:
          "Browse covers and progress, open a chapter in the standard reader, then move into RSVP or Bionic Reading from your current focus word. You do not need to export text or rebuild your place.",
      },
      {
        title: "Designed for Android, down to the controls",
        body:
          "Kairo uses native Jetpack Compose surfaces for document picking, navigation, themes, brightness, typography and focus options. Flexible Play updates can notify you without interrupting a reading session.",
      },
      {
        title: "Private by architecture",
        body:
          "Imported content, bookmarks, reading positions and preferences are kept in app-private storage. Kairo has no account system, ads or analytics SDKs, and reading works without a Kairo cloud service.",
      },
    ],
    highlights: [siteContent.release.platformRequirement, "Native Jetpack Compose UI", "Local books and progress", "No account, ads or analytics"],
    related: ["/rsvp-reading-app/", "/supported-formats/", "/bionic-reading-app/"],
  },
  {
    path: "/epub-speed-reading-app/",
    navLabel: "EPUB speed reading",
    eyebrow: "Books in motion",
    title: "EPUB Speed Reading App with RSVP and Bionic Modes | Kairo",
    description:
      "Import DRM-free EPUB books on Android, keep chapter context and images, then read faster with adaptive RSVP or Bionic Reading in Kairo.",
    heading: "Move through EPUB books without losing your place.",
    summary:
      "Kairo treats an EPUB as a book, not a disposable stream of pasted words. Covers, chapters, inline images, progress and bookmarks remain part of the experience when you accelerate.",
    keywords: ["EPUB speed reading app", "EPUB RSVP reader", "Android EPUB reader", "Bionic Reading EPUB"],
    sections: [
      {
        title: "Keep the structure of the book",
        body:
          "Kairo extracts available cover art and metadata, follows the EPUB spine, preserves useful chapter boundaries and renders inline images in the standard reader.",
      },
      {
        title: "Start faster reading from any word",
        body:
          "Tap or recenter the focus word, then launch RSVP or Bionic Reading from that position. When you return, the app keeps the book, chapter and reading state connected.",
      },
      {
        title: "Tune the experience, not the source file",
        body:
          "Reader themes, text brightness, font size, RSVP profiles and focus controls are reusable preferences. You can change the rhythm without modifying or uploading your EPUB.",
      },
    ],
    highlights: ["DRM-free EPUB import", "Chapter and image support", "Reader-to-RSVP handoff", "Local bookmarks and progress"],
    related: ["/supported-formats/", "/rsvp-reading-app/", "/bionic-reading-app/"],
  },
  {
    path: "/orp-highlighting/",
    navLabel: "ORP highlighting",
    eyebrow: "Visual anchor",
    title: "ORP Highlighting for Clearer RSVP Speed Reading | Kairo",
    description:
      "Learn how Kairo uses optimal recognition point highlighting, stable alignment and optional context cues to make RSVP reading easier to track.",
    heading: "Keep the word moving. Keep your eyes steady.",
    summary:
      "The optimal recognition point is the part of a word your eyes tend to recognise most efficiently. Kairo can align and highlight that pivot so each new word lands in a more consistent place.",
    keywords: ["ORP highlighting", "optimal recognition point", "RSVP focus point", "speed reading pivot letter"],
    sections: [
      {
        title: "Why words shift during basic RSVP",
        body:
          "Centred words have different lengths, so their useful recognition point moves from frame to frame. ORP alignment offsets each word around a stable pivot instead of centring every word by its outer edges.",
      },
      {
        title: "Guidance you can control",
        body:
          "Kairo can colour the pivot letter and show subtle horizontal guides around the focus band. Both are optional, so the screen can be as instructive or as quiet as you prefer.",
      },
      {
        title: "A visual system paired with natural timing",
        body:
          "Stable alignment helps recognition, while adaptive holds make room for punctuation and complexity. Kairo combines both rather than asking a single visual trick to carry the whole reading experience.",
      },
    ],
    highlights: ["Pivot-letter highlight", "Stable word alignment", "Optional guide lines", "Peripheral context assist"],
    related: ["/rsvp-reading-app/", "/calm-speed-reading-app/", "/android-rsvp-reader/"],
  },
  {
    path: "/calm-speed-reading-app/",
    navLabel: "Calm speed reading",
    eyebrow: "Speed without chaos",
    title: "A Calm Speed Reading App for Focused Android Reading | Kairo",
    description:
      "Kairo combines RSVP, Bionic Reading, low-glare themes, focus controls and natural pacing for readers who want speed without visual pressure.",
    heading: "Reading faster should still feel like reading.",
    summary:
      "Kairo is designed around intentional momentum: enough control to suit the material, enough quiet to stay immersed and no performance theatre competing with the words.",
    keywords: ["calm speed reading app", "focus reading app", "low distraction reader", "Android speed reading"],
    sections: [
      {
        title: "Choose a mode that fits the moment",
        body:
          "Use the standard reader when context matters, RSVP when you want one stable focal point, or Bionic Reading when you want larger text chunks with emphasised word beginnings.",
      },
      {
        title: "Profiles before complexity",
        body:
          "Balanced, Chill, Narrative, Focus, Flow, Sprint and Study profiles give you useful pacing shapes immediately. Detailed timing and readability controls remain available when you want them.",
      },
      {
        title: "Make the screen quieter",
        body:
          "Low-glare themes, independent text brightness, minimal chrome and optional Do Not Disturb integration reduce the things competing with a focused session.",
      },
    ],
    highlights: ["Three reading experiences", "Seven RSVP profiles", "Six reader themes", "Optional focus mode"],
    related: ["/bionic-reading-app/", "/rsvp-reading-app/", "/orp-highlighting/"],
  },
  {
    path: "/mobi-epub-reader-android/",
    navLabel: "MOBI and EPUB",
    eyebrow: "Ebook library",
    title: "MOBI and EPUB Reader for Android with RSVP | Kairo",
    description:
      "Read DRM-free MOBI, PRC, AZW, EPUB and FB2 ebooks in Kairo, with local progress, bookmarks, a clean reader, RSVP and Bionic Reading.",
    heading: "Your DRM-free ebooks, in one focused Android library.",
    summary:
      "Kairo supports the ebook formats readers already own and keeps the path from file picker to focused reading short. Vendor-locked books remain outside the current parser pipeline.",
    keywords: ["MOBI EPUB reader Android", "MOBI reader", "EPUB reader", "PRC reader", "AZW reader", "FB2 reader"],
    sections: [
      {
        title: "Ebook formats beyond EPUB",
        body:
          "Kairo reads DRM-free EPUB, MOBI, PRC, AZW, FB2 and FB2.ZIP files. It automatically detects the selected format instead of asking you to choose a parser first.",
      },
      {
        title: "A library that remembers",
        body:
          "Available covers and metadata appear alongside completion progress and estimated time remaining. A dedicated bookmarks tab gives saved positions a home outside the reader.",
      },
      {
        title: "Normal reading and focused reading",
        body:
          "Use chapter navigation and the table of contents when you need the whole page, then launch RSVP or Bionic Reading from the current position when you want stronger momentum.",
      },
    ],
    highlights: ["EPUB, MOBI, PRC and AZW", "FB2 and FB2.ZIP", "Automatic format detection", "Cover, progress and bookmark library"],
    related: ["/supported-formats/", "/epub-speed-reading-app/", "/android-rsvp-reader/"],
  },
  {
    path: "/supported-formats/",
    navLabel: "Supported formats",
    eyebrow: "Bring your own files",
    title: "Kairo Supported Ebook and Document Formats for Android",
    description:
      `See every format ${siteContent.brand.name} ${siteContent.release.badge} supports: EPUB, MOBI, PRC, AZW, FB2, PDF, DOCX, TXT, Markdown and HTML, plus current limitations.`,
    heading: "Books, documents and text. One reading workflow.",
    summary:
      `${siteContent.brand.name} ${siteContent.release.badge} automatically detects ten format families selected through Android's document picker. Files are parsed locally and added to the same library.`,
    keywords: ["Kairo supported formats", "EPUB MOBI PDF DOCX reader", "FB2 Android reader", "Markdown reader Android"],
    sections: [
      {
        title: "Ebooks",
        body:
          "Supported ebook formats are DRM-free EPUB, MOBI, PRC, AZW, FB2 and FB2.ZIP. Vendor protection and locked ebooks are not supported.",
      },
      {
        title: "Documents",
        body:
          "Kairo imports DOCX files and PDFs that contain selectable text. Scanned or image-only PDFs need OCR, which is not part of the current app.",
      },
      {
        title: "Text and web formats",
        body:
          "Plain TXT, Markdown (.md and .markdown), HTML and HTM files can join the library too. Kairo turns their text into the same reader, RSVP and Bionic Reading flow.",
      },
    ],
    highlights: ["Ten format families", "Automatic detection", "Local parsing", "Clear DRM and PDF limitations"],
    related: ["/mobi-epub-reader-android/", "/epub-speed-reading-app/", "/android-rsvp-reader/"],
  },
  {
    path: "/bionic-reading-app/",
    navLabel: "Bionic Reading",
    eyebrow: "Chunked focus",
    title: "Bionic Reading App for Android Books and Documents | Kairo",
    description:
      "Use Kairo's Bionic Reading mode with EPUB, PDF, DOCX and more. Emphasised word beginnings, timed chunks and focus controls keep text moving.",
    heading: "Bionic Reading, connected to the rest of your book.",
    summary:
      "Kairo's Bionic Reading mode presents timed chunks with emphasised word beginnings, giving you more surrounding context than single-word RSVP while preserving forward motion.",
    keywords: ["Bionic Reading app", "Bionic Reading Android", "bold first letters reader", "timed chunk reading"],
    sections: [
      {
        title: "Context in larger pieces",
        body:
          "Instead of replacing the whole view with one word, Bionic Reading advances through readable chunks. Word beginnings are emphasised to create visual landmarks across each block.",
      },
      {
        title: "A mode, not a separate import workflow",
        body:
          "Choose Bionic Reading from the same launcher as RSVP and begin at the current focus word. It works with the books and documents already in your Kairo library.",
      },
      {
        title: "Tune emphasis and presentation",
        body:
          "Fixation strength, highlight strength, font size and text brightness can be adjusted from dedicated settings or the quick controls available during a session.",
      },
    ],
    highlights: ["Timed text chunks", "Emphasised word beginnings", "Adjustable fixation strength", "Shared book progress"],
    related: ["/calm-speed-reading-app/", "/rsvp-reading-app/", "/supported-formats/"],
  },
];

export const allSeoRoutes: readonly SeoRoute[] = [homeSeo, ...seoPages, privacyPolicySeo];

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

export function privacyPolicyForPath(path: string) {
  return normalizePath(path) === privacyPolicySeo.path ? privacyPolicySeo : undefined;
}

export function seoForPath(path: string) {
  return privacyPolicyForPath(path) ?? seoPageForPath(path) ?? homeSeo;
}

export function canonicalUrlForPath(path: string) {
  return `${siteOrigin}${normalizePath(path)}`;
}
