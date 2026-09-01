import { For } from "solid-js";
import { homeContent } from "../../content/home";
import { BionicSample } from "../ui/BionicSample";
import { PhoneFrame } from "../ui/PhoneFrame";
import { SectionHeading } from "../ui/SectionHeading";

export function ReadingExperienceSection() {
  const content = homeContent.experience;

  return (
    <section id="experience" class="section-pad">
      <div class="content-wrap">
        <SectionHeading content={content.heading} />
        <div class="mode-grid">
          <For each={content.modes}>
            {(mode) => (
              <article class={`mode-card mode-${mode.variant}`}>
                <div class="mode-copy">
                  <span class="mode-number">{mode.number}</span>
                  <p class="eyebrow">{mode.eyebrow}</p>
                  <h3>{mode.title}</h3>
                  <p>{mode.body}</p>
                </div>
                {mode.visual.kind === "phone" ? (
                  <PhoneFrame image={mode.visual.image} />
                ) : (
                  <BionicSample content={mode.visual} />
                )}
              </article>
            )}
          </For>
        </div>
      </div>
    </section>
  );
}
