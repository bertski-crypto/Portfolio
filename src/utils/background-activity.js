/**
 * Idle-settle for the fixed background layers.
 *
 * The 3D canvas and ambient layers sit behind every glass surface on the
 * page. While they keep moving, the browser must re-sample and re-blur the
 * backdrop of every `backdrop-filter` element each frame — the single
 * biggest idle GPU cost of the design. After a quiet spell the layers
 * pause: the backdrop becomes static, the canvas stops painting, and the
 * compositor can reuse its cached blur. Any scroll, pointer or key
 * activity resumes everything instantly, with no visual jump.
 *
 * Tune the quiet spell with IDLE_MS.
 */

const IDLE_MS = 12000;

let started = false;
let timer = 0;
let settled = false;
const subscribers = new Set();

function apply(next) {
  if (next === settled) return;
  settled = next;
  document.documentElement.toggleAttribute('data-bg-settled', settled);
  for (const fn of subscribers) fn(settled);
}

function wake() {
  clearTimeout(timer);
  apply(false);
  timer = setTimeout(() => apply(true), IDLE_MS);
}

/** Subscribe to settle changes. Called once immediately with the current state. */
export function subscribeBackgroundActivity(fn) {
  subscribers.add(fn);
  fn(settled);
  return () => {
    subscribers.delete(fn);
  };
}

/** Call once from the app entry. */
export function initBackgroundActivity() {
  if (started || typeof window === 'undefined') return;
  started = true;
  const wakeEvents = ['pointermove', 'pointerdown', 'keydown', 'touchstart', 'wheel'];
  for (const type of wakeEvents) window.addEventListener(type, wake, { passive: true });
  /* Scroll events do not bubble, so they are captured at the document. */
  document.addEventListener('scroll', wake, { passive: true, capture: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearTimeout(timer);
      apply(true);
    } else {
      wake();
    }
  });
  wake();
}
