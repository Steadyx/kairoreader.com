import { For } from "solid-js";
import { faqStructuredData, homeContent } from "../../content/home";

export function FaqSection() {
  const content = homeContent.faq;

  return (
    <section id="faq" class="faq-section section-pad">
      <div class="content-wrap faq-grid">
        <div class="faq-intro">
          <p class="eyebrow">{content.eyebrow}</p>
          <h2>{content.title}</h2>
          <p>
            {content.contactPrompt}{" "}
            <a href={content.contactHref}>{content.contactLabel}</a>.
          </p>
        </div>
        <div class="faq-list">
          <For each={content.items}>
            {(item, index) => (
              <details open={index() === 0}>
                <summary>
                  <span>{item.question}</span>
                  <i aria-hidden="true" />
                </summary>
                <p>{item.answer}</p>
              </details>
            )}
          </For>
        </div>
      </div>
      <script type="application/ld+json">{JSON.stringify(faqStructuredData)}</script>
    </section>
  );
}
