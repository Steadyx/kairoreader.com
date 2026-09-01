import { siteContent } from "./site";
import type { BionicSampleContent, IconName, ImageContent, LinkContent, SectionHeadingContent } from "./types";

export type ReadingModeContent = {
  number: string;
  variant: "reader" | "rsvp" | "bionic";
  eyebrow: string;
  title: string;
  body: string;
  visual:
    | { kind: "phone"; image: ImageContent }
    | ({ kind: "bionic" } & BionicSampleContent);
};

type ThemeSwatch = "lightTheme" | "sepiaTheme" | "darkTheme" | "nordTheme" | "cyberTheme" | "forestTheme";

export type FeatureContent = {
  variant: "focus" | "theme" | "bookmarks" | "context";
  eyebrow: string;
  title: string;
  body?: string;
  visual:
    | { kind: "icon"; icon: IconName }
    | { kind: "swatches"; ariaLabel: string; swatches: readonly ThemeSwatch[] }
    | {
        kind: "orp";
        previous: string;
        word: { beforePivot: string; pivot: string; afterPivot: string };
        next: string;
      };
};

export type HomePageContent = {
  hero: {
    announcement: string;
    title: { text: string; emphasis: string };
    lede: string;
    actions: { learnMore: LinkContent; support: LinkContent };
    proofAriaLabel: string;
    proofItems: readonly { icon: IconName; label: string }[];
    visualAriaLabel: string;
    screenshots: readonly { position: "back" | "middle" | "front"; image: ImageContent }[];
    formatNote: { label: string; value: string };
    localNote: { icon: IconName; title: string; body: string };
    scrollCue: string;
    principlesAriaLabel: string;
    principles: readonly string[];
  };
  experience: {
    heading: SectionHeadingContent;
    modes: readonly ReadingModeContent[];
  };
  formats: {
    heading: SectionHeadingContent;
    detailsAction: LinkContent;
    items: readonly { name: string; category: string }[];
    note: string;
  };
  tuning: {
    eyebrow: string;
    title: string;
    body: string;
    profilesAriaLabel: string;
    profiles: readonly string[];
    image: ImageContent;
    callouts: readonly { label: string; value: string }[];
  };
  features: {
    heading: SectionHeadingContent;
    items: readonly FeatureContent[];
  };
  gallery: {
    eyebrow: string;
    title: string;
    body: string;
    items: readonly { caption: string; image: ImageContent }[];
  };
  privacy: {
    icon: IconName;
    eyebrow: string;
    title: string;
    paragraphs: readonly string[];
    action: LinkContent;
  };
  openSource: {
    eyebrow: string;
    title: string;
    body: string;
    actions: readonly LinkContent[];
  };
  faq: {
    eyebrow: string;
    title: string;
    contactPrompt: string;
    contactLabel: string;
    contactHref: string;
    items: readonly { question: string; answer: string }[];
  };
  coverage: {
    eyebrow: string;
    title: string;
    body: string;
  };
  finalCta: {
    image: ImageContent;
    eyebrow: string;
    title: string;
    body: string;
  };
};

