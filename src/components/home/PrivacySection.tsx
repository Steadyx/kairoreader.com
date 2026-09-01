import { For } from "solid-js";
import { homeContent } from "../../content/home";
import { Icon } from "../ui/Icon";

export function PrivacySection() {
  const content = homeContent.privacy;

  return (
    <section id="privacy" class="privacy-section section-pad">
      <div class="content-wrap privacy-grid">
        <div class="privacy-mark">
          <Icon name={content.icon} />
        </div>
        <div>
          <p class="eyebrow">{content.eyebrow}</p>
          <h2>{content.title}</h2>
        </div>
        <div class="privacy-copy">
          <For each={content.paragraphs}>{(paragraph) => <p>{paragraph}</p>}</For>
          <a class="text-link" href={content.action.href}>
            {content.action.label} <Icon name={content.action.icon} />
          </a>
        </div>
      </div>
    </section>
  );
}
