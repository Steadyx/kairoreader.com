import type { SectionHeadingContent } from "../../content/types";

export function SectionHeading(props: { content: SectionHeadingContent }) {
  return (
    <div class="section-heading">
      <p class="eyebrow">{props.content.eyebrow}</p>
      <h2>{props.content.title}</h2>
      <p>{props.content.body}</p>
    </div>
  );
}
