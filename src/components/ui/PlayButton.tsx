import { siteContent } from "../../content/site";
import { Icon } from "./Icon";

export function PlayButton() {
  const content = siteContent.actions.getKairo;

  return (
    <a class="play-button" href={content.href} target="_blank" rel="noreferrer" aria-label={content.ariaLabel}>
      <span class="play-icon"><Icon name={content.icon} /></span>
      <span>
        <small>{content.platformLabel}</small>
        <strong>{content.label}</strong>
      </span>
    </a>
  );
}
