/** Scroll-driven depth without a CSS timeline dependency or a continuous RAF loop. */
export function mountParallax(root: HTMLElement): () => void {
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  // Explicit local preview only; production always honors the OS preference.
  const previewMotion = import.meta.env.DEV && new URLSearchParams(window.location.search).get("motion") === "on";
  const reducedMotion = () => motion.matches && !previewMotion;
  const specs = [
    { selector: ".hero-phone-mid", anchor: ".hero-visual", speed: 0.2, limit: 80, hero: true },
    { selector: ".hero-phone-front", anchor: ".hero-visual", speed: -0.32, limit: 128, hero: true },
    { selector: ".tuning-visual .phone-frame", anchor: ".tuning-visual", speed: -0.16, limit: 64, hero: false },
    { selector: ".gallery-preview", anchor: ".gallery-layout", speed: -0.12, limit: 48, hero: false },
  ];
  const layers = specs.flatMap((spec) => {
    const element = root.querySelector<HTMLElement>(spec.selector);
    const anchor = root.querySelector<HTMLElement>(spec.anchor);
    return element && anchor ? [{ ...spec, element, anchor, top: 0, height: 0, previous: element.style.translate }] : [];
  });
  let frame = 0;
  let dirty = true;
  let disposed = false;
  let viewport = 0;
  let mobile = false;

  const update = () => {
    frame = 0;
    if (disposed || reducedMotion()) return;
    const scroll = window.scrollY;
    // Read stationary anchors only on layout changes, never on ordinary scroll frames.
    if (dirty) {
      viewport = window.innerHeight;
      mobile = window.innerWidth <= 820;
      for (const layer of layers) {
        const rect = layer.anchor.getBoundingClientRect();
        layer.top = rect.top + scroll;
        layer.height = rect.height;
      }
      dirty = false;
    }
    for (const layer of layers) {
      const origin = layer.hero
        ? Math.max(0, layer.top - viewport * 0.55)
        : layer.top + layer.height / 2 - viewport / 2;
      const distance = layer.hero ? Math.max(0, scroll - origin) : scroll - origin;
      const strength = mobile ? 0.55 : 1;
      const offset = Math.max(-layer.limit, Math.min(layer.limit, distance * layer.speed)) * strength;
      // Independent translation preserves the existing rotation/centering transforms.
      const value = `0 ${offset.toFixed(2)}px`;
      if (layer.element.style.translate !== value) layer.element.style.translate = value;
    }
  };
  const schedule = () => {
    if (!disposed && !reducedMotion() && !frame) frame = window.requestAnimationFrame(update);
  };
  const measure = () => {
    dirty = true;
    schedule();
  };
  const reset = () => {
    window.cancelAnimationFrame(frame);
    frame = 0;
    for (const layer of layers) layer.element.style.translate = layer.previous;
  };
  const syncMotion = () => {
    window.removeEventListener("scroll", schedule);
    if (reducedMotion()) reset();
    else {
      window.addEventListener("scroll", schedule, { passive: true });
      measure();
    }
  };
  const observer = new ResizeObserver(measure);
  observer.observe(root);
  for (const layer of layers) observer.observe(layer.anchor);
  window.addEventListener("resize", measure, { passive: true });
  root.addEventListener("load", measure, true);
  motion.addEventListener("change", syncMotion);
  syncMotion();

  return () => {
    disposed = true;
    reset();
    observer.disconnect();
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", measure);
    root.removeEventListener("load", measure, true);
    motion.removeEventListener("change", syncMotion);
  };
}
