import { For } from "solid-js";
import { homeContent } from "../../content/home";
import { PhoneFrame } from "../ui/PhoneFrame";

export function TuningSection() {
  const content = homeContent.tuning;

  return (
    <section class="section-pad tuning-section">
      <div class="content-wrap tuning-grid">
        <div class="tuning-copy">
          <p class="eyebrow">{content.eyebrow}</p>
          <h2>{content.title}</h2>
          <p>{content.body}</p>
          <div class="profile-list" aria-label={content.profilesAriaLabel}>
            <For each={content.profiles}>{(profile) => <span>{profile}</span>}</For>
          </div>
        </div>
        <div class="tuning-visual">
          <PhoneFrame image={content.image} />
          <For each={content.callouts}>
            {(callout, index) => (
              <div class={`tuning-callout callout-${index() === 0 ? "one" : "two"}`}>
                <span>{callout.label}</span>
                <strong>{callout.value}</strong>
              </div>
            )}
          </For>
        </div>
      </div>
    </section>
  );
}
