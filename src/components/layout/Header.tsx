import { For } from "solid-js";
import { hrefForLocation, siteContent } from "../../content/site";
import { Icon } from "../ui/Icon";

type HeaderProps = {
  isHome: boolean;
  isDark: boolean;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onToggleTheme: () => void;
};

export function Header(props: HeaderProps) {
  const content = siteContent.header;
  const brand = siteContent.brand;
  const getKairo = siteContent.actions.getKairo;

  return (
    <header class="site-header">
      <div class="nav-wrap">
        <a class="brand" href="/" aria-label={brand.homeAriaLabel}>
          <img src={brand.icon.src} width={brand.icon.width} height={brand.icon.height} alt={brand.icon.alt} />
          <span>{brand.name}</span>
          <span class="version-pill">{siteContent.release.badge}</span>
        </a>
        <nav classList={{ "nav-links": true, open: props.menuOpen }} aria-label={content.navigationAriaLabel}>
          <For each={content.links}>
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
          <a class="nav-play" href={getKairo.href} target="_blank" rel="noreferrer">
            {getKairo.headerLabel}
            <Icon name="arrow" />
          </a>
        </nav>
        <div class="nav-actions">
          <button
            class="icon-button"
            type="button"
            onClick={props.onToggleTheme}
            aria-label={props.isDark ? content.themeToggleLabel.light : content.themeToggleLabel.dark}
          >
            <Icon name={props.isDark ? "sun" : "moon"} />
          </button>
          <button
            class="icon-button menu-button"
            type="button"
            onClick={props.onToggleMenu}
            aria-expanded={props.menuOpen}
            aria-label={props.menuOpen ? content.menuLabel.close : content.menuLabel.open}
          >
            <Icon name={props.menuOpen ? "x" : "menu"} />
          </button>
        </div>
      </div>
    </header>
  );
}
