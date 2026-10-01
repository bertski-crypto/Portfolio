import type { Variants, Transition } from 'framer-motion';

/**
 * ============================================================
 *  MOTION SYSTEM
 *  Single source of truth for timing, easing and variants.
 *  Pure data only — no hooks here (hooks live in motion.tsx).
 * ============================================================
 */

/* ---------------- Easing ---------------- */
export const EASE = {
  /** entrances — cubic-bezier(0.22, 1, 0.36, 1) */
  entrance: [0.22, 1, 0.36, 1] as const,
  /** exits */
  exit: [0.4, 0, 1, 1] as const,
  /** floating / ambient loops */
  inOut: [0.45, 0, 0.55, 1] as const,
  /** hover / micro */
  out: [0.16, 1, 0.3, 1] as const,
} as const;

/* ---------------- Duration (seconds) ---------------- */
export const DUR = {
  micro: 0.15,
  fast: 0.18,
  normal: 0.3,
  slow: 0.45,
  reveal: 0.7,
} as const;

/* ---------------- Stagger (seconds between siblings) ------ */
export const STAGGER = {
  tight: 0.06,
  base: 0.1,
  loose: 0.14,
} as const;

/* ---------------- Spring presets ---------------- */
export const SPRING = {
  soft: { type: 'spring', stiffness: 180, damping: 24, mass: 0.7 } as const,
  smooth: { type: 'spring', stiffness: 260, damping: 28, mass: 0.9 } as const,
  snappy: { type: 'spring', stiffness: 400, damping: 30, mass: 0.7 } as const,
} as const;

/* ============================================================
 *  VIEWPORT — fire once, slight bias upward
 * ============================================================ */
export const viewportOnce = { once: true, amount: 0.15, margin: '0px 0px -80px 0px' } as const;

/* ============================================================
 *  REVEAL VARIANTS
 * ============================================================ */

/** Heading: opacity + y + blur */
export const revealHeading: Variants = {
  hidden: { opacity: 0, y: 25, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: DUR.reveal, ease: EASE.entrance },
  },
};

/** Lead paragraph: slightly softer */
export const revealLead: Variants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(4px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: DUR.reveal, ease: EASE.entrance },
  },
};

/** Card / grid item */
export const revealCard: Variants = {
  hidden: { opacity: 0, y: 25, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DUR.reveal, ease: EASE.entrance },
  },
};

/** Bare container that only orchestrates children */
export const staggerParent = (gap: number = STAGGER.base, delay = 0): Variants => ({
  hidden: {},
  show: {
    transition: { staggerChildren: gap, delayChildren: delay },
  },
});

/** Alias used by grid sections */
export const staggerContainer = staggerParent();

/** Child of a stagger parent */
export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 25, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: DUR.reveal, ease: EASE.entrance },
  },
};

/** Backwards-compatible alias */
export const staggerItem = staggerChild;

/* ============================================================
 *  HERO ENTRANCE
 *  Sequence + per-step distance so it never feels mechanical.
 * ============================================================ */
export const HERO_STEPS = [
  { key: 'eyebrow', delay: 0.0, y: 14 },
  { key: 'title', delay: 0.1, y: 28 },
  { key: 'subtitle', delay: 0.18, y: 20 },
  { key: 'body', delay: 0.26, y: 18 },
  { key: 'actions', delay: 0.36, y: 16 },
  { key: 'social', delay: 0.45, y: 14 },
  { key: 'media', delay: 0.52, y: 24 },
] as const;

export const heroStep = (delay: number, y: number): Variants => ({
  hidden: { opacity: 0, y, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: DUR.reveal, ease: EASE.entrance, delay },
  },
});

/** Orchestrates the hero steps without per-child variants */
export const heroParent = (): Variants => ({
  hidden: {},
  show: {
    transition: { delayChildren: 0.05 },
  },
});

/* ============================================================
 *  AMBIENT LOOPS
 * ============================================================ */

