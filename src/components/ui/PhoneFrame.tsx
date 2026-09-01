import type { ImageContent } from "../../content/types";

export function PhoneFrame(props: { image: ImageContent; class?: string }) {
  return (
    <figure class={`phone-frame ${props.class ?? ""}`.trim()}>
      <span class="phone-speaker" aria-hidden="true" />
      <img
        src={props.image.src}
        width={props.image.width}
        height={props.image.height}
        alt={props.image.alt}
        loading={props.class?.includes("hero-phone") ? "eager" : "lazy"}
      />
    </figure>
  );
}
