import { homeContent } from "../../content/home";
import { PlayButton } from "../ui/PlayButton";

export function FinalCtaSection() {
  const content = homeContent.finalCta;

  return (
    <section class="final-cta section-pad">
      <div class="content-wrap final-cta-inner">
        <img
          src={content.image.src}
          width={content.image.width}
          height={content.image.height}
          alt={content.image.alt}
        />
        <p class="eyebrow">{content.eyebrow}</p>
        <h2>{content.title}</h2>
        <p>{content.body}</p>
        <PlayButton />
      </div>
    </section>
  );
}
