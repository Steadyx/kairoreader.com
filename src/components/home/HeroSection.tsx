import { For } from "solid-js";
import { homeContent } from "../../content/home";
import { Icon } from "../ui/Icon";
import { PhoneFrame } from "../ui/PhoneFrame";
import { PlayButton } from "../ui/PlayButton";

const phoneClassByPosition = {
  back: "hero-phone hero-phone-back",
  middle: "hero-phone hero-phone-mid",
  front: "hero-phone hero-phone-front",
} as const;

export function HeroSection() {
  const content = homeContent.hero;

  return (
    <>
      <section class="hero section-pad" aria-labelledby="hero-title">
        <div class="hero-glow" aria-hidden="true" />
        <div class="hero-grid content-wrap">
          <div class="hero-copy">
            <p class="eyebrow">
              <span class="status-dot" />
              {content.announcement}
            </p>
            <h1 id="hero-title">
              {content.title.text} <span>{content.title.emphasis}</span>
            </h1>
            <p class="hero-lede">{content.lede}</p>
            <div class="hero-actions">
              <PlayButton />
              <a class="button-secondary" href={content.actions.learnMore.href}>
                {content.actions.learnMore.label}
                <Icon name={content.actions.learnMore.icon} />
              </a>
              <a
                class="button-secondary hero-support"
                href={content.actions.support.href}
                target="_blank"
                rel="noreferrer"
              >
                <Icon name={content.actions.support.icon} />
                {content.actions.support.label}
              </a>
            </div>
            <div class="hero-proof" aria-label={content.proofAriaLabel}>
              <For each={content.proofItems}>
                {(item) => (
                  <span>
                    <Icon name={item.icon} /> {item.label}
                  </span>
                )}
              </For>
            </div>
          </div>

          <div class="hero-visual" aria-label={content.visualAriaLabel}>
            <div class="orbit orbit-one" aria-hidden="true" />
            <div class="orbit orbit-two" aria-hidden="true" />
            <For each={content.screenshots}>
              {(screenshot) => (
                <PhoneFrame class={phoneClassByPosition[screenshot.position]} image={screenshot.image} />
              )}
            </For>
            <div class="floating-note note-formats">
              <span>{content.formatNote.label}</span>
              <strong>{content.formatNote.value}</strong>
            </div>
            <div class="floating-note note-local">
              <Icon name={content.localNote.icon} />
              <span>
                <strong>{content.localNote.title}</strong>
                {content.localNote.body}
              </span>
            </div>
          </div>
        </div>
        <div class="scroll-cue content-wrap" aria-hidden="true">
          <span>{content.scrollCue}</span>
          <i />
        </div>
      </section>

      <section class="intro-strip" aria-label={content.principlesAriaLabel}>
        <div class="content-wrap intro-strip-grid">
          <For each={content.principles}>{(principle) => <p>{principle}</p>}</For>
        </div>
      </section>
    </>
  );
}
