import { For } from "solid-js";
import type { BionicSampleContent } from "../../content/types";
import { Icon } from "./Icon";

export function BionicSample(props: { content: BionicSampleContent }) {
  return (
    <div class="bionic-sample" aria-label={props.content.ariaLabel}>
      <div class="bionic-progress">
        <span />
      </div>
      <p>
        <For each={props.content.words}>
          {(word) => {
            const split = Math.max(1, Math.ceil(word.length * 0.45));
            return <><strong>{word.slice(0, split)}</strong>{word.slice(split)}{" "}</>;
          }}
        </For>
      </p>
      <div class="bionic-controls" aria-hidden="true">
        <span>{props.content.controls.previous}</span>
        <span><Icon name={props.content.controls.playIcon} /></span>
        <span>{props.content.controls.next}</span>
      </div>
    </div>
  );
}
