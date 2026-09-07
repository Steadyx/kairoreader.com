import { For, createSignal } from "solid-js";
import { homeContent } from "../../content/home";

export function GallerySection() {
  const [selected, setSelected] = createSignal(0);
  const content = homeContent.gallery;
  const screens = content.items;
  return (
    <section class="gallery-section section-pad" aria-labelledby="gallery-title">
      <div class="content-wrap gallery-layout">
        <div class="gallery-copy">
          <p class="eyebrow">{content.eyebrow}</p>
          <h2 id="gallery-title">{content.title}</h2>
          <p class="gallery-description">{content.body}</p>
          <div class="gallery-choices" aria-label="Choose an app preview">
            <For each={screens}>{(screen, index) => (
              <button type="button" aria-pressed={selected() === index()} aria-controls="gallery-preview" onClick={() => setSelected(index())}>
                <span class="gallery-index">0{index() + 1}</span><span>{screen.caption}</span><span aria-hidden="true">↗</span>
              </button>
            )}</For>
          </div>
        </div>
        <figure class="gallery-preview" id="gallery-preview" aria-live="polite">
          <img src={screens[selected()].image.src} width="810" height="1440" alt={screens[selected()].image.alt} loading="lazy" />
          <figcaption>{screens[selected()].description}</figcaption>
        </figure>
      </div>
    </section>
  );
}
