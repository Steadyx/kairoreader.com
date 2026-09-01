import type { IconName, ImageContent, LinkContent } from "./types";

export type SiteContent = {
  origin: string;
  brand: {
    name: string;
    tagline: string;
    homeAriaLabel: string;
    icon: ImageContent;
  };
  release: {
    badge: string;
    version: string;
    platform: string;
    minimumPlatformVersion: string;
    minimumPlatformApi: string;
    platformRequirement: string;
  };
  contactEmail: string;
  actions: {
    getKairo: LinkContent & { platformLabel: string; headerLabel: string; icon: IconName };
    support: LinkContent;
    repository: LinkContent;
  };
  header: {
    navigationAriaLabel: string;
    links: readonly LinkContent[];
    themeToggleLabel: { light: string; dark: string };
    menuLabel: { open: string; close: string };
  };
  footer: {
    groups: readonly {
      title: string;
      links: readonly LinkContent[];
    }[];
    copyright: string;
    releaseSummary: string;
  };
  editorial: {
    backAction: LinkContent;
    exploreAction: LinkContent;
    highlightsAriaLabel: string;
    relatedEyebrow: string;
    relatedFallbackLabel: string;
    structuredData: {
      schemaContext: string;
      organizationName: string;
      organizationType: string;
      articleType: string;
      imageObjectType: string;
    };
  };
};

const playStoreUrl = "https://play.google.com/store/apps/details?id=com.kairo.reader";
const githubUrl = "https://github.com/Steadyx/Kairo";
const coffeeUrl = "https://buymeacoffee.com/kairoapp";
const contactEmail = "kairoapp@proton.me";
const brand = {
  name: "Kairo",
  tagline: "Focused reading for Android.",
  homeAriaLabel: "Kairo home",
  icon: {
    src: "/assets/kairo-icon.png",
    alt: "",
    width: 36,
    height: 36,
  },
} as const;
const release = {
  badge: "1.1",
  version: "1.1.0",
  platform: "Android",
  minimumPlatformVersion: "7.0",
  minimumPlatformApi: "API 24",
  platformRequirement: "Android 7.0+",
} as const;

export const siteContent = {
  origin: "https://kairoreader.com",
  brand,
  release,
  contactEmail,
  actions: {
    getKairo: {
      label: "Google Play",
      platformLabel: "Get it on",
      headerLabel: "Get Kairo",
      href: playStoreUrl,
      ariaLabel: "Get Kairo on Google Play",
      icon: "play",
      external: true,
    },
    support: {
      label: "Support Kairo",
      href: coffeeUrl,
      icon: "coffee",
      external: true,
    },
    repository: {
      label: "View on GitHub",
      href: githubUrl,
      icon: "github",
      external: true,
    },
  },
  header: {
    navigationAriaLabel: "Primary navigation",
    links: [
      { label: "Experience", href: "#experience", hrefFromPage: "/#experience" },
      { label: "Formats", href: "#formats", hrefFromPage: "/#formats" },
      { label: "Privacy", href: "#privacy", hrefFromPage: "/#privacy" },
      { label: "FAQ", href: "#faq", hrefFromPage: "/#faq" },
      { label: "Open source", href: githubUrl, external: true },
      { label: "Support", href: coffeeUrl, external: true },
    ],
    themeToggleLabel: {
      light: "Use light theme",
      dark: "Use dark theme",
    },
    menuLabel: {
      open: "Open menu",
      close: "Close menu",
    },
  },
  footer: {
    groups: [
      {
        title: "Explore",
        links: [
          { label: "Experience", href: "#experience", hrefFromPage: "/#experience" },
          { label: "Formats", href: "#formats", hrefFromPage: "/#formats" },
          { label: "FAQ", href: "#faq", hrefFromPage: "/#faq" },
        ],
      },
      {
        title: "Project",
        links: [
          { label: "Google Play", href: playStoreUrl, external: true },
          { label: "GitHub", href: githubUrl, external: true },
          { label: "Support Kairo", href: coffeeUrl, external: true },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Privacy policy", href: "/privacy-policy/" },
          { label: "Contact", href: `mailto:${contactEmail}` },
        ],
      },
    ],
    copyright: `© 2026 ${brand.name}`,
    releaseSummary: `Version ${release.version} · ${release.platformRequirement}`,
  },
  editorial: {
    backAction: { label: `Back to ${brand.name}`, href: "/", icon: "arrow" },
    exploreAction: { label: "Explore the app", href: "/#experience", icon: "arrow" },
    highlightsAriaLabel: "Highlights",
    relatedEyebrow: "Keep exploring",
    relatedFallbackLabel: `${brand.name} guide`,
    structuredData: {
      schemaContext: "https://schema.org",
      organizationName: brand.name,
      organizationType: "Organization",
      articleType: "Article",
      imageObjectType: "ImageObject",
    },
  },
} satisfies SiteContent;

export function hrefForLocation(link: LinkContent, isHome: boolean) {
  return isHome ? link.href : (link.hrefFromPage ?? link.href);
}
