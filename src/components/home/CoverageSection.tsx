import { For } from "solid-js";
import { homeContent } from "../../content/home";
import { seoPages } from "../../content/seo";
import { Icon } from "../ui/Icon";

export function CoverageSection() {
  const content = homeContent.coverage;

  return (
    <section class="coverage-section section-pad" aria-labelledby="coverage-title">
      <div class="content-wrap">
        <div class="coverage-head">
          <div>
            <p class="eyebrow">{content.eyebrow}</p>
            <h2 id="coverage-title">{content.title}</h2>
          </div>
          <p>{content.body}</p>
        </div>
        <div class="coverage-grid">
          <For each={seoPages}>
            {(page, index) => (
              <a href={page.path}>
                <span>{String(index() + 1).padStart(2, "0")}</span>
                <div>
                  <p class="eyebrow">{page.eyebrow}</p>
                  <h3>{page.navLabel}</h3>
                </div>
                <Icon name="arrow" />
              </a>
            )}
          </For>
        </div>
      </div>
    </section>
  );
}
