import { useEffect, useMemo, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';

import {
  DUR,
  EASE,
  STAGGER,
  groupVariants,
  revealVariants,
  staggerChildVariants,
  staggerParent,
  viewportOnce,
  type RevealKind,
} from './motion';
import { registerCard } from './card-parallax';

/* ============================================================
 *  HOOKS
 * ============================================================ */

/** True when the user asked for reduced motion. */
export function useReduced() {
  return useReducedMotion() ?? false;
}

/** Instant transition when reduced, otherwise the provided one. */
export function useT(overrides?: Record<string, unknown>) {
  const reduced = useReduced();
  return useMemo(
    () =>
      reduced
        ? { duration: 0 }
        : { duration: DUR.normal, ease: EASE.entrance, ...overrides },
    [reduced, overrides],
  );
}

/** Props that neutralise all motion for a subtree. */
export function useStill() {
  const reduced = useReduced();
  return useMemo(
    () =>
      reduced
        ? {
            initial: false as const,
            whileHover: undefined,
            whileTap: undefined,
            animate: undefined,
          }
        : {},
    [reduced],
  );
}

/** Normalised pointer position (-1 … 1) with spring smoothing. */
export function usePointerParallax(strength = 4) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 140, damping: 26, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 140, damping: 26, mass: 0.6 });

  const tx = useTransform(sx, [-1, 1], [-strength, strength]);
  const ty = useTransform(sy, [-1, 1], [-strength, strength]);

  return { x: tx, y: ty, setX: x.set, setY: y.set };
}

/** True on coarse pointers (touch) — used to gate parallax + cursor glow. */
export function useHasFinePointer() {
  return useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  }, []);
}

/** True on wide viewports — used to gate parallax. */
export function useIsDesktop(min = 1024) {
  return useMemo(() => {
    if (typeof window === 'undefined') return false;
    const mq = window.matchMedia(`(min-width: ${min}px)`);
    const update = () => mq.matches;
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [min]);
}

/**
 * Multiplier applied to reveal travel distance. Phones get roughly half
 * the movement so the same animation reads as subtle rather than big.
 * Read once on mount — reveals are fire-and-forget, so a mid-session
 * resize never needs to re-trigger them.
 */
export function useRevealScale() {
  return useState(() => {
    if (typeof window === 'undefined') return 1;
    return window.matchMedia('(max-width: 767px)').matches ? 0.5 : 1;
  })[0];
}

/** Smoothed 0 → 1 page scroll progress. */
export function useScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 30,
    restDelta: 0.001,
  });
  return scaleX;
}

/* ============================================================
 *  <Reveal>
 *  Scroll-triggered reveal. Picks its own variant by `kind`
 *  and becomes a no-op under reduced motion.
 * ============================================================ */

type RevealProps = {
  children: React.ReactNode;
  kind?: RevealKind;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
  as?: 'div' | 'section' | 'article' | 'header' | 'li' | 'span';
  amount?: number;
  once?: boolean;
};

export function Reveal({
  children,
  kind = 'card',
  className,
  delay = 0,
  style,
  as = 'div',
  amount,
  once = true,
}: RevealProps) {
  const reduced = useReduced();
  const scale = useRevealScale();
  const Component = motion[as] as typeof motion.div;

  if (reduced) {
    const Tag = as as keyof JSX.IntrinsicElements;
    return (
      <Tag className={className} style={style}>
        {children}
      </Tag>
    );
  }

  return (
    <Component
      className={className}
      style={style}
      variants={
        kind === 'group' ? groupVariants() : revealVariants(kind, scale)
      }
      initial="hidden"
      whileInView="show"
      viewport={amount ? { ...viewportOnce, amount } : viewportOnce}
      transition={{ delay }}
    >
      {children}
    </Component>
  );
}

/* ============================================================
 *  <Stagger> + <StaggerItem>
 *  Orchestrated grid reveals with per-child stagger.
 * ============================================================ */

export function Stagger({
  children,
  className,
  gap = STAGGER.base,
  delay = 0,
  style,
  amount,
  as = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  gap?: number;
  delay?: number;
  style?: React.CSSProperties;
  amount?: number;
  as?: 'div' | 'ul' | 'section';
}) {
  const reduced = useReduced();
  const Component = motion[as] as typeof motion.div;

  if (reduced) {
    const Tag = as as keyof JSX.IntrinsicElements;
    return (
      <Tag className={className} style={style}>
        {children}
      </Tag>
    );
  }

  return (
    <Component
      className={className}
      style={style}
      variants={staggerParent(gap, delay)}
      initial="hidden"
      whileInView="show"
      viewport={amount ? { ...viewportOnce, amount } : viewportOnce}
    >
      {children}
    </Component>
  );
}

