import type { IconName } from "../../content/types";

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

export function Icon(props: { name: IconName }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      stroke-width="1.8"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <path d={paths[props.name]} />
    </svg>
  );
}
