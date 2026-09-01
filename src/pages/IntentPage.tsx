import { For } from "solid-js";
import { Icon } from "../components/ui/Icon";
import { PlayButton } from "../components/ui/PlayButton";
import { siteContent } from "../content/site";
import { seoPages, siteOrigin, type SeoPage } from "../content/seo";

export function IntentPage(props: { page: SeoPage }) {
  const content = siteContent.editorial;
  const structuredData = content.structuredData;
  const articleData = () => ({
    "@context": structuredData.schemaContext,
    "@type": structuredData.articleType,
    headline: props.page.heading,
    description: props.page.description,
    url: `${siteOrigin}${props.page.path}`,
    mainEntityOfPage: `${siteOrigin}${props.page.path}`,
    author: { "@type": structuredData.organizationType, name: structuredData.organizationName },
    publisher: {
      "@type": structuredData.organizationType,
      name: structuredData.organizationName,
      logo: { "@type": structuredData.imageObjectType, url: `${siteOrigin}${siteContent.brand.icon.src}` },
    },
  });

  return (
    <main class="editorial-page">
      <article class="section-pad">
        <div class="article-wrap">
          <a class="back-link" href={content.backAction.href}>
            <Icon name={content.backAction.icon} /> {content.backAction.label}
          </a>
          <p class="eyebrow">{props.page.eyebrow}</p>
          <h1>{props.page.heading}</h1>
          <p class="article-summary">{props.page.summary}</p>
          <div class="article-actions">
            <PlayButton />
            <a class="button-secondary" href={content.exploreAction.href}>
              {content.exploreAction.label} <Icon name={content.exploreAction.icon} />
            </a>
          </div>
          <ul class="highlight-grid" aria-label={content.highlightsAriaLabel}>
            <For each={props.page.highlights}>{(highlight) => <li><Icon name="check" /> {highlight}</li>}</For>
          </ul>
          <div class="article-sections">
            <For each={props.page.sections}>
              {(section, index) => (
                <section>
                  <span>{String(index() + 1).padStart(2, "0")}</span>
                  <div>
                    <h2>{section.title}</h2>
                    <p>{section.body}</p>
                  </div>
                </section>
              )}
            </For>
          </div>
          <aside class="related-card">
            <p class="eyebrow">{content.relatedEyebrow}</p>
            <div>
              <For each={props.page.related}>
                {(path) => {
                  const page = () => seoPages.find((candidate) => candidate.path === path);
                  return (
                    <a href={path}>
                      {page()?.navLabel ?? content.relatedFallbackLabel}
                      <Icon name="arrow" />
                    </a>
                  );
                }}
              </For>
            </div>
          </aside>
        </div>
        <script type="application/ld+json">{JSON.stringify(articleData())}</script>
      </article>
    </main>
  );
}