export function StaggerItem({
  children,
  className,
  style,
  as = 'div',
  parallax = false,
  parallaxIndex = 0,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: 'div' | 'li' | 'article';
  /**
   * Opt this card into scroll-based parallax. Opt-in, because not every
   * staggered child is a card — form fields and buttons should not drift.
   */
  parallax?: boolean;
  /**
   * Position within its grid. Drives the per-card variation in travel
   * distance, direction and easing speed, so cards never move in lockstep.
   */
  parallaxIndex?: number;
}) {
  const reduced = useReduced();
  const scale = useRevealScale();
  const Component = motion[as] as typeof motion.div;
  const cardRef = useRef<HTMLElement | null>(null);

  /* Parallax lives on this slot wrapper, while the reveal animates the
     same element's `transform` and the card's hover animates the element
     below it. Because scroll movement is written to the standalone CSS
     `translate` property it composes with both instead of overwriting
     them, so no extra wrapper element is needed. */
  useEffect(() => {
    if (!parallax || reduced) return;
    return registerCard(cardRef.current, parallaxIndex);
  }, [parallax, parallaxIndex, reduced]);

  if (reduced) {
    const Tag = as as keyof JSX.IntrinsicElements;
    return (
      <Tag className={className} style={style}>
        {children}
      </Tag>
    );
  }

  return (
    <Component
      ref={cardRef}
      className={className}
      style={style}
      variants={staggerChildVariants(scale)}
    >
      {children}
    </Component>
  );
}

/* ============================================================
 *  <SectionTitle>
 *  Kicker → heading, revealed as two separate steps inside a
 *  single orchestrated group. Renders the same DOM as before
 *  (div > .kicker + h2), so nothing about the layout shifts.
 * ============================================================ */

type SectionTitleProps = {
  /** Section number, e.g. "04". */
  num: string;
  /** Kicker text beside the number. */
  kicker: string;
  /** id for the heading, wired to the section's aria-labelledby. */
  id?: string;
  /** Heading class — normally heading-lg. */
  className?: string;
  children: React.ReactNode;
};

export function SectionTitle({
  num,
  kicker,
  id,
  className = 'heading-lg',
  children,
}: SectionTitleProps) {
  const reduced = useReduced();
  const scale = useRevealScale();

  const group = useMemo(() => groupVariants(), []);
  const label = useMemo(() => revealVariants('label', scale), [scale]);
  const heading = useMemo(() => revealVariants('heading', scale), [scale]);

  if (reduced) {
    return (
      <div>
        <div className="kicker">
          <span>{num}</span>
          <span>{kicker}</span>
        </div>
        <h2 id={id} className={className}>
          {children}
        </h2>
      </div>
    );
  }

  return (
    <motion.div variants={group} initial="hidden" whileInView="show" viewport={viewportOnce}>
      <motion.div className="kicker" variants={label}>
        <span>{num}</span>
        <span>{kicker}</span>
      </motion.div>
      <motion.h2 id={id} className={className} variants={heading}>
        {children}
      </motion.h2>
    </motion.div>
  );
}

/* ============================================================
 *  <SectionReveal>
 *  Wraps a whole section: header first, then children, then grid.
 * ============================================================ */

export function SectionHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Stagger className={className} gap={0.08} delay={0.04}>
      {children}
    </Stagger>
  );
}

export {
  DUR,
  EASE,
  SPRING,
  STAGGER,
  floatLoop,
  float,
  heroStep,
  heroParent,
  orbDrift,
  particleDrift,
  viewportOptions,
  groupVariants,
  revealVariants,
  staggerChildVariants,
  staggerContainer,
  staggerItem,
  hoverCard,
  hoverCardSoft,
  hoverIconPop,
  hoverIconShift,
  hoverPrimary,
  hoverProfile,
  hoverSecondary,
  hoverSocial,
  hoverSoft,
  hoverZoom,
  tapSoft,
  buttonTap,
  glassCardHover,
  imageHover,
  primaryButtonHover,
  profileHover,
  secondaryButtonHover,
  socialHover,
} from './motion';