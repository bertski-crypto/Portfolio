/**
 * ============================================================
 *  SCROLL MOTION ENGINE
 *  One shared engine for every scroll-driven effect on the page:
 *  card parallax and section timeline draw-down.
 *
 *  Why it is built this way:
 *
 *  - A single passive scroll listener and a single IntersectionObserver
 *    serve every card AND every timeline rail, so listeners and observers
 *    are never stacked.
 *
 *  - Card movement is written to the standalone CSS `translate` property.
 *    That property composes with the `transform` that framer-motion
 *    already owns for the scroll reveal and the card hover, so the two
 *    effects never fight and we don't need an extra wrapper element.
 *
 *  - Geometry reads are batched ahead of style writes, so scrolling
 *    never interleaves reads and writes and never thrashes layout.
 *
 *  - A lerp toward the target produces slow, even easing. The loop parks
 *    itself as soon as everything settles, so an idle page costs nothing.
 * ============================================================ */

/** Hard ceiling on card travel, in px at full desktop depth. */
const MAX_AMPLITUDE = 10;

/* Per-card variation so the grid never moves as one rigid block.
   Amplitude, direction and easing speed each differ per card. */
const AMPLITUDES = [8, 5, 10, 6, 9, 4];
const SIGNS = [1, -1, 1, -1, 1, -1];
const SPEEDS = [0.12, 0.15, 0.1, 0.13, 0.11, 0.14];

/* ---------------- Section timeline ---------------- */

/** How much of the rail must be drawn before a node reads as reached. */
const NODE_RAMP = 0.14;
/** Rail easing rate, expressed per 60fps frame. */
const RAIL_SPEED = 0.16;
/** Rail begins drawing here and completes here, as a fraction of viewport height. */
const RAIL_START = 0.85;
const RAIL_END = 0.35;
/** Longest frame we will integrate, so a backgrounded tab cannot jump. */
const MAX_FRAME_MS = 64;

type CardState = {
  amplitude: number;
  sign: number;
  speed: number;
  current: number;
};

type NodeState = { el: HTMLElement };

type RailState = {
  el: HTMLElement;
  nodes: NodeState[];
  /** True while the observer considers the rail near the viewport. */
  visible: boolean;
  /** Latched 0-1 fill. Never decreases, so scrolling back up never rewinds. */
  progress: number;
  /** Eased value actually written to CSS. */
  eased: number;
};

/** One rail's geometry for a single frame, gathered before any write. */
type RailRead = {
  rail: RailState;
  /** Rail top in viewport space, used for the scroll-progress curve. */
  top: number;
  /** 0-1 threshold for each node. */
  nodeAt: number[];
  values: number[];
};

/** Cards the observer currently considers near the viewport. */
const visible = new Set<HTMLElement>();
/** Registered cards and their easing state. */
const cards = new Map<HTMLElement, CardState>();
/** Registered rails. */
const rails = new Map<HTMLElement, RailState>();

let observer: IntersectionObserver | null = null;
let ticking = false;
let listening = false;
let motionQuery: MediaQueryList | null = null;
let lastTime = 0;

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

/** Clamped to 0-1. Written so a NaN can never escape: an invalid number
    reaching a calc() would collapse opacity or scale to 0 and silently hide
    the element. NaN falls through to 0 here instead. */
function clamp01(n: number) {
  return n > 0 ? (n < 1 ? n : 1) : 0;
}

/**
 * Framerate-independent easing. `rate` is the fraction covered in one
 * 60fps frame, so the line draws at the same speed on a 30Hz panel as on
 * a 120Hz one instead of changing pace with the display.
 */
function easeFactor(rate: number, dt: number) {
  const frames = dt / 16.667;
  return 1 - Math.pow(1 - rate, frames);
}

/**
 * Where a node sits along the rail, as a 0-1 fraction.
 *
 * Uses offsetTop rather than getBoundingClientRect on purpose: the rect
 * includes the scroll reveal's translateY, so a node's threshold would
 * jump by ~25px the moment its own card animated in. The offset chain is
 * the untransformed layout box, so the threshold is stable.
 */
