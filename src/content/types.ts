export type IconName =
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

export type ImageContent = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type LinkContent = {
  label: string;
  href: string;
  hrefFromPage?: string;
  ariaLabel?: string;
  icon?: IconName;
  external?: boolean;
};

export type SectionHeadingContent = {
  eyebrow: string;
  title: string;
  body: string;
};

export type NumberedContentItem = {
  title: string;
  body: string;
};

export type BionicSampleContent = {
  ariaLabel: string;
  words: readonly string[];
  controls: {
    previous: string;
    next: string;
    playIcon: IconName;
  };
};
