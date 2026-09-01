import { siteContent } from "./site";
import type { IconName, LinkContent, NumberedContentItem } from "./types";

export type PrivacyPageContent = {
  backAction: LinkContent;
  eyebrow: string;
  title: string;
  summary: string;
  summaryCards: readonly {
    icon: IconName;
    title: string;
    body: string;
  }[];
  dataSection: {
    eyebrow: string;
    rows: readonly NumberedContentItem[];
  };
  proseSections: readonly {
    title: string;
    paragraphs: readonly string[];
  }[];
  contact: {
    eyebrow: string;
    title: string;
    body: string;
    action: LinkContent;
  };
};

export const privacyContent = {
  backAction: siteContent.editorial.backAction,
  eyebrow: "Privacy policy · Updated 27 July 2026",
  title: "Private reading should be the default.",
  summary:
    "Kairo does not operate an account or reading-data service. Your imported content, progress, bookmarks and preferences stay on your device.",
  summaryCards: [
    {
      icon: "shield",
      title: "No Kairo cloud",
      body: "Your library and reading activity are not sent to a developer-operated server.",
    },
    {
      icon: "focus",
      title: "No ads or analytics",
      body: "The current app includes no advertising, analytics or social tracking SDKs.",
    },
    {
      icon: "book",
      title: "Local control",
      body: "Delete books in Kairo, clear app storage or uninstall the app to remove local data.",
    },
  ],
  dataSection: {
    eyebrow: "What the app handles",
    rows: [
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
        body: `If you email ${siteContent.contactEmail}, your address and message are used only to respond and retained as needed for support, legal or abuse-prevention purposes.`,
      },
    ],
  },
  proseSections: [
    {
      title: "Collection, use and sharing",
      paragraphs: [
        "Kairo does not collect imported content, reading history, progress, bookmarks, preferences, advertising identifiers or analytics on developer-controlled servers. It does not sell personal data. The app's internet permission supports the Google Play in-app update flow; it is not used to transmit your library or reading activity to Kairo.",
        "Android system services may handle data under your device and Google account settings. These include Google Play app delivery and updates, and optional Android backup. The Kairo developer does not receive or access your device backups.",
      ],
    },
    {
      title: "Storage, security and deletion",
      paragraphs: [
        "Local content, the Room database and app preferences use Android app-private storage. Android's sandbox limits access by other apps under normal device security rules. Data remains until you remove the relevant book, clear Kairo's app storage or uninstall Kairo.",
        "If Android backup is enabled, Kairo's database and preferences may be included in a Google-managed backup and restored to another device. Manage or remove those copies through your Android and Google backup settings.",
      ],
    },
    {
      title: "Accounts, children and policy changes",
      paragraphs: [
        "Kairo has no account, sign-in, subscription, payment or external account deletion flow. It is not directed to children and does not knowingly collect children's personal information. If you believe a child has sent information through a support message, contact us so it can be deleted.",
        "This policy may change when Kairo's behaviour, third-party services or legal requirements change. The effective date at the top will be updated whenever the policy changes materially.",
      ],
    },
  ],
  contact: {
    eyebrow: "Questions or requests",
    title: "Talk to a human.",
    body: "For privacy, deletion or support questions, email the Kairo project.",
    action: {
      label: siteContent.contactEmail,
      href: `mailto:${siteContent.contactEmail}`,
    },
  },
} satisfies PrivacyPageContent;