function nodeThreshold(node: HTMLElement, railHeight: number) {
  const host = node.offsetParent as HTMLElement | null;
  let y = node.offsetTop + node.offsetHeight / 2;
  // Add the slot's offset only when the slot is itself a positioned
  // offsetParent; otherwise node.offsetTop is already measured from the rail.
  if (host && host.offsetParent) y += host.offsetTop;
  return railHeight ? clamp01(y / railHeight) : 0;
}

function schedule() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(frame);
}

function frame(time: number) {
  ticking = false;

  const dt = lastTime ? Math.min(time - lastTime, MAX_FRAME_MS) : 16.667;
  lastTime = time;

  const reduced = prefersReduced();
  const vh = window.innerHeight || 1;

  /* ================= read phase =================
     Every geometry measurement happens here, before a single style is
     written, so the frame never interleaves reads and writes. */

  const cardPlan: Array<[HTMLElement, CardState, number]> = [];

  if (!reduced && visible.size > 0) {
    const half = vh / 2;
    const factor = depthFactor();

    for (const el of visible) {
      const state = cards.get(el);
      if (!state) continue;
      const rect = el.getBoundingClientRect();
      if (!rect.height) continue;
      const centre = rect.top + rect.height / 2;
      // -1 at the bottom edge of the viewport, +1 at the top edge.
      let p = (centre - half) / half;
      if (p < -1) p = -1;
      else if (p > 1) p = 1;
      cardPlan.push([el, state, p * state.amplitude * state.sign * factor]);
    }
  }

  const railReads = new Map<RailState, RailRead>();

  if (reduced) {
    /* Nothing needs measuring. Thresholds are all zero so every node reads
       as reached and the timeline is presented already complete. */
    for (const rail of rails.values()) {
      const n = rail.nodes.length;
      railReads.set(rail, {
        rail,
        top: 0,
        nodeAt: new Array<number>(n).fill(0),
        values: new Array<number>(n).fill(1),
      });
    }
  } else {
    for (const rail of rails.values()) {
      // Only a rail that is on screen needs measuring. An off-screen rail
      // still gets eased below, so a fast flick that outruns the easing
      // can never leave the line stranded half-drawn.
      if (!rail.visible) continue;
      const height = rail.el.offsetHeight;
      if (!height) continue;
      const nodeAt: number[] = [];
      for (const n of rail.nodes) nodeAt.push(nodeThreshold(n.el, height));
      railReads.set(rail, {
        rail,
        top: rail.el.getBoundingClientRect().top,
        nodeAt,
        values: new Array(rail.nodes.length).fill(0),
      });
    }
  }

  /* ================= write phase ================= */

  let moving = false;

  for (const [el, state, target] of cardPlan) {
    const delta = target - state.current;
    if (Math.abs(delta) > 0.005) {
      state.current += delta * state.speed;
      moving = true;
    } else {
      state.current = target;
    }
    el.style.translate = `0px ${state.current.toFixed(3)}px`;
  }

  let railMoving = false;

  for (const rail of rails.values()) {
    const read = railReads.get(rail);

    /* Reduced motion presents the finished timeline immediately, so no
       information is ever withheld. */
    if (reduced) {
      rail.progress = 1;
      rail.eased = 1;
    } else {
      if (read) {
        let p = (vh * RAIL_START - read.top) / (vh * (RAIL_START - RAIL_END));
        p = clamp01(p);
        /* Latch: the line draws once and never rewinds on scroll-up. */
        if (p > rail.progress) rail.progress = p;
      }

      const delta = rail.progress - rail.eased;
      if (Math.abs(delta) > 0.0005) {
        rail.eased += delta * easeFactor(RAIL_SPEED, dt);
        railMoving = true;
      } else {
        rail.eased = rail.progress;
      }
    }

    rail.el.style.setProperty('--tl-progress', rail.eased.toFixed(4));

    /* Node states are only recomputed for a rail we measured this frame.
       Off-screen rails keep the values they were last given. */
    const n = rail.nodes.length;
    if (!n || !read) continue;

    let currentIdx = -1;

    for (let i = 0; i < n; i++) {
      const v = clamp01((rail.eased - read.nodeAt[i]) / NODE_RAMP);
      read.values[i] = v;
      if (v > 0.5) currentIdx = i;
    }

    for (let i = 0; i < n; i++) {
      const node = rail.nodes[i].el;
      node.style.setProperty('--tl-reached', read.values[i].toFixed(3));
      node.style.setProperty(
        '--tl-current',
        (i === currentIdx ? read.values[i] : 0).toFixed(3),
      );
    }
  }

  // Keep easing only while something is still travelling.
  if (moving || railMoving) schedule();
}

