import { useMemo } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type Variants,
} from 'framer-motion';

import {
  DUR,
  EASE,
  STAGGER,
  staggerChild,
  staggerParent,
  revealCard,
  revealHeading,
  revealLead,
  viewportOnce,
} from './motion';

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

const KIND_MAP: Record<string, Variants> = {
  heading: revealHeading,
  lead: revealLead,
  card: revealCard,
  item: staggerChild,
};

type RevealKind = keyof typeof KIND_MAP;

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
      variants={KIND_MAP[kind] ?? revealCard}
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
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: 'div' | 'li' | 'article';
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
    <Component className={className} style={style} variants={staggerChild}>
      {children}
    </Component>
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