import { For } from "solid-js";
import { homeContent } from "../../content/home";
import { Icon } from "../ui/Icon";

export function OpenSourceSection() {
  const content = homeContent.openSource;

  return (
    <section class="open-section section-pad">
      <div class="content-wrap open-card">
        <div>
          <p class="eyebrow">{content.eyebrow}</p>
          <h2>{content.title}</h2>
          <p>{content.body}</p>
        </div>
        <div class="open-actions">
          <For each={content.actions}>
            {(action, index) => (
              <a
                class={index() === 0 ? "button-primary" : "button-secondary"}
                href={action.href}
                target="_blank"
                rel="noreferrer"
              >
                <Icon name={action.icon} /> {action.label}
              </a>
            )}
          </For>
        </div>
      </div>
    </section>
  );
}
