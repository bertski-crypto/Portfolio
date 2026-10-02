/**
 * ============================================================
 *  CARD PARALLAX
 *  One shared scroll engine for the entire page.
 *
 *  Why it is built this way:
 *
 *  - A single passive scroll listener and a single IntersectionObserver
 *    serve every card, so listeners and observers are never stacked.
 *
 *  - Movement is written to the standalone CSS `translate` property.
 *    That property composes with the `transform` that framer-motion
 *    already owns for the scroll reveal and the card hover, so the two
 *    effects never fight and we don't need an extra wrapper element.
 *
 *  - Geometry reads are batched ahead of style writes, so scrolling
 *    never interleaves reads and writes and never thrashes layout.
 *
 *  - A lerp toward the target produces the slow, even easing the design
 *    calls for. The loop parks itself as soon as everything settles,
 *    so an idle page costs nothing.
 * ============================================================
 */

/** Hard ceiling on travel, in px at full desktop depth. */
const MAX_AMPLITUDE = 10;

/* Per-card variation so the grid never moves as one rigid block.
   Amplitude, direction and easing speed each differ per card. */
const AMPLITUDES = [8, 5, 10, 6, 9, 4];
const SIGNS = [1, -1, 1, -1, 1, -1];
const SPEEDS = [0.12, 0.15, 0.1, 0.13, 0.11, 0.14];

/** Elements the observer currently considers near the viewport. */
const visible = new Set<HTMLElement>();
/** Registered cards and their easing state. */
const entries = new Map<
  HTMLElement,
  { amplitude: number; sign: number; speed: number; current: number }
>();

let observer: IntersectionObserver | null = null;
let ticking = false;
let listening = false;
let motionQuery: MediaQueryList | null = null;

function prefersReduced() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/** Travel scales down on smaller screens: ~10px desktop, 7 tablet, 4 mobile. */
function depthFactor() {
  const w = typeof window !== 'undefined' ? window.innerWidth : 1024;
  if (w <= 480) return 0.4;
  if (w <= 1024) return 0.7;
  return 1;
}

function schedule() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(frame);
}

function frame() {
  ticking = false;
  if (prefersReduced() || visible.size === 0) return;

  const vh = window.innerHeight || 1;
  const half = vh / 2;
  const factor = depthFactor();

  /* ---- read phase: geometry for every visible card, batched ---- */
  const plan: Array<[HTMLElement, { speed: number; current: number }, number]> =
    [];

  for (const el of visible) {
    const state = entries.get(el);
    if (!state) continue;
    const rect = el.getBoundingClientRect();
    if (!rect.height) continue;
    const centre = rect.top + rect.height / 2;
    // -1 at the bottom edge of the viewport, +1 at the top edge.
    let p = (centre - half) / half;
    if (p < -1) p = -1;
    else if (p > 1) p = 1;
    plan.push([el, state, p * state.amplitude * state.sign * factor]);
  }

  /* ---- write phase: easing + transform, batched ---- */
  let moving = false;

  for (const [el, state, target] of plan) {
    const delta = target - state.current;
    if (Math.abs(delta) > 0.005) {
      state.current += delta * state.speed;
      moving = true;
    } else {
      state.current = target;
    }
    el.style.translate = `0px ${state.current.toFixed(3)}px`;
  }

  // Keep easing only while something is still travelling.
  if (moving) schedule();
}

function ensureObserver() {
  if (observer) return;
  observer = new IntersectionObserver(
    (list) => {
      for (const entry of list) {
        const el = entry.target as HTMLElement;
        if (entry.isIntersecting) {
          visible.add(el);
          el.style.willChange = 'translate';
        } else {
          visible.delete(el);
          el.style.willChange = '';
          // Settle it back to neutral while it is off screen so it
          // never reappears mid-travel.
          const state = entries.get(el);
          if (state) state.current = 0;
          el.style.translate = '0px 0px';
        }
      }
      schedule();
    },
    { rootMargin: '15% 0px 15% 0px' },
  );
}

function ensureListening() {
  if (listening) return;
  listening = true;

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });

  // If the OS motion preference flips on mid-session, drop every offset.
  motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const onMotionChange = () => {
    if (!prefersReduced()) return;
    for (const el of entries.keys()) el.style.translate = '0px 0px';
    for (const state of entries.values()) state.current = 0;
  };
  motionQuery.addEventListener('change', onMotionChange);
}

/**
 * Attach parallax to a card wrapper. Returns a cleanup function.
 * Safe to call with a null element, and a no-op under reduced motion.
 */
export function registerCard(
  el: HTMLElement | null,
  index = 0,
): () => void {
  const noop = () => {};

  if (!el || prefersReduced()) {
    el?.style.setProperty('translate', '0px 0px');
    return noop;
  }

  ensureObserver();
  ensureListening();

  entries.set(el, {
    amplitude: Math.min(AMPLITUDES[index % AMPLITUDES.length], MAX_AMPLITUDE),
    sign: SIGNS[index % SIGNS.length],
    speed: SPEEDS[index % SPEEDS.length],
    current: 0,
  });

  observer!.observe(el);
  schedule();

  return () => {
    entries.delete(el);
    visible.delete(el);
    observer?.unobserve(el);
    el.style.willChange = '';
    el.style.translate = '0px 0px';
  };
}