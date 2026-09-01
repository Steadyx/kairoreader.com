import { For } from "solid-js";
import { homeContent } from "../../content/home";
import { Icon } from "../ui/Icon";
import { SectionHeading } from "../ui/SectionHeading";

export function FormatsSection() {
  const content = homeContent.formats;

  return (
    <section id="formats" class="formats-section section-pad">
      <div class="content-wrap">
        <div class="formats-head">
          <SectionHeading content={content.heading} />
          <a class="text-link" href={content.detailsAction.href}>
            {content.detailsAction.label} <Icon name={content.detailsAction.icon} />
          </a>
        </div>
        <div class="format-grid">
          <For each={content.items}>
            {(item, index) => (
              <div class="format-card">
                <span>{String(index() + 1).padStart(2, "0")}</span>
                <strong>{item.name}</strong>
                <small>{item.category}</small>
              </div>
            )}
          </For>
        </div>
        <p class="format-note">{content.note}</p>
      </div>
    </section>
  );
}
