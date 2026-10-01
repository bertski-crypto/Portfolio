import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

import {
  EASE,
  orbDrift,
  particleDrift,
  useHasFinePointer,
  useIsDesktop,
  useReduced,
} from '../utils/motion-primitives';
import '../styles/components/ambient.css';

/* ------------------------------------------------------------------ */
/*  Deterministic pseudo-random so SSR/build never mismatches.         */
/* ------------------------------------------------------------------ */
function makeRandom(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/* ------------------------------------------------------------------ */
/*  Particle field — slow drift, varied speeds, tiny + decorative      */
/* ------------------------------------------------------------------ */
function ParticleField() {
  const reduced = useReduced();
  const [count, setCount] = useState(0);

  useEffect(() => {
    const desktop = window.matchMedia('(min-width: 768px)').matches;
    const saveData = navigator.connection && navigator.connection.saveData;
    setCount(saveData ? 0 : desktop ? 28 : 10);
  }, []);

  const particles = useMemo(() => {
    const rand = makeRandom(20260928); // stable seed
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: rand() * 100,
      top: rand() * 100,
      size: 1 + rand() * 2,
      opacity: 0.12 + rand() * 0.22,
      duration: 14 + rand() * 16, // 14–30s, desynchronised
      delay: -rand() * 20,
    }));
  }, [count]);

  if (reduced || count === 0) return null;

  return (
    <div className="ambient-particles" aria-hidden="true">
      {particles.map((p) => (
        <motion.span
          key={p.id}
          className="ambient-particle"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
          }}
          variants={particleDrift(p.duration)}
          initial="hidden"
          animate="animate"
          transition={{ delay: p.delay, duration: p.duration, ease: EASE.inOut, repeat: Infinity }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Cursor light — soft, low-opacity, desktop fine-pointer only        */
/* ------------------------------------------------------------------ */
function CursorLight() {
  const enabled = useHasFinePointer();
  const isDesktop = useIsDesktop(1024);
  const reduced = useReduced();

  const x = useMotionValue(-400);
  const y = useMotionValue(-400);
  const sx = useSpring(x, { stiffness: 90, damping: 26, mass: 0.7 });
  const sy = useSpring(y, { stiffness: 90, damping: 26, mass: 0.7 });

  useEffect(() => {
    if (!enabled || reduced) return;
    const onMove = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [enabled, reduced, x, y]);

  if (!enabled || !isDesktop || reduced) return null;

  return (
    <motion.div
      className="ambient-cursor"
      aria-hidden="true"
      style={{ x: sx, y: sy }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, delay: 0.6, ease: EASE.entrance }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Drifting orbs — replaces the old CSS keyframes so each            */
/*  orb gets its own duration / direction / delay.                    */
/* ------------------------------------------------------------------ */
const ORBS = [
  { cls: 'ambient-blob--a', dx: 26, dy: 18, duration: 19, delay: 0 },
  { cls: 'ambient-blob--b', dx: -22, dy: 24, duration: 24, delay: -6 },
  { cls: 'ambient-blob--c', dx: 18, dy: -16, duration: 29, delay: -13 },
];

function Orbs() {
  const reduced = useReduced();

  return (
    <>
      {ORBS.map((orb) =>
        reduced ? (
          <div key={orb.cls} className={`ambient-blob ${orb.cls}`} aria-hidden="true" />
        ) : (
          <motion.div
            key={orb.cls}
            className={`ambient-blob ${orb.cls}`}
            aria-hidden="true"
            variants={orbDrift(orb.dx, orb.dy, orb.duration)}
            initial="hidden"
            animate="animate"
            transition={{ delay: orb.delay, duration: orb.duration, ease: EASE.inOut, repeat: Infinity }}
          />
        ),
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Public component                                                    */
/* ------------------------------------------------------------------ */
export default function Ambient() {
  const reduced = useReduced();
  const gridRef = useRef(null);
  const isDesktop = useIsDesktop(1024);

  // very slow grid drift, desktop only
  const gridX = useMotionValue(0);
  const gridY = useMotionValue(0);

  useEffect(() => {
    if (reduced || !isDesktop) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t) => {
      const e = (t - t0) / 1000;
      gridX.set(Math.sin(e / 26) * 26);
      gridY.set(Math.cos(e / 31) * 20);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced, isDesktop, gridX, gridY]);

  return (
    <div className="ambient-layer" aria-hidden="true">
      <motion.div
        ref={gridRef}
        className="ambient-grid"
        style={reduced ? undefined : { x: gridX, y: gridY }}
      />
      <Orbs />
      <ParticleField />
      <CursorLight />
    </div>
  );
}