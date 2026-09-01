import { For, Show } from "solid-js";
import { homeContent } from "../../content/home";
import { Icon } from "../ui/Icon";
import { SectionHeading } from "../ui/SectionHeading";

const swatchClass = {
  lightTheme: "swatch-light",
  sepiaTheme: "swatch-sepia",
  darkTheme: "swatch-dark",
  nordTheme: "swatch-nord",
  cyberTheme: "swatch-cyber",
  forestTheme: "swatch-forest",
} as const;

export function FeaturesSection() {
  const content = homeContent.features;

  return (
    <section class="feature-bento section-pad">
      <div class="content-wrap">
        <SectionHeading content={content.heading} />
        <div class="bento-grid">
          <For each={content.items}>
            {(item) => (
              <article class={`bento-card bento-${item.variant}`}>
                {item.visual.kind === "icon" ? (
                  <Icon name={item.visual.icon} />
                ) : item.visual.kind === "orp" ? (
                  <div class="orp-demo" aria-hidden="true">
                    <span>{item.visual.previous}</span>
                    <strong>
                      {item.visual.word.beforePivot}<em>{item.visual.word.pivot}</em>{item.visual.word.afterPivot}
                    </strong>
                    <span>{item.visual.next}</span>
                  </div>
                ) : null}
                <p class="eyebrow">{item.eyebrow}</p>
                <h3>{item.title}</h3>
                {item.visual.kind === "swatches" ? (
                  <div class="theme-swatches" aria-label={item.visual.ariaLabel}>
                    <For each={item.visual.swatches}>{(swatch) => <span class={swatchClass[swatch]} />}</For>
                  </div>
                ) : null}
                <Show when={item.body}>{(body) => <p>{body()}</p>}</Show>
              </article>
            )}
          </For>
        </div>
      </div>
    </section>
  );
}