/** Very subtle vertical drift + micro scale breath */
export const floatLoop: Variants = {
  animate: {
    y: [0, -6, 0],
    scale: [1, 1.005, 1],
    transition: {
      duration: 6,
      ease: EASE.inOut,
      repeat: Infinity,
      repeatType: 'loop',
    },
  },
};

/** Backwards-compatible alias */
export const float = floatLoop;

/** Slow drifting background orb */
export const orbDrift = (dx: number, dy: number, dur: number): Variants => ({
  animate: {
    x: [-dx, dx, -dx],
    y: [0, -dy, 0],
    transition: {
      duration: dur,
      ease: EASE.inOut,
      repeat: Infinity,
      repeatType: 'loop',
    },
  },
});

/** Slow particle float */
export const particleDrift = (dur: number): Variants => ({
  animate: {
    y: [0, -18, 0],
    x: [0, 6, 0],
    transition: {
      duration: dur,
      ease: EASE.inOut,
      repeat: Infinity,
      repeatType: 'loop',
    },
  },
});

/* ============================================================
 *  HOVER / TAP TOKENS  (plain objects — spread or assign freely)
 * ============================================================ */

export const hoverCard: Transition & Record<string, unknown> = {
  y: -5,
  scale: 1.01,
  borderColor: 'var(--line-accent)',
  boxShadow: 'var(--shadow-lift)',
  transition: { duration: DUR.normal, ease: EASE.out },
};

/** Softer variant for dense grids (labs, skills) */
export const hoverCardSoft: Transition & Record<string, unknown> = {
  y: -4,
  scale: 1.008,
  borderColor: 'var(--line-accent)',
  transition: { duration: DUR.normal, ease: EASE.out },
};

/** Hero profile card */
export const hoverProfile: Transition & Record<string, unknown> = {
  y: -4,
  scale: 1.015,
  borderColor: 'var(--line-accent)',
  boxShadow: 'var(--shadow-lift)',
  transition: { duration: DUR.normal, ease: EASE.out },
};

/** Primary CTA */
export const hoverPrimary: Transition & Record<string, unknown> = {
  y: -2,
  scale: 1.02,
  transition: { duration: DUR.fast, ease: EASE.out },
};

/** Secondary / ghost CTA */
export const hoverSecondary: Transition & Record<string, unknown> = {
  y: -2,
  transition: { duration: DUR.fast, ease: EASE.out },
};

/** Neutral small button (filters, chips) */
export const hoverSoft: Transition & Record<string, unknown> = {
  y: -1,
  scale: 1.03,
  transition: { duration: DUR.micro, ease: EASE.out },
};

/** Pressed state */
export const tapSoft = {
  y: 0,
  scale: 0.97,
  transition: { duration: DUR.micro, ease: EASE.out },
};

/** Social icon */
export const hoverSocial: Transition & Record<string, unknown> = {
  y: -2,
  scale: 1.08,
  transition: { duration: DUR.fast, ease: EASE.out },
};

/** Inline icon that trails a button hover */
export const hoverIconShift = (dx = 4, dy = 0) => ({
  x: dx,
  y: dy,
  transition: { duration: DUR.fast, ease: EASE.out },
});

/** Image zoom inside an overflow-hidden frame */
export const hoverZoom = (scale = 1.03) => ({
  scale,
  transition: { duration: DUR.normal, ease: EASE.out },
});

/** Icon nudge inside a card */
export const hoverIconPop = (scale = 1.08, y = -2) => ({
  scale,
  y,
  transition: { duration: DUR.fast, ease: EASE.out },
});

/** Backwards-compatible aliases */
export const glassCardHover = hoverCard;
export const primaryButtonHover = hoverPrimary;
export const secondaryButtonHover = hoverSecondary;
export const buttonTap = tapSoft;
export const socialHover = hoverSocial;
export const imageHover = hoverZoom(1.03);
export const profileHover = hoverProfile;

/* ============================================================
 *  BACKWARDS-COMPATIBLE VIEWPORT HELPER
 * ============================================================ */
export const viewportOptions = (once = true) =>
  ({ once, amount: 0.15, margin: '0px 0px -80px 0px' }) as const;