function handleIntersection(entries: IntersectionObserverEntry[]) {
  for (const entry of entries) {
    const el = entry.target as HTMLElement;

    const rail = rails.get(el);
    if (rail) {
      rail.visible = entry.isIntersecting;
      continue;
    }

    if (entry.isIntersecting) {
      visible.add(el);
      el.style.willChange = 'translate';
    } else {
      visible.delete(el);
      el.style.willChange = '';
      // Settle it back to neutral while it is off screen so it
      // never reappears mid-travel.
      const state = cards.get(el);
      if (state) state.current = 0;
      el.style.translate = '0px 0px';
    }
  }
  schedule();
}

function ensureObserver() {
  if (observer) return;
  observer = new IntersectionObserver(handleIntersection, {
    rootMargin: '15% 0px 15% 0px',
  });
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
    for (const el of cards.keys()) el.style.translate = '0px 0px';
    for (const state of cards.values()) state.current = 0;
    for (const el of rails.keys()) {
      el.style.setProperty('--tl-progress', '1');
    }
    schedule();
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

  cards.set(el, {
    amplitude: Math.min(AMPLITUDES[index % AMPLITUDES.length], MAX_AMPLITUDE),
    sign: SIGNS[index % SIGNS.length],
    speed: SPEEDS[index % SPEEDS.length],
    current: 0,
  });

  observer!.observe(el);
  schedule();

  return () => {
    cards.delete(el);
    visible.delete(el);
    observer?.unobserve(el);
    el.style.willChange = '';
    el.style.translate = '0px 0px';
  };
}

/** Creates the rail entry on demand so registration order does not matter —
    React runs a child's effect before its parent's, so nodes frequently
    register before the rail itself does. */
function ensureRail(el: HTMLElement): RailState {
  let rail = rails.get(el);
  if (!rail) {
    const reduced = prefersReduced();
    rail = {
      el,
      nodes: [],
      visible: false,
      progress: reduced ? 1 : 0,
      eased: reduced ? 1 : 0,
    };
    rails.set(el, rail);
    observer!.observe(el);
    // Present the completed timeline straight away under reduced motion.
    if (reduced) el.style.setProperty('--tl-progress', '1');
  }
  return rail;
}

/**
 * Attach a section timeline rail. Returns a cleanup function.
 * Idempotent - safe to call alongside node registration in any order.
 */
export function registerTimeline(el: HTMLElement | null): () => void {
  if (!el) return () => {};

  ensureObserver();
  ensureListening();
  ensureRail(el);
  schedule();

  return () => {
    rails.delete(el);
    observer?.unobserve(el);
    el.style.removeProperty('--tl-progress');
  };
}

/**
 * Register one node against a rail. Nodes are kept in registration order,
 * which matches DOM order, so "current" resolves to the last one reached.
 */
export function registerTimelineNode(
  railEl: HTMLElement | null,
  nodeEl: HTMLElement | null,
): () => void {
  if (!railEl || !nodeEl) return () => {};

  ensureObserver();
  ensureListening();
  const rail = ensureRail(railEl);
  const entry: NodeState = { el: nodeEl };
  rail.nodes.push(entry);
  schedule();

  return () => {
    const i = rail.nodes.indexOf(entry);
    if (i >= 0) rail.nodes.splice(i, 1);
    nodeEl.style.removeProperty('--tl-reached');
    nodeEl.style.removeProperty('--tl-current');
  };
}