import { For } from "solid-js";
import { Icon } from "../components/ui/Icon";
import { privacyContent } from "../content/privacy";

export function PrivacyPage() {
  const content = privacyContent;

  return (
    <main class="editorial-page privacy-page">
      <article class="section-pad">
        <div class="article-wrap">
          <a class="back-link" href={content.backAction.href}>
            <Icon name={content.backAction.icon} /> {content.backAction.label}
          </a>
          <p class="eyebrow">{content.eyebrow}</p>
          <h1>{content.title}</h1>
          <p class="article-summary">{content.summary}</p>
          <div class="privacy-summary">
            <For each={content.summaryCards}>
              {(card) => (
                <article>
                  <Icon name={card.icon} />
                  <h2>{card.title}</h2>
                  <p>{card.body}</p>
                </article>
              )}
            </For>
          </div>
          <section class="policy-section">
            <p class="eyebrow">{content.dataSection.eyebrow}</p>
            <div class="policy-rows">
              <For each={content.dataSection.rows}>
                {(row, index) => (
                  <article>
                    <span>{String(index() + 1).padStart(2, "0")}</span>
                    <div>
                      <h2>{row.title}</h2>
                      <p>{row.body}</p>
                    </div>
                  </article>
                )}
              </For>
            </div>
          </section>
          <For each={content.proseSections}>
            {(section) => (
              <section class="policy-prose">
                <h2>{section.title}</h2>
                <For each={section.paragraphs}>{(paragraph) => <p>{paragraph}</p>}</For>
              </section>
            )}
          </For>
          <aside class="contact-card">
            <div>
              <p class="eyebrow">{content.contact.eyebrow}</p>
              <h2>{content.contact.title}</h2>
              <p>{content.contact.body}</p>
            </div>
            <a class="button-primary" href={content.contact.action.href}>{content.contact.action.label}</a>
          </aside>
        </div>
      </article>
    </main>
  );
}
