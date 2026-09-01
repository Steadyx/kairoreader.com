import { For } from "solid-js";
import { hrefForLocation, siteContent } from "../../content/site";

export function Footer(props: { isHome: boolean }) {
  const brand = siteContent.brand;
  const content = siteContent.footer;

  return (
    <footer class="site-footer">
      <div class="content-wrap footer-grid">
        <div>
          <a class="brand" href="/">
            <img src={brand.icon.src} width={brand.icon.width} height={brand.icon.height} alt={brand.icon.alt} />
            <span>{brand.name}</span>
          </a>
          <p>{brand.tagline}</p>
        </div>
        <div class="footer-links">
          <For each={content.groups}>
            {(group) => (
              <div>
                <strong>{group.title}</strong>
                <For each={group.links}>
                  {(link) => (
                    <a
                      href={hrefForLocation(link, props.isHome)}
                      target={"external" in link && link.external ? "_blank" : undefined}
                      rel={"external" in link && link.external ? "noreferrer" : undefined}
                    >
                      {link.label}
                    </a>
                  )}
                </For>
              </div>
            )}
          </For>
        </div>
      </div>
      <div class="content-wrap footer-bottom">
        <span>{content.copyright}</span>
        <span>{content.releaseSummary}</span>
      </div>
    </footer>
  );
}
