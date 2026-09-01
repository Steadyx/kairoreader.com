import { For } from "solid-js";
import { homeContent } from "../../content/home";

export function GallerySection() {
  const content = homeContent.gallery;

  return (
    <section class="gallery-section section-pad" aria-labelledby="gallery-title">
      <div class="content-wrap">
        <div class="gallery-heading">
          <div>
            <p class="eyebrow">{content.eyebrow}</p>
            <h2 id="gallery-title">{content.title}</h2>
          </div>
          <p>{content.body}</p>
        </div>
        <div class="screen-gallery">
          <For each={content.items}>
            {(item) => (
              <figure>
                <img
                  src={item.image.src}
                  width={item.image.width}
                  height={item.image.height}
                  alt={item.image.alt}
                  loading="lazy"
                />
                <figcaption>{item.caption}</figcaption>
              </figure>
            )}
          </For>
        </div>
      </div>
    </section>
  );
}