export const homeContent = {
  hero: {
    announcement: `${siteContent.brand.name} ${siteContent.release.badge} · Free on ${siteContent.release.platform}`,
    title: {
      text: "Read at the speed of",
      emphasis: "thought.",
    },
    lede:
      "Bring your own books and documents. Read with full context, then shift into adaptive RSVP or Bionic Reading whenever you want more momentum.",
    actions: {
      learnMore: { label: "See how it works", href: "#experience", icon: "arrow" },
      support: { ...siteContent.actions.support, label: "Buy me a coffee" },
    },
    proofAriaLabel: "Kairo highlights",
    proofItems: [
      { icon: "check", label: "10 format families" },
      { icon: "shield", label: "Local-first" },
      { icon: "github", label: "Open source" },
    ],
    visualAriaLabel: "Kairo app screenshots",
    screenshots: [
      {
        position: "back",
        image: {
          src: "/assets/screens/library.webp",
          alt: "Kairo library with imported books, progress and bookmarks",
          width: 1080,
          height: 1920,
        },
      },
      {
        position: "middle",
        image: {
          src: "/assets/screens/reader-controls.webp",
          alt: "Kairo reader with chapter text and reading controls",
          width: 1080,
          height: 1920,
        },
      },
      {
        position: "front",
        image: {
          src: "/assets/screens/rsvp.webp",
          alt: "Kairo RSVP screen with a focused word and playback controls",
          width: 1080,
          height: 1920,
        },
      },
    ],
    formatNote: {
      label: "Bring your own files",
      value: "EPUB · PDF · DOCX + more",
    },
    localNote: {
      icon: "shield",
      title: "Stays yours",
      body: "Local books & progress",
    },
    scrollCue: "Scroll to explore",
    principlesAriaLabel: "Kairo design principles",
    principles: ["Speed without chaos.", "Focus without clutter.", "Your library without the cloud."],
  },
  experience: {
    heading: {
      eyebrow: "One continuous reading flow",
      title: "Change how you read. Not where you are.",
      body:
        "Kairo keeps the library, the page and your accelerated reading modes connected. Pick the experience that fits the next passage.",
    },
    modes: [
      {
        number: "01",
        variant: "reader",
        eyebrow: "Reader",
        title: "Stay with the whole page.",
        body: "Scrollable chapters, inline images, table of contents, bookmarks, progress and a movable focus word.",
        visual: {
          kind: "phone",
          image: {
            src: "/assets/screens/reader-rsvp-dock.webp",
            alt: "Kairo standard reader with the RSVP launch control",
            width: 1080,
            height: 1920,
          },
        },
      },
      {
        number: "02",
        variant: "rsvp",
        eyebrow: "Adaptive RSVP",
        title: "Give every word one clear place.",
        body: "ORP alignment and timing shaped by punctuation, length, syllables, clauses and readability.",
        visual: {
          kind: "phone",
          image: {
            src: "/assets/screens/rsvp.webp",
            alt: "Kairo RSVP mode showing the word seldom at a stable focal point",
            width: 1080,
            height: 1920,
          },
        },
      },
      {
        number: "03",
        variant: "bionic",
        eyebrow: "Bionic Reading",
        title: "Move in larger, focused pieces.",
        body: "Timed text chunks with emphasised beginnings give you momentum while keeping more sentence context in view.",
        visual: {
          kind: "bionic",
          ariaLabel: "Example of Bionic Reading with emphasised word beginnings",
          words: ["Reading", "should", "feel", "intentional.", "Context", "creates", "momentum."],
          controls: { previous: "‹", next: "›", playIcon: "play" },
        },
      },
    ],
  },
  formats: {
    heading: {
      eyebrow: `${siteContent.brand.name} ${siteContent.release.badge} format support`,
      title: "Your reading list is bigger than one file type.",
      body:
        "Choose a supported file from Android storage. Kairo detects it automatically, builds a local library entry and opens the same focused reading toolkit.",
    },
    detailsAction: { label: "Format details and limitations", href: "/supported-formats/", icon: "arrow" },
    items: [
      { name: "EPUB", category: "Ebook" },
      { name: "MOBI", category: "Ebook" },
      { name: "PRC", category: "Ebook" },
      { name: "AZW", category: "Ebook" },
      { name: "FB2", category: "Ebook" },
      { name: "PDF", category: "Document" },
      { name: "DOCX", category: "Document" },
      { name: "TXT", category: "Text" },
      { name: "Markdown", category: "Text" },
      { name: "HTML", category: "Text" },
    ],
    note: "DRM-free files only. PDFs require selectable text; image-only and scanned PDFs are not supported yet.",
  },
  tuning: {
    eyebrow: "Power when you want it",
    title: "Simple on the surface. Remarkably tuneable underneath.",
    body:
      "Start with a profile, press play and read. When you want finer control, Kairo exposes the pacing, typography, brightness and focus settings that actually change how a session feels.",
    profilesAriaLabel: "Built-in RSVP profiles",
    profiles: ["Balanced", "Chill", "Narrative", "Focus", "Flow", "Sprint", "Study"],
    image: {
      src: `/assets/screens/rsvp-settings.webp?v=${siteContent.release.version}`,
      alt: "Kairo RSVP settings with profile and timing controls",
      width: 1080,
      height: 1920,
    },
    callouts: [
      { label: "Estimated pace", value: "811 WPM" },
      { label: "Controls", value: "Rhythm · readability · display" },
    ],
  },
  features: {
    heading: {
      eyebrow: "Designed around attention",
      title: "Everything that helps. Nothing that performs for attention.",
      body: "The details are quiet, but they are not shallow.",
    },
    items: [
      {
        variant: "focus",
        eyebrow: "Focus mode",
        title: "Hide the chrome. Pause the noise.",
        body: "Use a full-screen reader and optionally engage Android Do Not Disturb during focused sessions.",
        visual: { kind: "icon", icon: "focus" },
      },
      {
        variant: "theme",
        eyebrow: "Six reader themes",
        title: "Find a softer kind of contrast.",
        visual: {
          kind: "swatches",
          ariaLabel: "Light, Sepia, Dark, Nord, Cyberpunk and Forest themes",
          swatches: ["lightTheme", "sepiaTheme", "darkTheme", "nordTheme", "cyberTheme", "forestTheme"],
        },
      },
      {
        variant: "bookmarks",
        eyebrow: "Reading state",
        title: "Your place, saved locally.",
        body: "Books, bookmarks, completion, progress and preferences stay connected on your device.",
        visual: { kind: "icon", icon: "book" },
      },
      {
        variant: "context",
        eyebrow: "Context assist",
        title: "More context, without leaving the focal band.",
        body: "Optional previous and upcoming word cues soften the edges of single-focus RSVP.",
        visual: {
          kind: "orp",
          previous: "prev",
          word: { beforePivot: "mome", pivot: "n", afterPivot: "tum" },
          next: "next",
        },
      },
    ],
  },
  gallery: {
    eyebrow: "Inside Kairo",
    title: "A reading interface that gets out of the way.",
    body: "Near-black surfaces, restrained colour and controls that appear when they are useful.",
    items: [
      {
        caption: "Library",
        image: {
          src: "/assets/screens/library.webp",
          alt: "Kairo library showing book covers, progress and navigation tabs",
          width: 1080,
          height: 1920,
        },
      },
      {
        caption: "Settings",
        image: {
          src: "/assets/screens/settings.webp",
          alt: "Kairo settings home with RSVP, reader, focus and startup settings",
          width: 333,
          height: 592,
        },
      },
      {
        caption: "Reader themes",
        image: {
          src: "/assets/screens/reader-settings.webp",
          alt: "Kairo reader settings with font, theme, brightness and scrolling options",
          width: 1080,
          height: 1920,
        },
      },
      {
        caption: "Reader controls",
        image: {
          src: "/assets/screens/reader-controls.webp",
          alt: "Kairo book reader with bookmarks, focus mode and table of contents controls",
          width: 1080,
          height: 1920,
        },
      },
    ],
  },
  privacy: {
    icon: "shield",
    eyebrow: "Local-first by design",
    title: "Your books are not our business.",
    paragraphs: [
      "Kairo has no account system, ads or analytics SDKs. Imported files, extracted content, progress, bookmarks and preferences stay in app-private storage.",
      "Internet access supports Google Play's flexible update flow. It is not used to upload your library or reading activity to a Kairo server.",
    ],
    action: { label: "Read the privacy policy", href: "/privacy-policy/", icon: "arrow" },
  },
  openSource: {
    eyebrow: "Free and open source",
    title: "Built in the open. Shaped by readers.",
    body:
      "Inspect the code, report an issue or help make focused reading better. Kairo is a native Kotlin and Jetpack Compose project on GitHub.",
    actions: [siteContent.actions.repository, siteContent.actions.support],
  },
  faq: {
    eyebrow: "Questions, answered",
    title: "Everything you need before the first page.",
    contactPrompt: "Still wondering about a file or feature? Email",
    contactLabel: siteContent.contactEmail,
    contactHref: `mailto:${siteContent.contactEmail}`,
    items: [
      {
        question: "What is Kairo?",
        answer:
          "Kairo is a free Android reading app for your own DRM-free ebooks and documents. It combines a normal reader with adaptive RSVP and Bionic Reading modes, while keeping books, progress and preferences on your device.",
      },
      {
        question: "Which file formats does Kairo support?",
        answer:
          `${siteContent.brand.name} ${siteContent.release.badge} supports EPUB, MOBI, PRC, AZW, FB2 and FB2.ZIP ebooks; DOCX and text-based PDF documents; and TXT, Markdown, HTML and HTM text files.`,
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
        answer: `${siteContent.brand.name} supports ${siteContent.release.platform} ${siteContent.release.minimumPlatformVersion} (${siteContent.release.minimumPlatformApi}) and newer and is available free on ${siteContent.actions.getKairo.label}.`,
      },
    ],
  },
  coverage: {
    eyebrow: "Reading guides",
    title: "Go deeper into the way Kairo reads.",
    body: `Clear, focused guides to the formats and reading modes available in ${siteContent.brand.name} ${siteContent.release.badge}.`,
  },
  finalCta: {
    image: {
      ...siteContent.brand.icon,
      width: 88,
      height: 88,
    },
    eyebrow: "Your next chapter, in motion",
    title: "Read differently.",
    body: `${siteContent.brand.name} is free on ${siteContent.release.platform} ${siteContent.release.minimumPlatformVersion} and newer.`,
  },
} satisfies HomePageContent;

export const faqStructuredData = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": `${siteContent.origin}/#faq`,
  mainEntity: homeContent.faq.items.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};
